import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { S as usePageViewStats, d as useAllMenuItems, l as useAllEvents, u as useAllGalleryImages, x as usePageBlocks } from "./cms-8dCoOJLq.mjs";
import { X as ArrowUpRight, p as Sparkles } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Stat, n as Card, o as PageHeader } from "./admin-shell-Dw5XLj0B.mjs";
import { o as useTestResponses } from "./test-db-Vev5yU4J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-B_KI-r9_.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { data: menu = [] } = useAllMenuItems();
	const { data: blocks = [] } = usePageBlocks();
	const { data: events = [] } = useAllEvents();
	const { data: gallery = [] } = useAllGalleryImages();
	const { data: testResponses = [] } = useTestResponses();
	const { data: views, isLoading: viewsLoading, isError: viewsError } = usePageViewStats();
	const recentTests = testResponses.slice(0, 5);
	const totalVisits = viewsLoading ? "…" : viewsError ? "—" : (views?.total ?? 0).toLocaleString("fa-IR");
	const todayVisits = viewsLoading ? "…" : viewsError ? "—" : (views?.today ?? 0).toLocaleString("fa-IR");
	const viewsHint = viewsError ? "خطا در بارگذاری" : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "داشبورد",
			subtitle: "نمای کلی از محتوای سایت و تست شخصیت"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "بلوک‌های صفحه",
					value: blocks.length,
					hint: `${blocks.filter((b) => b.visible).length} فعال`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "آیتم منو",
					value: menu.length,
					hint: `${menu.filter((m) => m.visible).length} نمایش داده می‌شود`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "رویدادها",
					value: events.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "پاسخ تست",
					value: testResponses.length,
					hint: "پایگاه داده"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "کل بازدیدهای سایت",
				value: totalVisits,
				hint: viewsHint
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "بازدیدهای امروز",
				value: todayVisits,
				hint: viewsHint
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "محتوای منتشرشده"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "داده‌های واقعی از پایگاه داده"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/page",
						className: "text-xs text-foreground/70 hover:text-foreground inline-flex items-center gap-1",
						children: ["سازنده صفحه ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "گالری",
							value: gallery.length,
							to: "/admin/gallery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "منو",
							value: menu.length,
							to: "/admin/menu"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "رویداد",
							value: events.length,
							to: "/admin/events"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "بلوک",
							value: blocks.length,
							to: "/admin/page"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold mb-3",
					children: "دسترسی سریع"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
							to: "/admin/page",
							label: "ویرایش صفحه اصلی"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
							to: "/admin/site-content",
							label: "محتوای سایت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
							to: "/admin/personality-types",
							label: "تیپ‌های شخصیتی"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
							to: "/admin/settings",
							label: "تنظیمات و تم"
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mt-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "پاسخ‌های اخیر تست"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/test-results",
					className: "text-xs text-foreground/70 hover:text-foreground",
					children: "همه"
				})]
			}), recentTests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center text-sm text-muted-foreground py-8",
				children: "هنوز پاسخی ثبت نشده."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: recentTests.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-7 w-7 rounded-full bg-muted grid place-items-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-foreground",
							children: r.userInfo?.fullName ?? "ناشناس"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground text-[10px]",
							dir: "ltr",
							children: new Date(r.completedAt).toLocaleString()
						})]
					})]
				}, r.id))
			})]
		})
	] });
}
function MiniStat({ label, value, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "rounded-xl border border-border bg-muted/30 p-3 hover:bg-muted/50 transition",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xl font-bold mt-1",
			children: value.toLocaleString("fa-IR")
		})]
	});
}
function QuickLink({ to, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: "text-foreground/80 hover:text-foreground hover:underline",
		children: label
	}) });
}
//#endregion
export { Dashboard as component };
