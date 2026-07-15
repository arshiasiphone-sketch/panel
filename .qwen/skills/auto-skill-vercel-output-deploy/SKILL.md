---
name: vercel-output-deploy
description: In this Lovable+Vercel project the live site ships the COMMITTED .vercel/output bundle, not a fresh source rebuild — so a src/ edit only goes live after you rebuild and commit .vercel/output. Includes the live-bundle verification technique (fetch HTML, grep served chunks) to confirm a fix actually shipped.
source: auto-skill
extracted_at: '2026-07-15T18:00:00.000Z'
---

# Getting a source fix actually LIVE in this Lovable + Vercel project

## The gotcha (this silently cost two failed deploy attempts)

Pushing a commit that edits `src/` may NOT change the live site. In this repo
the deployable artifact is the **committed `.vercel/output` directory** (Vercel
Build Output API). Observed behavior: after a source-only fix was committed +
pushed, the live bundle kept serving the **old** `.vercel/output` (entry chunk
`index-mEriUKU9.js`, still containing the pre-fix code) even though the new
commit's `src/` had the fix. The fix only went live after `.vercel/output` was
rebuilt and committed.

Why it's easy to miss: `git push` "succeeds" and the branch is ahead, so it
*looks* deployed. But the JS the browser downloads is whatever is in the
committed `.vercel/output`, not a fresh build of the new `src/`. The console
also gives no error — the resolver just keeps degrading to DEFAULT (e.g. the
4 `Workspace Health` warnings), so you waste cycles re-debugging the code that
is already fixed in `src/`.

(We could not 100% prove whether Lovable rebuilds from source on push or ships
the committed output; in practice BOTH modes are covered by the procedure
below, so never rely on a source-only push being sufficient.)

## Procedure — make a `src/` fix actually go live

1. Edit `src/` as needed.
2. **Rebuild the output:**
   `npm run build`  (→ `node scripts/build.mjs` → `vite build` → writes `.vercel/output`)
   Confirm it finishes: `✓ built in Xs` + `Generated .vercel/output/nitro.json`.
3. **Verify the fix is in the LOCAL built bundle** before pushing (don't trust
   the source edit alone). Grep the built chunks for the changed token. For the
   Zod `datetime` change it was:
   ```js
   const fs=require('fs'),path=require('path');
   const dir='.vercel/output/static/assets';
   let fix=0,bug=0;
   for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js'))){
     const js=fs.readFileSync(path.join(dir,f),'utf8');
     fix += (js.match(/\.datetime\(\{[^)]*offset\s*[:!]\s*[!0]/g)||[]).length;
     bug += (js.match(/\.datetime\(\s*\)/g)||[]).length;
   }
   console.log({fix,bug}); // fixed build: fix>0, bug===0
   ```
4. **Stage + commit + push the rebuilt output.** Git rename-detects the hashed
   files (e.g. `index-mEriUKU9.js` → `index-CWseWO3z.js`), so the commit is a
   clean set of renames:
   ```
   git add -A .vercel/output
   git commit -m "build: bundle <fix> into .vercel/output"
   git push
   ```
   ⚠️ `git add .vercel/output` (no `-A`) does NOT stage deletions of files the
   build removed, so the old hashed chunks linger in the tree. Use `-A` so the
   old chunks are removed too.
5. **Verify the LIVE bundle actually has the fix** (next section). A successful
   push ≠ fix is live.

## Verify the live (served) bundle contains the fix

A `git push` succeeding only means the branch moved. Confirm what the browser
actually downloads by fetching the live HTML and grepping the served chunks:

```js
// _verify_live.mjs — set BASE_URL to the live Vercel host
const ROOT = process.env.BASE_URL || "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();
const urls = [...new Set([...html.matchAll(/(?:src|href)="([^"]+\.js[^"]*)"/g)]
  .map(m => m[1].startsWith("http") ? m[1] : new URL(m[1], ROOT).href))];
let fixHits=0, bugHits=0, previewHits=0, entry="";
for (const u of urls) {
  const js = await (await fetch(u)).text();
  if (u.includes("index-")) entry = u.split("/").pop();
  fixHits += (js.match(/FIX_TOKEN/g)||[]).length;   // your fix's signature
  bugHits += (js.match(/BUG_TOKEN/g)||[]).length;   // the bug's signature
  if (js.includes("preview_domain")) previewHits++;
}
console.log({ entry, fixHits, bugHits, previewHits });
```

Read it:
- `entry` should match your LOCAL build's entry chunk hash (e.g.
  `index-CWseWO3z.js`), NOT the old one (`index-mEriUKU9.js`).
- `fixHits > 0` and `bugHits === 0` ⇒ the fix is live.
- If `entry` is still the OLD hash or `bugHits > 0`, the deploy hasn't picked
  up the rebuilt output yet — wait for the build to finish, or re-push.

⚠️ **The entry chunk may be served from `/assets/`, not the site root.** Observed
2026-07-15: a build's entry moved from `/index-CWseWO3z.js` (root) to
`/assets/index-B-IGmBd9.js`. A verification regex hard-coded to
`src="/index-[…].js"` (root path) will MISS the live build and falsely report
"bundle=(none)". The enumerator above — `/(?:src|href)="([^"]+\.js[^"]*)"/g` —
already catches both root and `/assets/` paths, so `entry` resolves correctly
either way. Prefer it over any root-only pattern.

This "fetch the HTML → enumerate `<script src>`/`<link href>` `.js` URLs →
fetch each chunk → grep" technique is the dependable way to answer "did my
change actually ship?" without trusting the push or the build log. It works
from plain `node` (no browser, no `.env` needed for the bundle check).

## Symptom that points here

If you've fixed the code (e.g. a workspace-resolution bug from the
`workspace-isolation` / `domain-preview` skills), pushed, and the live site
STILL shows the old symptom with **no new error** in the console, suspect this
deploy gap before re-debugging the source. Re-confirm the live bundle's entry
hash and grep for the bug token — if the bug token is still present in the
served chunks, the fix never deployed.

## When to apply

Any time you edit `src/` (Zod schemas, resolver, context, components, anything
that ends up in the client/server bundle) and need the change on the live
Vercel deploy. Pair with `domain-preview` and `workspace-isolation` for the
specific workspace-resolution bugs; this skill is about the deploy pipeline
that carries the fix to production.
