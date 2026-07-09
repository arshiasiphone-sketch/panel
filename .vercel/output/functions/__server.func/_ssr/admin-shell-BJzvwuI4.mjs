import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { D as useRepositories, O as useSiteContent, s as touchLocalCmsEdit, x as usePageBlocks } from "./cms-DpxCyY4I.mjs";
import { D as ListChecks, E as LoaderCircle, I as FileText, J as CalendarDays, K as Check, N as GripHorizontal, T as LogOut, Y as Brain, g as Search, j as Image, k as LayoutDashboard, m as Settings, p as Sparkles, q as ChartColumn, r as UtensilsCrossed, s as Type, y as Plus } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as BlockRender } from "./blocks-QGV7I2Iw.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-shell-BJzvwuI4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$3 = "C:/Users/Admin/Desktop/final/myproject/src/components/admin/phone-preview.tsx";
function PhonePreview() {
	const { data: blocks } = usePageBlocks();
	const { data: site } = useSiteContent();
	const meta = site?.meta ?? {};
	const visible = (blocks ?? []).filter((b) => b.visible);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "sticky top-6",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium",
			children: "پیش‌نمایش زنده"
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 13,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto w-[300px] rounded-[2.4rem] border-[10px] border-foreground bg-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative h-5 bg-foreground",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute left-1/2 -translate-x-1/2 top-1.5 h-3 w-20 bg-foreground rounded-b-2xl" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 18,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 17,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "h-[560px] overflow-y-auto bg-background",
				dir: "rtl",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "px-4 pt-5 pb-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mx-auto h-16 w-16 rounded-full bg-muted grid place-items-center overflow-hidden",
							children: meta.avatar_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: meta.avatar_url,
								className: "h-full w-full object-cover"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 24,
								columnNumber: 17
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-lg font-bold text-muted-foreground",
								children: (meta.title || "K").slice(0, 1)
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 26,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 22,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-2 text-sm font-bold text-foreground",
							children: meta.title || "کافه خانه"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 31,
							columnNumber: 13
						}, this),
						meta.bio && /* @__PURE__ */ (void 0)("div", {
							className: "text-[11px] text-muted-foreground mt-0.5",
							children: meta.bio
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 34,
							columnNumber: 26
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 21,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pb-6",
					children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-center text-xs text-muted-foreground py-10",
						children: "هیچ بلوکی فعال نیست"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 38,
						columnNumber: 15
					}, this) : visible.map((b) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockRender, { block: {
						id: b.id,
						type: b.type,
						visible: b.visible,
						data: b.data ?? {}
					} }, b.id, false, {
						fileName: _jsxFileName$3,
						lineNumber: 43,
						columnNumber: 17
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 36,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 20,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 16,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 12,
		columnNumber: 5
	}, this);
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
var _jsxFileName$2 = "C:/Users/Admin/Desktop/final/myproject/src/components/admin/save-indicator.tsx";
function SaveIndicator() {
	const status = useAdmin((s) => s.saveStatus);
	if (status === "idle") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "text-xs text-muted-foreground",
		children: "همگام"
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 6,
		columnNumber: 33
	}, this);
	if (status === "saving") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "text-xs text-muted-foreground inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-3 w-3 animate-spin" }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 10,
			columnNumber: 9
		}, this), " در حال ذخیره..."]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 9,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "text-xs text-emerald-600 inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-3 w-3" }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 15,
			columnNumber: 7
		}, this), " ذخیره شد"]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 14,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "C:/Users/Admin/Desktop/final/myproject/src/components/admin/command-palette.tsx";
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
		"/admin": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartColumn, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 41,
			columnNumber: 15
		}, this),
		"/admin/page": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 42,
			columnNumber: 20
		}, this),
		"/admin/site-content": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Type, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 43,
			columnNumber: 28
		}, this),
		"/admin/menu": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UtensilsCrossed, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 44,
			columnNumber: 20
		}, this),
		"/admin/gallery": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 45,
			columnNumber: 23
		}, this),
		"/admin/events": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarDays, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 46,
			columnNumber: 22
		}, this),
		"/admin/media": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 47,
			columnNumber: 21
		}, this),
		"/admin/test-analytics": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Brain, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 48,
			columnNumber: 30
		}, this),
		"/admin/test-results": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartColumn, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 49,
			columnNumber: 28
		}, this),
		"/admin/test-questions": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListChecks, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 50,
			columnNumber: 30
		}, this),
		"/admin/personality-types": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 51,
			columnNumber: 33
		}, this),
		"/admin/analytics": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartColumn, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 52,
			columnNumber: 25
		}, this),
		"/admin/settings": /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Settings, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 53,
			columnNumber: 24
		}, this)
	};
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4",
		onClick: () => setOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-foreground/30 backdrop-blur-sm" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 62,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative w-full max-w-lg rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e, {
				label: "جستجو",
				className: "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 border-b border-border px-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 72,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Input, {
							placeholder: "جستجو یا اجرای دستور...",
							className: "flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 73,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("kbd", {
							className: "text-[10px] rounded border border-border px-1.5 py-0.5 text-muted-foreground",
							children: "ESC"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 77,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 71,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.List, {
					className: "max-h-80 overflow-y-auto p-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Empty, {
						className: "py-6 text-center text-xs text-muted-foreground",
						children: "نتیجه‌ای یافت نشد"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 82,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Group, {
						heading: "پیمایش",
						children: ADMIN_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Item, {
							onSelect: () => go(item.to),
							icon: icons[item.to] ?? /* @__PURE__ */ (void 0)(FileText, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 90,
								columnNumber: 43
							}, this),
							label: item.label
						}, item.to, false, {
							fileName: _jsxFileName$1,
							lineNumber: 87,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 85,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 81,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 67,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 63,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 58,
		columnNumber: 5
	}, this);
}
function Item({ onSelect, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Item, {
		onSelect,
		className: "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm cursor-pointer aria-selected:bg-muted",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-muted-foreground",
			children: icon
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 116,
			columnNumber: 7
		}, this), label]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 112,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/components/admin/admin-shell.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mb-4 md:mb-5 flex items-end justify-between gap-3 flex-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-lg md:text-xl font-bold text-foreground truncate",
				children: title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 83,
				columnNumber: 9
			}, this), subtitle && /* @__PURE__ */ (void 0)("p", {
				className: "text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1",
				children: subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 84,
				columnNumber: 22
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 82,
			columnNumber: 7
		}, this), actions && /* @__PURE__ */ (void 0)("div", {
			className: "flex items-center gap-2 shrink-0",
			children: actions
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 86,
			columnNumber: 19
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 81,
		columnNumber: 5
	}, this);
}
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `rounded-2xl border border-border bg-card shadow-sm ${className}`,
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 93,
		columnNumber: 5
	}, this);
}
function PrimaryButton({ children, ...p }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		...p,
		className: `inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 md:px-3.5 md:py-2 text-sm font-medium hover:bg-foreground/90 transition disabled:opacity-50 min-h-[44px] ${p.className ?? ""}`,
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 104,
		columnNumber: 5
	}, this);
}
function GhostButton({ children, tone, ...p }) {
	const toneClass = tone === "danger" ? "text-rose-600 border-rose-200 hover:bg-rose-50" : tone === "success" ? "text-emerald-700 border-emerald-200 hover:bg-emerald-50" : "";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		...p,
		className: `inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 md:px-3.5 md:py-2 text-sm font-medium hover:bg-muted transition disabled:opacity-50 min-h-[44px] ${toneClass} ${p.className ?? ""}`,
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 125,
		columnNumber: 5
	}, this);
}
function Input(p) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
		...p,
		className: `w-full rounded-lg border border-border bg-background px-3.5 py-3 md:px-3 md:py-2 text-sm outline-none focus:border-foreground/40 transition min-h-[44px] ${p.className ?? ""}`
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 136,
		columnNumber: 5
	}, this);
}
function Textarea(p) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
		...p,
		className: `w-full rounded-lg border border-border bg-background px-3.5 py-3 md:px-3 md:py-2 text-sm outline-none focus:border-foreground/40 transition ${p.className ?? ""}`
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 145,
		columnNumber: 5
	}, this);
}
function Label({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
		className: `text-xs font-medium text-muted-foreground mb-1.5 block ${className}`,
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 154,
		columnNumber: 5
	}, this);
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
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		dir: "rtl",
		className: "min-h-screen bg-muted/30"
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 171,
		columnNumber: 24
	}, this);
	const hidePreview = ["/admin/media", "/admin/settings"].some((p) => pathname.startsWith(p));
	const isActive = (to, exact) => exact ? pathname === to : pathname.startsWith(to);
	const repos = useRepositories();
	async function signOut() {
		await repos.auth.signOut();
		location.reload();
	}
	const showMobilePrimary = pathname.startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		dir: "rtl",
		className: "min-h-screen bg-muted/30 text-foreground font-sans pb-16 md:pb-0",
		style: {
			fontFamily: "\"Vazirmatn\", system-ui, sans-serif",
			paddingBottom: "env(safe-area-inset-bottom, 0px)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CommandPalette, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 195,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "sticky top-0 z-30 h-12 md:h-14 bg-background/85 backdrop-blur border-b border-border flex items-center px-3 md:px-4 gap-2 md:gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => setMobileNav(true),
						className: "md:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-muted active:bg-muted/70 touch-manipulation",
						"aria-label": "منوی اصلی",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
							width: "20",
							height: "20",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M3 6h18M3 12h18M3 18h18" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 213,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 205,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 200,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/admin",
						className: "flex items-center gap-2 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "h-8 w-8 md:h-7 md:w-7 rounded-lg bg-foreground text-background grid place-items-center text-xs md:text-[11px] font-bold",
							children: "ک"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 218,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-sm font-bold hidden sm:inline",
							children: title
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 221,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 217,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							const e = new KeyboardEvent("keydown", {
								key: "k",
								ctrlKey: true
							});
							document.dispatchEvent(e);
						},
						className: "flex-1 max-w-xs md:max-w-md mx-1 md:mx-2 flex items-center gap-2 rounded-lg border border-border bg-muted/50 hover:bg-muted px-3 py-2 md:py-1.5 text-xs text-muted-foreground transition min-h-[36px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "h-3.5 w-3.5 shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 232,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "hidden md:inline",
								children: "جستجو یا اجرای دستور..."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 233,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "md:hidden",
								children: "جستجو..."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 234,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("kbd", {
								className: "ms-auto hidden md:inline text-[10px] rounded border border-border bg-background px-1.5 py-0.5",
								children: "Ctrl K"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 235,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 225,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SaveIndicator, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 240,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: signOut,
						title: "خروج",
						className: "h-10 w-10 md:h-8 md:w-8 rounded-md grid place-items-center hover:bg-muted text-muted-foreground active:bg-muted/70 touch-manipulation",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 247,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 242,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 198,
				columnNumber: 7
			}, this),
			mobileNav && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-40 md:hidden",
				onClick: () => setMobileNav(false),
				children: [/* @__PURE__ */ (void 0)("div", { className: "absolute inset-0 bg-foreground/40" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 254,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("aside", {
					className: "absolute bottom-0 right-0 left-0 max-h-[85vh] rounded-t-2xl bg-background border-t border-border overflow-y-auto pb-4",
					style: { paddingBottom: "env(safe-area-inset-bottom, 8px)" },
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "sticky top-0 bg-background pt-3 pb-1 flex justify-center",
						children: /* @__PURE__ */ (void 0)("div", { className: "h-1.5 w-12 rounded-full bg-muted-foreground/30" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 262,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 261,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "px-3 pt-2",
						children: /* @__PURE__ */ (void 0)(NavList, {
							isActive,
							onPick: () => setMobileNav(false)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 265,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 264,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 255,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 253,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)_360px] gap-4 px-3 md:px-4 py-3 md:py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
						className: "hidden md:block",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
							className: "sticky top-[68px] rounded-2xl border border-border bg-card p-2 space-y-0.5 max-h-[calc(100vh-80px)] overflow-y-auto",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NavList, { isActive }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 276,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3 pt-3 border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									onClick: () => navigate({ to: "/admin/page" }),
									className: "w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-2.5 text-xs font-semibold hover:bg-foreground/90 min-h-[44px]",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 282,
										columnNumber: 17
									}, this), " افزودن بلوک"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 278,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 277,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 275,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 274,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
						className: "min-w-0 pb-2",
						children
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 288,
						columnNumber: 9
					}, this),
					!hidePreview && /* @__PURE__ */ (void 0)("aside", {
						className: "hidden lg:block",
						children: /* @__PURE__ */ (void 0)(PhonePreview, {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 292,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 291,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 272,
				columnNumber: 7
			}, this),
			showMobilePrimary && /* @__PURE__ */ (void 0)("nav", {
				className: "fixed bottom-0 left-0 right-0 z-30 md:hidden bg-background/90 backdrop-blur-lg border-t border-border flex items-center justify-around px-1",
				style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
				children: [MOBILE_PRIMARY_NAV.map((item) => {
					const active = isActive(item.to, item.exact);
					return /* @__PURE__ */ (void 0)(Link, {
						to: item.to,
						className: `flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-0 flex-1 rounded-lg transition ${active ? "text-foreground" : "text-muted-foreground/70 hover:text-muted-foreground"}`,
						children: [
							/* @__PURE__ */ (void 0)(item.Icon, {
								className: `h-5 w-5 ${active ? "drop-shadow-sm" : ""}`,
								strokeWidth: active ? 2.5 : 1.8
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 315,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("span", {
								className: `text-[10px] leading-tight truncate max-w-full ${active ? "font-semibold" : ""}`,
								children: item.label.slice(0, 8)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 319,
								columnNumber: 17
							}, this),
							active && /* @__PURE__ */ (void 0)("span", { className: "absolute -top-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-foreground" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 327,
								columnNumber: 19
							}, this)
						]
					}, item.to, true, {
						fileName: _jsxFileName,
						lineNumber: 306,
						columnNumber: 15
					}, this);
				}), /* @__PURE__ */ (void 0)("button", {
					onClick: () => setMobileNav(true),
					className: "flex flex-col items-center gap-0.5 py-1.5 px-2 text-muted-foreground/70 hover:text-muted-foreground transition",
					"aria-label": "بیشتر",
					children: [/* @__PURE__ */ (void 0)(GripHorizontal, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 339,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("span", {
						className: "text-[10px] leading-tight",
						children: "بیشتر"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 340,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 334,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 299,
				columnNumber: 9
			}, this),
			pathname === "/admin/page" && /* @__PURE__ */ (void 0)(Link, {
				to: "/admin/page",
				onClick: () => {
					window.dispatchEvent(new CustomEvent("open-block-picker"));
				},
				className: "fixed bottom-20 right-4 md:hidden z-20 h-14 w-14 rounded-full bg-foreground text-background shadow-lg grid place-items-center hover:bg-foreground/90 active:scale-95 transition touch-manipulation",
				style: { bottom: "calc(4rem + env(safe-area-inset-bottom, 0px))" },
				"aria-label": "افزودن بلوک جدید",
				children: /* @__PURE__ */ (void 0)(Plus, {
					className: "h-6 w-6",
					strokeWidth: 2.5
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 357,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 347,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 187,
		columnNumber: 5
	}, this);
}
function NavList({ isActive, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: ADMIN_NAV.map((item) => {
		const active = isActive(item.to, item.exact);
		return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
			to: item.to,
			onClick: onPick,
			className: `flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 md:py-2 text-sm transition min-h-[44px] ${active ? "bg-foreground/[0.06] text-foreground font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(item.Icon, { className: "h-4 w-4 shrink-0" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 386,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "flex-1 truncate",
				children: item.label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 387,
				columnNumber: 13
			}, this)]
		}, item.to, true, {
			fileName: _jsxFileName,
			lineNumber: 376,
			columnNumber: 11
		}, this);
	}) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 372,
		columnNumber: 5
	}, this);
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-2xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-xs text-muted-foreground",
				children: label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 406,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-xl md:text-2xl font-bold mt-1",
				children: value
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 407,
				columnNumber: 7
			}, this),
			hint && /* @__PURE__ */ (void 0)("div", {
				className: "text-[11px] text-muted-foreground mt-1",
				children: hint
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 408,
				columnNumber: 16
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 405,
		columnNumber: 5
	}, this);
}
//#endregion
export { Label as a, Stat as c, Input as i, Textarea as l, Card as n, PageHeader as o, GhostButton as r, PrimaryButton as s, AdminShell as t, triggerSave as u };
