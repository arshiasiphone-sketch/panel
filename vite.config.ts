// Self-contained Vite config for TanStack Start on Vercel.
// Replaces @lovable.dev/vite-tanstack-config (which could not be installed on
// Vercel's build environment). Mirrors its production plugin set:
//   - @tailwindcss/vite, vite-tsconfig-paths, @tanstack/react-start/plugin/vite,
//     nitro (vercel preset), @vitejs/plugin-react, lightningcss transformer,
//     "@" path alias, React/TanStack dedupe.
// Dev-only / sandbox plugins (hmr-gate, dev-server-bridge, assets-proxy,
// component-tagger, ssr/dev error loggers) are intentionally omitted — they are
// only needed inside the Lovable sandbox, not on Vercel.
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// tslib ESM interop fix (see prior comment): alias tslib to its ESM build so
// Nitro inlines real named exports instead of a CJS UMD that breaks at runtime.
const tslibEsm = require.resolve("tslib/tslib.es6.mjs");

export default defineConfig({
  css: { transformer: "lightningcss" },
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
    ignoreOutdatedRequests: true,
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      server: { entry: "server" },
    }),
    nitro({
      preset: "vercel",
      vercel: { functions: { maxDuration: 60 } },
      noExternals: ["tslib"],
      alias: { tslib: tslibEsm },
    }),
    react(),
  ],
});
