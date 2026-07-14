import { readFileSync } from "node:fs";
const e = readFileSync(new URL("./.env", import.meta.url), "utf8");
const g = (k) => { const m = e.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m")); return m ? m[1] : undefined; };
const BASE = g("VITE_SUPABASE_URL");
const A = g("VITE_SUPABASE_PUBLISHABLE_KEY");

const tests = [
  ["select=*", BASE + "/rest/v1/workspaces?select=*&domain=eq.khane.nama.app&limit=1"],
  ["select=id,domain,status,plan,owner_user_id,limits,metadata",
   BASE + "/rest/v1/workspaces?select=id,domain,status,plan,owner_user_id,limits,metadata&domain=eq.khane.nama.app&limit=1"],
];

for (const [label, url] of tests) {
  const r = await fetch(url, { headers: { apikey: A, Authorization: `Bearer ${A}` } });
  const b = await r.text();
  console.log(`\n### ${label} -> HTTP ${r.status}`);
  console.log(b.slice(0, 500));
}
