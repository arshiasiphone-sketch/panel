import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import type { TestQuestionsConfig } from "./test-questions";
import { EMPTY_TEST_QUESTIONS } from "./test-questions";
import type { PersonalityType } from "./test-data";
import type { UserInfo } from "./test-store";
import { beginOptimisticUpdate, rollbackOptimisticUpdate, touchLocalCmsEdit } from "./cms-sync";
import { useRepositories } from "@/lib/providers";

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

export function useTestResponses() {
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.testResponses,
    queryFn: (): Promise<StoredTestResponse[]> => repos.test.getResponses(),
  });
}

export function useSubmitTestResponse() {
  const qc = useQueryClient();
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (input: {
      answers: Record<number, string>;
      result: PersonalityType;
      tied: PersonalityType[];
      userInfo?: UserInfo;
    }) => {
      return repos.test.submitResponse(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.testResponses }),
  });
}

export function useDeleteTestResponse() {
  const qc = useQueryClient();
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (id: string) => {
      await repos.test.deleteResponse(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.testResponses }),
  });
}

export function useClearTestResponses() {
  const qc = useQueryClient();
  const repos = useRepositories();
  return useMutation({
    mutationFn: async () => {
      await repos.test.clearResponses();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.testResponses }),
  });
}

export function useTestQuestionsConfig() {
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.testQuestions,
    queryFn: async (): Promise<TestQuestionsConfig> => {
      const result = await repos.test.getQuestionsConfig();
      return {
        overrides: (result.overrides as TestQuestionsConfig["overrides"]) ?? {},
        orderedIds: result.orderedIds ?? null,
      };
    },
    staleTime: 30_000,
  });
}

export function useUpdateTestQuestionsConfig() {
  const qc = useQueryClient();
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (config: TestQuestionsConfig) => {
      await repos.test.updateQuestionsConfig(config as never);
    },
    onMutate: async (config) =>
      beginOptimisticUpdate<TestQuestionsConfig>(qc, QK.testQuestions, () => config),
    onError: (_err, _config, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.testQuestions, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}
