import { S as usePageViewStats, d as useAllMenuItems, l as useAllEvents, u as useAllGalleryImages, x as usePageBlocks } from "./cms-kjwVWmsc.mjs";
import { X as ArrowUpRight, p as Sparkles } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Stat, n as Card, o as PageHeader } from "./admin-shell-DVodOT7B.mjs";
import { o as useTestResponses } from "./test-db-ZAvCjgvs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index--0L-x83h.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.index.tsx?tsr-split=component";
function Dashboard() {
	const { data: menu = [] } = useAllMenuItems();
	const { data: blocks = [] } = usePageBlocks();
	const { data: events = [] } = useAllEvents();
	const { data: gallery = [] } = useAllGalleryImages();
	const { data: testResponses = [] } = useTestResponses();
	const { data: views, isLoading: viewsLoading, isError: viewsError } = usePageViewStats();
	const recentTests = testResponses.slice(0, 5);
	const totalVisits = viewsLoading ? "…" : viewsError ? "—" : (views?.total ?? 0).toLocaleString("fa-IR");
	const todayVisits = viewsLoading ? "…" : viewsError ? "—" : (views?.today ?? 0).toLocaleString("fa-IR");
	const viewsHint = viewsError ? "خطا در بارگذاری" : void 0;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "داشبورد",
			subtitle: "نمای کلی از محتوای سایت و تست شخصیت"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 32,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					label: "بلوک‌های صفحه",
					value: blocks.length,
					hint: `${blocks.filter((b) => b.visible).length} فعال`
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 35,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					label: "آیتم منو",
					value: menu.length,
					hint: `${menu.filter((m) => m.visible).length} نمایش داده می‌شود`
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 36,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					label: "رویدادها",
					value: events.length
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 37,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					label: "پاسخ تست",
					value: testResponses.length,
					hint: "پایگاه داده"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 38,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 34,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-2 gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
				label: "کل بازدیدهای سایت",
				value: totalVisits,
				hint: viewsHint
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 42,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
				label: "بازدیدهای امروز",
				value: todayVisits,
				hint: viewsHint
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 43,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 41,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "lg:col-span-2 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-end justify-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-sm font-semibold",
						children: "محتوای منتشرشده"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-xs text-muted-foreground",
						children: "داده‌های واقعی از پایگاه داده"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 51,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 49,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/admin/page",
						className: "text-xs text-foreground/70 hover:text-foreground inline-flex items-center gap-1",
						children: ["سازنده صفحه ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { className: "h-3 w-3" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 54,
							columnNumber: 27
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 53,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 48,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MiniStat, {
							label: "گالری",
							value: gallery.length,
							to: "/admin/gallery"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 58,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MiniStat, {
							label: "منو",
							value: menu.length,
							to: "/admin/menu"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 59,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MiniStat, {
							label: "رویداد",
							value: events.length,
							to: "/admin/events"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 60,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MiniStat, {
							label: "بلوک",
							value: blocks.length,
							to: "/admin/page"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 61,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 47,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-sm font-semibold mb-3",
					children: "دسترسی سریع"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QuickLink, {
							to: "/admin/page",
							label: "ویرایش صفحه اصلی"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QuickLink, {
							to: "/admin/site-content",
							label: "محتوای سایت"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QuickLink, {
							to: "/admin/personality-types",
							label: "تیپ‌های شخصیتی"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 70,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QuickLink, {
							to: "/admin/settings",
							label: "تنظیمات و تم"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 71,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 67,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 65,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 46,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-4 mt-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-sm font-semibold",
					children: "پاسخ‌های اخیر تست"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/admin/test-results",
					className: "text-xs text-foreground/70 hover:text-foreground",
					children: "همه"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 79,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 77,
				columnNumber: 9
			}, this), recentTests.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-center text-sm text-muted-foreground py-8",
				children: "هنوز پاسخی ثبت نشده."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 83,
				columnNumber: 37
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
				className: "space-y-2",
				children: recentTests.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
					className: "flex items-start gap-2.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-7 w-7 rounded-full bg-muted grid place-items-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-3 w-3" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 86,
							columnNumber: 19
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 85,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-medium text-foreground",
							children: r.userInfo?.fullName ?? "ناشناس"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 89,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-muted-foreground text-[10px]",
							dir: "ltr",
							children: new Date(r.completedAt).toLocaleString()
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 92,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 88,
						columnNumber: 17
					}, this)]
				}, r.id, true, {
					fileName: _jsxFileName,
					lineNumber: 84,
					columnNumber: 35
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 83,
				columnNumber: 130
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 76,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 31,
		columnNumber: 10
	}, this);
}
function MiniStat({ label, value, to }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
		to,
		className: "rounded-xl border border-border bg-muted/30 p-3 hover:bg-muted/50 transition",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-[11px] text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 111,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-xl font-bold mt-1",
			children: value.toLocaleString("fa-IR")
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 112,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 110,
		columnNumber: 10
	}, this);
}
function QuickLink({ to, label }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
		to,
		className: "text-foreground/80 hover:text-foreground hover:underline",
		children: label
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 123,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 122,
		columnNumber: 10
	}, this);
}
//#endregion
export { Dashboard as component };
