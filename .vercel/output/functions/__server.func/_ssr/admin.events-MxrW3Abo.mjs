import { o as __toESM } from "../_runtime.mjs";
import { c as eventSchema } from "./theme-HySvB7Iw.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { N as useUpsertEvent, l as useAllEvents, m as useDeleteEvent } from "./cms-8dCoOJLq.mjs";
import { _ as Save, n as X, u as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, r as GhostButton, s as PrimaryButton, u as triggerSave } from "./admin-shell-Dw5XLj0B.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.events-MxrW3Abo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "رویدادها",
			subtitle: "رویدادهای کافه را اضافه و ویرایش کنید",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
				onClick: () => setEditing(blank()),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " رویداد جدید"]
			})
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "عنوان" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.title ?? "",
						onChange: (e) => setEditing({
							...editing,
							title: e.target.value
						}),
						autoFocus: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "تاریخ (متن)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.date_label ?? "",
						onChange: (e) => setEditing({
							...editing,
							date_label: e.target.value
						}),
						placeholder: "جمعه ۲۰ تیر · ساعت ۲۰"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "توضیحات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							value: editing.description ?? "",
							onChange: (e) => setEditing({
								...editing,
								description: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "آدرس تصویر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							dir: "ltr",
							value: editing.image_url ?? "",
							onChange: (e) => setEditing({
								...editing,
								image_url: e.target.value
							}),
							placeholder: "https://...",
							inputMode: "url"
						})]
					})
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
			className: "grid sm:grid-cols-2 gap-3",
			children: [items.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden",
				children: [ev.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: ev.image_url,
					alt: ev.title,
					loading: "lazy",
					decoding: "async",
					className: "w-full h-36 object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 flex flex-col gap-1",
					children: [
						ev.date_label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-bold text-muted-foreground",
							children: ev.date_label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-bold",
							children: ev.title
						}),
						ev.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground line-clamp-2",
							children: ev.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								onClick: () => setEditing(ev),
								className: "text-xs py-1.5",
								children: "ویرایش"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								tone: "danger",
								onClick: () => {
									triggerSave();
									remove.mutate(ev.id, { onSuccess: () => toast.success("حذف شد") });
								},
								className: "text-xs py-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})]
						})
					]
				})]
			}, ev.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-8 text-center text-sm text-muted-foreground sm:col-span-2",
				children: "هنوز رویدادی نیست."
			})]
		})
	] });
}
//#endregion
export { EventsAdmin as component };
