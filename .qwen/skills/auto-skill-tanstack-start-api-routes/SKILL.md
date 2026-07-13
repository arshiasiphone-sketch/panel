---
name: tanstack-start-api-routes
description: Correct file-based server/API route convention for @tanstack/react-start ~1.166-1.168 (createFileRoute + server.handlers); the route-tree regeneration gotcha, why tsc is not the deploy gate, and the actual Vercel build target.
source: auto-skill
extracted_at: '2026-07-08T15:30:27.397Z'
---

# TanStack Start — API / Server Routes (verified for v1.166–1.168)

## Problem this solves (learned the hard way)

In this project, `src/routes/api/health.ts` returned **HTTP 404** even though the
file existed. Dev-server startup printed:

```
Warning: Route file "...src/routes/api/health.ts" does not export a Route.
This file will not be included in the route tree.
```

Root cause: the file used the **wrong, stale convention**:

```ts
// WRONG for this version — import resolves to a non-existent subpath
import { createAPIFileRoute } from '@tanstack/react-start/api'
export const APIRoute = createAPIFileRoute('/api/health')({ GET: ... })
```

- `createAPIFileRoute` does **not** exist as a runtime export in any installed
  `@tanstack/*` package for v1.166–1.168.
- `@tanstack/react-start/api` is **not** in the package `exports` map (no `./api`
  key; `dist/esm` has no `api.js`). The only place the string appears is a bundled
  `skills/.../examples/06-low-level-flight-api-route.tsx` example that targets a
  *different* (newer/older) version — do not trust it.
- Because the route generator only recognizes a `Route` export (from
  `createFileRoute`), a file exporting `APIRoute` is excluded from the route tree,
  so the URL 404s.

## The CORRECT convention (extracted from the installed package, not docs)

Authoritative source inside `node_modules`:
`node_modules/@tanstack/start-client-core/skills/start-core/server-routes/SKILL.md`
(v1.166.2 — matches the installed `@tanstack/react-start@1.168.27`).

Server/API routes use **`createFileRoute`** from `@tanstack/react-router` with a
**`server.handlers`** map. The `Route` export makes the generator include the file;
`server.handlers` provides the HTTP endpoint.

```ts
// src/routes/api/health.ts  — CORRECT
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: () => {
        return Response.json({ status: 'ok' })
      },
    },
  },
})
```

- Path in `createFileRoute('/api/health')` must match the file location
  (`src/routes/api/health.ts` → `/api/health`).
- Handlers receive `{ request, params, context, pathname, next }`.
- Return a standard `Response` / `Response.json(...)`. Set status/headers via the
  `Response` constructor, e.g. `new Response(JSON.stringify(body), { status: 400, headers: {'Content-Type':'application/json'} })`.
- POST/PUT/DELETE work the same way: add a `POST:` handler. Parse body with
  `await request.json()` (must `await`).
- Per-handler middleware: `handlers: ({ createHandlers }) => createHandlers({ GET: ..., POST: { middleware: [auth], handler: ... } })`.

## How to VERIFY it actually works (mandatory — do not claim success without this)

1. **Fully restart** the dev server (kill the port, don't rely on HMR). The route
   tree is rebuilt at startup; an HMR edit may not re-include an excluded file.
   - Find/kill: `for /f "tokens=5" %a in ('netstat -aon ^| findstr :<PORT> ^| findstr LISTEN') do taskkill /F /PID %a`
   - Confirm free: `netstat -aon | findstr :<PORT> | findstr LISTEN` (expect empty)
   - Restart: `npm run dev` (background)
2. **Read the startup log.** The "does not export a Route" warning for your file
   must be **gone**. (Other files using the wrong convention will still warn — that
   is expected and fine.)
3. **curl the real endpoint** and show raw output:
   `curl -i http://localhost:8080/api/health`
   Success = `HTTP/1.1 200` + `content-type: application/json` + body `{"status":"ok"}`.
   Only report success if you personally see that raw 200.

## Gotcha: `tsc` false-positive on a newly added route file (route-tree regeneration)

When you ADD a new route file (e.g. `src/routes/api/provision.ts`), `npx tsc --noEmit`
immediately fails with:

```
src/routes/api/provision.ts(15,38): error TS2345: Argument of type '"/api/provision"' is not assignable to parameter of type 'keyof FileRoutesByPath | undefined'.
```

Root cause: `src/routeTree.gen.ts` is **stale**. The TanStack Router generator writes
it only when Vite runs (dev or build) — it is NOT updated by merely editing the file.
So `/api/provision` is absent from `FileRoutesByPath` until the tree is regenerated.

**`npx tsr generate` does NOT work in this project** — it errors
`No files matched the entrypoints pattern`. Reason: the router plugin is wired inside
`@lovable.dev/vite-tanstack-config`, not a standalone `tsr.config`, so the standalone
CLI cannot locate the entrypoints.

**Fix: regenerate by running the real build (or dev):**
```
npm run build        # node scripts/build.mjs -> vite build (regenerates routeTree.gen.ts)
```
After a successful build, re-running `tsc --noEmit` shows NO error for the new route
file. Confirm registration by grepping `routeTree.gen.ts` for the route id
(e.g. `id: '/api/provision'`).

## Gotcha: `tsc` is NOT the deploy gate in this project

The deploy build is `node scripts/build.mjs` → `vite build`, which transpiles with
**esbuild**, NOT `tsc`. Therefore pre-existing `tsc` errors do NOT block the Vercel
deploy. Known-benign `tsc` errors that persist even after a route is correctly built:
- `src/lib/core/provision/public-idempotency.ts` + `src/routes/api/public/provision-status.ts`:
  `provision_transactions` / `workspaces` missing from the (stale) `database.types.ts`
  — the generated Supabase type lags the live DB schema. Cosmetic for the deploy.
- `vite.config.ts(41,5)`: `vercel` preset key absent from the Nitro type defs shipped
  by the lovable config — cosmetic; the real Nitro build honors `preset: "vercel"`.

**Do not** treat a red `tsc --noEmit` as "the build failed." The authoritative gate is
`npm run build` succeeding AND emitting the route's SSR chunk
(`_ssr/<name>-*.mjs` under `.vercel/output/functions/__server.func/_ssr/`). That chunk
appearing is proof the route compiled into the deploy output.

## Project build/hosting target (verified — UPDATED this session)

- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, whose source sets Nitro
  `defaultPreset: "cloudflare-module"`. **But our `vite.config.ts` overrides this** with
  `nitro: { preset: "vercel", vercel: { functions: { maxDuration: 60 } }, ... }`.
  An explicit `preset` wins over `defaultPreset` in Nitro resolution, so **NO cloudflare
  output is produced** — the active target is **Vercel** (`.vercel/output`, Build Output
  API), NOT Cloudflare.
- Nitro runs **only on `build`**, not `dev`.
- `npm run build` → `node scripts/build.mjs` → forces `NODE_ENV=production` then
  `vite build`. The build script pins NODE_ENV *before* spawning vite so the SSR bundle
  gets the production JSX transform (a stray `NODE_ENV=development` on the host would
  otherwise emit `jsxDEV` and crash SSR with "jsxDEV is not a function").
- Custom `X-API-Key` headers / server-to-server (Convex) POSTs are fine on Vercel — no
  Lovable-specific CORS/header restriction applies at the edge.

## When to apply
Use this skill whenever adding or fixing a file-based HTTP endpoint under
`src/routes/**` in this TanStack Start project (incl. the stale-route-tree / `tsc`-
is-not-the-gate pitfalls), or when asked about the Vercel hosting target /
custom-header (X-API-Key) or CORS feasibility for external server-to-server calls.
