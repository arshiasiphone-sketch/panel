import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => { const m = env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, "m")); return m ? m[1] : undefined; };
const sb = createClient(get("VITE_SUPABASE_URL"), get("VITE_SUPABASE_PUBLISHABLE_KEY"), { auth: { persistSession: false } });
const KAHNE = "0f37f4a1-a57a-457d-af98-2836c04f756b";
const DEFAULT = "00000000-0000-0000-0000-000000000001";

const { data: k } = await sb.from("menu_items").select("title,visible,sort_order").eq("workspace_id", KAHNE).order("sort_order");
const { data: d } = await sb.from("menu_items").select("title,visible,sort_order").eq("workspace_id", DEFAULT).order("sort_order").limit(12);
console.log("KHANE menu items (" + (k?.length ?? 0) + "):");
for (const r of k ?? []) console.log(`  [${r.visible ? "v" : "x"}] ${r.title}`);
console.log("\nDEFAULT menu items (first 12 of set):");
for (const r of d ?? []) console.log(`  [${r.visible ? "v" : "x"}] ${r.title}`);
const kTitles = new Set((k ?? []).map((r) => r.title));
const dTitles = new Set((d ?? []).map((r) => r.title));
console.log("\nKhane titles NOT in default's first 12:", [...kTitles].filter((t) => !dTitles.has(t)));
