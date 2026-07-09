/**
 * Testimonials repository — encapsulates testimonials table operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { PaginatedOptions } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { testimonialSchema } from "@/lib/cms-schemas";

type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];
type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"];

const SELECT_COLUMNS = "id,name,type,text,sort_order,visible,created_at,updated_at" as const;
const VISIBLE_COLUMNS = "id,name,type,text,sort_order,visible" as const;

export class TestimonialsRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async getAll(opts?: PaginatedOptions): Promise<TestimonialRow[]> {
    try {
      let query = this.withWorkspace(
        this.db
          .from<TestimonialRow>("testimonials")
          .select(SELECT_COLUMNS)
          .order("sort_order"),
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("testimonials", "getAll", err, { opts });
    }
  }

  async getVisible(opts?: PaginatedOptions): Promise<TestimonialRow[]> {
    try {
      let query = this.withWorkspace(
        this.db
          .from<TestimonialRow>("testimonials")
          .select(VISIBLE_COLUMNS)
          .eq("visible", true)
          .order("sort_order"),
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("testimonials", "getVisible", err, { opts });
    }
  }

  async upsert(row: Partial<TestimonialRow>): Promise<TestimonialRow | null> {
    try {
      const validated = this.validateOrThrow(testimonialSchema, row, "testimonials");
      const upsertData = this.workspaceId ? { ...validated, workspace_id: this.workspaceId } : validated;
      const { data, error } = await this.db
        .from<TestimonialRow>("testimonials")
        .upsert(upsertData as TestimonialInsert)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("testimonials", "upsert", err);
    }
  }

  /**
   * Batch delete testimonial entries by IDs.
   */
  async batchDelete(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("testimonials").delete().in("id", ids),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("testimonials", "batchDelete", err, { count: ids.length });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("testimonials").delete().eq("id", id),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("testimonials", "delete", err, { id });
    }
  }
}
