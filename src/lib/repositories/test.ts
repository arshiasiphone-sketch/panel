/**
 * Test repository — encapsulates test_responses table operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { PaginatedOptions } from "./base";
import type { Database, Json } from "@/integrations/supabase/types";
import type { PersonalityType } from "@/lib/test-data";
import type { UserInfo } from "@/lib/test-store";
import { testResponseSchema, testConfigSchema } from "@/lib/cms-schemas";

type TestResponseRow = Database["public"]["Tables"]["test_responses"]["Row"];
type TestResponseInsert = Database["public"]["Tables"]["test_responses"]["Insert"];

export interface StoredTestResponse {
  id: string;
  completedAt: string;
  answers: Record<number, string>;
  result: PersonalityType;
  tied: PersonalityType[];
  userInfo?: UserInfo;
}

export interface TestQuestionsConfig {
  overrides: Record<number, unknown>;
  orderedIds: number[] | null;
}

const TEST_RESPONSE_COLUMNS = "id,answers,result,tied,completed_at,user_full_name,user_phone,user_age,user_gender" as const;

export class TestRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async getResponses(opts?: PaginatedOptions): Promise<StoredTestResponse[]> {
    try {
      let query = this.db
        .from<TestResponseRow>("test_responses")
        .select(TEST_RESPONSE_COLUMNS)
        .order("completed_at", { ascending: false });
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map((r) => this._rowToResponse(r));
    } catch (err) {
      throw this.normalizeError("test_responses", "getResponses", err, { opts });
    }
  }

  async submitResponse(input: {
    answers: Record<number, string>;
    result: PersonalityType;
    tied: PersonalityType[];
    userInfo?: UserInfo;
  }): Promise<StoredTestResponse> {
    try {
      const validated = this.validateOrThrow(
        testResponseSchema,
        {
          answers: input.answers,
          result: input.result,
          tied: input.tied,
          user_full_name: input.userInfo?.fullName ?? "",
          user_phone: input.userInfo?.phone ?? "",
          user_age: input.userInfo?.age ?? null,
          user_gender: input.userInfo?.gender ?? "",
        },
        "test_responses",
      );

      const row: TestResponseInsert = {
        answers: validated.answers as unknown as Json,
        result: validated.result,
        tied: validated.tied,
        user_full_name: validated.user_full_name,
        user_phone: validated.user_phone,
        user_age: validated.user_age ?? null,
        user_gender: validated.user_gender,
      };
      const { data, error } = await this.db
        .from<TestResponseRow>("test_responses")
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      return this._rowToResponse(data);
    } catch (err) {
      throw this.normalizeError("test_responses", "submitResponse", err);
    }
  }

  async deleteResponse(id: string): Promise<void> {
    try {
      const { error } = await this.db.from("test_responses").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("test_responses", "deleteResponse", err, { id });
    }
  }

  async clearResponses(): Promise<void> {
    try {
      const { error } = await this.db
        .from("test_responses")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("test_responses", "clearResponses", err);
    }
  }

  async getQuestionsConfig(): Promise<{ overrides: Record<number, unknown>; orderedIds: number[] | null }> {
    try {
      const { data, error } = await this.db
        .from("site_content")
        .select("value")
        .eq("key", "test_questions")
        .maybeSingle();
      if (error) throw error;
      const EMPTY = { overrides: {}, orderedIds: null };
      if (!data?.value) return EMPTY;
      const v = data.value as Record<string, unknown>;
      return {
        overrides: (v.overrides as Record<number, unknown>) ?? {},
        orderedIds: (v.orderedIds as number[] | null) ?? null,
      };
    } catch (err) {
      throw this.normalizeError("site_content", "getQuestionsConfig", err);
    }
  }

  async updateQuestionsConfig(config: TestQuestionsConfig): Promise<void> {
    try {
      this.validateOrThrow(testConfigSchema, config, "test_questions");
      const { error } = await this.db.from("site_content").upsert({
        key: "test_questions",
        value: config as unknown as Record<string, unknown>,
      });
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("site_content", "updateQuestionsConfig", err);
    }
  }

  private _rowToResponse(row: TestResponseRow): StoredTestResponse {
    return {
      id: row.id,
      completedAt: row.completed_at,
      answers: (row.answers as Record<number, string>) ?? {},
      result: row.result as PersonalityType,
      tied: (row.tied ?? []) as PersonalityType[],
      userInfo:
        row.user_full_name || row.user_phone
          ? {
              fullName: row.user_full_name ?? "",
              phone: row.user_phone ?? "",
              age: row.user_age ?? 0,
              gender: row.user_gender ?? "",
            }
          : undefined,
    };
  }
}
