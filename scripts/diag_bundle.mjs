// Verify whether the LIVE deploy was built with VITE_ENABLE_DOMAIN_PREVIEW=true
// by inspecting the shipped JS bundle for the preview_domain code path.
const BASE = "https://panel-plum-alpha.vercel.app/";

const html = await (await fetch(BASE)).text();
// Collect module/script srcs
const srcs = [...html.matchAll(/(?:src|href)="([^"]+\.js[^"]*)"/g)].map(m => m[1]);
// Also TanStack Start often inlines a module script; grab absolute URLs
const abs = srcs.map(s => (s.startsWith("http") ? s : new URL(s, BASE).href));
console.log("JS/module URLs found:", abs.length);
console.log(abs.slice(0, 20).join("\n"));

let foundPreview = false;
let foundPreviewDomainLiteral = false;
let flagValue = "unknown";
for (const url of abs.slice(0, 20)) {
  try {
    const js = await (await fetch(url)).text();
    if (js.includes("preview_domain")) { foundPreview = true; }
    if (js.includes("uniq_default_workspace_per_owner") || js.includes("REPO_WORKSPACE")) {
      // not expected in client bundle, but note
    }
    // The flag inlines as a literal; look for the gated comparison
    const m = js.match(/VITE_ENABLE_DOMAIN_PREVIEW[^;]{0,80}/);
    if (m) {
      flagValue = m[0];
    }
  } catch (e) {
    // ignore
  }
}
console.log("\n=== RESULT ===");
console.log("bundle references 'preview_domain':", foundPreview);
console.log("flag context snippet:", flagValue);
