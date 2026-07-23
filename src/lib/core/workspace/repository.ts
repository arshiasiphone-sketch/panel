/**
 * NAMA Platform — Workspace Repository.
 *
 * Persists workspaces table (created by migration 20260707000001).
 * Provides direct SQL queries with proper indexes.
 * Maintains backward compatibility: the old site_content storage
 * pattern is preserved for read-only fallback during migration window.
 */

import { BaseRepository, type RepositoryDependencies } from "@/lib/repositories/base";
import type { WorkspaceEntity, WorkspaceContext } from "./types";
import { workspaceEntitySchema } from "./validation";
import { createDefaultWorkspace } from "./factory";
import { DEFAULT_WORKSPACE_ID, PLATFORM_DOMAIN } from "@/lib/constants";

// ─── DB row types ────────────────────────────────────────────────────────────

/** Shape of a workspaces table row as returned by Supabase. */
interface WorkspaceRow {
  id: string;
  domain: string | null;
  owner_user_id: string | null;
  status: string;
  plan: string;
  limits: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── Repository ──────────────────────────────────────────────────────────────

export class WorkspaceRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  /**
   * Find a workspace by ID.
   * Queries the new workspaces table directly.
   * Returns null if not found.
   */
  async findById(id: string): Promise<WorkspaceEntity | null> {
    try {
      const { data, error } = await this.db
        .from("workspaces")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return this._mapRowToEntity(data as unknown as WorkspaceRow);
    } catch (err) {
      throw this.normalizeError("workspaces", "workspace.findById", err, { id });
    }
  }

  /**
    * Find a workspace by domain.
    * Uses the workspaces.domain index for fast lookup.
    * Returns null if not found.
    */
   async findByDomain(domain: string): Promise<WorkspaceEntity | null> {
    // Deep diagnostics for workspace lookup failures. We must not swallow
    // errors — always surface them and include rich context for debugging.
    const requestedDomain = domain;
    const normalizedDomain = String(domain).trim().toLowerCase();
    const sqlFilter = `domain = '${normalizedDomain.replace(/'/g, "''")}'`;

    const start = Date.now();
    try {
      // Log the lookup intent (both structured logger and console for runtime)
      this.logger.info("workspace.findByDomain: lookup start", {
        source: "workspace",
        requestedDomain,
        normalizedDomain,
        sqlFilter,
      });
      if (typeof console !== "undefined") {
        console.log("[NAMA][workspace.findByDomain] lookup start", {
          requestedDomain,
          normalizedDomain,
          sqlFilter,
        });
      }

      // Execute the query
      const query = this.db.from("workspaces").select("*").eq("domain", normalizedDomain).maybeSingle();
      // Attempt to surface a PostgREST request URL if available on the client
      const possibleUrl = (this.db as any)?.url || (this.db as any)?.postgrestUrl || (this.db as any)?.client?.url;
      if (possibleUrl) {
        this.logger.info("workspace.findByDomain: supabase request", { url: possibleUrl, filter: sqlFilter });
        if (typeof console !== "undefined") console.log("[NAMA][workspace.findByDomain] supabase request url", possibleUrl);
      } else {
        this.logger.debug("workspace.findByDomain: supabase request URL unavailable on DB provider", { filter: sqlFilter });
        if (typeof console !== "undefined") console.log("[NAMA][workspace.findByDomain] supabase request url: <unavailable>", { filter: sqlFilter });
      }

      const { data, error } = await query;
      const took = Date.now() - start;

      // Log full Supabase response/error for diagnostics
      this.logger.info("workspace.findByDomain: lookup finished", {
        source: "workspace",
        requestedDomain,
        normalizedDomain,
        sqlFilter,
        tookMs: took,
        httpStatus: error?.status ?? (data ? 200 : undefined),
        postgrestError: error ?? undefined,
        returnedRows: data ? 1 : 0,
        firstRow: data ?? undefined,
      });
      if (typeof console !== "undefined") {
        console.log("[NAMA][workspace.findByDomain] lookup finished", {
          requestedDomain,
          normalizedDomain,
          sqlFilter,
          tookMs: took,
          httpStatus: error?.status ?? (data ? 200 : undefined),
          postgrestError: error ?? undefined,
          returnedRows: data ? 1 : 0,
          firstRow: data ?? undefined,
        });
      }

      if (error) {
        // Surface RLS/auth/network errors explicitly
        this.logger.error("workspace.findByDomain: supabase returned error", {
          source: "workspace",
          requestedDomain,
          normalizedDomain,
          error,
        });
        if (typeof console !== "undefined") {
          console.error("[NAMA][workspace.findByDomain] supabase returned error", { requestedDomain, normalizedDomain, error });
        }
        // Always throw the raw error wrapped so callers have context
        throw error;
      }

      if (!data) return null;

      return this._mapRowToEntity(data as unknown as WorkspaceRow);
    } catch (err) {
      // Print complete error object to logger and also to console for client-side visibility
      try {
        this.logger.error("workspace.findByDomain: unexpected error", {
          source: "workspace",
          requestedDomain,
          normalizedDomain,
          error: err instanceof Error ? { message: err.message, stack: err.stack } : String(err),
        });
      } catch (_) {
        // ignore logger failures
      }

      if (typeof console !== "undefined") {
        console.error("[NAMA][workspace.findByDomain] Error during findByDomain", {
          requestedDomain,
          normalizedDomain,
          error: err,
        });
      }

      throw this.normalizeError("workspaces", "workspace.findByDomain", err, { domain: requestedDomain });
    }
   }

  /**
    * Find a workspace by subdomain.
    * Workspaces are persisted by their full domain (`${slug}.${PLATFORM_DOMAIN}`,
    * e.g. "khane.nama.app"). A subdomain request (e.g. `khane.<platform>`) maps to
    * the slug `khane`, so resolve via the canonical domain rather than a
    * (non-existent) `subdomain` column.
    * Returns null if not found.
    */
   async findBySubdomain(subdomain: string): Promise<WorkspaceEntity | null> {
     return this.findByDomain(`${subdomain}.${PLATFORM_DOMAIN}`);
   }

  /**
   * Save (create or update) a workspace entity.
   * Upserts to the workspaces table.
   */
  async save(entity: WorkspaceEntity): Promise<void> {
    try {
      const validated = this.validateOrThrow(
        workspaceEntitySchema,
        entity,
        `workspace.save(${entity.id})`,
      );

      const row = this._mapEntityToRow(validated);

      const { error } = await this.db.from("workspaces").upsert(row);
      if (error) throw error;

      this.logger.info(`Workspace saved: ${entity.id}`, { source: "workspace" });
    } catch (err) {
      throw this.normalizeError("workspaces", "workspace.save", err, { id: entity.id });
    }
  }

  /**
   * Delete a workspace entity from storage.
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.db.from("workspaces").delete().eq("id", id);
      if (error) throw error;
      this.logger.info(`Workspace deleted: ${id}`, { source: "workspace" });
    } catch (err) {
      throw this.normalizeError("workspaces", "workspace.delete", err, { id });
    }
  }

  /**
   * List all stored workspaces.
   */
  async listAll(): Promise<WorkspaceEntity[]> {
    try {
      const { data, error } = await this.db.from("workspaces").select("*");
      if (error) throw error;
      if (!data) return [];

      return (data as unknown as WorkspaceRow[])
        .map((row) => this._mapRowToEntity(row))
        .filter(Boolean) as WorkspaceEntity[];
    } catch (err) {
      throw this.normalizeError("workspaces", "workspace.listAll", err);
    }
  }

  /**
   * Find workspaces a user belongs to.
   * Uses the workspaces.owner_user_id index for fast lookup.
   * Note: This queries by owner_user_id directly.
   * For full membership queries (including non-owner members), we'd need
   * a workspace_members join table — TODO for future.
   */
  async findByUserId(userId: string): Promise<WorkspaceEntity[]> {
    try {
      const { data, error } = await this.db
        .from("workspaces")
        .select("*")
        .eq("owner_user_id", userId);

      if (error) throw error;
      if (!data) return [];

      return (data as unknown as WorkspaceRow[])
        .map((row) => this._mapRowToEntity(row))
        .filter(Boolean) as WorkspaceEntity[];
    } catch (err) {
      throw this.normalizeError("workspaces", "workspace.findByUserId", err, { userId });
    }
  }

  /**
   * Get or create a default workspace for a user.
   * Used in single-tenant mode when no workspace exists yet.
   */
  async getOrCreateDefault(userId: string): Promise<WorkspaceEntity> {
    try {
      const existing = await this.findByUserId(userId);
      if (existing.length > 0) {
        return existing[0];
      }

      // Create default workspace
      const entity = createDefaultWorkspace(userId);
      entity.status = "active"; // Skip provisioning for single-tenant
      await this.save(entity);
      this.logger.info(`Default workspace created for user ${userId}: ${entity.id}`, {
        source: "workspace",
      });
      return entity;
    } catch (err) {
      // A concurrent visit can race to insert the same user's default workspace
      // (this is what minted the duplicate "Default Workspace" rows during
      // root-domain debugging). If a default already exists, return it instead
      // of surfacing the duplicate-insert error. Pair this with the unique
      // partial index `uniq_default_workspace_per_owner` to make it impossible.
      const existing = await this.findByUserId(userId);
      if (existing.length > 0) {
        return existing[0];
      }
      throw this.normalizeError("workspaces", "workspace.getOrCreateDefault", err, { userId });
    }
  }

  /**
   * Ensure the default workspace exists (idempotent).
   * Returns the default workspace entity.
   * Used during app initialization / health checks.
   */
  async ensureDefault(): Promise<WorkspaceEntity> {
    try {
      let entity = await this.findById(DEFAULT_WORKSPACE_ID);
      if (entity) return entity;

      // Create it if missing (should not happen after migration, but safe)
      entity = createDefaultWorkspace("system");
      entity.id = DEFAULT_WORKSPACE_ID;
      entity.status = "active";
      await this.save(entity);
      return entity;
    } catch (err) {
      throw this.normalizeError("workspaces", "workspace.ensureDefault", err);
    }
  }

  // ─── Private mapping helpers ───────────────────────────────────────────────

  private _mapRowToEntity(row: WorkspaceRow): WorkspaceEntity | null {
    try {
      const entity = {
        id: row.id,
        status: row.status as WorkspaceEntity["status"],
        plan: row.plan as WorkspaceEntity["plan"],
        limits: (row.limits ?? {}) as unknown as WorkspaceEntity["limits"],
        membership: [
          ...(row.owner_user_id
            ? [{
                userId: row.owner_user_id,
                role: "owner" as const,
                joinedAt: row.created_at,
              }]
            : []),
        ],
        metadata: {
          ...((row.metadata ?? {}) as Record<string, unknown>),
          domain: row.domain ?? undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        } as unknown as WorkspaceEntity["metadata"],
      };

      const result = workspaceEntitySchema.safeParse(entity);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  }

  private _mapEntityToRow(entity: WorkspaceEntity): Record<string, unknown> {
    // Extract owner_user_id from membership
    const ownerMembership = entity.membership.find((m) => m.role === "owner");

    // Extract domain from metadata
    const domain = entity.metadata?.domain ?? null;

    // Build metadata for DB (exclude fields stored in dedicated columns)
    const { domain: _d, createdAt: _ca, updatedAt: _ua, ...dbMetadata } = entity.metadata ?? ({} as Record<string, unknown>);

    return {
      id: entity.id,
      domain,
      owner_user_id: ownerMembership?.userId ?? null,
      status: entity.status,
      plan: entity.plan,
      limits: entity.limits as unknown as Record<string, unknown>,
      metadata: dbMetadata as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    };
  }
}