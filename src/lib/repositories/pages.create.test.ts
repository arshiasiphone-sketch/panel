/**
 * End-to-end regression test for the page-builder "block not saved" bug.
 *
 * Reproduces the exact call chain used by the admin page builder:
 *   useCreateBlock -> repos.pages.create -> db.from("page_blocks").insert(...).select().maybeSingle()
 *
 * Before the fix, .select() rewrote the query from INSERT into a bare SELECT,
 * so nothing was persisted (yet the UI showed optimistic success + toast).
 * After the fix, the INSERT actually runs and the returned row is normalized
 * correctly (PostgREST returns a single object, not an array).
 */
import { describe, it, expect } from "vitest";
import { createSupabaseDatabaseProvider } from "@/lib/providers/supabase/database.provider";
import { PagesRepository } from "./pages";
import type { RepositoryDependencies } from "./base";
import { DEFAULT_WORKSPACE } from "@/lib/core/workspace/types";
import type { IDatabaseProvider } from "@/lib/interfaces/database";
import type { SupabaseClient } from "@supabase/supabase-js";

type FakePageBlock = {
  id: string;
  type: string;
  data: { title: string };
  sort_order: number;
  visible: boolean;
  workspace_id?: string;
};

function makeFakeSupabase() {
  const inserted: Record<string, unknown>[] = [];
  const row: FakePageBlock = {
    id: "generated-id",
    type: "hero",
    data: { title: "x" },
    sort_order: 0,
    visible: true,
  };

  const filterBuilder = {
    select: (..._a: unknown[]) => filterBuilder,
    single: () => Promise.resolve({ data: row, error: null }),
    maybeSingle: () => Promise.resolve({ data: row, error: null }),
    then: (onf: (v: { data: FakePageBlock[]; error: null }) => unknown) =>
      Promise.resolve({ data: [row], error: null }).then(onf),
  };
  const queryBuilder = {
    select: (..._a: unknown[]) => filterBuilder,
    insert: (values: Record<string, unknown>) => {
      inserted.push(values);
      return filterBuilder;
    },
  };
  const supabase = { from: () => queryBuilder } as unknown as SupabaseClient;
  return { supabase, inserted, row };
}

function makeDeps(db: IDatabaseProvider): RepositoryDependencies {
  return {
    database: db,
    storage: {} as RepositoryDependencies["storage"],
    auth: {} as RepositoryDependencies["auth"],
    realtime: {} as RepositoryDependencies["realtime"],
    workspace: { ...DEFAULT_WORKSPACE, workspaceId: "ws-1" },
  };
}

describe("PagesRepository.create (page builder save)", () => {
  it("persists a block and returns the inserted row", async () => {
    const { supabase, inserted, row } = makeFakeSupabase();
    const db = createSupabaseDatabaseProvider(supabase);
    const repo = new PagesRepository(makeDeps(db));

    const created = await repo.create({
      type: "hero",
      data: { title: "سلام" },
      sort_order: 0,
    });

    // The INSERT actually happened with the workspace_id stamped on.
    expect(inserted.length).toBe(1);
    expect(inserted[0]?.workspace_id).toBe("ws-1");
    // The returned row is the real DB row (normalized from single-object shape).
    expect(created).toEqual(row);
    expect(created.id).toBe("generated-id");
  });

  it("stamps workspace_id on the insert", async () => {
    const { supabase, inserted } = makeFakeSupabase();
    const db = createSupabaseDatabaseProvider(supabase);
    const repo = new PagesRepository(makeDeps(db));
    await repo.create({ type: "paragraph", data: { text: "hi" }, sort_order: 1 });
    expect(inserted[0]?.workspace_id).toBe("ws-1");
  });
});
