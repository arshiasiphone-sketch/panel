/**
 * Base repository class providing workspace awareness, pagination support,
 * validation helpers, and shared utilities.
 *
 * All domain repositories extend this class.
 */

import type { IDatabaseProvider, IStorageProvider, IAuthProvider, IRealtimeProvider, ITableQuery } from "@/lib/interfaces";
// Import from the types file directly (not the barrel) to avoid circular
// dependency: core/workspace → repository → base → core/workspace (barrel)
import { DEFAULT_WORKSPACE, type WorkspaceContext } from "@/lib/core/workspace/types";
import type { ILogger } from "@/lib/logger";
import { getLogger } from "@/lib/logger";
import { BaseAppError, RepositoryError, ValidationError } from "@/lib/errors";
import type { ZodSchema } from "zod";

// ─── Pagination ─────────────────────────────────────────────────────────

/** Optional pagination parameters for repository list methods. */
export interface PaginatedOptions {
  /** Maximum number of rows to return. */
  limit?: number;
  /** Number of rows to skip before returning results. */
  offset?: number;
}

/** Result wrapper for paginated queries. */
export interface PaginatedResult<T> {
  data: T[];
  count?: number;
}

// ─── Dependencies ────────────────────────────────────────────────────────────

/**
 * Repository dependencies injected via constructor.
 * This is the Dependency Injection contract for repositories.
 */
export interface RepositoryDependencies {
  database: IDatabaseProvider;
  storage: IStorageProvider;
  auth: IAuthProvider;
  realtime: IRealtimeProvider;
  workspace?: WorkspaceContext;
  /** Optional logger — defaults to ConsoleLogger. */
  logger?: ILogger;
}

export { DEFAULT_WORKSPACE };
export type { WorkspaceContext };

// ─── Base repository ─────────────────────────────────────────────────────────

/**
 * Base repository with workspace awareness, logging, and shared utilities.
 */
export abstract class BaseRepository {
  protected readonly db: IDatabaseProvider;
  protected readonly storage: IStorageProvider;
  protected readonly auth: IAuthProvider;
  protected readonly realtime: IRealtimeProvider;
  protected readonly logger: ILogger;
  protected workspace: WorkspaceContext;

  constructor(deps: RepositoryDependencies) {
    this.db = deps.database;
    this.storage = deps.storage;
    this.auth = deps.auth;
    this.realtime = deps.realtime;
    this.workspace = deps.workspace ?? DEFAULT_WORKSPACE;
    this.logger = deps.logger ?? getLogger();
  }

  /**
   * Set the workspace context for this repository.
   */
  setWorkspace(workspace: WorkspaceContext): void {
    this.workspace = workspace;
  }

  /**
   * Get the current workspace ID.
   */
  protected get workspaceId(): string | undefined {
    return this.workspace.workspaceId;
  }

  /**
   * Apply workspace filter to a query. Mutates query in-place via .eq().
   * No-op if workspaceId is undefined (e.g. system-level queries).
   */
  protected withWorkspace<T>(query: ITableQuery<T>, column = "workspace_id"): ITableQuery<T> {
    if (this.workspaceId) {
      return query.eq(column, this.workspaceId);
    }
    return query;
  }

  // ─── Validation helpers ───────────────────────────────────────────────────

  /**
   * Validate input data against a Zod schema and return the parsed result.
   * Throws `ValidationError` if validation fails.
   */
  protected validateOrThrow<T>(schema: ZodSchema<T>, data: unknown, target: string): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      const issues = result.error.issues.map((i) => ({
        path: i.path.join(".") || "(root)",
        message: i.message,
      }));
      this.logger.warn(`Validation failed for ${target}`, { issues });
      throw new ValidationError(target, issues);
    }
    return result.data;
  }

  // ─── Error normalization ──────────────────────────────────────────────────

  /**
   * Wrap a provider error into a typed RepositoryError.
   * Use this in every catch block so callers always receive BaseAppError subclasses.
   */
  protected normalizeError(
    table: string,
    operation: string,
    err: unknown,
    context?: Record<string, unknown>,
  ): RepositoryError {
    if (err instanceof RepositoryError) return err;
    // Re-throw typed errors (ValidationError, AuthError, etc.) instead of wrapping
    if (err instanceof BaseAppError) throw err;
    return new RepositoryError(table, operation, {
      cause: err,
      context: { ...context, workspaceId: this.workspaceId },
    });
  }

  // ─── Pagination helper ────────────────────────────────────────────────────

  /**
   * Apply optional pagination to a query.
   * No-op if opts is undefined or empty — maintains backward compatibility.
   *
   * @example
   *   const query = this.db.from<T>("my_table").select("*");
   *   const paginated = this.applyPagination(query, opts);
   */
  protected applyPagination<T>(
    query: ITableQuery<T>,
    opts?: PaginatedOptions,
  ): ITableQuery<T> {
    if (!opts) return query;
    if (opts.offset !== undefined && opts.limit !== undefined) {
      return query.range(opts.offset, opts.offset + opts.limit - 1);
    }
    if (opts.limit !== undefined) {
      return query.limit(opts.limit);
    }
    return query;
  }
}
