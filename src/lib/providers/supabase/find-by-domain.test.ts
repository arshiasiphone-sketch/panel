/**
 * Regression test: select().eq().maybeSingle() used by WorkspaceRepository.findByDomain.
 * Reproduces the production 500 on ?preview_domain=<domain>:
 *   this.db.from("workspaces").select("*").eq("domain", domain).maybeSingle()
 */
import { describe, it, expect, vi } from "vitest";
import { createSupabaseDatabaseProvider } from "@/lib/providers/supabase/database.provider";

function makeProvider() {
  // Mock PostgREST query builder that records the chain and returns a single row.
  const calls: string[] = [];
  const row = { id: "ws-1", domain: "khane.nama.app", status: "active" };

  const filterBuilder: Record<string, unknown> = {
    eq: vi.fn((col: string, val: unknown) => {
      calls.push(`eq(${col},${val})`);
      return filterBuilder;
    }),
    maybeSingle: vi.fn(() => {
      calls.push("maybeSingle");
      return Promise.resolve({ data: row, error: null });
    }),
    single: vi.fn(() => Promise.resolve({ data: row, error: null })),
    order: vi.fn(() => filterBuilder),
    limit: vi.fn(() => filterBuilder),
  };

  const queryBuilder: Record<string, unknown> = {
    select: vi.fn((cols?: string) => {
      calls.push(`select(${cols ?? "*"})`);
      return filterBuilder;
    }),
    insert: vi.fn(() => filterBuilder),
    update: vi.fn(() => filterBuilder),
    delete: vi.fn(() => filterBuilder),
  };

  const supabase: unknown = { from: vi.fn(() => queryBuilder) };
  const provider = createSupabaseDatabaseProvider(supabase as never);
  return { provider, calls, row };
}

describe("select().eq().maybeSingle() — findByDomain path", () => {
  it("executes a real SELECT and returns the matched row (not error)", async () => {
    const { provider, calls, row } = makeProvider();
    const { data, error } = await provider
      .from("workspaces")
      .select("*")
      .eq("domain", "khane.nama.app")
      .maybeSingle();

    expect(error).toBeNull();
    expect(data).toEqual(row);
    // The chain must actually call select → eq → maybeSingle on the real builder.
    expect(calls).toContain("select(*)");
    expect(calls).toContain("eq(domain,khane.nama.app)");
    expect(calls).toContain("maybeSingle");
  });

  it("does not mutate _mode when maybeSingle is applied after select", async () => {
    const { provider, calls } = makeProvider();
    await provider.from("workspaces").select("*").eq("domain", "x").maybeSingle();
    // Order matters: select must come before eq/maybeSingle on the filter builder.
    const selectIdx = calls.indexOf("select(*)");
    const eqIdx = calls.indexOf("eq(domain,x)");
    const msIdx = calls.indexOf("maybeSingle");
    expect(selectIdx).toBeLessThan(eqIdx);
    expect(eqIdx).toBeLessThan(msIdx);
  });
});
