---

    PROJECT HANDOFF: "NAMA" — multi-tenant CMS platform (TanStack Start + Supabase, deployed on Vercel via Lovable)

    1. What the product is
    A white-label / multi-tenant CMS for cafés and similar venues. One codebase serves many customer "workspaces" (each a separate business/site). Owners manage their site content through a shared admin
    panel. The platform can provision a new workspace (a "cafeteria blueprint") and serve it on its own subdomain/slug.

     - Live admin (root workspace): https://panel-ecru-three.vercel.app/admin
     - Per-tenant preview (local-test mechanism): https://panel-ecru-three.vercel.app/admin?preview_domain=<domain> e.g. ?preview_domain=khane.nama.app
     - Public site is rendered from the same workspace context.

    2. Tech stack
     - Framework: TanStack Start ^1.168.25 (file-based routing via TanStack Router, SSR, Nitro build → Vercel).
     - Data: Supabase (Postgres + RLS). Accessed through a Repository layer (src/lib/repositories, src/lib/repositories/factory.ts), never raw Supabase calls in components.
     - State: TanStack Query (@tanstack/react-query) for all CMS reads/writes; Zustand for some test/store state.
     - Styling: Tailwind, RTL (Persian/Farsi), Vazirmatn font. Admin UI components in src/components/admin/.
     - Build: node scripts/build.mjs (runs vite build with NODE_ENV=production, regenerates route tree, outputs to committed .vercel/output).

    3. Multi-tenancy model (critical to understand)
     - Workspaces are stored in the workspaces table, keyed by a `domain` column (e.g. khane.nama.app). All custom workspaces currently have owner_user_id: null.
     - Resolution priority (in src/lib/core/workspace/context.tsx → extractWorkspaceFromPath):
       1. `?preview_domain=` query param (local-test override, takes top priority) — see §4.
       2. /cafe/<slug> route → resolves to <slug>.nama.app.
       3. Subdomain / full hostname resolution (resolveWorkspaceByDomain).
       4. Authenticated user's workspace (auth flow fallback) — only when no explicit domain was requested.
     - `theme_settings` is a GLOBAL SINGLETON by design (one row, id=1, no workspace_id). Do NOT "fix" it to per-workspace unless explicitly asked. All provisions legitimately start identical from one
       blueprint, so a shared theme is correct.
     - Content isolation: each workspace has its OWN rows in menu_items, gallery_images, events, page_blocks, site_content, personality_profiles, etc. Data is isolated at the DB layer. NOTE: because
       provisions were seeded from a template, the content across slugs is currently identical (this was accepted by the user as "isolation is enough" — the data layer is isolated even if values look the
       same).

    4. The ?preview_domain= preview mechanism (the part that was just fixed)
     - Gated by `VITE_ENABLE_DOMAIN_PREVIEW=true` in .env. It is a local-testing-only override and must NEVER work in real production (the gate blocks it).
     - Root cause of the bug we just fixed: the workspace provider read preview_domain once from window.location at mount; admin nav <Link>s didn't forward the search param, so navigating
       /admin?preview_domain=khane.nama.app → /admin/menu dropped the param, and a reload fell back to DEFAULT_WORKSPACE.
     - Fix (3 layers):
       1. src/routes/__root.tsx declares preview_domain in a global root validateSearch, so TanStack Router treats it as first-class and auto-preserves it across every client-side navigation.
       2. src/lib/core/workspace/context.tsx reads the param reactively via useRouterState({ select: s => s.location.search }) and re-resolves the workspace when it changes (no more one-shot window read).
       3. Every admin navigation now forwards search={previewSearch} where previewSearch = previewDomain ? { preview_domain: previewDomain } : undefined:
          - src/components/admin/admin-shell.tsx — header logo, "افزودن بلوک" button, NavList (desktop sidebar + mobile drawer), mobile bottom nav, page-builder FAB.
          - src/components/admin/command-palette.tsx — command palette navigation.
          - src/routes/admin.index.tsx — dashboard MiniStat/QuickLink and inline links.

    5. Deployment model (Lovable + Vercel) — READ THIS
     - The repo is linked to Lovable; pushing to main syncs to Lovable and triggers Vercel.
     - The live site serves the COMMITTED `.vercel/output` bundle, NOT a fresh source rebuild. So a src/ edit only goes live AFTER you (a) rebuild with node scripts/build.mjs and (b) commit the regenerated
       .vercel/output. To verify a fix actually shipped, fetch the live HTML and confirm the new /assets/index-*.js hash is present.
     - Do NOT rewrite published git history (force-push/rebase/amend already-pushed commits) — Lovable depends on linear history.
     - Commit message convention seen in history: fix: / feat: / build: bundle ... into .vercel/output.

    6. Supabase / DB constraints (assistant-side)
     - Direct Postgres / Supabase CLI migrations are unreachable for this ref ("tenant/user not found"). Apply DDL via the Supabase SQL Editor (REST works). Keep a matching .sql file under
       supabase/migrations/ as documentation.
     - This assistant's shell has no `.env` with `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`, so it cannot connect to the DB or run diagnostic *.mjs scripts itself. Author SQL for the user to paste; ask the
       user to report row counts/errors. Do not claim a migration "worked" without user confirmation.

    7. Current working state (verified)
     - HEAD = ad2d492 on main (pushed). Build is green (exit 0). Live client entry is index-ZnIJAGa0.js.
     - Multi-tenant admin preview is wired across ALL admin sections; preview_domain persists through navigation.
     - 9 workspaces exist keyed by domain; khane scoped to its own rows (verified earlier this session).
     - Admin route files present: admin.index, admin.page, admin.site-content, admin.menu, admin.gallery, admin.events, admin.media, admin.test-analytics, admin.test-results, admin.test-questions,
       admin.personality-types, admin.analytics, admin.settings, admin.activity, admin.bookings, admin.calendar, admin.forms, admin.notifications (wrapped by admin.tsx → AdminShell).

    8. The 10 last major things done to the project
     1. `ad2d492` (2026-07-15) — Multi-tenant admin nav. Made ?preview_domain survive every admin-section navigation (root validateSearch + reactive provider read + search={previewSearch} on all admin
        links/palette/dashboard). Rebuilt .vercel/output. ← most recent.
     2. `aa66b6f` (2026-07-15) — SiteContent scoping fix. Merged default-owned global rows into SiteContent.getAll() so the landing page still renders after workspace scoping was applied (previously globals
         vanished under workspace filtering).
     3. `30411b9` (2026-07-15) — CMS query refetch on resolve. After the workspace resolves (post-mount), invalidated ['cms'] and ['test'] query keys so public read hooks re-run against the now-correct
        workspace context instead of the unfiltered mount-time union.
     4. `89b0b17` (2026-07-15) — Bundled schema fix into deploy. Rebuilt .vercel/output to ship the datetime-schema fix live.
     5. `53e5f36` (2026-07-15) — Workspace schema: timestamptz offset. Made schema validation accept Postgres timestamptz offset-formatted datetime fields (was rejecting offsets).
     6. `b7a0090` (2026-07-15) — `resolveWorkspaceByDomain` error surfacing. Stopped silently degrading to the default workspace on resolve errors; now surfaces the real error and degrades gracefully
        (avoids wrong-site render + the uniq_default_workspace_per_owner 409/23505 conflict).
     7. `ec4dfa6` (2026-07-14) — URL slug fix #4. Continued subdomain/slug routing corrections so each provision resolves to its own domain.
     8. `53c2161` (2026-07-13) — URL slug fix #3. Further slug-resolution corrections.
     9. `ff4f901` (2026-07-13) — In-app provisioning + isolation migration + SSR fixes. Added /api/provision route, a workspace-isolation DB migration, and SSR crash fixes so provisioned sites render.
     10. `e8bebbb` / `ac354e4` (2026-07-12/13) — Provision URL fixing (1 & 2). Initial corrections to how provisioned workspace URLs/slugs are generated and resolved.

    9. Caveats / open items for the next AI
     - Many untracked diagnostic scripts (_*.mjs, _build*.txt) sit at repo root — they are scratch tooling, NOT part of the app; leave them out of commits.
     - .qwen/skills/auto-skill-workspace-isolation and auto-skill-vercel-output-deploy are project memory/skills (auto-generated) — keep them.
     - Public provisioning API lives under src/routes/api/ and src/routes/provision.tsx.
     - If per-workspace theming is ever needed, it requires BOTH a live DB migration AND workspace_id scoping restored in src/lib/repositories/theme.ts — not just a code change.

    10. How to verify a change is live (do this every time)
     1. Edit source.
     2. node scripts/build.mjs (regenerates route tree + .vercel/output).
     3. git add src .vercel/output and commit (leave _*.mjs/_build*.txt unstaged).
     4. git push origin main (or as the user directs).
     5. Fetch https://panel-ecru-three.vercel.app/ HTML and grep the <script> tags for the new /assets/index-*.js hash to confirm the build shipped.

    ---
