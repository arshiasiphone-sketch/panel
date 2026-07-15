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

// 1. List all RLS policies actually live on the workspaces table
console.log("=== live pg_policies for 'workspaces' ===");
const { data: policies, error: pe } = await supabase
  .from("pg_policies")
  .select("policyname, cmd, roles, qual, with_check")
  .eq("tablename", "workspaces");
if (pe) console.log("ERROR", pe.code, pe.message);
else console.log(JSON.stringify(policies, null, 2));

// 2. Confirm the anon client sees khane (baseline)
console.log("\n=== anon findByDomain('khane.nama.app') ===");
const { data: khane, error: ke } = await supabase
  .from("workspaces")
  .select("id,domain,status")
  .eq("domain", "khane.nama.app")
  .maybeSingle();
console.log("error:", ke ? `${ke.code} ${ke.message}` : "none");
console.log("data:", khane);
