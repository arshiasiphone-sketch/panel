/**
 * Supabase implementation of IDatabaseProvider.
 * Wraps the Supabase PostgREST client behind the provider interface.
 * All current query logic is preserved — only the transport layer is abstracted.
 */

import type { IDatabaseProvider, ITableQuery } from "@/lib/interfaces/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a database provider backed by Supabase.
 * This is the ONLY file that should import/create Supabase clients for DB operations.
 */
export function createSupabaseDatabaseProvider(
  supabase: SupabaseClient,
): IDatabaseProvider {
  return {
    from<T>(table: string): ITableQuery<T> {
      const sbQuery = supabase.from(table);
      return new SupabaseTableQuery<T>(sbQuery as never) as unknown as ITableQuery<T>;
    },

    async rpc<T>(
      fn: string,
      params?: Record<string, unknown>,
    ): Promise<{ data: T | null; error: unknown }> {
      return supabase.rpc(fn as never, params as never) as unknown as Promise<{
        data: T | null;
        error: unknown;
      }>;
    },

    removeChannel(channel: unknown): Promise<void> {
      return supabase.removeChannel(channel as never) as unknown as Promise<void>;
    },
  };
}

/**
 * Internal query builder that wraps a Supabase PostgREST query.
 * Implements the fluent chain + thenable pattern.
 */
class SupabaseTableQuery<T> {
  private _builder: {
    select: (...args: unknown[]) => unknown;
    insert: (...args: unknown[]) => unknown;
    upsert: (...args: unknown[]) => unknown;
    update: (...args: unknown[]) => unknown;
    delete: (...args: unknown[]) => unknown;
    eq: (...args: unknown[]) => unknown;
    neq: (...args: unknown[]) => unknown;
    in: (...args: unknown[]) => unknown;
    like: (...args: unknown[]) => unknown;
    gt: (...args: unknown[]) => unknown;
    gte: (...args: unknown[]) => unknown;
    lt: (...args: unknown[]) => unknown;
    lte: (...args: unknown[]) => unknown;
    order: (...args: unknown[]) => unknown;
    limit: (...args: unknown[]) => unknown;
    maybeSingle: (...args: unknown[]) => unknown;
    single: (...args: unknown[]) => unknown;
  };

  // Track the current operation type for execution
  private _mode: "select" | "insert" | "upsert" | "update" | "delete" = "select";
  private _modeArgs: unknown[] = [];

  constructor(builder: unknown) {
    this._builder = builder as typeof this._builder;
  }

  // --- Initial operations that set the mode ---

  select(columns?: string): this;
  select(columns: string, opts?: Record<string, unknown>): this;
  select(columns?: string | Record<string, unknown>, opts?: Record<string, unknown>): this {
    this._mode = "select";
    if (opts) {
      // { count: 'exact', head: true } overload
      this._modeArgs = [columns || "*", opts];
    } else if (typeof columns === "object" && columns !== null && "count" in columns) {
      this._modeArgs = ["*", columns];
    } else {
      this._modeArgs = [columns || "*"];
    }
    return this;
  }

  insert(values: Partial<T> | Partial<T>[]): this;
  insert(values: Partial<T> | Partial<T>[], opts?: { select?: boolean }): this {
    this._mode = "insert";
    this._modeArgs = opts ? [values, opts] : [values];
    return this;
  }

  upsert(values: Partial<T> | Partial<T>[]): this;
  upsert(values: Partial<T> | Partial<T>[], opts?: { select?: boolean }): this {
    this._mode = "upsert";
    this._modeArgs = opts ? [values, opts] : [values];
    return this;
  }

  update(values: Partial<T>): this {
    this._mode = "update";
    this._modeArgs = [values];
    return this;
  }

  delete(): this {
    this._mode = "delete";
    this._modeArgs = [];
    return this;
  }

  // --- Filters and modifiers ---

  eq(column: string, value: unknown): this {
    this._builder = this._builder.eq(column, value) as typeof this._builder;
    return this;
  }

  like(column: string, pattern: string): this {
    this._builder = this._builder.like(column, pattern) as typeof this._builder;
    return this;
  }

  in(column: string, values: unknown[]): this {
    this._builder = this._builder.in(column, values) as typeof this._builder;
    return this;
  }

  neq(column: string, value: unknown): this {
    this._builder = this._builder.neq(column, value) as typeof this._builder;
    return this;
  }

  gt(column: string, value: unknown): this {
    this._builder = this._builder.gt(column, value) as typeof this._builder;
    return this;
  }

  gte(column: string, value: unknown): this {
    this._builder = this._builder.gte(column, value) as typeof this._builder;
    return this;
  }

  lt(column: string, value: unknown): this {
    this._builder = this._builder.lt(column, value) as typeof this._builder;
    return this;
  }

  lte(column: string, value: unknown): this {
    this._builder = this._builder.lte(column, value) as typeof this._builder;
    return this;
  }

  order(column: string, opts?: { ascending?: boolean }): this {
    const ascending = opts?.ascending ?? true;
    this._builder = this._builder.order(column, { ascending }) as typeof this._builder;
    return this;
  }

  limit(count: number): this {
    this._builder = this._builder.limit(count) as typeof this._builder;
    return this;
  }

  // --- Terminal operations ---

  async maybeSingle(): Promise<{ data: T | null; error: unknown }> {
    const result = await this._execute();
    if (result.error) return { data: null, error: result.error };
    const arr = result.data as T[] | null;
    return { data: arr?.[0] ?? null, error: null };
  }

  async single(): Promise<{ data: T; error: unknown }> {
    const b = this._builder as unknown as { single: () => Promise<{ data: T; error: unknown }> };
    return b.single();
  }

  // --- Thenable ---

  then<TResult1 = { data: T[] | null; error: unknown; count?: number }, TResult2 = never>(
    onfulfilled?:
      | ((value: { data: T[] | null; error: unknown; count?: number }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this._execute().then(onfulfilled, onrejected);
  }

  // --- Internal ---

  private async _execute(): Promise<{
    data: T[] | null;
    error: unknown;
    count?: number;
  }> {
    switch (this._mode) {
      case "select": {
        const result = await (
          this._builder.select as (
            ...args: unknown[]
          ) => Promise<{ data: T[] | null; error: unknown; count?: number }>
        )(...this._modeArgs);
        return result;
      }
      case "insert": {
        const result = await (
          this._builder.insert as (
            ...args: unknown[]
          ) => Promise<{ data: T[] | null; error: unknown }>
        )(...this._modeArgs);
        return result;
      }
      case "upsert": {
        const result = await (
          this._builder.upsert as (
            ...args: unknown[]
          ) => Promise<{ data: T[] | null; error: unknown }>
        )(...this._modeArgs);
        return result;
      }
      case "update": {
        const result = await (
          this._builder.update as (
            ...args: unknown[]
          ) => Promise<{ data: T[] | null; error: unknown }>
        )(...this._modeArgs);
        return result;
      }
      case "delete": {
        const result = await (
          this._builder.delete as () => Promise<{ data: T[] | null; error: unknown }>
        )();
        return result;
      }
      default:
        return { data: null, error: new Error(`Unknown query mode: ${this._mode}`) };
    }
  }
}
