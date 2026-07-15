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

const { data, error } = await sb.from("menu_items").select("*").limit(1);
console.log("error:", error && error.message);
if (data && data[0]) {
  console.log("columns:", Object.keys(data[0]));
  console.log(JSON.stringify(data[0], null, 2));
} else {
  console.log("no rows");
}
