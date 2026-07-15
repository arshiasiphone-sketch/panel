import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const supabase = createClient(get("VITE_SUPABASE_URL"), get("VITE_SUPABASE_PUBLISHABLE_KEY"));

// Replicate validation.ts schema WITH the offset:true fix applied
const statusSchema = z.enum(["provisioning","active","trial","suspended","archived","deleted"]);
const planSchema = z.enum(["free","starter","pro","enterprise"]);
const roleSchema = z.enum(["owner","admin","member","viewer"]);
const limitsSchema = z.object({
  maxPages: z.number().int().min(0), maxMedia: z.number().int().min(0),
  maxStorage: z.number().int().min(0), maxTemplates: z.number().int().min(0),
  maxAdmins: z.number().int().min(0), maxAnalyticsRetention: z.number().int().min(0),
  maxVisitors: z.number().int().min(0),
});
const membershipSchema = z.object({
  userId: z.string().min(1).nullable(), role: roleSchema,
  joinedAt: z.string().datetime({ offset: true }),
});
const metadataSchema = z.object({
  name: z.string().min(1).max(200), description: z.string().max(2000).optional(),
  logo: z.string().url().optional(), domain: z.string().optional(),
  locale: z.string().min(2).max(10), timezone: z.string().min(1).max(50),
  createdAt: z.string().datetime({ offset: true }), updatedAt: z.string().datetime({ offset: true }),
});
const entitySchema = z.object({
  id: z.string().min(1), status: statusSchema, plan: planSchema,
  limits: limitsSchema, membership: z.array(membershipSchema), metadata: metadataSchema,
});

const { data: row, error } = await supabase.from("workspaces").select("*").eq("domain", "khane.nama.app").maybeSingle();
if (error) { console.log("QUERY ERROR", error.message); process.exit(1); }

const entity = {
  id: row.id, status: row.status, plan: row.plan,
  limits: (row.limits ?? {}),
  membership: [ ...(row.owner_user_id ? [{ userId: row.owner_user_id, role: "owner", joinedAt: row.created_at }] : []) ],
  metadata: { ...(row.metadata ?? {}), domain: row.domain ?? undefined, createdAt: row.created_at, updatedAt: row.updated_at },
};

const result = entitySchema.safeParse(entity);
console.log("khane schema validation (with offset:true):", result.success ? "PASS ✅" : "FAIL ❌");
if (!result.success) console.log(JSON.stringify(result.error.issues, null, 2));

// Also verify a workspace WITH an owner (joinedAt path) if any exist
const { data: owned } = await supabase.from("workspaces").select("*").not("owner_user_id", "is", null).limit(1).maybeSingle();
if (owned) {
  const e2 = {
    id: owned.id, status: owned.status, plan: owned.plan, limits: (owned.limits ?? {}),
    membership: [ ...(owned.owner_user_id ? [{ userId: owned.owner_user_id, role: "owner", joinedAt: owned.created_at }] : []) ],
    metadata: { ...(owned.metadata ?? {}), domain: owned.domain ?? undefined, createdAt: owned.created_at, updatedAt: owned.updated_at },
  };
  const r2 = entitySchema.safeParse(e2);
  console.log(`owned workspace ${owned.domain ?? owned.id} validation:`, r2.success ? "PASS ✅" : "FAIL ❌", r2.success ? "" : JSON.stringify(r2.error.issues));
}
