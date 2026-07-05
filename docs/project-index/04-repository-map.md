# Repository Map — NAMA Website Builder

## Repository Architecture

All repositories extend `BaseRepository` (in `src/lib/repositories/base.ts`), which provides:
- Dependency injection via `RepositoryDependencies`
- Workspace awareness (`setWorkspace()`, `workspaceId`)
- Zod validation (`validateOrThrow()`)
- Error normalization (`normalizeError()` → `RepositoryError`)
- Pagination helpers (`applyPagination()`)

---

## Repository Hierarchy

```
BaseRepository (abstract)
├── MenuRepository
├── GalleryRepository
├── EventsRepository
├── TestimonialsRepository
├── PagesRepository
├── ThemeRepository
├── SiteContentRepository
├── PersonalityRepository
├── MediaRepository
├── TestRepository
├── AnalyticsRepository
├── AuthRepository
└── WorkspaceRepository (in core/workspace/)
```

---

## Repository Details

### `BaseRepository` (`src/lib/repositories/base.ts`)
| Aspect | Detail |
|--------|--------|
| **Dependencies** | `IDatabaseProvider`, `IStorageProvider`, `IAuthProvider`, `IRealtimeProvider`, optional `WorkspaceContext`, optional `ILogger` |
| **Key Methods** | `setWorkspace()`, `validateOrThrow()`, `normalizeError()`, `applyPagination()` |
| **Tables Used** | None directly (abstract) |
| **Providers Used** | database, storage, auth, realtime |
| **Consumers** | All other repositories |
| **Missing** | No `range()` helper in interface for offset-based pagination (though `ITableQuery` declares it) |

### `WorkspaceRepository` (`src/lib/core/workspace/repository.ts`)
| Aspect | Detail |
|--------|--------|
| **Methods** | `findById()`, `save()`, `delete()`, `listAll()`, `findByUserId()`, `getOrCreateDefault()` |
| **Table** | `site_content` (key-value pattern: `workspace:{id}:entity`) |
| **Providers Used** | database |
| **Consumers** | `WorkspaceService`, `WorkspaceResolver`, `CurrentWorkspaceProvider`, `ProvisionEngine`, `ProvisionValidator` |
| **Missing** | No pagination on `listAll()`, no `findByDomain()` for custom domain lookup |

### `MenuRepository` (`src/lib/repositories/menu.ts`)
| Methods | `getAll()`, `getVisible()`, `upsert()`, `delete()` |
|---------|------------------------------------------------------|
| **Table** | `menu_items` |
| **Providers** | database |
| **Consumers** | Admin routes, landing page |

### `GalleryRepository` (`src/lib/repositories/gallery.ts`)
| Methods | `getAll()`, `getVisible()`, `upsert()`, `delete()` |
|---------|------------------------------------------------------|
| **Table** | `gallery_images` |
| **Providers** | database |
| **Consumers** | Admin routes, landing page |

### `EventsRepository` (`src/lib/repositories/events.ts`)
| Methods | `getAll()`, `getVisible()`, `upsert()`, `delete()` |
|---------|------------------------------------------------------|
| **Table** | `events` |
| **Providers** | database |
| **Consumers** | Admin routes, landing page |

### `TestimonialsRepository` (`src/lib/repositories/testimonials.ts`)
| Methods | `getAll()`, `getVisible()`, `upsert()`, `delete()` |
|---------|------------------------------------------------------|
| **Table** | `testimonials` |
| **Providers** | database |
| **Consumers** | Admin routes, landing page |

### `PagesRepository` (`src/lib/repositories/pages.ts`)
| Methods | `getAll()`, `create()`, `update()`, `delete()`, `reorder()` |
|---------|---------------------------------------------------------------|
| **Table** | `page_blocks` |
| **Providers** | database |
| **Consumers** | Admin routes, landing page, `BlueprintInstaller` (bypasses via direct db access) |

### `ThemeRepository` (`src/lib/repositories/theme.ts`)
| Methods | `get()`, `update()` |
|---------|----------------------|
| **Table** | `theme_settings` |
| **Providers** | database |
| **Consumers** | Admin settings, landing page |
| **Note** | Hardcoded `id=1` — NOT multi-tenant compatible |

### `SiteContentRepository` (`src/lib/repositories/site-content.ts`)
| Methods | `getAll()`, `getByKey()`, `upsert()` |
|---------|---------------------------------------|
| **Table** | `site_content` |
| **Providers** | database |
| **Consumers** | Admin site content page |

### `PersonalityRepository` (`src/lib/repositories/personality.ts`)
| Methods | `getAll()`, `upsert()`, `update()` |
|---------|-------------------------------------|
| **Table** | `personality_profiles` |
| **Providers** | database |
| **Consumers** | Admin routes, test pages |

### `MediaRepository` (`src/lib/repositories/media.ts`)
| Methods | `getAll()`, `upload()`, `delete()`, `getPublicUrl()`, `deleteByPublicUrl()` |
|---------|-------------------------------------------------------------------------------|
| **Tables** | `media_files` + Supabase Storage |
| **Providers** | database, storage |
| **Consumers** | Admin media page |
| **Note** | Bucket: `media`, folder prefix: `default/` (needs workspace scoping) |

### `TestRepository` (`src/lib/repositories/test.ts`)
| Methods | `getResponses()`, `submitResponse()`, `deleteResponse()`, `clearResponses()`, `getQuestionsConfig()`, `updateQuestionsConfig()` |
|---------|-----------------------------------------------------------------------------------------------------------------------------------|
| **Tables** | `test_responses`, `site_content` (for questions config) |
| **Providers** | database |
| **Consumers** | Test pages, admin test pages |

### `AnalyticsRepository` (`src/lib/repositories/analytics.ts`)
| Methods | `fetchStats()`, `fetchTopPages()`, `fetchDeviceDistribution()`, `fetchVisitsOverTime()`, `fetchPageViewStats()`, `recordPageView()`, `fetchSiteVisitStatsRpc()` |
|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Tables** | `site_visits`, `page_views` |
| **Providers** | database |
| **Consumers** | Admin analytics, admin dashboard |
| **Note** | Falls back to direct queries when RPCs are unavailable |

### `AuthRepository` (`src/lib/repositories/auth.ts`)
| Methods | `signIn()`, `signUp()`, `signOut()`, `getSession()`, `getCurrentUser()`, `onAuthStateChange()`, `isAdmin()`, `getClaims()` |
|---------|-----------------------------------------------------------------------------------------------------------------------------|
| **Tables** | `user_roles` |
| **Providers** | database, auth |
| **Consumers** | Workspace resolution, admin routes |

---

## Repository Bypass Issues

Several components bypass the repository layer and access providers directly:

| Component | Direct DB Calls | Bypasses |
|-----------|----------------|----------|
| `BlueprintInstaller` | `page_blocks`, `menu_items`, `gallery_images`, `personality_profiles`, `theme_settings`, `site_content` | PagesRepository, MenuRepository, GalleryRepository, etc. |
| `ProvisionEngine` | `theme_settings`, `site_content` | ThemeRepository |
| `ProvisionRollback` | `page_blocks`, `media_files`, `theme_settings`, `site_content` | PagesRepository, MediaRepository, ThemeRepository |
| `ProvisionHealthChecker` | `theme_settings`, `page_blocks`, `site_content` | ThemeRepository, PagesRepository, SiteContentRepository |
| `ProvisionSeeder` | `site_content` | SiteContentRepository |
| `ProvisionTransactionManager` | `site_content` | SiteContentRepository |

This is a **design smell** — the provision components should use repositories for data access, not call providers directly. Currently, the provision engine has tight coupling to the database schema.
