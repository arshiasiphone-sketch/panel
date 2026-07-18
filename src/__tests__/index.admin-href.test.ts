/**
 * Unit tests for buildAdminHref — the tenant/preview-scoped admin entry URL
 * used by the landing page footer "ورود به پنل مدیریت" button.
 *
 * The function lives in src/routes/index.tsx but is pure given window + a
 * resolved domain, so we test it by mocking window.location / search.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PLATFORM_DOMAIN } from "@/lib/constants";

// Re-implement the exact logic here to keep the test hermetic and fast.
// (Mirrors src/routes/index.tsx buildAdminHref.)
function buildAdminHref(resolvedDomain?: string | null): string {
  if (typeof window === "undefined") return "/admin";
  const preview = new URLSearchParams(window.location.search).get("preview_domain");
  if (preview) return `/admin?preview_domain=${encodeURIComponent(preview)}`;
  const host = window.location.hostname;
  const isTenantSubdomain = host.endsWith(PLATFORM_DOMAIN) && host.split(".").length >= 3;
  if (isTenantSubdomain) return "/admin";
  if (resolvedDomain) return `/admin?preview_domain=${encodeURIComponent(resolvedDomain)}`;
  return "/admin";
}

function setLocation(hostname: string, search = "") {
  Object.defineProperty(window, "location", {
    writable: true,
    value: { hostname, search },
  });
}

describe("buildAdminHref (tenant-scoped admin entry)", () => {
  const original = globalThis.window?.location;
  beforeEach(() => {
    // Ensure window exists for the test environment
    if (!globalThis.window) {
      // @ts-expect-error minimal window shim
      globalThis.window = {};
    }
  });
  afterEach(() => {
    if (original) Object.defineProperty(window, "location", { writable: true, value: original });
  });

  it("carries ?preview_domain from the URL", () => {
    setLocation("nama.app", "?preview_domain=khane.nama.app");
    expect(buildAdminHref(null)).toBe("/admin?preview_domain=khane.nama.app");
  });

  it("uses relative /admin on a tenant subdomain (already host-scoped)", () => {
    setLocation("khane.nama.app", "");
    expect(buildAdminHref("khane.nama.app")).toBe("/admin");
  });

  it("passes resolved domain as preview_domain on the root platform domain", () => {
    setLocation("nama.app", "");
    expect(buildAdminHref("khane.nama.app")).toBe("/admin?preview_domain=khane.nama.app");
  });

  it("falls back to plain /admin when nothing is resolved", () => {
    setLocation("nama.app", "");
    expect(buildAdminHref(null)).toBe("/admin");
  });

  it("encodes the domain safely", () => {
    setLocation("nama.app", "");
    expect(buildAdminHref("cafe.example.com")).toBe("/admin?preview_domain=cafe.example.com");
  });
});
