import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as useRepositories, o as rollbackOptimisticUpdate, r as beginOptimisticUpdate, s as touchLocalCmsEdit } from "./cms-TqyDBlHH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test-db-DBO4XYZm.js
var QK = {
	testResponses: ["test", "responses"],
	testQuestions: ["test", "questions"],
	media: ["media"]
};
function useTestResponses() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.testResponses,
		queryFn: () => repos.test.getResponses()
	});
}
function useSubmitTestResponse() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (input) => {
			return repos.test.submitResponse(input);
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: QK.testResponses })
	});
}
function useDeleteTestResponse() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (id) => {
			await repos.test.deleteResponse(id);
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: QK.testResponses })
	});
}
function useClearTestResponses() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async () => {
			await repos.test.clearResponses();
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: QK.testResponses })
	});
}
function useTestQuestionsConfig() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.testQuestions,
		queryFn: async () => {
			const result = await repos.test.getQuestionsConfig();
			return {
				overrides: result.overrides ?? {},
				orderedIds: result.orderedIds ?? null
			};
		},
		staleTime: 3e4
	});
}
function useUpdateTestQuestionsConfig() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (config) => {
			await repos.test.updateQuestionsConfig(config);
		},
		onMutate: async (config) => beginOptimisticUpdate(qc, QK.testQuestions, () => config),
		onError: (_err, _config, ctx) => {
			if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, QK.testQuestions, ctx.prev);
		},
		onSuccess: () => touchLocalCmsEdit()
	});
}
//#endregion
export { useTestQuestionsConfig as a, useSubmitTestResponse as i, useClearTestResponses as n, useTestResponses as o, useDeleteTestResponse as r, useUpdateTestQuestionsConfig as s, QK as t };
