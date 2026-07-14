import { readFileSync } from "node:fs";
const js = readFileSync(new URL("./_deployed_index.js", import.meta.url), "utf8");

function ctx(needle, pad = 140, max = 3) {
  let i = 0;
  let n = 0;
  while ((i = js.indexOf(needle, i)) !== -1 && n < max) {
    console.log(`\n--- "${needle}" @${i} ---`);
    console.log(js.slice(Math.max(0, i - pad), i + pad));
    i += needle.length;
    n++;
  }
  if (n === 0) console.log(`(no match: ${needle})`);
}

for (const needle of [
  "workspace-resolution",
  "Workspace ID is not set",
  "single-tenant default",
  "workspace_resolver",
  "maybeSingle",
  'eq("domain"',
  "getOrFetch",
  "from(`workspaces`)",
  'from("workspaces")',
]) {
  ctx(needle);
}
