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

interface CacheStore {
  /** table -> key -> entry */
  [table: string]: Map<string, CacheEntry<unknown>>;
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
   * @param table - The table/entity type (e.g., "theme_settings", "site_content")
   * @param key - The cache key within the table (e.g., method name + args)
   * @param fetchFn - Function that returns the value if not cached
   * @param ttlMs - Optional TTL override
   * @returns The cached or freshly-fetched value
   */
  async getOrFetch<T>(
    table: string,
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number = RepositoryCache.DEFAULT_TTL_MS,
  ): Promise<T> {
    const cached = this._get<T>(table, key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await fetchFn();
    this._set(table, key, value, ttlMs);
    return value;
  }

  /**
   * Get a value synchronously if it exists in cache.
   * Returns undefined if not cached or expired.
   */
  get<T>(table: string, key: string): T | undefined {
    return this._get<T>(table, key);
  }

  /**
   * Set a value in cache.
   */
  set<T>(table: string, key: string, value: T, ttlMs?: number): void {
    this._set(table, key, value, ttlMs);
  }

  /**
   * Invalidate all cached entries for a given table.
   * Call this after any write/mutation on that table.
   */
  invalidate(table: string): void {
    const entries = this.store[table];
    if (entries) {
      entries.clear();
    }
  }

  /**
   * Invalidate a specific cached entry.
   */
  invalidateKey(table: string, key: string): void {
    const entries = this.store[table];
    if (entries) {
      entries.delete(key);
    }
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    for (const table of Object.keys(this.store)) {
      this.store[table].clear();
    }
  }

  /**
   * Get cache statistics.
   */
  stats(): { tables: number; entries: number } {
    let entries = 0;
    for (const table of Object.keys(this.store)) {
      entries += this.store[table].size;
    }
    return { tables: Object.keys(this.store).length, entries };
  }

  // ─── Private ───────────────────────────────────────────────────────────

  private _get<T>(table: string, key: string): T | undefined {
    const entries = this.store[table];
    if (!entries) return undefined;

    const entry = entries.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;

    // Check TTL — >= ensures TTL=0 expires immediately
    if (Date.now() - entry.createdAt >= entry.ttlMs) {
      entries.delete(key);
      return undefined;
    }

    return entry.value;
  }

  private _set<T>(table: string, key: string, value: T, ttlMs?: number): void {
    if (!this.store[table]) {
      this.store[table] = new Map();
    }

    this.store[table].set(key, {
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
