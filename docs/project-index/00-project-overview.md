# NAMA Website Builder — Project Overview

## Business Purpose

NAMA is a **multi-tenant website builder platform** that generates complete, customizable business websites from **Blueprint definitions** (pure data structures). Designed initially for Persian/Iranian markets (cafés, restaurants, portfolios), the platform supports full RTL/Persian localization, a comprehensive personality test engine, and complete admin CRUD.

## Product Vision

One Request → One Ready Website. Everything happens automatically through the Provision Engine.

Users request a website (e.g., "café"), and the Provision Engine:
1. Validates the request
2. Creates a workspace
3. Installs the blueprint (pages, blocks, navigation, theme, fonts, media, content)
4. Runs health checks
5. Transitions to active

All from **data definitions** — no React components need to change for new business types.

## Current Version

- **Version**: 1.0.0 (pre-release)
- **Last Migration**: `20260630000000_theme_engine_tokens.sql`
- **Runtime Audit Status**: EPIC 3.7 complete (21 findings: 2 critical, 5 high, 6 medium, 8 low)
- **Performance Audit**: Complete (10 steps)
- **Architecture Audit**: EPIC 4A/4B (this document)

## Architecture Overview

```
User → Auth → Workspace → Repositories → Providers → Supabase
         ↓
    Provision Engine
         ↓
    Blueprint Definitions (DATA)
```

### Layers (bottom-up)

| Layer | Location | Purpose |
|-------|----------|---------|
| **Infrastructure** | `src/integrations/supabase/` | Raw Supabase clients |
| **Providers** | `src/lib/providers/` | Abstracted service interfaces (DB, Auth, Storage, Realtime) |
| **Repositories** | `src/lib/repositories/` | Data access layer, extends `BaseRepository` |
| **Workspace** | `src/lib/core/workspace/` | Multi-tenant workspace domain |
| **Provision Engine** | `src/lib/core/provision/` | Automated website generation |
| **Services** | `src/lib/core/` | Business logic layer |
| **UI Layer** | `src/routes/`, `src/components/` | TanStack Router + React components |
| **Theme System** | `src/lib/theme/` | CSS variable-based theme engine |

### Key Architectural Decisions

1. **Workspace-centric** — All data access flows through workspace context, not directly through user identity
2. **Provider abstraction** — Supabase is wrapped behind interfaces (`IDatabaseProvider`, etc.) for future migration
3. **Blueprint-as-Data** — Blueprints are pure JSON stored in `site_content`, never React components
4. **Incremental workspace isolation** — Workspace ID columns not yet in data tables; filtering architecture-ready but inert
5. **Single-tenant default** — Current `DEFAULT_WORKSPACE` has no workspaceId, effectively single-tenant

## Completed Epics

| Epic | Description | Status |
|------|-------------|--------|
| **EPIC 1** | Core CMS — Site content, pages, blocks, menu, gallery, events | ✅ Complete |
| **EPIC 2** | Admin Panel — Full CRUD for all CMS entities, media, auth | ✅ Complete |
| **EPIC 3.7** | Runtime Audit — 21 findings, all documented with fixes | ✅ Complete |
| **EPIC 3** | Performance — Lazy loading, code splitting, image optimization, fonts | ✅ Complete |
| **EPIC 4A** | Workspace Lifecycle — Multi-tenant workspace architecture | ✅ Implemented (see audit) |
| **EPIC 4B** | Provision Engine — Automated website generation | ✅ Implemented (see audit) |

## Pending Epics

| Epic | Description | Priority |
|------|-------------|----------|
| **EPIC 5** | Workspace isolation — Add `workspace_id` columns to data tables | High |
| **EPIC 6** | Provision Engine fixes — Rollback workspace isolation, dedup fix | High |
| **EPIC 7** | Multi-tenant activation — Wire workspace selection UI | Medium |
| **EPIC 8** | Billing integration — Plan enforcement, Stripe | Medium |
| **EPIC 9** | Admin blueprint management UI | Medium |
| **EPIC 10** | Edge function deployment per workspace | Low |

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript 5** | Type safety |
| **TanStack Router** | File-based routing |
| **TanStack Query** | Server state management |
| **Supabase** | Database, Auth, Storage, Realtime |
| **Zod** | Schema validation |
| **Vite** | Build tool |
| **framer-motion** | Animations (~130KB gzipped, lazy loaded) |
| **recharts** | Charts (~80KB gzipped, admin only) |
| **lucide-react** | Icons (tree-shakeable) |
| **@dnd-kit** | Drag-and-drop (admin only) |
| **@fontsource/vazirmatn** | Persian font (self-hosted) |
| **shadcn/ui** | Component primitives |

## Dependencies

### External Services
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- No other external services currently integrated

### Internal Dependencies
```
workspace/ → repositories/ → providers/ → supabase/
provision/ → workspace/ + repositories/ + providers/
repositories/ → base.ts (circular deps carefully managed)
```

## Folder Structure

See `01-folder-map.md` for complete folder-level detail.
