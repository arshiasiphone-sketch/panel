---
name: cmd-shell-quirks
description: Windows cmd quirk in this project's shell tool — multi-line blocks that use `set VAR=...` + `%VAR%` expansion return EMPTY output (even echo lines vanish). Use inline single-line commands or a Node fetch script instead.
source: auto-skill
extracted_at: '2026-07-09T14:17:58.296Z'
---

# Windows `cmd` shell quirk — empty output from `set`/`%VAR%` blocks

## The trap (hit twice in one session)

When you write a multi-line `cmd` command block that defines variables with
`set "VAR=value"` and then expands them with `%VAR%`, the **entire block returns
empty stdout** — even plain `echo` lines do not print. The command exits
`0` with `Error: (none)`, so it looks like it "ran fine" but produced nothing.

Confirmed-failing shape (output was completely empty):
```bat
cd /d C:\...\myproject
set "SRK=eyJ...long-key..."
set "BASE=https://xrl.supabase.co/rest/v1/provision_transactions"
echo === A ===
curl.exe -s -w "\nHTTP %{http_code}\n" "%BASE%?select=id" -H "apikey: %SRK%"
```
Also failed (empty): a block using `set "H=-H x-api-key:%KEY%"` then `%H%` inside
curl. Both had `set` + `%VAR%` and multiple lines.

## What actually works (verified)

1. **Single-line `curl` with the value inlined** (no `set`, no `%VAR%`):
   ```bat
   curl.exe -s -w "\n[HTTP %{http_code}]\n" http://localhost:8081/api/public/blueprints -H "x-api-key: nama_test_api_key_12345"
   ```
   Run each step as its **own** tool call (parallel calls can race — e.g. a
   status GET firing before the provision POST completes). This is the most
   reliable way to honor an explicit "curl" request.

2. **A throwaway Node `.mjs` script using global `fetch`** for multi-step
   sequences (avoids all cmd quoting/var issues). Put it in the project root
   (ESM resolves `node_modules` by walking up; a temp dir can't), run
   `node _x.mjs`, then `del` it. Example REST probe:
   ```js
   const r = await fetch(`${BASE}?select=id,external_order_id&limit=1`,
     { headers: { apikey: SRK, Authorization: `Bearer ${SRK}` } });
   console.log("HTTP", r.status, await r.text());
   ```

3. Plain `del /q a b c && echo CLEANED` and `node script.mjs` (single line, no
   `set`) work fine too.

## Passing a flag/env to a Node script — inline `set VAR=x &&` does NOT reach node

A destructive `.mjs` script often reads `process.env.FORCE` (or `DRY_RUN`) to
decide whether to write. **On this project's `cmd` shell, `set FORCE=1 && node
script.mjs` does NOT propagate the variable into the node process** — the script
runs with the flag unset (a DRY-by-default script performs REAL writes, or a
real-by-default one can't be suppressed). `FORCE=1 node ...` (bash syntax) also
fails because `cmd.exe` doesn't support `VAR=val command`.

Reliable pattern (used to reset DEFAULT content safely, 2026-07-13):
1. Make the script **DRY_RUN-by-default**: `const DRY = process.env.FORCE !== "1";`
   and print a plan (counts to delete / insert) when DRY.
2. To actually run it, **flip a constant via the edit tool** rather than an env
   var: change `const DRY = process.env.FORCE !== "1";` → `const DRY = false;`,
   run, then revert to the safe default. Editing one line is reviewable and
   deterministic on `cmd`.
3. Alternatively gate on a sentinel file: `const DRY = !fs.existsSync("_force.flag");`
   and `write_file("_force.flag","")` to enable — but delete the flag afterward.

`node --env-file=.env script.mjs` DOES work for loading the project `.env`
(supabase creds) — only ad-hoc inline flags are the problem.

## How to recognize you've hit it

- Tool result shows `Output: (empty)`, `Error: (none)`, `Exit Code: 0` for a
  block that should have printed `echo`/`curl` output.
- Especially after introducing `set "X=..."` and referencing `%X%`.

## Root cause (hypothesis)

The shell wrapper appears to mishandle multi-line batches that rely on `cmd`
variable expansion (`%VAR%`); the whole batch is swallowed rather than emitted.
Inline single-line commands and Node scripts sidestep the wrapper's batch
parsing entirely. Not worth debugging further — just use the workarounds.

## When to apply

Whenever you write a `cmd`/shell command in this project and need variables or
multi-line structure. Prefer inline single-line commands; reach for a Node
`fetch` `.mjs` script for sequences. Do NOT introduce `set VAR=...` + `%VAR%`
blocks expecting readable output — you'll get empty results and waste turns.
