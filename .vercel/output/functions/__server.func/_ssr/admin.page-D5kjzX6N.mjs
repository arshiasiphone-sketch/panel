import { o as __toESM } from "../_runtime.mjs";
import { r as cn } from "./factory-DhqSLdOF.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as useReorderBlocks, L as useUpsertSiteContent, O as useSiteContent, f as useCreateBlock, j as useUpdateBlock, p as useDeleteBlock, x as usePageBlocks } from "./cms-DpxCyY4I.mjs";
import { B as Copy, G as ChevronDown, L as Eye, M as GripVertical, R as EyeOff, n as X, u as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as defaultBlockData, n as BlockEditor, o as getBlockDef, r as BlockIcon, s as normalizeBlockType, t as BLOCK_DEFS } from "./blocks-QGV7I2Iw.mjs";
import { d as CSS, i as closestCenter, l as useSensor, r as PointerSensor, t as DndContext, u as useSensors } from "../_libs/@dnd-kit/core+[...].mjs";
import { n as Card, o as PageHeader, u as triggerSave } from "./admin-shell-BJzvwuI4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useIsMobile } from "./use-mobile-DM96sOa1.mjs";
import { i as verticalListSortingStrategy, n as arrayMove, r as useSortable, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.page-D5kjzX6N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "C:/Users/Admin/Desktop/final/myproject/src/components/ui/drawer.tsx";
var Drawer$1 = ({ shouldScaleBackground = true, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Drawer.Root, {
	shouldScaleBackground,
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 10,
	columnNumber: 3
}, void 0);
Drawer$1.displayName = "Drawer";
Drawer.Trigger;
var DrawerPortal = Drawer.Portal;
Drawer.Close;
var DrawerOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Drawer.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 24,
	columnNumber: 3
}, void 0));
DrawerOverlay.displayName = Drawer.Overlay.displayName;
var DrawerContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DrawerPortal, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DrawerOverlay, {}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 37,
	columnNumber: 5
}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Drawer.Content, {
	ref,
	className: cn("fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 46,
		columnNumber: 7
	}, void 0), children]
}, void 0, true, {
	fileName: _jsxFileName$1,
	lineNumber: 38,
	columnNumber: 5
}, void 0)] }, void 0, true, {
	fileName: _jsxFileName$1,
	lineNumber: 36,
	columnNumber: 3
}, void 0));
DrawerContent.displayName = "DrawerContent";
var DrawerHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("grid gap-1.5 p-4 text-center sm:text-left", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 54,
	columnNumber: 3
}, void 0);
DrawerHeader.displayName = "DrawerHeader";
var DrawerFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("mt-auto flex flex-col gap-2 p-4", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 59,
	columnNumber: 3
}, void 0);
DrawerFooter.displayName = "DrawerFooter";
var DrawerTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Drawer.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 67,
	columnNumber: 3
}, void 0));
DrawerTitle.displayName = Drawer.Title.displayName;
var DrawerDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Drawer.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 79,
	columnNumber: 3
}, void 0));
DrawerDescription.displayName = Drawer.Description.displayName;
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.page.tsx?tsr-split=component";
function toUiBlock(b) {
	return {
		id: b.id,
		type: normalizeBlockType(b.type),
		visible: b.visible,
		data: b.data ?? {}
	};
}
function PageBuilder() {
	const { data: rows = [], isLoading } = usePageBlocks();
	const { data: site } = useSiteContent();
	const upsertSite = useUpsertSiteContent();
	const createBlock = useCreateBlock();
	const updateBlock = useUpdateBlock();
	const deleteBlock = useDeleteBlock();
	const reorder = useReorderBlocks();
	const [picker, setPicker] = (0, import_react.useState)(false);
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const [drawerBlock, setDrawerBlock] = (0, import_react.useState)(null);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
	const blocks = (0, import_react.useMemo)(() => rows.map(toUiBlock), [rows]);
	const meta = site?.meta ?? {};
	(0, import_react.useEffect)(() => {
		function onOpenPicker() {
			setPicker(true);
		}
		window.addEventListener("open-block-picker", onOpenPicker);
		return () => window.removeEventListener("open-block-picker", onOpenPicker);
	}, []);
	function saveMeta(patch) {
		triggerSave();
		upsertSite.mutate({
			key: "meta",
			value: {
				...meta,
				...patch
			}
		}, { onError: (e) => toast.error(e.message) });
	}
	async function onDragEnd(e) {
		const { active, over } = e;
		if (!over || active.id === over.id) return;
		const ids = blocks.map((b) => b.id);
		const next = arrayMove(ids, ids.indexOf(active.id), ids.indexOf(over.id));
		triggerSave();
		reorder.mutate(next, { onError: (e) => toast.error(e.message) });
	}
	function addBlockOfType(type) {
		triggerSave();
		createBlock.mutate({
			type,
			data: defaultBlockData(type),
			sort_order: blocks.length
		}, {
			onSuccess: () => toast.success("بلوک افزوده شد"),
			onError: (e) => toast.error(e.message)
		});
	}
	function duplicateBlock(b) {
		triggerSave();
		createBlock.mutate({
			type: b.type,
			data: b.data,
			sort_order: blocks.length
		}, { onError: (e) => toast.error(e.message) });
	}
	function removeBlock(id) {
		triggerSave();
		deleteBlock.mutate(id, {
			onSuccess: () => toast.success("حذف شد"),
			onError: (e) => toast.error(e.message)
		});
	}
	function toggleVisibility(b) {
		triggerSave();
		updateBlock.mutate({
			id: b.id,
			visible: !b.visible
		}, { onError: (e) => toast.error(e.message) });
	}
	const commitData = (0, import_react.useCallback)((id, fullData) => {
		triggerSave();
		updateBlock.mutate({
			id,
			data: fullData
		}, { onError: (e) => toast.error(e.message) });
	}, [updateBlock]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "سازنده صفحه",
			subtitle: "بلوک‌ها را بکشید، ویرایش کنید — تغییرات بلافاصله در سایت اعمال می‌شوند"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 133,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-4 mb-4",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "h-14 w-14 rounded-full bg-muted grid place-items-center text-xl font-bold text-muted-foreground overflow-hidden",
					children: meta.avatar_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: meta.avatar_url,
						className: "h-full w-full object-cover"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 138,
						columnNumber: 32
					}, this) : (meta.title || "ک").slice(0, 1)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 137,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex-1 grid sm:grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						value: meta.title ?? "",
						onChange: (e) => saveMeta({ title: e.target.value }),
						placeholder: "عنوان صفحه",
						className: "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 141,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						value: meta.bio ?? "",
						onChange: (e) => saveMeta({ bio: e.target.value }),
						placeholder: "معرفی کوتاه",
						className: "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 140,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 136,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 135,
			columnNumber: 7
		}, this),
		isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center text-sm text-muted-foreground py-10",
			children: "در حال بارگذاری..."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 151,
			columnNumber: 20
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DndContext, {
			sensors,
			collisionDetection: closestCenter,
			onDragEnd,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SortableContext, {
				items: blocks.map((b) => b.id),
				strategy: verticalListSortingStrategy,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: blocks.map((b) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SortableBlock, {
						block: b,
						expanded: expanded === b.id,
						onToggle: () => setExpanded((x) => x === b.id ? null : b.id),
						onCommitData: (data) => commitData(b.id, data),
						onDuplicate: () => duplicateBlock(b),
						onRemove: () => removeBlock(b.id),
						onToggleVisibility: () => toggleVisibility(b)
					}, b.id, false, {
						fileName: _jsxFileName,
						lineNumber: 154,
						columnNumber: 32
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 153,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 152,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 151,
			columnNumber: 112
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
			onClick: () => setPicker(true),
			className: "mt-3 w-full rounded-2xl border-2 border-dashed border-border hover:border-foreground/30 hover:bg-muted/30 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition inline-flex items-center justify-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 160,
				columnNumber: 9
			}, this), " افزودن بلوک"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 159,
			columnNumber: 7
		}, this),
		picker && /* @__PURE__ */ (void 0)(BlockPicker, {
			onClose: () => setPicker(false),
			onPick: (t) => {
				addBlockOfType(t);
				setPicker(false);
			}
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 163,
			columnNumber: 18
		}, this),
		drawerBlock && /* @__PURE__ */ (void 0)(Drawer$1, {
			open: !!drawerBlock,
			onOpenChange: (open) => {
				if (!open) setDrawerBlock(null);
			},
			children: /* @__PURE__ */ (void 0)(DrawerContent, {
				className: "max-h-[85vh] overflow-y-auto",
				children: [/* @__PURE__ */ (void 0)(DrawerHeader, {
					className: "text-right border-b border-border pb-3",
					children: [/* @__PURE__ */ (void 0)(DrawerTitle, { children: /* @__PURE__ */ (void 0)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (void 0)(BlockIcon, { d: getBlockDef(drawerBlock.type).icon }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 176,
							columnNumber: 19
						}, this), /* @__PURE__ */ (void 0)("span", { children: getBlockDef(drawerBlock.type).label }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 177,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 175,
						columnNumber: 17
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 174,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)(DrawerDescription, {
						className: "text-xs mt-1",
						children: ["ویرایش ", getBlockDef(drawerBlock.type).label]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 180,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 173,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "p-4 pb-8",
					style: { paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" },
					children: /* @__PURE__ */ (void 0)(DrawerBlockEditor, {
						block: drawerBlock,
						onUpdate: (patch) => {
							const next = {
								...drawerBlock,
								data: {
									...drawerBlock.data,
									...patch
								}
							};
							setDrawerBlock(next);
						},
						onCommit: (data) => commitData(drawerBlock.id, data)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 187,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 184,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 172,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 169,
			columnNumber: 23
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 132,
		columnNumber: 10
	}, this);
}
var SortableBlock = (0, import_react.memo)(function SortableBlock({ block, expanded, onToggle, onCommitData, onDuplicate, onRemove, onToggleVisibility }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
	const def = getBlockDef(block.type);
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? .4 : 1
	};
	const [localData, setLocalData] = (0, import_react.useState)(block.data);
	const lastSavedRef = (0, import_react.useRef)(JSON.stringify(block.data));
	const timerRef = (0, import_react.useRef)(null);
	const inFlightRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const remote = JSON.stringify(block.data);
		if (remote !== lastSavedRef.current) {
			lastSavedRef.current = remote;
			setLocalData(block.data);
		}
	}, [block.data]);
	const flush = (0, import_react.useCallback)(() => {
		if (inFlightRef.current) return;
		const next = JSON.stringify(localData);
		if (next === lastSavedRef.current) return;
		inFlightRef.current = true;
		lastSavedRef.current = next;
		onCommitData(localData);
		setTimeout(() => {
			inFlightRef.current = false;
		}, 300);
	}, [localData, onCommitData]);
	(0, import_react.useEffect)(() => {
		if (JSON.stringify(localData) === lastSavedRef.current) return;
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(flush, 1e3);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [localData, flush]);
	function onKeyDown(e) {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
			e.preventDefault();
			if (timerRef.current) clearTimeout(timerRef.current);
			flush();
		}
	}
	const editorBlock = (0, import_react.useMemo)(() => ({
		...block,
		data: localData
	}), [block, localData]);
	const onUpdate = (0, import_react.useCallback)((patch) => {
		setLocalData((prev) => ({
			...prev,
			...patch
		}));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref: setNodeRef,
		style,
		className: `rounded-xl border border-border bg-card overflow-hidden ${!block.visible ? "opacity-60" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center gap-2 px-2.5 py-2 min-h-[52px] md:min-h-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					...attributes,
					...listeners,
					className: "h-9 w-9 md:h-7 md:w-7 grid place-items-center text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-manipulation",
					"aria-label": "جابجایی",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GripVertical, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 294,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 293,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: onToggle,
					className: "flex-1 flex items-center gap-2 min-w-0 text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "h-9 w-9 md:h-7 md:w-7 rounded-md bg-muted grid place-items-center text-foreground/70",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockIcon, { d: def.icon }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 298,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 297,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-sm font-medium truncate",
								children: def.label
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 301,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[11px] text-muted-foreground truncate",
								children: previewSummary(editorBlock)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 302,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 300,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition ms-auto ${expanded ? "rotate-180" : ""}` }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 306,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 296,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconBtn, {
							onClick: onToggleVisibility,
							title: block.visible ? "مخفی کردن" : "نمایش",
							children: block.visible ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 310,
								columnNumber: 30
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 310,
								columnNumber: 64
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 309,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconBtn, {
							onClick: onDuplicate,
							title: "کپی",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 313,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 312,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconBtn, {
							onClick: onRemove,
							title: "حذف",
							danger: true,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 316,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 315,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 308,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 292,
			columnNumber: 7
		}, this), expanded && /* @__PURE__ */ (void 0)("div", {
			className: "border-t border-border bg-muted/20 p-3.5",
			onBlur: flush,
			onKeyDown,
			children: /* @__PURE__ */ (void 0)(BlockEditor, {
				block: editorBlock,
				onUpdate
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 321,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 320,
			columnNumber: 20
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 291,
		columnNumber: 10
	}, this);
});
/** Debounced block editor for the mobile drawer — prevents rapid mutations. */
function DrawerBlockEditor({ block, onUpdate, onCommit }) {
	const [localData, setLocalData] = (0, import_react.useState)(block.data);
	const timerRef = (0, import_react.useRef)(null);
	const lastCommittedRef = (0, import_react.useRef)(JSON.stringify(block.data));
	(0, import_react.useEffect)(() => {
		const remote = JSON.stringify(block.data);
		if (remote !== lastCommittedRef.current) {
			lastCommittedRef.current = remote;
			setLocalData(block.data);
		}
	}, [block.data]);
	const handleUpdate = (0, import_react.useCallback)((patch) => {
		const next = {
			...localData,
			...patch
		};
		setLocalData(next);
		onUpdate(patch);
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			const nextStr = JSON.stringify(next);
			if (nextStr !== lastCommittedRef.current) {
				lastCommittedRef.current = nextStr;
				onCommit(next);
			}
		}, 800);
	}, [
		localData,
		onUpdate,
		onCommit
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockEditor, {
		block: {
			...block,
			data: localData
		},
		onUpdate: handleUpdate
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 365,
		columnNumber: 10
	}, this);
}
function IconBtn({ children, onClick, title, danger }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		onClick,
		title,
		className: `h-7 w-7 grid place-items-center rounded-md text-muted-foreground transition ${danger ? "hover:bg-rose-50 hover:text-rose-600" : "hover:bg-muted hover:text-foreground"}`,
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 381,
		columnNumber: 10
	}, this);
}
function previewSummary(b) {
	const d = b.data;
	switch (normalizeBlockType(b.type)) {
		case "header": return d.title;
		case "paragraph": return d.text;
		case "button": return `${d.label} → ${d.url}`;
		case "image": return d.url || "بدون تصویر";
		case "menu": return `${(d.items ?? []).length} آیتم`;
		case "social": return `${(d.links ?? []).length} شبکه`;
		case "faq": return `${(d.items ?? []).length} پرسش`;
		case "gallery": return `${(d.images ?? []).length} تصویر`;
		default: return getBlockDef(b.type).label;
	}
}
function BlockPicker({ onClose, onPick }) {
	const groups = [
		"صفحه",
		"متن",
		"رسانه",
		"تعامل",
		"اطلاعات",
		"پیشرفته"
	];
	if (useIsMobile()) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Drawer$1, {
		open: true,
		onOpenChange: (open) => {
			if (!open) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DrawerContent, {
			className: "max-h-[90vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DrawerHeader, {
				className: "text-right border-b border-border pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DrawerTitle, { children: "انتخاب بلوک" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 425,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DrawerDescription, {
					className: "text-xs",
					children: "نوع بلوکی که می‌خواهید اضافه کنید را انتخاب کنید"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 426,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 424,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "p-4 space-y-5 pb-8",
				style: { paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" },
				children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium",
					children: g
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 434,
					columnNumber: 17
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-3",
					children: BLOCK_DEFS.filter((b) => b.group === g).map((b) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => onPick(b.type),
						className: "rounded-xl border border-border bg-background hover:bg-muted/40 p-3.5 text-right transition active:scale-95 touch-manipulation min-h-[60px]",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "h-10 w-10 rounded-lg bg-muted grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockIcon, {
									d: b.icon,
									size: 18
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 441,
									columnNumber: 27
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 440,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-sm font-medium",
								children: b.label
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 443,
								columnNumber: 25
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 439,
							columnNumber: 23
						}, this)
					}, b.type, false, {
						fileName: _jsxFileName,
						lineNumber: 438,
						columnNumber: 67
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 437,
					columnNumber: 17
				}, this)] }, g, true, {
					fileName: _jsxFileName,
					lineNumber: 433,
					columnNumber: 30
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 430,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 423,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 420,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		onClick: onClose,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-foreground/40" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 455,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-popover border border-border shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "sticky top-0 bg-popover/95 backdrop-blur px-4 py-3 border-b border-border flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-sm font-semibold",
					children: "انتخاب بلوک"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 458,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: onClose,
					className: "h-8 w-8 rounded-md hover:bg-muted grid place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 460,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 459,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 457,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "p-4 space-y-5",
				children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium",
					children: g
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 465,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
					children: BLOCK_DEFS.filter((b) => b.group === g).map((b) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => onPick(b.type),
						className: "rounded-xl border border-border bg-background hover:bg-muted/40 p-3 text-right transition group",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "h-8 w-8 rounded-lg bg-muted grid place-items-center group-hover:bg-foreground group-hover:text-background transition",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockIcon, { d: b.icon }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 472,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 471,
								columnNumber: 23
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-sm font-medium",
								children: b.label
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 474,
								columnNumber: 23
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 470,
							columnNumber: 21
						}, this)
					}, b.type, false, {
						fileName: _jsxFileName,
						lineNumber: 469,
						columnNumber: 65
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 468,
					columnNumber: 15
				}, this)] }, g, true, {
					fileName: _jsxFileName,
					lineNumber: 464,
					columnNumber: 28
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 463,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 456,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 454,
		columnNumber: 10
	}, this);
}
//#endregion
export { PageBuilder as component };
