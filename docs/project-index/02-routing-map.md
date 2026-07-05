# Routing Map — NAMA Website Builder

## Route Structure

All routes use **TanStack Router** with file-based routing from `src/routes/`.

### Public Routes

| Route | File | Purpose | Auth | Layout |
|-------|------|---------|------|--------|
| `/` | `src/routes/index.tsx` | Landing page (hero, sections) | No | Landing layout |
| `/test` | `src/routes/test.index.tsx` | Personality test start | No | Test layout |
| `/test/info` | `src/routes/test.info.tsx` | Test user info form | No | Test layout |
| `/test/:step` | `src/routes/test.$step.tsx` | Individual test question | No | Test layout |
| `/test/result` | `src/routes/test.result.tsx` | Test results display | No | Test layout |

### Admin Routes (all under `/admin`)

| Route | File | Purpose | Auth | Layout |
|-------|------|---------|------|--------|
| `/admin` | `src/routes/admin.tsx` | Admin shell layout | Required | Admin shell |
| `/admin/` | `src/routes/admin.index.tsx` | Admin dashboard | Required | Admin shell |
| `/admin/menu` | `src/routes/admin.menu.tsx` | Menu CRUD | Required | Admin shell |
| `/admin/gallery` | `src/routes/admin.gallery.tsx` | Gallery CRUD | Required | Admin shell |
| `/admin/events` | `src/routes/admin.events.tsx` | Events CRUD | Required | Admin shell |
| `/admin/bookings` | `src/routes/admin.bookings.tsx` | Bookings | Required | Admin shell |
| `/admin/test-questions` | `src/routes/admin.test-questions.tsx` | Test questions editor | Required | Admin shell |
| `/admin/test-results` | `src/routes/admin.test-results.tsx` | Test responses viewer | Required | Admin shell |
| `/admin/test-analytics` | `src/routes/admin.test-analytics.tsx` | Test analytics | Required | Admin shell |
| `/admin/personality-types` | `src/routes/admin.personality-types.tsx` | Personality profile editor | Required | Admin shell |
| `/admin/site-content` | `src/routes/admin.site-content.tsx` | Site content editor | Required | Admin shell |
| `/admin/page` | `src/routes/admin.page.tsx` | Page blocks editor | Required | Admin shell |
| `/admin/forms` | `src/routes/admin.forms.tsx` | Form submissions | Required | Admin shell |
| `/admin/calendar` | `src/routes/admin.calendar.tsx` | Calendar view | Required | Admin shell |
| `/admin/analytics` | `src/routes/admin.analytics.tsx` | Analytics dashboard | Required | Admin shell |
| `/admin/media` | `src/routes/admin.media.tsx` | Media library | Required | Admin shell |
| `/admin/notifications` | `src/routes/admin.notifications.tsx` | Notifications | Required | Admin shell |
| `/admin/activity` | `src/routes/admin.activity.tsx` | Activity log | Required | Admin shell |
| `/admin/settings` | `src/routes/admin.settings.tsx` | Settings | Required | Admin shell |

### Special Routes

| Route | File | Purpose |
|-------|------|---------|
| `__root.tsx` | `src/routes/__root.tsx` | Root layout (providers, fonts, preconnect) |
| `routeTree.gen.ts` | Auto-generated | TanStack Router route tree |
| `router.tsx` | `src/router.tsx` | Router initialization |

---

## Component Dependencies Per Route

### Landing (`/`)
- `OrbBackground` (lazy loaded)
- `LandingPage` → `LandingSections` → Block renderers
- `CurrentWorkspaceProvider`
- CMS hooks: `useTheme()`, `useMenuItems()`, `useGalleryImages()`, `useEvents()`, `useTestimonials()`, `useSiteContent()`, `usePageBlocks()`

### Admin (all `/admin/*`)
- `AdminShell` (layout wrapper)
- Per-page CRUD components
- `AnalyticsCharts` (admin.analytics only)
- `ImageUploader` (admin.media, admin.menu, admin.gallery)
- `ThemePresetsCard`, `ThemeLivePreview` (admin.settings)
- `CommandPalette` (shared)

### Test (`/test/*`)
- `TestPageShell`
- Personality type components
- Test store (`test-store.ts`)

---

## Repository Usage Per Route

| Route | Repositories Used |
|-------|-------------------|
| `/` | All CMS repositories (via hooks) |
| `/admin/menu` | `MenuRepository` |
| `/admin/gallery` | `GalleryRepository` |
| `/admin/events` | `EventsRepository` |
| `/admin/bookings` | — (not yet implemented) |
| `/admin/test-*` | `TestRepository`, `PersonalityRepository` |
| `/admin/personality-types` | `PersonalityRepository` |
| `/admin/site-content` | `SiteContentRepository` |
| `/admin/page` | `PagesRepository` |
| `/admin/analytics` | `AnalyticsRepository` |
| `/admin/media` | `MediaRepository` |
| `/admin/settings` | `ThemeRepository`, `SiteContentRepository` |
| `/admin/notifications` | — |
| `/admin/activity` | — |

---

## Auth Requirements

- **Public routes**: No authentication required
- **Admin routes**: Session required via `AuthRepository.getSession()`
- **Workspace resolution**: Automatic via `CurrentWorkspaceProvider` (resolves at root)
- **Role enforcement**: Via `WorkspacePolicies` at service/repository level (future)
