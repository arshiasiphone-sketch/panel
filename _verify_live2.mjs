// Find where the deployed app actually queries workspaces by domain.
// The repository is dynamically imported, so the .eq("domain"...) query may be
// in a separate chunk. Enumerate all JS assets from the HTML and grep them.
const ROOT = "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();

// collect all .js asset URLs referenced in HTML (scripts + modulepreloads + links)
const urls = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) {
  urls.add(new URL(m[1], ROOT).href);
}
console.log("asset URLs:", [...urls]);

for (const u of urls) {
  const js = await (await fetch(u)).text();
  const idx = js.indexOf('from("workspaces")');
  const idx2 = js.indexOf('eq("domain"');
  const idx3 = js.indexOf("workspace_resolver");
  if (idx >= 0 || idx2 >= 0 || idx3 >= 0) {
    console.log(`\n### ${u} (size ${js.length}) — has workspace query`);
    if (idx >= 0) console.log("  from(\"workspaces\") @", idx, "->", js.slice(idx - 40, idx + 140));
    if (idx2 >= 0) console.log("  eq(\"domain\" @", idx2, "->", js.slice(idx2 - 60, idx2 + 80));
    if (idx3 >= 0) console.log("  workspace_resolver @", idx3, "->", js.slice(idx3 - 30, idx3 + 120));
  }
}
console.log("\ndone");
