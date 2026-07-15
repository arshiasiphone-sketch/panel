import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};

const url = get("VITE_SUPABASE_URL");
const anon = get("VITE_SUPABASE_PUBLISHABLE_KEY");

// Simulate the PUBLIC site: anon key, no user session.
const sb = createClient(url, anon, { auth: { persistSession: false } });

const KAHNE = "0f37f4a1-a57a-457d-af98-2836c04f756b";
const DEFAULT = "00000000-0000-0000-0000-000000000001";

for (const [label, ws] of [["KHANE", KAHNE], ["DEFAULT", DEFAULT]]) {
  console.log(`\n=== anon read as ${label} (workspace_id=${ws}) ===`);
  for (const tbl of ["menu_items", "testimonials", "gallery_images", "personality_profiles", "theme_settings"]) {
    const { data, error } = await sb
      .from(tbl)
      .select("id")
      .eq("workspace_id", ws)
      .limit(50);
    if (error) console.log(`  ${tbl}: ERROR ${error.code} ${error.message}`);
    else console.log(`  ${tbl}: ${data?.length ?? 0} rows readable by anon`);
  }
}

// Also: what does an UNFILTERED anon read return (i.e. if withWorkspace is a no-op)?
console.log("\n=== anon read UNFILTERED (no workspace_id eq) ===");
for (const tbl of ["menu_items", "testimonials", "gallery_images", "personality_profiles", "theme_settings"]) {
  const { data, error } = await sb.from(tbl).select("id").limit(50);
  if (error) console.log(`  ${tbl}: ERROR ${error.code} ${error.message}`);
  else console.log(`  ${tbl}: ${data?.length ?? 0} rows readable by anon`);
}
