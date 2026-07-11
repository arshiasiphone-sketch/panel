import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { U as ChevronRight, W as ChevronLeft, a as User, g as Search, u as Trash2, z as Download } from "../_libs/lucide-react.mjs";
import { n as Card, o as PageHeader } from "./admin-shell-CGsGoG9-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useClearTestResponses, o as useTestResponses, r as useDeleteTestResponse } from "./test-db-BwcleoaA.mjs";
import { t as useIsMobile } from "./use-mobile-DM96sOa1.mjs";
import { i as useResolvedProfiles } from "./personality-store-W-EML35s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.test-results-DS-AdZvY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-destructive py-10",
		children: error instanceof Error ? error.message : "خطا در بارگذاری"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "پاسخ‌های تست شخصیت",
			subtitle: "جستجو، فیلتر، خروجی",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: exportCsv,
					className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 md:px-2.5 md:py-1.5 text-xs font-medium hover:bg-accent min-h-[44px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " CSV"]
				}), responses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: clearAll.isPending,
					onClick: () => {
						if (!confirm("حذف همه پاسخ‌ها؟")) return;
						clearAll.mutate(void 0, {
							onSuccess: () => toast.success("همه پاسخ‌ها پاک شد"),
							onError: (e) => toast.error(e.message)
						});
					},
					className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 md:px-2.5 md:py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 min-h-[44px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " پاکسازی"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-3 p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setPage(1);
						},
						placeholder: "جستجو بر اساس نام یا تلفن...",
						className: "w-full rounded-lg border border-border bg-background pr-9 pl-3 py-3 text-sm min-h-[44px]"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: filter,
					onChange: (e) => {
						setFilter(e.target.value);
						setPage(1);
					},
					className: "rounded-lg border border-border bg-background px-3 py-3 text-sm min-h-[44px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "همه تیپ‌ها"
					}), [
						"paparoch",
						"zhampin",
						"fofino",
						"gombak",
						"bedone"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t,
						children: profiles[t].label
					}, t))]
				})]
			})
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-12 text-center text-sm text-muted-foreground",
			children: "پاسخی یافت نشد."
		}) : isMobile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: slice.map((r) => {
				const p = profiles[r.result];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
								style: { background: p.color },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold truncate",
										children: r.userInfo?.fullName ?? "ناشناس"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										dir: "ltr",
										children: r.userInfo?.phone ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground mt-1",
										children: new Date(r.completedAt).toLocaleString("fa-IR")
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end gap-2 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
									style: {
										background: p.bgColor,
										color: p.color,
										border: `1px solid ${p.borderColor}`
									},
									children: p.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1.5 text-muted-foreground text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r.userInfo?.age ?? "—", " سال"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.userInfo?.gender ?? "—" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: deleteOne.isPending,
									onClick: () => deleteOne.mutate(r.id, { onError: (e) => toast.error(e.message) }),
									className: "text-destructive/70 hover:text-destructive p-2 disabled:opacity-50 min-h-[36px] min-w-[36px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})
							]
						})]
					})
				}, r.id);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-xs text-muted-foreground border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "نام"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "تلفن"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "سن"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "جنسیت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "نتیجه"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2.5 px-2 font-medium",
							children: "تاریخ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: slice.map((r) => {
					const p = profiles[r.result];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/40 hover:bg-accent/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 px-2 font-medium",
								children: r.userInfo?.fullName ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 px-2 text-muted-foreground",
								dir: "ltr",
								children: r.userInfo?.phone ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 px-2 text-muted-foreground",
								children: r.userInfo?.age ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 px-2 text-muted-foreground",
								children: r.userInfo?.gender ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 px-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold",
									style: {
										background: p.bgColor,
										color: p.color,
										border: `1px solid ${p.borderColor}`
									},
									children: p.label
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 px-2 text-xs text-muted-foreground",
								children: new Date(r.completedAt).toLocaleString("fa-IR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 px-2 text-left",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: deleteOne.isPending,
									onClick: () => deleteOne.mutate(r.id, { onError: (e) => toast.error(e.message) }),
									className: "text-destructive/70 hover:text-destructive p-2 disabled:opacity-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})
							})
						]
					}, r.id);
				}) })]
			})
		}) }),
		pages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between pt-4 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"صفحه ",
				safePage,
				" از ",
				pages,
				" — ",
				filtered.length,
				" نتیجه"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: safePage === 1,
					onClick: () => setPage(safePage - 1),
					className: "rounded-lg border border-border px-3 py-2 min-h-[44px] font-medium hover:bg-accent disabled:opacity-40 inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }), " قبلی"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: safePage === pages,
					onClick: () => setPage(safePage + 1),
					className: "rounded-lg border border-border px-3 py-2 min-h-[44px] font-medium hover:bg-accent disabled:opacity-40 inline-flex items-center gap-1",
					children: ["بعدی ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })]
				})]
			})]
		})
	] });
}
//#endregion
export { TestResultsPage as component };
