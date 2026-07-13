import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key, { auth: { persistSession: false } });

const DEFAULT = "00000000-0000-0000-0000-000000000001";
const tables = ["page_blocks", "menu_items", "gallery_images", "events"];

for (const t of tables) {
  // Confirm workspace_id column exists and tally counts per workspace.
  const { data, error } = await sb.from(t).select("workspace_id");
  if (error) {
    console.log(`${t}: ERROR ${error.message}`);
    continue;
  }
  const counts = {};
  for (const r of data) {
    const w = r.workspace_id ?? "(null)";
    counts[w] = (counts[w] ?? 0) + 1;
  }
  console.log(`\n=== ${t} (total ${data.length}) ===`);
  for (const [w, c] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    const label = w === DEFAULT ? "DEFAULT" : w.slice(0, 8);
    console.log(`  ${label}: ${c}`);
  }
}
