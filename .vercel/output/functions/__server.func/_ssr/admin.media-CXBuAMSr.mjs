import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as useRepositories, a as removeById, c as upsertById, o as rollbackOptimisticUpdate, r as beginOptimisticUpdate, s as touchLocalCmsEdit } from "./cms-Bhq-qmPK.mjs";
import { F as Folder, G as ChevronDown, d as Tag, g as Search, o as Upload, u as Trash2 } from "../_libs/lucide-react.mjs";
import { n as Card, o as PageHeader, r as GhostButton } from "./admin-shell-CxyCER2q.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as QK } from "./test-db-Ydv1zst1.mjs";
import { t as useIsMobile } from "./use-mobile-DM96sOa1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.media-CXBuAMSr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-destructive py-10",
		children: error instanceof Error ? error.message : "خطا"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "کتابخانه رسانه",
		subtitle: "آپلود و مدیریت تصاویر در Supabase Storage",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: `inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-3.5 py-2 text-sm font-medium hover:bg-foreground/90 cursor-pointer ${upload.isPending ? "opacity-50 pointer-events-none" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
				" ",
				upload.isPending ? "در حال آپلود..." : "آپلود",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					multiple: true,
					accept: "image/*",
					className: "hidden",
					onChange: onUpload,
					disabled: upload.isPending
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4",
		children: [isMobile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "-mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowFolders(!showFolders),
				className: "w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3.5 py-3 text-sm min-h-[44px] touch-manipulation",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: folder
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition ${showFolders ? "rotate-180" : ""}` })]
			}), showFolders && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-1 p-2 overflow-hidden",
				children: folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setFolder(f);
						setShowFolders(false);
					},
					className: `w-full text-right flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition min-h-[44px] ${folder === f ? "bg-foreground/[0.06] font-medium" : "hover:bg-muted text-muted-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-4 w-4" }), f]
				}, f))
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-3 h-fit",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground mb-2",
				children: "پوشه‌ها"
			}), folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setFolder(f),
				className: `w-full text-right flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition ${folder === f ? "bg-foreground/[0.06] font-medium" : "hover:bg-muted text-muted-foreground"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-3.5 w-3.5" }), f]
			}, f))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-3 p-3 flex items-center gap-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "جستجو نام یا تگ...",
					className: "w-full rounded-lg border border-border bg-background pr-8 pl-3 py-1.5 text-sm outline-none focus:border-foreground/40"
				})]
			})
		}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-12 text-center text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-8 w-8 mx-auto text-muted-foreground/50 mb-2" }), "هیچ فایلی یافت نشد. آپلود کنید."]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
			children: filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "aspect-square bg-muted relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: getMediaPublicUrl(m.storage_path),
						alt: m.name,
						className: "w-full h-full object-cover",
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: remove.isPending,
						onClick: () => remove.mutate(m, {
							onSuccess: () => toast.success("حذف شد"),
							onError: (e) => toast.error(e.message)
						}),
						className: "absolute top-2 left-2 h-9 w-9 md:h-7 md:w-7 grid place-items-center rounded-full bg-background/90 text-rose-600 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition disabled:opacity-50 touch-manipulation",
						"aria-label": "حذف",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 md:h-3.5 md:w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-medium truncate",
							children: m.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] text-muted-foreground flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3 w-3" }),
								" ",
								(Number(m.size_bytes) / 1024).toFixed(0),
								" KB"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
							className: "text-[10px] py-2 px-2 mt-1 w-full min-h-[36px]",
							onClick: () => {
								navigator.clipboard.writeText(getMediaPublicUrl(m.storage_path));
								toast.success("آدرس کپی شد");
							},
							children: "کپی URL"
						})
					]
				})]
			}, m.id))
		})] })]
	})] });
}
//#endregion
export { MediaPage as component };
