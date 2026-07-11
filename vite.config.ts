// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// It defaults Nitro's `defaultPreset` to "cloudflare-module" (fallback only, used when `preset`
// is unset). We target Vercel, so we override `preset` to "vercel" — an explicit `preset` wins
// over `defaultPreset` in Nitro's resolution, so no cloudflare output is produced.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { createRequire } from "node:module";

// SSR CRASH FIX: a production SSR build MUST run with Vite `mode === "production"`.
// plugin-react decides the JSX transform from `config.isProduction` (= `mode === "production"`),
// NOT from `process.env.NODE_ENV`. Vite resolves `mode` BEFORE loading this file
// (`mode = options.mode || process.env.NODE_ENV || "production"`), so a stray
// `NODE_ENV=development` (e.g. on Vercel) locks `mode="development"` and plugin-react
// emits `jsxDEV`. Nitro then bundles PRODUCTION React into the SSR server, where
// `jsxDEV` is `void 0` → "jsxDEV is not a function" on every page.
// The build command (`vite build --mode production` in package.json) forces `mode` to
// "production", which beats `NODE_ENV` and makes `config.isProduction` true regardless
// of the host's environment. Do NOT remove that `--mode production` flag.


const require = createRequire(import.meta.url);
// tslib's ESM build: real named exports (__extends, __assign, ...). Nitro's default
// resolution picks the CJS UMD (tslib.js), which is what produced the broken interop.
const tslibEsm = require.resolve("tslib/tslib.es6.mjs");

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    // Target Vercel Build Output API (.vercel/output). Overrides the cloudflare-module default.
    preset: "vercel",
    // Vercel Hobby cap: Serverless functions max out at 60s wall-clock. Inline provisioning
    // pipeline (blueprint install + seeding) can exceed the 10s default, so we raise it to 60.
    vercel: { functions: { maxDuration: 60 } },
    // tslib must stay bundled (noExternals) so the deployed function never depends on
    // node_modules at runtime — Vercel's function runtime doesn't reliably ship the transitive
    // tslib that @supabase/supabase-js pulls in, which was the original ERR_MODULE_NOT_FOUND.
    // But plain noExternals inlined tslib's CJS UMD, which Rollup wrapped via __toESM() and
    // destructured as `{ __extends } = __toESM(...).default` — `.default` is undefined for CJS,
    // throwing at runtime. Aliasing tslib to its ESM build (tslib.es6.mjs, real named exports)
    // makes Rollup inline it as ESM, so the named imports resolve directly with no CJS interop.
    noExternals: ["tslib"],
    alias: {
      tslib: tslibEsm,
    },
  },
});
