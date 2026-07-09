import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as useRepositories, a as removeById, c as upsertById, o as rollbackOptimisticUpdate, r as beginOptimisticUpdate, s as touchLocalCmsEdit } from "./cms-DpxCyY4I.mjs";
import { F as Folder, G as ChevronDown, d as Tag, g as Search, o as Upload, u as Trash2 } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as Card, o as PageHeader, r as GhostButton } from "./admin-shell-BJzvwuI4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as QK } from "./test-db-CgaCB5a4.mjs";
import { t as useIsMobile } from "./use-mobile-DM96sOa1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.media-BvIuXZ8A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
function getMediaPublicUrl(storagePath) {
	return useRepositories().media.getPublicUrl(storagePath);
}
function useMediaFiles() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.media,
		queryFn: () => repos.media.getAll()
	});
}
function useUploadMedia() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (input) => {
			return repos.media.upload(input.file, input.folder);
		},
		onSuccess: (data) => {
			touchLocalCmsEdit();
			qc.setQueryData(QK.media, (list) => upsertById(list, data));
		}
	});
}
function useDeleteMedia() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (file) => {
			await repos.media.delete(file);
		},
		onMutate: async (file) => beginOptimisticUpdate(qc, QK.media, (list) => removeById(list, file.id)),
		onError: (_err, _file, ctx) => {
			if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, QK.media, ctx.prev);
		},
		onSuccess: () => touchLocalCmsEdit()
	});
}
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.media.tsx?tsr-split=component";
function MediaPage() {
	const { data: media = [], isLoading, isError, error } = useMediaFiles();
	const upload = useUploadMedia();
	const remove = useDeleteMedia();
	const isMobile = useIsMobile();
	const [folder, setFolder] = (0, import_react.useState)("همه");
	const [q, setQ] = (0, import_react.useState)("");
	const [showFolders, setShowFolders] = (0, import_react.useState)(false);
	const folders = (0, import_react.useMemo)(() => ["همه", ...Array.from(new Set(media.map((m) => m.folder)))], [media]);
	const filtered = (0, import_react.useMemo)(() => media.filter((m) => (folder === "همه" || m.folder === folder) && (!q || m.name.includes(q) || (m.tags ?? []).some((t) => t.includes(q)))), [
		media,
		folder,
		q
	]);
	async function onUpload(e) {
		const files = Array.from(e.target.files ?? []);
		e.target.value = "";
		for (const file of files) try {
			await upload.mutateAsync({
				file,
				folder: "uploads"
			});
			toast.success(`${file.name} آپلود شد`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "آپلود ناموفق");
		}
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 38,
		columnNumber: 12
	}, this);
	if (isError) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "text-center text-sm text-destructive py-10",
		children: error instanceof Error ? error.message : "خطا"
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 41,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
		title: "کتابخانه رسانه",
		subtitle: "آپلود و مدیریت تصاویر در Supabase Storage",
		actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
			className: `inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-3.5 py-2 text-sm font-medium hover:bg-foreground/90 cursor-pointer ${upload.isPending ? "opacity-50 pointer-events-none" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 13
				}, this),
				" ",
				upload.isPending ? "در حال آپلود..." : "آپلود",
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "file",
					multiple: true,
					accept: "image/*",
					className: "hidden",
					onChange: onUpload,
					disabled: upload.isPending
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 48,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 46,
			columnNumber: 104
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 46,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4",
		children: [isMobile ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "-mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				onClick: () => setShowFolders(!showFolders),
				className: "w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3.5 py-3 text-sm min-h-[44px] touch-manipulation",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Folder, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 56,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-medium",
						children: folder
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 55,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition ${showFolders ? "rotate-180" : ""}` }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 59,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 54,
				columnNumber: 13
			}, this), showFolders && /* @__PURE__ */ (void 0)(Card, {
				className: "mt-1 p-2 overflow-hidden",
				children: folders.map((f) => /* @__PURE__ */ (void 0)("button", {
					onClick: () => {
						setFolder(f);
						setShowFolders(false);
					},
					className: `w-full text-right flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition min-h-[44px] ${folder === f ? "bg-foreground/[0.06] font-medium" : "hover:bg-muted text-muted-foreground"}`,
					children: [/* @__PURE__ */ (void 0)(Folder, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 21
					}, this), f]
				}, f, true, {
					fileName: _jsxFileName,
					lineNumber: 62,
					columnNumber: 35
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 29
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 53,
			columnNumber: 21
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-3 h-fit",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-xs text-muted-foreground mb-2",
				children: "پوشه‌ها"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 71,
				columnNumber: 13
			}, this), folders.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				onClick: () => setFolder(f),
				className: `w-full text-right flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition ${folder === f ? "bg-foreground/[0.06] font-medium" : "hover:bg-muted text-muted-foreground"}`,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Folder, { className: "h-3.5 w-3.5" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 73,
					columnNumber: 17
				}, this), f]
			}, f, true, {
				fileName: _jsxFileName,
				lineNumber: 72,
				columnNumber: 31
			}, this))]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 70,
			columnNumber: 20
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "mb-3 p-3 flex items-center gap-2",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex-1 relative",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "جستجو نام یا تگ...",
					className: "w-full rounded-lg border border-border bg-background pr-8 pl-3 py-1.5 text-sm outline-none focus:border-foreground/40"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 80,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 79,
			columnNumber: 11
		}, this), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-12 text-center text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "h-8 w-8 mx-auto text-muted-foreground/50 mb-2" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 87,
				columnNumber: 15
			}, this), "هیچ فایلی یافت نشد. آپلود کنید."]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 86,
			columnNumber: 36
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
			children: filtered.map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "overflow-hidden group",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "aspect-square bg-muted relative",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: getMediaPublicUrl(m.storage_path),
						alt: m.name,
						className: "w-full h-full object-cover",
						loading: "lazy"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 92,
						columnNumber: 21
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						disabled: remove.isPending,
						onClick: () => remove.mutate(m, {
							onSuccess: () => toast.success("حذف شد"),
							onError: (e) => toast.error(e.message)
						}),
						className: "absolute top-2 left-2 h-9 w-9 md:h-7 md:w-7 grid place-items-center rounded-full bg-background/90 text-rose-600 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition disabled:opacity-50 touch-manipulation",
						"aria-label": "حذف",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4 md:h-3.5 md:w-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 97,
							columnNumber: 23
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 93,
						columnNumber: 21
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 91,
					columnNumber: 19
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs font-medium truncate",
							children: m.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 101,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-[10px] text-muted-foreground flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tag, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 103,
									columnNumber: 23
								}, this),
								" ",
								(Number(m.size_bytes) / 1024).toFixed(0),
								" KB"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 102,
							columnNumber: 21
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GhostButton, {
							className: "text-[10px] py-2 px-2 mt-1 w-full min-h-[36px]",
							onClick: () => {
								navigator.clipboard.writeText(getMediaPublicUrl(m.storage_path));
								toast.success("آدرس کپی شد");
							},
							children: "کپی URL"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 105,
							columnNumber: 21
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 100,
					columnNumber: 19
				}, this)]
			}, m.id, true, {
				fileName: _jsxFileName,
				lineNumber: 90,
				columnNumber: 34
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 89,
			columnNumber: 23
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 78,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 51,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 45,
		columnNumber: 10
	}, this);
}
//#endregion
export { MediaPage as component };
