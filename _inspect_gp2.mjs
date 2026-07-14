// Extract the FULL deployed `async function gp(...)` (resolveWorkspaceFromRequest).
const ROOT = "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();
const urls = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) urls.add(new URL(m[1], ROOT).href);
const all = new Set(urls);
for (const u of [...all]) {
  const js = await (await fetch(u)).text();
  for (const m of js.matchAll(/["'](\/assets\/[^"']+\.js)["']/g)) all.add(new URL(m[1], ROOT).href);
}
for (const u of all) {
  const js = await (await fetch(u)).text();
  const needle = "async function gp(";
  let i = js.indexOf(needle);
  while (i >= 0) {
    console.log(`\n########## ${u} ##########`);
    console.log(js.slice(i, i + 1600).replace(/\n/g, " "));
    i = js.indexOf(needle, i + 1);
    if (i > 900000) break;
  }
}
console.log("\nDONE");
