# Workspace System — NAMA Website Builder

> ⚠️ **Audited with findings**. See `15-technical-debt.md` for identified issues.

## Architecture

The workspace is the **center of the system**. All data access flows through workspace context:

```
User → Auth → Workspace Context → Repositories → Providers → Database
```

### Current State: Single-Tenant with Multi-Tenant Architecture

The workspace system is **architecture-ready but inert**. The full workspace lifecycle is implemented (types, factory, repository, service, policies, resolver, context provider), but:
- No `workspace_id` columns exist in data tables
- Theme uses hardcoded `id=1`
- The `DEFAULT_WORKSPACE` has `workspaceId: undefined`
- All repositories operate in single-tenant mode

---

## Components

| Component | File | Purpose |
|-----------|------|---------|
| Types | `types.ts` | `WorkspaceStatus`, `WorkspacePlan`, `WorkspaceLimits`, `WorkspaceEntity`, `WorkspaceContext` |
| Entity | `entity.ts` | Status checks, plan tiers, limit enforcement, membership helpers |
| Factory | `factory.ts` | `createWorkspace()`, `createDefaultWorkspace()`, plan defaults |
| Validation | `validation.ts` | Zod schemas for all workspace operations |
| Policies | `policies.ts` | Authorization rules (`canView`, `canEdit`, `canManage`, `canAdminister`, etc.) |
| Repository | `repository.ts` | `findById()`, `save()`, `delete()`, `listAll()`, `findByUserId()`, `getOrCreateDefault()` |
| Resolver | `resolver.ts` | Workspace resolution from auth context |
| Service | `service.ts` | Business logic orchestrator |
| Health | `health.ts` | Runtime health checks |
| Context | `context.tsx` | React provider + hooks (`useCurrentWorkspace`, `useOptionalWorkspace`) |
| Index | `index.ts` | Barrel exports (carefully managed to avoid circular deps) |

---

## Workspace Lifecycle

```
Provisioning → Active/Trial → Suspended → Archived → Deleted
                    ↓
               Suspended (can return to Active)
```

### Status Transitions
| From | Allowed To |
|------|-----------|
| provisioning | active, trial, deleted |
| active | suspended, trial, archived, deleted |
| trial | active, suspended, archived, deleted |
| suspended | active, archived, deleted |
| archived | active, deleted |
| deleted | (none) |

---

## Plans and Limits

| Plan | Pages | Media | Storage | Admins | Retention | Visitors |
|------|-------|-------|---------|--------|-----------|----------|
| Free | 10 | 20 | 50 MB | 1 | 30 days | 1K |
| Starter | 50 | 100 | 500 MB | 3 | 90 days | 10K |
| Pro | 200 | 500 | 2 GB | 10 | 365 days | 100K |
| Enterprise | 1000 | 5000 | 20 GB | 100 | 730 days | 1M |

**Note**: Limits are defined as TypeScript constants in `factory.ts` (`PLAN_LIMITS`), not stored in the database. Changing a limit requires a code deployment.

---

## Membership and Roles

| Role | Level | Permissions |
|------|-------|------------|
| viewer | 0 | Read-only access |
| member | 1 | Can edit content |
| admin | 2 | Can manage settings and members |
| owner | 3 | Full control, can delete/transfer |

---

## Workspace Resolution Strategy

1. If explicit `workspaceId` provided → load that workspace
2. If user has exactly one workspace → use it
3. If user has multiple workspaces → use most recently updated
4. If user has no workspaces → create default workspace

---

## CurrentWorkspaceProvider (React)

The `CurrentWorkspaceProvider` (in `context.tsx`):
1. Mounts → sets `loading: true`
2. Gets current user from `AuthRepository.getSession()`
3. If authenticated → resolves workspace via `resolveWorkspace()`
4. Sets workspace on all repositories via `setWorkspaceOnRepositories()`
5. Runs health checks and logs results
6. Provides `WorkspaceContextValue` to the component tree

### Provider Value Shape
```ts
{
  workspace: WorkspaceContext,      // Opaque workspace context
  entity: WorkspaceEntity | null,    // Full entity if loaded
  loading: boolean,                  // Resolution in progress
  error: Error | null,               // Resolution error
  isOperational: boolean,            // Active or trial?
  checkLimit: (key, usage) => boolean,
  hasRole: (uid, minRole) => boolean,
  isAdmin: (uid) => boolean,
  isOwner: (uid) => boolean,
}
```

---

## Repository Integration

Workspace context flows into repositories via:
1. `BaseRepository.setWorkspace(ctx)` — sets workspace context
2. `BaseRepository.workspaceId` — getter for current workspace ID
3. `setWorkspaceOnRepositories()` (in `repositories/factory.ts`) — sets on all repos at once

Currently, `workspaceId` is NOT used in any repository query because `workspace_id` columns don't exist in data tables yet.

---

## Current Implementation Issues

1. **No `workspace_id` columns** — Workspace filtering is architecture-ready but inert
2. **`WorkspaceRepository.getOrCreateDefault()` bypasses provisioning** — Sets status directly to `active`
3. **`WorkspaceRepository.listAll()` has no pagination** — Fetches all workspaces
4. **Theme uses hardcoded `id=1`** — Not multi-tenant compatible
5. **Provider creates second instance** — `CurrentWorkspaceProvider` creates a separate `WorkspaceRepository` instance
6. **`ProvisionEngine` bypasses `WorkspaceService`** — Uses factory directly

---

## Roadmap / Future Migration

### EPIC 5: Workspace Isolation
- Add `workspace_id` columns to all data tables
- Update all repository queries to filter by `workspace_id`
- Make `theme_settings` multi-tenant (add `workspace_id`, remove `id=1` pattern)
- Ensure rollback has workspace isolation

### EPIC 7: Multi-Tenant Activation
- Wire workspace selection UI for users with multiple workspaces
- Add workspace switching support
- Show workspace context in admin header

### EPIC 8: Billing Integration
- Connect plan/limits to a billing provider
- Enforce limits at the repository/service level
- Limitation notification UI

---

## Missing Implementation

| Feature | Status | Notes |
|---------|--------|-------|
| Workspace CRUD UI | ❌ Missing | Admin pages not built |
| Workspace switching UI | ❌ Missing | No multi-workspace UX |
| Workspace domain support | ❌ Missing | Custom domain per workspace |
| Workspace-level analytics | ❌ Missing | All analytics is global |
| Workspace-level media isolation | ❌ Missing | Media bucket is shared |
| Workspace backup/restore | ❌ Missing | — |
| Workspace deletion with all data | ❌ Missing | — |
| Workspace billing | ❌ Missing | — |
| Workspace activity log | ❌ Missing | — |
