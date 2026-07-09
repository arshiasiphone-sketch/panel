/**
 * Menu repository — encapsulates menu_items table operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { PaginatedOptions, PaginatedResult } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { menuItemSchema } from "@/lib/cms-schemas";

type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];
type MenuItemInsert = Database["public"]["Tables"]["menu_items"]["Insert"];

const SELECT_COLUMNS = "id,category,name,description,price,image_url,sort_order,visible,created_at,updated_at" as const;

const VISIBLE_COLUMNS = "id,category,name,description,price,image_url,sort_order,visible" as const;

export class MenuRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async getAll(opts?: PaginatedOptions): Promise<MenuItemRow[]> {
    try {
      let query = this.withWorkspace(
        this.db
          .from<MenuItemRow>("menu_items")
          .select(SELECT_COLUMNS)
          .order("sort_order"),
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("menu_items", "getAll", err, { opts });
    }
  }

  async getVisible(opts?: PaginatedOptions): Promise<MenuItemRow[]> {
    try {
      let query = this.withWorkspace(
        this.db
          .from<MenuItemRow>("menu_items")
          .select(VISIBLE_COLUMNS)
          .eq("visible", true)
          .order("sort_order"),
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("menu_items", "getVisible", err, { opts });
    }
  }

  /**
   * Install menu items from blueprint data.
   * Uses upsert by stable key for idempotency.
   * Tracks created IDs in the resource map.
   */
  async installBlueprintMenuItems(
    menus: Array<{ category: string; name: string; description: string; price: string; imageUrl?: string; sortOrder: number }>,
    resourceMap?: import("../core/provision/session-context").ProvisionResourceMap,
  ): Promise<string[]> {
    const ids: string[] = [];

    for (const item of menus) {
      const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const upsertItem = {
        id,
        category: item.category,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.imageUrl ?? "",
        sort_order: item.sortOrder,
        visible: true,
      };
      if (this.workspaceId) (upsertItem as MenuItemInsert & { workspace_id?: string }).workspace_id = this.workspaceId;
      const { error } = await this.db.from("menu_items").upsert(upsertItem);

      if (error) {
        if ((error as { code?: string }).code === "23505") continue; // Already exists
        throw this.normalizeError("menu_items", "installBlueprintMenuItems", error);
      }
      ids.push(id);

      if (resourceMap) {
        resourceMap.menuItemIds.push(id);
      }
    }

    return ids;
  }

  async upsert(row: Partial<MenuItemRow>): Promise<MenuItemRow | null> {
    try {
      const validated = this.validateOrThrow(menuItemSchema, row, "menu_items");
      const upsertData = this.workspaceId ? { ...validated, workspace_id: this.workspaceId } : validated;
      const { data, error } = await this.db
        .from<MenuItemRow>("menu_items")
        .upsert(upsertData as MenuItemInsert)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("menu_items", "upsert", err);
    }
  }

  /**
   * Batch delete menu items by IDs.
   */
  async batchDelete(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("menu_items").delete().in("id", ids),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("menu_items", "batchDelete", err, { count: ids.length });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("menu_items").delete().eq("id", id),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("menu_items", "delete", err, { id });
    }
  }
}
