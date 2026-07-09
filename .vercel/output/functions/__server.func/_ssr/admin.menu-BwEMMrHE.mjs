import { o as __toESM } from "../_runtime.mjs";
import { p as menuItemSchema } from "./theme-SnWyrOGi.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { F as useUpsertMenuItem, d as useAllMenuItems, g as useDeleteMenuItem } from "./cms-DpxCyY4I.mjs";
import { _ as Save, n as X, u as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, r as GhostButton, s as PrimaryButton, u as triggerSave } from "./admin-shell-BJzvwuI4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.menu-BwEMMrHE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.menu.tsx?tsr-split=component";
var blank = () => ({
	category: "",
	name: "",
	description: "",
	price: "",
	image_url: "",
	visible: true,
	sort_order: 0
});
function MenuAdmin() {
	const { data: items = [], isLoading } = useAllMenuItems();
	const upsert = useUpsertMenuItem();
	const remove = useDeleteMenuItem();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
	function save() {
		if (!editing) return;
		const parsed = menuItemSchema.safeParse({
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
			title: "مدیریت منو",
			subtitle: "تغییرات بلافاصله در سایت اعمال می‌شود",
			actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PrimaryButton, {
				onClick: () => setEditing(blank()),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 45,
					columnNumber: 13
				}, this), " آیتم جدید"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 44,
				columnNumber: 96
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 44,
			columnNumber: 7
		}, this),
		editing && /* @__PURE__ */ (void 0)(Card, {
			className: "p-4 mb-4",
			children: [/* @__PURE__ */ (void 0)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (void 0)("div", { children: [
						/* @__PURE__ */ (void 0)(Label, { children: "دسته" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 51,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)(Input, {
							list: "menu-categories",
							value: editing.category ?? "",
							onChange: (e) => setEditing({
								...editing,
								category: e.target.value
							}),
							placeholder: "نوشیدنی گرم"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 52,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("datalist", {
							id: "menu-categories",
							children: categories.map((c) => /* @__PURE__ */ (void 0)("option", { value: c }, c, false, {
								fileName: _jsxFileName,
								lineNumber: 57,
								columnNumber: 38
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 56,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, { children: "نام" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 61,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(Input, {
						value: editing.name ?? "",
						onChange: (e) => setEditing({
							...editing,
							name: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 60,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (void 0)(Label, { children: "توضیحات" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(Textarea, {
							rows: 2,
							value: editing.description ?? "",
							onChange: (e) => setEditing({
								...editing,
								description: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, { children: "قیمت" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 75,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(Input, {
						value: editing.price ?? "",
						onChange: (e) => setEditing({
							...editing,
							price: e.target.value
						}),
						placeholder: "۸۵٬۰۰۰"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 76,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, { children: "آدرس تصویر" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(Input, {
						dir: "ltr",
						value: editing.image_url ?? "",
						onChange: (e) => setEditing({
							...editing,
							image_url: e.target.value
						}),
						placeholder: "https://..."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 81,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 49,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)("div", {
				className: "flex gap-2 mt-4",
				children: [/* @__PURE__ */ (void 0)(PrimaryButton, {
					onClick: save,
					disabled: upsert.isPending,
					children: [/* @__PURE__ */ (void 0)(Save, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 15
					}, this), " ذخیره"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 90,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)(GhostButton, {
					onClick: () => setEditing(null),
					children: [/* @__PURE__ */ (void 0)(X, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 94,
						columnNumber: 15
					}, this), " انصراف"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 89,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 48,
			columnNumber: 19
		}, this),
		isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center text-sm text-muted-foreground py-10",
			children: "در حال بارگذاری..."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 99,
			columnNumber: 20
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3",
			children: [items.map((it) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "overflow-hidden flex flex-col",
				children: [it.image_url && /* @__PURE__ */ (void 0)("img", {
					src: it.image_url,
					alt: it.name,
					loading: "lazy",
					decoding: "async",
					className: "w-full h-32 object-cover"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 101,
					columnNumber: 32
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "p-3 flex-1 flex flex-col gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-[11px] font-bold text-muted-foreground",
							children: it.category
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 103,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-sm font-bold",
							children: it.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 104,
							columnNumber: 17
						}, this),
						it.description && /* @__PURE__ */ (void 0)("div", {
							className: "text-xs text-muted-foreground line-clamp-2",
							children: it.description
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 105,
							columnNumber: 36
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs font-semibold mt-1",
							children: it.price
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 106,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-1.5 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GhostButton, {
								onClick: () => setEditing(it),
								className: "text-xs py-1.5",
								children: "ویرایش"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GhostButton, {
								tone: "danger",
								onClick: () => {
									triggerSave();
									remove.mutate(it.id, { onSuccess: () => toast.success("حذف شد") });
								},
								className: "text-xs py-1.5",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 117,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 111,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 102,
					columnNumber: 15
				}, this)]
			}, it.id, true, {
				fileName: _jsxFileName,
				lineNumber: 100,
				columnNumber: 28
			}, this)), items.length === 0 && /* @__PURE__ */ (void 0)(Card, {
				className: "p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3",
				children: "هنوز آیتمی اضافه نشده."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 122,
				columnNumber: 34
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 99,
			columnNumber: 112
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 43,
		columnNumber: 10
	}, this);
}
//#endregion
export { MenuAdmin as component };
