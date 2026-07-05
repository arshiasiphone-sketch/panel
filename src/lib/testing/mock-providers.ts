/**
 * Mock provider implementations for repository testing.
 *
 * These mocks implement the provider interfaces (IDatabaseProvider,
 * IStorageProvider, IAuthProvider, IRealtimeProvider) so that
 * repositories can be unit-tested without Supabase.
 *
 * Usage:
 *   const deps = createMockDependencies();
 *   const repo = new MenuRepository(deps);
 *   await repo.getAll();
 *   expect(deps.database.from).toHaveBeenCalledWith("menu_items");
 */

import type { IDatabaseProvider, ITableQuery } from "@/lib/interfaces/database";
import type { IStorageProvider } from "@/lib/interfaces/storage";
import type { IAuthProvider, AuthSubscription } from "@/lib/interfaces/auth";
import type { IRealtimeProvider, IChannel } from "@/lib/interfaces/realtime";
import type { RepositoryDependencies } from "@/lib/repositories/base";
import { ConsoleLogger } from "@/lib/logger";

// ─── Helper: create a mock ITableQuery from rows ───────────────────────

/**
 * Build a minimal ITableQuery<T> backed by an in-memory array.
 * Uses `any` casts internally since the ITableQuery interface is complex
 * (overloaded methods + thenable chaining). At the `from()` boundary the
 * result is cast to ITableQuery<T> which is the contract consumers expect.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildMockQuery<T>(initialRows: T[]): ITableQuery<T> {
  let rows = [...initialRows];
  let filters: Array<(row: T) => boolean> = [];

  function applyFilters(): T[] {
    let result = rows;
    for (const f of filters) result = result.filter(f);
    return result;
  }

  function thenableResult<TResult1 = { data: T[] | null; error: unknown; count?: number }>(
    onfulfilled?: ((value: { data: T[] | null; error: unknown; count?: number }) => TResult1 | PromiseLike<TResult1>) | null,
  ): Promise<TResult1 | never> {
    const data = applyFilters();
    const result = { data, error: null, count: data.length };
    return Promise.resolve(onfulfilled ? onfulfilled(result as any) : (result as any));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const q: any = {
    select: () => q,
    insert: () => q,
    upsert: () => q,
    update: () => q,
    delete: () => q,
    eq: (col: string, val: unknown) => {
      filters.push((row: T) => (row as Record<string, unknown>)[col] === val);
      return q;
    },
    neq: () => q,
    in: (col: string, values: unknown[]) => {
      filters.push((row: T) => (values as unknown[]).includes((row as Record<string, unknown>)[col]));
      return q;
    },
    like: (col: string, pattern: string) => {
      // Convert SQL LIKE pattern to regex and filter
      const regex = new RegExp(
        "^" + pattern.replace(/%/g, ".*").replace(/_/g, ".") + "$",
      );
      filters.push((row: T) =>
        regex.test(String((row as Record<string, unknown>)[col] ?? "")),
      );
      return q;
    },
    gt: () => q,
    gte: () => q,
    lt: () => q,
    lte: () => q,
    order: () => q,
    limit: () => q,
    range: () => q,
    maybeSingle: () => Promise.resolve({ data: applyFilters()[0] ?? null, error: null }),
    single: () => {
      const filtered = applyFilters();
      return filtered.length > 0
        ? Promise.resolve({ data: filtered[0], error: null })
        : Promise.reject(new Error("No rows"));
    },
    then: thenableResult,
  };

  return q as ITableQuery<T>;
}

// ─── Mock Database Provider ────────────────────────────────────────────

export function createMockDatabaseProvider(
  initialData: Record<string, unknown[]> = {},
): IDatabaseProvider {
  const tables = new Map<string, unknown[]>(Object.entries(initialData));

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from<T = Record<string, unknown>>(table: string): ITableQuery<T> {
      return buildMockQuery<T>((tables.get(table) ?? []) as T[]);
    },

    async rpc<R>(fn: string, _params?: Record<string, unknown>): Promise<{ data: R | null; error: unknown }> {
      return { data: null, error: new Error(`RPC not mocked: ${fn}`) };
    },

    removeChannel(_channel: unknown): Promise<void> {
      return Promise.resolve();
    },
  };
}

// ─── Mock Storage Provider ─────────────────────────────────────────────

export function createMockStorageProvider(): IStorageProvider {
  return {
    async upload(
      _bucket: string,
      _path: string,
      _file: File | Blob | ArrayBuffer,
      _options?: { contentType?: string; upsert?: boolean },
    ): Promise<{ error: unknown }> {
      return { error: null };
    },

    async remove(_bucket: string, _paths: string[]): Promise<{ error: unknown }> {
      return { error: null };
    },

    getPublicUrl(_bucket: string, path: string): string {
      return `https://mock.storage/${path}`;
    },
  };
}

// ─── Mock Auth Provider ────────────────────────────────────────────────

export function createMockAuthProvider(): IAuthProvider {
  return {
    async signInWithPassword(
      _input: { email: string; password: string },
    ): Promise<{ data?: { user: unknown; session: unknown }; error: unknown }> {
      return { data: { user: { id: "mock-user-id" }, session: {} }, error: null };
    },

    async signUp(
      _input: { email: string; password: string; options?: { emailRedirectTo?: string } },
    ): Promise<{ data?: { user: unknown; session: unknown }; error: unknown }> {
      return { data: { user: { id: "mock-user-id" }, session: {} }, error: null };
    },

    async signOut(): Promise<void> {
      // no-op
    },

    async getSession(): Promise<{
      data: { session: { user: { id: string; email?: string } } | null };
    }> {
      return { data: { session: { user: { id: "mock-user-id", email: "admin@test.com" } } } };
    },

    onAuthStateChange(
      _callback: (event: string, session: unknown) => void,
    ): AuthSubscription {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },

    async getClaims(
      _token: string,
    ): Promise<{ data: { claims?: { sub?: string } } | null; error: unknown }> {
      return { data: { claims: { sub: "mock-user-id" } }, error: null };
    },
  };
}

// ─── Mock Realtime Provider ────────────────────────────────────────────

export function createMockRealtimeProvider(): IRealtimeProvider {
  return {
    channel(_name: string): IChannel {
      return {
        on(
          _type: "postgres_changes",
          _filter: { event: string; schema: string; table: string; filter?: string },
          _callback: (payload: unknown) => void,
        ): IChannel {
          return this;
        },
        subscribe(_callback?: (status: string, err?: unknown) => void): IChannel {
          return this;
        },
      };
    },

    async removeChannel(_channel: unknown): Promise<void> {
      // no-op
    },

    getChannels(): unknown[] {
      return [];
    },
  };
}

// ─── Convenience factory ───────────────────────────────────────────────

/**
 * Create a complete set of mock RepositoryDependencies.
 * Pass `initialData` to seed database tables for test scenarios.
 *
 * @example
 *   const deps = createMockDependencies({
 *     menu_items: [
 *       { id: "1", name: "Coffee", category: "Drinks", price: "5", visible: true, sort_order: 0 },
 *     ],
 *   });
 *   const repo = new MenuRepository(deps);
 *   const items = await repo.getAll();
 */
export function createMockDependencies(
  initialData?: Record<string, unknown[]>,
): RepositoryDependencies {
  return {
    database: createMockDatabaseProvider(initialData),
    storage: createMockStorageProvider(),
    auth: createMockAuthProvider(),
    realtime: createMockRealtimeProvider(),
    logger: new ConsoleLogger(),
  };
}
