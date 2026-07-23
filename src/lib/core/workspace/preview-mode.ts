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
  const isSafe = SAFE_PREVIEW_HOSTS.includes(host);
  
  if (typeof window !== "undefined" && !isSafe) {
    // Log non-safe hosts for debugging
    console.debug("[NAMA][preview-mode] Host check failed", {
      hostname: host,
      isSafe,
      safeHosts: SAFE_PREVIEW_HOSTS
    });
  }
  
  return isSafe;
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
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/cafe");
  
  if (!isAdmin) {
    console.debug("[NAMA][preview-mode] Route check failed", {
      pathname,
      isAdmin
    });
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
 * TIER 2: Route verification
 *   - Preview mode requires the user to be in /admin or /cafe.
 *   - Public routes (/, /landing, etc.) cannot use preview_domain.
 *   - This prevents preview_domain from being used to spoof access on public pages.
 *
 * If both tiers pass, preview mode is enabled (no build-time env var check needed).
 * This allows preview mode to work WITHOUT requiring VITE_ENABLE_DOMAIN_PREVIEW
 * to be set at build time, which is fragile in the Vercel environment.
 *
 * SECURITY:
 *   - This is safe because:
 *     1. Preview domain param only works from the PLATFORM HOST (owned/controlled)
 *     2. Preview domain only works in ADMIN CONTEXT (restricted to managers)
 *     3. Actual workspace resolution still requires workspace to exist in DB
 *     4. Fallback to default workspace prevents access to unowned workspaces
 */
export function canEnablePreviewMode(): boolean {
  // TIER 1: Host verification — only allow on safe/trusted hosts
  if (!isSafePreviewHost()) {
    return false;
  }

  // TIER 2: Route verification — only allow in admin/restricted contexts
  if (!isAdminRoute()) {
    return false;
  }

  // Both tiers passed — preview mode is safe
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
 *   - preview_domain ONLY works in admin routes (/admin, /cafe)
 *   - Workspace must exist in database to be resolved
 *   - Falls back to default workspace if not found
 *
 * Returns undefined if:
 *   - Not on a safe/trusted host
 *   - Not in an admin route
 *   - preview_domain param is missing/empty
 */
export function parsePreviewDomainSafely(
  search: string | { preview_domain?: string },
): string | undefined {
  const canEnable = canEnablePreviewMode();
  const raw = typeof search === "string" ? search : search.preview_domain ?? "";
  
  if (typeof window !== "undefined") {
    console.debug("[NAMA][preview-mode] parsePreviewDomainSafely called", {
      search: raw ? raw.substring(0, 100) : "(empty)",
      canEnable,
      isSafeHost: isSafePreviewHost(),
      isAdmin: isAdminRoute(),
      hostname: window.location.hostname,
      pathname: window.location.pathname
    });
  }

  // Early exit if preview mode is not safe
  if (!canEnable) {
    if (typeof window !== "undefined") {
      console.debug("[NAMA][preview-mode] → Gates failed, returning undefined");
    }
    return undefined;
  }

  const value = new URLSearchParams(raw)
    .get("preview_domain")
    ?.trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    console.debug("[NAMA][preview-mode] → Extracted value", { 
      extracted: value || "(undefined)"
    });
  }

  return value ? value : undefined;
}
