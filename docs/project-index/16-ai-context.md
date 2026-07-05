# AI Context — NAMA Website Builder

> This is the **single most important file** in the Project Intelligence Index.
> An AI agent should read ONLY this file to understand 90–95% of the project.
> All other files in this directory provide deeper detail on specific areas.

---

## 1. Architecture Summary

```
User → Auth → [Workspace Context] → Repositories → [Provider Interface] → Supabase
                                            ↑                    ↑
                                      (8 domain repos)    (4 provider abstractions)

Provision Engine: Request → Validate → Create Workspace → Install Blueprint → Health Check → Ready
Blueprint Subsystem: Registry → Loader → Installer (blueprints are pure DATA, not React)
Theme Engine: Settings → Derive → CSS Variables (--nama-*) → Components
```

### Key Principles
- **Workspace-centric**: All data flows through workspace context (architecture-ready, currently single-tenant)
- **Provider abstraction**: Supabase wrapped behind interfaces (IDatabaseProvider, IStorageProvider, IAuthProvider, IRealtimeProvider)
- **Blueprint-as-Data**: Blueprints are pure JSON, never React components
- **Incremental isolation**: Workspace_id columns not yet in data tables

---

## 2. Folder Summary

```
src/
├── integrations/supabase/     — Raw Supabase clients (client.ts, client.server.ts)
├── lib/
│   ├── core/workspace/        — EPIC 4A: Multi-tenant workspace domain (12 files)
│   ├── core/provision/        — EPIC 4B: Provision Engine (15 files + 4 blueprint files)
│   ├── repositories/          — Data access (13 files: base, factory, 11 domain repos)
│   ├── providers/supabase/    — Supabase provider implementations (5 files)
│   ├── interfaces/            — Provider contract interfaces (5 files)
│   ├── theme/                 — Theme engine (8 files)
│   └── (20+ utility files)    — CMS, analytics, stores, utils, schemas
├── routes/                    — TanStack Router routes (25+ files)
├── components/
│   ├── admin/                 — Admin panel (10 files)
│   ├── ui/                    — shadcn/ui primitives + custom (50+ files)
│   ├── landing/               — Landing page (1 large file)
│   └── test/                  — Test pages (1 file)
├── hooks/                     — use-mobile.tsx
├── styles.css                 — Global styles
├── router.tsx                 — Router initialization
├── server.ts                  — Server entry
└── start.ts                   — App bootstrap
supabase/
├── migrations/                — 10 migration files
├── functions/                 — Edge functions (track-visit)
└── config.toml                — Supabase config
docs/
└── project-index/             — THIS directory (17 files)
```

---

## 3. Critical Files

### Never modify without understanding workspace/provision architecture
| File | Why |
|------|-----|
| `src/lib/core/workspace/types.ts` | Core workspace interfaces — change cascades everywhere |
| `src/lib/core/workspace/repository.ts` | Workspace persistence — used by all provision components |
| `src/lib/core/provision/types.ts` | Blueprint + transaction type definitions |
| `src/lib/core/provision/engine.ts` | Pipeline orchestrator — coordinates 8+ sub-components |
| `src/lib/repositories/base.ts` | Base class for all repositories — workspace awareness, DI, validation |
| `src/lib/repositories/factory.ts` | Repository creation + singleton — circular dependency mitigation |
| `src/lib/providers/supabase/index.ts` | Provider factory — only place that imports supabase-js for DI |

### Extension points (safe to add to)
| File | Extension Pattern |
|------|-------------------|
| `src/lib/core/workspace/policies.ts` | Add new policy methods (canExport, canTransfer, etc.) |
| `src/lib/core/workspace/validation.ts` | Add new Zod schemas for new operations |
| `src/lib/core/provision/blueprint/registry.ts` | Register new blueprints |
| `src/lib/interfaces/database.ts` | Add new query methods to ITableQuery |
| `src/lib/repositories/factory.ts` | Add new repositories to the factory |
| `src/lib/providers/supabase/index.ts` | Add new provider implementations |

---

## 4. Important Classes

### BaseRepository (`src/lib/repositories/base.ts`)
```ts
abstract class BaseRepository {
  protected db: IDatabaseProvider
  protected storage: IStorageProvider
  protected auth: IAuthProvider
  protected realtime: IRealtimeProvider
  protected logger: ILogger
  protected workspace: WorkspaceContext

  setWorkspace(ctx): void              // Workspace context injection
  validateOrThrow(schema, data, target) // Zod validation
  normalizeError(table, op, err, ctx?)  // Error wrapping
  applyPagination(query, opts)          // Pagination helper
}
```

### WorkspaceRepository (`src/lib/core/workspace/repository.ts`)
```ts
class WorkspaceRepository extends BaseRepository {
  findById(id): WorkspaceEntity | null
  save(entity): void
  delete(id): void
  listAll(): WorkspaceEntity[]
  findByUserId(userId): WorkspaceEntity[]
  getOrCreateDefault(userId): WorkspaceEntity
}
```

### ProvisionEngine (`src/lib/core/provision/engine.ts`)
```ts
class ProvisionEngine {
  provision(input): ProvisionReport

  // Internal pipeline (15 steps)
  _executePipeline(tx, blueprint, request, validation)
  _executeStepWithRetry(tx, step, blueprint, request)  // Retry wrapper
  _executeStep(step, blueprint, request, workspaceId)   // Step dispatcher
  _createWorkspace(blueprint, request)                  // Factory → Repository
  _finalizeWorkspace(workspaceId)                        // provisioning → active
  _installTheme(blueprint)                               // Direct DB (bypasses ThemeRepository)
  _installFonts(blueprint)                               // Duplicates Seeder
  _handleFailure(tx, err)                                // Rollback coordinator
}
```

### BlueprintInstaller (`src/lib/core/provision/blueprint/installer.ts`)
```ts
class BlueprintInstaller extends BaseRepository {
  install(blueprint, workspaceId): InstallResults
  // Direct DB calls (bypasses all repositories):
  _installPages(pages, blockDefs)           → page_blocks (direct)
  _installBlocks(blockDefs)                  → page_blocks (direct)
  _installNavigation(nav)                    → site_content key "navigation"
  _installMenuItems(menus)                   → menu_items (direct)
  _installGallery(gallery)                   → gallery_images (direct)
  _installPersonalities(profiles)            → personality_profiles (direct)
  _installCMSData(blueprint)                 → site_content
  _installTheme(blueprint)                   → theme_settings (id=1 hardcoded)
  _installSEO(blueprint)                     → site_content
  _installAnalytics(blueprint)               → site_content
}
```

### WorkspaceService (`src/lib/core/workspace/service.ts`)
```ts
class WorkspaceService {
  getById(id), getForUser(userId), listAll()
  create(input), createAndActivate(input), update(id, input, userId?)
  activate(id), suspend(id), archive(id), restore(id), delete(id)
  addMember(id, input), removeMember(id, userId), updateMemberRole(id, input)
}
```

---

## 5. Dependency Graph

```
providers/ → (no internal deps, only @supabase/supabase-js)
interfaces/ → (no deps, pure types)

repositories/base → workspace/types.ts (direct, not barrel)
repositories/factory → workspace/repository.ts (direct, not barrel)

workspace/types → (no internal deps)
workspace/entity → types
workspace/validation → types
workspace/factory → types + lib/utils
workspace/policies → types + entity
workspace/repository → repositories/base + types + validation + factory
workspace/resolver → types + repository + factory
workspace/service → types + repository + factory + entity + policies + validation
workspace/health → types
workspace/context → types + repositories/factory (dynamic import) + providers/supabase + repository + resolver + health + entity
workspace/index → barrel (re-exports everything)

provision/types → workspace/types
provision/validation → provision/types + workspace/validation
provision/transaction → repositories/base + lib/utils + provision/types + validation
provision/rollback → repositories/base + provision/types + transaction
provision/retry → provision/types
provision/validator → repositories/base + provision/types + validation + blueprint/loader + workspace/repository
provision/seeder → repositories/base + provision/types
provision/health-checker → repositories/base + provision/types
provision/report → provision/types
provision/engine → provision/types + validation + blueprint/* + transaction + rollback + validator + seeder + health-checker + report + retry + workspace/factory + workspace/repository
provision/service → repositories/base + provision/* + workspace/repository
provision/blueprint/* → repositories/base + provision/validation + provision/types
```

### Circular Dependency Management

```
🔴 POTENTIAL CIRCLE: base.ts → workspace/index (barrel)
   FIX: base.ts imports from workspace/types.ts directly

🔴 POTENTIAL CIRCLE: workspace/context.tsx → repositories/factory.ts
   FIX: context.tsx uses dynamic import() for repositories/factory

🔴 POTENTIAL CIRCLE: repositories/factory.ts → workspace/index (barrel)
   FIX: factory.ts imports WorkspaceRepository from its file directly

🔴 POTENTIAL CIRCLE: repositories/index.ts → workspace/types
   FIX: index.ts does NOT re-export workspace types
```

---

## 6. Provider Graph

```
IDatabaseProvider (interface)
  └── SupabaseTableQuery (implementation via supabase.from())

IStorageProvider (interface)
  └── createSupabaseStorageProvider (supabase.storage.from())

IAuthProvider (interface)
  └── createSupabaseAuthProvider (supabase.auth.*)

IRealtimeProvider (interface)
  └── SupabaseChannelAdapter (supabase.channel())
```

---

## 7. Naming Conventions

| Convention | Example | Rule |
|-----------|---------|------|
| Files | `workspace.repository.ts`, `auth.provider.ts` | `{domain}.{layer}.ts` |
| Classes | `WorkspaceRepository`, `ProvisionEngine` | PascalCase |
| Interfaces | `IDatabaseProvider`, `IAuthProvider` | `I{Purpose}Provider` |
| Provider functions | `createSupabaseDatabaseProvider` | `create{Impl}{Layer}Provider` |
| Repository methods | `getAll()`, `getVisible()`, `upsert()`, `delete()` | CRUD verbs |
| Error classes | `RepositoryError`, `ValidationError`, `AuthError`, `StorageError` | `{Layer}Error` |
| CSS variables | `--nama-primary`, `--nama-glass-blur` | `--nama-{semantic-name}` |
| Storage keys | `workspace:{id}:entity`, `blueprint:{slug}:{version}` | `{domain}:{identifiers}` |
| Barrel files | `index.ts` | Re-exports from directory |
| Barrel type re-exports | `export type { ... }` | Use `type` keyword to avoid bundling |

---

## 8. Coding Standards

| Standard | Practice |
|----------|----------|
| **TypeScript** | Strict mode, explicit return types |
| **Imports** | Path aliases (`@/lib/...`), no relative `../..` imports from `src/` |
| **Error handling** | `catch (err)` → `normalizeError()` → typed error |
| **Validation** | Zod schemas at every repository boundary |
| **Async** | All DB calls return Promises |
| **State management** | TanStack Query for server state, React context for workspace |
| **Styling** | Tailwind CSS + CSS variables (`var(--nama-*)`) |
| **No any** | Never cast as `any` type |
| **No direct DB access** | Always through providers → repositories |

---

## 9. Completed Epics

| Epic | Key Outputs |
|------|-------------|
| **EPIC 1** | CMS hooks, site_content CRUD, menu/gallery/events/testimonials |
| **EPIC 2** | Admin shell, all CRUD routes, media library, auth middleware |
| **EPIC 3.7** | 21 findings (2C, 5H, 6M, 8L), all documented with fixes |
| **EPIC 3** | Lazy loading, bundle split, image/font/motion optimization |
| **EPIC 4A** | Workspace system: types, entity, factory, policies, repository, resolver, service, health, context |
| **EPIC 4B** | Provision Engine: types, validation, blueprint subsystem, engine, service, rollback, retry, seeder, health checker, report |

---

## 10. Pending Epics

| Epic | What's Needed | Key Files to Modify |
|------|---------------|---------------------|
| **EPIC 5** | Add `workspace_id` to ALL tables, update ALL repository queries | All repository files, migration files, rollback.ts |
| **EPIC 5.5** | Remove hardcoded `id=1` from theme, add `workspace_id` | `theme_settings` table, `ThemeRepository`, `BlueprintInstaller._installTheme`, `ProvisionEngine._installTheme`, `ProvisionRollback._revertInsertTheme` |
| **EPIC 6** | Fix rollback isolation, remove repository bypasses | `rollback.ts`, `blueprint/installer.ts`, inject repositories |
| **EPIC 7** | Workspace selection UI, admin workspace management | Admin routes, workspace context wiring |

---

## 11. Common Pitfalls

### Circular Dependencies
- Never import from `@/lib/core/workspace` barrel in `repositories/` files — import `workspace/types.ts` directly
- Never import from `@/lib/repositories` barrel in `workspace/` files — use dynamic `import()` in context.tsx
- Never import from `@/lib/repositories` barrel in `repositories/factory.ts` — import `WorkspaceRepository` from its file directly

### Rollback Data Destruction
- All rollback methods in `rollback.ts` lack workspace filtering
- `_revertCreatePages()` deletes ALL `page_blocks`
- `_revertInsertMedia()` deletes ALL `media_files`
- `_revertCreateNavigation()` deletes global "navigation" key
- These WILL destroy cross-workspace data in multi-tenant mode

### Pipeline Step Confusion
- 15 pipeline steps in `PROVISION_PIPELINE` but ~6 are effectively no-ops
- The real work happens in `install_blueprint` step (→ `BlueprintInstaller.install()`)
- Steps like `assign_owner`, `assign_plan`, `create_pages` just return counts

### Repository Bypass
- `BlueprintInstaller` makes direct DB calls instead of using repositories
- `ProvisionEngine._installTheme` duplicates logic from installer
- `ProvisionEngine._installFonts` duplicates logic from seeder
- Always check if a repository method exists before writing direct DB queries

### Theme Single-Row Pattern
- `theme_settings` with `id=1` is NOT multi-tenant compatible
- Multiple components hardcode this ID

### Workspace Resolution
- `CurrentWorkspaceProvider` creates a separate `WorkspaceRepository` instance with its own providers
- This means 2 sets of providers exist at runtime

---

## 12. Files That Should Almost Never Be Modified

| File | Reason |
|------|--------|
| `src/lib/core/workspace/types.ts` | Core type definitions — changes cascade everywhere |
| `src/lib/core/provision/types.ts` | Blueprint + transaction types — all provision components depend on these |
| `src/lib/interfaces/database.ts` | Provider contract — changing breaks all repositories and providers |
| `src/lib/interfaces/auth.ts` | Provider contract — changing breaks auth flow |
| `src/lib/repositories/base.ts` | Base class for all repositories — changes affect all repos |
| `src/lib/repositories/factory.ts` | Circular dependency management — changes can break the DI graph |
| `src/integrations/supabase/client.ts` | Supabase client initialization — wrong config breaks everything |

---

## 13. Files That Are Safe Extension Points

| File | Extension Pattern |
|------|-------------------|
| `src/lib/core/workspace/policies.ts` | Add new `can{Action}()` methods |
| `src/lib/core/workspace/validation.ts` | Add new Zod schemas for new operations |
| `src/lib/core/provision/blueprint/registry.ts` | Add new blueprint registration methods |
| `src/lib/providers/supabase/index.ts` | Add new provider creation functions |
| `src/lib/repositories/factory.ts` | Add new repositories to `Repositories` interface |
| `src/lib/theme/` | Add new theme tokens, presets, or derivation logic |

---

## 14. Database Key-Value Patterns

| Key Pattern | Example | Purpose | Set By |
|-------------|---------|---------|--------|
| `workspace:{id}:entity` | `workspace_abc123:entity` | Workspace entity | WorkspaceRepository |
| `blueprint:{slug}:{version}` | `blueprint:cafe:1.0.0` | Blueprint definition | BlueprintRegistry |
| `blueprint:index` | `blueprint:index` | Blueprint catalog | BlueprintRegistry |
| `provision:tx:{txId}` | `provision:tx_xyz:entity` | Provision transaction | ProvisionTransactionManager |
| `provision:log:{wsId}:{slug}:{ver}` | `provision:log:ws1:cafe:1.0.0` | Idempotency log | BlueprintInstaller |
| `media_folder:{path}` | `media_folder:default/logo` | Media folder metadata | ProvisionSeeder |

---

## 15. Provision Pipeline Details

```
Step 0:  validate_request       — Zod validation + blueprint existence check
Step 1:  create_workspace       — Factory → WorkspaceRepository.save()
Step 2:  assign_owner           — NO-OP (already set in factory)
Step 3:  assign_plan            — NO-OP (already set in factory)
Step 4:  install_blueprint      — BlueprintInstaller.install() (all real work)
Step 5:  create_pages           — NO-OP (returns count only)
Step 6:  create_navigation      — NO-OP (returns count only)
Step 7:  insert_blocks          — NO-OP (returns count only)
Step 8:  insert_cms_data        — NO-OP (returns boolean only)
Step 9:  insert_theme           — Duplicates installer logic (id=1 hardcoded)
Step 10: insert_fonts            — Duplicates seeder logic
Step 11: insert_default_media   — ProvisionSeeder.seed()
Step 12: insert_analytics_defaults — NO-OP
Step 13: run_health_check       — ProvisionHealthChecker.runChecks()
Step 14: workspace_ready        — Sets status → active
```

## 16. Error Hierarchy

```
BaseAppError
├── ValidationError     — Zod validation failures
├── RepositoryError     — Repository data access errors
├── AuthError           — Authentication errors
├── StorageError        — Storage provider errors
├── WorkspaceError      — Workspace service errors
├── ProvisionError      — Provision engine errors
└── ProvisionStepError  — Individual step errors
```
