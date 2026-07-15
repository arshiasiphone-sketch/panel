import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as useRepositories, O as useSiteContent, s as touchLocalCmsEdit, x as usePageBlocks } from "./cms-TqyDBlHH.mjs";
import { D as ListChecks, E as LoaderCircle, I as FileText, J as CalendarDays, K as Check, N as GripHorizontal, T as LogOut, Y as Brain, g as Search, j as Image, k as LayoutDashboard, m as Settings, p as Sparkles, q as ChartColumn, r as UtensilsCrossed, s as Type, y as Plus } from "../_libs/lucide-react.mjs";
import { i as BlockRender } from "./blocks-SD5k4s2V.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-shell-kjqjnGqg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PhonePreview() {
	const { data: blocks } = usePageBlocks();
	const { data: site } = useSiteContent();
	const meta = site?.meta ?? {};
	const visible = (blocks ?? []).filter((b) => b.visible);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sticky top-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium",
			children: "پیش‌نمایش زنده"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-[300px] rounded-[2.4rem] border-[10px] border-foreground bg-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-5 bg-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 -translate-x-1/2 top-1.5 h-3 w-20 bg-foreground rounded-b-2xl" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-[560px] overflow-y-auto bg-background",
				dir: "rtl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 pt-5 pb-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto h-16 w-16 rounded-full bg-muted grid place-items-center overflow-hidden",
							children: meta.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: meta.avatar_url,
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-bold text-muted-foreground",
								children: (meta.title || "K").slice(0, 1)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-sm font-bold text-foreground",
							children: meta.title || "کافه خانه"
						}),
						meta.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground mt-0.5",
							children: meta.bio
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pb-6",
					children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-xs text-muted-foreground py-10",
						children: "هیچ بلوکی فعال نیست"
					}) : visible.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockRender, { block: {
						id: b.id,
						type: b.type,
						visible: b.visible,
						data: b.data ?? {}
					} }, b.id))
				})]
			})]
		})]
	});
}
/**
* Ephemeral UI state for the admin panel save indicator only.
* All CMS and production data lives in Supabase — see src/lib/cms.ts.
*/
var useAdmin = create()((set) => ({
	saveStatus: "idle",
	setSaveStatus: (saveStatus) => set({ saveStatus })
}));
var saveTimer;
var idleTimer;
function triggerSave() {
	const s = useAdmin.getState();
	s.setSaveStatus("saving");
	if (saveTimer) clearTimeout(saveTimer);
	if (idleTimer) clearTimeout(idleTimer);
	saveTimer = setTimeout(() => {
		s.setSaveStatus("saved");
		idleTimer = setTimeout(() => s.setSaveStatus("idle"), 1500);
	}, 600);
	touchLocalCmsEdit();
}
function SaveIndicator() {
	const status = useAdmin((s) => s.saveStatus);
	if (status === "idle") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground",
		children: "همگام"
	});
	if (status === "saving") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-xs text-muted-foreground inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " در حال ذخیره..."]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-xs text-emerald-600 inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " ذخیره شد"]
	});
}
function CommandPalette() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((o) => !o);
			}
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, []);
	function go(to) {
		navigate({ to });
		setOpen(false);
	}
	const icons = {
		"/admin": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }),
		"/admin/page": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
		"/admin/site-content": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "h-4 w-4" }),
		"/admin/menu": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "h-4 w-4" }),
		"/admin/gallery": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" }),
		"/admin/events": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }),
		"/admin/media": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" }),
		"/admin/test-analytics": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-4 w-4" }),
		"/admin/test-results": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }),
		"/admin/test-questions": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4" }),
		"/admin/personality-types": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
		"/admin/analytics": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }),
		"/admin/settings": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
	};
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4",
		onClick: () => setOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-foreground/30 backdrop-blur-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative w-full max-w-lg rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e, {
				label: "جستجو",
				className: "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border px-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
							placeholder: "جستجو یا اجرای دستور...",
							className: "flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "text-[10px] rounded border border-border px-1.5 py-0.5 text-muted-foreground",
							children: "ESC"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
					className: "max-h-80 overflow-y-auto p-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
						className: "py-6 text-center text-xs text-muted-foreground",
						children: "نتیجه‌ای یافت نشد"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
						heading: "پیمایش",
						children: ADMIN_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							onSelect: () => go(item.to),
							icon: icons[item.to] ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
							label: item.label
						}, item.to))
					})]
				})]
			})
		})]
	});
}
function Item({ onSelect, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
		onSelect,
		className: "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm cursor-pointer aria-selected:bg-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: icon
		}), label]
	});
}
var ADMIN_NAV = [
	{
		to: "/admin",
		label: "داشبورد",
		Icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/page",
		label: "سازنده صفحه",
		Icon: FileText
	},
	{
		to: "/admin/site-content",
		label: "محتوای سایت",
		Icon: Type
	},
	{
		to: "/admin/menu",
		label: "منو",
		Icon: UtensilsCrossed
	},
	{
		to: "/admin/gallery",
		label: "گالری",
		Icon: Image
	},
	{
		to: "/admin/events",
		label: "رویدادها",
		Icon: CalendarDays
	},
	{
		to: "/admin/media",
		label: "کتابخانه رسانه",
		Icon: Image
	},
	{
		to: "/admin/test-analytics",
		label: "آمار تست شخصیت",
		Icon: Brain
	},
	{
		to: "/admin/test-results",
		label: "پاسخ‌های تست",
		Icon: ChartColumn
	},
	{
		to: "/admin/test-questions",
		label: "سوالات تست",
		Icon: ListChecks
	},
	{
		to: "/admin/personality-types",
		label: "تیپ‌های شخصیتی",
		Icon: Sparkles
	},
	{
		to: "/admin/analytics",
		label: "آمار محتوا",
		Icon: ChartColumn
	},
	{
		to: "/admin/settings",
		label: "تنظیمات و تم",
		Icon: Settings
	}
];
/** Primary nav items shown in the bottom bar on mobile (top 5) */
var MOBILE_PRIMARY_NAV = ADMIN_NAV.slice(0, 5);
function PageHeader({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 md:mb-5 flex items-end justify-between gap-3 flex-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg md:text-xl font-bold text-foreground truncate",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1",
				children: subtitle
			})]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 shrink-0",
			children: actions
		})]
	});
}
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-border bg-card shadow-sm ${className}`,
		children
	});
}
function PrimaryButton({ children, ...p }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...p,
		className: `inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 md:px-3.5 md:py-2 text-sm font-medium hover:bg-foreground/90 transition disabled:opacity-50 min-h-[44px] ${p.className ?? ""}`,
		children
	});
}
function GhostButton({ children, tone, ...p }) {
	const toneClass = tone === "danger" ? "text-rose-600 border-rose-200 hover:bg-rose-50" : tone === "success" ? "text-emerald-700 border-emerald-200 hover:bg-emerald-50" : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...p,
		className: `inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 md:px-3.5 md:py-2 text-sm font-medium hover:bg-muted transition disabled:opacity-50 min-h-[44px] ${toneClass} ${p.className ?? ""}`,
		children
	});
}
function Input(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...p,
		className: `w-full rounded-lg border border-border bg-background px-3.5 py-3 md:px-3 md:py-2 text-sm outline-none focus:border-foreground/40 transition min-h-[44px] ${p.className ?? ""}`
	});
}
function Textarea(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...p,
		className: `w-full rounded-lg border border-border bg-background px-3.5 py-3 md:px-3 md:py-2 text-sm outline-none focus:border-foreground/40 transition ${p.className ?? ""}`
	});
}
function Label({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: `text-xs font-medium text-muted-foreground mb-1.5 block ${className}`,
		children
	});
}
function AdminShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const [mobileNav, setMobileNav] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	const { data: site } = useSiteContent();
	const title = (site?.meta)?.title || "کافه خانه";
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "min-h-screen bg-muted/30"
	});
	const hidePreview = ["/admin/media", "/admin/settings"].some((p) => pathname.startsWith(p));
	const isActive = (to, exact) => exact ? pathname === to : pathname.startsWith(to);
	const repos = useRepositories();
	async function signOut() {
		await repos.auth.signOut();
		location.reload();
	}
	const showMobilePrimary = pathname.startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: "rtl",
		className: "min-h-screen bg-muted/30 text-foreground font-sans pb-16 md:pb-0",
		style: {
			fontFamily: "\"Vazirmatn\", system-ui, sans-serif",
			paddingBottom: "env(safe-area-inset-bottom, 0px)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 h-12 md:h-14 bg-background/85 backdrop-blur border-b border-border flex items-center px-3 md:px-4 gap-2 md:gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileNav(true),
						className: "md:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-muted active:bg-muted/70 touch-manipulation",
						"aria-label": "منوی اصلی",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "20",
							height: "20",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 6h18M3 12h18M3 18h18" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						className: "flex items-center gap-2 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-8 w-8 md:h-7 md:w-7 rounded-lg bg-foreground text-background grid place-items-center text-xs md:text-[11px] font-bold",
							children: "ک"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold hidden sm:inline",
							children: title
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							const e = new KeyboardEvent("keydown", {
								key: "k",
								ctrlKey: true
							});
							document.dispatchEvent(e);
						},
						className: "flex-1 max-w-xs md:max-w-md mx-1 md:mx-2 flex items-center gap-2 rounded-lg border border-border bg-muted/50 hover:bg-muted px-3 py-2 md:py-1.5 text-xs text-muted-foreground transition min-h-[36px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden md:inline",
								children: "جستجو یا اجرای دستور..."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "md:hidden",
								children: "جستجو..."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "ms-auto hidden md:inline text-[10px] rounded border border-border bg-background px-1.5 py-0.5",
								children: "Ctrl K"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveIndicator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: signOut,
						title: "خروج",
						className: "h-10 w-10 md:h-8 md:w-8 rounded-md grid place-items-center hover:bg-muted text-muted-foreground active:bg-muted/70 touch-manipulation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
					})
				]
			}),
			mobileNav && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 md:hidden",
				onClick: () => setMobileNav(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "absolute bottom-0 right-0 left-0 max-h-[85vh] rounded-t-2xl bg-background border-t border-border overflow-y-auto pb-4",
					style: { paddingBottom: "env(safe-area-inset-bottom, 8px)" },
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sticky top-0 bg-background pt-3 pb-1 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-12 rounded-full bg-muted-foreground/30" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, {
							isActive,
							onPick: () => setMobileNav(false)
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)_360px] gap-4 px-3 md:px-4 py-3 md:py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "sticky top-[68px] rounded-2xl border border-border bg-card p-2 space-y-0.5 max-h-[calc(100vh-80px)] overflow-y-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, { isActive }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 pt-3 border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => navigate({ to: "/admin/page" }),
									className: "w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-2.5 text-xs font-semibold hover:bg-foreground/90 min-h-[44px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " افزودن بلوک"]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-w-0 pb-2",
						children
					}),
					!hidePreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhonePreview, {})
					})
				]
			}),
			showMobilePrimary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "fixed bottom-0 left-0 right-0 z-30 md:hidden bg-background/90 backdrop-blur-lg border-t border-border flex items-center justify-around px-1",
				style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
				children: [MOBILE_PRIMARY_NAV.map((item) => {
					const active = isActive(item.to, item.exact);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: `flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-0 flex-1 rounded-lg transition ${active ? "text-foreground" : "text-muted-foreground/70 hover:text-muted-foreground"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.Icon, {
								className: `h-5 w-5 ${active ? "drop-shadow-sm" : ""}`,
								strokeWidth: active ? 2.5 : 1.8
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] leading-tight truncate max-w-full ${active ? "font-semibold" : ""}`,
								children: item.label.slice(0, 8)
							}),
							active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-foreground" })
						]
					}, item.to);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setMobileNav(true),
					className: "flex flex-col items-center gap-0.5 py-1.5 px-2 text-muted-foreground/70 hover:text-muted-foreground transition",
					"aria-label": "بیشتر",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripHorizontal, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] leading-tight",
						children: "بیشتر"
					})]
				})]
			}),
			pathname === "/admin/page" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/page",
				onClick: () => {
					window.dispatchEvent(new CustomEvent("open-block-picker"));
				},
				className: "fixed bottom-20 right-4 md:hidden z-20 h-14 w-14 rounded-full bg-foreground text-background shadow-lg grid place-items-center hover:bg-foreground/90 active:scale-95 transition touch-manipulation",
				style: { bottom: "calc(4rem + env(safe-area-inset-bottom, 0px))" },
				"aria-label": "افزودن بلوک جدید",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "h-6 w-6",
					strokeWidth: 2.5
				})
			})
		]
	});
}
function NavList({ isActive, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: ADMIN_NAV.map((item) => {
		const active = isActive(item.to, item.exact);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: item.to,
			onClick: onPick,
			className: `flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 md:py-2 text-sm transition min-h-[44px] ${active ? "bg-foreground/[0.06] text-foreground font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.Icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 truncate",
				children: item.label
			})]
		}, item.to);
	}) });
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xl md:text-2xl font-bold mt-1",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-muted-foreground mt-1",
				children: hint
			})
		]
	});
}
//#endregion
export { Label as a, Stat as c, Input as i, Textarea as l, Card as n, PageHeader as o, GhostButton as r, PrimaryButton as s, AdminShell as t, triggerSave as u };
