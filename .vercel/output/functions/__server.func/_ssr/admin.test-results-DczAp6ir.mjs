import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { U as ChevronRight, W as ChevronLeft, a as User, g as Search, u as Trash2, z as Download } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as Card, o as PageHeader } from "./admin-shell-BJzvwuI4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useClearTestResponses, o as useTestResponses, r as useDeleteTestResponse } from "./test-db-CgaCB5a4.mjs";
import { t as useIsMobile } from "./use-mobile-DM96sOa1.mjs";
import { i as useResolvedProfiles } from "./personality-store-POoN25rC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.test-results-DczAp6ir.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.test-results.tsx?tsr-split=component";
var PAGE_SIZE = 10;
function TestResultsPage() {
	const { data: responses = [], isLoading, isError, error } = useTestResponses();
	const deleteOne = useDeleteTestResponse();
	const clearAll = useClearTestResponses();
	const profiles = useResolvedProfiles();
	const isMobile = useIsMobile();
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(1);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return responses.filter((r) => {
			if (filter !== "all" && r.result !== filter) return false;
			if (!q) return true;
			const name = (r.userInfo?.fullName ?? "").toLowerCase();
			const phone = (r.userInfo?.phone ?? "").toLowerCase();
			return name.includes(q) || phone.includes(q);
		});
	}, [
		responses,
		query,
		filter
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, pages);
	const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
	function exportCsv() {
		const csv = [[
			"نام",
			"تلفن",
			"سن",
			"جنسیت",
			"نتیجه",
			"تاریخ"
		], ...filtered.map((r) => [
			r.userInfo?.fullName ?? "",
			r.userInfo?.phone ?? "",
			r.userInfo?.age?.toString() ?? "",
			r.userInfo?.gender ?? "",
			profiles[r.result].label,
			new Date(r.completedAt).toLocaleString("fa-IR")
		])].map((row) => row.map((c) => `"${String(c).replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `test-results-${Date.now()}.csv`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("خروجی CSV آماده شد");
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 52,
		columnNumber: 12
	}, this);
	if (isError) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "text-center text-sm text-destructive py-10",
		children: error instanceof Error ? error.message : "خطا در بارگذاری"
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 55,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "پاسخ‌های تست شخصیت",
			subtitle: "جستجو، فیلتر، خروجی",
			actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: exportCsv,
					className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 md:px-2.5 md:py-1.5 text-xs font-medium hover:bg-accent min-h-[44px]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-3.5 w-3.5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 15
					}, this), " CSV"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 61,
					columnNumber: 13
				}, this), responses.length > 0 && /* @__PURE__ */ (void 0)("button", {
					disabled: clearAll.isPending,
					onClick: () => {
						if (!confirm("حذف همه پاسخ‌ها؟")) return;
						clearAll.mutate(void 0, {
							onSuccess: () => toast.success("همه پاسخ‌ها پاک شد"),
							onError: (e) => toast.error(e.message)
						});
					},
					className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 md:px-2.5 md:py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 min-h-[44px]",
					children: [/* @__PURE__ */ (void 0)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 17
					}, this), " پاکسازی"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 64,
					columnNumber: 38
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 60,
				columnNumber: 86
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 60,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "mb-3 p-3",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col md:flex-row gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 79,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setPage(1);
						},
						placeholder: "جستجو بر اساس نام یا تلفن...",
						className: "w-full rounded-lg border border-border bg-background pr-9 pl-3 py-3 text-sm min-h-[44px]"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 80,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
					value: filter,
					onChange: (e) => {
						setFilter(e.target.value);
						setPage(1);
					},
					className: "rounded-lg border border-border bg-background px-3 py-3 text-sm min-h-[44px]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
						value: "all",
						children: "همه تیپ‌ها"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 89,
						columnNumber: 13
					}, this), [
						"paparoch",
						"zhampin",
						"fofino",
						"gombak",
						"bedone"
					].map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
						value: t,
						children: profiles[t].label
					}, t, false, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 100
					}, this))]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 85,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 77,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 76,
			columnNumber: 7
		}, this),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-12 text-center text-sm text-muted-foreground",
			children: "پاسخی یافت نشد."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 98,
			columnNumber: 32
		}, this) : isMobile ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-col gap-3",
			children: slice.map((r) => {
				const p = profiles[r.result];
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3 flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
								style: { background: p.color },
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(User, { className: "h-5 w-5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 109,
									columnNumber: 23
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 106,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-sm font-semibold truncate",
										children: r.userInfo?.fullName ?? "ناشناس"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 112,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs text-muted-foreground",
										dir: "ltr",
										children: r.userInfo?.phone ?? "—"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 115,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[11px] text-muted-foreground mt-1",
										children: new Date(r.completedAt).toLocaleString("fa-IR")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 118,
										columnNumber: 23
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 111,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 105,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col items-end gap-2 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
									style: {
										background: p.bgColor,
										color: p.color,
										border: `1px solid ${p.borderColor}`
									},
									children: p.label
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 124,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex gap-1.5 text-muted-foreground text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [r.userInfo?.age ?? "—", " سال"] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 132,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "/" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 133,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: r.userInfo?.gender ?? "—" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 134,
											columnNumber: 23
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 131,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									disabled: deleteOne.isPending,
									onClick: () => deleteOne.mutate(r.id, { onError: (e) => toast.error(e.message) }),
									className: "text-destructive/70 hover:text-destructive p-2 disabled:opacity-50 min-h-[36px] min-w-[36px]",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 139,
										columnNumber: 23
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 136,
									columnNumber: 21
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 123,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 17
					}, this)
				}, r.id, false, {
					fileName: _jsxFileName,
					lineNumber: 103,
					columnNumber: 16
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 100,
			columnNumber: 30
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
					className: "text-xs text-muted-foreground border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "نام"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 150,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "تلفن"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 151,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "سن"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 152,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "جنسیت"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 153,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "نتیجه"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 154,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "تاریخ"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 155,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 156,
							columnNumber: 19
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 149,
						columnNumber: 17
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 148,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: slice.map((r) => {
					const p = profiles[r.result];
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
						className: "border-b border-border/40 hover:bg-accent/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 px-2 font-medium",
								children: r.userInfo?.fullName ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 163,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 px-2 text-muted-foreground",
								dir: "ltr",
								children: r.userInfo?.phone ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 164,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 px-2 text-muted-foreground",
								children: r.userInfo?.age ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 167,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 px-2 text-muted-foreground",
								children: r.userInfo?.gender ?? "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 168,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 px-2",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold",
									style: {
										background: p.bgColor,
										color: p.color,
										border: `1px solid ${p.borderColor}`
									},
									children: p.label
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 172,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 171,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 px-2 text-xs text-muted-foreground",
								children: new Date(r.completedAt).toLocaleString("fa-IR")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 180,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 px-2 text-left",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									disabled: deleteOne.isPending,
									onClick: () => deleteOne.mutate(r.id, { onError: (e) => toast.error(e.message) }),
									className: "text-destructive/70 hover:text-destructive p-2 disabled:opacity-50",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 187,
										columnNumber: 27
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 184,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 183,
								columnNumber: 23
							}, this)
						]
					}, r.id, true, {
						fileName: _jsxFileName,
						lineNumber: 162,
						columnNumber: 22
					}, this);
				}) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 159,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 147,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 146,
			columnNumber: 11
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 145,
			columnNumber: 18
		}, this),
		pages > 1 && /* @__PURE__ */ (void 0)("div", {
			className: "flex items-center justify-between pt-4 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (void 0)("span", { children: [
				"صفحه ",
				safePage,
				" از ",
				pages,
				" — ",
				filtered.length,
				" نتیجه"
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 199,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (void 0)("button", {
					disabled: safePage === 1,
					onClick: () => setPage(safePage - 1),
					className: "rounded-lg border border-border px-3 py-2 min-h-[44px] font-medium hover:bg-accent disabled:opacity-40 inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (void 0)(ChevronRight, { className: "h-3.5 w-3.5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 204,
						columnNumber: 15
					}, this), " قبلی"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 203,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)("button", {
					disabled: safePage === pages,
					onClick: () => setPage(safePage + 1),
					className: "rounded-lg border border-border px-3 py-2 min-h-[44px] font-medium hover:bg-accent disabled:opacity-40 inline-flex items-center gap-1",
					children: ["بعدی ", /* @__PURE__ */ (void 0)(ChevronLeft, { className: "h-3.5 w-3.5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 207,
						columnNumber: 20
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 206,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 202,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 198,
			columnNumber: 21
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 59,
		columnNumber: 10
	}, this);
}
//#endregion
export { TestResultsPage as component };
