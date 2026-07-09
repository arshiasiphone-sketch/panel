# Provisioning CPU Verification — Free Plan (FINAL CHECK)

**Generated:** 2026-07-08
**Status:** STEP 1 complete (cited). STEP 2 **NOT EXECUTABLE in this environment** — see "Why STEP 2 could not be run here". No fabricated numbers. No public API built.

---

## STEP 1 — Current official Free-plan CPU limit (✅ done, live docs)

**Verified value: 10 ms CPU time per HTTP request on the Cloudflare Workers FREE plan.**

Source (fetched live, two corroborating fetches of the same canonical page):
- **URL:** https://developers.cloudflare.com/workers/platform/limits/
- Account plan limits table:
  > `| CPU time | 10 ms | 5 min |`
- CPU time section:
  > `| CPU time per HTTP request | 10 ms | 5 min (default: 30 seconds) |`
- Daily requests: **100,000/day** on Free (resets midnight UTC).

Direct quote on what counts:
> "CPU time measures how long the CPU spends executing your Worker code. Waiting on network requests (such as `fetch()` calls, KV reads, or database queries) does **not** count toward CPU time."

Note on the premise "it used to be 10 ms then increased": the **current** docs still state **10 ms** for Free. (The 30-second figure is the Paid-plan default, not Free.) So the relevant budget for this design is **10 ms/request**.

---

## STEP 2 — Real deployed measurement (❌ could NOT be run here)

I did **not** deploy, and I did **not** read any dashboard CPU number, because this environment cannot perform that step. Concrete evidence gathered:

| Check | Result | Consequence |
|-------|--------|-------------|
| `CLOUDFLARE_API_TOKEN` env var | **unset** | `wrangler deploy` cannot authenticate → no push to Cloudflare |
| `wrangler` CLI | **not installed** (`WRANGLER=no`) | no local deploy/tail path |
| `wrangler.toml` / deploy config | **none exists** | Nitro only generates `wrangler.json` on `vite build` when `deployConfig` is true (off outside Lovable sandbox) |
| `package.json` scripts | `dev/build/build:dev/preview/lint/format` — **no `deploy`** | this project is deployed by the **Lovable platform**, not a local `wrangler deploy` |
| Cloudflare dashboard GUI | **no access** | I run on a Windows sandbox with no browser/dashboard tool; `computer_use` is macOS-only and unavailable here |

Because of this, I will **not** invent a "measured ~X ms" figure. The user's instruction ("a real number from the dashboard, not an estimate") cannot be satisfied from this machine. The measurement must be done on a machine/account with (a) a Cloudflare API token, (b) `wrangler`, and (c) either dashboard access or `wrangler tail`.

---

## Ready-to-run procedure for the user (to get the real number)

### 1) Add the temporary test route
`src/routes/api/single-step-check.ts` (realistic `INSERT_THEME` simulation: one Zod validation + one real Supabase upsert against the existing `site_content` table, reusing the project's `themeSchema` and `supabaseAdmin`):

```ts
import { createFileRoute } from '@tanstack/react-router'
import { supabaseAdmin } from '@/integrations/supabase/client.server'
import { themeSchema } from '@/lib/cms-schemas'

export const Route = createFileRoute('/api/single-step-check')({
  server: {
    handlers: {
      GET: async () => {
        // 1) one Zod validation (same shape a real step uses)
        const parsed = themeSchema.parse({
          primary_color: '#c8a27a',
          secondary_color: '#3a2e25',
          accent_color: '#e0b97d',
          background_color: '#1a1410',
          text_color: '#f5efe6',
          text_secondary_color: '#cbb9a6',
          text_tertiary_color: '#8c7a66',
          border_radius: '14px',
          glass_opacity: 0.12,
        })
        // 2) one real DB write (the await time does NOT count toward CPU)
        const { error } = await supabaseAdmin
          .from('site_content')
          .upsert({
            key: 'provision:single-step-check:theme',
            value: parsed,
            updated_at: new Date().toISOString(),
          })
        return Response.json({ done: true, hadError: !!error })
      },
    },
  },
})
```

### 2) Make the project deployable to Cloudflare Free (one-time)
- Add `wrangler` (`npm i -D wrangler`) and a `CLOUDFLARE_API_TOKEN` (Free plan, no Paid add-on).
- In `vite.config.ts`, set the Nitro deploy config (off by default outside the Lovable sandbox):
  ```ts
  export default defineConfig({
    nitro: { cloudflare: { deployConfig: true } },
  })
  ```
- Provide Worker env: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` as `wrangler` `vars`/`secrets` (or via `nitro.cloudflare.wrangler.vars`).

### 3) Deploy + measure
```sh
npm run build
npx wrangler deploy
# 5 requests
for i in 1 2 3 4 5; do curl -i https://<your-subdomain>.workers.dev/api/single-step-check; done
```
- **CPU time (no GUI needed):** `npx wrangler tail --format json` while curling — each invocation prints `cpuTimeMs` in the event metadata.
- **Or dashboard:** Cloudflare → Workers & Pages → *[worker]* → **Metrics** → CPU time per request.

Then delete `src/routes/api/single-step-check.ts`.

---

## Verdict (honest, with the measurement gap stated)

- **Free-plan limit:** **10 ms** CPU per request, 100,000 req/day — *cited from official docs above*.
- **Measured actual CPU for one step:** **UNAVAILABLE from this environment** (no Cloudflare auth, no wrangler, no dashboard access). I am explicitly **not** substituting an estimate for the requested dashboard number.
- **Engineering expectation (NOT a measurement):** a step that is one Zod parse (microseconds of CPU) + one DB write (the `await` is excluded from CPU by Cloudflare's own definition) is overwhelmingly I/O-bound and is expected to consume **well under 1 ms** of CPU — i.e. comfortable headroom vs 10 ms. This is *consistent with* (not *proven by*) the earlier local wall-clock test (0.6–2.0s, all network wait).
- **Risk flag (do this regardless of the single-step number):** `INSTALL_BLUEPRINT` (`steps.ts`) performs *multiple serial DB queries and many row inserts in one command*. Even though each `await` is free, the cumulative CPU of JSON serialization across many rows + many round-trips can grow with blueprint size. **Recommend splitting `INSTALL_BLUEPRINT` into sub-steps** (pages / navigation / menu / gallery / personalities / cms_data) — which dovetails with the already-deprecated `CREATE_PAGES`/`CREATE_NAVIGATION`/`INSERT_BLOCKS`/`INSERT_CMS_DATA` step enums. This keeps every per-poll step small and safe under 10 ms even for large blueprints.

**Bottom line:** the documented 10 ms budget is the binding constraint; single validation+DB-write steps are expected to fit comfortably, but the *real* number must come from your deployed Free-plan Worker (procedure above). The `INSTALL_BLUEPRINT` step should be sub-split as a design safeguard independent of that measurement.

*No resumable engine or public API endpoints were built. No test route was left in the repo (the code above is provided for the user to run the real measurement).*
