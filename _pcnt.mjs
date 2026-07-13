import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key, { auth: { persistSession: false } });

const DEFAULT = "00000000-0000-0000-0000-000000000001";
const KHANE = "0f37f4a1-a57a-457d-af98-2836c04f756b";

for (const [label, table, col] of [
  ["personality_profiles", "personality_profiles", "key"],
  ["site_content (DEFAULT keys)", "site_content", "key"],
  ["theme_settings", "theme_settings", "id"],
]) {
  const { data, error } = await sb.from(table).select(col);
  if (error) {
    console.log(`${label}: ERROR ${error.message}`);
    continue;
  }
  const def = data.filter((r) => (r.workspace_id ?? "").startsWith(DEFAULT.slice(0, 8)) || (r.value && JSON.stringify(r.value).includes(DEFAULT))).length;
  console.log(`${label}: total ${data.length}; sample workspace_ids present:`);
  const ws = {};
  for (const r of data) {
    const w = r.workspace_id ?? (r.value && r.value.workspaceId) ?? "(none)";
    ws[w] = (ws[w] ?? 0) + 1;
  }
  for (const [w, c] of Object.entries(ws)) {
    console.log(`    ${w === DEFAULT ? "DEFAULT" : String(w).slice(0, 8)}: ${c}`);
  }
}

// Confirm events table not seeded by blueprint (new workspace should be 0)
const { data: ke } = await sb.from("events").select("id").eq("workspace_id", KHANE);
console.log(`\nevents in khane (new workspace): ${ke.length} (expect 0)`);
const { data: de } = await sb.from("events").select("id").eq("workspace_id", DEFAULT);
console.log(`events in DEFAULT: ${de.length}`);
