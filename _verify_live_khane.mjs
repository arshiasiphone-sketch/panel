import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const sb = createClient(get("VITE_SUPABASE_URL"), get("VITE_SUPABASE_PUBLISHABLE_KEY"), {
  auth: { persistSession: false },
});
const KAHNE = "0f37f4a1-a57a-457d-af98-2836c04f756b";
const DEFAULT = "00000000-0000-0000-0000-000000000001";
const LIVE = "https://panel-ecru-three.vercel.app";

async function titlesFor(wsId) {
  const { data } = await sb.from("menu_items").select("title").eq("workspace_id", wsId).eq("visible", true);
  return (data ?? []).map((r) => r.title).filter(Boolean);
}

const khaneTitles = await titlesFor(KAHNE);
const defaultTitles = await titlesFor(DEFAULT);
console.log("DB menu titles — KHANE:", khaneTitles);
console.log("DB menu titles — DEFAULT:", defaultTitles);

async function fetchHtml(url) {
  const r = await fetch(url, { redirect: "manual" });
  const t = await r.text();
  return { status: r.status, len: t.length, text: t };
}

const defPage = await fetchHtml(`${LIVE}/`);
const khanePage = await fetchHtml(`${LIVE}/?preview_domain=khane.nama.app`);

console.log(`\nLIVE default  -> status ${defPage.status}, ${defPage.len} bytes`);
console.log(`LIVE khane    -> status ${khanePage.status}, ${khanePage.len} bytes`);
console.log(`HTML identical between default and khane-preview? ${defPage.text === khanePage.text}`);

for (const t of [...new Set([...khaneTitles, ...defaultTitles])]) {
  const inDef = defPage.text.includes(t);
  const inKh = khanePage.text.includes(t);
  if (inDef || inKh) console.log(`  title "${t}": default=${inDef ? "Y" : "n"} khane=${inKh ? "Y" : "n"}`);
}

// Also: is the workspace domain / id referenced in the khane preview HTML?
console.log(`\nkhane.nama.app referenced in khane page: ${khanePage.text.includes("khane.nama.app")}`);
console.log(`workspace id in khane page: ${khanePage.text.includes(KAHNE)}`);
