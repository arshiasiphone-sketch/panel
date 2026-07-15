import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const url = get("SUPABASE_URL");
const service = get("SUPABASE_SERVICE_ROLE_KEY");
const sb = createClient(url, service, { auth: { persistSession: false } });

console.log("=== WORKSPACES ===");
const { data: workspaces, error: werr } = await sb
  .from("workspaces")
  .select("id, domain, status, plan, owner_user_id, metadata, created_at, updated_at")
  .order("created_at", { ascending: true });
if (werr) console.log("ERR workspaces:", werr.message);
else {
  for (const w of workspaces ?? []) {
    console.log(
      `  ${w.domain}  id=${w.id}  status=${w.status}  owner=${w.owner_user_id ?? "(none)"}` +
        `  name=${(w.metadata && w.metadata.name) || "(none)"}`,
    );
  }
  console.log(`  (total ${workspaces?.length ?? 0} workspaces)`);
}

console.log("\n=== PROVISION_TRANSACTIONS ===");
const { data: txns, error: terr } = await sb
  .from("provision_transactions")
  .select("workspace_id, blueprint_slug, status, created_at")
  .order("created_at", { ascending: true });
if (terr) console.log("ERR provision_transactions:", terr.message);
else {
  for (const t of txns ?? []) {
    console.log(`  ws=${t.workspace_id}  blueprint=${t.blueprint_slug}  status=${t.status}`);
  }
  console.log(`  (total ${txns?.length ?? 0} transactions)`);
}

console.log("\n=== CONTENT TABLES: column check + counts ===");
const contentTables = [
  "menu_items",
  "events",
  "gallery_images",
  "testimonials",
  "page_blocks",
  "personality_profiles",
  "site_content",
  "theme_settings",
  "media_files",
];
for (const tbl of contentTables) {
  // Try selecting a hypothetical workspace_id column — if it errors, the column doesn't exist.
  const { data, error } = await sb.from(tbl).select("*").limit(1);
  if (error) {
    console.log(`  ${tbl}: QUERY ERROR -> ${error.message}`);
    continue;
  }
  const sample = data?.[0];
  const hasWs = sample && "workspace_id" in sample;
  let count = data?.length ?? 0;
  // Get a real count
  const { count: c, error: cerr } = await sb.from(tbl).select("*", { count: "exact", head: true });
  if (!cerr) count = c ?? 0;
  console.log(
    `  ${tbl}: rows=${count}  has_workspace_id_col=${hasWs}` +
      (hasWs ? `  ws_values=${(await sb.from(tbl).select("workspace_id")).data?.map((r) => r.workspace_id).join(",")}` : ""),
  );
}

console.log("\n=== SITE_CONTENT keys (namespace inspection) ===");
const { data: sc, error: scerr } = await sb.from("site_content").select("key").order("key");
if (scerr) console.log("ERR site_content:", scerr.message);
else {
  const byPrefix = {};
  for (const r of sc ?? []) {
    const prefix = r.key.includes(":") ? r.key.split(":")[0] : "(plain)";
    byPrefix[prefix] = (byPrefix[prefix] ?? 0) + 1;
  }
  console.log("  prefix counts:", JSON.stringify(byPrefix, null, 2));
  const wsKeys = (sc ?? []).filter((r) => /:[0-9a-f-]{36}/.test(r.key));
  console.log(`  workspace-namespaced keys (contain a UUID): ${wsKeys.length}`);
  for (const r of wsKeys) console.log(`    ${r.key}`);
}
