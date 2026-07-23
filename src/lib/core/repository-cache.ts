/**
 * NAMA Platform — Repository Cache Layer.
 *
 * Lightweight, in-memory, per-request cache for repository reads.
 * Prevents repeated queries for the same data within a single request.
 *
 * ENTERPRISE FEATURES:
 * - Per-request lifetime (not cross-request — no stale data risks)
 * - Auto-invalidation when a mutation (write) occurs on a table
 * - TTL-based expiration for frequently-accessed data
 * - Thread-safe (per-request instances)
 * - No Redis, no external dependencies — pure in-memory
 *
 * Usage:
 *   const cache = RepositoryCache.getInstance(); // or new RepositoryCache()
 *   const cached = await cache.getOrFetch("theme_settings", "get", () => repo.get());
 *   cache.invalidate("theme_settings"); // after mutation
 */

// ─── Cache Entry ─────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  /** The cached value. */
  value: T;
  /** Timestamp when this entry was created. */
  createdAt: number;
  /** Optional TTL in milliseconds (default: 5000ms). */
  ttlMs: number;
}

// ─── Cache Store ─────────────────────────────────────────────────────────────

/**
 * Full cache key type that includes workspace context.
 * Format: "table:key" or "table:key:workspace-{workspaceId}"
 */
export type FullCacheKey = string;

interface CacheStore {
  /** fullCacheKey -> entry */
  [fullCacheKey: string]: Map<string, CacheEntry<unknown>>;
}

// ─── Repository Cache ────────────────────────────────────────────────────────

export class RepositoryCache {
  /** Default TTL for cached entries (5 seconds). */
  private static readonly DEFAULT_TTL_MS = 5_000;

  /** Per-request cache store. */
  private readonly store: CacheStore = {};

  /**
   * Get a value from cache, or fetch and cache it if not present.
   *
   * Supports both historical call patterns:
   *   - cache.getOrFetch(fullCacheKey, fetchFn, ttlMs)
   *   - cache.getOrFetch(table, key, fetchFn, ttlMs)
   */
  async getOrFetch<T>(
    tableOrFullKey: string,
    keyOrFetchFn: string | (() => Promise<T>),
    fetchFnOrTtl?: (() => Promise<T>) | number,
    maybeTtl?: number,
  ): Promise<T> {
    const isLegacyShape = typeof keyOrFetchFn !== "function";
    const fullCacheKey = isLegacyShape
      ? this.buildCacheKey(tableOrFullKey, keyOrFetchFn)
      : tableOrFullKey;
    const fetchFn = isLegacyShape
      ? (fetchFnOrTtl as () => Promise<T>)
      : (keyOrFetchFn as () => Promise<T>);
    const ttlMs = isLegacyShape ? (maybeTtl ?? RepositoryCache.DEFAULT_TTL_MS) : (fetchFnOrTtl as number | undefined) ?? RepositoryCache.DEFAULT_TTL_MS;

    const cached = this._get<T>(fullCacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const value = await fetchFn();
    this._set(fullCacheKey, value, ttlMs);
    return value;
  }

  /**
   * Build a workspace-aware cache key.
   * @param table - The table/entity type
   * @param key - The cache key within the table
   * @param workspaceId - Optional workspace ID for scoping
   */
  buildCacheKey(table: string, key: string, workspaceId?: string): FullCacheKey {
    return workspaceId 
      ? `${table}:${key}:workspace-${workspaceId}`
      : `${table}:${key}`;
  }

  /**
   * Get a value synchronously if it exists in cache.
   * Returns undefined if not cached or expired.
   *
   * Supports both fullCacheKey and table/key usage.
   */
  get<T>(tableOrFullKey: string, key?: string): T | undefined {
    const fullCacheKey = key ? this.buildCacheKey(tableOrFullKey, key) : tableOrFullKey;
    return this._get<T>(fullCacheKey);
  }

  /**
   * Set a value in cache.
   * Supports both fullCacheKey and table/key usage.
   */
  set<T>(tableOrFullKey: string, keyOrValue: string | T, value?: T, ttlMs?: number): void {
    const fullCacheKey = typeof keyOrValue === "string" && value !== undefined
      ? this.buildCacheKey(tableOrFullKey, keyOrValue)
      : tableOrFullKey;
    const resolvedValue = typeof keyOrValue === "string" && value !== undefined ? value : (keyOrValue as T);
    this._set(fullCacheKey, resolvedValue, ttlMs);
  }

  /**
   * Invalidate all cached entries for a given table.
   * Call this after any write/mutation on that table.
   * Note: This is a legacy method. Prefer invalidateByPrefix() for workspace-scoped invalidation.
   */
  invalidate(table: string): void {
    // For backward compatibility, invalidate all keys starting with table:
    for (const fullKey of Object.keys(this.store)) {
      if (fullKey.startsWith(`${table}:`)) {
        this.store[fullKey]?.clear();
        delete this.store[fullKey];
      }
    }
  }

  /**
   * Invalidate all cached entries matching a prefix.
   * Use this for workspace-scoped invalidation.
   * @param prefix - The prefix to match (e.g., "theme_settings:workspace-")
   */
  invalidateByPrefix(prefix: string): void {
    for (const fullKey of Object.keys(this.store)) {
      if (fullKey.startsWith(prefix)) {
        this.store[fullKey]?.clear();
        delete this.store[fullKey];
      }
    }
  }

  /**
   * Invalidate a specific cached entry.
   * Supports both fullCacheKey and table/key usage.
   */
  invalidateKey(tableOrFullKey: string, key?: string): void {
    const fullCacheKey = key ? this.buildCacheKey(tableOrFullKey, key) : tableOrFullKey;
    const entries = this.store[fullCacheKey];
    if (entries) {
      entries.clear();
      delete this.store[fullCacheKey];
    }
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    for (const fullCacheKey of Object.keys(this.store)) {
      this.store[fullCacheKey]?.clear();
      delete this.store[fullCacheKey];
    }
  }

  /**
   * Get cache statistics.
   */
  stats(): { tables: number; entries: number } {
    let entries = 0;
    const tables = new Set<string>();

    for (const fullCacheKey of Object.keys(this.store)) {
      const table = fullCacheKey.split(":")[0];
      tables.add(table);
      entries += this.store[fullCacheKey].size;
    }

    return { tables: tables.size, entries };
  }

  // ─── Private ───────────────────────────────────────────────────────────

  private _get<T>(fullCacheKey: FullCacheKey): T | undefined {
    const entries = this.store[fullCacheKey];
    if (!entries) return undefined;

    // For the fullCacheKey structure, we use a single sub-key "_"
    const entry = entries.get("_") as CacheEntry<T> | undefined;
    if (!entry) return undefined;

    // Check TTL — >= ensures TTL=0 expires immediately
    if (Date.now() - entry.createdAt >= entry.ttlMs) {
      entries.delete("_");
      return undefined;
    }

    return entry.value;
  }

  private _set<T>(fullCacheKey: FullCacheKey, value: T, ttlMs?: number): void {
    if (!this.store[fullCacheKey]) {
      this.store[fullCacheKey] = new Map();
    }

    this.store[fullCacheKey].set("_", {
      value,
      createdAt: Date.now(),
      ttlMs: ttlMs ?? RepositoryCache.DEFAULT_TTL_MS,
    });
  }
}

// ─── Singleton instance (per-request) ────────────────────────────────────────

let _instance: RepositoryCache | null = null;

/**
 * Get the singleton RepositoryCache instance.
 * In a multi-request environment (e.g., server), each request should
 * get a fresh instance via `new RepositoryCache()`.
 */
export function getCache(): RepositoryCache {
  if (!_instance) {
    _instance = new RepositoryCache();
  }
  return _instance;
}

/**
 * Reset the singleton — useful between tests or for request boundaries.
 */
export function resetCache(): void {
  _instance = null;
}
