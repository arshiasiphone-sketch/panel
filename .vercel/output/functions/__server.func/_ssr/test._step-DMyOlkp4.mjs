import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as useNavigate, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useTestQuestionsConfig, i as useSubmitTestResponse } from "./test-db-CgaCB5a4.mjs";
import { i as AnimatePresence, r as motion } from "../_libs/framer-motion.mjs";
import { n as getActiveQuestionIds, r as resolveQuestion, t as EMPTY_TEST_QUESTIONS } from "./test-questions-B_RC_EWL.mjs";
import { n as useHasHydrated, r as useTestStore, t as TestPageShell } from "./test-store-VxWjc1-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test._step-DMyOlkp4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/** Hook returning enabled, ordered, override-merged questions for the live test */
function useActiveQuestions() {
	const { data: config } = useTestQuestionsConfig();
	const overrides = config?.overrides ?? {};
	return getActiveQuestionIds(config ?? {
		overrides: {},
		orderedIds: null
	}).map((id) => resolveQuestion(id, overrides)).filter((q) => !!q && q.enabled !== false);
}
/** Non-hook variant used for scoring stored answers (snapshot at submission time) */
function getActiveQuestionsSnapshot(config) {
	return getActiveQuestionIds(config).map((id) => resolveQuestion(id, config.overrides)).filter((q) => !!q && q.enabled !== false);
}
function calculateScoresFor(answers, questions) {
	const counts = {
		paparoch: 0,
		zhampin: 0,
		fofino: 0,
		gombak: 0
	};
	for (const [qIdStr, optId] of Object.entries(answers)) {
		const q = questions.find((x) => x.id === Number(qIdStr));
		if (!q || !q.categorized) continue;
		const opt = q.options.find((o) => o.id === optId);
		if (opt?.type && opt.type !== "bedone" && opt.type in counts) counts[opt.type]++;
	}
	return counts;
}
function calculateDetailedResultFor(answers, questions) {
	const scores = calculateScoresFor(answers, questions);
	const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
	const top = sorted[0][1];
	if (top === 0) return {
		primary: "bedone",
		tied: ["bedone"],
		scores
	};
	const tied = sorted.filter(([, v]) => v === top).map(([k]) => k);
	return {
		primary: tied.length > 1 ? "bedone" : tied[0],
		tied,
		scores
	};
}
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/test.$step.tsx?tsr-split=component";
function QuestionPage() {
	const navigate = useNavigate();
	const { step } = useParams({ from: "/test/$step" });
	const stepNum = Number(step);
	const hasHydrated = useHasHydrated();
	const { answers, setAnswer, testStarted, setCompletedResponse, userInfo } = useTestStore();
	const { data: config } = useTestQuestionsConfig();
	const submitResponse = useSubmitTestResponse();
	const [direction, setDirection] = (0, import_react.useState)(1);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const activeQuestions = useActiveQuestions();
	const TOTAL = activeQuestions.length;
	const question = activeQuestions[stepNum - 1];
	const selected = question ? answers[question.id] ?? null : null;
	(0, import_react.useEffect)(() => {
		if (!hasHydrated) return;
		if (!userInfo) navigate({
			to: "/test/info",
			replace: true
		});
		else if (!testStarted) navigate({
			to: "/",
			replace: true
		});
	}, [
		hasHydrated,
		testStarted,
		userInfo,
		navigate
	]);
	if (!hasHydrated) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TestPageShell, {
		className: "flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			className: "relative z-10 w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary",
			animate: { rotate: 360 },
			transition: {
				duration: .9,
				repeat: Infinity,
				ease: "linear"
			}
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 52,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 51,
		columnNumber: 12
	}, this);
	if (!question) return null;
	function handleSelect(optionId) {
		setAnswer(question.id, optionId);
	}
	async function handleNext() {
		if (!selected || submitting) return;
		if (stepNum === TOTAL) {
			setSubmitting(true);
			const detailed = calculateDetailedResultFor(answers, getActiveQuestionsSnapshot(config ?? EMPTY_TEST_QUESTIONS));
			try {
				const saved = await submitResponse.mutateAsync({
					answers,
					result: detailed.primary,
					tied: detailed.tied,
					userInfo: userInfo ?? void 0
				});
				setCompletedResponse(saved);
				navigate({ to: "/test/result" });
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "ذخیره نتیجه ناموفق بود. دوباره تلاش کنید.");
			} finally {
				setSubmitting(false);
			}
		} else {
			setDirection(1);
			navigate({
				to: "/test/$step",
				params: { step: String(stepNum + 1) }
			});
		}
	}
	function handleBack() {
		if (stepNum === 1) {
			navigate({ to: "/test/info" });
			return;
		}
		setDirection(-1);
		navigate({
			to: "/test/$step",
			params: { step: String(stepNum - 1) }
		});
	}
	const progress = stepNum / TOTAL * 100;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TestPageShell, {
		className: "flex flex-col items-center justify-center px-4 py-12",
		particleCount: 60,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "w-full max-w-lg relative z-10 flex flex-col gap-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
							"سوال ",
							stepNum,
							" از ",
							TOTAL
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 116,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [Math.round(progress), "٪"] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 119,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-1.5 rounded-full overflow-hidden",
						style: { background: "rgba(255,255,255,0.06)" },
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							className: "h-full rounded-full",
							style: { background: "linear-gradient(90deg, #9f1239, #d4af37)" },
							animate: { width: `${progress}%` },
							transition: { duration: .4 }
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 124,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, {
					mode: "wait",
					custom: direction,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						custom: direction,
						initial: {
							opacity: 0,
							x: direction * 40
						},
						animate: {
							opacity: 1,
							x: 0
						},
						exit: {
							opacity: 0,
							x: direction * -40
						},
						transition: {
							duration: .35,
							ease: [
								.22,
								1,
								.36,
								1
							]
						},
						className: "flex flex-col gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							id: `question-${question.id}-label`,
							className: "text-xl sm:text-2xl font-extrabold leading-relaxed text-balance text-foreground",
							children: question.text
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 148,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							role: "radiogroup",
							"aria-labelledby": `question-${question.id}-label`,
							className: "flex flex-col gap-3",
							children: question.options.map((opt) => {
								const isSelected = selected === opt.id;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
									type: "button",
									role: "radio",
									"aria-checked": isSelected,
									onClick: () => handleSelect(opt.id),
									whileHover: { scale: 1.01 },
									whileTap: { scale: .98 },
									className: `w-full text-right px-5 py-4 rounded-2xl text-sm font-semibold transition cursor-pointer ${isSelected ? "text-foreground" : "text-text-tertiary"}`,
									style: {
										background: isSelected ? "rgba(159,18,57,0.18)" : "rgba(255,255,255,0.04)",
										border: isSelected ? "1px solid rgba(159,18,57,0.5)" : "1px solid rgba(255,255,255,0.08)",
										boxShadow: isSelected ? "0 0 24px rgba(159,18,57,0.2)" : "none"
									},
									children: opt.text
								}, opt.id, false, {
									fileName: _jsxFileName,
									lineNumber: 155,
									columnNumber: 22
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 152,
							columnNumber: 13
						}, this)]
					}, stepNum, true, {
						fileName: _jsxFileName,
						lineNumber: 135,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 134,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: handleBack,
						disabled: submitting,
						className: "flex-1 py-3.5 rounded-2xl text-sm font-semibold cursor-pointer disabled:opacity-50 text-muted-foreground",
						style: {
							background: "rgba(255,255,255,0.04)",
							border: "1px solid rgba(255,255,255,0.08)"
						},
						children: "قبلی"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 172,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: handleNext,
						disabled: !selected || submitting,
						className: "flex-[2] py-3.5 rounded-2xl text-sm font-bold cursor-pointer disabled:opacity-40 text-foreground",
						style: {
							background: "linear-gradient(135deg, #9f1239 0%, #be123c 100%)",
							boxShadow: "0 0 32px rgba(159,18,57,0.32)"
						},
						children: submitting ? "در حال ذخیره..." : stepNum === TOTAL ? "مشاهده نتیجه" : "بعدی"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 178,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 171,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 113,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 112,
		columnNumber: 10
	}, this);
}
//#endregion
export { QuestionPage as component };
