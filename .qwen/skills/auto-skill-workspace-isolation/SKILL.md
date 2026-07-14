---
name: workspace-isolation
description: Why multi-tenant data lands in one shared bucket in this TanStack Start + Supabase app — the setWorkspace()/withWorkspace() isolation hinge, the findBySubdomain missing-column trap, the client extractDomainInfo subdomain-mangling bug (#4), the resolveWorkspaceByDomain catch{}-swallows-findByDomain-errors anti-pattern (cached as {} for 30s → silent default degrade, #5), the provisioning-vs-active status signal (incl. the silent no-flip Signature B: completed transaction + still-provisioning row from a findById returning null on the workspace_id-less workspaces table), the two separate transaction trackers, and the VITE_ENABLE_DOMAIN_PREVIEW env requirement.
source: auto-skill
extracted_at: '2026-07-12T14:03:08.126Z'
---

# Workspace data isolation (multi-tenant) in this app

## The one rule that explains almost every "workspaces share data" bug

Tenant isolation is **not** enforced by the database (no RLS on data tables
constraining by `workspace_id`). It is enforced **only** by the app, through a
single hinge in `src/lib/repositories/base.ts`:

```ts
protected get workspaceId() { return this.workspace.workspaceId; }
protected withWorkspace<T>(query, column = "workspace_id"): ITableQuery<T> {
  if (this.workspaceId) return query.eq(column, this.workspaceId);
  return query;            // ← no-op when workspaceId is undefined
}
```

- Reads: if `workspaceId` is undefined, `withWorkspace` is a **no-op** → the
  query returns **every workspace's rows** (cross-tenant leak on read).
- Writes: repos stamp `workspace_id` only `if (this.workspaceId)`; otherwise the
  row is inserted **unstamped → defaults to `DEFAULT_WORKSPACE_ID`
  (`00000000-0000-0000-0000-000000000001`)**.

A repository's `workspaceId` is set by `setWorkspace(ctx)` (in `base.ts`), and
the convenience helper `setWorkspaceOnRepositories(repos, ctx)` in
`src/lib/repositories/factory.ts` loops every repo. **If nobody calls
`setWorkspace`, every repo silently writes to the shared DEFAULT bucket and
reads everything.**

## Bug pattern #1 — provisioning never scoped its repos (the usual culprit)

`src/lib/core/provision/engine.ts` builds the data `Repositories` (in
`ProvisionService`) and runs the pipeline, but it **never called
`setWorkspace` on them**. So every `installBlueprint*` / `seed` write went to
DEFAULT. Two provisioned workspaces then wrote to the same rows → they appeared
to be "the same database."

Fix (already applied): in `provision()`, immediately after
`const workspaceId = await this._createWorkspace(...)`, call
`setWorkspaceOnRepositories(this.deps.repos, { workspaceId });`. After that,
all pipeline writes stamp the correct `workspace_id`.

**Rule of thumb:** any code path that creates/writes tenant data through the
repos MUST set the workspace first. The client CMS path does this correctly
(`CurrentWorkspaceProvider` → `setWorkspaceOnRepositories(repos, ctx)` once the
workspace resolves). The server/CLI/provisioning paths are where it gets
forgotten.

## Bug pattern #2 — `findBySubdomain` queries a column that doesn't exist

`src/lib/core/workspace/repository.ts` `findBySubdomain` did
`.from("workspaces").eq("subdomain", subdomain)`. The `workspaces` table only
has a `domain` column (e.g. `khane.nama.app`) — there is **no `subdomain`
column**. This query throws; the resolver (`resolver.ts`) swallows the error and
falls back to the DEFAULT workspace, so any subdomain-based access
(`*.panel-plum-alpha.vercel.app`) silently resolved to DEFAULT (all data shared).

Workspaces are stored by full domain `${slug}.${PLATFORM_DOMAIN}` (PLATFORM_DOMAIN
= `"nama.app"` in `src/lib/constants.ts`). Fix: resolve a subdomain by building
the canonical domain and calling `findByDomain`:
`return this.findByDomain(\`${subdomain}.${PLATFORM_DOMAIN}\`);`

## Bug pattern #3 — `?preview_domain=` is a build-time-gated client feature

Covered in detail by the `domain-preview` skill, but restated because it is the
other half of "edits bleed across workspaces": `extractPreviewDomain()` in
`src/lib/core/workspace/context.tsx` only returns a value when
`import.meta.env.VITE_ENABLE_DOMAIN_PREVIEW === "true"`. `import.meta.env.VITE_*`
is **inlined at build time**, so:

- If the deploy was NOT built with `VITE_ENABLE_DOMAIN_PREVIEW=true` (e.g. set
  only in the running app's runtime env), `?preview_domain=` is **ignored** and
  the request resolves to DEFAULT → root and preview URLs share one dataset.
- To make it work in prod you MUST set the env var in the **deploy build
  environment** AND rebuild/redeploy.

## Bug pattern #4 — client `extractDomainInfo` mangles the subdomain before the resolver

Even with the Bug #2 repository fix, a subdomain visit (`khane.nama.app`) can
still silently render DEFAULT. The client resolver in
`src/lib/core/workspace/context.tsx` feeds the wrong string to
`resolveWorkspaceByDomain`:

- `extractDomainInfo()` for `khane.nama.app` returned
  `{ domain: parts.slice(1).join(".") /* "nama.app" */, subdomain: "khane", isSubdomain: true }`
  — it sliced off the real subdomain and kept only the **parent** domain.
- `extractWorkspaceFromPath` then **drops `subdomain`** and passes
  `domain: "nama.app", isSubdomain: true` to the resolver.
- `resolveWorkspaceByDomain("nama.app", true)` → `findByDomain("nama.app")`
  (no match) → `findBySubdomain("nama.app")` → `findByDomain("nama.app.nama.app")`
  (no match) → **falls back to `DEFAULT_WORKSPACE`**.

The `workspaces.domain` rows are correct (`khane.nama.app`); the resolver was
just asked the wrong question. So every `*.nama.app` subdomain renders the base
project even though the workspace row exists.

Fix: in `extractDomainInfo`, for the subdomain branch return the **full hostname**
as the domain and `isSubdomain: false`:
`return { domain: hostname, subdomain: potentialSubdomain, isSubdomain: false };`
The caller then passes `domain: "khane.nama.app"` → `findByDomain` matches exactly.
(Keep `isSubdomain: false` so the resolver uses the exact-domain path; the
subdomain→full-domain mapping in `repository.ts` is now only used by server code.)

**Rule of thumb:** the value handed to `resolveWorkspaceByDomain` must be the
*stored* `workspaces.domain` (full, e.g. `khane.nama.app`), never a partial
parent domain. If you see "every subdomain shows the base project" but the
rows are present and `findBySubdomain` is correct, suspect the client
`extractDomainInfo`/`extractWorkspaceFromPath` slicing.

## Bug pattern #5 — `resolveWorkspaceByDomain` swallowed `findByDomain` errors and cached `{}` for 30s (silent default degrade)

**Signature (2026-07-15):** an incognito/provisioned test of
`?preview_domain=khane.nama.app` STILL rendered the DEFAULT workspace, console
only showed `Workspace Health` → `✗ workspace-resolution: Workspace ID is not
set — using single-tenant default` (plus workspace-entity / -limits / -status),
yet every layer was provably fine: the DB row exists, `findByDomain`
(Node repro) returns it, RLS allows SELECT for anon + authenticated, the
deployed `Mp()` reads `preview_domain` (gate eliminated), schema `K` accepts
empty membership + nullable owner. So why default?

**Root cause:** `src/lib/core/workspace/resolver.ts` `resolveWorkspaceByDomain`
wraps its whole body in
`cache.getOrFetch("workspace_resolver", "domain:…", async () => { … }, 30_000)`
and inside the exact-match lookup did:

```ts
try { exactWorkspace = await deps.workspaceRepository.findByDomain(domain); }
catch { /* swallowed */ }   // ← bug
```

`findByDomain` genuinely THROWS on DB/RLS/network error (via `normalizeError`);
the bare `catch {}` swallowed it, let the function fall through to `return {}`,
and `getOrFetch` then **cached that `{}` as a *successful* empty lookup for the
full 30s TTL**. A transient browser-side fetch failure therefore became a
persistent 30-second window of silent default resolution with **zero diagnostic
signal** — exactly the symptom. (When the gate is compiled out and the domain is
correct, the only way to reach DEFAULT is a thrown+swallowed error, which the
`catch {}` hid.)

**Fix pattern (applied 2026-07-15):**

```ts
try {
  exactWorkspace = await deps.workspaceRepository.findByDomain(domainOrSubdomain);
} catch (err) {
  logger.error("resolveWorkspaceByDomain: findByDomain failed",
    { source: "workspace", domain: domainOrSubdomain, isSubdomain,
      cause: err instanceof Error ? err : new Error(String(err)) });
  throw err instanceof Error ? err : new Error(String(err));   // rethrow → NOT cached as miss
}
```

- The **exact-match** `findByDomain` path must surface its error (log + rethrow).
  The subdomain / www-stripped fallbacks can stay `logger.warn` + ignore (they
  are non-fatal variants), but the primary lookup must NOT be swallowed.
- In `src/lib/core/workspace/context.tsx` `CurrentWorkspaceProvider.resolve()`,
  move the `import("@/lib/repositories/factory")` (→ `getRepositories` /
  `setWorkspaceOnRepositories`) **OUTSIDE** the `try` so the `catch` can still
  call `setWorkspaceOnRepositories(repos, DEFAULT_WORKSPACE)` +
  `setWorkspace(DEFAULT_WORKSPACE)`. Otherwise a thrown resolution error leaves
  the repo Singleton **unconfigured** → app hangs / silently reads DEFAULT.
- Add `logger.warn("No workspace resolved for requested domain … — degrading to
  default workspace")` when `requestedDomain` is set but unresolved, so a real
  miss is visible in the console (the user's "fix the resolveWorkspaceByDomain
  error" ask = surface it, not silently degrade).

**Rule of thumb:** never wrap a repository lookup that THROWS in a bare
`catch {}` *inside* a `getOrFetch`-cached resolver — you convert a transient
failure into a persistent (TTL-length) silent degrade. Log + rethrow. And if the
provider's resolution throws, still configure the repos with DEFAULT in the
`catch` so the Singleton isn't left unconfigured.

## Provisioning status signal (why some rows are `provisioning`, others `active`)

Two different code paths create workspaces and set **different default statuses**:

- Rows with **no domain** that are `active` come from
  `WorkspaceRepository.getOrCreateDefault()` / `ensureDefault()`, which
  explicitly set `entity.status = "active"` (single-tenant fallback path).
- Rows with a **domain** are created by the **provision engine**
  (`ProvisionEngine._createWorkspace` → `createWorkspace` in `factory.ts`), which
  sets `status: "provisioning"` and only flips to `"active"` in the final
  `WORKSPACE_READY` step (`steps.ts`): `findById(workspaceId)` →
  `entity.status = "active"` → `save`.

A domain workspace reaches `active` ONLY via `WORKSPACE_READY`. When it stays
`provisioning`, there are exactly two signatures — tell them apart by reading
`provision_transactions.status` (NOT the engine's own log; see the tracker note
below):

- **Signature A — pipeline threw (expected/obvious):** `provision_transactions.status = "failed"`
  with an `error`. `provision()` threw before/during a step (incl. before
  `WORKSPACE_READY`), so the route returned 500. Fix the step error, then
  re-call provision (the idempotency logic retries `failed` orders; only
  `completed` returns `already_exists`).
- **Signature B — silent no-flip (subtle, THIS was the real bug):** `provision_transactions.status = "completed"`
  BUT the workspace is STILL `provisioning`. The pipeline ran to completion
  with **no throw**, so `report.success` (= `finalTx.status === "completed"`)
  was true and the public row was marked `completed` — yet the status flag never
  flipped. This means `WORKSPACE_READY`'s `findById(workspaceId)` returned
  `null`, so its `if (entity) { ...save }` was skipped silently.
  **Usual cause:** the `workspaces` table has **NO `workspace_id` column** (see
  pitfall box). If a deployed `WorkspaceRepository.findById` applied
  `withWorkspace("workspace_id")` (the `BaseRepository` default column) to the
  `workspaces` query, the filter `workspace_id = <id>` matches nothing →
  `findById` returns `null` → status never flips, but nothing throws. The
  current repo code queries `eq("id", id)` directly (no `withWorkspace`), so it
  is already fixed in code — but you must **redeploy** for new provisions to
  self-flip; pre-deploy rows need the manual flip in the diagnostic HOWTO.

> **EXPERIENCE (2026-07-13):** the "redeploy fixes it" assumption is NOT reliable.
> Fresh re-provisions run via `ProvisionService.provision()` (local code, corrected
> `findById`) STILL landed at `provisioning` and required the manual `_flip_old.mjs`
> flip (`workspaces.status='active'` + `provision_transactions.status='completed'`/
> `completed_at`). So the engine's `provision()` path does NOT reliably execute
> `WORKSPACE_READY`'s flip. Treat the **manual flip as the dependable remediation**
> for any `provisioning` row; the root cause (why `WORKSPACE_READY` is skipped in
> the `provision()` pipeline) is UNRESOLVED — do not assume a redeploy alone makes
> self-service provisioning self-flip. Before relying on UI provisions, confirm a
> fresh provision actually reaches `active` end-to-end.

> **PITFALL — `workspaces` has NO `workspace_id` column.**
> Unlike every data table (`site_content`, `menu`, `gallery`, …) which are
> scoped by `withWorkspace("workspace_id")`, the `workspaces` table is keyed by
> `id` and `domain` only. `WorkspaceRepository.findById` / `save` / `upsert`
> MUST hit it directly (`eq("id", id)` / `eq("domain", domain)`), never via
> `withWorkspace`. Applying `withWorkspace()` there returns `null`/empty
> instead of erroring, which silently breaks `WORKSPACE_READY` (Signature B) and
> any other workspace-row read. If you ever "fix" workspace reads by adding
> `withWorkspace`, you create this exact bug.

### Two DIFFERENT transaction trackers — don't confuse them

- **Engine's own journal** — `ProvisionTransactionManager` (`src/lib/core/provision/transaction.ts`)
  persists to `site_content` under key `provision:tx:<id>` (NOT a table). It is
  the engine's internal step log; its `status` is also `completed`/`failed` but
  it is NOT what `/api/public/provision-status` reads.
- **Public API journal** — `public-idempotency.ts` owns the **`provision_transactions`
  TABLE**. Idempotency is keyed by `external_order_id`; columns are
  `status`, `error`, `workspace_id`, `blueprint_slug`. The route sets this row
  to `completed` ONLY after `report.success`. **This is the table to query** when
  reconciling "transaction vs workspace status". Correlate via
  `provision_transactions.workspace_id → workspaces.id`.

### Live diagnostic / fix — run against PROD from this environment

`node` (v24) is available and `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
**are already exported in the shell** (there is no local `.env` file — only
`.env.example` — but the vars are in the environment, so a bare
`node script.mjs` reading `process.env` works). The `supabase` CLI is **NOT**
installed, so use a `@supabase/supabase-js` script instead:

```js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } });

// 1) Find workspaces with a COMPLETED transaction but still 'provisioning' (Signature B)
const { data: txs } = await supabase.from("provision_transactions")
  .select("workspace_id").eq("status", "completed").not("workspace_id", "is", null);
const ids = [...new Set(txs.map(t => t.workspace_id).filter(Boolean))];
const { data: targets } = await supabase.from("workspaces").select("id, domain, status").in("id", ids);
const stuck = targets.filter(w => w.status === "provisioning");

// 2) Optional: replicate _mapRowToEntity/_mapEntityToRow to see WHY findById
//    would return null (e.g. a withWorkspace("workspace_id") on workspaces).

// 3) Reversible bulk flip (data is fully installed for a completed tx; only the
//    flag is wrong). To test on one row first, drop .in() and add .eq("domain", "x").
await supabase.from("workspaces")
  .update({ status: "active", updated_at: new Date().toISOString() })
  .in("id", stuck.map(w => w.id));
```

- The flip is **reversible** (set `status` back to `provisioning`) and safe:
  a `completed` transaction means all blueprint/site-content data installed
  successfully; only the status flag is stale.
- After flipping, `context.tsx`'s `isOperational` (`ACTIVE_WORKSPACE_STATUSES =
  {"active","trial"}` in `types.ts`) becomes `true`, so the link renders the
  real workspace instead of being flagged non-operational.
- **Caveat:** flipping data does NOT fix the code path. Until the corrected
  `findById` (no `withWorkspace`) is **redeployed**, the NEXT provision will
  also land in Signature B. Redeploy, then re-provision any `failed` orders.

## How to diagnose a "workspaces not separated" report

1. Confirm the migrations ran (they did if data exists in DEFAULT — migration
   3 added `workspace_id` with the DEFAULT constraint). A missing migration
   would *error*, not silently share.
2. Find the write path. Did something call `setWorkspace` / `setWorkspaceOnRepositories`
   for the relevant repos? If not → data is in DEFAULT.
3. Check the read path's resolution: for `?preview_domain=` verify the env flag
   was compiled in and the value exactly matches `workspaces.domain`.
4. For subdomain access, remember `findBySubdomain` maps to `${sub}.nama.app`;
   never add a literal `subdomain` column query. **Also** check the client
   `extractDomainInfo`/`extractWorkspaceFromPath` in `context.tsx` — it must hand
   the *full* hostname (`khane.nama.app`) to the resolver, not a sliced parent
   domain (Bug #4). A subdomain that resolves to DEFAULT while the row exists
   and `findBySubdomain` is correct almost always means the client slicing.
5. Check workspace status: domain rows at `provisioning` (not `active`) mean the
   provisioning pipeline failed before `WORKSPACE_READY` — read
   `provision_transactions.error` to find why (separate from any isolation bug).
   `active` rows with no domain are the `getOrCreateDefault` fallback, expected.
6. Verify isolation in Supabase SQL:
   `SELECT workspace_id, count(*) FROM site_content GROUP BY 1;` — after a
   correct provision you should see a new id, not only `00000000-…-0001`.

## Read-path isolation audit (proving an admin page loads ONLY its workspace's data)

The "isolation" bugs above are mostly about the **write** path (nobody called
`setWorkspace`, so rows went to DEFAULT). But when someone asks *"does every
provision have its own admin page with separate data — for sure?"* you must
also verify the **read** path, because a repo only filters by `workspace_id`
if its `this.workspaceId` was actually set to the resolved workspace. The proof
chain in THIS repo (verified 2026-07-13):

1. **Admin/page components read via `useRepositories()`, the SAME singleton the
   provider scopes.** Every CMS hook in `src/lib/cms.ts`
   (`useAllMenuItems`, `usePageBlocks`, `useAllEvents`, `useAllGalleryImages`,
   `usePageViewStats`, …) does `const repos = useRepositories();` then calls
   `repos.<domain>.getAll()` / `getVisible()`.
2. **`useRepositories()` returns the singleton.** `src/lib/providers/index.ts`:
   `useRepositories()` → `initializeRepositories()` → `initRepositories(providers)`
   → `createRepositories(deps)`, cached in the module-level `_repositories`
   singleton. `getRepositories()` (used by the provider) returns that SAME
   instance. So the provider and the hooks share one repo graph.
3. **The provider sets the workspace on that singleton BEFORE data loads.**
   `src/lib/core/workspace/context.tsx` `CurrentWorkspaceProvider.resolve()`
   resolves the workspace (from the request domain → `findByDomain`, or
   `/cafe/<slug>`, or `?preview_domain`) and then calls
   `setWorkspaceOnRepositories(getRepositories(), ctx)` — which loops every
   repo and calls `repo.setWorkspace(ctx)`, stamping `this.workspaceId`.
4. **Every content repo filters by `workspace_id`.** `withWorkspace()` in
   `src/lib/repositories/base.ts` does `.eq("workspace_id", this.workspaceId)`.
   Confirmed callers: `menu.ts`, `pages.ts`, `gallery.ts`, `events.ts`,
   `testimonials.ts`, `siteContent.ts`, `personality.ts`, `media.ts`
   (grep `withWorkspace` in `src/lib/repositories`). So
   `repos.menu.getAll()` resolves to `SELECT … WHERE workspace_id = <ws>`.

**Conclusion:** when an admin page is opened via its own domain
(`<slug>.nama.app/admin` or `/cafe/<slug>`), the provider resolves that
workspace, scopes the singleton repos, and every CMS query is filtered to it —
the admin physically cannot read another provision's rows. This holds for
content tables. (Theme is the global `theme_settings` singleton — intended; see
the bloat section's "NO `workspace_id` column" list.)

**Audit procedure when verifying a report:**
- Grep the page/route's data hooks: confirm they go through `useRepositories()`
  (or `getRepositories()`), NOT a fresh `createRepositories()` that would skip
  the provider's `setWorkspace`.
- Confirm `CurrentWorkspaceProvider` is mounted above the routes
  (`src/routes/__root.tsx` wraps `<Outlet/>` in `<CurrentWorkspaceProvider>`).
- Confirm the repo method in question calls `withWorkspace()`.
- Confirm `ctx.workspaceId` is the resolved workspace (not `undefined`/DEFAULT)
  for the access URL used — i.e. the domain resolves to that workspace row.
- **Caveat — initial-render flash:** the provider resolves in a `useEffect`
  (async). On the very first paint the singleton still has `DEFAULT_WORKSPACE`;
  react-query refetches once the workspace is set, so the FINAL render is
  correct, but don't assert isolation from a single pre-resolution frame.

## Caveat: existing DEFAULT data can't be auto-separated

Because every legacy row was stamped `00000000-…-0001`, there is no owner signal
to split it back out. Clean isolation for old workspaces requires **re-provisioning**
them (new runs write correctly-scoped rows), not a backfill.

## Re-seeding a workspace that was provisioned BEFORE the `workspace_id` columns existed

This is the common "the schema is applied, but my existing workspace is empty /
shows nothing" case. The workspace row + a (failed or empty) `provision_transactions`
row exist, but the seed steps errored on the missing `workspace_id` column, so no
content was written. Two non-obvious facts drive the fix:

### Gotcha A — the public provision API always MINTS A NEW workspace id

`ProvisionEngine._createWorkspace` calls `createWorkspace(...)` which generates a
**fresh** `entity.id` (`gen_random_uuid`), then `WorkspaceRepository.save` does
`upsert(row)` keyed on **`id` only** (not domain). So re-POSTing
`/api/public/provision` for an existing slug does NOT refill the existing
workspace — it either (a) returns `already_exists` (idempotency: `status==='completed'`
→ no re-provision), or (b) when the old tx is `failed` it reuses the tx but still
**creates a new workspace with a new id and the same domain** → domain conflict on
`save` or a duplicate workspace. **You cannot refill an existing workspace by
re-POSTing alone.** The reliable path is delete-then-re-provision.

### Gotcha B — the blueprint comes from `site_content`, NOT the `blueprints` table

`BlueprintLoader` → `BlueprintRegistry` stores/reads blueprints in the
**`site_content`** table under keys `blueprint:{slug}:{version}` and
`blueprint:index` (`registry.ts`). The `blueprints` catalog table created by
migration 04 (`20260707000004_create_provisioning_tables.sql`) is a **separate,
unused-by-the-provisioner catalog** — it is NOT what `loadOrThrow('cafeteria')`
reads. So when you re-provision, the blueprint def is pulled from `site_content`;
the `blueprints` seed row is harmless dead weight. (Confirm the blueprint is
present with `SELECT key FROM site_content WHERE key LIKE 'blueprint:%';`.)

### The procedure (zero code change)

1. In the Supabase **SQL Editor**, clear the empty workspace and its transaction.
   The `workspaces` FK to content tables is `ON DELETE CASCADE`, so deleting the
   workspace also removes its (empty) content. Delete the `provision_transactions`
   row first (its FK to `workspaces` is `ON DELETE SET NULL`, so it would
   otherwise linger and block a clean re-provision via idempotency):

   ```sql
   DELETE FROM provision_transactions
     WHERE workspace_id = (SELECT id FROM workspaces WHERE domain = 'SLUG.nama.app');
   DELETE FROM workspaces WHERE domain = 'SLUG.nama.app';
   ```

2. Re-provision the **same slug** through the normal flow (the provision page, or
   `POST /api/public/provision` with the `X-API-Key` header + a **fresh**
   `externalOrderId`). Now that the `workspace_id` columns exist, every
   `installBlueprint*` / seed write is stamped with the new workspace's id →
   fully isolated content. `BlueprintInstaller.install(blueprint, workspaceId, …)`
   is idempotent (checks a `provision:log` per slug) and scopes every write to
   `workspaceId`, so a clean run is safe.

> Alternative for automation: call `BlueprintInstaller.install(blueprint, yekWorkspaceId, resourceMap)`
> directly against the existing workspace id (loads the blueprint from
> `site_content`, installs scoped rows). That avoids the delete. Only do this
> server-side (it needs the admin repo graph + service-role client).

## Cleaning DEFAULT workspace bloat (reset + re-seed)

Fixing the two isolation defects (resolution + isolated content) can still leave
the DEFAULT workspace (`00000000-0000-0000-0000-000000000001`) bloated with
orphaned replica rows from historical provisions (timestamped re-seed batches
accumulate because the old bug appended to DEFAULT instead of the new workspace).
Functional isolation is already achieved, but the bloat is a separate,
pre-existing artifact that the re-provision does NOT auto-clean.

### Gotcha — only `workspace_id`-scoped tables bloat; some tables are GLOBAL

Run a row-count-by-`workspace_id` diagnostic across the content tables:

```js
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const DEFAULT = "00000000-0000-0000-0000-000000000001";
for (const t of ["page_blocks", "menu_items", "gallery_images", "events"]) {
  const { data } = await sb.from(t).select("workspace_id");
  const c = {};
  for (const r of data) { const w = r.workspace_id ?? "(null)"; c[w] = (c[w] ?? 0) + 1; }
  console.log(t, c);
}
```

- `page_blocks`, `menu_items`, `gallery_images`, `events` ARE scoped by
  `workspace_id` → these are what bloat in DEFAULT.
- `personality_profiles`, `site_content`, `theme_settings`, `testimonials`,
  `media_files` have **NO `workspace_id` column** (global/shared) → do NOT touch
  them in a DEFAULT cleanup; they are not part of the per-tenant bloat.
- The `events` table is **NOT seeded by the blueprint** — events live inside the
  `event-list` block's `data.events`. After a correct provision a workspace has
  **0** `events` rows; any `events` rows in DEFAULT are legacy orphans
  (delete them, don't re-seed).

### Procedure — clone the engine's own canonical output

The engine provisions a NEW workspace; it cannot target DEFAULT. So clone the
exact rows the engine wrote for a correctly-provisioned workspace and remap
`workspace_id` → DEFAULT. This guarantees the row shape matches what the app's
workspace-scoped readers expect (includes `data`, `block_key_hash`,
`pageKey`/`pageTitle`, `sort_order`, `visible`, timestamps) — far safer than
hand-building inserts from the blueprint definition.

```js
// Make DRY_RUN-by-default; flip `const DRY = false` via edit to actually write
// (inline `set FORCE=1 && node` does NOT reach node on this shell — see cmd-shell-quirks).
const DEFAULT = "00000000-0000-0000-0000-000000000001";
const SRC = "<id of a correctly-provisioned workspace>"; // e.g. khane's new id
const now = () => new Date().toISOString();
const source = {};
for (const t of ["page_blocks", "menu_items", "gallery_images"])
  source[t] = await sb.from(t).select("*").eq("workspace_id", SRC).order("sort_order", { ascending: true });
const remap = (rows) => rows.map((r) => ({ ...r, id: crypto.randomUUID(),
  workspace_id: DEFAULT, created_at: now(), updated_at: now() }));
const inserts = {
  page_blocks: remap(source.page_blocks),
  menu_items: remap(source.menu_items),
  gallery_images: remap(source.gallery_images),
};
for (const t of ["page_blocks", "menu_items", "gallery_images"]) {
  await sb.from(t).delete().eq("workspace_id", DEFAULT);
  await sb.from(t).insert(inserts[t]);
}
await sb.from("events").delete().eq("workspace_id", DEFAULT); // legacy orphans; blueprint seeds 0
```

Expected result: DEFAULT holds exactly **7 page_blocks / 6 menu_items / 3
gallery_images / 0 events** — identical to any freshly-provisioned workspace.
Source workspace is only read, never modified. Always print a dry-run plan
(counts to delete / insert) before writing.

## When to apply

Any task mentioning "workspaces share data", "multi-tenant isolation",
"tenant bleed", provisioning writing to the wrong workspace, "my change shows
up in other workspaces", "every subdomain shows the base project", "links show
the default workspace", or "my provisioned workspace is stuck at provisioning".
Always check the `setWorkspace` call on the active repo graph first — it is the
single most common root cause. Then check the client `extractDomainInfo` slicing
(Bug #4) for subdomain-resolution-to-DEFAULT, and `provision_transactions.error`
for `provisioning`-stuck rows.
