/**
 * Server-side environment loader.
 *
 * Vite injects `import.meta.env` (and therefore `process.env`) for the client
 * bundle, but the Nitro production server (what Vercel actually runs) does NOT
 * automatically read a local `.env` file. When SUPABASE_URL /
 * SUPABASE_SERVICE_ROLE_KEY are missing from `process.env`, we fall back to
 * parsing `.env` from disk so the admin (service_role) client can initialise.
 *
 * This is a no-op when the vars are already present (e.g. set in the Vercel
 * dashboard), so it never overrides real deployment configuration.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

let _loaded = false;

export function loadServerEnv(): void {
  if (_loaded) return;
  _loaded = true;

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return; // Already provided (Vercel dashboard / real env) — do nothing.
  }

  // Try a few common locations for the .env file.
  const candidates = [".env", ".env.local", "../../.env", join(process.cwd(), ".env")];

  for (const candidate of candidates) {
    try {
      if (!existsSync(candidate)) continue;
      const raw = readFileSync(candidate, "utf8");
      for (const line of raw.split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        const key = m[1];
        let value = m[2].trim();
        // Strip surrounding quotes.
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (process.env[key] === undefined || process.env[key] === "") {
          process.env[key] = value;
        }
      }
      return;
    } catch {
      // Ignore unreadable candidate and try the next.
    }
  }
}
/* trigger deploy 1784512558 */
/* deploy-bust 1784569815 */
