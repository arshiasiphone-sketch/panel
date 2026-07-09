import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { A as useTheme, O as useSiteContent, T as useRecordPageView, _ as useEvents, b as useMenuItems, k as useTestimonials, v as useGalleryImages, x as usePageBlocks } from "./cms-kjwVWmsc.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as LandingThemeProvider } from "./theme-provider-CNZZS8z4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B8_lf0Ax.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/index.tsx?tsr-split=component";
var OrbBackground = (0, import_react.lazy)(() => import("./orb-background-CxvtWqni.mjs").then((n) => n.n).then((n) => n.n));
var LandingBlockRender = (0, import_react.lazy)(() => import("./landing-sections-BwI1uZbu.mjs").then((m) => ({ default: m.LandingBlockRender })));
var OrbFallback = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: "absolute inset-0 -z-10 bg-background",
	"aria-hidden": "true"
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 8,
	columnNumber: 27
}, void 0);
var BlockFallback = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full h-48 animate-pulse rounded-lg bg-muted/20" }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 9,
	columnNumber: 29
}, void 0);
function LandingPage() {
	useRecordPageView();
	const { data: theme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LandingThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		dir: "rtl",
		className: "relative min-h-screen overflow-hidden bg-background text-foreground",
		style: { fontFamily: "Vazirmatn, system-ui, sans-serif" },
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(OrbFallback, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 19,
					columnNumber: 29
				}, this),
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(OrbBackground, {
					primaryColor: theme?.primary_color ?? "#9f1239",
					secondaryColor: theme?.accent_color ?? theme?.secondary_color ?? "#d4af37",
					particleCount: 70
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 20,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 19,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockFallback, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 23,
					columnNumber: 29
				}, this),
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LazyPageSections, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 24,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 23,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "relative px-5 py-10 text-center text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
					href: "/admin",
					className: "text-xs hover:underline",
					children: "ورود به پنل مدیریت"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 28,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 27,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 16,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 15,
		columnNumber: 10
	}, this);
}
function LazyPageSections() {
	const { data: menu = [] } = useMenuItems();
	const { data: gallery = [] } = useGalleryImages();
	const { data: events = [] } = useEvents();
	const { data: testimonials = [] } = useTestimonials();
	const { data: site } = useSiteContent();
	const { data: blocks = [] } = usePageBlocks();
	const ctx = (0, import_react.useMemo)(() => ({
		menu,
		gallery,
		events,
		testimonials,
		site
	}), [
		menu,
		gallery,
		events,
		testimonials,
		site
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: (0, import_react.useMemo)(() => blocks.filter((b) => b.visible).sort((a, b) => a.sort_order - b.sort_order), [blocks]).map((b) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LandingBlockRender, {
		type: b.type,
		settings: b.data ?? {},
		ctx
	}, b.id, false, {
		fileName: _jsxFileName,
		lineNumber: 63,
		columnNumber: 25
	}, this)) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 62,
		columnNumber: 10
	}, this);
}
//#endregion
export { LandingPage as component };
