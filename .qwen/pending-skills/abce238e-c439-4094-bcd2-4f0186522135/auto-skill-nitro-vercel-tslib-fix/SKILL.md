---
name: nitro-vercel-tslib-fix
description: Fix for Nitro-on-Vercel tslib failures — ERR_MODULE_NOT_FOUND (tslib not in function node_modules) and the runtime TypeError: Cannot destructure '__extends' of '__toESM(...).default' (CJS interop of an inlined UMD). Use the nitro.alias → tslib.es6.mjs ESM fix. Verified on Nitro 3.0.x + @lovable.dev/vite-tanstack-config 2.6.2.
source: auto-skill
extracted_at: '2026-07-09T17:02:40.617Z'
---

# Nitro on Vercel — tslib bundle fix (ERR_MODULE_NOT_FOUND + `__extends` destructure crash)

Applies to the TanStack Start + `@lovable.dev/vite-tanstack-config` + Nitro
(`vercel` preset) stack. Two distinct, sequentially-appearing tslib bugs:

## Symptom A — `ERR_MODULE_NOT_FOUND: Cannot find package 'tslib'`
Vercel runtime throws this at request time. The function's `node_modules`
does **NOT** reliably contain the tslib that `@supabase/supabase-js` pulls in
transitively — this happens even when `tslib` is a *direct* `dependencies`
entry in `package.json` and pushed. So externalizing tslib is unsafe.

## Symptom B — runtime `TypeError: Cannot destructure property '__extends' of '__toESM(...).default' as it is undefined`
Appears AFTER fixing A with `nitro.noExternals: ["tslib"]`. Stack trace points
at a generated `_libs/<lib>+[...].mjs:7` (e.g. `@radix-ui/react-dialog`).
The build itself succeeds — the crash is **runtime only**, which is why a
plain `npm run build` never catches it.

### Root cause (B)
`noExternals` inline-bundles tslib, but Nitro's default resolution picks
tslib's **CJS UMD** (`tslib.js`). Rollup wraps that as
`__toESM(__commonJSMin((exports, module) => { ... }))`, whose `.default` is
`undefined`. The consumer then does
`var { __extends, __assign, ... } = __toESM(...)` at module top-level and
throws because it can't destructure named props off `undefined`.

## The fix (handles BOTH A and B)
Keep tslib **bundled** (so A can't return) AND alias it to its **ESM** build
so it's inlined as ESM (real named exports, no CJS interop):

```ts
// vite.config.ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// Resolves tslib's ESM build (real named exports: __extends, __assign, ...).
// Nitro's default resolution otherwise picks the CJS UMD (tslib.js) → broken interop.
const tslibEsm = require.resolve("tslib/tslib.es6.mjs");

export default defineConfig({
  nitro: {
    preset: "vercel",
    // keep noExternals so tslib is INLINED (Vercel won't ship the transitive
    // tslib → externalizing reintroduces ERR_MODULE_NOT_FOUND)
    noExternals: ["tslib"],
    // point the inlined tslib at the ESM entry instead of the CJS UMD
    alias: { tslib: tslibEsm },
  },
});
```
Do **NOT** "just remove `noExternals`" — that reintroduces Symptom A on Vercel.
Both keys are required together.

### Why `nitro.alias` (not only `vite.resolve.alias`)
`@lovable.dev/vite-tanstack-config` merges a user `vite` block via
`vite.mergeConfig`, but the **server function** is built by Nitro's own
rollup. `nitro.alias` is the server-build-native path
(`Record<string, string>`, top-level; confirmed in
`node_modules/nitro/dist/types/index.d.mts` → `alias: Record<string, string>`).
A string absolute path value is fine.

## Verification (must run BEFORE deploying — build success is NOT enough)
1. `npm run build` → check `.vercel/output/functions/__server.func` exists.
2. Grep the whole `__server.func` dir for `tslib`:
   - ✅ Allowed: `//#region node_modules/tslib/tslib.es6.mjs` (inlined ESM).
   - ❌ Forbidden: any `tslib.js`, `tslib/tslib.js`, or external
     `from "tslib"` / `import "tslib"` (either bug still present).
   Expect exactly one `tslib` reference: the inlined ESM chunk.
3. **Node import test of the previously-crashing `.mjs`** (this is the exact
   test that proves the runtime crash is gone):
   - The filename contains `[...]`, so resolve it via `fs.readdirSync` rather
     than a shell glob. Write a temp `.mjs`:
     ```js
     import { readdirSync } from "node:fs";
     import { pathToFileURL } from "node:url";
     import { join } from "node:path";
     const dir = join(process.cwd(), ".vercel/output/functions/__server.func/_libs/@radix-ui");
     const file = readdirSync(dir).find((f) => f.startsWith("react-dialog"));
     await import(pathToFileURL(join(dir, file)).href);
     console.log("PASS: imported without throwing");
     ```
   - Run `node test-tslib-import.mjs`. If it loads without throwing, the
     `__extends` destructure crash is fixed. If it throws
     `Cannot destructure property '__extends'...` you still have the CJS build.
4. Only after steps 1–3 pass: deploy and `curl` `GET /` and
   `GET /api/public/blueprints` expecting `200` (not `500`).

## When to apply
Any Nitro-on-Vercel build where a dep with a CJS + ESM dual entry (tslib, or
similar UMD-with-named-exports packages) gets `noExternals`'d or externalized
and produces an `ERR_MODULE_NOT_FOUND` or a `__toESM(...).default` destructure
crash. The same `nitro.alias → <pkg>.esm` pattern works for other libs that
ship a broken CJS interop when inlined.
