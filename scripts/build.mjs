// Forces NODE_ENV=production into the environment BEFORE the real `vite build` CLI starts.
//
// Why this is needed (SSR crash "jsxDEV is not a function"):
// TanStack Start's SSR environment resolves its build mode from process.env.NODE_ENV (not from
// a CLI --mode flag), and @vitejs/plugin-react emits the dev JSX transform (jsxDEV) whenever that
// mode is "development". Nitro then bundles PRODUCTION React into the SSR server, where
// `jsxDEV` is `void 0` -> runtime crash on every page. A host that sets NODE_ENV=development at
// build time (e.g. Vercel) therefore produces a broken SSR bundle.
//
// Pinning NODE_ENV=production here — and spawning the vite CLI as a child so it inherits this
// env — guarantees the SSR mode is "production" regardless of the host's environment. (Setting it
// inside vite.config.ts is too late: Vite resolves `mode` from NODE_ENV before loading the config
// file, and calling vite.build() programmatically skips TanStack Start's SSR/Nitro pipeline.)
process.env.NODE_ENV = "production";

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const args = ["build", ...process.argv.slice(2)];

const child = spawn(process.execPath, [viteBin, ...args], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
