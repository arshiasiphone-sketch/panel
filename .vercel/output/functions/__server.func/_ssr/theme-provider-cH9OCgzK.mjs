import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as useRealtimeCmsSync, O as useTheme } from "./cms-BzqQuhMP.mjs";
import { a as deriveTokens, i as applyTokensToElement, n as LANDING_THEME_CLASS, o as themeRowToDocument, s as tokensToCss } from "./css-vars-C0sowH2S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-provider-cH9OCgzK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THEME_STYLE_ID = "cms-landing-theme";
/** Keeps CMS realtime invalidation active app-wide (admin + landing). */
var CmsSyncProvider = (0, import_react.memo)(function CmsSyncProvider({ children }) {
	useRealtimeCmsSync();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
});
/**
* Applies the NAMA Theme Engine output inside the landing wrapper.
*
* Two paths run in parallel:
*   1. The `<style>` tag carries the canonical CSS rule (works during SSR /
*      initial render before React hydration).
*   2. After hydration, the same vars are also set imperatively on the wrapper
*      element. This makes preset / token changes propagate WITHOUT recreating
*      the `<style>` node — eliminating any flicker on live preview.
*
* Admin routes intentionally keep the static design-system tokens from
* `styles.css` — this provider only wraps the landing route.
*/
var LandingThemeProvider = (0, import_react.memo)(function LandingThemeProvider({ children, loaderTheme }) {
	const { data: liveRow } = useTheme();
	const row = liveRow ?? loaderTheme;
	const wrapperRef = (0, import_react.useRef)(null);
	const tokens = (0, import_react.useMemo)(() => {
		if (!row) return null;
		return deriveTokens(themeRowToDocument(row));
	}, [row]);
	const css = (0, import_react.useMemo)(() => tokens ? tokensToCss(tokens) : null, [tokens]);
	(0, import_react.useEffect)(() => {
		if (!tokens) return;
		let raf = 0;
		raf = requestAnimationFrame(() => {
			applyTokensToElement(wrapperRef.current, tokens);
		});
		return () => cancelAnimationFrame(raf);
	}, [tokens]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapperRef,
		className: LANDING_THEME_CLASS,
		children: [css ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
			id: THEME_STYLE_ID,
			dangerouslySetInnerHTML: { __html: css }
		}) : null, children]
	});
});
//#endregion
export { LandingThemeProvider as n, CmsSyncProvider as t };
