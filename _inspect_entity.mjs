// Inspect the LIVE deployed bundle's _mapRowToEntity and workspace entity schema,
// to see why khane's row (owner_user_id: null) might fail mapping and throw.
const ROOT = "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();
const urls = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) urls.add(new URL(m[1], ROOT).href);
// only the index chunk has findByDomain + _mapRowToEntity (same file per prior run)
const idx = [...urls].find((u) => u.includes("index-"));
const js = await (await fetch(idx)).text();

// _mapRowToEntity
let i = js.indexOf("_mapRowToEntity");
let guard = 0;
while (i >= 0 && guard++ < 6) {
  console.log(`\n=== _mapRowToEntity @${i} ===`);
  console.log(js.slice(i - 40, i + 700).replace(/\n/g, " "));
  i = js.indexOf("_mapRowToEntity", i + 1);
}

// entity schema: look for safeParse and membership / owner_user_id handling
let j = js.indexOf("safeParse");
guard = 0;
while (j >= 0 && guard++ < 8) {
  console.log(`\n=== safeParse @${j} ===`);
  console.log(js.slice(j - 300, j + 120).replace(/\n/g, " "));
  j = js.indexOf("safeParse", j + 1);
}

// owner_user_id usage
let k = js.indexOf("owner_user_id");
guard = 0;
while (k >= 0 && guard++ < 8) {
  console.log(`\n=== owner_user_id @${k} ===`);
  console.log(js.slice(k - 120, k + 160).replace(/\n/g, " "));
  k = js.indexOf("owner_user_id", k + 1);
}
console.log("\nDONE");
