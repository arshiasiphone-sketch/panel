import { readFileSync } from "node:fs";
const js = readFileSync(new URL("./_deployed_index.js", import.meta.url), "utf8");
// Print the Pp provider resolve body starting where it begins.
const start = 399136;
console.log(js.slice(start, start + 1500));
