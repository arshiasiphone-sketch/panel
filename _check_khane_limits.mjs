// Inspect khane's FULL row, especially `limits`, to see if it satisfies the
// workspaceEntitySchema (which requires all 7 limit fields as numbers).
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const SUPABASE_URL = get("VITE_SUPABASE_URL");
const KEY = get("VITE_SUPABASE_PUBLISHABLE_KEY");
const supabase = createClient(SUPABASE_URL, KEY);

const { data, error } = await supabase
  .from("workspaces")
  .select("*")
  .eq("domain", "khane.nama.app")
  .maybeSingle();

if (error) { console.log("ERROR", error.message); process.exit(1); }
console.log("RAW ROW:");
console.log(JSON.stringify(data, null, 2));

// Replicate _mapRowToEntity
const owner_user_id = data.owner_user_id;
const membership = owner_user_id
  ? [{ userId: owner_user_id, role: "owner", joinedAt: data.created_at }]
  : [];
const mapped = {
  id: data.id,
  status: data.status,
  plan: data.plan,
  limits: data.limits ?? {},
  membership,
  metadata: { ...(data.metadata ?? {}), domain: data.domain ?? undefined, createdAt: data.created_at, updatedAt: data.updated_at },
};
console.log("\nMAPPED ENTITY:");
console.log(JSON.stringify(mapped, null, 2));

const requiredLimits = ["maxPages","maxMedia","maxStorage","maxTemplates","maxAdmins","maxAnalyticsRetention","maxVisitors"];
console.log("\nLIMITS CHECK:");
for (const f of requiredLimits) {
  const v = mapped.limits?.[f];
  console.log(`  ${f}:`, v, typeof v === "number" ? "OK" : "MISSING/WRONG-TYPE");
}
