import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const sb = createClient(get("VITE_SUPABASE_URL"), get("VITE_SUPABASE_PUBLISHABLE_KEY"), {
  auth: { persistSession: false },
});
const DEFAULT = "00000000-0000-0000-0000-000000000001";

const { data: workspaces, error } = await sb
  .from("workspaces")
  .select("id, domain, owner_user_id, metadata")
  .order("created_at");
if (error) {
  console.log("workspaces error:", error.message);
  process.exit(1);
}

const tables = ["menu_items", "gallery_images", "events", "testimonials", "personality_profiles"];
async function count(table, ws) {
  const { count, error } = await sb
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", ws);
  if (error) return `err`;
  return count ?? 0;
}

console.log(`WORKSPACES (${workspaces.length}):\n`);
for (const w of workspaces) {
  const name = (w.metadata && w.metadata.name) || "(unnamed)";
  const tag = w.id === DEFAULT ? " [DEFAULT_WORKSPACE_ID / globals]" : "";
  console.log(`slug=${w.domain ?? "(none)"}  id=${w.id}  name="${name}"  owner=${w.owner_user_id ?? "null"}${tag}`);
  const parts = [];
  for (const t of tables) parts.push(`${t}=${await count(t, w.id)}`);
  console.log("   " + parts.join("  "));
}

// Also: total rows across all workspaces (pre-fix union) per table.
console.log(`\nTOTAL (unfiltered union) per table:`);
for (const t of tables) console.log(`   ${t}=${await count(t, undefined)}`);
