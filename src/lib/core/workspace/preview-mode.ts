/**
 * NAMA Platform — Production-Safe Preview Mode
 *
 * Enables ?preview_domain= testing in production WITHOUT compromising security.
 *
 * Safety rules (ALL must be true):
 * 1. preview_domain param exists in URL
 * 2. Current host matches a SAFE host (platform host or localhost)
 * 3. Workspace exists in database (verified by resolver)
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
  const isSafe = SAFE_PREVIEW_HOSTS.includes(host);
  
  if (typeof window !== "undefined" && !isSafe) {
    console.warn("[NAMA][preview-mode] Host check failed", host, SAFE_PREVIEW_HOSTS);
  }
  
  return isSafe;
}

/**
 * Check if the current route is an ADMIN context.
 * Returns true if pathname starts with /admin or /cafe.
 *
 * Kept for callers that need to distinguish admin routes. It is not a preview
 * mode gate because public preview routes are valid on the trusted host.
 */
export function isAdminRoute(): boolean {
  if (typeof window === "undefined") return false;
  const pathname = window.location.pathname;
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/cafe");
  
  if (!isAdmin) {
    console.warn("[NAMA][preview-mode] Route check failed", pathname);
  }
  
  return isAdmin;
}

/**
 * Check if preview mode is safe to enable.
 * Uses a two-tier approach:
 *
 * TIER 1: Host verification
 *   - Preview mode is ONLY available on the platform host or localhost.
 *   - If running on any other domain, preview mode is disabled.
 *
 * TIER 2: Workspace verification
 *   - The requested workspace must exist in the database.
 *   - Unknown domains fall back to the default context and never create a
 *     workspace or grant access to one.
 *
 * If the trusted-host check passes, preview mode is enabled (no build-time env
 * var check needed).
 * This allows preview mode to work WITHOUT requiring VITE_ENABLE_DOMAIN_PREVIEW
 * to be set at build time, which is fragile in the Vercel environment.
 *
 * SECURITY:
 *   - This is safe because:
 *     1. Preview domain param only works from the PLATFORM HOST (owned/controlled)
 *     2. The requested workspace must exist in the database
 *     3. Actual workspace resolution still requires workspace to exist in DB
 *     4. Fallback to default workspace prevents access to unowned workspaces
 */
export function canEnablePreviewMode(): boolean {
  // TIER 1: Host verification — only allow on safe/trusted hosts
  if (!isSafePreviewHost()) {
    return false;
  }

  // Public routes must also be able to use preview_domain: this is how a
  // provisioned website is viewed before its custom domain is connected.
  return true;
}

/**
 * Parse the `?preview_domain=<domain>` query param safely.
 *
 * Only extracts the param if preview mode is allowed (see canEnablePreviewMode).
 * Strips leading/trailing slashes to normalize input.
 *
 * Security: This is safe because:
 *   - preview_domain ONLY works from the platform host (panel-five-phi.vercel.app)
 *     or localhost (development)
 *   - preview_domain works on the platform host's public and admin routes
 *   - Workspace must exist in database to be resolved
 *   - Falls back to default workspace if not found
 *
 * Returns undefined if:
 *   - Not on a safe/trusted host
 *   - preview_domain param is missing/empty
 */
export function parsePreviewDomainSafely(search: string): string | undefined {
  const canEnable = canEnablePreviewMode();
  
  if (typeof window !== "undefined" && !canEnable) {
    console.warn("[NAMA][preview-mode] Gate failed - isSafeHost:", isSafePreviewHost());
    return undefined;
  }

  const value = new URLSearchParams(search)
    .get("preview_domain")
    ?.trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  if (typeof window !== "undefined" && value) {
    console.log("[NAMA][preview-mode] SUCCESS extracted preview_domain:", value);
  }

  return value ? value : undefined;
}
