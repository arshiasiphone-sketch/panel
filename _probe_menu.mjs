import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => { const m = env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, "m")); return m ? m[1] : undefined; };
const sb = createClient(get("VITE_SUPABASE_URL"), get("VITE_SUPABASE_PUBLISHABLE_KEY"), { auth: { persistSession: false } });
const KAHNE = "0f37f4a1-a57a-457d-af98-2836c04f756b";

const a = await sb.from("menu_items").select("id", { count: "exact", head: true }).eq("workspace_id", KAHNE);
console.log("A count(eq khane):", a.count, "err:", a.error && a.error.message);

const b = await sb.from("menu_items").select("id").eq("workspace_id", KAHNE);
console.log("B select(id) eq khane rows:", b.data?.length, "err:", b.error && b.error.message);

const c = await sb.from("menu_items").select("title,visible").eq("workspace_id", KAHNE);
console.log("C select(title) eq khane rows:", c.data?.length, "err:", c.error && c.error.message, c.data?.slice(0,3));

const d = await sb.from("menu_items").select("title,visible").limit(5);
console.log("D unfiltered select(title) rows:", d.data?.length, "first ws:", d.data?.[0]?.workspace_id);

const e = await sb.from("menu_items").select("title,visible").eq("workspace_id", KAHNE).limit(5);
console.log("E select(title) eq khane limit rows:", e.data?.length, "err:", e.error && e.error.message);
