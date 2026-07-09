// Throwaway script: resolve all 28 conflicted files to the HEAD side.
// Strategy: drop every `<<<<<<< HEAD` opener line, then delete each
// `=======` ... `>>>>>>>` theirs-region entirely (HEAD side is kept).
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const files = [
  ".env.example",
  ".gitignore",
  "package-lock.json",
  "package.json",
  "tsconfig.json",
  "vite.config.ts",
  "src/routeTree.gen.ts",
  "src/components/admin/admin-shell.tsx",
  "src/components/landing/landing-sections.tsx",
  "src/components/ui/orb-background.tsx",
  "src/lib/analytics-hooks.ts",
  "src/lib/analytics.functions.ts",
  "src/lib/cms-schemas.ts",
  "src/lib/cms.functions.ts",
  "src/lib/cms.ts",
  "src/lib/media.ts",
  "src/lib/test-db.ts",
  "src/lib/utils.ts",
  "src/routes/admin.events.tsx",
  "src/routes/admin.gallery.tsx",
  "src/routes/admin.media.tsx",
  "src/routes/admin.menu.tsx",
  "src/routes/admin.page.tsx",
  "src/routes/admin.settings.tsx",
  "src/routes/admin.test-results.tsx",
  "src/routes/admin.tsx",
  "src/routes/index.tsx",
  "src/routes/__root.tsx",
];

function stripConflictMarkers(text) {
  // 1) remove opener lines: `<<<<<<< HEAD` (or any ref)
  let out = text.replace(/<<<<<<< [^\r\n]*(\r?\n)?/g, "");
  // 2) remove separator + theirs side + closer: `=======` ... `>>>>>>> ref`
  out = out.replace(/=======(\r?\n)[\s\S]*?\r?\n>>>>>>> [^\r\n]*(\r?\n)?/g, "");
  return out;
}

function countMarkers(text) {
  return {
    open: (text.match(/<<<<<<< [^\r\n]*/g) || []).length,
    sep: (text.match(/^=======$/gm) || []).length,
    close: (text.match(/>>>>>>> [^\r\n]*/g) || []).length,
  };
}

const results = [];
for (const f of files) {
  if (!existsSync(f)) {
    results.push({ file: f, status: "MISSING" });
    continue;
  }
  const raw = readFileSync(f, "utf8");
  const before = countMarkers(raw);
  if (before.open + before.sep + before.close === 0) {
    results.push({ file: f, status: "NO-MARKERS" });
    continue;
  }
  const resolved = stripConflictMarkers(raw);
  const after = countMarkers(resolved);
  writeFileSync(f, resolved);
  let jsonOk = "n/a";
  if (f.endsWith(".json")) {
    try {
      JSON.parse(resolved);
      jsonOk = "valid-json";
    } catch (e) {
      jsonOk = "INVALID-JSON: " + e.message.slice(0, 80);
    }
  }
  const leftover = after.open + after.sep + after.close;
  results.push({
    file: f,
    status: leftover === 0 ? "CLEAN-HEAD" : `RESIDUAL(${leftover})`,
    before,
    jsonOk,
  });
}

for (const r of results) {
  const b = r.before ? `o${r.before.open}/s${r.before.sep}/c${r.before.close}` : "-";
  console.log(
    `${r.status.padEnd(16)} before[${b.padEnd(13)}] json=${String(r.jsonOk ?? "-").padEnd(13)} ${r.file}`,
  );
}
const bad = results.filter((r) => r.status !== "CLEAN-HEAD" && r.status !== "NO-MARKERS");
console.log(
  "\nTotal:",
  results.length,
  "| Resolved:",
  results.filter((r) => r.status === "CLEAN-HEAD").length,
  "| No-markers:",
  results.filter((r) => r.status === "NO-MARKERS").length,
);
if (bad.length) {
  console.log("ATTENTION:");
  for (const r of bad) console.log("  ", JSON.stringify(r));
} else {
  console.log("All conflicted files resolved cleanly to HEAD (no residual markers).");
}
