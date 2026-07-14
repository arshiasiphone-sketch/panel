import { readFileSync } from "node:fs";
const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const BASE = get("VITE_SUPABASE_URL");
const S = get("SUPABASE_SERVICE_ROLE_KEY");
const url =
  BASE +
  "/rest/v1/workspaces?select=id,domain,status,plan,owner_user_id,limits,metadata&domain=eq.khane.nama.app";
const res = await fetch(url, {
  headers: { apikey: S, Authorization: `Bearer ${S}` },
});
const data = await res.json();
console.log("HTTP", res.status);
console.log(JSON.stringify(data, null, 2));
