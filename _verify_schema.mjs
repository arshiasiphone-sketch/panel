// Inspect the deployed bundle's workspace entity schema to see if membership is
// required non-empty (which would reject khane's owner=null row -> findByDomain null).
import { readFileSync } from "node:fs";
const js = readFileSync(new URL("./_deployed_index.js", import.meta.url), "utf8");

// find the membership schema: look for the string "membership" near an array validator
let i = js.indexOf('"membership"');
while (i >= 0) {
  console.log(`\n--- "membership" @${i} ---`);
  console.log(js.slice(i - 80, i + 200).replace(/\n/g, " "));
  i = js.indexOf('"membership"', i + 1);
  if (i > 500000) break;
}

// Look for .min(1) applied to an array right before "membership" or to a workspace field
const minRe = /array\([^)]{0,120}\)\.min\(1\)/g;
let m;
while ((m = minRe.exec(js)) !== null) {
  console.log(`\n[array.min(1)] @${m.index}:`, m[0]);
}
console.log("\n(done)");
