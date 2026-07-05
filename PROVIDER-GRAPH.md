# PROVIDER-GRAPH

## Architecture: User → Workspace → Repositories → Providers → Database

### Provider Instantiation

```
createSupabaseProviders()
  ├─ createSupabaseDatabaseProvider(supabase)
  ├─ createSupabaseStorageProvider(supabase)
  ├─ createSupabaseAuthProvider(supabase)
  └─ createSupabaseRealtimeProvider(supabase)
```

**Singleton:** `getSupabaseProviders()` — creates once, caches for app lifetime.

### Repository Graph (13 Repositories)

```
createRepositories({ database, storage, auth, realtime, workspace, logger })
  ├─ MenuRepository          → menu_items
  ├─ GalleryRepository       → gallery_images
  ├─ EventsRepository        → events
  ├─ TestimonialsRepository  → testimonials
  ├─ PagesRepository         → page_blocks
  ├─ ThemeRepository         → theme_settings
  ├─ SiteContentRepository   → site_content
  ├─ PersonalityRepository   → personality_profiles
  ├─ MediaRepository         → media_files + storage
  ├─ TestRepository          → test_responses + site_content
  ├─ AnalyticsRepository     → site_visits + page_views
  ├─ AuthRepository          → user_roles + auth
  └─ WorkspaceRepository     → site_content (key-based)
```

### Provision Engine Graph

```
ProvisionService
  ├─ ProvisionEngine
  │   ├─ BlueprintLoader → BlueprintRegistry → SiteContentRepository
  │   ├─ ProvisionValidator → BlueprintLoader → WorkspaceRepository
  │   ├─ ProvisionTransactionManager → SiteContentRepository
  │   ├─ ProvisionReportGenerator
  │   ├─ WorkspaceRepository
  │   ├─ Repositories (shared graph)
  │   └─ StepRegistry (Command Pattern)
  ├─ BlueprintVersioning → BlueprintRegistry
  └─ ProvisionTransactionManager → SiteContentRepository
```

### Provider Lifetime Rules

1. **Single provider graph** — `getSupabaseProviders()` creates ONE set of providers
2. **Repositories share providers** — `createRepositories()` passes the same 4 providers to all repos
3. **`CurrentWorkspaceProvider` reuses repos** — No duplicate `WorkspaceRepository` instantiation
4. **No nested provider graphs** — `BlueprintInstaller` lazily creates repos from the same provider instance
5. **No singleton abuse** — Singleton pattern limited to `getSupabaseProviders()` and `getRepositories()`

## Phase 2 — Repository Contract Audit Matrix

| Repository | getAll | getVisible | upsert | delete | batchDelete | installBlueprint* | create | update | Other Methods |
|---|---|---|---|---|---|---|---|---|---|
| MenuRepository | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ installBlueprintMenuItems | ❌ | ❌ | — |
| GalleryRepository | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ installBlueprintGallery | ❌ | ❌ | — |
| EventsRepository | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ *removed (dead)* | ❌ | ❌ | — |
| TestimonialsRepository | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ *removed (dead)* | ❌ | ❌ | — |
| PagesRepository | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ installBlueprintPages | ✅ | ✅ | reorder, _blockExistsByKeyHash |
| ThemeRepository | ✅ get() | ❌ | ❌ | ❌ | ❌ | ✅ installBlueprintTheme | ❌ | ✅ | — |
| SiteContentRepository | ✅ getAll() | ❌ | ✅ | ✅ deleteByKey | ✅ batchDeleteByKeys, batchGetByKeys | ✅ installBlueprintNavigation, SEO, Analytics, BusinessSettings | ❌ | ❌ | getProvisionLog, saveProvisionLog |
| PersonalityRepository | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ installBlueprintPersonalities | ❌ | ✅ | — |
| MediaRepository | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | upload, getPublicUrl, deleteByPublicUrl |
| TestRepository | ✅ getResponses | ❌ | ❌ | ✅ deleteResponse, clearResponses | ❌ | ❌ | ❌ | ❌ | submitResponse, getQuestionsConfig, updateQuestionsConfig |
| AnalyticsRepository | ❌ fetchStats | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | fetchTopPages, fetchDeviceDistribution, fetchVisitsOverTime, fetchPageViewStats, recordPageView |
| AuthRepository | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | signIn, signUp, signOut, getSession, getCurrentUser, onAuthStateChange, isAdmin, getClaims |
| WorkspaceRepository | ✅ listAll, findByUserId | ❌ | ❌ | ✅ delete | ❌ | ❌ | ❌ | ❌ | findById, save, getOrCreateDefault |

### Notes on Contract Deviations

- **AnalyticsRepository, AuthRepository** — Not CMS entities; they query RPCs and auth state. Standard CRUD methods would be artificial here.
- **MediaRepository** — File upload/delete patterns don't fit standard CRUD. `upload()` does both storage + DB operations.
- **TestRepository** — Test response management is write-once, read-many. `clearResponses()` is a batch operation specific to test domain.
- **SiteContentRepository** — Key-value store with batch operations; standard getById doesn't apply.
- **ThemeRepository** — Singleton pattern (single theme settings row). `get()` fetches with default fallback.
- **EventsRepository, TestimonialsRepository** — `installBlueprint*()` methods were removed as dead code (Phase 3). `batchDelete()` remains as a utility with zero callers.

## Provider Interface Contracts

- `IDatabaseProvider` — abstracted Supabase PostgREST (from, rpc, removeChannel)
- `IStorageProvider` — abstracted Supabase Storage (upload, remove, getPublicUrl)
- `IAuthProvider` — abstracted Supabase Auth (signIn, signUp, signOut, getSession, onAuthStateChange)
- `IRealtimeProvider` — abstracted Supabase Realtime (channel, removeChannel, getChannels)
