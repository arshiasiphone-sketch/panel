---
name: workspace-isolation
description: Why multi-tenant data lands in one shared bucket in this TanStack Start + Supabase app — the setWorkspace()/withWorkspace() isolation hinge, the findBySubdomain missing-column trap, the client extractDomainInfo subdomain-mangling bug (#4), the provisioning-vs-active status signal, and the VITE_ENABLE_DOMAIN_PREVIEW env requirement.
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

## Provisioning status signal (why some rows are `provisioning`, others `active`)

Two different code paths create workspaces, and they set **different default
statuses** — this explains the CSV pattern where no-domain rows are `active` but
domain rows are stuck at `provisioning`:

- Rows with **no domain** that are `active` come from
  `WorkspaceRepository.getOrCreateDefault()` / `ensureDefault()`, which
  explicitly set `entity.status = "active"` (single-tenant fallback path).
- Rows with a **domain** are created by the **provision engine**
  (`ProvisionEngine._createWorkspace` → `createWorkspace` in `factory.ts`), which
  sets `status: "provisioning"` and only flips to `"active"` in the final
  `WORKSPACE_READY` step (`steps.ts`): it does `findById(workspaceId)` →
  `entity.status = "active"` → `save`.

So a domain row stuck at `provisioning` means the provisioning pipeline **never
reached / completed `workspace_ready`** → `provision()` threw partway → the
`/api/public/provision` route returned 500 and recorded the failure. That is a
**separate bug from the resolution issue** (Bug #4) and from tenant bleed (Bug
#1/#2): the workspace row exists but is half-built and has no real content, so
its link still won't render correctly even after the resolution fix until
provisioning actually completes.

To find WHY provisioning failed, read `provision_transactions.error`:
- `GET /api/public/provision-status?externalOrderId=<id>` returns `status` + `error`.
- SQL: `SELECT external_order_id, status, error FROM provision_transactions ORDER BY started_at DESC;`
- `failed` orders are retried by the idempotency logic (only `completed` returns
  `already_exists`), so after fixing the pipeline error, re-call provision.

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

## Caveat: existing DEFAULT data can't be auto-separated

Because every legacy row was stamped `00000000-…-0001`, there is no owner signal
to split it back out. Clean isolation for old workspaces requires **re-provisioning**
them (new runs write correctly-scoped rows), not a backfill.

## When to apply

Any task mentioning "workspaces share data", "multi-tenant isolation",
"tenant bleed", provisioning writing to the wrong workspace, "my change shows
up in other workspaces", "every subdomain shows the base project", "links show
the default workspace", or "my provisioned workspace is stuck at provisioning".
Always check the `setWorkspace` call on the active repo graph first — it is the
single most common root cause. Then check the client `extractDomainInfo` slicing
(Bug #4) for subdomain-resolution-to-DEFAULT, and `provision_transactions.error`
for `provisioning`-stuck rows.
