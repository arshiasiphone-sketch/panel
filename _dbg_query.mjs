import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);
try {
  const tables = [
    "site_content",
    "page_blocks",
    "menu_items",
    "gallery_images",
    "personality_profiles",
    "events",
    "testimonials",
    "theme_presets",
  ];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select("workspace_id");
    if (error) {
      console.log(t, "ERR", error.message);
      continue;
    }
    const counts = {};
    for (const r of data) {
      const k = r.workspace_id || "NULL";
      counts[k] = (counts[k] || 0) + 1;
    }
    console.log(t, JSON.stringify(counts));
  }
  const { data: ws } = await supabase
    .from("workspaces")
    .select("id,domain,status")
    .order("created_at");
  console.log("WORKSPACES", JSON.stringify(ws));
} catch (e) {
  console.error("FATAL", e);
}
