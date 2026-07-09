import { n as QUESTIONS } from "./test-data-CeIpy77Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test-questions-B_RC_EWL.js
var EMPTY_TEST_QUESTIONS = {
	overrides: {},
	orderedIds: null
};
/** Resolve a single question merged with overrides */
function resolveQuestion(id, overrides) {
	const base = QUESTIONS.find((q) => q.id === id);
	if (!base) return null;
	const ovr = overrides[id] ?? {};
	return {
		...base,
		text: ovr.text ?? base.text,
		enabled: ovr.enabled ?? true,
		options: base.options.map((o) => {
			const opt = ovr.options?.[o.id];
			return {
				...o,
				text: opt?.text ?? o.text,
				type: opt?.type !== void 0 ? opt.type : o.type
			};
		})
	};
}
function getActiveQuestionIds(config) {
	const baseIds = QUESTIONS.map((q) => q.id);
	return config.orderedIds && config.orderedIds.length === baseIds.length ? config.orderedIds : baseIds;
}
//#endregion
export { getActiveQuestionIds as n, resolveQuestion as r, EMPTY_TEST_QUESTIONS as t };
