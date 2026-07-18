import { o as __toESM } from "../_runtime.mjs";
import { i as galleryImageSchema } from "./theme-DgPaYO0s.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { M as useUpsertGalleryImage, d as useAllGalleryImages, g as useDeleteGalleryImage } from "./cms-CmbRBAo7.mjs";
import { u as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { a as Label, i as Input, n as Card, o as PageHeader, s as PrimaryButton, u as triggerSave } from "./admin-shell-BJblCAon.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.gallery-Cjis9sS0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GalleryAdmin() {
	const { data: images = [], isLoading } = useAllGalleryImages();
	const upsert = useUpsertGalleryImage();
	const remove = useDeleteGalleryImage();
	const [url, setUrl] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	function add() {
		const parsed = galleryImageSchema.safeParse({
			image_url: url.trim(),
			title: title.trim(),
			sort_order: images.length
		});
		if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "ورودی نامعتبر");
		triggerSave();
		upsert.mutate(parsed.data, {
			onSuccess: () => {
				setUrl("");
				setTitle("");
				toast.success("اضافه شد");
			},
			onError: (e) => toast.error(e.message)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "گالری",
			subtitle: "افزودن تصاویر برای نمایش در گالری صفحه اصلی"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-4 mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3 items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "آدرس تصویر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						dir: "ltr",
						value: url,
						onChange: (e) => setUrl(e.target.value),
						placeholder: "https://...",
						inputMode: "url"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "عنوان (اختیاری)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value)
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
					onClick: add,
					disabled: upsert.isPending,
					className: "w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " افزودن"]
				})]
			})
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center text-sm text-muted-foreground py-10",
			children: "در حال بارگذاری..."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
			children: [images.map((img) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-square bg-muted relative overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: img.image_url,
						alt: img.title ?? "",
						className: "w-full h-full object-cover transition group-hover:scale-105",
						loading: "lazy"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs truncate flex-1",
						children: img.title || "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							triggerSave();
							remove.mutate(img.id, { onSuccess: () => toast.success("حذف شد") });
						},
						className: "h-9 w-9 md:h-8 md:w-8 grid place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition touch-manipulation",
						"aria-label": "حذف",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})]
				})]
			}, img.id)), images.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-8 text-center text-sm text-muted-foreground col-span-full",
				children: "هیچ تصویری ثبت نشده."
			})]
		})
	] });
}
//#endregion
export { GalleryAdmin as component };
