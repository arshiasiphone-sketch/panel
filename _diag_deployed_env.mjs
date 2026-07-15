import { readFileSync } from "node:fs";

// What project does the LIVE deployed app actually query?
const ROOT = "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();
const urls = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) urls.add(new URL(m[1], ROOT).href);
const all = new Set(urls);
for (const u of [...all]) {
  const js = await (await fetch(u)).text();
  for (const m of js.matchAll(/["'](\/assets\/[^"']+\.js)["']/g)) all.add(new URL(m[1], ROOT).href);
}

let found = [];
for (const u of all) {
  const js = await (await fetch(u)).text();
  for (const m of js.matchAll(/https:\/\/([a-z0-9-]+\.supabase\.co)/g)) {
    found.push(m[1]);
  }
}
console.log("Supabase project refs found in live bundle:", [...new Set(found)]);

// Compare to .env
const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const m = env.match(/VITE_SUPABASE_URL="?([^"\n]+)"?/m);
console.log(".env VITE_SUPABASE_URL:", m ? m[1] : "(missing)");
