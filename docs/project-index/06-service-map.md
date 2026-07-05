# Service Map — NAMA Website Builder

## Service Overview

The project uses a **service layer** pattern for business logic. Two main services exist:

1. **`WorkspaceService`** — Workspace lifecycle management
2. **`ProvisionService`** — Website provisioning pipeline

Most business logic is currently in repositories directly (thin services pattern).

---

## `WorkspaceService` (`src/lib/core/workspace/service.ts`)

| Aspect | Detail |
|--------|--------|
| **Responsibilities** | Create, update, delete workspaces; manage members and roles; transition status |
| **Dependencies** | `WorkspaceRepository` |
| **Side Effects** | Saves to `site_content` via repository |
| **Consumers** | Admin UI (future), `ProvisionEngine` (bypasses via factory) |
| **Methods** | `getById()`, `getForUser()`, `listAll()`, `create()`, `createAndActivate()`, `update()`, `activate()`, `suspend()`, `archive()`, `restore()`, `delete()`, `addMember()`, `removeMember()`, `updateMemberRole()` |

### Bypass Issue
`ProvisionEngine._createWorkspace()` imports `createWorkspace` from the factory directly instead of using `WorkspaceService.create()`. This means workspace creation during provisioning bypasses:
- Policy checks
- Validation schema (though validation is done separately in the validator)
- Business logic in the service layer

---

## `ProvisionService` (`src/lib/core/provision/service.ts`)

| Aspect | Detail |
|--------|--------|
| **Responsibilities** | Orchestrate provisioning pipeline; manage blueprints (register, list, delete); query transactions |
| **Dependencies** | All provision sub-components + `RepositoryDependencies` + `WorkspaceRepository` |
| **Side Effects** | Creates workspaces, pages, navigation, theme, media, analytics — full website generation |
| **Consumers** | Admin UI (future), server endpoints |
| **Methods** | `provision()`, `registerBlueprint()`, `getBlueprint()`, `listBlueprints()`, `listBlueprintVersions()`, `nextBlueprintVersion()`, `deleteBlueprint()`, `getTransaction()`, `getTransactionsByWorkspace()` |

---

## Implicit Services (in repositories)

Several repositories contain significant business logic beyond simple CRUD:

| Repository | Business Logic |
|------------|---------------|
| `AuthRepository` | Session management, admin role checking |
| `MediaRepository` | Upload orchestration (storage + DB insert + cleanup on failure) |
| `AnalyticsRepository` | Aggregation queries, RPC fallbacks, time-window calculations |
| `TestRepository` | Response submission, question config management |
| `ThemeRepository` | Default insertion on first access |

---

## Service Dependencies Graph

```
ProvisionService
  ├── ProvisionEngine
  │   ├── BlueprintRegistry (extends BaseRepository)
  │   ├── BlueprintLoader
  │   ├── BlueprintInstaller (extends BaseRepository)
  │   ├── ProvisionTransactionManager (extends BaseRepository)
  │   ├── ProvisionRollback (extends BaseRepository)
  │   ├── ProvisionValidator (extends BaseRepository)
  │   ├── ProvisionSeeder (extends BaseRepository)
  │   ├── ProvisionHealthChecker (extends BaseRepository)
  │   ├── ProvisionReportGenerator (pure)
  │   ├── WorkspaceRepository (external)
  │   └── createWorkspace() (from factory, not service)
  ├── BlueprintRegistry
  ├── BlueprintLoader
  ├── BlueprintVersioning
  └── ProvisionTransactionManager

WorkspaceService
  └── WorkspaceRepository
```

---

## Missing Services

| Missing Service | Needed For |
|----------------|------------|
| **BillingService** | Plan enforcement, subscription management |
| **NotificationService** | Admin alerts, provisioning status |
| **AnalyticsService** | Cross-repository analytics aggregation |
| **BackupService** | Workspace backup/restore |
| **SearchService** | Full-text search across workspace content |
