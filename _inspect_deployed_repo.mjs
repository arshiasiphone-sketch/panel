// Fetch the LIVE deployed bundle and inspect the actual findByDomain + entity
// mapping code, to find why the deployed build degrades to DEFAULT for khane.
const ROOT = "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();
const urls = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) urls.add(new URL(m[1], ROOT).href);

// discover dynamic/preload chunks
const all = new Set(urls);
for (const u of [...all]) {
  const js = await (await fetch(u)).text();
  for (const m of js.matchAll(/["'](\/assets\/[^"']+\.js)["']/g)) all.add(new URL(m[1], ROOT).href);
}

console.log("Total chunks:", all.size);

for (const u of all) {
  const js = await (await fetch(u)).text();
  if (!js.includes("findByDomain")) continue;
  console.log(`\n########## ${u} (size ${js.length}) ##########`);
  let i = js.indexOf("findByDomain");
  // print a window around every findByDomain occurrence
  let guard = 0;
  while (i >= 0 && guard++ < 5) {
    console.log(`\n--- findByDomain @${i} ---`);
    console.log(js.slice(i - 120, i + 400).replace(/\n/g, " "));
    i = js.indexOf("findByDomain", i + 1);
  }
  // print from("workspaces") queries
  let j = js.indexOf('from("workspaces")');
  while (j >= 0) {
    console.log(`\n--- from("workspaces") @${j} ---`);
    console.log(js.slice(j - 200, j + 200).replace(/\n/g, " "));
    j = js.indexOf('from("workspaces")', j + 1);
  }
}
console.log("\nDONE");
