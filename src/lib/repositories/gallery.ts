/**
 * Gallery repository — encapsulates gallery_images table operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { PaginatedOptions } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { galleryImageSchema } from "@/lib/cms-schemas";

type GalleryRow = Database["public"]["Tables"]["gallery_images"]["Row"];
type GalleryInsert = Database["public"]["Tables"]["gallery_images"]["Insert"];

const SELECT_COLUMNS = "id,title,image_url,tags,sort_order,visible,created_at,updated_at" as const;
const VISIBLE_COLUMNS = "id,title,image_url,tags,sort_order,visible" as const;

export class GalleryRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async getAll(opts?: PaginatedOptions): Promise<GalleryRow[]> {
    try {
      let query = this.withWorkspace(
        this.db
          .from<GalleryRow>("gallery_images")
          .select(SELECT_COLUMNS)
          .order("sort_order"),
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("gallery_images", "getAll", err, { opts });
    }
  }

  async getVisible(opts?: PaginatedOptions): Promise<GalleryRow[]> {
    try {
      let query = this.withWorkspace(
        this.db
          .from<GalleryRow>("gallery_images")
          .select(VISIBLE_COLUMNS)
          .eq("visible", true)
          .order("sort_order"),
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("gallery_images", "getVisible", err, { opts });
    }
  }

  /**
   * Install gallery images from blueprint data.
   * Uses upsert by stable key for idempotency.
   * Tracks created IDs in the resource map.
   */
  async installBlueprintGallery(
    gallery: Array<{ title: string; tags: string[]; sortOrder: number }>,
    resourceMap?: import("../core/provision/session-context").ProvisionResourceMap,
  ): Promise<string[]> {
    const ids: string[] = [];

    for (const item of gallery) {
      const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const upsertItem = {
        id,
        title: item.title,
        image_url: "",
        tags: item.tags,
        sort_order: item.sortOrder,
        visible: true,
      };
      if (this.workspaceId) (upsertItem as GalleryInsert & { workspace_id?: string }).workspace_id = this.workspaceId;
      const { error } = await this.withWorkspace(
        this.db.from("gallery_images").upsert(upsertItem),
      );

      if (error) {
        if ((error as { code?: string }).code === "23505") continue;
        throw this.normalizeError("gallery_images", "installBlueprintGallery", error);
      }
      ids.push(id);

      if (resourceMap) {
        resourceMap.galleryImageIds.push(id);
      }
    }

    return ids;
  }

  async upsert(row: Partial<GalleryRow>): Promise<GalleryRow | null> {
    try {
      const validated = this.validateOrThrow(galleryImageSchema, row, "gallery_images");
      const upsertData = this.workspaceId ? { ...validated, workspace_id: this.workspaceId } : validated;
      const { data, error } = await this.withWorkspace(
        this.db
          .from<GalleryRow>("gallery_images")
          .upsert(upsertData as GalleryInsert)
          .select(),
      ).maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("gallery_images", "upsert", err);
    }
  }

  /**
   * Batch delete gallery images by IDs.
   */
  async batchDelete(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("gallery_images").delete().in("id", ids),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("gallery_images", "batchDelete", err, { count: ids.length });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("gallery_images").delete().eq("id", id),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("gallery_images", "delete", err, { id });
    }
  }
}
