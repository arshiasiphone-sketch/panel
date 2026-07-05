# Security Map — NAMA Website Builder

## Authentication

| Aspect | Implementation | Notes |
|--------|---------------|-------|
| **Provider** | Supabase Auth | Abstracted behind `IAuthProvider` |
| **Sign-in** | Email/password via `AuthRepository.signIn()` | — |
| **Sign-up** | Email/password via `AuthRepository.signUp()` | Optional redirect |
| **Session** | Supabase session (JWT) | Retrieved via `AuthRepository.getSession()` |
| **State changes** | `onAuthStateChange()` subscription | — |
| **Admin middleware** | `auth-middleware.ts` | ⚠️ Throws generic Error (EPIC 3.7 H3) |

---

## Authorization

### App-Level Roles (via `user_roles` table)
| Role | Check |
|------|-------|
| admin | `AuthRepository.isAdmin(userId)` |

### Workspace-Level Roles (via `WorkspaceEntity.membership`)
| Role | Level | Policy Check |
|------|-------|--------------|
| viewer | 0 | `canView()` |
| member | 1 | `canEdit()` |
| admin | 2 | `canManage()` |
| owner | 3 | `canAdminister()` |

---

## Repository Security

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Direct Supabase access | Provider abstraction layer | ✅ |
| SQL injection | Supabase query builder + Zod validation | ✅ |
| Cross-workspace data access | `workspace_id` filtering | ❌ Not implemented |
| Unvalidated input | Zod schemas at repository boundary | ✅ |
| Mass assignment | Zod schemas whitelist fields | ✅ |

---

## Provider Security

| Provider | Security Boundary |
|----------|------------------|
| Database | Supabase RLS (when enabled) + provider abstraction |
| Auth | Supabase Auth (handles password hashing, session management) |
| Storage | Supabase Storage RLS (bucket-level) |
| Realtime | Supabase Realtime (channel-level) |

---

## Environment Variables

| Variable | Where Used | Risk Level |
|----------|-----------|------------|
| `SUPABASE_URL` | `client.ts`, `client.server.ts` | Low |
| `SUPABASE_PUBLISHABLE_KEY` | `client.ts` | Low |
| `SUPABASE_SERVICE_ROLE_KEY` | `client.server.ts` | **⚠️ HIGH — EPIC 3.7 C3** |
| `NAMA_LOG_LEVEL` | `logger.ts` | Low |

**⚠️ Known Issues:**
- Missing `.env.example` (EPIC 3.7 H1)
- Service role key could leak to client bundle (EPIC 3.7 C3)
- Supabase client throws when env vars missing (EPIC 3.7 C2)

---

## Row-Level Security (RLS)

| Table | RLS Enabled? | Policy |
|-------|-------------|--------|
| `site_content` | Unknown | No workspace-level policy |
| `page_blocks` | Unknown | No workspace-level policy |
| `menu_items` | Unknown | No workspace-level policy |
| `gallery_images` | Unknown | No workspace-level policy |
| `events` | Unknown | No workspace-level policy |
| `testimonials` | Unknown | No workspace-level policy |
| `theme_settings` | Unknown | No workspace-level policy |
| `media_files` | Unknown | No workspace-level policy |
| `personality_profiles` | Unknown | No workspace-level policy |
| `test_responses` | Unknown | No workspace-level policy |
| `user_roles` | Unknown | Likely admin-only |

**Note**: RLS policies need to be created as part of EPIC 5 (workspace isolation).

---

## Workspace Isolation

| Aspect | Current State | Required State |
|--------|---------------|----------------|
| Data tables | No `workspace_id` column | Add column to all tables |
| Theme | Hardcoded `id=1` | Add `workspace_id` to `theme_settings` |
| Media | Folder prefix `default/` | Use `{workspaceId}/` prefix |
| Analytics | Global (no workspace filter) | Filter by `workspace_id` |
| Key-value store | Key prefix `workspace:{id}:` ✅ | Architecture ready |
| Repository filtering | `workspaceId` property exists ✅ | Needs to be wired |

---

## Known Security Risks

| Risk | Severity | Details |
|------|----------|---------|
| Service role key in client bundle | 🔴 Critical | EPIC 3.7 C3 — could leak full DB access |
| Auth middleware throws 500 | 🟠 High | EPIC 3.7 H3 — auth failures appear as 500s |
| No `.env.example` | 🟠 High | EPIC 3.7 H1 — env var docs missing |
| Missing `.gitignore` | 🟠 High | EPIC 3.7 H2 — secrets could be committed |
| Cross-workspace data access | 🟠 High | No `workspace_id` filtering anywhere |
| Rollback deletes other workspaces' data | 🔴 Critical | Discovered in this audit |
| Hardcoded theme ID | 🟠 High | theme_settings id=1 shared across workspaces |
| No RLS policies documented | 🟡 Medium | Unknown if RLS is configured |
