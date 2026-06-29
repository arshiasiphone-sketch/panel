import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { TestQuestionsConfig } from "./test-questions";
import { EMPTY_TEST_QUESTIONS } from "./test-questions";
import type { PersonalityType } from "./test-data";
import type { UserInfo } from "./test-store";
import { beginOptimisticUpdate, rollbackOptimisticUpdate, touchLocalCmsEdit } from "./cms-sync";

type TestResponseRow = Database["public"]["Tables"]["test_responses"]["Row"];
type TestResponseInsert = Database["public"]["Tables"]["test_responses"]["Insert"];

export type StoredTestResponse = {
  id: string;
  completedAt: string;
  answers: Record<number, string>;
  result: PersonalityType;
  tied: PersonalityType[];
  userInfo?: UserInfo;
};

export const QK = {
  testResponses: ["test", "responses"] as const,
  testQuestions: ["test", "questions"] as const,
  media: ["media"] as const,
};

function rowToResponse(row: TestResponseRow): StoredTestResponse {
  return {
    id: row.id,
    completedAt: row.completed_at,
    answers: (row.answers as Record<number, string>) ?? {},
    result: row.result as PersonalityType,
    tied: (row.tied ?? []) as PersonalityType[],
    userInfo: row.user_full_name || row.user_phone ? {
      fullName: row.user_full_name ?? "",
      phone: row.user_phone ?? "",
      age: row.user_age ?? 0,
      gender: row.user_gender ?? "",
    } : undefined,
  };
}

export function useTestResponses() {
  return useQuery({
    queryKey: QK.testResponses,
    queryFn: async (): Promise<StoredTestResponse[]> => {
      const { data, error } = await supabase
        .from("test_responses")
        .select("*")
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToResponse);
    },
  });
}

export function useSubmitTestResponse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      answers: Record<number, string>;
      result: PersonalityType;
      tied: PersonalityType[];
      userInfo?: UserInfo;
    }) => {
      const row: TestResponseInsert = {
        answers: input.answers as never,
        result: input.result,
        tied: input.tied,
        user_full_name: input.userInfo?.fullName ?? "",
        user_phone: input.userInfo?.phone ?? "",
        user_age: input.userInfo?.age ?? null,
        user_gender: input.userInfo?.gender ?? "",
      };
      const { data, error } = await supabase.from("test_responses").insert(row).select().single();
      if (error) throw error;
      return rowToResponse(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.testResponses }),
  });
}

export function useDeleteTestResponse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("test_responses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.testResponses }),
  });
}

export function useClearTestResponses() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("test_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.testResponses }),
  });
}

export function useTestQuestionsConfig() {
  return useQuery({
    queryKey: QK.testQuestions,
    queryFn: async (): Promise<TestQuestionsConfig> => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "test_questions")
        .maybeSingle();
      if (error) throw error;
      if (!data?.value) return EMPTY_TEST_QUESTIONS;
      const v = data.value as TestQuestionsConfig;
      return {
        overrides: v.overrides ?? {},
        orderedIds: v.orderedIds ?? null,
      };
    },
    staleTime: 30_000,
  });
}

export function useUpdateTestQuestionsConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config: TestQuestionsConfig) => {
      const { error } = await supabase.from("site_content").upsert({
        key: "test_questions",
        value: config as never,
      });
      if (error) throw error;
    },
    onMutate: async (config) => beginOptimisticUpdate<TestQuestionsConfig>(qc, QK.testQuestions, () => config),
    onError: (_err, _config, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.testQuestions, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}
