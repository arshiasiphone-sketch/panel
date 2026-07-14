// Find the workspace entity schema `K` in the LIVE deployed bundle and check
// whether it allows empty membership / nullable userId (the khane case).
const ROOT = "https://panel-ecru-three.vercel.app/";
const html = await (await fetch(ROOT)).text();
const urls = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+\.js)"/g)) urls.add(new URL(m[1], ROOT).href);
const idx = [...urls].find((u) => u.includes("index-"));
const js = await (await fetch(idx)).text();

// 1. does the bundle use .nullable() at all?
console.log("=== .nullable() occurrences ===");
let i = js.indexOf(".nullable()");
let g = 0;
while (i >= 0 && g++ < 10) {
  console.log(` @${i}:`, js.slice(i - 80, i + 40).replace(/\n/g, " "));
  i = js.indexOf(".nullable()", i + 1);
}

// 2. find the membership schema: userId:z.string().min(1)... — does it have .nullable()?
console.log("\n=== userId schema ===");
let j = js.indexOf("userId:");
g = 0;
while (j >= 0 && g++ < 10) {
  const slice = js.slice(j, j + 90).replace(/\n/g, " ");
  if (/userId:z\.string|userId:Pe\(|min\(1\)/.test(slice))
    console.log(` @${j}:`, slice);
  j = js.indexOf("userId:", j + 1);
}

// 3. array().min(1) anywhere (would require non-empty membership)?
console.log("\n=== array().min(1) ===");
let k = js.indexOf("array()");
g = 0;
while (k >= 0 && g++ < 10) {
  const slice = js.slice(k - 10, k + 60).replace(/\n/g, " ");
  if (/min\(1\)/.test(js.slice(k, k + 60))) console.log(` @${k}:`, slice);
  k = js.indexOf("array()", k + 1);
}

// 4. find K = schema definition (K= or K=Pe or K=Xi)
console.log("\n=== K assignment ===");
let m = js.indexOf("K=");
g = 0;
while (m >= 0 && g++ < 6) {
  console.log(` @${m}:`, js.slice(m, m + 260).replace(/\n/g, " "));
  m = js.indexOf("K=", m + 1);
}
console.log("\nDONE");
