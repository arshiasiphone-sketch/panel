import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

/**
 * Reset DEFAULT workspace content + re-seed the canonical cafeteria blueprint.
 *
 * Why clone instead of re-run the engine: the engine provisions a *new*
 * workspace; it cannot target DEFAULT. So we clone the engine's own output
 * (the exact row shape it writes) from a correctly-provisioned workspace and
 * remap workspace_id -> DEFAULT. This guarantees the re-seeded rows match
 * precisely what the app's workspace-scoped readers expect.
 *
 * DRY by default. Set FORCE=1 to actually write.
 */

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key, { auth: { persistSession: false } });

const DEFAULT = "00000000-0000-0000-0000-000000000001";
// A correctly-provisioned workspace whose content is the canonical blueprint.
const SRC = "0f37f4a1-a57a-457d-af98-2836c04f756b";

const DRY = process.env.FORCE !== "1";
if (DRY) console.log("[DRY_RUN] FORCE=1 not set — no writes will be performed.\n");
if (!url || !key) throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");

const now = () => new Date().toISOString();

// Workspace-scoped content tables bloated in DEFAULT:
const CONTENT = ["page_blocks", "menu_items", "gallery_images"];
// events table is NOT seeded by the blueprint (events live in the event-list
// block data) — DEFAULT's rows are legacy orphans, so we just delete them.
const LEGACY = ["events"];

const source = {};
for (const t of CONTENT) {
  const { data, error } = await sb
    .from(t)
    .select("*")
    .eq("workspace_id", SRC)
    .order("sort_order", { ascending: true });
  if (error) {
    console.log(`${t}: read ERROR ${error.message}`);
    process.exit(1);
  }
  source[t] = data;
  console.log(`${t}: canonical source has ${data.length} rows`);
}

function remap(rows) {
  return rows.map((r) => ({
    ...r,
    id: randomUUID(),
    workspace_id: DEFAULT,
    created_at: now(),
    updated_at: now(),
  }));
}

const inserts = {
  page_blocks: remap(source.page_blocks),
  menu_items: remap(source.menu_items),
  gallery_images: remap(source.gallery_images),
};

async function resetTable(table, rows) {
  if (DRY) {
    const { count } = await sb.from(table).select("*", { count: "exact", head: true }).eq("workspace_id", DEFAULT);
    console.log(`[DRY_RUN] ${table}: would DELETE ${count} DEFAULT rows, then INSERT ${rows.length}`);
    return;
  }
  const { error: delErr } = await sb.from(table).delete().eq("workspace_id", DEFAULT);
  if (delErr) {
    console.log(`${table}: DELETE ERROR ${delErr.message}`);
    return;
  }
  if (rows.length) {
    const { error: insErr } = await sb.from(table).insert(rows);
    if (insErr) {
      console.log(`${table}: INSERT ERROR ${insErr.message}`);
      return;
    }
  }
  console.log(`${table}: reset -> ${rows.length} canonical rows`);
}

for (const t of CONTENT) await resetTable(t, inserts[t]);
for (const t of LEGACY) await resetTable(t, []);

// Final confirmation
if (!DRY) {
  for (const t of [...CONTENT, ...LEGACY]) {
    const { count } = await sb.from(t).select("*", { count: "exact", head: true }).eq("workspace_id", DEFAULT);
    console.log(`${t}: DEFAULT now has ${count}`);
  }
}
console.log("\nDone.");
