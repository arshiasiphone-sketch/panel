import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { L as Eye, M as GripVertical, R as EyeOff, v as RotateCcw } from "../_libs/lucide-react.mjs";
import { d as CSS, i as closestCenter, l as useSensor, r as PointerSensor, t as DndContext, u as useSensors } from "../_libs/@dnd-kit/core+[...].mjs";
import { n as Card, o as PageHeader, u as triggerSave } from "./admin-shell-kjqjnGqg.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useTestQuestionsConfig, s as useUpdateTestQuestionsConfig } from "./test-db-DBO4XYZm.mjs";
import { i as verticalListSortingStrategy, n as arrayMove, r as useSortable, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
import { t as PERSONALITY_PROFILES } from "./test-data-CeIpy77Z.mjs";
import { n as getActiveQuestionIds, r as resolveQuestion, t as EMPTY_TEST_QUESTIONS } from "./test-questions-B_RC_EWL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.test-questions-Dthb0NCl.js
var import_jsx_runtime = require_jsx_runtime();
function TestQuestionsPage() {
	const { data: config = EMPTY_TEST_QUESTIONS, isLoading } = useTestQuestionsConfig();
	const update = useUpdateTestQuestionsConfig();
	const ids = getActiveQuestionIds(config);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
	function save(next) {
		triggerSave();
		update.mutate(next, { onError: (e) => toast.error(e.message) });
	}
	function patch(fn) {
		save(fn(config));
	}
	function onDragEnd(e) {
		const { active, over } = e;
		if (!over || active.id === over.id) return;
		patch((c) => ({
			...c,
			orderedIds: arrayMove(getActiveQuestionIds(c), ids.indexOf(active.id), ids.indexOf(over.id))
		}));
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "سوالات تست شخصیت",
		subtitle: "ترتیب، متن، گزینه‌ها و نگاشت تیپ‌ها — تغییرات در پایگاه داده ذخیره می‌شوند.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => {
				save(EMPTY_TEST_QUESTIONS);
				toast.success("به حالت پیش‌فرض برگشت");
			},
			className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " ریست"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
		sensors,
		collisionDetection: closestCenter,
		onDragEnd,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
			items: ids,
			strategy: verticalListSortingStrategy,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: ids.map((id) => {
					const q = resolveQuestion(id, config.overrides);
					if (!q) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableQuestion, {
						id,
						q,
						onText: (t) => patch((c) => ({
							...c,
							overrides: {
								...c.overrides,
								[id]: {
									...c.overrides[id],
									text: t
								}
							}
						})),
						onToggle: () => patch((c) => {
							const cur = c.overrides[id] ?? {};
							return {
								...c,
								overrides: {
									...c.overrides,
									[id]: {
										...cur,
										enabled: !(cur.enabled ?? true)
									}
								}
							};
						}),
						onOptText: (oid, t) => patch((c) => {
							const cur = c.overrides[id] ?? {};
							const opts = { ...cur.options ?? {} };
							opts[oid] = {
								...opts[oid],
								text: t
							};
							return {
								...c,
								overrides: {
									...c.overrides,
									[id]: {
										...cur,
										options: opts
									}
								}
							};
						}),
						onOptType: (oid, t) => patch((c) => {
							const cur = c.overrides[id] ?? {};
							const opts = { ...cur.options ?? {} };
							opts[oid] = {
								...opts[oid],
								type: t
							};
							return {
								...c,
								overrides: {
									...c.overrides,
									[id]: {
										...cur,
										options: opts
									}
								}
							};
						})
					}, id);
				})
			})
		})
	})] });
}
var TYPE_OPTIONS = [
	{
		value: "none",
		label: "بدون مپینگ"
	},
	{
		value: "paparoch",
		label: "پاپاروچ"
	},
	{
		value: "zhampin",
		label: "ژامپین"
	},
	{
		value: "fofino",
		label: "فوفینو"
	},
	{
		value: "gombak",
		label: "گومباک"
	}
];
function SortableQuestion({ id, q, onText, onToggle, onOptText, onOptType }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? .4 : 1
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: `p-4 ${!q.enabled ? "opacity-60" : ""}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					...attributes,
					...listeners,
					className: "mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground",
					"aria-label": "جابجایی",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										children: ["سوال ", id]
									}),
									!q.categorized && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-1.5 py-0.5 rounded-full bg-muted",
										children: "بدون دسته"
									}),
									!q.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive",
										children: "غیرفعال"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onToggle,
								className: "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent",
								children: q.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }), " غیرفعال کن"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), " فعال کن"] })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: q.text,
							onChange: (e) => onText(e.target.value),
							rows: 2,
							className: "w-full rounded-lg border border-border bg-background p-2 text-sm font-medium resize-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2",
							children: q.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[1fr_140px] gap-2 items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: o.text,
									onChange: (e) => onOptText(o.id, e.target.value),
									className: "rounded-md border border-border bg-background px-2 py-1.5 text-sm"
								}), q.categorized ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: o.type ?? "none",
									onChange: (e) => onOptType(o.id, e.target.value === "none" ? null : e.target.value),
									className: "rounded-md border border-border bg-background px-2 py-1.5 text-xs font-semibold",
									style: { color: o.type && o.type !== "bedone" ? PERSONALITY_PROFILES[o.type].color : void 0 },
									children: TYPE_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: opt.value,
										children: opt.label
									}, opt.value))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground text-center",
									children: "بدون امتیاز"
								})]
							}, o.id))
						})
					]
				})]
			})
		})
	});
}
//#endregion
export { TestQuestionsPage as component };
