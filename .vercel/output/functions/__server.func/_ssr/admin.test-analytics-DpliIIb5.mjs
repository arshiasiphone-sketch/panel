import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { V as CircleCheck, Y as Brain, i as Users, l as TrendingUp } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as Card, o as PageHeader } from "./admin-shell-DVodOT7B.mjs";
import { o as useTestResponses } from "./test-db-ZAvCjgvs.mjs";
import { i as useResolvedProfiles } from "./personality-store-WkM56xXr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.test-analytics-DpliIIb5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.test-analytics.tsx?tsr-split=component";
function TestAnalyticsPage() {
	const { data: responses = [], isLoading, isError, error } = useTestResponses();
	const profiles = useResolvedProfiles();
	const stats = (0, import_react.useMemo)(() => {
		const total = responses.length;
		const dist = {
			paparoch: 0,
			zhampin: 0,
			fofino: 0,
			gombak: 0,
			bedone: 0
		};
		for (const r of responses) dist[r.result] = (dist[r.result] ?? 0) + 1;
		const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
		return {
			total,
			dist,
			mostCommon: total > 0 ? sorted[0][0] : null,
			recent: responses.slice(0, 6),
			completionRate: total > 0 ? 100 : 0
		};
	}, [responses]);
	const max = Math.max(1, ...Object.values(stats.dist));
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "آمار تست شخصیت",
			subtitle: "مرور نتایج ذخیره‌شده در پایگاه داده"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 46,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 49,
						columnNumber: 21
					}, this),
					label: "کل پاسخ‌ها",
					value: stats.total.toLocaleString("fa-IR")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 49,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 21
					}, this),
					label: "نرخ تکمیل",
					value: `${stats.completionRate}٪`
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 50,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Brain, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 51,
						columnNumber: 21
					}, this),
					label: "پرتکرارترین تیپ",
					value: stats.mostCommon ? profiles[stats.mostCommon].label : "—"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TrendingUp, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 52,
						columnNumber: 21
					}, this),
					label: "هفت روز گذشته",
					value: responses.filter((r) => Date.now() - new Date(r.completedAt).getTime() < 7 * 864e5).length.toLocaleString("fa-IR")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 52,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 48,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
				className: "text-sm font-semibold mb-3",
				children: "توزیع تیپ‌های شخصیتی"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 56,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-2.5",
				children: [
					"paparoch",
					"zhampin",
					"fofino",
					"gombak",
					"bedone"
				].map((t) => {
					const p = profiles[t];
					const v = stats.dist[t] ?? 0;
					const pct = Math.round(v / max * 100);
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "w-20 font-semibold",
								style: { color: p.color },
								children: p.label
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 63,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex-1 h-2 rounded-full overflow-hidden bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "h-full rounded-full transition-all",
									style: {
										width: `${pct}%`,
										background: p.color
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 69,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 68,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "w-12 text-left text-muted-foreground",
								children: v
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 74,
								columnNumber: 17
							}, this)
						]
					}, t, true, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 18
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 57,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 55,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
			className: "text-sm font-semibold mb-3",
			children: "نتایج اخیر"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 81,
			columnNumber: 9
		}, this), stats.recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center text-sm text-muted-foreground py-10",
			children: "هنوز پاسخی ثبت نشده."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 82,
			columnNumber: 38
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
			className: "divide-y divide-border",
			children: stats.recent.map((r) => {
				const p = profiles[r.result];
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
					className: "py-2.5 flex items-center justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "inline-block w-2 h-2 rounded-full",
								style: { background: p.color }
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 89,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-medium",
								children: r.userInfo?.fullName ?? "ناشناس"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 92,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-muted-foreground",
								children: ["— ", p.label]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 93,
								columnNumber: 21
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 88,
						columnNumber: 19
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs text-muted-foreground",
						children: new Date(r.completedAt).toLocaleDateString("fa-IR")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 19
					}, this)]
				}, r.id, true, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 18
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 84,
			columnNumber: 20
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 80,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 45,
		columnNumber: 10
	}, this);
}
function Stat({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-2xl border border-border bg-card p-4 flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center gap-1.5 text-muted-foreground text-xs",
			children: [icon, label]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 114,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-xl font-bold",
			children: value
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 118,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 113,
		columnNumber: 10
	}, this);
}
//#endregion
export { TestAnalyticsPage as component };
