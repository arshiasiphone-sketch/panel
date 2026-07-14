import { readFileSync } from "node:fs";
const js = readFileSync(new URL("./_deployed_index.js", import.meta.url), "utf8");

// Find the definition of _p (resolveWorkspaceFromRequest in deployed bundle)
const re = /(?:function\s+_p\b|_p\s*=\s*async|_p\s*=\s*function|_p\s*=\s*\(|var\s+_p\s*=)/g;
let m;
while ((m = re.exec(js)) !== null) {
  const i = m.index;
  console.log(`\n=== _p def near @${i} ===`);
  console.log(js.slice(i, i + 360));
}

// Also look for the function that mentions both workspaceId and domain and userId
// (resolveWorkspaceFromRequest signature)
const idx = js.indexOf("userId:e");
console.log("\n\n--- 'userId:e' occurrence ---");
if (idx >= 0) console.log(js.slice(idx - 200, idx + 120));
