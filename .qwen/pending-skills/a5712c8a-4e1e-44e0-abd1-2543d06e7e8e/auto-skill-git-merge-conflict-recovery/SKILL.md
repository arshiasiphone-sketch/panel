---
name: git-merge-conflict-recovery
description: Recover a repo that is repo-wide merge-conflict corrupted — including the case where HEAD's committed blobs themselves contain conflict markers (so `git checkout HEAD --` does NOT resolve them), with a CRLF-safe marker stripper that keeps the HEAD/ours side.
source: auto-skill
extracted_at: '2026-07-09T16:38:24.930Z'
---

# Recovering repo-wide git merge-conflict corruption

Verified while fixing 28 conflicted files in this TanStack Start + Nitro project.
Two non-obvious traps cost several turns; the procedure below avoids both.

## Trap 1 — HEAD's committed blobs can be the conflicted version

If the conflicted files were committed while still marked (e.g. an initial
commit made mid-merge), then `git show HEAD:<file>` and
`git checkout HEAD -- <file>` return the **marker-corrupted** blob. A literal
"resolve to HEAD" then reproduces the corruption instead of removing it.

Detect this before trusting `git checkout HEAD`:
```js
// for each conflicted file f:
const c = cp.execSync(`git show HEAD:${JSON.stringify(f)}`, {encoding:'utf8'});
const hasMarkers = /^(<<<<<<< |=======|>>>>>>> )/m.test(c);
```
If `hasMarkers` is true for the committed HEAD version, prefer the
**already-staged working/index version** (git often has the clean,
conflict-free version staged) over `git checkout HEAD`. Restore it from a
pre-resolution backup copy you made, or from the index.

## Trap 2 — CRLF makes a naive marker-stripper DESTROY files

Files here use `\r\n` line endings. Splitting on `\n` leaves a trailing `\r`
on every line, so `^=======$` (and only that separator) fails to match. The
state machine then never leaves "ours", keeps the `theirs` section, and the
next run deletes all legitimate code after the first `=======`.

**Always strip `\r` before matching marker lines.** Use this safe resolver
(keeps the `<<<<<<< HEAD` / ours side, drops `=======` … `>>>>>>>`):

```js
const fs = require("fs");
const isOurs   = (l) => /^<<<<<<<(?: .*)?$/.test(l);
const isSep    = (l) => /^=======$/.test(l);
const isTheirs = (l) => /^>>>>>>>(?: .*)?$/.test(l);

function resolveKeepOurs(text) {
  const lines = text.split("\n").map((l) => (l.endsWith("\r") ? l.slice(0, -1) : l));
  const out = [];
  let state = "outside";
  for (const ln of lines) {
    if (isOurs(ln))   { state = "ours";   continue; }
    if (isSep(ln))    { state = "theirs"; continue; }
    if (isTheirs(ln)) { state = "outside"; continue; }
    if (state === "outside" || state === "ours") out.push(ln);
  }
  return out.join("\n"); // LF output is fine; git normalizes
}
```

## Recommended procedure (what worked)

1. **Backup branch first** (user's recovery point):
   `git branch backup-before-conflict-fix`
2. **Back up the CURRENT (pre-resolution) versions** of every conflicted
   file into `.conflict-backup/current/<relpath>` with `fs.cpSync`/`copyFileSync`
   BEFORE any `git checkout`. These are your only clean copies if HEAD is
   corrupted (Trap 1).
3. **Count conflict blocks per file** from HEAD for the record:
   `git show HEAD:<f>` → count `^<<<<<<< ` occurrences. (Total here: 365
   across 28 files; `package-lock.json` alone had 193, `src/lib/cms.ts` 35.)
4. **Restore the clean version**, not `git checkout HEAD`:
   - Copy each file back from `.conflict-backup/current/<f>` (the staged
     working version, which was conflict-free and already contained the
     desired fix, e.g. `tslib` in `dependencies`).
   - Run `resolveKeepOurs` (above) on it as a belt-and-suspenders pass — safe
     even if no markers remain.
5. **Validate, don't assume:**
   - `JSON.parse` `package.json` and `package-lock.json` (the corrupted
     `package-lock.json` failed parse at line 66 → regenerate with
     `npm install`).
   - Confirm `tslib` is in `dependencies` (not `devDependencies`).
   - Grep all 28 for `^(<<<<<<< |=======|>>>>>>> )` → must be 0.
6. **Regenerate the lockfile**: `npm install` (the committed `package-lock.json`
   may be broken; regen makes it consistent with the now-clean `package.json`).
7. **Rebuild + verify** the deployment artifact (e.g. `.vercel/output`), then
   grep the server bundle for external `import "tslib"` / `require("tslib")`
   to prove a runtime `ERR_MODULE_NOT_FOUND` is gone (target: 0).

## Tell-tale signs you're in this situation

- `git status` shows the files as already-staged `modified` (not `UU`
  unmerged) — the merge "completed" but left committed markers.
- `git checkout HEAD -- <f>` makes markers **appear** in the working file
  (it restored the corrupted blob).
- `npm install` / `node -e "require('./package.json')"` throws
  `JSONParseError ... <<<<<<< HEAD` — the committed manifest is conflicted.

## When to apply

Any time a repo is reported as "merge conflict corrupted" / "resolve all to
HEAD" and the naive `git checkout HEAD --` either fails or re-introduces
markers. Especially on Windows (CRLF) repos, and when `package.json` /
`package-lock.json` themselves fail to parse. Complements
`auto-skill-cmd-shell-quirks` (use inline single-line cmds / Node scripts, not
`set`+`%VAR%` blocks) and `auto-skill-nitro-cloudflare-config`.
