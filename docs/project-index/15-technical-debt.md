# Technical Debt — NAMA Website Builder

## Overview

This file catalogs all known technical debt across the project, including issues from EPIC 3.7 (Runtime Audit), EPIC 4A/4B (this audit), and general codebase observations.

---

## 🔴 Critical Issues

### CRIT-1: Rollback deletes ALL data without workspace filtering

| Field | Value |
|-------|-------|
| **Files** | `src/lib/core/provision/rollback.ts` |
| **Functions** | `_revertCreatePages()`, `_revertInsertMedia()` |
| **Root Cause** | `_revertCreatePages` does `.delete().neq("id", "")` on `page_blocks` — deletes ALL rows. `_revertInsertMedia` does the same on `media_files`. In multi-tenant mode, this would destroy data from ALL workspaces. |
| **Impact** | 🔴 Critical — Could destroy all page blocks and media across all workspaces |
| **Fix** | Add workspace filtering to all rollback delete operations |
| **Priority** | P0 — Fix before multi-tenant activation |

### CRIT-2: Supabase client throws at first access when env vars missing

| Field | Value |
|-------|-------|
| **File** | `src/integrations/supabase/client.ts` (line 39-46) |
| **Impact** | 🔴 Critical — App crashes completely with no fallback UI |
| **Priority** | P0 — Already documented in EPIC 3.7 C2 |

### CRIT-3: Service role key could be exposed to client bundle

| Field | Value |
|-------|-------|
| **File** | `src/integrations/supabase/client.server.ts` (line 39) |
| **Impact** | 🔴 Critical — Full database access could be leaked |
| **Priority** | P0 — Already documented in EPIC 3.7 C3 |

---

## 🟠 High Issues

### HIGH-1: Navigation rollback deletes without workspace scope

| Field | Value |
|-------|-------|
| **File** | `src/lib/core/provision/rollback.ts` |
| **Function** | `_revertCreateNavigation()` |
| **Root Cause** | Deletes `key = "navigation"` from `site_content` without workspace context |
| **Impact** | 🟠 High — In multi-tenant mode, deletes all workspaces' navigation |
| **Fix** | Store navigation key with workspace ID prefix |
| **Priority** | P1 |

### HIGH-2: CMS data rollback deletes hardcoded keys

| Field | Value |
|-------|-------|
| **File** | `src/lib/core/provision/rollback.ts` |
| **Function** | `_revertInsertCMSData()` |
| **Root Cause** | Deletes hardcoded keys (`business_settings`, `seo_settings`, `seo_defaults`, `analytics_config`) without workspace context |
| **Impact** | 🟠 High — Cross-workspace data corruption |
| **Fix** | Add workspace ID prefix to all CMS data keys, or add workspace_id column |
| **Priority** | P1 |

### HIGH-3: Theme rollback and install use hardcoded ID 1

| Field | Value |
|-------|-------|
| **Files** | `src/lib/core/provision/rollback.ts` (`_revertInsertTheme`), `src/lib/core/provision/engine.ts` (`_installTheme`), `src/lib/core/provision/blueprint/installer.ts` (`_installTheme`) |
| **Root Cause** | Multiple components reference `theme_settings` with `eq("id", 1)` — single-row pattern |
| **Impact** | 🟠 High — NOT multi-tenant compatible. All workspaces share a single theme |
| **Fix** | Add `workspace_id` to `theme_settings` and remove `id=1` pattern |
| **Priority** | P1 |

### HIGH-4: BlueprintInstaller bypasses all repositories

| Field | Value |
|-------|-------|
| **File** | `src/lib/core/provision/blueprint/installer.ts` |
| **Root Cause** | Makes direct `this.db.from("page_blocks")`, `this.db.from("menu_items")`, etc. calls instead of using PagesRepository, MenuRepository, etc. |
| **Impact** | 🟠 High — Duplicates logic, bypasses validation, error normalization, and workspace context that repositories provide |
| **Fix** | Inject and use existing repositories instead of direct DB calls |
| **Priority** | P1 |

### HIGH-5: Auth middleware throws generic Error instead of 401

| Field | Value |
|-------|-------|
| **File** | `src/integrations/supabase/auth-middleware.ts` (line 38-78) |
| **Impact** | 🟠 High — Auth failures appear as 500 errors |
| **Priority** | P1 — Already documented in EPIC 3.7 H3 |

### HIGH-6: Missing `.env.example` + `.gitignore`

| Field | Value |
|-------|-------|
| **Files** | Root level (MISSING) |
| **Impact** | 🟠 High — New developers/CI crash on first run, secrets could be committed |
| **Priority** | P1 — Already documented in EPIC 3.7 H1/H2 |

---

## 🟡 Medium Issues

### MED-1: `JSON.stringify` for block dedup (order-dependent)

| Field | Value |
|-------|-------|
| **File** | `src/lib/core/provision/blueprint/installer.ts` (`_blockExists`) |
| **Root Cause** | Uses `JSON.stringify` for block deduplication, which is order-dependent |
| **Impact** | 🟡 Medium — Running provision twice could duplicate blocks |
| **Priority** | P2 — Already documented in EPIC 3.7 H5 |

### MED-2: `ProvisionEngine` has duplicate logic with Seeder

| Field | Value |
|-------|-------|
| **File** | `src/lib/core/provision/engine.ts` (`_installFonts`, `_installTheme`) |
| **Root Cause** | `_installFonts` duplicates `ProvisionSeeder._seedFonts`; `_installTheme` duplicates `BlueprintInstaller._installTheme` |
| **Impact** | 🟡 Medium — Logic duplication increases maintenance burden and risk of drift |
| **Fix** | Remove duplicate methods from engine, delegate to Seeder and Installer |
| **Priority** | P2 |

### MED-3: Pipeline has redundant no-op steps

| Field | Value |
|-------|-------|
| **File** | `src/lib/core/provision/engine.ts` |
| **Root Cause** | Steps `assign_owner`, `assign_plan`, `create_pages`, `create_navigation`, `insert_blocks`, `insert_cms_data`, `insert_analytics_defaults` are effectively no-ops (return counts without doing work) |
| **Impact** | 🟡 Medium — Confusing pipeline, extra transaction logging noise |
| **Fix** | Consolidate pipeline into fewer meaningful steps, or add actual logic to no-ops |
| **Priority** | P2 |

### MED-4: `analytics.functions.ts` creates new Supabase admin client per call

| Field | Value |
|-------|-------|
| **File** | `src/lib/analytics.functions.ts` |
| **Impact** | 🟡 Medium — Increased cold start time and connection churn |
| **Priority** | P2 — Already documented in EPIC 3.7 H4 |

### MED-5: N+1 query risk in analytics repository fallbacks

| Field | Value |
|-------|-------|
| **File** | `src/lib/repositories/analytics.ts` |
| **Impact** | 🟡 Medium — Fetches ALL rows without pagination |
| **Priority** | P2 — Already documented in EPIC 3.7 M2 |

### MED-6: `WorkspaceRepository.listAll()` no pagination

| Field | Value |
|-------|-------|
| **File** | `src/lib/core/workspace/repository.ts` |
| **Impact** | 🟡 Medium — Will fail under load with many workspaces |
| **Priority** | P2 |

### MED-7: `CurrentWorkspaceProvider` creates duplicate repository and provider instances

| Field | Value |
|-------|-------|
| **File** | `src/lib/core/workspace/context.tsx` |
| **Root Cause** | Creates `new WorkspaceRepository({...providers, logger})` instead of using `getRepositories()` |
| **Impact** | 🟡 Medium — Two instances of providers and workspace repository exist at runtime |
| **Fix** | Use the factory's `getRepositories()` instead of creating a new instance |
| **Priority** | P2 |

### MED-8: Empty catch blocks swallow errors

| Field | Value |
|-------|-------|
| **Files** | `src/lib/cms.ts:478`, `src/lib/lazy.tsx:87` |
| **Impact** | 🟡 Medium — Silent failures |
| **Priority** | P2 — Already documented in EPIC 3.7 M1 |

---

## 🔵 Low Issues

| ID | File | Issue | Priority |
|----|------|-------|----------|
| LOW-1 | `src/lib/core/provision/blueprint/registry.ts` | `slugFromKey` and `versionFromKey` are dead code (never used) | P3 |
| LOW-2 | `src/lib/core/provision/blueprint/registry.ts:8` | `createId` imported but never used | P3 |
| LOW-3 | `src/components/ui/orb-background.tsx:69` | `window.matchMedia` called during render (not inside effect) | P3 |
| LOW-4 | `src/lib/core/workspace.ts` | Legacy compatibility layer — deprecated code still present | P3 |
| LOW-5 | `src/lib/core/workspace/repository.ts` | `Plan limits` are TypeScript constants, not DB data | P3 |
| LOW-6 | `src/lib/core/provision/engine.ts:365` | `_createWorkspace` uses factory directly, bypassing `WorkspaceService` | P3 |
| LOW-7 | `src/lib/service-worker.ts` | No versioning strategy — updates may not be detected | P3 |
| LOW-8 | `src/lib/core/workspace/repository.ts` | `listAll()` fetches ALL workspaces with no pagination | P3 |

---

## Architecture Observations

| Observation | Details |
|-------------|---------|
| **Provision Engine bypasses service layer** | Engine imports factory directly instead of using `WorkspaceService.create()` |
| **Provider bypass by provision components** | Installer, Rollback, HealthChecker, Seeder all bypass repository layer |
| **Theme uses non-scalable pattern** | Single-row `id=1` is incompatible with multi-tenancy |
| **No database-level transactions** | Atomicity relies on rollback mechanism, not DB transactions |
| **Blueprint data model is monolithic** | `Blueprint` interface has 20+ fields — consider splitting into partial blueprints |
| **No event system** | Workspace and provision events are not emitted — no hooks for email, webhook, audit |
| **No caching layer** | No Redis or in-memory cache — every request hits the database |
| **No rate limiting integration** | Rate limiting migration exists but is not connected to code |

---

## Suggested Epic Prioritization

| Epic | Description | Priority |
|------|-------------|----------|
| **EPIC 5** | Workspace isolation (workspace_id columns + filtering) | Highest |
| **EPIC 6** | Provision Engine fixes (rollback isolation, repository bypass) | Highest |
| **EPIC 5.5** | Theme multi-tenancy (remove `id=1` pattern) | High |
| **EPIC 6.5** | Remove pipeline no-op steps | Medium |
| **EPIC 7** | Multi-tenant activation UI | Medium |
| **EPIC 2.5** | Admin blueprint management UI | Medium |
| **EPIC 8** | Billing integration | Low |
| **EPIC 10** | Event system for workspace/provision events | Low |
