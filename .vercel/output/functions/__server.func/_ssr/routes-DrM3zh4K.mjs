import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as LandingThemeProvider } from "./theme-provider-kbqMZGiV.mjs";
import { t as Route } from "./routes-DTxFoRJr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DrM3zh4K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OrbBackground = (0, import_react.lazy)(() => import("./orb-background-DbIowEgh.mjs").then((n) => n.n).then((n) => n.n));
var LandingBlockRender = (0, import_react.lazy)(() => import("./landing-sections-BvlKRTsO.mjs").then((m) => ({ default: m.LandingBlockRender })));
var OrbFallback = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "absolute inset-0 -z-10 bg-background",
	"aria-hidden": "true"
});
var BlockFallback = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full h-48 animate-pulse rounded-lg bg-muted/20" });
function LandingPage() {
	const { theme, content } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingThemeProvider, {
		loaderTheme: theme,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			dir: "rtl",
			className: "relative min-h-screen overflow-hidden bg-background text-foreground",
			style: { fontFamily: "Vazirmatn, system-ui, sans-serif" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbFallback, {}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbBackground, {
						primaryColor: theme?.primary_color ?? "#9f1239",
						secondaryColor: theme?.accent_color ?? theme?.secondary_color ?? "#d4af37",
						particleCount: 70
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockFallback, {}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyPageSections, { content })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "relative px-5 py-10 text-center text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/admin",
						className: "text-xs hover:underline",
						children: "ورود به پنل مدیریت"
					})
				})
			]
		})
	});
}
function LazyPageSections({ content }) {
	const menu = content.menu;
	const gallery = content.gallery;
	const events = content.events;
	const testimonials = content.testimonials;
	const site = content.site;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_react.useMemo)(() => content.blocks.filter((b) => b.visible).sort((a, b) => a.sort_order - b.sort_order), [content.blocks]).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingBlockRender, {
		type: b.type,
		settings: b.data ?? {},
		ctx
	}, b.id)) });
}
//#endregion
export { LandingPage as component };
