---
name: supabase-migration-connectivity
description: How to apply a SQL migration / DDL in THIS Lovable-linked Supabase project when direct Postgres + Management API + REST-SQL are all blocked; the diagnostic chain and the fallback (SQL Editor). Also Windows/ESM gotchas for throwaway pg scripts.
source: auto-skill
extracted_at: '2026-07-09T13:24:30.429Z'
---

# Applying Supabase DDL/Migrations in this project (verified the hard way)

## TL;DR — the trap

This project is **Lovable-linked**. The Supabase project ref in `.env`
(e.g. `xrlhnqvzlrizdphkmzfo`) is a working **REST/API host** but is **NOT a
recognized Postgres DB tenant**. Therefore you CANNOT apply DDL via a direct
Postgres connection built from the `.env` values, and several other "obvious"
paths also fail. The reliable path is the **Supabase SQL Editor in the
dashboard** (or a real connection string the user supplies from the
dashboard's Connection-string / URI tab — which may differ from the `.env`
host).

## Symptoms that tell you you've hit this

- `db.<ref>.supabase.co` → **ENOTFOUND** (no DNS record at all).
- Connecting to any `aws-0-<region>.pooler.supabase.com:6543` with role
  `postgres.<ref>` → **`(ENOTFOUND) tenant/user postgres.<ref> not found`**
  in **every** AWS region.
- BUT `GET https://<ref>.supabase.co/rest/v1/<table>?...` with the publishable
  key returns **200** and the table exists. (App/REST works; DB host doesn't.)

That combination = the `.env` ref serves the API but has no underlying
`db.`/pooler tenant. Don't waste time guessing regions — none will work.

## Diagnostic chain (run in order; each is a known failure mode here)

1. **Supabase Management API** (`POST api.supabase.com/v1/projects/<ref>/database/query`
   with the service-role key as bearer) → **401 "JWT failed verification"**.
   Service-role key is NOT a valid Management-API bearer. Dead end.
2. **REST SQL endpoint** `POST https://<ref>.supabase.co/rest/v1/sql` with
   service-role key → **404 PGRST205** ("Could not find the table 'public.sql'").
   The SQL query endpoint is disabled on this test project; data API only
   allows table CRUD, not DDL. Dead end.
3. **Direct `db.<ref>.supabase.co:5432`** via `pg` → ENOTFOUND (see above).
4. **Pooler region scan** → "tenant/user not found" everywhere (see above).
5. **REST read probe** (read-only, safe) confirms the project + table are real
   even though DB TCP is unreachable:
   ```js
   // node -e "..."
   https.get('https://<ref>.supabase.co/rest/v1/<table>?select=id&limit=1',
     { headers: { apikey: K, Authorization: 'Bearer ' + K } }, r => { ... })
   // expect STATUS 200 + []
   ```

## The working path: have the user run DDL in the SQL Editor

Give the user the exact SQL (from `supabase/migrations/*.sql`) and ask them to:
- Open Supabase Dashboard → Project Settings → Database → **SQL Editor** (or
  **Connection string** if they prefer to paste a real URI back to you).
- Paste & run the migration there.
- Confirm success (or paste any error).

You cannot verify the DDL via a direct Postgres connection (same tenant
problem), so rely on the user's "done" + a read-only REST probe where possible.

## Windows / ESM gotchas for throwaway `pg` migration scripts

- **No `psql` / `supabase` CLI** installed → use the Node `pg` client.
- Install without touching package.json: `npm install pg --no-save`.
- **ESM ignores `NODE_PATH`** — a script in a temp dir (e.g. `C:\Users\...\Temp`)
  cannot `import pg from 'pg'`. Either (a) place the `.mjs` **inside the project
  root** so Node resolves `node_modules` by walking up, run it, then `del` it; or
  (b) write a `.cjs` script and `require('pg')` (CJS resolution honors the
  project's `node_modules` regardless of script location is also unreliable —
  prefer (a)).
- **Windows shell has no `tail`/`grep`** — `npm install pg --no-save 2>&1 | tail -3`
  fails with "'tail' is not recognized". Redirect to a `.log` file and inspect
  with the `grep_search` tool instead.
- Keep throwaway scripts OUT of the repo (put in project root only transiently,
  then delete, since `.env` is gitignored but `_tmp.mjs` is not).

## When to apply
Use this skill whenever you need to **apply a schema migration / DDL** to this
project's Supabase database (add a column, create an index, alter a table), or
when a DB connection attempt fails and you need to decide whether it's a
credentials problem vs. the Lovable-linked-tenant problem. Also applies to any
task that assumes "I can just connect to `db.<ref>.supabase.co`" — you probably
can't here.
