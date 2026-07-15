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

const KAHNE = "0f37f4a1-a57a-457d-af98-2836c04f756b";
const DEFAULT = "00000000-0000-0000-0000-000000000001";
const SEL = "key,value,workspace_id";

// Replicates SiteContentRepository.getAll() under khane's scoped context.
async function siteContentFor(wsId) {
  const q = sb.from("site_content").select(SEL);
  if (wsId) q.eq("workspace_id", wsId);
  const { data, error } = await q;
  if (error) throw error;
  const out = {};
  for (const r of data ?? []) out[r.key] = r.workspace_id;
  if (wsId && wsId !== DEFAULT) {
    const { data: globals, error: ge } = await sb
      .from("site_content").select(SEL).eq("workspace_id", DEFAULT);
    if (ge) throw ge;
    for (const r of globals ?? []) if (!(r.key in out)) out[r.key] = r.workspace_id;
  }
  return out;
}

async function countScoped(table, wsId) {
  let q = sb.from(table).select("id", { count: "exact", head: true });
  if (wsId) q = q.eq("workspace_id", wsId);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

const khane = await siteContentFor(KAHNE);
const def = await siteContentFor(undefined); // default mount-time (unfiltered)

const globals = ["hero", "contact", "social", "meta", "test_questions"];
console.log("=== KAHNE site_content keys (namespaced + merged globals) ===");
console.log("total keys:", Object.keys(khane).length);
console.log("globals present for khane:");
for (const g of globals) {
  console.log(`  ${g}: ${khane[g] ? "YES (ws=" + khane[g] + ")" : "MISSING"}`);
}
console.log("khane namespaced keys:", Object.keys(khane).filter((k) => k.includes(":")).join(", "));

console.log("\n=== scoped content counts ===");
for (const t of ["menu_items", "gallery_images", "events", "testimonials", "personality_profiles"]) {
  const k = await countScoped(t, KAHNE);
  const d = await countScoped(t, undefined);
  console.log(`  ${t}: khane=${k}  unfiltered=${d}  ${k === d ? "<< SAME" : "isolated"}`);
}
