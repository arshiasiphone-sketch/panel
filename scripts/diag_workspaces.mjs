import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

console.log("=== workspaces columns (information_schema) ===");
const { data: cols, error: ce } = await supabase
  .from("information_schema.columns")
  .select("column_name, data_type")
  .eq("table_schema", "public")
  .eq("table_name", "workspaces");
if (ce) console.log("cols error:", ce.message);
else console.log(JSON.stringify(cols, null, 2));

console.log("\n=== workspace with domain = yek.nama.app ===");
const { data: yek, error: ye } = await supabase
  .from("workspaces")
  .select("*")
  .eq("domain", "yek.nama.app")
  .maybeSingle();
if (ye) console.log("yek query error:", ye.message);
else if (!yek) console.log("NOT FOUND (domain='yek.nama.app' returns null)");
else console.log(JSON.stringify(yek, null, 2));

console.log("\n=== all workspaces (id, domain, owner_user_id, status, is_default) ===");
const { data: all, error: ae } = await supabase
  .from("workspaces")
  .select("id, domain, owner_user_id, status, is_default")
  .order("created_at", { ascending: true });
if (ae) console.log("all query error:", ae.message);
else {
  for (const w of all) {
    console.log(
      JSON.stringify({
        id: (w.id ?? "").slice(0, 8),
        domain: w.domain ?? "NULL",
        owner: (w.owner_user_id ?? "(null)").slice(0, 8),
        status: w.status,
        is_default: w.is_default,
      }),
    );
  }
}
