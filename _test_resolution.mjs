// Replicate the DEPLOYED client resolution path against the live DB using the
// browser's anon key, to see whether a valid WorkspaceEntity is produced for
// ?preview_domain=khane.nama.app.
import { readFileSync } from "node:fs";
const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const BASE = get("VITE_SUPABASE_URL");
const ANON = get("VITE_SUPABASE_PUBLISHABLE_KEY");

// 1) findByDomain("khane.nama.app") — anon (browser) perspective
const url = `${BASE}/rest/v1/workspaces?select=*&domain=eq.khane.nama.app&limit=1`;
const res = await fetch(url, {
  headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
});
const rows = await res.json();
console.log("findByDomain HTTP", res.status, "rows:", rows.length);
if (rows.length === 0) {
  console.log(">>> ROW NOT FOUND for anon key — RLS or no row");
  process.exit(0);
}
const e = rows[0];

// 2) _mapRowToEntity (replicates deployed logic)
const t = {
  id: e.id,
  status: e.status,
  plan: e.plan,
  limits: e.limits ?? {},
  membership: [...(e.owner_user_id
    ? [{ userId: e.owner_user_id, role: "owner", joinedAt: e.created_at }]
    : [])],
  metadata: {
    ...(e.metadata ?? {}),
    domain: e.domain ?? undefined,
    createdAt: e.created_at,
    updatedAt: e.updated_at,
  },
};

// 3) workspaceEntitySchema.safeParse (manual replication of zod semantics)
const errors = [];
const isInt0 = (x) => Number.isInteger(x) && x >= 0;
const isDateTime = (x) => typeof x === "string" && !isNaN(Date.parse(x));

if (typeof t.id !== "string" || t.id.length < 1) errors.push("id");
if (!["provisioning","active","trial","suspended","archived","deleted"].includes(t.status)) errors.push("status");
if (!["free","starter","pro","enterprise"].includes(t.plan)) errors.push("plan");
const L = t.limits;
if (!L || !isInt0(L.maxPages) || !isInt0(L.maxMedia) || !isInt0(L.maxStorage) ||
    !isInt0(L.maxTemplates) || !isInt0(L.maxAdmins) || !isInt0(L.maxAnalyticsRetention) ||
    !isInt0(L.maxVisitors)) errors.push("limits");
if (!Array.isArray(t.membership)) errors.push("membership");
else for (const m of t.membership) {
  if (typeof m.userId !== "string" && m.userId !== null) errors.push("membership.userId");
  if (!["owner","admin","member","viewer"].includes(m.role)) errors.push("membership.role");
  if (!isDateTime(m.joinedAt)) errors.push("membership.joinedAt");
}
const M = t.metadata;
if (typeof M.name !== "string" || M.name.length < 1 || M.name.length > 200) errors.push("metadata.name");
if (M.description !== undefined && (typeof M.description !== "string" || M.description.length > 2000)) errors.push("metadata.description");
if (M.logo !== undefined && (typeof M.logo !== "string" || !/^https?:\/\//.test(M.logo))) errors.push("metadata.logo");
if (M.domain !== undefined && typeof M.domain !== "string") errors.push("metadata.domain");
if (typeof M.locale !== "string" || M.locale.length < 2 || M.locale.length > 10) errors.push("metadata.locale");
if (typeof M.timezone !== "string" || M.timezone.length < 1 || M.timezone.length > 50) errors.push("metadata.timezone");
if (!isDateTime(M.createdAt)) errors.push("metadata.createdAt");
if (!isDateTime(M.updatedAt)) errors.push("metadata.updatedAt");

console.log("\nconstructed entity metadata keys:", Object.keys(M));
console.log("constructed entity limits keys:", Object.keys(L));
if (errors.length === 0) {
  console.log("\n>>> safeParse SUCCESS — entity resolved. workspaceId =", t.id);
} else {
  console.log("\n>>> safeParse FAILED — errors:", errors);
}
