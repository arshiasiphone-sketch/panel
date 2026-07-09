import { o as __toESM } from "../_runtime.mjs";
import { l as galleryImageSchema } from "./theme-SnWyrOGi.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { P as useUpsertGalleryImage, h as useDeleteGalleryImage, u as useAllGalleryImages } from "./cms-DpxCyY4I.mjs";
import { u as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Label, i as Input, n as Card, o as PageHeader, s as PrimaryButton, u as triggerSave } from "./admin-shell-BJzvwuI4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.gallery-D9DVi1eq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.gallery.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "گالری",
			subtitle: "افزودن تصاویر برای نمایش در گالری صفحه اصلی"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 35,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-4 mb-4",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3 items-end",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "آدرس تصویر" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 41,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						dir: "ltr",
						value: url,
						onChange: (e) => setUrl(e.target.value),
						placeholder: "https://...",
						inputMode: "url"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 42,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 40,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "عنوان (اختیاری)" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 45,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 46,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 44,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 39,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PrimaryButton, {
					onClick: add,
					disabled: upsert.isPending,
					className: "w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 13
					}, this), " افزودن"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 49,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 38,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 37,
			columnNumber: 7
		}, this),
		isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center text-sm text-muted-foreground py-10",
			children: "در حال بارگذاری..."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 55,
			columnNumber: 20
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
			children: [images.map((img) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "overflow-hidden group",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "aspect-square bg-muted relative overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: img.image_url,
						alt: img.title ?? "",
						className: "w-full h-full object-cover transition group-hover:scale-105",
						loading: "lazy"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 58,
						columnNumber: 17
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "p-3 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs truncate flex-1",
						children: img.title || "—"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 61,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							triggerSave();
							remove.mutate(img.id, { onSuccess: () => toast.success("حذف شد") });
						},
						className: "h-9 w-9 md:h-8 md:w-8 grid place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition touch-manipulation",
						"aria-label": "حذف",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 19
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 60,
					columnNumber: 15
				}, this)]
			}, img.id, true, {
				fileName: _jsxFileName,
				lineNumber: 56,
				columnNumber: 30
			}, this)), images.length === 0 && /* @__PURE__ */ (void 0)(Card, {
				className: "p-8 text-center text-sm text-muted-foreground col-span-full",
				children: "هیچ تصویری ثبت نشده."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 72,
				columnNumber: 35
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 55,
			columnNumber: 112
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 34,
		columnNumber: 10
	}, this);
}
//#endregion
export { GalleryAdmin as component };
