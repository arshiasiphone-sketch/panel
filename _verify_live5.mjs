// Check the inlined VITE_SUPABASE_URL in the deployed bundle. A wrong/missing
// URL would make the browser client query a different (or no) project -> findByDomain
// throws -> swallowed -> permanent default workspace.
const ROOT = "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();
const urls = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) urls.add(new URL(m[1], ROOT).href);

const refs = new Set();
for (const u of urls) {
  const js = await (await fetch(u)).text();
  for (const x of js.matchAll(/([a-z0-9]{20,})\.supabase\.(?:co|in)/g)) refs.add(x[1] + ".supabase." + x[2]);
  for (const x of js.matchAll(/https:\/\/([a-z0-9]+\.supabase\.(?:co|in))/g)) refs.add(x[1]);
}
console.log("Supabase project refs found in deployed bundle:");
console.log([...refs]);

for (const u of urls) {
  const js = await (await fetch(u)).text();
  const i = js.indexOf("createClient");
  if (i >= 0) {
    console.log(`\n=== createClient in ${u} ===`);
    console.log(js.slice(i - 30, i + 280).replace(/\n/g, " "));
  }
}
console.log("\nLocal .env ref: xrlhnqvzlrizdphkmzfo.supabase.co");
