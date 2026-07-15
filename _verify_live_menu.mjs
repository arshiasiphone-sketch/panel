import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const root = get("VITE_SUPABASE_URL");
const anon = get("VITE_SUPABASE_PUBLISHABLE_KEY");
const { createClient } = await import("@supabase/supabase-js");
const sb = createClient(root, anon, { auth: { persistSession: false } });

const KAHNE = "0f37f4a1-a57a-457d-af98-2836c04f756b";
const DEFAULT = "00000000-0000-0000-0000-000000000001";

// What the BROKEN path fetches (unfiltered, workspaceId undefined at mount):
async function unfiltered() {
  const { data } = await sb.from("menu_items").select("name,workspace_id").order("sort_order");
  return data ?? [];
}
// What khane SHOULD fetch (filtered):
async function khaneScoped() {
  const { data } = await sb.from("menu_items").select("name,workspace_id").eq("workspace_id", KAHNE).order("sort_order");
  return data ?? [];
}

const all = await unfiltered();
const khane = await khaneScoped();

console.log(`UNFILTERED (what the buggy mount fetches): ${all.length} items`);
const wsOfAll = {};
for (const r of all) wsOfAll[r.workspace_id] = (wsOfAll[r.workspace_id] ?? 0) + 1;
console.log("  workspace_id distribution:", JSON.stringify(wsOfAll));
console.log(`KHANE-SCOPED (what it SHOULD show): ${khane.length} items`);
console.log("  khane menu names:", khane.map((r) => r.name).join(", "));

console.log("\nDiagnosis:");
console.log("  - If the public site fetches once at mount with no workspaceId, it shows ALL",
  all.length, "items (default + every workspace), which looks identical to 'default'.");
console.log("  - Correct per-workspace view would show only khane's", khane.length, "items.");

// Also check: do khane and default actually have DIFFERENT menu content, or identical?
const { data: defMenu } = await sb.from("menu_items").select("name").eq("workspace_id", DEFAULT).order("sort_order");
console.log("\nDEFAULT menu names:", (defMenu ?? []).map((r) => r.name).join(", "));
console.log("KHANE   menu names:", khane.map((r) => r.name).join(", "));
console.log("Menus identical in content?",
  JSON.stringify((defMenu ?? []).map((r) => r.name)) === JSON.stringify(khane.map((r) => r.name)));
