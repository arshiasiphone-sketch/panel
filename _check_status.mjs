import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key, { auth: { persistSession: false } });

const slugs = [
  "khane",
  "e2e-provision-01",
  "e2e-provision-02",
  "test-cafe-001",
  "cafeteria-mrfsnhoe",
  "yek",
  "test2",
];

for (const s of slugs) {
  const { data, error } = await sb
    .from("workspaces")
    .select("domain, status, id")
    .eq("domain", `${s}.nama.app`)
    .maybeSingle();
  if (error) {
    console.log(`${s}: ERROR ${error.message}`);
  } else if (!data) {
    console.log(`${s}: NOT FOUND`);
  } else {
    console.log(`${s}: status=${data.status} id=${data.id}`);
  }
}
