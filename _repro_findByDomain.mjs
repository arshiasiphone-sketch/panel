// Mirror exactly what the BROWSER runs for ?preview_domain=khane.nama.app.
// The browser client is created with the publishable (anon) key. For SELECT,
// RLS USING(true) makes anon == authenticated, so this reproduces the browser path.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const SUPABASE_URL = get("VITE_SUPABASE_URL");
const KEY = get("VITE_SUPABASE_PUBLISHABLE_KEY");

const supabase = createClient(SUPABASE_URL, KEY);

async function findByDomain(domain) {
  console.log(`\n== findByDomain("${domain}") ==`);
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("domain", domain)
    .maybeSingle();
  if (error) {
    console.log("ERROR:", error.code, error.message, error.details);
    return null;
  }
  if (!data) {
    console.log("NO ROW (data is null) — findByDomain returns null");
    return null;
  }
  console.log("ROW FOUND id=", data.id, "domain=", data.domain, "status=", data.status, "owner_user_id=", data.owner_user_id);
  return data;
}

const r1 = await findByDomain("khane.nama.app");
const r2 = await findByDomain("nama.app");

// Also list all domains to see what's actually stored
console.log("\n== all workspace domains ==");
const { data: all, error: e2 } = await supabase.from("workspaces").select("id,domain,owner_user_id,status").order("domain");
if (e2) console.log("ERROR listing:", e2.message);
else console.log(all);
