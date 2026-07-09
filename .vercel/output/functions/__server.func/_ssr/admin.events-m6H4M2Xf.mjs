import { o as __toESM } from "../_runtime.mjs";
import { c as eventSchema } from "./theme-SnWyrOGi.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { N as useUpsertEvent, l as useAllEvents, m as useDeleteEvent } from "./cms-kjwVWmsc.mjs";
import { _ as Save, n as X, u as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, r as GhostButton, s as PrimaryButton, u as triggerSave } from "./admin-shell-DVodOT7B.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.events-m6H4M2Xf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.events.tsx?tsr-split=component";
var blank = () => ({
	title: "",
	description: "",
	date_label: "",
	image_url: "",
	visible: true,
	sort_order: 0
});
function EventsAdmin() {
	const { data: items = [], isLoading } = useAllEvents();
	const upsert = useUpsertEvent();
	const remove = useDeleteEvent();
	const [editing, setEditing] = (0, import_react.useState)(null);
	function save() {
		if (!editing) return;
		const parsed = eventSchema.safeParse({
			...editing,
			sort_order: editing.sort_order ?? items.length
		});
		if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "ورودی نامعتبر");
		triggerSave();
		upsert.mutate(parsed.data, {
			onSuccess: () => {
				toast.success("ذخیره شد");
				setEditing(null);
			},
			onError: (e) => toast.error(e.message)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "رویدادها",
			subtitle: "رویدادهای کافه را اضافه و ویرایش کنید",
			actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PrimaryButton, {
				onClick: () => setEditing(blank()),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 43,
					columnNumber: 13
				}, this), " رویداد جدید"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 42,
				columnNumber: 94
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 42,
			columnNumber: 7
		}, this),
		editing && /* @__PURE__ */ (void 0)(Card, {
			className: "p-4 mb-4",
			children: [/* @__PURE__ */ (void 0)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, { children: "عنوان" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 49,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(Input, {
						value: editing.title ?? "",
						onChange: (e) => setEditing({
							...editing,
							title: e.target.value
						}),
						autoFocus: true
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, { children: "تاریخ (متن)" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 56,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(Input, {
						value: editing.date_label ?? "",
						onChange: (e) => setEditing({
							...editing,
							date_label: e.target.value
						}),
						placeholder: "جمعه ۲۰ تیر · ساعت ۲۰"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 55,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (void 0)(Label, { children: "توضیحات" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 63,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(Textarea, {
							rows: 3,
							value: editing.description ?? "",
							onChange: (e) => setEditing({
								...editing,
								description: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 64,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (void 0)(Label, { children: "آدرس تصویر" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 70,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(Input, {
							dir: "ltr",
							value: editing.image_url ?? "",
							onChange: (e) => setEditing({
								...editing,
								image_url: e.target.value
							}),
							placeholder: "https://...",
							inputMode: "url"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 71,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 47,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)("div", {
				className: "flex gap-2 mt-4",
				children: [/* @__PURE__ */ (void 0)(PrimaryButton, {
					onClick: save,
					disabled: upsert.isPending,
					children: [/* @__PURE__ */ (void 0)(Save, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 79,
						columnNumber: 15
					}, this), " ذخیره"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)(GhostButton, {
					onClick: () => setEditing(null),
					children: [/* @__PURE__ */ (void 0)(X, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 15
					}, this), " انصراف"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 77,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 46,
			columnNumber: 19
		}, this),
		isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center text-sm text-muted-foreground py-10",
			children: "در حال بارگذاری..."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 87,
			columnNumber: 20
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid sm:grid-cols-2 gap-3",
			children: [items.map((ev) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "overflow-hidden",
				children: [ev.image_url && /* @__PURE__ */ (void 0)("img", {
					src: ev.image_url,
					alt: ev.title,
					loading: "lazy",
					decoding: "async",
					className: "w-full h-36 object-cover"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 89,
					columnNumber: 32
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "p-3 flex flex-col gap-1",
					children: [
						ev.date_label && /* @__PURE__ */ (void 0)("div", {
							className: "text-[11px] font-bold text-muted-foreground",
							children: ev.date_label
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 35
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-sm font-bold",
							children: ev.title
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 92,
							columnNumber: 17
						}, this),
						ev.description && /* @__PURE__ */ (void 0)("div", {
							className: "text-xs text-muted-foreground line-clamp-2",
							children: ev.description
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 36
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-1.5 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GhostButton, {
								onClick: () => setEditing(ev),
								className: "text-xs py-1.5",
								children: "ویرایش"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 95,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GhostButton, {
								tone: "danger",
								onClick: () => {
									triggerSave();
									remove.mutate(ev.id, { onSuccess: () => toast.success("حذف شد") });
								},
								className: "text-xs py-1.5",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 104,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 98,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 94,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 90,
					columnNumber: 15
				}, this)]
			}, ev.id, true, {
				fileName: _jsxFileName,
				lineNumber: 88,
				columnNumber: 28
			}, this)), items.length === 0 && /* @__PURE__ */ (void 0)(Card, {
				className: "p-8 text-center text-sm text-muted-foreground sm:col-span-2",
				children: "هنوز رویدادی نیست."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 109,
				columnNumber: 34
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 87,
			columnNumber: 112
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 41,
		columnNumber: 10
	}, this);
}
//#endregion
export { EventsAdmin as component };
