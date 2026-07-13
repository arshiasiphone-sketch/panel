import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key, { auth: { persistSession: false } });

// The provision engine leaves workspaces at `provisioning` (Signature B defect);
// flip the re-provisioned ones to `active` so they are operational, and mark
// their provision_transactions `completed` to match.
const SLUGS = [
  "khane",
  "e2e-provision-01",
  "e2e-provision-02",
  "test-cafe-001",
  "cafeteria-mrfsnhoe",
];

for (const s of SLUGS) {
  const domain = `${s}.nama.app`;
  const { data: ws, error } = await sb
    .from("workspaces")
    .select("id, status")
    .eq("domain", domain)
    .maybeSingle();
  if (error) {
    console.log(`${s}: lookup ERROR ${error.message}`);
    continue;
  }
  if (!ws) {
    console.log(`${s}: NOT FOUND, skipping`);
    continue;
  }
  const { error: wsErr } = await sb
    .from("workspaces")
    .update({ status: "active" })
    .eq("id", ws.id);
  if (wsErr) {
    console.log(`${s}: workspace update ERROR ${wsErr.message}`);
    continue;
  }
  const { error: txErr } = await sb
    .from("provision_transactions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("workspace_id", ws.id);
  if (txErr) {
    console.log(`${s}: transaction update ERROR ${txErr.message}`);
    continue;
  }
  console.log(`${s}: ${ws.status} → active (id ${ws.id})`);
}

console.log("Flip complete.");
