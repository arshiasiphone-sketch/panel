---
name: tanstack-start-api-routes
description: Correct file-based server/API route convention for @tanstack/react-start ~1.166-1.168 (createFileRoute + server.handlers), how to verify it actually works via curl, and the project's Cloudflare build target.
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

## Project build/hosting target (verified)

- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`. Its source sets Nitro
  `defaultPreset: "cloudflare-module"` → `preset: "cloudflare-module"`,
  `cloudflare: { nodeCompat: true, deployConfig: true }`, output to `dist/`
  (`serverDir: dist/server`, `publicDir: dist/client`).
- Nitro runs **only on `build`**, not `dev`.
- There is **no** `vercel.json` / `Dockerfile` / `ecosystem.config.js` / CI config.
- Conclusion: the active build target is **Cloudflare Workers (`cloudflare-module`)**
  — a serverless/edge bundle, not a persistent Node server. Hosting is Cloudflare,
  not Lovable, so there is no Lovable-specific header/CORS restriction on custom
  `X-API-Key` headers or server-to-server (Convex) POSTs.
- Caveat: this derives from the still-active Lovable Vite plugin. To deploy to a
  VPS/pm2 or Vercel instead, override the Nitro preset, e.g.
  `tanstackStart({ ... })` → set `nitro: { preset: 'node-server' }` (or `'vercel'`).

## When to apply
Use this skill whenever adding or fixing a file-based HTTP endpoint under
`src/routes/**` in this TanStack Start project, or when asked about the production
hosting target / custom-header (X-API-Key) or CORS feasibility for external
server-to-server calls.
