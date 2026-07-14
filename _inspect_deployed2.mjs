import { readFileSync } from "node:fs";
const js = readFileSync(new URL("./_deployed_index.js", import.meta.url), "utf8");

function ctx(needle, pad = 200, max = 2) {
  let i = 0, n = 0;
  while ((i = js.indexOf(needle, i)) !== -1 && n < max) {
    console.log(`\n--- "${needle}" @${i} ---`);
    console.log(js.slice(Math.max(0, i - pad), i + pad));
    i += needle.length;
    n++;
  }
  if (n === 0) console.log(`(no match: ${needle})`);
}

ctx("_mapRowToEntity", 260, 3);
ctx("resolveWorkspaceFromRequest", 220, 2);
ctx("createdAt", 160, 4);
ctx("updatedAt", 160, 4);
