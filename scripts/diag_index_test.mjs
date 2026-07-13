import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

// Dry-run: attempt to insert a DEFAULT (domain IS NULL) workspace for a
// brand-new, never-seen owner. We use the service role so RLS won't block.
// - If the index is PER-OWNER, this insert SUCCEEDS (each owner may have one).
// - If the index is GLOBAL, this 409s on uniq_default_workspace_per_owner
//   (because ae57417e... already owns the single allowed default).
const newOwner = "ffffffff-ffff-ffff-ffff-ffffffffffff";
const testId = "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee";

const { data, error } = await supabase
  .from("workspaces")
  .insert({
    id: testId,
    owner_user_id: newOwner,
    domain: null,
    status: "active",
    plan: "free",
    limits: {},
    metadata: { updatedAt: new Date().toISOString() },
  })
  .select("id");

if (error) {
  console.log("INSERT BLOCKED:", error.code, "-", error.message);
  console.log("=> index is GLOBAL (blocks cross-owner default inserts)");
} else {
  console.log("INSERT SUCCEEDED:", data);
  console.log("=> index is PER-OWNER (each owner may have one default)");
  // clean up the test row immediately
  await supabase.from("workspaces").delete().eq("id", testId);
  console.log("(test row deleted)");
}
