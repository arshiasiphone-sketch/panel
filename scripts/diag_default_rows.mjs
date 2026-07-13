import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

// Read-only: dump every domain-null ("default bucket") workspace row with
// full columns, so we can see whether the existing row would pass
// workspaceEntitySchema (the schema that _mapRowToEntity filters by).
const { data, error } = await supabase
  .from("workspaces")
  .select("id, domain, owner_user_id, status, plan, limits, metadata, created_at, updated_at")
  .is("domain", null);

if (error) {
  console.log("SELECT ERROR:", error.code, "-", error.message);
  process.exit(1);
}

console.log("domain-null rows:", data.length);
for (const r of data) {
  const limitsKeys = r.limits ? Object.keys(r.limits) : null;
  const metaName = r.metadata?.name ?? "<MISSING>";
  const limOk = Array.isArray(limitsKeys)
    ? ["maxPages","maxMedia","maxStorage","maxTemplates","maxAdmins","maxAnalyticsRetention","maxVisitors"].every(k => k in r.limits)
    : false;
  console.log("----");
  console.log("id:", r.id);
  console.log("owner_user_id:", r.owner_user_id);
  console.log("status:", r.status, "plan:", r.plan);
  console.log("created_at:", r.created_at, "| updated_at:", r.updated_at);
  console.log("limits_keys:", JSON.stringify(limitsKeys), "limits_complete:", limOk);
  console.log("metadata.name:", JSON.stringify(metaName));
  console.log("metadata.createdAt:", r.metadata?.createdAt, "| metadata.updatedAt:", r.metadata?.updatedAt);
}
