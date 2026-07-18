/**
 * Supabase implementation of IDatabaseProvider.
 * Wraps the Supabase PostgREST client behind the provider interface.
 * All current query logic is preserved — only the transport layer is abstracted.
 *
 * IMPORTANT: modifier methods (.order, .limit, .eq, etc.) must be deferred
 * because they only exist on PostgrestFilterBuilder (returned by .select())
 * and NOT on PostgrestQueryBuilder (returned by supabase.from()).
 */

import type { IDatabaseProvider, ITableQuery } from "@/lib/interfaces/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a database provider backed by Supabase.
 * This is the ONLY file that should import/create Supabase clients for DB operations.
 */
export function createSupabaseDatabaseProvider(supabase: SupabaseClient): IDatabaseProvider {
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

// ─── Deferred operation descriptor ──────────────────────────────────────

type DeferredOp = {
  method: string;
  args: unknown[];
};

/**
 * Internal query builder that wraps a Supabase PostgREST query.
 * Implements the fluent chain + thenable pattern.
 *
 * Modifier calls (.order, .limit, .eq, etc.) are queued and applied
 * at execution time, AFTER the initial .select() / .insert() / etc. call,
 * since those methods only exist on PostgrestFilterBuilder (the return
 * value of .select()), not on PostgrestQueryBuilder (supabase.from()).
 */
class SupabaseTableQuery<T> {
  // The initial builder (PostgrestQueryBuilder or PostgrestFilterBuilder).
  // Must have at minimum: select, insert, upsert, update, delete.
  private _builder: {
    select: (...args: unknown[]) => unknown;
    insert: (...args: unknown[]) => unknown;
    upsert: (...args: unknown[]) => unknown;
    update: (...args: unknown[]) => unknown;
    delete: (...args: unknown[]) => unknown;
  };

  // Track the current operation type for execution
  private _mode: "select" | "insert" | "upsert" | "update" | "delete" = "select";
  private _modeArgs: unknown[] = [];

  // Deferred modifier operations — applied AFTER the initial mode call
  // in _execute(). This is necessary because .order(), .limit(), .eq()
  // etc. only exist on PostgrestFilterBuilder (returned by .select()),
  // not on the initial PostgrestQueryBuilder.
  private _modifiers: DeferredOp[] = [];

  constructor(builder: unknown) {
    this._builder = builder as typeof this._builder;
  }

  // --- Initial operations that set the mode ---

  select(columns?: string): this;
  select(columns: string, opts?: Record<string, unknown>): this;
  select(columns?: string | Record<string, unknown>, opts?: Record<string, unknown>): this {
    // When .select() follows a write operation (insert/update/upsert/delete),
    // it is a RETURNING clause — NOT a standalone SELECT. Do NOT mutate _mode,
    // otherwise the write silently becomes a plain SELECT and nothing is
    // persisted (bug: blocks saved with optimistic success but never inserted).
    if (this._mode !== "select") {
      this._modifiers.push({ method: "select", args: [columns || "*"] });
      return this;
    }
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

  // --- Filters and modifiers (deferred) ---

  eq(column: string, value: unknown): this {
    this._modifiers.push({ method: "eq", args: [column, value] });
    return this;
  }

  like(column: string, pattern: string): this {
    this._modifiers.push({ method: "like", args: [column, pattern] });
    return this;
  }

  in(column: string, values: unknown[]): this {
    this._modifiers.push({ method: "in", args: [column, values] });
    return this;
  }

  neq(column: string, value: unknown): this {
    this._modifiers.push({ method: "neq", args: [column, value] });
    return this;
  }

  gt(column: string, value: unknown): this {
    this._modifiers.push({ method: "gt", args: [column, value] });
    return this;
  }

  gte(column: string, value: unknown): this {
    this._modifiers.push({ method: "gte", args: [column, value] });
    return this;
  }

  lt(column: string, value: unknown): this {
    this._modifiers.push({ method: "lt", args: [column, value] });
    return this;
  }

  lte(column: string, value: unknown): this {
    this._modifiers.push({ method: "lte", args: [column, value] });
    return this;
  }

  order(column: string, opts?: { ascending?: boolean }): this {
    const ascending = opts?.ascending ?? true;
    this._modifiers.push({ method: "order", args: [column, { ascending }] });
    return this;
  }

  limit(count: number): this {
    this._modifiers.push({ method: "limit", args: [count] });
    return this;
  }

  // --- Terminal operations ---

  async maybeSingle(): Promise<{ data: T | null; error: unknown }> {
    // .maybeSingle() is pushed as a modifier and applied by _applyModifiers
    // during _execute — delegate to the chain.
    this._modifiers.push({ method: "maybeSingle", args: [] });
    const result = await this._execute();
    if (result.error) return { data: null, error: result.error };
    // PostgREST returns a single object for .maybeSingle()/.single() (with the
    // `vnd.pgrst.object` header), NOT an array. It only returns an array when
    // .maybeSingle() is NOT in the chain. Normalize both shapes so the caller
    // always gets the row (or null), never an accidental `undefined → null`.
    const raw = result.data as T | T[] | null;
    if (raw == null) return { data: null, error: null };
    const single = Array.isArray(raw) ? (raw[0] ?? null) : raw;
    return { data: single, error: null };
  }

  async single(): Promise<{ data: T; error: unknown }> {
    this._modifiers.push({ method: "single", args: [] });
    const result = await this._execute();
    return result as unknown as { data: T; error: unknown };
  }

  // --- Thenable ---

  then<TResult1 = { data: T[] | null; error: unknown; count?: number }, TResult2 = never>(
    onfulfilled?:
      | ((value: {
          data: T[] | null;
          error: unknown;
          count?: number;
        }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this._execute().then(onfulfilled, onrejected);
  }

  // --- Internal ---

  /**
   * Apply deferred modifier operations on a builder chain.
   * This is used after the initial .select()/.insert() etc. call
   * to apply .order(), .limit(), .eq(), etc.
   *
   * Terminal methods like .single() are handled at the end of _execute().
   */
  private _applyModifiers(builder: unknown): unknown {
    let current = builder as Record<string, (...args: unknown[]) => unknown>;
    for (const op of this._modifiers) {
      const fn = current[op.method];
      if (typeof fn !== "function") {
        // Unknown method — skip (caller will handle)
        continue;
      }
      // Use .call() to preserve the `this` context of the builder chain
      // Without this, methods like .order() lose access to `this.url`
      current = fn.call(current, ...op.args) as Record<string, (...args: unknown[]) => unknown>;
    }
    return current;
  }

  private async _execute(): Promise<{
    data: T[] | null;
    error: unknown;
    count?: number;
  }> {
    switch (this._mode) {
      case "select": {
        // Step 1: call .select() on the initial builder (PostgrestQueryBuilder)
        // This returns a PostgrestFilterBuilder (or PostgrestMaybeSingleBuilder etc.)
        let query: unknown = this._builder.select(...this._modeArgs);

        // Step 2: apply deferred modifiers (.order, .limit, .eq, etc.) on the filter builder
        query = this._applyModifiers(query);

        // Step 3: await the result (the builder is thenable)
        const result = await (query as Promise<{
          data: T[] | null;
          error: unknown;
          count?: number;
        }>);
        return result;
      }
      case "insert": {
        let query: unknown = this._builder.insert(...this._modeArgs);
        query = this._applyModifiers(query);
        const result = await (query as Promise<{
          data: T[] | null;
          error: unknown;
        }>);
        return result;
      }
      case "upsert": {
        let query: unknown = this._builder.upsert(...this._modeArgs);
        query = this._applyModifiers(query);
        const result = await (query as Promise<{
          data: T[] | null;
          error: unknown;
        }>);
        return result;
      }
      case "update": {
        let query: unknown = this._builder.update(...this._modeArgs);
        query = this._applyModifiers(query);
        const result = await (query as Promise<{
          data: T[] | null;
          error: unknown;
        }>);
        return result;
      }
      case "delete": {
        let query: unknown = this._builder.delete(...this._modeArgs);
        query = this._applyModifiers(query);
        const result = await (query as Promise<{
          data: T[] | null;
          error: unknown;
        }>);
        return result;
      }
      default:
        return { data: null, error: new Error(`Unknown query mode: ${this._mode}`) };
    }
  }
}
