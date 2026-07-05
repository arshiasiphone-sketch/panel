# Provision Engine — NAMA Website Builder

> ⚠️ **Audited with findings**. See `15-technical-debt.md` for identified issues.

## Architecture

The Provision Engine generates complete customer websites from **Blueprint Definitions** (pure data structures).

```
ProvisionService (public API facade)
    ↓
ProvisionEngine (pipeline orchestrator)
    ↓
Pipeline Steps (15 ordered steps)
    ├── ProvisionValidator (pre-flight checks)
    ├── BlueprintInstaller (blueprint → workspace)
    ├── ProvisionSeeder (initial data)
    ├── ProvisionHealthChecker (post-install verification)
    ├── ProvisionTransactionManager (state tracking)
    ├── ProvisionRollback (failure recovery)
    └── ProvisionReportGenerator (reporting)
    ↓
Blueprint Subsystem
    ├── BlueprintRegistry (storage + indexing)
    ├── BlueprintLoader (loading + caching)
    └── BlueprintVersioning (semver management)
```

---

## Blueprint Data Format

Blueprints are stored in `site_content` with key `blueprint:{slug}:{version}`.

```ts
interface Blueprint {
  id: string;              // Unique ID
  slug: string;            // URL-friendly (e.g., "cafe")
  version: string;         // Semver (e.g., "1.0.0")
  name: string;            // Display name (e.g., "Café")
  description: string;
  category: string;        // Business type (e.g., "cafe", "restaurant")
  pages: BlueprintPage[];  // Page definitions
  blocks: BlueprintBlockDefinition[];  // Block content
  theme: BlueprintTheme;   // Theme preset + overrides
  navigation: BlueprintNavigationEntry[];
  fonts: BlueprintFontConfig;
  seo: BlueprintSEOConfig;
  analytics: BlueprintAnalyticsConfig;
  menus: BlueprintMenuItemEntry[];
  gallery: BlueprintGalleryEntry[];
  businessSettings: Record<string, unknown>;
  personalitySettings: BlueprintPersonalityEntry[];
  mediaFolderStructure: BlueprintMediaFolder[];
  permissions: BlueprintPermissions;
  metadata: BlueprintMetadata;
}
```

---

## Execution Flow (State Machine)

```
VALIDATE_REQUEST → CREATE_WORKSPACE → ASSIGN_OWNER → ASSIGN_PLAN
    → INSTALL_BLUEPRINT → CREATE_PAGES → CREATE_NAVIGATION
    → INSERT_BLOCKS → INSERT_CMS_DATA → INSERT_THEME → INSERT_FONTS
    → INSERT_DEFAULT_MEDIA → INSERT_ANALYTICS_DEFAULTS
    → RUN_HEALTH_CHECK → WORKSPACE_READY
```

### State: `ProvisionTransaction`
```
pending → in_progress → completed (success)
                       → failed → rolling_back → rolled_back
                       → failed (rollback failed)
```

---

## Transaction Flow

1. **Begin**: Creates `ProvisionTransaction` with `status: "pending"`
2. **Execute**: Each step records its result via `recordStep()`
3. **Retry**: Failed steps may be retried (if retryable + transient error)
4. **Complete**: On success, status → `completed`
5. **Rollback**: On failure, status → `rolling_back` → `rolled_back`

Transactions are stored in `site_content` with key `provision:tx:{txId}`.

---

## Rollback Flow

On failure:
1. Transaction marked `rolling_back`
2. Completed steps are reversed in **reverse order**
3. Each step type has specific undo logic
4. If rollback succeeds → `rolled_back`
5. If rollback fails → `failed` (data may be partially orphaned)

**⚠️ CRITICAL ISSUE**: Rollback methods delete ALL data from tables regardless of workspace. See audit findings.

---

## Retry Flow

| Aspect | Detail |
|--------|--------|
| **Retryable Steps** | All executable steps (CREATE_WORKSPACE, INSTALL_BLUEPRINT, CREATE_PAGES, etc.) |
| **Non-Retryable Steps** | VALIDATE_REQUEST, ASSIGN_OWNER, ASSIGN_PLAN |
| **Max Retries** | 3 (configurable) |
| **Backoff** | Exponential: 1s → 2s → 4s (base 1s, factor 2, max 10s) |
| **Transient Detection** | Error message matching (timeout, network, 502, 503, etc.) |
| **Retry Limitation** | Only checks if error message contains transient patterns |

---

## Blueprint Flow

1. **Registry** stores blueprint definitions + maintains an index (for listing)
2. **Loader** provides load-by-slug, load-by-version, load-latest, exists check
3. **Versioning** manages semantic versioning (major.minor.patch)
4. **Installer** reads blueprint DATA and installs into workspace via direct DB calls

---

## Workspace Creation Flow

1. `ProvisionEngine._createWorkspace()`:
   - Calls `createWorkspace()` from `WorkspaceFactory` (NOT `WorkspaceService`)
   - Saves via `WorkspaceRepository.save()`
2. After pipeline completes:
   - `_finalizeWorkspace()`: Sets status from `provisioning` → `active`
3. On failure:
   - `_handleFailure()`: Calls rollback, which deletes workspace entity

---

## Idempotency

The Blueprint Installer maintains a **provision log** per workspace+blueprint+version:
```
provision:log:{workspaceId}:{slug}:{version}
```
Tracked entity types: `pages`, `blocks`, `navigation`, `menus`, `gallery`, `personalities`, `cms_data`, `theme`, `seo`, `analytics`

**Known issue**: Block idempotency uses `JSON.stringify` for dedup (order-dependent, flagged in EPIC 3.7 as H5).

---

## Atomicity

The system does NOT use database transactions (no BEGIN/COMMIT). Atomicity is achieved through the **rollback mechanism** — if any step fails, previous steps are reversed. This is eventual consistency, not true atomicity.

---

## Pipeline Step Implementation Details

| Step | Actual Work Done | Notes |
|------|------------------|-------|
| `validate_request` | Validates input, checks blueprint existence | No side effects |
| `create_workspace` | Creates workspace entity in `site_content` | Via factory + repository |
| `assign_owner` | No-op (owner set during workspace creation) | Redundant step |
| `assign_plan` | No-op (plan set during workspace creation) | Redundant step |
| `install_blueprint` | Installs pages, blocks, navigation, menus, gallery, personalities, CMS data, theme, SEO, analytics | Main work happens here |
| `create_pages` | Returns count (no actual work) | Actual work done in install_blueprint |
| `create_navigation` | Returns count (no actual work) | Actual work done in install_blueprint |
| `insert_blocks` | Returns count (no actual work) | Actual work done in install_blueprint |
| `insert_cms_data` | Returns boolean (no actual work) | Actual work done in install_blueprint |
| `insert_theme` | Inserts theme_settings row (hardcoded id=1) | Duplicates installer logic |
| `insert_fonts` | Inserts fonts_config in site_content | Duplicates seeder logic |
| `insert_default_media` | Seeds media folders via Seeder | Actual work via ProvisionSeeder |
| `insert_analytics_defaults` | Returns boolean (no actual work) | Actual work done in install_blueprint |
| `run_health_check` | Verifies all components installed | Post-install verification |
| `workspace_ready` | Transitions workspace to active | Final activation |

**Issue**: Many pipeline steps are redundant — the actual work is concentrated in `install_blueprint`. The pipeline has 15 steps but ~6 are effectively no-ops.
