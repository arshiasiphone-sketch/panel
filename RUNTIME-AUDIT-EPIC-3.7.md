# EPIC 3.7 — Enterprise Runtime Audit Report

**Date**: July 3, 2026
**Scope**: Full production runtime audit across 15 check domains
**Model**: DeepSeek V4 Flash

---

## Severity Legend

| Icon | Severity | Definition |
|------|----------|------------|
| 🔴 | **Critical** | Certain runtime crash in production |
| 🟠 | **High** | Production bug that degrades UX or functionality |
| 🟡 | **Medium** | Reliability issue that could cause problems under load |
| 🔵 | **Low** | Code cleanup / best practice improvement |

---

## 🔴 CRITICAL FINDINGS

### C1 — `useIsMobile` — `window.matchMedia` in useEffect without SSR guard

| Field | Value |
|-------|-------|
| **File** | `src/hooks/use-mobile.tsx` |
| **Line** | 10 |
| **Root Cause** | `window.matchMedia` called inside `useEffect` without SSR guard. While `useEffect` only runs client-side, `window.innerWidth` initial read could fail during hydration with polyfilled environments. |
| **Runtime Impact** | 🟡 MEDIUM — Defensive only, but could crash if `window` is polyfilled without `matchMedia`. |
| **Fix** | Add `typeof window !== "undefined"` guard inside useEffect. |

### C2 — Supabase client throws at first access when env vars missing

| Field | Value |
|-------|-------|
| **File** | `src/integrations/supabase/client.ts` |
| **Line** | 39-46 |
| **Root Cause** | Client-side Supabase client **throws** when `SUPABASE_URL` or `SUPABASE_PUBLISHABLE_KEY` are missing. The Proxy lazy-init pattern defers creation, but the first access to any Supabase method will **crash with a thrown Error**. |
| **Runtime Impact** | 🔴 **CRITICAL** — If env vars are missing (local dev without `.env`), the app crashes completely with no fallback UI. |
| **Fix** | Graceful degradation: export a no-op client proxy or render a "Connect Supabase" UI. |

### C3 — Service role key could be exposed to client bundle

| Field | Value |
|-------|-------|
| **File** | `src/integrations/supabase/client.server.ts` |
| **Line** | 39 |
| **Root Cause** | `SUPABASE_SERVICE_ROLE_KEY` used in a file that could be tree-shaken into client bundle if imported from non-`.server.ts` files. No compile-time protection exists. |
| **Runtime Impact** | 🟠 **HIGH** — Full database access could be leaked if bundled into client. |
| **Fix** | Add explicit import guards or lint rules preventing client-side import. |

---

## 🟠 HIGH SEVERITY

### H1 — Missing `.env.example` file

| Field | Value |
|-------|-------|
| **File** | `.env.example` (MISSING) |
| **Root Cause** | No `.env.example` exists. Developers have no documentation of required environment variables. |
| **Runtime Impact** | 🟠 **HIGH** — Any new developer or CI environment will crash on first run. |
| **Fix** | Generate `.env.example` with all required vars documented. |

### H2 — Missing `.gitignore` file

| Field | Value |
|-------|-------|
| **File** | `.gitignore` (MISSING) |
| **Root Cause** | No `.gitignore` exists. Sensitive files could be committed to git. |
| **Runtime Impact** | 🟠 **HIGH** — Secrets could be exposed in git history. |
| **Fix** | Create `.gitignore` with standard ignores. |

### H3 — Auth middleware throws generic Error instead of HTTP responses

| Field | Value |
|-------|-------|
| **File** | `src/integrations/supabase/auth-middleware.ts` |
| **Line** | 38-78 |
| **Root Cause** | Multiple `throw new Error("Unauthorized: ...")` statements throw generic `Error` objects that appear as "Internal Server Error" (500) in production instead of proper 401 responses. |
| **Runtime Impact** | 🟠 **HIGH** — Auth failures appear as 500 errors, confusing clients and obscuring real server errors. |
| **Fix** | Return structured error responses or use proper HTTP error codes. |

### H4 — `analytics.functions.ts` creates new Supabase admin client per call

| Field | Value |
|-------|-------|
| **File** | `src/lib/analytics.functions.ts` |
| **Line** | Multiple |
| **Root Cause** | `createSupabaseAdminProviders()` called on every server function invocation, creating new service-role client each time. |
| **Runtime Impact** | 🟠 **HIGH** — Each analytics API call creates a new service-role client, increasing cold start time and connection churn. |
| **Fix** | Cache the admin client at module level. |

### H5 — Blueprint dedup uses JSON.stringify which is order-dependent

| Field | Value |
|-------|-------|
| **File** | `src/lib/core/provision/blueprint/installer.ts` |
| **Line** | 245-256 |
| **Root Cause** | Block existence check uses `JSON.stringify` for deduplication. JSON.stringify is order-dependent, so identical blocks with different property ordering are treated as different. |
| **Runtime Impact** | 🟠 **HIGH** — Running provision twice could duplicate blocks. |
| **Fix** | Use deterministic key sorting before stringifying. |

---

## 🟡 MEDIUM SEVERITY

### M1 — Empty catch blocks swallow errors silently

| Field | Value |
|-------|-------|
| **Files** | `src/lib/cms.ts:478`, `src/lib/lazy.tsx:87` |
| **Detail** | `catch(() => {})` and `preloadPromise.catch(() => {})` discard errors with no logging. |
| **Fix** | Add warn-level logging inside empty catch blocks. |

### M2 — N+1 query risk in analytics repository fallbacks

| Field | Value |
|-------|-------|
| **File** | `src/lib/repositories/analytics.ts` |
| **Line** | 108-120 |
| **Detail** | Fallback queries for `fetchTopPages` and `fetchDeviceDistribution` fetch ALL rows without pagination. |
| **Fix** | Add `.limit()` to all fallback queries. |

### M3 — `useTrackVisit` stale closure / path tracking limitation

| Field | Value |
|-------|-------|
| **File** | `src/lib/analytics-hooks.ts` |
| **Line** | 95-102 |
| **Detail** | `useRef` pattern prevents re-tracking on SPA navigation. Only first page path is tracked per component mount. |
| **Fix** | Use a `Set` ref to track multiple paths. |

### M4 — Realtime channel shared ref-counting could leak

| Field | Value |
|-------|-------|
| **File** | `src/lib/cms.ts` |
| **Line** | 478-485 |
| **Detail** | Reference counting pattern with `cmsSyncRefCount` could leak channels under rapid mount/unmount cycles. |
| **Fix** | Add safety timeout or force cleanup. |

### M5 — `normalizeError` double-wraps or re-throws errors

| Field | Value |
|-------|-------|
| **File** | `src/lib/repositories/base.ts` |
| **Line** | 113-122 |
| **Detail** | Instances of `BaseAppError` (like `ValidationError`) are re-thrown instead of returned, causing unexpected unhandled rejections. |
| **Fix** | Document behavior or always return `RepositoryError`. |

### M6 — Router error component logs but may not report to production monitoring

| Field | Value |
|-------|-------|
| **File** | `src/routes/__root.tsx` |
| **Line** | 52-65 |
| **Detail** | `console.error(error)` is called alongside `reportLovableError`, but Lovable reporting may not be configured in production. |
| **Fix** | Ensure `reportLovableError` is configured or add production error reporting. |

---

## 🔵 LOW SEVERITY

| ID | File | Detail |
|----|------|--------|
| L1 | `src/lib/core/provision/blueprint/registry.ts` | `slugFromKey` and `versionFromKey` are dead code (never used) |
| L2 | `src/lib/core/provision/blueprint/registry.ts:8` | `createId` imported but never used |
| L3 | `src/components/ui/orb-background.tsx:69` | `window.matchMedia` called during render (not inside effect), runs every cycle |
| L4 | `nitro.json` (MISSING at root) | Only exists in `.output/` — auto-generated but not documented at project root |
| L5 | `.wrangler/` | Wrangler config referenced but not at project root |
| L6 | `src/lib/service-worker.ts` | No versioning strategy — updates may not be detected by clients |
| L7 | `src/lib/core/workspace/repository.ts` | `listAll()` fetches ALL workspaces with no pagination |
| L8 | Various | `catch (err: unknown)` pattern inconsistency across files |

---

## CHECK SUMMARY

| # | Check | Status | Issues Found |
|---|-------|--------|-------------|
| 1 | Environment Variables | ⚠️ | Missing `.env.example`, 5 env vars identified |
| 2 | Supabase Configuration | ⚠️ | Service key exposure risk, duplicate client creation |
| 3 | Runtime Exceptions | ⚠️ | Auth middleware generic Error throws, empty catch blocks |
| 4 | Async Bugs | ⚠️ | Fire-and-forget analytics, catch pattern inconsistency |
| 5 | React Runtime | ✅ | No infinite rerenders, useRef patterns correct |
| 6 | SSR Compatibility | ⚠️ | OrbBackground render-time browser access |
| 7 | Routing | ✅ | Error boundary + Suspense properly implemented |
| 8 | Database | ⚠️ | N+1 fallback queries, no pagination on listAll |
| 9 | Storage | ✅ | Upload validation present, MIME checking, path handling safe |
| 10 | Authentication | ⚠️ | Auth middleware throws generic Error instead of 401 |
| 11 | Realtime | ⚠️ | Shared channel ref-counting could leak |
| 12 | Performance | ✅ | useMemo/useCallback used appropriately, animation throttling |
| 13 | Production Deployment | ⚠️ | Missing wrangler.json docs at root |
| 14 | Error Recovery | ⚠️ | `normalizeError` re-throws, empty catch blocks |
| 15 | Configuration Files | ⚠️ | Missing `.env.example`, `.gitignore` |

---

## SUMMARY STATS

| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 5 |
| 🟡 Medium | 6 |
| 🔵 Low | 8 |
| **Total** | **21** |

---

## RECOMMENDED FIX PLAN

### Immediate (Blocking Production Launch)
1. Generate `.env.example` with all required variables
2. Generate `.gitignore`
3. Fix auth middleware to return proper 401 responses instead of throwing

### Before Next Release
4. Fix Supabase client to gracefully degrade when env vars are missing
5. Guard against service role key client-side exposure
6. Cache analytics admin client to avoid per-request creation
7. Fix N+1 queries in analytics fallback with `.limit()`

### Next Sprint
8. Add logging to empty catch blocks
9. Fix JSON.stringify order-dependency in provision dedup
10. Audit realtime channel lifecycle for leak scenarios
