// Verify whether the LIVE deploy was built with VITE_ENABLE_DOMAIN_PREVIEW=true
// by inspecting the shipped JS bundle for the preview_domain code path.
const BASE = process.env.BASE_URL || "https://panel-ecru-three.vercel.app/";

const html = await (await fetch(BASE)).text();
// Collect module/script srcs (modulepreload + script src + href)
const srcs = [...html.matchAll(/(?:src|href)="([^"]+\.js[^"]*)"/g)].map(m => m[1]);
const abs = [...new Set(srcs.map(s => (s.startsWith("http") ? s : new URL(s, BASE).href)))];
console.log("JS/module URLs found:", abs.length);

let foundPreview = false;
let previewFiles = [];
let flagValue = "unknown";
for (const url of abs) {
  try {
    const js = await (await fetch(url)).text();
    if (js.includes("preview_domain")) {
      foundPreview = true;
      previewFiles.push(url);
    }
    const m = js.match(/VITE_ENABLE_DOMAIN_PREVIEW[^;]{0,80}/);
    if (m) flagValue = m[0];
  } catch (e) {
    // ignore
  }
}
console.log("files referencing 'preview_domain':", previewFiles.length);
console.log(previewFiles.join("\n"));
console.log("\n=== RESULT ===");
console.log("bundle references 'preview_domain':", foundPreview);
console.log("flag context snippet:", flagValue);
