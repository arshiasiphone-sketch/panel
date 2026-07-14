// Re-fetch the CURRENT panel-ecru-three.vercel.app entry bundle and check whether
// the ?preview_domain gate is active (flag NOT inlined) or eliminated (flag true).
const ROOT = "https://panel-ecru-three.vercel.app/";

const html = await (await fetch(ROOT)).text();
// entry chunk: <script type="module" crossorigin src="/assets/index-XXXX.js"> or modulepreload
const m = html.match(/(?:src|href)="(\/[^"]*index-[^"]*\.js)"/);
if (!m) {
  console.log("NO entry chunk found in HTML. modulepreloads:");
  console.log((html.match(/[^"]*\.js/g) || []).slice(0, 10));
  process.exit(0);
}
const chunkPath = m[1];
console.log("ENTRY CHUNK:", chunkPath);
const jsUrl = new URL(chunkPath, ROOT).href;
const js = await (await fetch(jsUrl)).text();
console.log("bundle size:", js.length);

// 1) Is the gate active? Look for the flag check that RETURNs undefined when not "true".
const gateHits = [...js.matchAll(/VITE_ENABLE_DOMAIN_PREVIEW[^;]{0,80}/g)].map(x => x[0]);
console.log("\n=== VITE_ENABLE_DOMAIN_PREVIEW occurrences ===");
gateHits.forEach(h => console.log(h));

// 2) Find extractPreviewDomain (Mp) and show its body
function showFn(nameFragment, ctxPad = 200) {
  const i = js.indexOf(nameFragment);
  if (i < 0) { console.log(`\n(${nameFragment} not found)`); return; }
  console.log(`\n=== near "${nameFragment}" ===`);
  console.log(js.slice(i - 40, i + ctxPad));
}
showFn("preview_domain");
showFn("extractPreviewDomain");
// The minified fn that reads preview_domain param:
const pi = js.indexOf('"preview_domain"');
console.log(`\n=== get("preview_domain") context ===`);
if (pi >= 0) console.log(js.slice(pi - 160, pi + 120));
