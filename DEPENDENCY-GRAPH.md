# DEPENDENCY-GRAPH

## Circular Dependency Analysis (Phase 13)

### Verification Method

Manual review of import chains across all modules. Key cycles were checked by tracing import statements.

### Verified: NO CIRCULAR DEPENDENCIES

| Potential Cycle | Status | Breaking Mechanism |
|-----------------|--------|-------------------|
| `workspace/barrel → repository/factory` | ❌ Broken | `context.tsx` uses `import()` (dynamic) to defer `factory` resolution |
| `repository/barrel → workspace/barrel` | ❌ Broken | `base.ts` imports from `types.ts` directly (not barrel) |
| `provision/index → repository/index` | ✅ One-way | Provision imports repositories; no reverse imports |
| `workspace/index → provision/index` | ✅ One-way | Workspace has zero imports into provision module |
| `factory → repositories → workspace → factory` | ❌ Broken | Cycle broken by dynamic import + direct file import |
| `providers → repositories → workspace → providers` | ✅ One-way | Providers have no workspace imports |

### Import Graph (Full)

```
src/lib/core/provision/
  engine.ts
    → ./types, ./session-context, ./steps
    → ./blueprint/loader, ./transaction, ./validator, ./report
    → ../workspace/factory, ../workspace/repository
    → ../../logger, ../../repositories/factory

  validator.ts
    → ./types, ./validation, ./blueprint/loader
    → ../workspace/repository
    → ../../repositories/base, ../../logger

  service.ts
    → ./engine, ./steps, ./blueprint/* (registry, loader, versioning)
    → ./transaction, ./validator, ./report
    → ../workspace/repository
    → ../../repositories/factory, ../../logger

src/lib/core/workspace/
  context.tsx
    → ./types, ./resolver, ./health, ./entity
    → Dynamic import: ../../repositories/factory ← BREAKS CYCLE
    → ../../logger

  resolver.ts
    → ./types, ./repository, ./factory
    → ../../core/repository-cache

src/lib/repositories/
  factory.ts
    → ./base, ./menu, ./gallery, ./events, ./testimonials
    → ./pages, ./theme, ./site-content, ./personality
    → ./media, ./test, ./analytics, ./auth
    → ../core/workspace/repository (direct file) ← BREAKS CYCLE

  base.ts
    → ../../interfaces (database, storage, auth, realtime)
    → ../core/workspace/types (direct file, NOT barrel) ← BREAKS CYCLE
    → ../../logger, ../../errors

src/lib/providers/
  index.ts
    → ./supabase
    → ../../lib/repositories
    → ../../lib/core/workspace (types, exports)
```

### Key Architectural Rules

1. **No barrel imports in `base.ts`** — Imports `WorkspaceContext` directly from `types.ts` instead of barrel to avoid `factory → barrel → context → factory` cycle
2. **Dynamic imports for context** — `CurrentWorkspaceProvider` uses `import()` to defer factory resolution to runtime
3. **Provision → Repositories → Providers → Database** — Data flows one direction through layers
4. **Workspace → Repositories** — One-way; repositories never import workspace barrel
5. **No hidden dependencies** — All dependencies are explicit constructor injections
