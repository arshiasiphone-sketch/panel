import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { V as CircleCheck, Y as Brain, i as Users, l as TrendingUp } from "../_libs/lucide-react.mjs";
import { n as Card, o as PageHeader } from "./admin-shell-DA8sdzOb.mjs";
import { o as useTestResponses } from "./test-db-DaL_iz8g.mjs";
import { i as useResolvedProfiles } from "./personality-store-B4NZghru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.test-analytics-DS6wA9l9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-destructive py-10",
		children: error instanceof Error ? error.message : "خطا"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "آمار تست شخصیت",
			subtitle: "مرور نتایج ذخیره‌شده در پایگاه داده"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
					label: "کل پاسخ‌ها",
					value: stats.total.toLocaleString("fa-IR")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
					label: "نرخ تکمیل",
					value: `${stats.completionRate}٪`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-4 w-4" }),
					label: "پرتکرارترین تیپ",
					value: stats.mostCommon ? profiles[stats.mostCommon].label : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
					label: "هفت روز گذشته",
					value: responses.filter((r) => Date.now() - new Date(r.completedAt).getTime() < 7 * 864e5).length.toLocaleString("fa-IR")
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold mb-3",
				children: "توزیع تیپ‌های شخصیتی"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-20 font-semibold",
								style: { color: p.color },
								children: p.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 h-2 rounded-full overflow-hidden bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full transition-all",
									style: {
										width: `${pct}%`,
										background: p.color
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-12 text-left text-muted-foreground",
								children: v
							})
						]
					}, t);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-semibold mb-3",
			children: "نتایج اخیر"
		}), stats.recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center text-sm text-muted-foreground py-10",
			children: "هنوز پاسخی ثبت نشده."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: stats.recent.map((r) => {
				const p = profiles[r.result];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-2.5 flex items-center justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block w-2 h-2 rounded-full",
								style: { background: p.color }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: r.userInfo?.fullName ?? "ناشناس"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["— ", p.label]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: new Date(r.completedAt).toLocaleDateString("fa-IR")
					})]
				}, r.id);
			})
		})] })
	] });
}
function Stat({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4 flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 text-muted-foreground text-xs",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xl font-bold",
			children: value
		})]
	});
}
//#endregion
export { TestAnalyticsPage as component };
