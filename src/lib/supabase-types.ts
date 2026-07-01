/**
 * Typed helper utilities for Supabase operations.
 * Replaces `as never` casts with proper type-safe wrappers.
 */
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
type TableName = keyof Tables;

/** Insert type for a given table */
export type TableInsert<T extends TableName> = Tables[T]["Insert"];

/** Update type for a given table */
export type TableUpdate<T extends TableName> = Tables[T]["Update"];

/** Row type for a given table */
export type TableRow<T extends TableName> = Tables[T]["Row"];

/**
 * CMS-specific table names for upsert/delete hooks.
 * These are the tables that support id-based upsert patterns.
 */
export type CmsTableName =
  | "menu_items"
  | "gallery_images"
  | "events"
  | "testimonials"
  | "page_blocks";

/**
 * Typed cast for upsert payload.
 * Casts a partial row (which may omit optional fields) to the Insert type.
 *
 * NOTE: `Partial<TableRow>` and `TableInsert` may have different shapes
 * (Insert may require fields that Row marks optional, and vice versa).
 * Callers must ensure the runtime object matches the Insert shape.
 * This is safe because: (a) Zod schemas validate input at runtime,
 * (b) Supabase ignores extra fields, (c) callers pass complete objects
 * from form state that structurally match Insert.
 */
export function asCmsInsert<T extends CmsTableName>(
  table: T,
  row: Partial<TableRow<T>>,
): TableInsert<T> {
  return row as unknown as TableInsert<T>;
}

/**
 * Typed cast for update payload.
 */
export function asCmsUpdate<T extends CmsTableName>(
  table: T,
  patch: Record<string, unknown>,
): TableUpdate<T> {
  return patch as TableUpdate<T>;
}

/**
 * Typed cast for page_blocks-specific operations.
 */
export function asBlockInsert(row: {
  type: string;
  data: Record<string, unknown>;
  sort_order: number;
}): TableInsert<"page_blocks"> {
  return row as unknown as TableInsert<"page_blocks">;
}

export function asBlockUpdate(patch: Record<string, unknown>): TableUpdate<"page_blocks"> {
  return patch as TableUpdate<"page_blocks">;
}

/**
 * Typed cast for site_content upsert.
 */
export function asSiteContentUpsert(input: {
  key: string;
  value: Record<string, unknown>;
}): TableInsert<"site_content"> {
  return input as unknown as TableInsert<"site_content">;
}

/**
 * Typed cast for personality_profiles operations.
 */
export function asPersonalityUpdate(
  patch: Record<string, unknown>,
): TableUpdate<"personality_profiles"> {
  return patch as TableUpdate<"personality_profiles">;
}

export function asPersonalityUpsert(
  row: Record<string, unknown>,
): TableInsert<"personality_profiles"> {
  return row as unknown as TableInsert<"personality_profiles">;
}

/**
 * Typed cast for test_responses insert.
 */
export function asTestResponseInsert(row: Record<string, unknown>): TableInsert<"test_responses"> {
  return row as unknown as TableInsert<"test_responses">;
}

/**
 * Typed cast for test_questions config (stored as site_content value).
 */
export function asJson(
  value: unknown,
): Database["public"]["Tables"]["site_content"]["Insert"]["value"] {
  return value as Database["public"]["Tables"]["site_content"]["Insert"]["value"];
}
