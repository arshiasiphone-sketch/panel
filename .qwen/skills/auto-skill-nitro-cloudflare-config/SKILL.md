---
name: nitro-cloudflare-config
description: How Nitro cloudflare-module auto-generates wrangler config (defu merge — custom bindings/queues/crons survive), how to define Cron Triggers via Nitro Tasks, how to consume Queues via the cloudflare:queue hook, and the CPU-time vs wall-clock measurement caveat. Source-proven for Nitro 3.0.x.
source: auto-skill
extracted_at: '2026-07-08T17:21:12.818Z'
---

# Nitro `cloudflare-module` — Wrangler Config, Cron Triggers, Queues

Verified by reading `node_modules/nitro/dist/_presets.mjs` and
`node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs`
in this project (Nitro `3.0.260603-beta`). Applies to the TanStack Start +
`@lovable.dev/vite-tanstack-config` stack targeting Cloudflare Workers.

## 1. Nitro auto-generates `wrangler.json` — NOT `.toml`

`writeWranglerConfig(nitro, cfTarget)` (in `_presets.mjs`) only runs when
`nitro.options.cloudflare?.deployConfig` is true:

```js
if (!nitro.options.cloudflare?.deployConfig) return;
```

When it runs it writes **`wrangler.json`** (JSON) into the build output dir:
`join(nitro.options.output.serverDir, "wrangler.json")` (i.e. `dist/server/wrangler.json`),
plus a pointer `.wrangler/deploy/config.json` at `rootDir`.

`deployConfig` default: the cloudflare preset's `enableNodeCompat` sets
`nitro.options.cloudflare.deployConfig ??= true` and `nodeCompat ??= true`.
In THIS project, `@lovable.dev/vite-tanstack-config` sets `cloudflare:
{nodeCompat:true, deployConfig:true}` only inside `if(isSandbox)`; but the
preset itself still defaults both true, so generation happens on a normal
build too. (If someone sets `cloudflare.deployConfig:false`, Nitro stops
generating any wrangler file and you own it entirely.)

## 2. Custom wrangler entries SURVIVE regeneration (merged, not wiped)

This is the key non-obvious fact. `writeWranglerConfig` does NOT overwrite
your config — it **reads your nearest source file and merges it**:

```js
async function readWranglerConfig(nitro) {
  const configPath = await findNearestFile(
    ["wrangler.json", "wrangler.jsonc", "wrangler.toml"],
    { startingFrom: nitro.options.rootDir }).catch(() => void 0);
  if (!configPath) return {};
  const userConfigText = await readFile(configPath, "utf8");
  const parser = extensionParsers[extname(configPath)]; // .toml → toml parser
  return { configPath, config: parser(userConfigText) };
}

// in writeWranglerConfig:
const { config: userConfig = {} } = await readWranglerConfig(nitro);
const ctxConfig = nitro.options.cloudflare?.wrangler || {};
const wranglerConfig = defu(overrides, ctxConfig, userConfig, defaults);
//                       ↑nitro    ↑nitrocfg  ↑YOURS   ↑defaults
```

- `userConfig` = your source `wrangler.json` / `.jsonc` / `.toml`.
- `defu` keeps unknown keys — `triggers`, `queues`, `bindings`, `vars`,
  `r2_buckets`, `d1_databases`, etc. all pass through untouched.
- Only `main`, `pages_build_output_dir`, `assets.directory`, `assets.binding`
  are Nitro-controlled (`overrides`); if you set them you get a warning:
  `[cloudflare] Wrangler config \`${key}\` ... is overridden and will be ignored.`
- Cron triggers are **appended**, never replaced:
  ```js
  wranglerConfig.triggers = defu(wranglerConfig.triggers, { crons: [] });
  const existingCrons = new Set(wranglerConfig.triggers.crons);
  for (const schedule of schedules)
    if (!existingCrons.has(schedule)) wranglerConfig.triggers.crons.push(schedule);
  ```

**Practical rules**
- Put custom `[triggers] crons`, `[[queues.producers]]`, `[[queues.consumers]]`,
  bindings, vars in a **source `wrangler.json`** (recommended) or `wrangler.toml`
  at repo root. They survive every rebuild via the `defu` merge.
- Equivalent: set them via `nitro: { cloudflare: { wrangler: { ... } } }` in
  `vite.config.ts` (lands in `ctxConfig`, equally preserved).
- Do **NOT** hand-edit `dist/server/wrangler.json` — regenerated each build,
  gitignored. Your source file is the single source of truth.
- Nitro emits `wrangler.json` (JSON). If you keep a `wrangler.toml` source,
  Nitro reads it and writes a sibling `wrangler.json` in `dist/`. Keep ONE
  source file (prefer `.json`/`.jsonc`).

## 3. Cron Triggers via Nitro Tasks (native `cloudflare_module` integration)

`cloudflare_module` / `cloudflare_pages` have native Cron Trigger support.
Doc: `node_modules/nitro/dist/docs/0.docs/13.tasks.md` — *"Nitro automatically
generates the cron triggers in the wrangler config at build time - no manual
wrangler setup required."*

Runtime wiring (`_module-handler.mjs`):
```js
scheduled(controller, env, context) {
  globalThis.__env__ = env;
  context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", { controller, env, context }) || Promise.resolve());
  if (import.meta._tasks) {
    context.waitUntil(runCronTasks(controller.cron, {
      context: { cloudflare: { env, context } }, payload: {} }));
  }
},
```

Convention (this framework version):
1. Enable in Nitro config (TanStack Start passes it through the Lovable
   `defineConfig({ nitro })` → `userNitroOpts`):
   ```ts
   // vite.config.ts
   export default defineConfig({
     nitro: {
       experimental: { tasks: true },
       scheduledTasks: { "*/5 * * * *": ["provision:reconcile"] },
     },
   });
   ```
2. Define task(s) under `src/tasks/**` — scanned by `scanTasks` →
   `scanFiles(nitro, "tasks")` from `srcDir` (= `src`). Nested dirs become
   `:`-joined names (`src/tasks/db/migrate.ts` → `db:migrate`).
   ```ts
   // src/tasks/provision/reconcile.ts
   import { defineTask } from "nitro";
   export default defineTask({
     meta: { name: "provision:reconcile" },
     run: async ({ payload, context }) => {
       context.waitUntil?.(/* optional */);
       return { result: "ok" };
     },
   });
   ```
   `payload.scheduledTime` is auto-set to `Date.now()`. Build-time cron
   injection (§2) only happens when `experimental.tasks` + `scheduledTasks`
   are set and `cfTarget !== "pages"`.

## 4. Queue consumer via the `cloudflare:queue` hook

The preset wires a `queue()` handler (`_module-handler.mjs`):
```js
queue(batch, env, context) {
  globalThis.__env__ = env;
  context.waitUntil(nitroHooks.callHook("cloudflare:queue", { batch, event: batch, env, context }) || Promise.resolve());
},
```
App code consumes it via a Nitro plugin (scanned from `src/plugins/*.ts`):
```ts
// src/plugins/queue-consumer.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("cloudflare:queue", async ({ batch, env, context }) => {
    for (const message of batch.messages) { /* process */ }
  });
});
```
The `[[queues.consumers]]` binding lives in your source `wrangler.json`
(survives per §2). Note: tasks/plugins use the Nitro `src/tasks` & `src/plugins`
scan convention — distinct from the TanStack `createFileRoute` API-route
convention used for `src/routes/api/*`.

## 5. CPU-time vs wall-clock measurement caveat (Cloudflare Workers)

When verifying a Worker step's cost locally, `performance.now()` measures
**wall-clock in your dev server** — it includes network RTT to Supabase/DB and
dev-server cold-compile, NONE of which is Cloudflare CPU billing. I/O wait
(`await` on a fetch/DB call) does **not** count against Workers CPU time.
- A local wall-clock reading of 0.6–2.0s for a single DB call is network
  RTT, not CPU. It does **not** prove Free-plan CPU safety.
- Real CPU time can only be measured on a **deployed** Worker via the
  Cloudflare dashboard "CPU time" metric per invocation. Free plan allows
  up to 10ms CPU / request and 100k requests/day.
- Never claim production CPU-time safety from a local `performance.now()`
  measurement. State the limitation explicitly.

## When to apply
Use this skill whenever working on the Cloudflare Workers deployment of this
project: deciding between Cron Triggers / Queues / polling, adding custom
bindings or `wrangler.json` entries, wondering whether hand-edits to the
generated config survive, defining scheduled tasks or queue consumers, or
measuring per-invocation cost. Complements `auto-skill-tanstack-start-api-routes`
(which covers the `src/routes/api/*` HTTP endpoint convention).
