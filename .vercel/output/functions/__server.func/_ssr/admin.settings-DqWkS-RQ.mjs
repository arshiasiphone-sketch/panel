import { o as __toESM } from "../_runtime.mjs";
import { b as themeSchema } from "./theme-SnWyrOGi.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { A as useTheme, L as useUpsertSiteContent, M as useUpdateTheme, O as useSiteContent, t as DEFAULT_THEME_SETTINGS } from "./cms-kjwVWmsc.mjs";
import { C as Monitor, E as LoaderCircle, G as ChevronDown, K as Check, S as Moon, _ as Save, b as Palette, f as Sun, p as Sparkles } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, s as PrimaryButton, u as triggerSave } from "./admin-shell-DVodOT7B.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as deriveTokens, i as applyTokensToElement, n as LANDING_THEME_CLASS, o as themeRowToDocument, r as applyDocumentToRow, t as DEFAULT_KNOBS } from "./css-vars-C0sowH2S.mjs";
import { r as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-DqWkS-RQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/**
* ThemeLivePreview — real-time preview of the NAMA theme engine output.
*
* Takes the current theme row, derives all tokens via the engine, and renders
* a self-contained preview card with sample UI elements that reflect every
* token category (colors, radius, shadows, glass, gradients, typography).
*
* The preview updates automatically whenever `useTheme()` returns fresh data
* (after any preset apply or manual color field edit).
*/
var _jsxFileName$2 = "C:/Users/Admin/Desktop/final/myproject/src/components/admin/theme-live-preview.tsx";
var cx = (...c) => c.filter(Boolean).join(" ");
var sectionTitleCls = "text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mb-2.5";
function Swatch({ label, cssVar, color }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex items-center gap-2",
		title: `${cssVar}: ${color}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "h-5 w-5 rounded-md shrink-0 ring-1 ring-black/5",
			style: { background: color }
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 39,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-[11px] text-muted-foreground truncate font-mono",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 43,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 38,
		columnNumber: 5
	}, this);
}
function SwatchGrid({ title, colorEntries }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
		className: sectionTitleCls,
		children: title
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 51,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-2 gap-x-3 gap-y-1",
		children: colorEntries.map(([label, color]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Swatch, {
			label,
			cssVar: `--nama-${label}`,
			color
		}, label, false, {
			fileName: _jsxFileName$2,
			lineNumber: 54,
			columnNumber: 11
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 52,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 50,
		columnNumber: 5
	}, this);
}
function SampleButton({ variant = "primary" }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		className: cx("rounded-[var(--nama-radius-md)] px-3.5 py-1.5 text-xs font-semibold", "shadow-[var(--nama-shadow-sm)] hover:shadow-[var(--nama-shadow-md)]", "transition-all duration-[var(--nama-motion-fast)]", {
			primary: "bg-[var(--nama-primary)] text-[var(--nama-primary-fg)]",
			secondary: "bg-[var(--nama-secondary)] text-[var(--nama-secondary-fg)]",
			accent: "bg-[var(--nama-accent)] text-[var(--nama-accent-fg)]"
		}[variant]),
		children: variant === "primary" ? "دکمه اصلی" : variant === "secondary" ? "دکمه ثانویه" : "دکمه تاکید"
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 70,
		columnNumber: 5
	}, this);
}
function SampleCard() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-[var(--nama-radius-lg)] p-3 shadow-[var(--nama-shadow-sm)]",
		style: {
			background: "var(--nama-card)",
			color: "var(--nama-card-fg)",
			border: "1px solid var(--nama-border)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "h-2 w-16 rounded-[var(--nama-radius-sm)] mb-2",
				style: { background: "var(--nama-muted)" }
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 93,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "h-2 w-24 rounded-[var(--nama-radius-sm)] mb-1",
				style: { background: "var(--nama-muted)" }
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 97,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "h-2 w-20 rounded-[var(--nama-radius-sm)]",
				style: { background: "var(--nama-muted)" }
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 101,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 85,
		columnNumber: 5
	}, this);
}
function SampleGlass() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-[var(--nama-radius-lg)] p-3",
		style: {
			background: "var(--nama-glass-tint)",
			backdropFilter: `blur(var(--nama-glass-blur)) saturate(var(--nama-glass-saturation))`,
			WebkitBackdropFilter: `blur(var(--nama-glass-blur)) saturate(var(--nama-glass-saturation))`,
			border: "1px solid var(--nama-glass-border)",
			boxShadow: "var(--nama-glass-depth)"
		},
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "h-6 w-6 rounded-full",
				style: { background: "var(--nama-primary)" }
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 122,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "h-2 w-14 rounded-[var(--nama-radius-sm)]",
					style: { background: "var(--nama-foreground)" }
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 124,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "h-1.5 w-20 rounded-[var(--nama-radius-sm)] mt-1",
					style: { background: "var(--nama-muted)" }
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 128,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 123,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 121,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 111,
		columnNumber: 5
	}, this);
}
function SampleGradient() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-[var(--nama-radius-lg)] h-12 flex items-center justify-center",
		style: { background: "var(--nama-gradient-button)" },
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-[11px] font-bold",
			style: { color: "var(--nama-accent-fg)" },
			children: "گرادینت برند"
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 144,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 140,
		columnNumber: 5
	}, this);
}
function TokenSection({ title, defaultOpen = false, children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("details", {
		open: defaultOpen,
		className: "group",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("summary", {
			className: "cursor-pointer text-[11px] font-semibold text-foreground/70 hover:text-foreground py-1.5 select-none",
			children: [title, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "mr-1 text-muted-foreground/40 group-open:rotate-90 inline-block transition-transform",
				children: "▶"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 166,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 164,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "pt-1.5 space-y-3",
			children
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 170,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 163,
		columnNumber: 5
	}, this);
}
var ThemeLivePreview = (0, import_react.memo)(function ThemeLivePreview() {
	const { data: theme } = useTheme();
	const wrapperRef = (0, import_react.useRef)(null);
	const tokens = (0, import_react.useMemo)(() => {
		if (!theme) return null;
		return deriveTokens(themeRowToDocument(theme));
	}, [theme]);
	(0, import_react.useEffect)(() => {
		if (!tokens) return;
		const raf = requestAnimationFrame(() => {
			applyTokensToElement(wrapperRef.current, tokens);
		});
		return () => cancelAnimationFrame(raf);
	}, [tokens]);
	if (!theme || !tokens) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-2xl border border-border bg-card p-5 mb-3",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-sm text-muted-foreground",
			children: "در حال بارگذاری پیش‌نمایش..."
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 199,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 198,
		columnNumber: 7
	}, this);
	const c = tokens.colors;
	const r = tokens.radius;
	const colorEntries = [
		["primary", c.primary],
		["primary-hover", c.primaryHover],
		["primary-fg", c.primaryForeground],
		["secondary", c.secondary],
		["accent", c.accent],
		["background", c.background],
		["surface", c.surface],
		["foreground", c.foreground],
		["muted", c.muted],
		["muted-fg", c.mutedForeground],
		["text-secondary", c.textSecondary],
		["text-tertiary", c.textTertiary],
		["border", c.border],
		["card", c.card],
		["card-fg", c.cardForeground],
		["success", c.success],
		["warning", c.warning],
		["danger", c.danger],
		["info", c.info]
	];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between px-5 pt-4 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-sm font-semibold",
				children: "پیش‌نمایش زنده تم"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 233,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: "تمام توکن‌های مشتق شده از تنظیمات فعلی"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 234,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 232,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/50",
				children: "NAMA Engine v1"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 238,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 231,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			ref: wrapperRef,
			className: LANDING_THEME_CLASS,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mx-5 mb-4 rounded-2xl overflow-hidden border border-border/60",
				style: {
					background: "var(--nama-background)",
					color: "var(--nama-foreground)"
				},
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between px-4 py-2 text-[10px]",
						style: { color: "var(--nama-text-secondary)" },
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "۱۲:۳۰" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 256,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Monitor, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 258,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Moon, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 259,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sun, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 260,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 257,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 252,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "px-4 pb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
									style: {
										background: "var(--nama-primary)",
										color: "var(--nama-primary-fg)"
									},
									children: "ک"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 268,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-sm font-bold",
									style: { color: "var(--nama-foreground)" },
									children: "کافه خانه"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 275,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-[11px]",
									style: { color: "var(--nama-text-secondary)" },
									children: "طعم‌های بی‌نهایت"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 278,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 274,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 267,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-[var(--nama-radius-lg)] p-3 text-center mb-3",
								style: { background: "var(--nama-gradient-cta)" },
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-sm font-bold",
									style: { color: "var(--nama-primary-fg)" },
									children: "منوی امروز"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 289,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 285,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-[var(--nama-radius-md)] p-2.5 flex items-center justify-between",
									style: {
										background: "var(--nama-surface)",
										border: "1px solid var(--nama-border)"
									},
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs",
										style: { color: "var(--nama-foreground)" },
										children: "اسپرسو"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 303,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-bold",
										style: { color: "var(--nama-primary)" },
										children: "۸۵۰۰۰"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 306,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 296,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-[var(--nama-radius-md)] p-2.5 flex items-center justify-between",
									style: {
										background: "var(--nama-surface)",
										border: "1px solid var(--nama-border)"
									},
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs",
										style: { color: "var(--nama-foreground)" },
										children: "کاپوچینو"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 317,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-bold",
										style: { color: "var(--nama-primary)" },
										children: "۱۲۰۰۰۰"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 320,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 310,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 295,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 265,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 250,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 245,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "px-5 pb-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TokenSection, {
						title: "🔵  رنگ‌ها (Colors)",
						defaultOpen: true,
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SwatchGrid, {
								title: "Brand",
								colorEntries: colorEntries.slice(0, 3)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 332,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SwatchGrid, {
								title: "Surfaces",
								colorEntries: colorEntries.slice(3, 10)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 333,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SwatchGrid, {
								title: "Text",
								colorEntries: colorEntries.slice(10, 13)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 334,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SwatchGrid, {
								title: "Borders & States",
								colorEntries: colorEntries.slice(13)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 335,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 331,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TokenSection, {
						title: "🎨  نمونه اجزاء (Sample UI)",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: sectionTitleCls,
									children: "Buttons"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 341,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SampleButton, { variant: "primary" }, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 343,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SampleButton, { variant: "secondary" }, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 344,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SampleButton, { variant: "accent" }, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 345,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 342,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 340,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: sectionTitleCls,
									children: "Card"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 349,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SampleCard, {}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 350,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 348,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: sectionTitleCls,
									children: "Glass"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 353,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SampleGlass, {}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 354,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 352,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: sectionTitleCls,
									children: "Gradient"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 357,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SampleGradient, {}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 358,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 356,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 339,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 338,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TokenSection, {
						title: "📐  ابعاد (Radius)",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								["xs", r.xs],
								["sm", r.sm],
								["md", r.md],
								["lg", r.lg],
								["xl", r.xl],
								["full", r.full]
							].map(([label, val]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "h-6 w-6 border border-border/50",
									style: { borderRadius: val }
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 376,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] font-mono text-muted-foreground",
									children: label
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 380,
									columnNumber: 19
								}, this)]
							}, label, true, {
								fileName: _jsxFileName$2,
								lineNumber: 375,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 364,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 363,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TokenSection, {
						title: "✨  Glass & Shadow",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
								className: sectionTitleCls,
								children: "Glass"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 389,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1 text-[10px] font-mono text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: ["blur: ", tokens.glass.blur] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 391,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: ["opacity: ", tokens.glass.opacity] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 392,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: ["saturation: ", tokens.glass.saturation] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 393,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 390,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 388,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
								className: sectionTitleCls,
								children: "Shadow"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 397,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1 text-[10px] font-mono text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: ["opacity: ", tokens.shadow.opacity] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 399,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
									"radius: ",
									tokens.shadow.radius,
									"px"
								] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 400,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 398,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 396,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 387,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 386,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 330,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 244,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 229,
		columnNumber: 5
	}, this);
});
/**
* Theme presets — complete visual identities for the NAMA Theme Engine.
*
* Each preset is a complete `ThemeDocument`: base palette + knobs that
* drive shadow opacity, glass blur, motion duration, hover scale, gradient
* angle, radius, etc. The engine derives every downstream token from these
* inputs (no manual lighter/darker variants kept in the preset).
*
* IMPORTANT: Radius is NOT changed between presets — all presets inherit
* radius from ThemeEngine defaults. Only glass, shadow, gradient, hover,
* opacity, and color properties change between presets.
*
* Backward-compatible exports (`THEME_PRESETS`, `toThemePatch`,
* `matchActivePreset`, `PRESET_SWATCH_KEYS`, `ExtendedThemeSettings`,
* `getPresetVisualTokens`) preserve the existing admin / DB integration.
*/
/**
* The eight canonical NAMA presets.
*
* Each preset carries its own glass, shadow, and gradient personality.
* Radius is inherited from ThemeEngine defaults — never overridden here.
*/
var BLUEPRINTS = [
	{
		id: "cappuccino",
		name: "کاپوچینو",
		nameEn: "Cappuccino",
		description: "گرم و صمیمی، مناسب کافه و رستوران",
		base: {
			primary: "#8B5E3C",
			secondary: "#A67C52",
			accent: "#D4A373",
			background: "#FFF8F1",
			foreground: "#2F241E",
			textSecondary: "#6B5B4D",
			textTertiary: "#9C8A78",
			success: "#2E7D32",
			warning: "#D97706",
			danger: "#DC2626",
			info: "#2563EB"
		},
		knobs: {
			glassOpacity: .16,
			glassBlur: 14,
			glassSaturation: 1.4,
			shadowOpacity: .18,
			shadowRadius: 28,
			gradientAngle: 135,
			motionDuration: 240,
			hoverScale: 1.035,
			pressScale: .97,
			borderOpacity: .22
		},
		legacy: {
			muted: "#F3ECE5",
			surface: "#FFFFFF"
		}
	},
	{
		id: "emerald",
		name: "زمرد",
		nameEn: "Emerald",
		description: "طبیعی و تازه، مناسب سلامت و طبیعت",
		base: {
			primary: "#174C3C",
			secondary: "#1E6B52",
			accent: "#4CAF7A",
			background: "#F4FBF8",
			foreground: "#18322B",
			textSecondary: "#3D6B5A",
			textTertiary: "#7BA69A",
			success: "#16A34A",
			warning: "#D97706",
			danger: "#DC2626",
			info: "#0284C7"
		},
		knobs: {
			glassOpacity: .12,
			glassBlur: 16,
			glassSaturation: 1.5,
			shadowOpacity: .14,
			shadowRadius: 26,
			gradientAngle: 140,
			motionDuration: 260,
			hoverScale: 1.04,
			pressScale: .97,
			borderOpacity: .18
		},
		legacy: {
			muted: "#EDF6F2",
			surface: "#FFFFFF"
		}
	},
	{
		id: "royal",
		name: "رویال",
		nameEn: "Royal",
		description: "مدرن و حرفه‌ای، مناسب استارتاپ و فناوری",
		base: {
			primary: "#1F3A8A",
			secondary: "#2D55C7",
			accent: "#4F8BFF",
			background: "#F7F9FD",
			foreground: "#14213D",
			textSecondary: "#4B5563",
			textTertiary: "#8896AB",
			success: "#16A34A",
			warning: "#F59E0B",
			danger: "#DC2626",
			info: "#3B82F6"
		},
		knobs: {
			glassOpacity: .1,
			glassBlur: 18,
			glassSaturation: 1.6,
			shadowOpacity: .2,
			shadowRadius: 30,
			gradientAngle: 130,
			motionDuration: 200,
			hoverScale: 1.03,
			pressScale: .97,
			borderOpacity: .2
		},
		legacy: {
			muted: "#EEF3FA",
			surface: "#FFFFFF"
		}
	},
	{
		id: "luxury-wine",
		name: "شرابی لوکس",
		nameEn: "Luxury Wine",
		description: "لوکس و مجلل، مناسب برندهای سطح بالا",
		base: {
			primary: "#6E2137",
			secondary: "#8E3A50",
			accent: "#D4AF37",
			background: "#FCF8F9",
			foreground: "#31161E",
			textSecondary: "#6B4952",
			textTertiary: "#A88490",
			success: "#16A34A",
			warning: "#D97706",
			danger: "#DC2626",
			info: "#7C3AED"
		},
		knobs: {
			glassOpacity: .14,
			glassBlur: 20,
			glassSaturation: 1.5,
			shadowOpacity: .22,
			shadowRadius: 34,
			gradientAngle: 125,
			motionDuration: 220,
			hoverScale: 1.03,
			pressScale: .97,
			borderOpacity: .24
		},
		legacy: {
			muted: "#F5ECEF",
			surface: "#FFFFFF"
		}
	},
	{
		id: "black-edition",
		name: "مشکی مینیمال",
		nameEn: "Black Edition",
		description: "مینیمال و مدرن، مناسب طراحی‌های ساده و شیک",
		base: {
			primary: "#18181B",
			secondary: "#27272A",
			accent: "#F4B400",
			background: "#FAFAFA",
			foreground: "#18181B",
			textSecondary: "#52525B",
			textTertiary: "#A1A1AA",
			success: "#16A34A",
			warning: "#F59E0B",
			danger: "#DC2626",
			info: "#3B82F6"
		},
		knobs: {
			glassOpacity: .06,
			glassBlur: 12,
			glassSaturation: 1.2,
			shadowOpacity: .12,
			shadowRadius: 24,
			gradientAngle: 180,
			motionDuration: 180,
			hoverScale: 1.02,
			pressScale: .98,
			borderOpacity: .14
		},
		legacy: {
			muted: "#F4F4F5",
			surface: "#FFFFFF"
		}
	},
	{
		id: "sunset",
		name: "غروب",
		nameEn: "Sunset",
		description: "پر انرژی و گرم، مناسب برندهای خلاق و هنری",
		base: {
			primary: "#D94841",
			secondary: "#E8655E",
			accent: "#F4A261",
			background: "#FFF8F6",
			foreground: "#3D2320",
			textSecondary: "#7C5550",
			textTertiary: "#B89490",
			success: "#16A34A",
			warning: "#F59E0B",
			danger: "#B93833",
			info: "#3B82F6"
		},
		knobs: {
			glassOpacity: .14,
			glassBlur: 18,
			glassSaturation: 1.5,
			shadowOpacity: .18,
			shadowRadius: 30,
			gradientAngle: 135,
			motionDuration: 220,
			hoverScale: 1.04,
			pressScale: .97,
			borderOpacity: .22
		},
		legacy: {
			muted: "#F7ECE9",
			surface: "#FFFFFF"
		}
	},
	{
		id: "ocean",
		name: "اقیانوس",
		nameEn: "Ocean",
		description: "آرامش‌بخش و مطمئن، مناسب برندهای خدماتی",
		base: {
			primary: "#0F4C81",
			secondary: "#1A6BB5",
			accent: "#5DA9E9",
			background: "#F4F9FC",
			foreground: "#173042",
			textSecondary: "#476A80",
			textTertiary: "#8AA8BC",
			success: "#16A34A",
			warning: "#F59E0B",
			danger: "#DC2626",
			info: "#0EA5E9"
		},
		knobs: {
			glassOpacity: .1,
			glassBlur: 16,
			glassSaturation: 1.4,
			shadowOpacity: .16,
			shadowRadius: 28,
			gradientAngle: 145,
			motionDuration: 220,
			hoverScale: 1.03,
			pressScale: .97,
			borderOpacity: .18
		},
		legacy: {
			muted: "#EAF3F9",
			surface: "#FFFFFF"
		}
	},
	{
		id: "slate",
		name: "اسلیت",
		nameEn: "Slate",
		description: "مودبانه و جدی، مناسب برندهای شرکتی و رسمی",
		base: {
			primary: "#374151",
			secondary: "#4B5563",
			accent: "#06B6D4",
			background: "#F9FAFB",
			foreground: "#111827",
			textSecondary: "#6B7280",
			textTertiary: "#9CA3AF",
			success: "#16A34A",
			warning: "#F59E0B",
			danger: "#DC2626",
			info: "#06B6D4"
		},
		knobs: {
			glassOpacity: .08,
			glassBlur: 14,
			glassSaturation: 1.3,
			shadowOpacity: .1,
			shadowRadius: 22,
			gradientAngle: 160,
			motionDuration: 180,
			hoverScale: 1.02,
			pressScale: .98,
			borderOpacity: .16
		},
		legacy: {
			muted: "#F3F4F6",
			surface: "#FFFFFF"
		}
	}
];
function buildLegacyShadow(base, opacity, radius) {
	const hex = base.primary.replace("#", "");
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);
	return `0 10px ${radius * 1.4}px rgba(${r}, ${g}, ${b}, ${opacity})`;
}
function buildLegacyButtonGlow(base, opacity, radius) {
	const hex = base.primary.replace("#", "");
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);
	return `0 0 ${radius * 1.5}px rgba(${r}, ${g}, ${b}, ${Math.min(1, opacity + .1)})`;
}
function buildHeroOverlay(base, opacity) {
	const hex = base.primary.replace("#", "");
	return `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, ${opacity})`;
}
function buildInputFocusRing(base) {
	const hex = base.primary.replace("#", "");
	return `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, 0.4)`;
}
function blueprintToPreset(b) {
	const knobs = {
		...DEFAULT_KNOBS,
		...b.knobs ?? {}
	};
	const document = {
		version: 1,
		presetId: b.id,
		name: b.nameEn,
		base: b.base,
		knobs
	};
	const op = knobs.shadowOpacity ?? DEFAULT_KNOBS.shadowOpacity;
	const radius = knobs.shadowRadius ?? DEFAULT_KNOBS.shadowRadius;
	return {
		id: b.id,
		name: b.name,
		nameEn: b.nameEn,
		description: b.description,
		document,
		primary: b.base.primary,
		secondary: b.base.secondary,
		accent: b.base.accent,
		background: b.base.background,
		surface: b.legacy?.surface ?? "#FFFFFF",
		foreground: b.base.foreground,
		text: b.base.foreground,
		muted: b.legacy?.muted ?? b.base.textSecondary,
		success: b.base.success ?? "#16A34A",
		warning: b.base.warning ?? "#F59E0B",
		destructive: b.base.danger ?? "#DC2626",
		glassOpacity: knobs.glassOpacity ?? DEFAULT_KNOBS.glassOpacity,
		glassBlur: knobs.glassBlur ?? DEFAULT_KNOBS.glassBlur,
		borderOpacity: knobs.borderOpacity ?? DEFAULT_KNOBS.borderOpacity,
		buttonRadius: knobs.radiusBase ?? DEFAULT_KNOBS.radiusBase,
		cardRadius: knobs.radiusBase ?? DEFAULT_KNOBS.radiusBase,
		shadow: buildLegacyShadow(b.base, op, radius),
		buttonGlow: buildLegacyButtonGlow(b.base, op, radius),
		gradientStart: b.base.primary,
		gradientEnd: b.base.accent,
		heroOverlay: buildHeroOverlay(b.base, knobs.glassOpacity ?? DEFAULT_KNOBS.glassOpacity),
		sectionDividerOpacity: knobs.borderOpacity ?? DEFAULT_KNOBS.borderOpacity,
		inputFocusRing: buildInputFocusRing(b.base)
	};
}
var THEME_PRESETS = BLUEPRINTS.map(blueprintToPreset);
/**
* Maps a preset to the full row patch (legacy columns + `tokens` JSONB +
* `preset_id` + `name`). This is the primary path used by the admin presets
* card — applying a preset now propagates the complete visual identity.
*/
function toThemePatch(preset) {
	return applyDocumentToRow(preset.document);
}
/**
* Normalize a hex color string for comparison.
*/
function normalizeColor(s) {
	return s.trim().toLowerCase();
}
/**
* Detect which preset (if any) matches a stored theme.
*
* When `preset_id` is present we use it as a fast lookup, but then verify the
* core colors still match. If the user has diverged from the preset (e.g. by
* manually editing a color field), we return `null` so the UI shows
* "✨ Custom Theme" instead of incorrectly showing the old preset as active.
*/
function matchActivePreset(theme) {
	if (theme.preset_id) {
		const direct = THEME_PRESETS.find((p) => p.id === theme.preset_id);
		if (direct) {
			if (normalizeColor(direct.primary) === normalizeColor(theme.primary_color) && normalizeColor(direct.secondary) === normalizeColor(theme.secondary_color) && normalizeColor(direct.accent) === normalizeColor(theme.accent_color) && normalizeColor(direct.background) === normalizeColor(theme.background_color) && normalizeColor(direct.text) === normalizeColor(theme.text_color)) return direct;
			return null;
		}
	}
	const norm = (s) => s.trim().toLowerCase();
	for (const preset of THEME_PRESETS) if (norm(preset.primary) === norm(theme.primary_color) && norm(preset.secondary) === norm(theme.secondary_color) && norm(preset.accent) === norm(theme.accent_color) && norm(preset.background) === norm(theme.background_color) && norm(preset.text) === norm(theme.text_color)) return preset;
	return null;
}
/**
* Theme Presets — a curated palette picker that fills the existing color form
* fields with one click. It never bypasses the parent's persistence flow;
* `onApply` receives the same patch shape the manual pickers already use.
*
* Features:
* - Loading states during save
* - Professional toast feedback
* - Error handling
* - Custom theme detection with base preset hint
* - Collapsible advanced customization section
* - 4-column desktop grid, 2-column tablet, horizontal scroll mobile
*/
var _jsxFileName$1 = "C:/Users/Admin/Desktop/final/myproject/src/components/admin/theme-presets-card.tsx";
var PRESET_ICONS = {
	"golden-hour": "☀️",
	"midnight-ocean": "🌊",
	"forest-mist": "🌲",
	"royal-velvet": "👑",
	"desert-sand": "🏜️",
	"arctic-dawn": "❄️",
	"sunset-coral": "🌅",
	"emerald-garden": "💚"
};
var PRESET_PERSONALITY = {
	"golden-hour": "گرم، میهمان‌نواز، کلاسیک",
	"midnight-ocean": "عمیق، حرفه‌ای، مطمئن",
	"forest-mist": "طبیعی، آرام‌بخش، آلی",
	"royal-velvet": "فاخر، جریء، درخشان",
	"desert-sand": "خنثی، مدرن، مینیمال",
	"arctic-dawn": "تمیز، پیشرو، سپید",
	"sunset-coral": "energic، دوستانه، زنده",
	"emerald-garden": "تازه، رشد، تعادل"
};
var PresetCard = (0, import_react.memo)(function PresetCard({ preset, isActive, isLoading, onSelect }) {
	const handleClick = (0, import_react.useCallback)(() => {
		if (!isLoading) onSelect(preset);
	}, [
		preset,
		onSelect,
		isLoading
	]);
	const handleKeyDown = (0, import_react.useCallback)((e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			if (!isLoading) onSelect(preset);
		}
	}, [
		preset,
		onSelect,
		isLoading
	]);
	const icon = PRESET_ICONS[preset.id] || "🎨";
	const personality = PRESET_PERSONALITY[preset.id] || "شخصیت منحصر به فرد";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
		type: "button",
		role: "radio",
		"aria-checked": isActive,
		"aria-label": `${preset.name} (${preset.nameEn}) - ${personality}`,
		onClick: handleClick,
		onKeyDown: handleKeyDown,
		whileHover: { scale: isLoading ? 1 : 1.02 },
		whileTap: { scale: isLoading ? 1 : .98 },
		transition: {
			duration: .2,
			ease: "easeOut"
		},
		className: [
			"group relative flex flex-col gap-2.5 rounded-2xl border bg-card/60 backdrop-blur-md",
			"p-3.5 text-right cursor-pointer outline-none",
			"transition-[box-shadow,border-color,background-color,opacity] duration-200",
			"focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			isLoading ? "opacity-60 cursor-not-allowed" : "",
			isActive ? "border-primary/60 bg-primary/5 shadow-[0_0_0_1px_var(--nama-primary),0_8px_32px_-12px_var(--nama-primary)] ring-1 ring-primary/20" : "border-border hover:border-foreground/20 hover:shadow-lg"
		].join(" "),
		disabled: isLoading,
		style: { boxShadow: isActive ? "0 0 0 1px var(--nama-primary), 0 8px 32px -12px var(--nama-primary), 0 0 20px -4px var(--nama-primary)" : void 0 },
		children: [
			isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "absolute inset-0 flex items-center justify-center rounded-2xl bg-card/80",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 124,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 123,
				columnNumber: 9
			}, this) : null,
			isActive && /* @__PURE__ */ (void 0)("span", {
				className: "absolute -top-2 -left-2 z-10 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-lg animate-in fade-in slide-in-from-top-2 duration-200",
				"aria-label": "فعال",
				children: [/* @__PURE__ */ (void 0)(Check, {
					className: "h-3 w-3",
					strokeWidth: 3.5
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 134,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("span", { children: "فعال" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 135,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 130,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				"aria-hidden": "true",
				className: [
					"absolute top-2 left-2 grid h-6 w-6 place-items-center rounded-full",
					"bg-primary text-primary-foreground transition-all duration-200",
					isActive ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
				].join(" "),
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, {
					className: "h-3.5 w-3.5",
					strokeWidth: 3
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 148,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 140,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-2xl leading-none shrink-0",
					"aria-hidden": "true",
					role: "img",
					children: icon
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 153,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex-1 min-w-0 text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[10px] text-muted-foreground font-medium tracking-wide",
							children: personality
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 157,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "text-sm font-bold text-foreground truncate mt-0.5",
							children: preset.name
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 160,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[11px] font-medium text-muted-foreground",
							dir: "ltr",
							children: preset.nameEn
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 161,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 156,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 152,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-1.5",
				children: [
					[
						"primary",
						"برند",
						true
					],
					[
						"secondary",
						"ثانویه",
						false
					],
					[
						"accent",
						"تاکید",
						false
					],
					[
						"background",
						"پس‌زمینه",
						false
					],
					[
						"surface",
						"سایه",
						false
					]
				].map(([key, label, isPrimary]) => {
					const color = preset[key];
					if (!color) return null;
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 text-[11px]",
						title: `${label}: ${color}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: `h-4 w-4 rounded-full ring-1 ring-black/5 shrink-0 ${isPrimary ? "ring-2 ring-primary/50" : ""}`,
								style: { background: color },
								"aria-hidden": "true"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 186,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-muted-foreground font-medium w-16 shrink-0",
								children: label
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 193,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-mono text-muted-foreground/70 truncate",
								dir: "ltr",
								children: color
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 194,
								columnNumber: 15
							}, this)
						]
					}, key, true, {
						fileName: _jsxFileName$1,
						lineNumber: 181,
						columnNumber: 13
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 168,
				columnNumber: 7
			}, this),
			isActive && /* @__PURE__ */ (void 0)("span", {
				className: "absolute inset-0 rounded-2xl pointer-events-none",
				style: {
					background: "linear-gradient(135deg, var(--nama-primary) 0%, var(--nama-accent) 100%)",
					opacity: .08,
					mask: "linear-gradient(to bottom, black 2px, transparent 2px, transparent calc(100% - 2px), black calc(100% - 2px))",
					WebkitMask: "linear-gradient(to bottom, black 2px, transparent 2px, transparent calc(100% - 2px), black calc(100% - 2px))"
				},
				"aria-hidden": "true"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 204,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 95,
		columnNumber: 5
	}, this);
});
var ThemePresetsCard = (0, import_react.memo)(function ThemePresetsCard({ theme, onApply, basePresetId, onAdvancedToggle, children }) {
	const [loadingPresetId, setLoadingPresetId] = (0, import_react.useState)(null);
	const [lastError, setLastError] = (0, import_react.useState)(null);
	const [advancedOpen, setAdvancedOpen] = (0, import_react.useState)(false);
	const activePreset = (0, import_react.useMemo)(() => matchActivePreset(theme), [theme]);
	const isCustomTheme = (0, import_react.useMemo)(() => !activePreset, [activePreset]);
	const handleSelect = (0, import_react.useCallback)(async (preset) => {
		if (loadingPresetId) return;
		setLoadingPresetId(preset.id);
		setLastError(null);
		try {
			await onApply(toThemePatch(preset));
			toast.success(`تم "${preset.name}" با موفقیت اعمال شد.`, {
				duration: 3e3,
				description: `Theme "${preset.nameEn}" applied successfully.`,
				className: "glassmorphism-toast"
			});
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error";
			setLastError(errorMessage);
			toast.error("اعمال تم انجام نشد. لطفاً دوباره تلاش کنید.", {
				duration: 3e3,
				description: "Unable to apply theme. Please try again.",
				action: {
					label: "Retry",
					onClick: () => handleSelect(preset)
				},
				className: "glassmorphism-toast"
			});
		} finally {
			setLoadingPresetId(null);
		}
	}, [onApply, loadingPresetId]);
	const basePreset = (0, import_react.useMemo)(() => {
		if (!basePresetId) return null;
		return THEME_PRESETS.find((p) => p.id === basePresetId) || null;
	}, [basePresetId]);
	const handleAdvancedToggle = (0, import_react.useCallback)((open) => {
		setAdvancedOpen(open);
		onAdvancedToggle?.(open);
	}, [onAdvancedToggle]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-3",
		role: "region",
		"aria-label": "Theme Presets",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "p-5 border-b border-border/50 bg-gradient-to-b from-card to-card/50",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start justify-between gap-3 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Palette, {
							className: "h-4 w-4 text-primary",
							"aria-hidden": "true"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 293,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-sm font-semibold",
							children: "قالب‌های آماده تم"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 294,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 292,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground",
						children: "با یک کلیک یک پالت رنگ حرفه‌ای انتخاب کنید."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 296,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 291,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 shrink-0",
						children: isCustomTheme ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[11px] font-medium border border-primary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, {
									className: "h-3 w-3",
									"aria-hidden": "true"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 303,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "تم سفارشی" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 304,
									columnNumber: 17
								}, this),
								basePreset && /* @__PURE__ */ (void 0)("span", {
									className: "ml-1 px-1.5 py-0.5 rounded bg-primary/20 text-[10px] font-mono",
									children: ["بر پایه ", basePreset.name]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 306,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 302,
							columnNumber: 15
						}, this) : activePreset ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "flex items-center gap-1.5 rounded-full bg-emerald/10 text-emerald px-2.5 py-1 text-[11px] font-medium border border-emerald/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, {
									className: "h-3 w-3",
									"aria-hidden": "true",
									strokeWidth: 3
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 313,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "فعال: " }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 314,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold",
									children: activePreset.name
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 315,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 312,
							columnNumber: 15
						}, this) : null
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 300,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 290,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 289,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "p-5",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					role: "radiogroup",
					"aria-label": "انتخاب قالب رنگ",
					className: "grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4",
					children: THEME_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PresetCard, {
						preset,
						isActive: activePreset?.id === preset.id,
						isLoading: loadingPresetId === preset.id,
						onSelect: handleSelect
					}, preset.id, false, {
						fileName: _jsxFileName$1,
						lineNumber: 330,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 324,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 323,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("details", {
				className: "group border-t border-border/50 bg-muted/20",
				open: advancedOpen,
				onToggle: (e) => {
					const open = e.target.open;
					handleAdvancedToggle(open);
				},
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("summary", {
					className: "flex items-center justify-between p-4 cursor-pointer list-none select-none",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, {
								className: "h-4 w-4 text-muted-foreground",
								"aria-hidden": "true"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 352,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-sm font-medium text-foreground",
								children: "شخصی‌سازی پیشرفته"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 353,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-background border border-border",
								children: "ویرایش دستی توکن‌ها"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 354,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 351,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, {
						className: "h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180 shrink-0",
						"aria-hidden": "true"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 358,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 350,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground mb-3 text-right",
						children: "تغییرات اینجا مستقیماً روی تم اعمال می‌شوند. برای بازگشت، یکی از قالب‌های بالا را انتخاب کنید."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 364,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						id: "advanced-color-pickers",
						className: "space-y-4",
						children
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 368,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 363,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 342,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 283,
		columnNumber: 5
	}, this);
});
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.settings.tsx?tsr-split=component";
function SettingsPage() {
	const { data: theme, isLoading } = useTheme();
	const updateTheme = useUpdateTheme();
	const { data: site } = useSiteContent();
	const upsertSite = useUpsertSiteContent();
	const meta = {
		title: "",
		bio: "",
		avatar_url: "",
		...site?.meta
	};
	function setMeta(patch) {
		triggerSave();
		upsertSite.mutate({
			key: "meta",
			value: {
				...meta,
				...patch
			}
		}, { onError: (e) => toast.error(e.message) });
	}
	/**
	* Apply a theme patch. When the patch contains `tokens` (from a preset apply),
	* we skip Zod validation since the schema only covers legacy color columns.
	* The ThemeEngine guarantees token validity via deriveTokens().
	*/
	function setTheme(patch) {
		triggerSave();
		if (!("tokens" in patch)) {
			const next = {
				...theme,
				...patch
			};
			const parsed = themeSchema.safeParse(next);
			if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "مقدار نامعتبر");
		}
		updateTheme.mutate(patch, { onError: (e) => toast.error(e.message) });
	}
	if (isLoading || !theme) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 61,
		columnNumber: 35
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "تنظیمات و تم",
			subtitle: "پروفایل صفحه و تم بصری سایت"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 63,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-5 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-sm font-semibold mb-3",
				children: "پروفایل صفحه"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 66,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-3 max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "عنوان" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: meta.title,
						onChange: (e) => setMeta({ title: e.target.value })
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "معرفی" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 75,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
						rows: 2,
						value: meta.bio,
						onChange: (e) => setMeta({ bio: e.target.value })
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 76,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "آدرس آواتار" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 81,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						dir: "ltr",
						value: meta.avatar_url,
						onChange: (e) => setMeta({ avatar_url: e.target.value }),
						placeholder: "https://..."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 80,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 67,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 65,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeLivePreview, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 90,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemePresetsCard, {
			theme,
			onApply: async (patch) => {
				setTheme(patch);
			}
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 93,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-5 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-sm font-semibold mb-3",
					children: "تم رنگ‌ها (فقط لندینگ و تست — پنل ادمین ثابت می‌ماند)"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 98,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground mb-3",
					children: "رنگ‌های برند و پس‌زمینه"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 101,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ColorField, {
							label: "رنگ اصلی (برند)",
							value: theme.primary_color,
							onChange: (v) => setTheme({ primary_color: v })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 103,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ColorField, {
							label: "رنگ ثانویه (برند)",
							value: theme.secondary_color,
							onChange: (v) => setTheme({ secondary_color: v })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 106,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ColorField, {
							label: "رنگ تاکیدی (برند)",
							value: theme.accent_color,
							onChange: (v) => setTheme({ accent_color: v })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 109,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ColorField, {
							label: "رنگ پس‌زمینه",
							value: theme.background_color,
							onChange: (v) => setTheme({ background_color: v })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 112,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 102,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground mt-4 mb-3",
					children: "رنگ‌های متن"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 116,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ColorField, {
							label: "متن اصلی",
							value: theme.text_color,
							onChange: (v) => setTheme({ text_color: v })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 118,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ColorField, {
							label: "متن ثانویه",
							value: theme.text_secondary_color,
							onChange: (v) => setTheme({ text_secondary_color: v })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ColorField, {
							label: "متن سوم (کمرنگ‌تر)",
							value: theme.text_tertiary_color,
							onChange: (v) => setTheme({ text_tertiary_color: v })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 124,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 117,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-3 max-w-md mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "گردی گوشه‌ها" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 130,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: theme.border_radius,
						onChange: (e) => setTheme({ border_radius: e.target.value }),
						placeholder: "0.75rem"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 131,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: [
						"شفافیت گلس (",
						theme.glass_opacity,
						")"
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 136,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						type: "range",
						min: 0,
						max: 1,
						step: .01,
						value: theme.glass_opacity,
						onChange: (e) => setTheme({ glass_opacity: parseFloat(e.target.value) }),
						className: "w-full"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 137,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 135,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 128,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-4 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "h-3 w-3 inline" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 143,
						columnNumber: 11
					}, this), " تغییرات در پایگاه داده ذخیره می‌شوند و در همه دستگاه‌ها نمایش داده می‌شوند."]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 142,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 97,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-sm font-semibold mb-3",
					children: "بازنشانی تم"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 149,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground mb-3",
					children: "تم را به مقادیر پیش‌فرض برگردانید."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 150,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PrimaryButton, {
					onClick: () => updateTheme.mutate({
						primary_color: DEFAULT_THEME_SETTINGS.primary_color,
						secondary_color: DEFAULT_THEME_SETTINGS.secondary_color,
						accent_color: DEFAULT_THEME_SETTINGS.accent_color,
						background_color: DEFAULT_THEME_SETTINGS.background_color,
						text_color: DEFAULT_THEME_SETTINGS.text_color,
						text_secondary_color: DEFAULT_THEME_SETTINGS.text_secondary_color,
						text_tertiary_color: DEFAULT_THEME_SETTINGS.text_tertiary_color,
						border_radius: DEFAULT_THEME_SETTINGS.border_radius,
						glass_opacity: DEFAULT_THEME_SETTINGS.glass_opacity
					}, {
						onSuccess: () => toast.success("بازنشانی شد"),
						onError: (e) => toast.error(e.message)
					}),
					children: "بازنشانی تم"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 151,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 148,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 62,
		columnNumber: 10
	}, this);
}
function ColorField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: label }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 180,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex gap-2 items-center",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
			type: "color",
			value,
			onChange: (e) => onChange(e.target.value),
			className: "h-10 w-12 rounded border border-border shrink-0"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 182,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
			dir: "ltr",
			value,
			onChange: (e) => onChange(e.target.value),
			className: "font-mono text-xs"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 183,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 181,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 179,
		columnNumber: 10
	}, this);
}
//#endregion
export { SettingsPage as component };
