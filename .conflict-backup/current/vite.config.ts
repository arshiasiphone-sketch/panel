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
    // Fix ERR_MODULE_NOT_FOUND for "tslib" on Vercel. Nitro externalizes deps by default, but
    // the deployed function's node_modules doesn't reliably contain the transitive tslib pulled
    // in by @supabase/supabase-js. Force-bundling it inline removes the runtime import entirely.
    noExternals: ["tslib"],
  },
});
