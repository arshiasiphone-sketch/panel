import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const SUPABASE_URL = get("VITE_SUPABASE_URL");
const KEY = get("VITE_SUPABASE_PUBLISHABLE_KEY");
const SERVICE = get("SUPABASE_SERVICE_ROLE_KEY");

const admin = createClient(SUPABASE_URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });
const anon = createClient(SUPABASE_URL, KEY);

const email = `diag-test-${Date.now()}@example.com`;
const password = "DiagPassw0rd!2026";

// 1. Create a throwaway user (service role)
const { data: created, error: ce } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
if (ce) {
  console.log("createUser error:", ce.message);
  process.exit(1);
}
const userId = created.user.id;
console.log("created test user:", userId);

try {
  // 2. Sign in as that user with the PUBLISHABLE (browser) key -> authenticated role
  const { error: se } = await anon.auth.signInWithPassword({ email, password });
  if (se) {
    console.log("signIn error:", se.message);
  } else {
    const { data: u } = await anon.auth.getUser();
    console.log("signed in as:", u?.user?.id, "role claim:", u?.user?.app_metadata?.role);
  }

  // 3. Run the EXACT findByDomain query as the authenticated user
  const { data, error } = await anon
    .from("workspaces")
    .select("id,domain,status")
    .eq("domain", "khane.nama.app")
    .maybeSingle();
  console.log("AUTHENTICATED findByDomain('khane.nama.app'):");
  console.log("  error:", error ? `${error.code} ${error.message}` : "none");
  console.log("  data:", data);
  console.log("  => authenticated can see khane?", !!data);

  // Also test a workspace we DO expect to be visible (localhost default)
  const { data: def, error: de } = await anon
    .from("workspaces")
    .select("id,domain,status")
    .eq("domain", "localhost")
    .maybeSingle();
  console.log("AUTHENTICATED findByDomain('localhost'):", de ? de.message : JSON.stringify(def));
} finally {
  // 4. Clean up the test user
  const { error: de } = await admin.auth.admin.deleteUser(userId);
  console.log("cleaned up test user:", de ? de.message : "ok");
}
