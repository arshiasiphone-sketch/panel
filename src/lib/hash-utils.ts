/**
 * NAMA Platform — Shared Hashing and Serialization Utilities.
 *
 * Provides deterministic, stable hashing and stringification utilities
 * used throughout the provisioning system for idempotency and dedup.
 *
 * ENTERPRISE HARDENING (EPIC 4B.3, Phase 11):
 * - Single source of truth for stableStringify (used by both pages.ts and installer.ts)
 * - Single source of truth for SHA-256 block key hashing
 * - Eliminates duplicated implementation of _stableStringify and _computeBlockKeyHash
 * - Uses Web Crypto API for browser/edge/Node compatibility
 */

// ─── Stable Stringify ────────────────────────────────────────────────────────

/**
 * Create a stable, sorted string representation of a value.
 * Ensures object keys are always in the same order for deterministic hashing.
 * Replaces the previous duplicate implementations in pages.ts and installer.ts.
 *
 * @param value - Any JSON-serializable value
 * @returns A deterministic string representation
 */
export function stableStringify(value: unknown): string {
  if (value === null) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map((v) => stableStringify(v)).join(",") + "]";
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") + "}";
}

// ─── SHA-256 Hashing ─────────────────────────────────────────────────────────

/**
 * Compute a deterministic SHA-256 hash for a block definition.
 * Uses Web Crypto API for stable, order-independent identification.
 * Works in both browser (Vite) and server (Node 18+) environments.
 *
 * @param pageKey - The page this block belongs to
 * @param type - The block type (e.g., "hero", "features")
 * @param data - The block data content
 * @returns Hex-encoded SHA-256 hash string
 */
export async function computeBlockKeyHash(
  pageKey: string,
  type: string,
  data: Record<string, unknown>,
): Promise<string> {
  const stable = stableStringify({ pageKey, type, data });
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(stable);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Compute a SHA-256 hash of an arbitrary string.
 * Useful for creating deterministic identifiers from arbitrary input.
 *
 * @param input - The string to hash
 * @returns Hex-encoded SHA-256 hash string
 */
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Create a short fingerprint from a string (first 16 hex chars of SHA-256).
 * Useful for creating compact, deterministic identifiers.
 *
 * @param input - The string to fingerprint
 * @returns Short 16-character hex fingerprint
 */
export async function fingerprint(input: string): Promise<string> {
  const hash = await sha256(input);
  return hash.slice(0, 16);
}
