import { A as useTheme } from "./cms-kjwVWmsc.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as OrbBackground } from "./orb-background-CxvtWqni.mjs";
import { n as LandingThemeProvider } from "./theme-provider-CNZZS8z4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test-store-BzWeVUeS.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/components/test/test-page-shell.tsx";
function TestPageShell({ children, className = "", particleCount = 50, orbPrimary, orbSecondary }) {
	const { data: theme } = useTheme();
	const primary = orbPrimary ?? theme?.primary_color ?? "#9f1239";
	const secondary = orbSecondary ?? theme?.accent_color ?? theme?.secondary_color ?? "#d4af37";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LandingThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		dir: "rtl",
		className: `relative min-h-screen overflow-hidden bg-background text-foreground ${className}`,
		style: { fontFamily: "Vazirmatn, system-ui, sans-serif" },
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(OrbBackground, {
			primaryColor: primary,
			secondaryColor: secondary,
			particleCount
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 33,
			columnNumber: 9
		}, this), children]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 28,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 27,
		columnNumber: 5
	}, this);
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
