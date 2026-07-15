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

async function menuFor(ws) {
  const { data, error } = await sb
    .from("menu_items")
    .select("name, category, price, sort_order")
    .eq("workspace_id", ws)
    .order("sort_order");
  if (error) {
    console.log("err", ws, error.message);
    return [];
  }
  return data ?? [];
}

const KAHNE = "0f37f4a1-a57a-457d-af98-2836c04f756b";
const DEFAULT = "00000000-0000-0000-0000-000000000001";
const YEK = "26dec2f3-63c5-4b17-a891-9891c518b17c";

const khane = await menuFor(KAHNE);
const def = await menuFor(DEFAULT);
const yek = await menuFor(YEK);

console.log("KHANE menu:\n" + khane.map((r) => `  [${r.sort_order}] ${r.category} / ${r.name} — ${r.price}`).join("\n"));
console.log("\nDEFAULT menu:\n" + def.map((r) => `  [${r.sort_order}] ${r.category} / ${r.name} — ${r.price}`).join("\n"));
console.log("\nYEK menu:\n" + yek.map((r) => `  [${r.sort_order}] ${r.category} / ${r.name} — ${r.price}`).join("\n"));

const sig = (arr) => arr.map((r) => `${r.category}|${r.name}|${r.price}`).join("||");
console.log("\nkhane === yek text? ", sig(khane) === sig(yek));
console.log("khane === default text? ", sig(khane) === sig(def));
console.log("default === yek text? ", sig(def) === sig(yek));
