// Extract the FULL deployed resolveWorkspaceFromRequest (minified as `gp`) to
// confirm whether it routes a `domain` option into resolveWorkspaceByDomain.
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
  if (!js.includes("resolveWorkspaceFromRequest")) continue;
  console.log(`\n########## ${u} ##########`);
  // find the function definition: likely `gp=` or `async function gp`
  for (const m of js.matchAll(/gp\s*=\s*async\s*function\s*\([^)]*\)\{[\s\S]*?\};/g)) {
    console.log(m[0].slice(0, 1200));
  }
  // also find resolveWorkspaceFromRequest= assignment
  let i = js.indexOf("resolveWorkspaceFromRequest=");
  while (i >= 0) {
    console.log(`\n--- resolveWorkspaceFromRequest= @${i} ---`);
    console.log(js.slice(i, i + 700).replace(/\n/g, " "));
    i = js.indexOf("resolveWorkspaceFromRequest=", i + 1);
  }
}
console.log("\nDONE");
