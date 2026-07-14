// Locate the dynamically-imported repository/factory chunk and inspect its
// findByDomain query (table + column) to confirm it hits public.workspaces.domain.
const ROOT = "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();

const urls = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) {
  urls.add(new URL(m[1], ROOT).href);
}

async function scan(u) {
  const js = await (await fetch(u)).text();
  const hits = [];
  for (const needle of ['from("workspaces")', 'from("site_content")', 'eq("domain"', "findByDomain", "repositories/factory", "factory"]) {
    const i = js.indexOf(needle);
    if (i >= 0) hits.push([needle, i]);
  }
  if (hits.length) {
    console.log(`\n### ${u} (size ${js.length})`);
    for (const [n, i] of hits) {
      console.log(`  [${n}] @${i}:`, js.slice(i - 50, i + 130).replace(/\n/g, " "));
    }
  }
  return js;
}

for (const u of urls) await scan(u);

// Also: find dynamic import target chunk(s) referenced inside index + routes
for (const u of [...urls]) {
  const js = await (await fetch(u)).text();
  const dyn = [...js.matchAll(/import\(["'`]([^"'`]+)["'`]\)/g)].map(x => x[1]);
  const preload = [...js.matchAll(/["'](\/assets\/[^"']+\.js)["']/g)].map(x => x[1]);
  const all = [...new Set([...dyn, ...preload])].filter(s => s.endsWith(".js"));
  if (all.length) {
    console.log(`\n--- dynamic/preload refs in ${u} ---`);
    for (const a of all) {
      const full = new URL(a, ROOT).href;
      if (!urls.has(full)) { urls.add(full); console.log("  NEW:", full); }
    }
  }
}
console.log("\nScanning newly discovered chunks...");
// second pass for discovered chunks
const discovered = [...urls].filter(u => u.includes("/assets/") && !html.includes(u.split("/").pop()));
for (const u of discovered) await scan(u);
console.log("\ndone");
