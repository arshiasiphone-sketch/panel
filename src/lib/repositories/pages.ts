/**
 * Pages repository — encapsulates page_blocks table operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { PaginatedOptions } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { blockSchema } from "@/lib/cms-schemas";
import { stableStringify, computeBlockKeyHash } from "@/lib/hash-utils";

type PageBlockRow = Database["public"]["Tables"]["page_blocks"]["Row"];
type PageBlockInsert = Database["public"]["Tables"]["page_blocks"]["Insert"];
type PageBlockUpdate = Database["public"]["Tables"]["page_blocks"]["Update"];

const SELECT_COLUMNS = "id,type,data,sort_order,visible,created_at,updated_at" as const;

export class PagesRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async getAll(opts?: PaginatedOptions): Promise<PageBlockRow[]> {
    try {
      let query = this.db
        .from<PageBlockRow>("page_blocks")
        .select(SELECT_COLUMNS)
        .order("sort_order");
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("page_blocks", "getAll", err, { opts });
    }
  }

  /**
   * Install page blocks from blueprint data.
   * Uses deterministic hash-based keys for idempotency.
   * Tracks created IDs in the resource map.
   */
  async installBlueprintPages(
    pages: Array<{ key: string; title: string; blockKeys: string[] }>,
    blocks: Array<{ key: string; type: string; data: Record<string, unknown>; sortOrder: number }>,
    resourceMap?: import("../core/provision/session-context").ProvisionResourceMap,
  ): Promise<{ blockIds: string[] }> {
    const blockIds: string[] = [];
    const blockMap = new Map<string, (typeof blocks)[0]>();
    for (const bd of blocks) {
      blockMap.set(bd.key, bd);
    }

    for (const page of pages) {
      for (const blockKey of page.blockKeys) {
        const blockDef = blockMap.get(blockKey);
        if (!blockDef) continue;

        const blockKeyHash = await computeBlockKeyHash(page.key, blockDef.type, blockDef.data);

        // Check if this block already exists — idempotent
        const exists = await this._blockExistsByKeyHash(blockKeyHash);
        if (exists) continue;

        const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const insert = {
          id,
          type: blockDef.type,
          data: {
            ...blockDef.data,
            block_key_hash: blockKeyHash,
            pageKey: page.key,
            pageTitle: page.title,
          } as Record<string, unknown>,
          sort_order: blockDef.sortOrder,
          visible: true,
        };

        const { error } = await this.db.from("page_blocks").insert(insert as PageBlockInsert);
        if (error) throw this.normalizeError("page_blocks", "installBlueprintPages", error);
        blockIds.push(id);

        if (resourceMap) {
          resourceMap.pageBlockIds.push(id);
        }
      }
    }

    return { blockIds };
  }

  async create(input: { type: string; data: Record<string, unknown>; sort_order: number }): Promise<PageBlockRow | null> {
    try {
      const validated = this.validateOrThrow(blockSchema, { ...input, visible: true }, "page_blocks.create");
      const { data, error } = await this.db
        .from<PageBlockRow>("page_blocks")
        .insert(validated as PageBlockInsert)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("page_blocks", "create", err);
    }
  }

  async update(id: string, patch: Partial<PageBlockUpdate>): Promise<void> {
    try {
      const { error } = await this.db
        .from("page_blocks")
        .update(patch as PageBlockUpdate)
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("page_blocks", "update", err, { id });
    }
  }

  /**
   * Batch delete page blocks by IDs.
   */
  async batchDelete(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    try {
      const { error } = await this.db.from("page_blocks").delete().in("id", ids);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("page_blocks", "batchDelete", err, { count: ids.length });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.db.from("page_blocks").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("page_blocks", "delete", err, { id });
    }
  }

  async reorder(orderedIds: string[]): Promise<void> {
    try {
      const results = await Promise.all(
        orderedIds.map((id, idx) =>
          this.db.from("page_blocks").update({ sort_order: idx } as PageBlockUpdate).eq("id", id),
        ),
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    } catch (err) {
      throw this.normalizeError("page_blocks", "reorder", err);
    }
  }

  // ─── Private helpers for deterministic dedup ───────────────────────────

  /**
   * Check if a block with a given hash already exists.
   */

  /**
   * Check if a block with a given hash already exists.
   */
  private async _blockExistsByKeyHash(blockKeyHash: string): Promise<boolean> {
    const { data } = await this.db
      .from("page_blocks")
      .select("id")
      .eq("data->>block_key_hash", blockKeyHash)
      .maybeSingle();
    return !!data;
  }
}
