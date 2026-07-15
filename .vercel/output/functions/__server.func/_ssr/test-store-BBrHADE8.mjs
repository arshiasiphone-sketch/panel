import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as useTheme } from "./cms-BC226ko6.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as OrbBackground } from "./orb-background-DbIowEgh.mjs";
import { n as LandingThemeProvider } from "./theme-provider-EzCoHy-a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test-store-BBrHADE8.js
var import_jsx_runtime = require_jsx_runtime();
function TestPageShell({ children, className = "", particleCount = 50, orbPrimary, orbSecondary }) {
	const { data: theme } = useTheme();
	const primary = orbPrimary ?? theme?.primary_color ?? "#9f1239";
	const secondary = orbSecondary ?? theme?.accent_color ?? theme?.secondary_color ?? "#d4af37";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		dir: "rtl",
		className: `relative min-h-screen overflow-hidden bg-background text-foreground ${className}`,
		style: { fontFamily: "Vazirmatn, system-ui, sans-serif" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbBackground, {
			primaryColor: primary,
			secondaryColor: secondary,
			particleCount
		}), children]
	}) });
}
var useTestStore = create()((set) => ({
	testStarted: false,
	userInfo: null,
	answers: {},
	lastResult: null,
	lastResponse: null,
	setUserInfo: (info) => set({ userInfo: info }),
	startTest: () => set({
		testStarted: true,
		answers: {},
		lastResult: null,
		lastResponse: null
	}),
	setAnswer: (questionId, optionId) => set((state) => ({ answers: {
		...state.answers,
		[questionId]: optionId
	} })),
	setCompletedResponse: (response) => set({
		lastResult: response.result,
		lastResponse: response
	}),
	resetTest: () => set({
		testStarted: false,
		answers: {},
		lastResult: null,
		lastResponse: null,
		userInfo: null
	})
}));
/** Session store is synchronous — always ready. */
function useHasHydrated() {
	return true;
}
//#endregion
export { useHasHydrated as n, useTestStore as r, TestPageShell as t };
