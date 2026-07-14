import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anon = process.env.SUPABASE_PUBLISHABLE_KEY;

const svc = createClient(url, service, { auth: { persistSession: false } });

// 1. Service role: what workspaces actually exist?
const { data: all, error: e1 } = await svc
  .from("workspaces")
  .select("id, domain, status, owner_user_id, created_at")
  .order("created_at");
if (e1) console.error("SVC ERR", e1.message);
console.log("SVC WORKSPACES TOTAL:", all?.length);
for (const w of all ?? []) {
  console.log(JSON.stringify({
    id: w.id?.slice(0, 8),
    domain: w.domain,
    status: w.status,
    owner: w.owner_user_id?.slice(0, 8),
    created: w.created_at,
  }));
}
const khaneSvc = (all ?? []).filter((w) => (w.domain || "").includes("khane"));
console.log("KHANE (svc match):", JSON.stringify(khaneSvc));

// 2. Anon key (what the browser/client uses) — does RLS allow reading workspaces?
const an = createClient(url, anon, { auth: { persistSession: false } });
const { data: anonData, error: e2, status, statusText } = await an
  .from("workspaces")
  .select("id, domain, status");
console.log("\nANON SELECT -> status:", status, statusText, "| error:", e2?.message, "| rows:", anonData?.length);
