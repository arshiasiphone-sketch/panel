// Inspect the LIVE deployed bundle's CurrentWorkspaceProvider resolve() flow and
// preview_domain handling, to see how the domain reaches resolveWorkspaceByDomain.
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
  // find preview_domain reads and the resolve() call into resolveWorkspaceByDomain
  if (!js.includes("preview_domain") && !js.includes("resolveWorkspaceFromRequest") && !js.includes("DEFAULT_WORKSPACE") && !js.includes("runWorkspaceHealthChecks")) continue;
  console.log(`\n########## ${u} (size ${js.length}) ##########`);
  let i = js.indexOf("preview_domain");
  let g = 0;
  while (i >= 0 && g++ < 6) {
    console.log(`\n--- preview_domain @${i} ---`);
    console.log(js.slice(i - 200, i + 200).replace(/\n/g, " "));
    i = js.indexOf("preview_domain", i + 1);
  }
  let j = js.indexOf("resolveWorkspaceFromRequest");
  g = 0;
  while (j >= 0 && g++ < 6) {
    console.log(`\n--- resolveWorkspaceFromRequest @${j} ---`);
    console.log(js.slice(j - 200, j + 260).replace(/\n/g, " "));
    j = js.indexOf("resolveWorkspaceFromRequest", j + 1);
  }
}
console.log("\nDONE");
