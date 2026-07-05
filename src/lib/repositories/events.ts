/**
 * Events repository — encapsulates events table operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { PaginatedOptions } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { eventSchema } from "@/lib/cms-schemas";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

const SELECT_COLUMNS = "id,title,description,date_label,image_url,sort_order,visible,created_at,updated_at" as const;
const VISIBLE_COLUMNS = "id,title,description,date_label,image_url,sort_order,visible" as const;

export class EventsRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async getAll(opts?: PaginatedOptions): Promise<EventRow[]> {
    try {
      let query = this.db
        .from<EventRow>("events")
        .select(SELECT_COLUMNS)
        .order("sort_order");
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("events", "getAll", err, { opts });
    }
  }

  async getVisible(opts?: PaginatedOptions): Promise<EventRow[]> {
    try {
      let query = this.db
        .from<EventRow>("events")
        .select(VISIBLE_COLUMNS)
        .eq("visible", true)
        .order("sort_order");
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("events", "getVisible", err, { opts });
    }
  }

  async upsert(row: Partial<EventRow>): Promise<EventRow | null> {
    try {
      const validated = this.validateOrThrow(eventSchema, row, "events");
      const { data, error } = await this.db
        .from<EventRow>("events")
        .upsert(validated as EventInsert)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("events", "upsert", err);
    }
  }

  /**
   * Batch delete event entries by IDs.
   */
  async batchDelete(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    try {
      const { error } = await this.db.from("events").delete().in("id", ids);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("events", "batchDelete", err, { count: ids.length });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.db.from("events").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("events", "delete", err, { id });
    }
  }
}
