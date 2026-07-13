import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key, { auth: { persistSession: false } });

const DEFAULT = "00000000-0000-0000-0000-000000000001";

// Sample DEFAULT rows with distinguishing fields + created_at to spot replicas.
async function sample(table, fields) {
  const { data, error } = await sb
    .from(table)
    .select(["workspace_id", "created_at", ...fields].join(","))
    .eq("workspace_id", DEFAULT)
    .order("created_at", { ascending: true });
  if (error) {
    console.log(`${table}: ERROR ${error.message}`);
    return;
  }
  console.log(`\n=== ${table} DEFAULT rows: ${data.length} ===`);
  for (const r of data) {
    const f = fields.map((x) => `${x}=${JSON.stringify(r[x])}`).join(" ");
    console.log(`  [${r.created_at}] ${f}`);
  }
}

await sample("page_blocks", ["type"]);
await sample("menu_items", ["name", "category"]);
await sample("gallery_images", ["title"]);
await sample("events", ["title"]);
