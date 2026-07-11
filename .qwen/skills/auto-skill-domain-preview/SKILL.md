---
name: domain-preview
description: How to preview a provisioned workspace's live rendered site on the existing *.vercel.app domain (no custom domain / wildcard DNS yet) via a gated ?preview_domain= query-param override, and the build-time-inlining caveat that the live deploy must be rebuilt with VITE_ENABLE_DOMAIN_PREVIEW=true.
source: auto-skill
extracted_at: '2026-07-11T04:37:11.321Z'
---

# Preview a provisioned workspace before custom DNS exists

## Problem this solves

You have provisioned a workspace (its `workspaces.domain` is e.g.
`khane.nama.app`) but the real custom domain / wildcard DNS is not wired up
yet (later step). You still need to visually test that workspace's live
rendered site on the **existing** deploy host (e.g. `panel-plum-alpha.vercel.app`)
without waiting for DNS.

## How workspace resolution actually works (verified)

- `resolveWorkspaceByDomain(domain, isSubdomain)` in
  `src/lib/core/workspace/resolver.ts` is a **pure lookup** — it does
  `findByDomain(domain)` (exact `eq("domain", domain)` on `workspaces.domain`)
  and, if `isSubdomain`, `findBySubdomain(...)`. It reads NO header/param.
- The **domain value fed to it** is NOT a Host header, path prefix, or query
  param. It comes from `extractDomainInfo()` in
  `src/lib/core/workspace/context.tsx`, which reads **`window.location.hostname`**
  (client-side, browser-only). The whole resolution chain
  (`CurrentWorkspaceProvider` → `extractWorkspaceFromPath` →
  `resolveWorkspaceFromRequest` → `resolveWorkspaceByDomain`) runs in the
  browser via `useEffect`. There is **no server-side Host reading** and **no
  preview / debug route** in the codebase.
- So on `panel-plum-alpha.vercel.app` the hostname never matches
  `khane.nama.app`; resolution falls back to user/default and the site renders
  "empty".

## The minimal override (implemented)

Added `extractPreviewDomain()` called at the top of `extractWorkspaceFromPath()`
in `src/lib/core/workspace/context.tsx`. When the build-time flag is on,
`?preview_domain=<domain>` forces exact-domain resolution (`isSubdomain: false`)
and wins over route params AND the real hostname:

```ts
function extractPreviewDomain(): string | undefined {
  if (import.meta.env.VITE_ENABLE_DOMAIN_PREVIEW !== "true") return undefined;
  if (typeof window === "undefined") return undefined;
  const value = new URLSearchParams(window.location.search).get("preview_domain")?.trim();
  return value ? value : undefined;
}
```

Flag documented in `.env.example` as `VITE_ENABLE_DOMAIN_PREVIEW` (default empty/disabled).

## ⚠️ Build-time-inlining caveat (the easy-to-miss part)

This is **client-side Vite** code. `import.meta.env.VITE_*` is **inlined at
build time**. The override only exists in the shipped JS bundle if the
deployment was built with `VITE_ENABLE_DOMAIN_PREVIEW=true`. Therefore, to make
the live URL work you MUST:

1. Set `VITE_ENABLE_DOMAIN_PREVIEW=true` in the **deploy host's build
   environment** for `panel-plum-alpha` (Vercel project env, or equivalent).
2. **Redeploy / rebuild** that project. (Just toggling the env in the running
   app does nothing — the code path was already compiled out.)

The gate is the env var itself: when it's off (default), the path is dead code
and the query param is silently ignored, so it can never work in a
production/customer-facing build unless someone explicitly sets the flag.

## Exact match requirement

`findByDomain` is an **exact, case-sensitive** `.eq` on `workspaces.domain`.
The `?preview_domain=` value must be byte-for-byte what's stored. Confirm the
workspace's `domain` column (e.g. exactly `khane.nama.app`, not `khane` or
`Khane.nama.app`); a mismatch returns nothing and you'll see the default/empty
site.

## URLs

- Live (after rebuild with flag):
  `https://panel-plum-alpha.vercel.app/?preview_domain=khane.nama.app`
- Local dev:
  `VITE_ENABLE_DOMAIN_PREVIEW=true npm run dev` then
  `http://localhost:5173/?preview_domain=khane.nama.app`
  (localhost works too — the override runs before the hostname check, which
  would otherwise early-return null on localhost.)

## Verification

Open the URL in a browser; the resolver should load that workspace's entity and
scope CMS queries (menu/gallery/events/blocks) to it. If you see the default
empty landing page, either (a) the flag wasn't set at build time, or (b) the
`preview_domain` string doesn't exactly match `workspaces.domain`.

## When to apply

Whenever asked to test / preview / render a provisioned workspace's public site
without its custom domain being live yet, or when adding any local-testing
override to the workspace resolver. Reuse the `VITE_`-prefixed, build-time-gated
pattern for any client-side-only feature flag in this project.
