import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key, { auth: { persistSession: false } });

// A freshly re-provisioned workspace (khane) with correct canonical content.
const WS = "0f37f4a1-a57a-457d-af98-2836c04f756b";

for (const t of ["page_blocks", "menu_items", "gallery_images"]) {
  const { data, error } = await sb
    .from(t)
    .select("*")
    .eq("workspace_id", WS)
    .order("sort_order", { ascending: true });
  if (error) {
    console.log(`${t}: ERROR ${error.message}`);
    continue;
  }
  console.log(`\n=== ${t} (${data.length} rows) ===`);
  for (const r of data) {
    console.log(JSON.stringify(r));
  }
}
