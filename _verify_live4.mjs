// Extract which Supabase project the DEPLOYED bundle actually talks to, and which
// anon key it uses. Compare against the local .env (xrlhnqvzlrizdphkmzfo).
const ROOT = "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();
const urls = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) urls.add(new URL(m[1], ROOT).href);

const needles = [".supabase.co", "sb_publishable_", "VITE_SUPABASE_URL", "supabase.co"];
const seen = new Map();
for (const u of urls) {
  const js = await (await fetch(u)).text();
  for (const n of needles) {
    let i = 0;
    while ((i = js.indexOf(n, i)) >= 0) {
      const slice = js.slice(i, i + 60);
      if (!seen.has(slice)) { seen.set(slice, u); }
      i += n.length;
    }
  }
}
console.log("=== supabase references in deployed bundle ===");
for (const [s, u] of seen) console.log(`${u}\n   ${s}\n`);
