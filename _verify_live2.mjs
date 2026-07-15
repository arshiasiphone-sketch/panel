// Verify what the LIVE deploy actually ships:
//  - is the preview_domain code path present?
//  - does the bundled schema use datetime({ offset: true }) (the fix) or bare datetime() (the bug)?
//  - which chunk holds the workspaces query?
const ROOT = process.env.BASE_URL || "https://panel-ecru-three.vercel.app/";

const html = await (await fetch(ROOT)).text();
const srcs = [...html.matchAll(/(?:src|href)="([^"]+\.js[^"]*)"/g)].map(m => m[1]);
const abs = [...new Set(srcs.map(s => (s.startsWith("http") ? s : new URL(s, ROOT).href)))];
console.log("ROOT:", ROOT);
console.log("JS/module URLs found:", abs.length);
console.log(abs.join("\n"));

let fixHits = 0;
let bareHits = 0;
let previewHits = 0;
let queryChunk = null;
let flagCtx = "unknown";
const previewFiles = [];

for (const url of abs) {
  try {
    const js = await (await fetch(url)).text();
    if (js.includes("preview_domain")) { previewHits++; previewFiles.push(url); }
    const off = js.match(/\.datetime\(\{[^)]*offset\s*[:!]\s*[!0]/g) || [];
    const bare = js.match(/\.datetime\(\s*\)/g) || [];
    if (off.length) fixHits += off.length;
    if (bare.length) bareHits += bare.length;
    if (js.includes('from("workspaces")') || js.includes("eq(\"domain\"") || js.includes("workspace_resolver")) {
      queryChunk = url;
    }
    const m = js.match(/VITE_ENABLE_DOMAIN_PREVIEW[^;]{0,80}/);
    if (m) flagCtx = m[0];
  } catch (e) {
    console.log("fetch failed:", url, e.message);
  }
}

console.log("\n=== RESULT ===");
console.log("files referencing 'preview_domain':", previewHits);
if (previewFiles.length) console.log(previewFiles.join("\n"));
console.log("datetime({offset:...}) occurrences (the FIX):", fixHits);
console.log("bare datetime() occurrences (the BUG):", bareHits);
console.log("chunk holding workspaces query:", queryChunk);
console.log("VITE_ENABLE_DOMAIN_PREVIEW context:", flagCtx);
