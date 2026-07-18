/**
 * Regression test for the page-builder bug:
 *   insert(data).select().maybeSingle()
 * used to be silently rewritten into a plain SELECT because .select()
 * mutated _mode from "insert" back to "select". As a result blocks were
 * reported as saved (optimistic UI + toast) but never inserted into the DB.
 */
import { describe, it, expect } from "vitest";
import { createSupabaseDatabaseProvider } from "./database.provider";
import type { SupabaseClient } from "@supabase/supabase-js";

type FakeRow = { id: string; type: string; data: { title: string } };

/** Build a fake Supabase builder chain that records which ops ran. */
function makeFakeSupabase() {
  const calls: string[] = [];
  const row: FakeRow = { id: "abc", type: "hero", data: { title: "x" } };

  // The terminal builder returned by .insert()/.update()/.select()
  const filterBuilder = {
    select: (...a: unknown[]) => {
      calls.push("select:" + JSON.stringify(a));
      return filterBuilder;
    },
    single: () => {
      calls.push("single");
      // Supabase returns the single object directly, not an array.
      return Promise.resolve({ data: row, error: null });
    },
    maybeSingle: () => {
      calls.push("maybeSingle");
      // Supabase returns the single object directly (or null), not an array.
      return Promise.resolve({ data: row, error: null });
    },
    // thenable so `await` works
    then: (onfulfilled: (value: { data: FakeRow[]; error: null }) => unknown) =>
      Promise.resolve({ data: [row], error: null }).then(onfulfilled),
  };

  const queryBuilder = {
    select: (...a: unknown[]) => {
      calls.push("select:" + JSON.stringify(a));
      return filterBuilder;
    },
    insert: (...a: unknown[]) => {
      calls.push("insert:" + JSON.stringify(a));
      return filterBuilder;
    },
    upsert: (...a: unknown[]) => {
      calls.push("upsert:" + JSON.stringify(a));
      return filterBuilder;
    },
    update: (...a: unknown[]) => {
      calls.push("update:" + JSON.stringify(a));
      return filterBuilder;
    },
    delete: () => {
      calls.push("delete");
      return filterBuilder;
    },
  };

  const supabase = {
    from: (table: string) => {
      calls.push("from:" + table);
      return queryBuilder;
    },
  } as unknown as SupabaseClient;

  return { supabase, calls, row };
}

describe("SupabaseTableQuery write + returning select", () => {
  it("insert().select().maybeSingle() actually runs the insert", async () => {
    const { supabase, calls, row } = makeFakeSupabase();
    const db = createSupabaseDatabaseProvider(supabase);
    const result = await db.from("page_blocks").insert({ type: "hero" }).select().maybeSingle();
    expect(calls).toContainEqual(expect.stringContaining("insert:"));
    expect(calls.some((c) => c.startsWith("insert:"))).toBe(true);
    // insert must run BEFORE any select
    const insertIdx = calls.findIndex((c) => c.startsWith("insert:"));
    const selectIdx = calls.findIndex((c) => c.startsWith("select:"));
    expect(insertIdx).toBeGreaterThanOrEqual(0);
    expect(selectIdx).toBeGreaterThan(insertIdx);
    expect(result.data).toEqual(row);
    expect(result.error).toBeNull();
  });

  it("update().eq().select().single() runs the update, not a bare select", async () => {
    const { supabase, calls, row } = makeFakeSupabase();
    const db = createSupabaseDatabaseProvider(supabase);
    const result = await db
      .from("page_blocks")
      .update({ visible: false })
      .eq("id", "abc")
      .select()
      .single();
    expect(calls.some((c) => c.startsWith("update:"))).toBe(true);
    const updateIdx = calls.findIndex((c) => c.startsWith("update:"));
    const selectIdx = calls.findIndex((c) => c.startsWith("select:"));
    expect(selectIdx).toBeGreaterThan(updateIdx);
    expect(result.data).toEqual(row);
  });

  it("plain select() still behaves as a read", async () => {
    const { supabase, calls } = makeFakeSupabase();
    const db = createSupabaseDatabaseProvider(supabase);
    await db.from("page_blocks").select("id,type");
    const selectIdx = calls.findIndex((c) => c.startsWith("select:"));
    // no insert before the select
    const insertIdx = calls.findIndex((c) => c.startsWith("insert:"));
    expect(insertIdx).toBe(-1);
    expect(selectIdx).toBeGreaterThanOrEqual(0);
  });
});
