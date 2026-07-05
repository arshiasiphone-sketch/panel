# Component Map — NAMA Website Builder

## Component Layers

```
routes/ (page components)
    ↓
components/admin/ (admin panel)
components/landing/ (public site)
components/test/ (test pages)
    ↓
components/ui/ (shadcn/ui primitives + custom)
```

---

## Important UI Components

### Admin Components (`src/components/admin/`)

| Component | Purpose | Routes Using It | Dependencies | Reusable? |
|-----------|---------|----------------|--------------|-----------|
| `AdminShell` | Admin layout (sidebar, header, navigation) | All `/admin/*` | Sidebar, navigation-menu | Yes — shared layout |
| `AnalyticsCharts` | Chart visualizations (recharts) | `/admin/analytics` | recharts | Yes |
| `ImageUploader` | File upload with preview | `/admin/media`, `/admin/menu`, `/admin/gallery` | MediaRepository | Yes |
| `ThemePresetsCard` | Theme preset selection | `/admin/settings` | ThemeRepository | Yes |
| `ThemeLivePreview` | Real-time theme preview | `/admin/settings` | Theme tokens | Yes |
| `SaveIndicator` | Auto-save status | All admin CRUD pages | — | Yes |
| `SessionOnlyBanner` | Session warning banner | All admin pages | — | Yes |
| `PhonePreview` | Mobile preview of landing | `/admin/page` | — | Yes |
| `Blocks` | Page block editor (drag-and-drop) | `/admin/page` | @dnd-kit | Yes |
| `CommandPalette` | ⌘K command palette | All admin pages | — | Yes |

### Landing Components (`src/components/landing/`)

| Component | Purpose | Routes Using It | Dependencies | Reusable? |
|-----------|---------|----------------|--------------|-----------|
| `LandingSections` (1753 lines) | All block renderers (hero, features, gallery, contact, etc.) | `/` | framer-motion (lazy), CMS hooks | Yes — the block rendering system |
| `LandingBlockRender` | Individual block renderer (memo'd) | `/` | framer-motion | Yes |

### UI Primitives (`src/components/ui/`)

All are shadcn/ui components:
`button`, `card`, `dialog`, `dropdown-menu`, `input`, `select`, `table`, `tabs`, `form`, `checkbox`, `radio-group`, `switch`, `toast` (sonner), `tooltip`, `badge`, `avatar`, `alert`, `skeleton`, `scroll-area`, `separator`, `slider`, `textarea`, `accordion`, `carousel`, `sheet`, `popover`, `hover-card`, `drawer`, `resizable`, `calendar`, `command`, `pagination`, `progress`, `sidebar`, `skeleton`, `menubar`, `toggle`, `toggle-group`, `input-otp`, `breadcrumb`, `alert-dialog`, `collapsible`, `context-menu`, `navigation-menu`, `aspect-ratio`, `label`, `chart`, `error-boundary`, `orb-background` (custom)

---

## Component Dependencies

```
AdminShell
  ├── Sidebar (ui/sidebar.tsx)
  ├── NavigationMenu (ui/navigation-menu.tsx)
  └── CommandPalette

LandingSections
  ├── OrbBackground (ui/orb-background.tsx) — lazy loaded
  ├── LandingBlockRender (memo'd)
  │   └── framer-motion animations
  └── ThemeProvider (lib/theme-provider.tsx)

AnalyticsCharts
  └── recharts (lazy loaded in admin only)

Blocks editor
  └── @dnd-kit (lazy loaded in admin only)
```

---

## Key Custom Components

### `OrbBackground` (`src/components/ui/orb-background.tsx`)
- Animated particle canvas (heavy, lazy loaded)
- Uses `requestAnimationFrame`
- **Known issue**: `window.matchMedia` called during render (not in effect) — already flagged in EPIC 3.7 as L3

### `ErrorBoundary` (`src/components/ui/error-boundary.tsx`)
- Catches render errors with fallback UI
- Logs via `console.error` and `reportLovableError`
- Used in root layout

---

## Component Reusability Status

| Component | Reusable | Notes |
|-----------|----------|-------|
| All `ui/*` components | ✅ Yes | Pure primitives |
| `AdminShell` | ✅ Yes | Layout shell |
| `SaveIndicator` | ✅ Yes | Generic auto-save |
| `ImageUploader` | ✅ Yes | File upload abstraction |
| `CommandPalette` | ✅ Yes | Navigation utility |
| `AnalyticsCharts` | ✅ Yes | Data-driven charts |
| `ThemePresetsCard` | ⚠️ Partially | Tightly coupled to theme settings |
| `LandingSections` | ⚠️ Partially | Large file (1753 lines), could be split |
| `Blocks` | ⚠️ Partially | Coupled to page_blocks schema |
