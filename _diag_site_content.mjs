import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const url = get("VITE_SUPABASE_URL");
const anon = get("VITE_SUPABASE_PUBLISHABLE_KEY");
const sb = createClient(url, anon, { auth: { persistSession: false } });

const KAHNE = "0f37f4a1-a57a-457d-af98-2836c04f756b";
const DEFAULT = "00000000-0000-0000-0000-000000000001";

const { data, error } = await sb.from("site_content").select("key,workspace_id").order("key");
if (error) { console.log("ERROR", error); process.exit(1); }

const plain = data.filter((r) => !r.key.includes(":"));
const khaneKeys = data.filter((r) => r.workspace_id === KAHNE).map((r) => r.key);
const defaultKeys = data.filter((r) => r.workspace_id === DEFAULT).map((r) => r.key);

console.log(`TOTAL site_content rows: ${data.length}`);
console.log(`\nPLAIN keys (no namespace, the global ones): ${plain.length}`);
for (const r of plain) console.log(`  "${r.key}"  ws=${r.workspace_id}`);

console.log(`\nKHANE owns ${khaneKeys.length} keys:`);
for (const k of khaneKeys) console.log(`  ${k}`);

console.log(`\nDEFAULT owns ${defaultKeys.length} keys:`);
for (const k of defaultKeys) console.log(`  ${k}`);

console.log(`\nPlain keys NOT owned by khane: ${
  plain.filter((r) => r.workspace_id !== KAHNE).map((r) => `"${r.key}"`).join(", ") || "none"
}`);
