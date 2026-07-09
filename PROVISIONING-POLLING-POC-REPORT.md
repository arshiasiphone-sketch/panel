# Public Provisioning API — Polling-Driven Step Execution: PoC Verification

**Scope:** Proof-of-concept verification only. No public API endpoints built. No resumable engine code written yet.
**Model under evaluation:** Client-Polling-Driven Step Execution — each poll request runs **exactly one** pipeline step, persists progress, returns; client polls every ~1.5s until `ready`/`failed`. Targets Cloudflare Workers **Free plan** (no Cron Triggers, no Queues).
**Generated:** 2026-07-08.

---

## 1. Wall-time cost of one real pipeline step (STEP 1)

### Method
Temporary diagnostic route `src/routes/api/step-cost-check.ts` (since deleted) used the confirmed working `createFileRoute(...)({ server: { handlers: { GET } } })` pattern, importing the existing `supabaseAdmin` proxy from `@/integrations/supabase/client.server` (same import path as `src/routes/api/provision.ts`). It ran **one** `supabaseAdmin.from('site_content').select('key').limit(1)` and measured `performance.now()` delta (wall-clock).

### Local dev results (5 runs, localhost:8080)

| Run | wallTimeMs | hadError | rows |
|-----|-----------|----------|------|
| 1   | 1974.9    | false    | 1    |
| 2   | 794.7     | false    | 1    |
| 3   | 15427.8   | false    | 1    |
| 4   | 595.0     | false    | 1    |
| 5   | 1229.6    | false    | 1    |

All 5 succeeded (`hadError: false`, returned 1 row). Typical latency 0.6–2.0s; one 15.4s outlier.

### ⚠️ Critical limitation — this is NOT a CPU-time measurement
- `performance.now()` measures **wall-clock** in **local dev (Vite dev server on Windows)**. It is dominated by **network round-trip to Supabase** (I/O wait) and, for run #3, almost certainly a **dev-server cold-compile** of the freshly-added route module (TanStack Start compiles routes on first hit).
- It says **nothing** about Cloudflare Workers CPU-time billing. CPU time is the time the V8 isolate spends executing JS — I/O wait (awaiting a Supabase REST response) does **not** count, but **only the real Workers dashboard "CPU time" metric per invocation can confirm it**. That requires deploying a Worker and reading the metric.
- **Conclusion this test supports:** a single Supabase call does no heavy synchronous computation — it is an `await` over the network. So the *premise* (a single DB step is I/O-bound and therefore has a small CPU bill) is **plausible and consistent** with these numbers, but **NOT proven** here. Treat the wall-clock figures as "network RTT order-of-magnitude," not as production CPU cost.
- **Recommendation:** before committing, deploy a single-step Worker to the Free plan and read the per-invocation **CPU time** metric. Free plan allows up to 10ms CPU / request and 100,000 requests/day — a quick one-step call should sit well under 10ms CPU, but that must be measured in-production, not assumed.

---

## 2. Can ProvisionEngine run "one resumable step per invocation"? (STEP 2)

### 2.1 Current capability — does it run a single step?
**NO, not as-is.** Evidence:
- `engine.ts` → `provision()` runs the **entire** pipeline in one invocation: validate → load blueprint → `_createWorkspace()` (creates a workspace **before** the transaction) → `transactionManager.begin()` → `createSession()` (in-memory) → `_executePipeline()`.
- `_executePipeline()` (`engine.ts`) is `private` and loops `for (const step of PROVISION_PIPELINE)`, calling `_executeStepWithRetry()` for **every** step. There is **no public entry point** that accepts a transaction ID + step index and runs a single step.
- `_executeStepWithRetry()` is `private`, requires an in-memory `ProvisionSession`, and on transient failure enters a `while(true)` loop that calls `this._sleep(delay)` (up to `maxRetries` attempts with backoff). In a polling model this is wrong: one invocation must do one bounded attempt and return, not sleep-and-retry in-process.

### 2.2 Does state survive across stateless invocations?
**Partially — the resume *cursor* is persisted; the *resource accumulator* is NOT.** This is the crux.

Persisted in `provision_transactions` (via `ProvisionTransactionManager`, serialized whole to `site_content` under key `provision:tx:${id}`):
- `currentStepIndex` — advanced in `recordStep()` as `Math.min(PROVISION_PIPELINE.indexOf(step)+1, len)`. ✅ Reliable resume cursor.
- `steps[]` — per-step `ProvisionStepResult` with `output` + `success`. ✅
- `status`, `workspaceId`, `blueprintId`, `blueprintVersion`, `initiatedBy`. ✅
- `getNextStep(tx)` returns `PROVISION_PIPELINE[tx.currentStepIndex]` or `null`. ✅ Correct.

**NOT persisted:**
- `ProvisionResourceMap` (the accumulator of created IDs: `pageBlockIds`, `menuItemIds`, `galleryImageIds`, `personalityKeys`, `siteContentKeys`, `mediaFileIds`, `navigationKey`, `themeInstalled`). It lives **only** in the in-memory `ProvisionSession` (`session-context.ts`). The `ProvisionTransaction` type (`types.ts`) has **no `resourceMap` field**, so `_save()` never persists it.
- Impact:
  - Forward steps are **largely idempotent** and self-healing: `INSTALL_BLUEPRINT` uses `getProvisionLog()`; `SEED_DATA` / `INSERT_DEFAULT_MEDIA` recompute `folderKeys` from `blueprint.mediaFolderStructure + workspaceId` and check existence via `batchGetByKeys`. So re-running a step on resume mostly skips already-created rows. ✅
  - But **rollback depends entirely on `resourceMap` IDs** (e.g. `_rollbackCompletedSteps` deletes by `resourceMap.pageBlockIds`, etc.). With an empty in-memory map after resume, rollback would delete **nothing** → orphaned resources on failure. ❌
  - Also: `tx` stores `blueprintId` + `blueprintVersion` but **not `blueprintSlug`**. `loader.loadOrThrow()` needs `slug + version` to resume a blueprint — so slug must be added to the tx to rebuild the session.

### 2.3 Minimum change to make it resumable — effort assessment
**Reasonable effort — NOT a significant rewrite.** The Command Pattern (`steps.ts`) already gives correct per-step granularity; the gaps are additive/refinements:

1. **Persist `resourceMap`** — add `resourceMap?: ProvisionResourceMap` to `ProvisionTransaction` (`types.ts`); initialize an empty map in `transactionManager.begin()` (`transaction.ts`). Because `_save()` serializes the whole `tx`, it persists automatically. Rebuild `session.resourceMap` from `tx.resourceMap` on resume. (Covers the rollback gap.)
2. **Add `blueprintSlug` to `ProvisionTransaction`** (`types.ts` + `begin()`) so a resumed invocation can load the blueprint via `loader.loadOrThrow(slug, version)`.
3. **Add a public step-level entry point** on `ProvisionEngine` (and expose via `ProvisionService`): e.g. `async provisionStep(txId): Promise<{ done, nextStep, status }>` that:
   - loads `tx` (`transactionManager.get`),
   - rebuilds `ProvisionSession` from `tx` (context from tx fields; `resourceMap` from `tx.resourceMap`),
   - ensures the workspace exists **once** (idempotent, keyed by `txId`, writing the id into `tx.workspaceId` — see #4),
   - takes `next = transactionManager.getNextStep(tx)`; if `null` → `updateStatus(completed)`; else
   - runs **one** command via a **polling-aware single-attempt** runner (attempt once; on retryable failure record a retry attempt + persist `retryCount` + return `in_progress`; on terminal failure record + rollback + return `failed`),
   - reloads `tx` and repeats the `getNextStep`/complete check.
4. **Make workspace creation idempotent / once.** Currently `_createWorkspace()` (`engine.ts`) runs at the top of `provision()` and calls `createId()` each time → would duplicate workspaces if re-invoked. Move one-time workspace creation into the resume path: create-or-reuse keyed by `txId` (or `externalOrderId`), persist id into `tx.workspaceId`, and have all step commands read `session.context.workspaceId` (they already receive `workspaceId` as a param — no change to `steps.ts` needed).
5. **Replace the in-process retry-sleep loop** (`_executeStepWithRetry`'s `while(true)` + `this._sleep`) with the bounded single-attempt runner from #3, so each HTTP request does a fixed, small amount of work.

**Files touched:** `types.ts` (2 fields), `transaction.ts` (init 1–2 fields), `engine.ts` (new public `provisionStep` + single-attempt runner + idempotent workspace creation), `service.ts` (expose method). `session-context.ts` needs a session-rebuild helper; **`steps.ts` command logic is unchanged.** This is well within "reasonable effort."

### 2.4 Verdict
The engine design is **close** to supporting one-resumable-step-per-invocation. The pipeline is already a clean ordered list of self-contained commands with per-step persistence of progress (`currentStepIndex` + `steps[]`). The two real blockers are: (a) the `resourceMap` accumulator is in-memory only (breaks cross-request rollback), and (b) there is no step-level public entry point and workspace creation is non-idempotent. Both are fixed with the additive changes above. **No rewrite required.**

---

## Bottom line for the architecture decision
- **Free-plan compatibility (Cron/Queue not needed):** ✅ Confirmed viable in principle. Each poll = one short, I/O-bound step.
- **CPU premise:** plausible and consistent with local wall-clock (0.6–2.0s network RTT, no heavy compute), but **CPU-time safety must be measured in a deployed Free-plan Worker** via the dashboard metric — this PoC did not prove it.
- **Engine resumability:** achievable with moderate, additive changes (persist `resourceMap`; add `provisionStep` entry point; idempotent workspace creation; bounded single-attempt per poll). No architectural rewrite.
- **Next gate:** (1) user verifies Cron/Queue plan availability on their own dashboard (separate); (2) measure one-step CPU time in a real Free-plan Worker before locking the design.
