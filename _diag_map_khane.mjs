import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const supabase = createClient(get("VITE_SUPABASE_URL"), get("VITE_SUPABASE_PUBLISHABLE_KEY"));

const { data: row, error } = await supabase
  .from("workspaces")
  .select("*")
  .eq("domain", "khane.nama.app")
  .maybeSingle();
if (error) { console.log("QUERY ERROR", error.message); process.exit(1); }
console.log("RAW ROW:");
console.log("  id:", row.id);
console.log("  status:", row.status, "plan:", row.plan);
console.log("  owner_user_id:", row.owner_user_id);
console.log("  limits:", JSON.stringify(row.limits));
console.log("  metadata:", JSON.stringify(row.metadata));
console.log("  created_at:", row.created_at, "updated_at:", row.updated_at);

// Replicate _mapRowToEntity
const entity = {
  id: row.id,
  status: row.status,
  plan: row.plan,
  limits: (row.limits ?? {}),
  membership: [
    ...(row.owner_user_id
      ? [{ userId: row.owner_user_id, role: "owner", joinedAt: row.created_at }]
      : []),
  ],
  metadata: {
    ...(row.metadata ?? {}),
    domain: row.domain ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  },
};
console.log("\nMAPPED ENTITY:");
console.log(JSON.stringify(entity, null, 2));

// Replicate workspaceEntitySchema.safeParse (imported from source)
const { workspaceEntitySchema } = await import("./src/lib/core/workspace/validation.ts").catch(async () => {
  // fallback: can't import TS directly in node; do manual checks
  return { workspaceEntitySchema: null };
});
if (!workspaceEntitySchema) {
  console.log("\n(could not import TS schema; doing manual field checks)");
  const limits = entity.limits;
  const limitFields = ["maxPages","maxMedia","maxStorage","maxTemplates","maxAdmins","maxAnalyticsRetention","maxVisitors"];
  console.log("limits has all 7 fields?", limitFields.every(f => typeof limits[f] === "number"));
  console.log("missing limit fields:", limitFields.filter(f => typeof limits[f] !== "number"));
  const md = entity.metadata;
  const mdFields = ["name","locale","timezone","createdAt","updatedAt"];
  console.log("metadata has required fields?", mdFields.every(f => md[f] != null));
  console.log("missing metadata fields:", mdFields.filter(f => md[f] == null));
} else {
  const result = workspaceEntitySchema.safeParse(entity);
  console.log("\nSCHEMA VALIDATION:", result.success ? "PASS" : "FAIL");
  if (!result.success) console.log(JSON.stringify(result.error.issues, null, 2));
}
