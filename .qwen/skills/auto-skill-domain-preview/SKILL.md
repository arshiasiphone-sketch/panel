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

## GitHub push / Vercel auto-deploy — the common misconception

When asked *"if I push this to GitHub, will the routes work differently?"* the
answer is **not** "yes, the push changes routing." A GitHub push only matters
because Vercel **auto-deploys** the connected branch, which triggers a rebuild.
What changes at runtime depends on the build, not the push:

- **Code fixes take effect on ANY rebuild.** e.g. a `theme.ts` Signature-B fix
  (see `workspace-isolation`) self-flips provisions on the next deploy with no
  extra setting.
- **`?preview_domain=` only activates if `VITE_ENABLE_DOMAIN_PREVIEW=true` was
  set in the DEPLOY build environment** (Vercel project env var) AND the deploy
  was rebuilt. Pushing code alone does NOT set this flag — the flag is a
  Vercel project env var that **persists across deploys**. If it is absent, the
  param stays inert and routes behave exactly as before.
- **Data operations are NOT re-triggered by a code push.** e.g. a one-off
  DEFAULT re-seed was a data op already applied; pushing code won't re-run it
  (and `_reset_default.mjs` is dry-run unless `FORCE=1`).

So: deploying changes behavior only via (a) code fixes (automatic) and
(b) build-time env flags (must be set in Vercel, not the push). The DEFAULT
re-seed / content fixes are data-level and independent of the push.

### Verify whether the LIVE deploy was built with the flag

`scripts/diag_bundle.mjs` fetches the shipped bundle from the live Vercel host
(`https://panel-plum-alpha.vercel.app/`), collects the JS module URLs, and
greps them for `preview_domain` and the `VITE_ENABLE_DOMAIN_PREVIEW` literal.
Because Vercel env vars persist across deploys, this also tells you what the
NEXT build from a push will contain:

```bash
node scripts/diag_bundle.mjs
# → "bundle references 'preview_domain':" true|false
# → "flag context snippet:"  VITE_ENABLE_DOMAIN_PREVIEW=...   (or "unknown")
```

If `preview_domain` is absent from the bundle, the live (and next) deploy was
NOT built with the flag → the param is dead code there.

### When the shell can't run `diag_bundle.mjs` (blocked shell / can't run node)

You can run the same `preview_domain`-present check **entirely from the browser
DevTools console** on the preview URL — no node, no `.env`. **Gotcha:** do NOT
try `import.meta.env.VITE_ENABLE_DOMAIN_PREVIEW` in the console. The console
evaluates as a **classic script, not an ES module**, so it throws
`SyntaxError: Cannot use 'import.meta' outside a module`. Instead, fetch the live
bundle HTML, pull each JS chunk URL, fetch the chunks, and grep for the literal
(the same logic `diag_bundle.mjs` uses):

```js
fetch(location.href).then(r=>r.text()).then(html=>{
  const urls=[...html.matchAll(/(?:src|href)="([^"]+\.js[^"]*)"/g)].map(m=>new URL(m[1],location.href).href);
  return Promise.all(urls.map(u=>fetch(u).then(r=>r.text()).catch(()=> "")));
}).then(chunks=>{
  const all=chunks.join("\n");
  console.log("JS chunks checked:", chunks.length);
  console.log("'preview_domain' present in bundle:", all.includes("preview_domain"));
});
```

- `false` → flag NOT inlined → Vercel "Redeploy" reused the old env snapshot.
  Set `VITE_ENABLE_DOMAIN_PREVIEW=true` in Vercel **scoped to Production** and
  trigger a **fresh build** (a plain Redeploy does NOT re-read an env var added
  after the build was made).
- `true` → flag shipped; the failure is a domain lookup/mismatch issue, not the
  build flag.

### Discriminating a domain mismatch vs an anon-read block (console REST query)

When `preview_domain` IS in the bundle but the workspace still resolves to
DEFAULT, the remaining causes are (b1) `workspaces.domain` isn't exactly the
`?preview_domain` string, or (b2) the anon read is blocked at runtime. Replicate
the resolver's exact `findByDomain` (and list every stored domain) from the
console using the app's own anon key + Supabase URL, which Vite inlined as
literals into the bundle:

```js
(async () => {
  const html = await (await fetch(location.href)).text();
  const urls = [...html.matchAll(/(?:src|href)="([^"]+\.js[^"]*)"/g)].map(m => new URL(m[1], location.href).href);
  let bundle = html;
  for (const u of urls) { try { bundle += "\n" + await (await fetch(u)).text(); } catch {} }
  const supaUrl = (bundle.match(/https:\/\/[a-z0-9-]+\.supabase\.co/g) || [])[0];
  const anonKey = (bundle.match(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/) || [])[0];
  console.log("supabase url:", supaUrl, "| anon key found:", !!anonKey);
  if (!supaUrl || !anonKey) { console.log("could not extract config"); return; }
  const h = { apikey: anonKey, Authorization: "Bearer " + anonKey };
  const r1 = await fetch(`${supaUrl}/rest/v1/workspaces?domain=eq.khane.nama.app&select=id,domain,status`, { headers: h });
  console.log("findByDomain('khane.nama.app') ->", JSON.stringify(await r1.json()));
  const r2 = await fetch(`${supaUrl}/rest/v1/workspaces?select=id,domain,status&order=created_at`, { headers: h });
  const all = await r2.json();
  console.log("ALL workspaces (id | domain | status):");
  for (const w of all) console.log(`  ${String(w.id).slice(0,8)} | ${w.domain} | ${w.status}`);
})();
```

Read it:
- `findByDomain` returns the row → lookup works; the bug is elsewhere (e.g. the
  resolved `workspaceId` not reaching `setWorkspaceOnRepositories`).
- `findByDomain` returns `[]` but a khane row exists with `domain` null/different
  → NULL/domain-mismatch. Fix: `UPDATE workspaces SET domain='khane.nama.app'
  WHERE ...` (or re-provision).
- `findByDomain` returns `[]` AND "ALL workspaces" is empty for the anon key →
  the anon read is blocked by RLS at runtime (contrary to migration
  `20260707000001` "public read workspaces" / `GRANT SELECT ... TO anon`) → DB
  policy fix, not code.

This console-REST approach is the dependable fallback whenever the agent shell
is blocked and you must inspect live DB state or verify a build flag without
running node.

## When to apply

Whenever asked to test / preview / render a provisioned workspace's public site
without its custom domain being live yet, or when adding any local-testing
override to the workspace resolver. Reuse the `VITE_`-prefixed, build-time-gated
pattern for any client-side-only feature flag in this project.
