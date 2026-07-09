# Provisioning Architecture: Cron+Poll vs Queues — Verification Report (TEST 4 & 5)

**Scope:** Investigation-only verification. No endpoints, no provisioning code built.
**Stack:** TanStack Start + Nitro `cloudflare-module` + `@lovable.dev/vite-tanstack-config`, target = Cloudflare Workers.
**Nitro version:** `3.0.260603-beta` (from `node_modules/nitro`).

---

## Q1 — Will custom `wrangler.toml` entries survive Nitro's auto-regeneration, or get wiped?

**Answer: They SURVIVE. Nitro MERGES (not overwrites) your source config via `defu`. Custom entries are never wiped — only `main`/`pages_build_output_dir`/`assets` are Nitro-controlled (with a warning).**

### Exact source evidence

`node_modules/nitro/dist/_presets.mjs` — `writeWranglerConfig(nitro, cfTarget)`:

1. **Generation is gated by `deployConfig`** (so a regenerated file only exists when this is on):
   ```js
   if (!nitro.options.cloudflare?.deployConfig) return;
   ```

2. **It READS your nearest source file (json / jsonc / toml) first:**
   ```js
   async function readWranglerConfig(nitro) {
     const configPath = await findNearestFile(
       ["wrangler.json", "wrangler.jsonc", "wrangler.toml"],
       { startingFrom: nitro.options.rootDir }
     ).catch(() => void 0);
     if (!configPath) return {};
     const userConfigText = await readFile(configPath, "utf8");
     const parser = extensionParsers[extname(configPath)]; // .toml → toml parser
     ...
     return { configPath, config: parser(userConfigText) };
   }
   ```

3. **It MERGES with `defu` — your config is the third layer (preserved), not the last:**
   ```js
   const { config: userConfig = {} } = await readWranglerConfig(nitro);
   const ctxConfig = nitro.options.cloudflare?.wrangler || {};
   const wranglerConfig = defu(overrides, ctxConfig, userConfig, defaults);
   //                       ↑nitro    ↑nitrocfg  ↑YOURS   ↑defaults
   ```
   `userConfig` is your source `wrangler.json`/`.toml`. `defu` does NOT drop unknown keys — `triggers`, `queues`, `bindings`, `vars`, `r2_buckets`, etc. all pass straight through.

4. **Only `main` / `pages_build_output_dir` / `assets.directory` / `assets.binding` are overridden — and you get a warning, you don't get silence:**
   ```js
   for (const key in overrides)
     if (key in userConfig || key in ctxConfig)
       nitro.logger.warn(`[cloudflare] Wrangler config \`${key}\` ... is overridden and will be ignored.`);
   ```
   `overrides.main` is the generated `index.mjs`; `overrides.assets` is `{ binding: "ASSETS", directory: <client> }`. **Cron triggers and queue bindings are never in `overrides`, so they are never clobbered.**

5. **Cron triggers are *appended*, never replaced** — your manual crons are kept AND Nitro adds its own:
   ```js
   if (nitro.options.experimental.tasks &&
       Object.keys(nitro.options.scheduledTasks || {}).length > 0 && cfTarget !== "pages") {
     const schedules = Object.keys(nitro.options.scheduledTasks);
     wranglerConfig.triggers = defu(wranglerConfig.triggers, { crons: [] });
     const existingCrons = new Set(wranglerConfig.triggers.crons);
     for (const schedule of schedules)
       if (!existingCrons.has(schedule)) wranglerConfig.triggers.crons.push(schedule);
   }
   ```

6. **Output location** — the generated file is written into the BUILD output dir (gitignored, regenerated), not over your source:
   ```js
   const wranglerConfigPath = join(wranglerConfigDir, "wrangler.json"); // output.serverDir
   await writeFile(wranglerConfigPath, JSON.stringify(wranglerConfig, null, 2), true);
   ```

### Practical consequences for THIS project
- ✅ Put custom `[triggers] crons`, `[[queues.producers]]`, `[[queues.consumers]]`, and any bindings in a **source `wrangler.json`** (recommended) or `wrangler.toml` at repo root. They survive every rebuild via the `defu` merge.
- ⚠️ Nitro writes **`wrangler.json`** (JSON), not `.toml`. If you keep a `wrangler.toml` source, Nitro reads it and emits a sibling `wrangler.json` in `dist/`. Keep ONE source file (prefer `wrangler.json`/`.jsonc`).
- ⚠️ Do **NOT** hand-edit `dist/server/wrangler.json` — it is regenerated each build and gitignored. Your source file is the single source of truth.
- ⚠️ `deployConfig` must be `true`. In THIS project it is auto-true inside the Lovable sandbox (config sets `cloudflare: { nodeCompat: true, deployConfig: true }`); locally the `cloudflare-module` preset's `enableNodeCompat` also sets `deployConfig ??= true`. (If someone ever sets `cloudflare.deployConfig: false`, Nitro stops generating any wrangler file and you own it entirely.)
- ✅ Equivalent alternative: set bindings via `nitro: { cloudflare: { wrangler: { ... } } }` in `vite.config.ts` — this lands in `ctxConfig` (second merge layer), equally preserved.

---

## Q2 — Does this exact setup provide a documented way to define a Cron Trigger handler in app code?

**Answer: YES. `cloudflare_module` has native Cron Trigger integration via Nitro Tasks. There is a precise, version-specific convention.**

### Source evidence — runtime wiring

`node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs`:
```js
scheduled(controller, env, context) {
  globalThis.__env__ = env;
  context.waitUntil(
    nitroHooks.callHook("cloudflare:scheduled", { controller, env, context }) || Promise.resolve()
  );
  if (import.meta._tasks) {
    context.waitUntil(runCronTasks(controller.cron, {
      context: { cloudflare: { env, context } },
      payload: {}
    }));
  }
},
```
The preset wires the Worker's `scheduled()` export and routes it to `runCronTasks(cron)`, which dispatches to your task(s) mapped to that cron. A bare user `scheduled()` export is NOT how it works — Nitro's task system is the supported path.

The `queue()` consumer is wired the same way:
```js
queue(batch, env, context) {
  globalThis.__env__ = env;
  context.waitUntil(
    nitroHooks.callHook("cloudflare:queue", { batch, event: batch, env, context }) || Promise.resolve()
  );
},
```

### Source evidence — build-time cron generation

`_presets.mjs` (see Q1 step 5): when `experimental.tasks` + `scheduledTasks` are set, Nitro injects `triggers.crons` automatically. The docs confirm it (`node_modules/nitro/dist/docs/0.docs/13.tasks.md`):
> `cloudflare_module` and `cloudflare_pages` presets have native integration with Cron Triggers. Nitro automatically generates the cron triggers in the wrangler config at build time — no manual wrangler setup required.

### The exact app-code convention (this framework version)

1. **Enable tasks** in Nitro config (TanStack Start passes this through the Lovable `defineConfig({ nitro })` → `userNitroOpts`):
   ```ts
   // vite.config.ts
   export default defineConfig({
     nitro: {
       experimental: { tasks: true },
       scheduledTasks: { "*/5 * * * *": ["provision:reconcile"] }
     }
   });
   ```

2. **Define the task** under `src/tasks/**` (scanned via Nitro `scanTasks` → `scanFiles(nitro, "tasks")` from `srcDir` = `src`; nested dirs → `:`-joined names, e.g. `src/tasks/db/migrate.ts` = `db:migrate`):
   ```ts
   // src/tasks/provision/reconcile.ts
   import { defineTask } from "nitro";
   export default defineTask({
     meta: { name: "provision:reconcile" },
     run: async ({ payload, context }) => {
       // poll/reconcile pending provisioning records
       context.waitUntil?.(/* optional long-running */);
       return { result: "ok" };
     }
   });
   ```
   `payload.scheduledTime` is auto-set to `Date.now()`. `context.waitUntil?.()` extends the Worker lifetime (bounded by Cron Trigger 30s CPU / 15min wall).

### Notes specific to THIS project
- Tasks/plugins use the **Nitro `src/tasks` and `src/plugins` scan convention** — distinct from the TanStack `createFileRoute(...)({ server: { handlers } })` API-route convention used for `src/routes/api/*`.
- For a **queue consumer** (the Queues option), register a Nitro hook in `src/plugins/*.ts`:
  ```ts
  // src/plugins/queue-consumer.ts
  export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("cloudflare:queue", async ({ batch, env, context }) => {
      for (const message of batch.messages) { /* process */ }
    });
  });
  ```
  The `[[queues.consumers]]` binding itself lives in your source `wrangler.json` (survives per Q1).

---

## Bottom line for the architecture decision
- **Cron+Poll is first-class here:** define a Nitro task + `scheduledTasks` cron; Nitro auto-generates the Cron Trigger and wires `scheduled()` — no manual wrangler cron needed. Custom queue/bindings in source `wrangler.json` survive regardless.
- **Queues is also supported:** `queue()` handler + `cloudflare:queue` hook + a source `wrangler.json` consumer binding that survives regeneration.
- Either way, **put custom wrangler config in a source file (not the generated `dist/server/wrangler.json`)** — it is preserved by Nitro's `defu` merge.

*Remaining gate before implementation: confirm the Cloudflare billing plan (Cron Triggers require at least the Workers Paid plan; Queues has its own per-message pricing and a paid-plan requirement).*
