import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

// Try to read the live index definition from pg_indexes (may be blocked by RLS/permissions)
const { data, error } = await supabase
  .from("pg_indexes")
  .select("schemaname, tablename, indexname, indexdef")
  .eq("indexname", "uniq_default_workspace_per_owner");

if (error) {
  console.log("pg_indexes query error (likely not exposed):", error.message);
} else {
  console.log("INDEX DEF:", JSON.stringify(data, null, 2));
}

// Also list every workspace with domain null OR empty, plus owner, to confirm "default" shape
const { data: d2, error: e2 } = await supabase
  .from("workspaces")
  .select("id, domain, owner_user_id, status, name")
  .or("domain.is.null,domain.eq.");

if (e2) { console.log("2nd query error:", e2.message); }
else {
  console.log("\n=== domain IS NULL or '' (default-shaped) ===");
  for (const w of d2) {
    console.log(JSON.stringify({ id: w.id.slice(0,8), name: w.name, owner: (w.owner_user_id??"(null)").slice(0,8), status: w.status, domain: w.domain ?? "NULL" }));
  }
}
