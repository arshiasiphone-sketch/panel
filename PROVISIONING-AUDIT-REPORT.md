# Provisioning & Workspace Architecture — Full Audit Report

**Date:** 2026-07-08  
**Scope:** Multi-workspace provisioning pipeline, workspace resolution, migration integrity

---

## Question 1: `workspaces` table still in migrations? Where is it used?

### Answer: YES — the `workspaces` table is actively used throughout the codebase.

**Migration location:** `supabase/migrations/20260707000001_create_workspaces_table.sql`

```sql
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY,
  domain TEXT UNIQUE,
  subdomain TEXT UNIQUE,
  owner_user_id UUID REFERENCES auth.users(id),
  status workspace_status NOT NULL DEFAULT 'provisioning',
  limits JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_workspaces_domain ON workspaces(domain);
CREATE INDEX idx_workspaces_subdomain ON workspaces(subdomain);
CREATE INDEX idx_workspaces_owner ON workspaces(owner_user_id);
```

**Usage locations:**

| File | Purpose |
|------|---------|
| `src/lib/core/workspace/types.ts` | Entity definitions: `WorkspaceEntity`, `WorkspaceContext`, limits, roles |
| `src/lib/core/workspace/repository.ts` | Full CRUD: `findById`, `findByDomain`, `findBySubdomain`, `save`, `delete`, `listAll`, `findByUserId`, `getOrCreateDefault`, `ensureDefault` |
| `src/lib/core/workspace/context.tsx` | React context provider — resolves workspace via domain/subdomain/path-based strategies |
| `src/lib/core/workspace/resolver.ts` | Resolution logic: path params → subdomain → full domain → user membership |
| `src/lib/core/workspace/limits.ts` | Plan enforcement: pageLimit, blockLimit, menuItemsLimit, storageGb, etc. |
| `src/lib/core/workspace/entity.ts` | Role checking: `isAdmin()`, `isOwner()`, `hasRole()` |
| `src/lib/repositories/factory.ts` | `setWorkspaceOnRepositories()` — sets workspaceId on all repositories |
| `supabase/migrations/20260707000003_add_workspace_id_to_tables.sql` | Every app table has `workspace_id UUID REFERENCES workspaces(id)` foreign key |

**Key insight:** The `workspaces` table is the **single source of truth** for multi-tenant isolation. All application data tables have a `workspace_id` column, and the workspace entity carries:
- `status`: "provisioning" → "active" → ("suspended" | "deleted")
- `limits`: JSONB envelope enforcing plan-based quotas
- `metadata`: free-form store for domain, createdAt, updatedAt

---

## Question 2: `theme_settings` primary key changed from just `preset_id` to `(preset_id, workspace_id)` — why? What was the issue with the old one?

### Answer: The change enables **one theme preset per workspace** instead of a global singleton.

**Old schema:**
```sql
CREATE TABLE theme_settings (
  preset_id UUID PRIMARY KEY REFERENCES themes(id),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ ...
);
```

**Problem:** If two workspaces both used the "modern" theme preset, they would both reference the same `preset_id`. The first workspace to save its theme customizations would overwrite the second's settings since `preset_id` was the sole PK.

**New schema (migration 20260707000002):**
```sql
CREATE TABLE theme_settings (
  preset_id UUID REFERENCES themes(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}',
  PRIMARY KEY (preset_id, workspace_id)
);
```

**Impact:**
- Each workspace can have its own `settings` override for the same theme preset
- The composite PK means: "workspace A uses theme X with settings Y" is unique per workspace
- This enables: Workspace A customizes primaryColor to #ff0000 while Workspace B keeps it at #007bff

**Files that reference this schema:**
- `src/lib/repositories/theme.ts`: Repository queries by `preset_id` AND `workspace_id`
- Blueprint installer (`src/lib/core/provision/blueprint/installer.ts`): Inserts theme with both IDs during provisioning

---

## Question 3: Does `provisionRequestSchema` (validation.ts) contain `requestedSlug`, `externalOrderId`, `customerEmail`, or `businessName`?

### Answer: NO. The schema does NOT contain these fields.

**Actual `provisionRequestSchema` (from `src/lib/core/provision/validation.ts`):**
```typescript
export const provisionRequestSchema = z.object({
  blueprintSlug: z.string().min(1, "Blueprint slug is required"),
  blueprintVersion: z.string().optional(),
  workspaceName: z.string().min(1).max(200).optional(),
  workspaceDescription: z.string().max(2000).optional(),
  domain: z.string().min(1).max(253).optional(),
  ownerUserId: z.string().min(1, "Owner user ID is required"),
  plan: workspacePlanSchema.optional().default("free"),
  locale: z.string().min(2).max(10).optional().default("fa-IR"),
  timezone: z.string().min(1).max(50).optional().default("Asia/Tehran"),
  metadata: z.record(z.unknown()).optional(),
});
```

**Fields that do NOT exist:**
| Field | Status |
|-------|--------|
| `requestedSlug` | ❌ Not present. Instead there's `domain` (for custom domains) and blueprint defines workspace slugs |
| `externalOrderId` | ❌ Not present. No payment/Stripe integration in the provision pipeline |
| `customerEmail` | ❌ Not present. No email field — user identity is via `ownerUserId` |
| `businessName` | ❌ Not present. Instead there's `workspaceName` (optional) |

**Implication:** If any API endpoint or client sends these missing fields, they will be silently dropped by the Zod schema. The form in `src/routes/provision.tsx` does NOT send these fields either — it sends `blueprintSlug`, `workspaceName`, `slug`, `theme`, `email`, `phone`.

---

## Question 4: What is `src/routes/provision.tsx`? Is it a page, an API endpoint, or something else? How does it relate to `/api/provision`?

### Answer: It is a **public provisioning page** (React component), NOT an API endpoint.

**What it is:**
- A multi-step wizard form at route `/provision` (TanStack Router)
- Step 1: Site details — name, URL slug (.namaplatform.com subdomain), blueprint selection
- Step 2: Customization — theme style, language, currency, phone number
- Step 3: Account setup — email, terms acceptance
- On submit → sends POST to `/api/provision`

**What it calls:**
```typescript
const response = await fetch("/api/provision", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    blueprintSlug: formData.blueprintSlug,
    workspaceName: formData.displayName || "My Site",
    slug: formData.slug,
    theme: formData.themeName,
    email: formData.email,
    phone: formData.phone,
  }),
});
```

**Important note:** The form sends `slug`, `theme`, `email`, `phone` — but the Zod schema expects `blueprintSlug`, `ownerUserId`, `plan`, `locale`, `timezone`. This means the form data is **NOT validated against the provisioning pipeline's schema**. The `/api/provision` endpoint must map these fields, or the request will fail silently/differently.

**Relationship:**
```
Browser → /provision (page) → User fills form → POST /api/provision → Provisioning API → Provisioning Pipeline
```

---

## Question 5: What is the role of `provision_transactions` and `provision_steps`? How do they relate to `ProvisionResourceMap`?

### Answer: They are **audit trail + state machine** for the provisioning pipeline.

**`provision_transactions` table:**
```sql
CREATE TABLE provision_transactions (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  blueprint_id VARCHAR(255) NOT NULL,
  blueprint_version VARCHAR(50) NOT NULL,
  status provisioning_status NOT NULL DEFAULT 'pending',
  initiated_by UUID NOT NULL,
  steps_jsonb JSONB NOT NULL DEFAULT '[]',
  current_step_index INT NOT NULL DEFAULT 0,
  retry_count INT NOT NULL DEFAULT 0,
  max_retries INT NOT NULL DEFAULT 3,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error TEXT
);
```

**`provision_steps` table:**
```sql
CREATE TABLE provision_steps (
  id BIGSERIAL PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES provision_transactions(id) ON DELETE CASCADE,
  step_name provisioning_step_type NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  duration_ms BIGINT,
  output_jsonb JSONB,
  error TEXT
);
```

**Valid step types (from `provisionStepValues` in validation.ts):**
```typescript
const provisionStepValues = [
  "validate_request",
  "create_workspace",
  "install_blueprint",
  "seed_data",
  "insert_theme",
  "insert_fonts",
  "insert_default_media",
  "insert_analytics_defaults",
  "run_health_check",
  "workspace_ready",
] as const;
```

### ProvisionResourceMap relationship:

**Definition (from `src/lib/core/provision/session-context.ts`):**
```typescript
export interface ProvisionResourceMap {
  workspaceId: string;
  sessionKey: string;
  workspaceReady: boolean;
  themeInstalled: boolean;
  pageBlockIds: string[];        // All created page blocks
  siteContentKeys: string[];     // Site content entries (pages, navigation)
  menuItemIds: string[];         // Menu items by category
  galleryImageIds: string[];     // Gallery images
  personalityKeys: string[];     // Personality profiles
  mediaFileIds: string[];        // Uploaded media files
}
```

**How they work together:**

1. **provision_transactions** tracks the high-level lifecycle: pending → in_progress → completed/failed/rolling_back
2. **provision_steps** records each individual step with timing, output, and error details (for audit/debugging)
3. **ProvisionResourceMap** is an **in-memory tracking object** created per provisioning session that tracks exactly what resources were created during `install_blueprint` and `seed_data` steps
4. **Rollback uses ProvisionResourceMap**: When a step fails, `_revertStep()` in `rollback.ts` receives the resource map to know exactly which entities to delete, scoped to `workspace_id`:

```typescript
private async _revertSiteContentKeys(resourceMap?: ProvisionResourceMap): Promise<void> {
  if (!resourceMap?.siteContentKeys || resourceMap.siteContentKeys.length === 0) return;
  // Delete only these keys for this workspace — never touches other workspaces
}
```

**Key architectural principle:** `provision_transactions` + `provision_steps` are the **persistent audit trail** (queried for status/history), while `ProvisionResourceMap` is the **ephemeral in-memory map** used during execution for safe rollback. The transaction table's `steps_jsonb` column stores step results as JSONB, providing a self-contained history without needing to query the separate `provision_steps` table.

---

## Question 6: Why are there no pauses between provisioning phases? Is this intentional?

### Answer: This is **intentional** — confirmed by reading the actual engine source.

**Actual pipeline flow (from `src/lib/core/provision/engine.ts`, lines 135-144):**
```typescript
private async _executePipeline(blueprint: Blueprint, session: ProvisionSession): Promise<void> {
  for (const step of PROVISION_PIPELINE) {
    const command = this.deps.stepRegistry.get(step);
    if (!command) {
      throw new Error(`No command registered for step: ${step}`);
    }

    await this._executeStepWithRetry(command, blueprint, session);
  }
}
```

**The pipeline steps (from `types.ts`, lines 273-284):**
```typescript
export const PROVISION_PIPELINE: readonly ProvisionStep[] = [
  ProvisionStep.VALIDATE_REQUEST,
  ProvisionStep.CREATE_WORKSPACE,
  ProvisionStep.INSTALL_BLUEPRINT,
  ProvisionStep.SEED_DATA,
  ProvisionStep.INSERT_THEME,
  ProvisionStep.INSERT_FONTS,
  ProvisionStep.INSERT_DEFAULT_MEDIA,
  ProvisionStep.INSERT_ANALYTICS_DEFAULTS,
  ProvisionStep.RUN_HEALTH_CHECK,
  ProvisionStep.WORKSPACE_READY,
];
```

**Why there are NO pauses:**
1. **Atomicity**: Provisioning is designed as an atomic operation — either the entire workspace is set up correctly, or it fails and rolls back entirely
2. **Performance**: No unnecessary delays in the happy path
3. **Simplicity**: A pipeline without inter-step coordination has fewer failure modes

**Potential problems with no pauses:**

| Issue | Impact |
|-------|--------|
| Rate limiting | Supabase RLS + DB writes happen back-to-back; high volume could trigger rate limits |
| Resource exhaustion | Creating 50+ page blocks in a tight loop without throttling |
| No progress feedback | Users see no progress during provisioning — only final result |
| No external service sync | If any step calls an external API (email, CDN), no retry/backoff between attempts |

**Mitigations in place:**
- **Per-step retry with backoff**: `_executeStepWithRetry()` in `engine.ts` (line 150) retries each step independently using the command's `retryPolicy`. Delay is calculated via `getRetryDelayMs()` (lines 201-223).
- **Atomic rollback on failure**: When a step exhausts its retries, `_rollbackCompletedSteps()` in `engine.ts` (line 257) rolls back ALL previously completed steps in reverse order using each command's `rollback()` method — no partial data is left behind
- **Idempotent operations**: Repository-level existence checks prevent duplicate data if a step retries

**Recommendation:** If provisioning external services or large datasets becomes slow, consider adding:
1. `await sleep(500)` between major phases (workspace creation → blueprint install → seed data)
2. Per-step retry with exponential backoff is already implemented in `_executeStepWithRetry()`
3. Progress reporting via server-sent events or WebSocket push

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PROVISIONING PIPELINE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Browser Form                      Engine Layer                      │
│  /provision  ───────►  /api/provision  ───────►  ProvisionEngine     │
│  (multi-step)         (POST handler)        (src/lib/core/provision/ │
│                                      engine.ts)                     │
│                                                    │                 │
│                              ┌─────────────────────┼──────────┐    │
│                              ▼                     ▼          ▼    │
│                       validate_request    create_workspace  ...     │
│                                                  │                   │
│                                  ┌───────────────┴───────────┐      │
│                                  ▼                             ▼      │
│                           provision_transactions        Provision   │
│                           (audit trail)              ResourceMap      │
│                                  │                        (memory)    │
│                                  ▼                             ▲      │
│                           provision_steps                    │       │
│                        (step details)   ◄──── rollback.ts    │       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Pipeline: validate → create_workspace → install_blueprint →        │
│            seed_data → insert_theme → insert_fonts →                  │
│            insert_default_media → insert_analytics_defaults →         │
│            run_health_check → workspace_ready                         │
│                                                                     │
│  Each step has: execute() + rollback() via Command Pattern           │
│  Each step retries independently (per RetryPolicy) before failure    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       WORKSPACE RESOLUTION                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Priority 1: Route params (/cafe/<workspace-id>)                    │
│  Priority 2: Subdomain (mycafe.namaplatform.com)                     │
│  Priority 3: Full domain (mycafe.com → CNAME)                       │
│  Priority 4: User membership (auth-based)                           │
│                                                                     │
│  Resolution → WorkspaceContext → setWorkspaceOnRepositories()       │
│               → All repos inherit workspace_id                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     DATABASE SCHEMA (Multi-tenant)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  workspaces ───┐                                                    │
│                 ├──< all app tables (workspace_id FK)                │
│  themes        │                                                    │
│  theme_settings(preset_id, workspace_id) PK composite               │
│  provision_transactions                                             │
│  provision_steps                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Files Referenced

| Category | File Path |
|----------|-----------|
| **Migrations** | `supabase/migrations/20260707000001_create_workspaces_table.sql` |
| | `supabase/migrations/20260707000002_theme_workspace_pk.sql` |
| | `supabase/migrations/20260707000003_add_workspace_id_to_tables.sql` |
| | `supabase/migrations/20260707000004_create_provisioning_tables.sql` |
| | `supabase/all-migrations-combined.sql` |
| **Workspace Domain** | `src/lib/core/workspace/types.ts` |
| | `src/lib/core/workspace/repository.ts` |
| | `src/lib/core/workspace/context.tsx` |
| | `src/lib/core/workspace/resolver.ts` |
| | `src/lib/core/workspace/limits.ts` |
| | `src/lib/core/workspace/entity.ts` |
| | `src/lib/core/workspace/validation.ts` |
| **Provision Domain** | `src/lib/core/provision/engine.ts` (actual pipeline) |
| | `src/lib/core/provision/types.ts` (PROVISION_PIPELINE, ProvisionStep enum) |
| | `src/lib/core/provision/validation.ts` |
| | `src/lib/core/provision/session-context.ts` |
| | `src/lib/core/provision/rollback.ts` |
| | `src/lib/core/provision/seeder.ts` |
| | `src/lib/core/provision/blueprint/installer.ts` |
| | `src/lib/core/provision/blueprints/cafeteria-blueprint.ts` |
| | `src/lib/core/workspace/factory.ts` |
| **Repositories** | `src/lib/repositories/base.ts` |
| | `src/lib/repositories/factory.ts` |
| | `src/lib/repositories/theme.ts` |
| | `src/lib/repositories/pages.ts` |
| | `src/lib/repositories/menu.ts` |
| | `src/lib/repositories/gallery.ts` |
| **Routes** | `src/routes/provision.tsx` (public provisioning page) |

---

## Key Findings

1. **No email/payment fields in schema** — Provisioning is self-serve with no payment gateway or email verification
2. **Composite theme PK is correct** — Prevents cross-workspace theme setting collisions
3. **Form data mismatch** — `src/routes/provision.tsx` sends different fields than what `provisionRequestSchema` expects; the `/api/provision` endpoint must handle this mapping
4. **No inter-step pauses** — Intentional for atomicity, but may need throttling at scale
5. **ProvisionResourceMap is in-memory only** — Survives within a request but not across retries/restarts; persistent state lives in `provision_transactions.steps_jsonb`
6. **Workspace resolution is multi-strategy** — Handles both hosted (subdomain) and self-hosted (CNAME) multi-tenant models
7. **Command Pattern with per-step retry** — Each pipeline step has its own `execute()` + `rollback()` method and configurable `RetryPolicy` (verified in `engine.ts`)