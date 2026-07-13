import { createClient } from "@supabase/supabase-js";

// 1) Service-role view of RLS policies on workspaces (bypasses RLS).
const svc = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
try {
  const { data, error } = await svc.from("pg_policies").select("*").eq("tablename", "workspaces");
  if (error) console.log("POLICIES READ ERROR:", error.code, error.message);
  else console.log("POLICIES ON workspaces:", JSON.stringify(data, null, 2));
} catch (e) {
  console.log("POLICIES EXCEPTION:", e.message);
}

// 2) Anon client: can it SELECT the existing default row? (mirrors what the
//    browser's getOrCreateDefault -> findByUserId actually does)
const pub = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!pub) {
  console.log("\nSUPABASE_PUBLISHABLE_KEY not set in env — skipping anon SELECT test");
  process.exit(0);
}
const anon = createClient(process.env.SUPABASE_URL, pub, { auth: { persistSession: false } });
const owner = "ae57417e-030c-49d3-9a18-a32619904fb3";
const { data, error } = await anon
  .from("workspaces")
  .select("id, owner_user_id, domain, status")
  .eq("owner_user_id", owner);
if (error) console.log("\nANON SELECT ERROR:", error.code, error.message);
else console.log("\nANON SELECT rows for owner", owner, "=>", data.length, JSON.stringify(data));

// 3) Anon: what about the public DEFAULT_WORKSPACE row (id 0000...1)?
const { data: d2, error: e2 } = await anon
  .from("workspaces")
  .select("id, owner_user_id, domain")
  .eq("id", "00000000-0000-0000-0000-000000000001");
if (e2) console.log("ANON DEFAULT SELECT ERROR:", e2.code, e2.message);
else console.log("ANON DEFAULT_WORKSPACE rows =>", d2.length, JSON.stringify(d2));
