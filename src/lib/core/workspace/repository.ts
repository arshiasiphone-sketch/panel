/**
 * NAMA Platform — Workspace Repository.
 *
 * Persists workspace entities via existing tables (site_content).
 * No database migrations required — uses the same pattern as CMS data.
 *
 * Each workspace is stored as a site_content row with key:
 *   workspace:{workspaceId}:entity
 *
 * This allows full multi-workspace support without schema changes.
 * When workspace_id columns are added to data tables later, the
 * BaseRepository's workspace filtering activates automatically.
 */

import { BaseRepository, type RepositoryDependencies } from "@/lib/repositories/base";
import type { WorkspaceEntity, WorkspaceContext } from "./types";
import { workspaceEntitySchema } from "./validation";
import { createDefaultWorkspace } from "./factory";

// ─── Storage key pattern ─────────────────────────────────────────────────────

const WS_KEY_PREFIX = "workspace:";
const WS_ENTITY_SUFFIX = ":entity";

function entityKey(workspaceId: string): string {
  return `${WS_KEY_PREFIX}${workspaceId}${WS_ENTITY_SUFFIX}`;
}

function workspaceIdFromKey(key: string): string | null {
  if (!key.startsWith(WS_KEY_PREFIX) || !key.endsWith(WS_ENTITY_SUFFIX)) return null;
  return key.slice(WS_KEY_PREFIX.length, -WS_ENTITY_SUFFIX.length);
}

// ─── Repository ──────────────────────────────────────────────────────────────

export class WorkspaceRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  /**
   * Find a workspace by ID.
   * Returns null if not found.
   */
  async findById(id: string): Promise<WorkspaceEntity | null> {
    try {
      return await this._loadEntity(id);
    } catch (err) {
      throw this.normalizeError("site_content", "workspace.findById", err, { id });
    }
  }

  /**
   * Save (create or update) a workspace entity.
   */
  async save(entity: WorkspaceEntity): Promise<void> {
    try {
      const validated = this.validateOrThrow(workspaceEntitySchema, entity, `workspace.save(${entity.id})`);
      const { error } = await this.db
        .from("site_content")
        .upsert({
          key: entityKey(entity.id),
          value: validated as Record<string, unknown>,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      this.logger.info(`Workspace saved: ${entity.id}`, { source: "workspace" });
    } catch (err) {
      throw this.normalizeError("site_content", "workspace.save", err, { id: entity.id });
    }
  }

  /**
   * Delete a workspace entity from storage.
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from("site_content")
        .delete()
        .eq("key", entityKey(id));
      if (error) throw error;
      this.logger.info(`Workspace deleted: ${id}`, { source: "workspace" });
    } catch (err) {
      throw this.normalizeError("site_content", "workspace.delete", err, { id });
    }
  }

  /**
   * List all stored workspaces.
   */
  async listAll(): Promise<WorkspaceEntity[]> {
    try {
      const { data, error } = await this.db
        .from("site_content")
        .select("value")
        .like("key", `${WS_KEY_PREFIX}%${WS_ENTITY_SUFFIX}`);
      if (error) throw error;
      if (!data) return [];

      return (data as Array<{ value: unknown }>)
        .map((row) => {
          const result = workspaceEntitySchema.safeParse(row.value);
          return result.success ? result.data : null;
        })
        .filter(Boolean) as WorkspaceEntity[];
    } catch (err) {
      throw this.normalizeError("site_content", "workspace.listAll", err);
    }
  }

  /**
   * Find workspaces a user belongs to.
   */
  async findByUserId(userId: string): Promise<WorkspaceEntity[]> {
    try {
      const all = await this.listAll();
      return all.filter((ws) =>
        ws.membership.some((m) => m.userId === userId),
      );
    } catch (err) {
      throw this.normalizeError("site_content", "workspace.findByUserId", err, { userId });
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
      throw this.normalizeError("site_content", "workspace.getOrCreateDefault", err, { userId });
    }
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private async _loadEntity(id: string): Promise<WorkspaceEntity | null> {
    const { data, error } = await this.db
      .from("site_content")
      .select("value")
      .eq("key", entityKey(id))
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const result = workspaceEntitySchema.safeParse(data.value);
    return result.success ? result.data : null;
  }
}
