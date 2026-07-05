/**
 * Database provider interface for abstracting database operations.
 * Supports PostgreSQL-compatible backends (Supabase, Neon, etc.).
 */

export interface IDatabaseProvider {
  /**
   * Begin a query against a specific table.
   */
  from<T = Record<string, unknown>>(table: string): ITableQuery<T>;

  /**
   * Execute a stored procedure / RPC call.
   */
  rpc<T = unknown>(
    fn: string,
    params?: Record<string, unknown>,
  ): Promise<{ data: T | null; error: unknown }>;

  /**
   * Remove a realtime channel.
   */
  removeChannel(channel: unknown): Promise<void>;
}

/**
 * Fluent query builder that mirrors the Supabase PostgREST chain API.
 * Supports chaining filters and terminal methods.
 * Calling `.then()` (or `await`) executes the query.
 */
export interface ITableQuery<T> {
  // -- Initial query operations --
  select(columns?: string): this & { then: ITableQuery<T>["then"] };
  select(columns: string, opts: Record<string, unknown>): this & { then: ITableQuery<T>["then"] };
  /** Insert row(s). */
  insert(values: Partial<T> | Partial<T>[]): this & { then: ITableQuery<T>["then"] };
  /** Insert row(s) with select option. */
  insert(values: Partial<T> | Partial<T>[], opts: { select?: boolean }): this & { then: ITableQuery<T>["then"] };
  /** Upsert row(s). */
  upsert(values: Partial<T> | Partial<T>[]): this & { then: ITableQuery<T>["then"] };
  /** Upsert row(s) with select option. */
  upsert(values: Partial<T> | Partial<T>[], opts: { select?: boolean }): this & { then: ITableQuery<T>["then"] };
  /** Update row(s). */
  update(values: Partial<T>): this & { then: ITableQuery<T>["then"] };
  /** Delete row(s). */
  delete(): this & { then: ITableQuery<T>["then"] };

  // -- Filters and modifiers --
  /** Filter: column = value */
  eq(column: string, value: unknown): this;
  /** Filter: column != value */
  neq(column: string, value: unknown): this;
  /** Filter: column > value */
  gt(column: string, value: unknown): this;
  /** Filter: column >= value */
  gte(column: string, value: unknown): this;
  /** Filter: column < value */
  lt(column: string, value: unknown): this;
  /** Filter: column <= value */
  lte(column: string, value: unknown): this;
  /** Filter: column LIKE value (pattern matching). */
  like(column: string, pattern: string): this;
  /** Filter: column IN array of values. */
  in(column: string, values: unknown[]): this;
  /** Order results. */
  order(column: string, opts?: { ascending?: boolean }): this;
  /** Limit results. */
  limit(count: number): this;
  /** Range results (for pagination with offset). */
  range(from: number, to: number): this;

  // -- Terminal operations --
  /** Return a single row or null. */
  maybeSingle(): Promise<{ data: T | null; error: unknown }>;
  /** Return exactly one row or throw. */
  single(): Promise<{ data: T; error: unknown }>;

  // -- Thenable for `await` support --
  then<TResult1 = { data: T[] | null; error: unknown; count?: number }, TResult2 = never>(
    onfulfilled?:
      | ((value: { data: T[] | null; error: unknown; count?: number }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2>;
}
