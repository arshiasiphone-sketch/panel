# Admin Map — NAMA Website Builder

## Admin Architecture

All admin routes are under `/admin/*` using TanStack Router file-based routing.

### Admin Navigation

Sidebar navigation (from `AdminShell`):
```
Dashboard          /admin/
Menu               /admin/menu
Gallery            /admin/gallery
Events             /admin/events
Bookings           /admin/bookings
Pages              /admin/page
Site Content       /admin/site-content
Forms              /admin/forms
Calendar           /admin/calendar
Personality Types  /admin/personality-types
Test Questions     /admin/test-questions
Test Results       /admin/test-results
Test Analytics     /admin/test-analytics
Media              /admin/media
Analytics          /admin/analytics
Notifications      /admin/notifications
Activity           /admin/activity
Settings           /admin/settings
```

---

## CRUD Modules

### Pattern
Most CRUD modules follow this pattern:
```
Route Component
  ├── TanStack Query (useQuery, useMutation)
  ├── Repository methods
  └── shadcn/ui components (Table, Dialog, Form, Button, etc.)
```

### Standard CRUD Methods Per Entity
| Operation | Repository Method | UI Pattern |
|-----------|------------------|------------|
| List | `getAll()` / `getVisible()` | Table with pagination |
| Create | `upsert()` | Dialog/Form |
| Edit | `upsert()` | Dialog/Form (pre-filled) |
| Delete | `delete()` | Confirm dialog |
| Reorder | Manual sort_order | Drag-and-drop (@dnd-kit for page blocks) |

---

## Page Builder (`/admin/page`)

The Blocks component (`src/components/admin/blocks.tsx`) provides:
- Drag-and-drop block reordering (via @dnd-kit)
- Block type selection (hero, features, gallery, contact, etc.)
- Inline block editing
- Phone preview via `PhonePreview` component

---

## Theme System (`/admin/settings`)

| Component | Purpose |
|-----------|---------|
| `ThemePresetsCard` | Display and select from 8 theme presets |
| `ThemeLivePreview` | Real-time CSS variable preview |
| Theme engine | `src/lib/theme/` — handles token derivation and CSS variable emission |

See `09-theme-system.md` for complete theme documentation.

---

## Media Library (`/admin/media`)

| Feature | Implementation |
|---------|---------------|
| Upload | `MediaRepository.upload()` — file → storage → DB entry |
| List | `MediaRepository.getAll()` with pagination |
| Delete | `MediaRepository.delete()` — storage + DB cleanup |
| URL | `MediaRepository.getPublicUrl()` — returns public Supabase URL |
| Bucket | `media` (hardcoded in `MEDIA_BUCKET`) |
| Folder prefix | `default/` (hardcoded in `MEDIA_FOLDER_PREFIX`) |

---

## Analytics Dashboard (`/admin/analytics`)

| Widget | Data Source |
|--------|-------------|
| Visit stats (total, today, yesterday, realtime) | `AnalyticsRepository.fetchStats()` |
| Top pages | `AnalyticsRepository.fetchTopPages()` |
| Device distribution | `AnalyticsRepository.fetchDeviceDistribution()` |
| Visits over time | `AnalyticsRepository.fetchVisitsOverTime()` |
| Page views | `AnalyticsRepository.fetchPageViewStats()` |
| Charts | `AnalyticsCharts` component (recharts) |

---

## Settings (`/admin/settings`)

Settings page includes:
- Theme customization (presets, colors, typography)
- Font configuration
- Business settings
- SEO defaults
- Analytics configuration

---

## Mobile-First Implementation

Admin shell uses responsive sidebar with:
- Desktop: Static sidebar
- Mobile: Collapsible sidebar/drawer
- Via `use-mobile.tsx` hook and `Sidebar` component

---

## Command Palette (`CommandPalette`)
- Triggered by ⌘K
- Fuzzy search across admin routes
- Quick actions

---

## Missing Admin Features

| Feature | Status | Priority |
|---------|--------|----------|
| Blueprint management UI | ❌ Missing | Medium |
| Provision trigger UI | ❌ Missing | Medium |
| Workspace management UI | ❌ Missing | Low |
| User management | ❌ Missing | Medium |
| Billing/subscription UI | ❌ Missing | Low |
| Backup/export | ❌ Missing | Low |
| Activity log | ❌ Placeholder | Low |
| Bookings | ❌ Placeholder | Low |
| Forms | ❌ Placeholder | Low |
| Notifications | ❌ Placeholder | Low |
| Calendar | ❌ Placeholder | Low |
