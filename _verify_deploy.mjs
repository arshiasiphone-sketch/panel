import { readFileSync } from "node:fs";

const env = readFileSync(new URL("./.env", import.meta.url), "utf8");
const get = (k) => {
  const m = env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, "m"));
  return m ? m[1] : undefined;
};
const LIVE = "https://panel-ecru-three.vercel.app";

const OLD_BUNDLE = "index-CWseWO3z.js";
const NEW_BUNDLE = "index-B-IGmBd9.js";

function extractBundle(html) {
  const m = html.match(/src="\/(index-[A-Za-z0-9_-]+\.js)"/);
  return m ? m[1] : null;
}

async function check() {
  const r = await fetch(`${LIVE}/`, { redirect: "manual" });
  const t = await r.text();
  return { status: r.status, bundle: extractBundle(t) };
}

let deploySeen = false;
for (let i = 0; i < 30; i++) {
  try {
    const { status, bundle } = await check();
    const ts = new Date().toISOString().slice(11, 19);
    if (bundle === NEW_BUNDLE) {
      console.log(`[${ts}] DEPLOYED ✓ status=${status} bundle=${bundle}`);
      deploySeen = true;
      break;
    }
    console.log(`[${ts}] waiting… status=${status} bundle=${bundle ?? "(none)"} (old=${bundle === OLD_BUNDLE})`);
  } catch (e) {
    console.log(`[${new Date().toISOString().slice(11, 19)}] fetch error: ${e.message}`);
  }
  await new Promise((res) => setTimeout(res, 8000));
}

if (!deploySeen) {
  console.log("\nTimed out waiting for the new bundle to appear. Check the Vercel dashboard.");
} else {
  console.log(
    `\nNew build (${NEW_BUNDLE}) is live. Verify isolation: open ${LIVE}/?preview_domain=khane.nama.app`,
  );
}
