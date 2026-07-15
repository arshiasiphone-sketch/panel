import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const SUPABASE_URL = get("VITE_SUPABASE_URL");
const SERVICE = get("SUPABASE_SERVICE_ROLE_KEY");

const admin = createClient(SUPABASE_URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });

// 1. Create a temporary SECURITY DEFINER probe that compares anon vs authenticated visibility.
const createFn = `
CREATE OR REPLACE FUNCTION public.__diag_rls_check()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  anon_count int;
  auth_count int;
  policies json;
BEGIN
  SET LOCAL ROLE anon;
  SELECT count(*) INTO anon_count FROM public.workspaces WHERE domain='khane.nama.app';
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO auth_count FROM public.workspaces WHERE domain='khane.nama.app';
  SELECT json_agg(row_to_json(p)) INTO policies
    FROM pg_policies p WHERE p.tablename = 'workspaces';
  RETURN json_build_object(
    'anon_sees_khane', anon_count,
    'authenticated_sees_khane', auth_count,
    'policies', policies
  );
END;
$$;
`;

const { error: ce } = await admin.rpc("exec", { query: createFn }).catch(async () => {
  // fallback: there may be no exec rpc; try a raw sql via REST isn't available.
  return { error: new Error("no-exec") };
});

if (ce && ce.message === "no-exec") {
  // Try creating the function through the PostgREST by using a direct SQL endpoint is not possible;
  // instead, attempt to call a non-existent rpc to surface schema, then bail.
  console.log("exec rpc unavailable — trying alternate probe");
} else if (ce) {
  console.log("CREATE FUNCTION error:", ce.code, ce.message, ce.details);
}

// Call the probe
const { data, error } = await admin.rpc("__diag_rls_check");
console.log("PROBE RESULT:", error ? `ERROR ${error.code} ${error.message}` : JSON.stringify(data, null, 2));

// Drop the probe
await admin.rpc("exec", { query: "DROP FUNCTION IF EXISTS public.__diag_rls_check();" }).catch(() => {});
