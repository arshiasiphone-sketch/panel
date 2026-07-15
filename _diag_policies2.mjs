import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const SUPABASE_URL = get("VITE_SUPABASE_URL");
const SERVICE = get("SUPABASE_SERVICE_ROLE_KEY");

if (!SERVICE) {
  console.log("NO SERVICE ROLE KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });

console.log("=== live pg_policies for 'workspaces' (service role) ===");
const { data, error } = await supabase
  .from("pg_policies")
  .select("schemaname, tablename, policyname, cmd, roles, qual, with_check")
  .eq("tablename", "workspaces");
if (error) console.log("ERROR", error.code, error.message, error.details);
else console.log(JSON.stringify(data, null, 2));
