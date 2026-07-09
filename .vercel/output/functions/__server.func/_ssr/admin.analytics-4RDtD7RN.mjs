import { _ as useEvents, d as useAllMenuItems, k as useTestimonials, u as useAllGalleryImages, x as usePageBlocks } from "./cms-kjwVWmsc.mjs";
import { H as CircleAlert } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { c as Stat, n as Card, o as PageHeader } from "./admin-shell-DVodOT7B.mjs";
import { o as useTestResponses } from "./test-db-ZAvCjgvs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-4RDtD7RN.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "C:/Users/Admin/Desktop/final/myproject/src/components/admin/session-only-banner.tsx";
function UnavailableFeature({ title, detail }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-2xl border border-border bg-card p-10 text-center max-w-lg mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleAlert, { className: "h-10 w-10 mx-auto text-muted-foreground/50 mb-3" }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 22,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-lg font-bold",
				children: title
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 23,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground mt-2",
				children: detail
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 24,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 21,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.analytics.tsx?tsr-split=component";
function AnalyticsPage() {
	const { data: menu = [] } = useAllMenuItems();
	const { data: blocks = [] } = usePageBlocks();
	const { data: events = [] } = useEvents();
	const { data: gallery = [] } = useAllGalleryImages();
	const { data: testimonials = [] } = useTestimonials();
	const { data: testResponses = [] } = useTestResponses();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "آمار",
			subtitle: "معیارهای محتوا و تست شخصیت"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 25,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UnavailableFeature, {
			title: "آمار ترافیک در دسترس نیست",
			detail: "ردیابی بازدیدکنندگان، کلیک‌ها و منابع ترافیک به سرویس آنالیتیکس خارجی نیاز دارد و هنوز پیکربندی نشده است."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 27,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					label: "بلوک‌های صفحه",
					value: blocks.length
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 30,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					label: "آیتم منو",
					value: menu.length
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 31,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					label: "تصاویر گالری",
					value: gallery.length
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 32,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					label: "پاسخ تست",
					value: testResponses.length
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 33,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 29,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-sm font-semibold mb-3",
					children: "محتوای سایت"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 38,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "بلوک‌های فعال",
							value: blocks.filter((b) => b.visible).length
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 40,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "رویدادهای فعال",
							value: events.filter((e) => e.visible).length
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 41,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "نظرات فعال",
							value: testimonials.length
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 42,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
							label: "آیتم‌های منوی فعال",
							value: menu.filter((m) => m.visible).length
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 43,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 39,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 37,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-sm font-semibold mb-3",
					children: "تست شخصیت"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 11
				}, this), testResponses.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-sm text-muted-foreground py-6 text-center",
					children: "هنوز پاسخی ثبت نشده."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 48,
					columnNumber: 41
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
					className: "space-y-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
						label: "کل پاسخ‌ها",
						value: testResponses.length
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 51,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Row, {
						label: "۷ روز اخیر",
						value: testResponses.filter((r) => Date.now() - new Date(r.completedAt).getTime() < 7 * 864e5).length
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 52,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 50,
					columnNumber: 22
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 46,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 36,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 24,
		columnNumber: 10
	}, this);
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
		className: "flex items-center justify-between py-1 border-b border-border last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 66,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "font-semibold",
			children: value.toLocaleString("fa-IR")
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 67,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 65,
		columnNumber: 10
	}, this);
}
//#endregion
export { AnalyticsPage as component };
