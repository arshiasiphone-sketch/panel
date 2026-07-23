/**
 * NAMA Platform — Production-Safe Preview Mode
 *
 * Enables ?preview_domain= testing in production WITHOUT compromising security.
 *
 * Safety rules (ALL must be true):
 * 1. preview_domain param exists in URL
 * 2. Current host matches a SAFE host (platform host or localhost)
 * 3. Request is inside /admin OR user is authenticated
 * 4. Workspace exists in database (verified by resolver)
 *
 * If any check fails, preview mode is silently disabled.
 * No security regression — normal users see normal domains.
 * Developers/testers see multi-tenant isolation testing on platform host.
 */

export const SAFE_PREVIEW_HOSTS = [
  // Production platform aliases (multi-workspace testing)
  "panel-five-phi.vercel.app",
  "panel-jjv13f6r5-arshiasiphone-7470s-projects.vercel.app",  // Current Vercel subdomain
  // Local development
  "localhost",
  "127.0.0.1",
];

/**
 * Check if the current browser host is a SAFE preview host.
 * Returns true only if running on:
 *   - platform-five-phi.vercel.app (production)
 *   - localhost / 127.0.0.1 (development)
 */
export function isSafePreviewHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return SAFE_PREVIEW_HOSTS.includes(host);
}

/**
 * Check if the current route is an ADMIN context.
 * Returns true if pathname starts with /admin or /cafe.
 *
 * Preview mode is restricted to admin/testing routes, not public pages.
 * This prevents preview_domain from being used to access other users' workspaces
 * via /landing or /contact etc.
 */
export function isAdminRoute(): boolean {
  if (typeof window === "undefined") return false;
  const pathname = window.location.pathname;
  return pathname.startsWith("/admin") || pathname.startsWith("/cafe");
}

/**
 * Check if preview mode is safe to enable.
 * Uses a two-tier approach:
 *
 * TIER 1 (Build-time): VITE_ENABLE_DOMAIN_PREVIEW environment variable
 *   - If build did NOT set this (e.g. Vercel production without env var),
 *     return false immediately (feature completely disabled).
 *   - If build DID set this (e.g. local dev or Vercel preview with env),
 *     proceed to TIER 2.
 *
 * TIER 2 (Runtime): Additional safety checks
 *   - Must be on a SAFE host (production platform or localhost)
 *   - Must be in an admin route (/admin, /cafe)
 *   - (Workspace existence is validated by resolver separately)
 *
 * This two-tier approach provides defense-in-depth:
 *   - If a developer forgets to set VITE_ENABLE_DOMAIN_PREVIEW on Vercel,
 *     the feature is completely disabled at build time (no bypass possible).
 *   - If they DO set it intentionally, runtime checks prevent misuse.
 */
export function canEnablePreviewMode(): boolean {
  // TIER 1: Build-time gate. If not set, preview mode is completely disabled.
  if (import.meta.env.VITE_ENABLE_DOMAIN_PREVIEW !== "true") {
    return false;
  }

  // TIER 2: Runtime safety checks
  // Must be on a SAFE host AND in an admin route
  return isSafePreviewHost() && isAdminRoute();
}

/**
 * Parse the `?preview_domain=<domain>` query param safely.
 *
 * Only extracts the param if preview mode is allowed (see canEnablePreviewMode).
 * Strips leading/trailing slashes to normalize input.
 *
 * Returns undefined if:
 *   - VITE_ENABLE_DOMAIN_PREVIEW is not set
 *   - Not on a safe host
 *   - Not in an admin route
 *   - preview_domain param is missing/empty
 */
export function parsePreviewDomainSafely(
  search: string | { preview_domain?: string },
): string | undefined {
  // Early exit if preview mode is not safe
  if (!canEnablePreviewMode()) {
    return undefined;
  }

  const raw = typeof search === "string" ? search : search.preview_domain ?? "";

  const value = new URLSearchParams(raw)
    .get("preview_domain")
    ?.trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  return value ? value : undefined;
}
