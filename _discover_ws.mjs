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

const { data, error } = await sb.from("workspaces").select("*").limit(5);
console.log("error:", error && error.message);
if (data && data[0]) {
  console.log("columns:", Object.keys(data[0]));
  for (const w of data) console.log(JSON.stringify(w));
} else {
  console.log("no rows / data:", data);
}
