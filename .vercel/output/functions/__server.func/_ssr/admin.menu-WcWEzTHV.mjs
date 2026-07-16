import { o as __toESM } from "../_runtime.mjs";
import { o as menuItemSchema } from "./theme-Cufe8rHc.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { M as useUpsertMenuItem, d as useAllMenuItems, g as useDeleteMenuItem } from "./cms-DGKxqoRl.mjs";
import { _ as Save, n as X, u as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, r as GhostButton, s as PrimaryButton, u as triggerSave } from "./admin-shell-BNyFa0Ci.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.menu-WcWEzTHV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "مدیریت منو",
			subtitle: "تغییرات بلافاصله در سایت اعمال می‌شود",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
				onClick: () => setEditing(blank()),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " آیتم جدید"]
			})
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "دسته" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							list: "menu-categories",
							value: editing.category ?? "",
							onChange: (e) => setEditing({
								...editing,
								category: e.target.value
							}),
							placeholder: "نوشیدنی گرم"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "menu-categories",
							children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c }, c))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نام" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.name ?? "",
						onChange: (e) => setEditing({
							...editing,
							name: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "توضیحات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: editing.description ?? "",
							onChange: (e) => setEditing({
								...editing,
								description: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "قیمت" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.price ?? "",
						onChange: (e) => setEditing({
							...editing,
							price: e.target.value
						}),
						placeholder: "۸۵٬۰۰۰"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "آدرس تصویر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						dir: "ltr",
						value: editing.image_url ?? "",
						onChange: (e) => setEditing({
							...editing,
							image_url: e.target.value
						}),
						placeholder: "https://..."
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
					onClick: save,
					disabled: upsert.isPending,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " ذخیره"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
					onClick: () => setEditing(null),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), " انصراف"]
				})]
			})]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center text-sm text-muted-foreground py-10",
			children: "در حال بارگذاری..."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3",
			children: [items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden flex flex-col",
				children: [it.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: it.image_url,
					alt: it.name,
					loading: "lazy",
					decoding: "async",
					className: "w-full h-32 object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 flex-1 flex flex-col gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-bold text-muted-foreground",
							children: it.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-bold",
							children: it.name
						}),
						it.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground line-clamp-2",
							children: it.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold mt-1",
							children: it.price
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								onClick: () => setEditing(it),
								className: "text-xs py-1.5",
								children: "ویرایش"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								tone: "danger",
								onClick: () => {
									triggerSave();
									remove.mutate(it.id, { onSuccess: () => toast.success("حذف شد") });
								},
								className: "text-xs py-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})]
						})
					]
				})]
			}, it.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3",
				children: "هنوز آیتمی اضافه نشده."
			})]
		})
	] });
}
//#endregion
export { MenuAdmin as component };
