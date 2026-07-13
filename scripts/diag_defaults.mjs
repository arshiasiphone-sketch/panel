import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

// All workspaces that look like "default" buckets: no domain.
const { data, error } = await supabase
  .from("workspaces")
  .select("id, domain, owner_user_id, status, created_at")
  .is("domain", null)
  .order("created_at", { ascending: true });

if (error) { console.error("ERR:", error.message); process.exit(1); }

console.log("=== DEFAULT-BUCKET WORKSPACES (domain IS NULL) — count:", data.length, "===");
const byOwner = {};
for (const w of data) {
  const owner = w.owner_user_id ?? "(null)";
  byOwner[owner] = (byOwner[owner] ?? 0) + 1;
  console.log(JSON.stringify({
    id: w.id.slice(0, 8),
    owner: owner.slice(0, 8),
    status: w.status,
    created: w.created_at,
  }));
}
console.log("\n=== COUNT PER OWNER ===");
for (const [o, c] of Object.entries(byOwner)) console.log(`  ${o}: ${c}`);

// Also: total workspaces and how many have a domain
const { count } = await supabase.from("workspaces").select("*", { count: "exact", head: true });
const { count: domCount } = await supabase.from("workspaces").select("*", { count: "exact", head: true }).not("domain", "is", null);
console.log(`\nTotal workspaces: ${count} | with domain: ${domCount} | without domain: ${data.length}`);
