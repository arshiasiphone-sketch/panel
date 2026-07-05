# Folder Map — NAMA Website Builder

## Root Level

| Folder/File | Purpose | Key Contents |
|-------------|---------|--------------|
| `src/` | Application source code | All application logic |
| `src/integrations/` | Third-party integrations | Supabase client, types |
| `src/lib/` | Library code | Core domain, services, utilities |
| `src/routes/` | Page routes (TanStack Router) | All route components |
| `src/components/` | Shared UI components | Landing, admin, UI primitives |
| `src/hooks/` | React hooks | `use-mobile.tsx` |
| `supabase/` | Supabase configuration | Config, migrations, edge functions |
| `docs/` | Project documentation | Audits, migration plans, intelligence index |
| `vite.config.ts` | Vite build configuration | — |
| `tsconfig.json` | TypeScript configuration | — |
| `components.json` | shadcn/ui configuration | — |

---

## `src/lib/` — Library Code (Core)

```
src/lib/
├── core/                    ← DOMAIN: Workspace + Provision Engine
│   ├── workspace/           ← EPIC 4A: Multi-tenant workspace
│   │   ├── types.ts         — Core interfaces (status, plan, limits, membership)
│   │   ├── entity.ts        — Entity helpers (status checks, plan tiers, limits)
│   │   ├── validation.ts    — Zod schemas for workspace operations
│   │   ├── factory.ts       — Workspace creation with plan-default limits
│   │   ├── policies.ts      — Authorization rules per role
│   │   ├── repository.ts    — Persistence via site_content table
│   │   ├── resolver.ts      — Workspace resolution from auth context
│   │   ├── service.ts       — Business logic orchestrator
│   │   ├── health.ts        — Runtime health checks
│   │   ├── context.tsx       — React context provider + hooks
│   │   └── index.ts         — Barrel exports
│   ├── workspace.ts         — Legacy compatibility layer (deprecated)
│   └── provision/           ← EPIC 4B: Provision Engine
│       ├── types.ts         — Blueprint, transaction, report types
│       ├── validation.ts    — Zod schemas for blueprints, requests, transactions
│       ├── transaction.ts   — Transaction state machine
│       ├── rollback.ts      — Rollback of failed provisions
│       ├── retry.ts         — Retry logic with exponential backoff
│       ├── validator.ts     — Pre-pipeline validation
│       ├── seeder.ts        — Initial data seeding
│       ├── health-checker.ts — Post-provision health verification
│       ├── report.ts        — Report generation
│       ├── engine.ts        — Pipeline orchestrator
│       ├── service.ts       — Public API facade
│       └── blueprint/       — Blueprint subsystem
│           ├── registry.ts  — Blueprint storage + indexing
│           ├── loader.ts    — Blueprint loading + caching
│           ├── versioning.ts — Semver management
│           └── installer.ts — Blueprint installation into workspace
│
├── repositories/            ← DATA ACCESS: All domain repositories
│   ├── base.ts              — BaseRepository (workspace awareness, DI, validation)
│   ├── factory.ts           — Repository factory + singleton management
│   ├── index.ts             — Barrel exports (avoids circular deps)
│   ├── menu.ts              — MenuRepository
│   ├── gallery.ts           — GalleryRepository
│   ├── events.ts            — EventsRepository
│   ├── testimonials.ts      — TestimonialsRepository
│   ├── pages.ts             — PagesRepository
│   ├── theme.ts             — ThemeRepository
│   ├── site-content.ts      — SiteContentRepository
│   ├── personality.ts       — PersonalityRepository
│   ├── media.ts             — MediaRepository
│   ├── test.ts              — TestRepository
│   ├── analytics.ts         — AnalyticsRepository
│   ├── auth.ts              — AuthRepository
│   └── menu.test.ts         — Menu repository tests
│
├── providers/               ← SERVICE IMPLEMENTATIONS: Supabase-backed
│   ├── index.ts             — Provider initialization + convenience exports
│   └── supabase/            — Supabase-specific implementations
│       ├── index.ts         — Factory functions (client + admin)
│       ├── database.provider.ts — IDatabaseProvider implementation
│       ├── storage.provider.ts  — IStorageProvider implementation
│       ├── auth.provider.ts     — IAuthProvider implementation
│       └── realtime.provider.ts — IRealtimeProvider implementation
│
├── interfaces/              ← CONTRACTS: Provider abstraction interfaces
│   ├── database.ts          — IDatabaseProvider + ITableQuery
│   ├── storage.ts           — IStorageProvider
│   ├── auth.ts              — IAuthProvider
│   ├── realtime.ts          — IRealtimeProvider
│   └── index.ts             — Barrel exports
│
├── theme/                   ← THEME ENGINE: CSS variable-based theming
│   ├── index.ts             — Public API
│   ├── types.ts             — Theme token types
│   ├── color.ts             — Color utilities (generation, contrast)
│   ├── defaults.ts          — Default knob values
│   ├── derive.ts            — Token derivation from knobs
│   ├── css-vars.ts          — CSS variable emitter (--nama-*)
│   ├── bridge.ts            — CMS-to-theme bridge
│   └── import-export.ts     — Theme import/export (json files)
│
├── components/              ← UI COMPONENTS
│   ├── admin/               — Admin panel components
│   ├── ui/                  — shadcn/ui primitives + custom (orb-background)
│   ├── landing/             — Landing page sections
│   └── test/                — Test page components
│
└── (other lib files)        — Utilities, analytics, CMS helpers, stores
    ├── utils.ts             — General utilities (createId, cn, etc.)
    ├── logger.ts            — Logging abstraction (NAMA-prefixed)
    ├── errors.ts            — Error hierarchy (BaseAppError, RepositoryError, etc.)
    ├── cms.ts               — CMS data fetching hooks
    ├── cms.functions.ts     — CMS server functions
    ├── cms-schemas.ts       — CMS Zod schemas
    ├── analytics.ts         — Client-side analytics tracking
    ├── analytics-hooks.ts   — React hooks for analytics
    ├── analytics.functions.ts — Server-side analytics functions
    ├── theme-provider.tsx   — Theme provider wrapper
    ├── theme-tokens.ts      — Legacy theme tokens (delegates to theme engine)
    ├── theme-presets.ts     — Theme preset definitions
    ├── test-data.ts         — Test questions/data
    ├── test-store.ts        — Test state management
    ├── test-db.ts           — Test database helpers
    ├── test-resolved.ts     — Test resolution utilities
    ├── personality-store.ts — Personality type state
    ├── lazy.tsx             — Lazy loading utilities
    ├── critical-css.ts      — Critical CSS generation
    ├── glassmorphism-utils.ts — Glass effect utilities
    ├── admin-store.ts       — Admin panel state
    ├── error-capture.ts     — Error reporting
    └── service-worker.ts    — PWA service worker
```

---

## Dependency Direction

```
providers/ → supabase/ (no dependencies on other layers)
interfaces/ → (no dependencies, pure type definitions)
repositories/ → providers/ + interfaces/ + workspace/types.ts
workspace/ → repositories/base.ts
provision/ → workspace/ + repositories/ + providers/
routes/ → components/ + lib/ + repositories/
components/ → lib/ + repositories/
```

### Circular Dependency Management

The workspace domain is carefully isolated to prevent circular deps:

1. **repositories/base.ts** imports from `workspace/types.ts` directly (NOT the barrel)
2. **repositories/factory.ts** imports `WorkspaceRepository` directly from its file
3. **workspace/context.tsx** uses dynamic `import()` for `repositories/factory`
4. **repositories/index.ts** barrel does NOT re-export workspace types

See `16-ai-context.md` for the circular dependency map.
