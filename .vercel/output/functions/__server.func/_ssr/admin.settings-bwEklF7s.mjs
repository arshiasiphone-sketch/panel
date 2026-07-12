import { o as __toESM } from "../_runtime.mjs";
import { b as themeSchema } from "./theme-HySvB7Iw.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as useTheme, L as useUpsertSiteContent, M as useUpdateTheme, O as useSiteContent, t as DEFAULT_THEME_SETTINGS } from "./cms-8dCoOJLq.mjs";
import { C as Monitor, E as LoaderCircle, G as ChevronDown, K as Check, S as Moon, _ as Save, b as Palette, f as Sun, p as Sparkles } from "../_libs/lucide-react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, s as PrimaryButton, u as triggerSave } from "./admin-shell-Dw5XLj0B.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as deriveTokens, i as applyTokensToElement, n as LANDING_THEME_CLASS, o as themeRowToDocument, r as applyDocumentToRow, t as DEFAULT_KNOBS } from "./css-vars-C0sowH2S.mjs";
import { r as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-bwEklF7s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var cx = (...c) => c.filter(Boolean).join(" ");
var sectionTitleCls = "text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mb-2.5";
function Swatch({ label, cssVar, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		title: `${cssVar}: ${color}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "h-5 w-5 rounded-md shrink-0 ring-1 ring-black/5",
			style: { background: color }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] text-muted-foreground truncate font-mono",
			children: label
		})]
	});
}
function SwatchGrid({ title, colorEntries }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
		className: sectionTitleCls,
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-x-3 gap-y-1",
		children: colorEntries.map(([label, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swatch, {
			label,
			cssVar: `--nama-${label}`,
			color
		}, label))
	})] });
}
function SampleButton({ variant = "primary" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cx("rounded-[var(--nama-radius-md)] px-3.5 py-1.5 text-xs font-semibold", "shadow-[var(--nama-shadow-sm)] hover:shadow-[var(--nama-shadow-md)]", "transition-all duration-[var(--nama-motion-fast)]", {
			primary: "bg-[var(--nama-primary)] text-[var(--nama-primary-fg)]",
			secondary: "bg-[var(--nama-secondary)] text-[var(--nama-secondary-fg)]",
			accent: "bg-[var(--nama-accent)] text-[var(--nama-accent-fg)]"
		}[variant]),
		children: variant === "primary" ? "دکمه اصلی" : variant === "secondary" ? "دکمه ثانویه" : "دکمه تاکید"
	});
}
function SampleCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--nama-radius-lg)] p-3 shadow-[var(--nama-shadow-sm)]",
		style: {
			background: "var(--nama-card)",
			color: "var(--nama-card-fg)",
			border: "1px solid var(--nama-border)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 w-16 rounded-[var(--nama-radius-sm)] mb-2",
				style: { background: "var(--nama-muted)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 w-24 rounded-[var(--nama-radius-sm)] mb-1",
				style: { background: "var(--nama-muted)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 w-20 rounded-[var(--nama-radius-sm)]",
				style: { background: "var(--nama-muted)" }
			})
		]
	});
}
function SampleGlass() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-[var(--nama-radius-lg)] p-3",
		style: {
			background: "var(--nama-glass-tint)",
			backdropFilter: `blur(var(--nama-glass-blur)) saturate(var(--nama-glass-saturation))`,
			WebkitBackdropFilter: `blur(var(--nama-glass-blur)) saturate(var(--nama-glass-saturation))`,
			border: "1px solid var(--nama-glass-border)",
			boxShadow: "var(--nama-glass-depth)"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-6 w-6 rounded-full",
				style: { background: "var(--nama-primary)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 w-14 rounded-[var(--nama-radius-sm)]",
					style: { background: "var(--nama-foreground)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 w-20 rounded-[var(--nama-radius-sm)] mt-1",
					style: { background: "var(--nama-muted)" }
				})]
			})]
		})
	});
}
function SampleGradient() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-[var(--nama-radius-lg)] h-12 flex items-center justify-center",
		style: { background: "var(--nama-gradient-button)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] font-bold",
			style: { color: "var(--nama-accent-fg)" },
			children: "گرادینت برند"
		})
	});
}
function TokenSection({ title, defaultOpen = false, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		open: defaultOpen,
		className: "group",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "cursor-pointer text-[11px] font-semibold text-foreground/70 hover:text-foreground py-1.5 select-none",
			children: [title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mr-1 text-muted-foreground/40 group-open:rotate-90 inline-block transition-transform",
				children: "▶"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pt-1.5 space-y-3",
			children
		})]
	});
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
	if (!theme || !tokens) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-5 mb-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "در حال بارگذاری پیش‌نمایش..."
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-5 pt-4 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "پیش‌نمایش زنده تم"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: "تمام توکن‌های مشتق شده از تنظیمات فعلی"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/50",
				children: "NAMA Engine v1"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: wrapperRef,
			className: LANDING_THEME_CLASS,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-5 mb-4 rounded-2xl overflow-hidden border border-border/60",
				style: {
					background: "var(--nama-background)",
					color: "var(--nama-foreground)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-2 text-[10px]",
						style: { color: "var(--nama-text-secondary)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "۱۲:۳۰" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-3 w-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3 w-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3 w-3" })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 pb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
									style: {
										background: "var(--nama-primary)",
										color: "var(--nama-primary-fg)"
									},
									children: "ک"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-bold",
									style: { color: "var(--nama-foreground)" },
									children: "کافه خانه"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px]",
									style: { color: "var(--nama-text-secondary)" },
									children: "طعم‌های بی‌نهایت"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[var(--nama-radius-lg)] p-3 text-center mb-3",
								style: { background: "var(--nama-gradient-cta)" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold",
									style: { color: "var(--nama-primary-fg)" },
									children: "منوی امروز"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[var(--nama-radius-md)] p-2.5 flex items-center justify-between",
									style: {
										background: "var(--nama-surface)",
										border: "1px solid var(--nama-border)"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										style: { color: "var(--nama-foreground)" },
										children: "اسپرسو"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold",
										style: { color: "var(--nama-primary)" },
										children: "۸۵۰۰۰"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[var(--nama-radius-md)] p-2.5 flex items-center justify-between",
									style: {
										background: "var(--nama-surface)",
										border: "1px solid var(--nama-border)"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										style: { color: "var(--nama-foreground)" },
										children: "کاپوچینو"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold",
										style: { color: "var(--nama-primary)" },
										children: "۱۲۰۰۰۰"
									})]
								})]
							})
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pb-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TokenSection, {
						title: "🔵  رنگ‌ها (Colors)",
						defaultOpen: true,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwatchGrid, {
								title: "Brand",
								colorEntries: colorEntries.slice(0, 3)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwatchGrid, {
								title: "Surfaces",
								colorEntries: colorEntries.slice(3, 10)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwatchGrid, {
								title: "Text",
								colorEntries: colorEntries.slice(10, 13)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwatchGrid, {
								title: "Borders & States",
								colorEntries: colorEntries.slice(13)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenSection, {
						title: "🎨  نمونه اجزاء (Sample UI)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: sectionTitleCls,
									children: "Buttons"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleButton, { variant: "primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleButton, { variant: "secondary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleButton, { variant: "accent" })
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: sectionTitleCls,
									children: "Card"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleCard, {})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: sectionTitleCls,
									children: "Glass"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleGlass, {})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: sectionTitleCls,
									children: "Gradient"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleGradient, {})] })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenSection, {
						title: "📐  ابعاد (Radius)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								["xs", r.xs],
								["sm", r.sm],
								["md", r.md],
								["lg", r.lg],
								["xl", r.xl],
								["full", r.full]
							].map(([label, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-6 w-6 border border-border/50",
									style: { borderRadius: val }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono text-muted-foreground",
									children: label
								})]
							}, label))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenSection, {
						title: "✨  Glass & Shadow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: sectionTitleCls,
								children: "Glass"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-[10px] font-mono text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["blur: ", tokens.glass.blur] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["opacity: ", tokens.glass.opacity] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["saturation: ", tokens.glass.saturation] })
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: sectionTitleCls,
								children: "Shadow"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-[10px] font-mono text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["opacity: ", tokens.shadow.opacity] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"radius: ",
									tokens.shadow.radius,
									"px"
								] })]
							})] })]
						})
					})
				]
			})]
		})]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
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
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inset-0 flex items-center justify-center rounded-2xl bg-card/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" })
			}) : null,
			isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute -top-2 -left-2 z-10 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-lg animate-in fade-in slide-in-from-top-2 duration-200",
				"aria-label": "فعال",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "h-3 w-3",
					strokeWidth: 3.5
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "فعال" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: [
					"absolute top-2 left-2 grid h-6 w-6 place-items-center rounded-full",
					"bg-primary text-primary-foreground transition-all duration-200",
					isActive ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
				].join(" "),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "h-3.5 w-3.5",
					strokeWidth: 3
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xl leading-none shrink-0",
					"aria-hidden": "true",
					role: "img",
					children: icon
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground font-medium tracking-wide",
							children: personality
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-foreground truncate mt-0.5",
							children: preset.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium text-muted-foreground",
							dir: "ltr",
							children: preset.nameEn
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[11px]",
						title: `${label}: ${color}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `h-4 w-4 rounded-full ring-1 ring-black/5 shrink-0 ${isPrimary ? "ring-2 ring-primary/50" : ""}`,
								style: { background: color },
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-medium w-16 shrink-0",
								children: label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-muted-foreground/70 truncate",
								dir: "ltr",
								children: color
							})
						]
					}, key);
				})
			}),
			isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inset-0 rounded-2xl pointer-events-none",
				style: {
					background: "linear-gradient(135deg, var(--nama-primary) 0%, var(--nama-accent) 100%)",
					opacity: .08,
					mask: "linear-gradient(to bottom, black 2px, transparent 2px, transparent calc(100% - 2px), black calc(100% - 2px))",
					WebkitMask: "linear-gradient(to bottom, black 2px, transparent 2px, transparent calc(100% - 2px), black calc(100% - 2px))"
				},
				"aria-hidden": "true"
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-3",
		role: "region",
		"aria-label": "Theme Presets",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-5 border-b border-border/50 bg-gradient-to-b from-card to-card/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, {
							className: "h-4 w-4 text-primary",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "قالب‌های آماده تم"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "با یک کلیک یک پالت رنگ حرفه‌ای انتخاب کنید."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 shrink-0",
						children: isCustomTheme ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[11px] font-medium border border-primary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "h-3 w-3",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تم سفارشی" }),
								basePreset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 px-1.5 py-0.5 rounded bg-primary/20 text-[10px] font-mono",
									children: ["بر پایه ", basePreset.name]
								})
							]
						}) : activePreset ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 rounded-full bg-emerald/10 text-emerald px-2.5 py-1 text-[11px] font-medium border border-emerald/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "h-3 w-3",
									"aria-hidden": "true",
									strokeWidth: 3
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "فعال: " }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: activePreset.name
								})
							]
						}) : null
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "radiogroup",
					"aria-label": "انتخاب قالب رنگ",
					className: "grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4",
					children: THEME_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetCard, {
						preset,
						isActive: activePreset?.id === preset.id,
						isLoading: loadingPresetId === preset.id,
						onSelect: handleSelect
					}, preset.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "group border-t border-border/50 bg-muted/20",
				open: advancedOpen,
				onToggle: (e) => {
					const open = e.target.open;
					handleAdvancedToggle(open);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
					className: "flex items-center justify-between p-4 cursor-pointer list-none select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								className: "h-4 w-4 text-muted-foreground",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-foreground",
								children: "شخصی‌سازی پیشرفته"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-background border border-border",
								children: "ویرایش دستی توکن‌ها"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
						className: "h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180 shrink-0",
						"aria-hidden": "true"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-3 text-right",
						children: "تغییرات اینجا مستقیماً روی تم اعمال می‌شوند. برای بازگشت، یکی از قالب‌های بالا را انتخاب کنید."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "advanced-color-pickers",
						className: "space-y-4",
						children
					})]
				})]
			})
		]
	});
});
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
	if (isLoading || !theme) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "تنظیمات و تم",
			subtitle: "پروفایل صفحه و تم بصری سایت"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold mb-3",
				children: "پروفایل صفحه"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "عنوان" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: meta.title,
						onChange: (e) => setMeta({ title: e.target.value })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "معرفی" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 2,
						value: meta.bio,
						onChange: (e) => setMeta({ bio: e.target.value })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "آدرس آواتار" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						dir: "ltr",
						value: meta.avatar_url,
						onChange: (e) => setMeta({ avatar_url: e.target.value }),
						placeholder: "https://..."
					})] })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeLivePreview, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemePresetsCard, {
			theme,
			onApply: async (patch) => {
				setTheme(patch);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold mb-3",
					children: "تم رنگ‌ها (فقط لندینگ و تست — پنل ادمین ثابت می‌ماند)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mb-3",
					children: "رنگ‌های برند و پس‌زمینه"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "رنگ اصلی (برند)",
							value: theme.primary_color,
							onChange: (v) => setTheme({ primary_color: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "رنگ ثانویه (برند)",
							value: theme.secondary_color,
							onChange: (v) => setTheme({ secondary_color: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "رنگ تاکیدی (برند)",
							value: theme.accent_color,
							onChange: (v) => setTheme({ accent_color: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "رنگ پس‌زمینه",
							value: theme.background_color,
							onChange: (v) => setTheme({ background_color: v })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-4 mb-3",
					children: "رنگ‌های متن"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "متن اصلی",
							value: theme.text_color,
							onChange: (v) => setTheme({ text_color: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "متن ثانویه",
							value: theme.text_secondary_color,
							onChange: (v) => setTheme({ text_secondary_color: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "متن سوم (کمرنگ‌تر)",
							value: theme.text_tertiary_color,
							onChange: (v) => setTheme({ text_tertiary_color: v })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 max-w-md mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "گردی گوشه‌ها" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: theme.border_radius,
						onChange: (e) => setTheme({ border_radius: e.target.value }),
						placeholder: "0.75rem"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
						"شفافیت گلس (",
						theme.glass_opacity,
						")"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 1,
						step: .01,
						value: theme.glass_opacity,
						onChange: (e) => setTheme({ glass_opacity: parseFloat(e.target.value) }),
						className: "w-full"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3 w-3 inline" }), " تغییرات در پایگاه داده ذخیره می‌شوند و در همه دستگاه‌ها نمایش داده می‌شوند."]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold mb-3",
					children: "بازنشانی تم"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mb-3",
					children: "تم را به مقادیر پیش‌فرض برگردانید."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
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
				})
			]
		})
	] });
}
function ColorField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2 items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "color",
			value,
			onChange: (e) => onChange(e.target.value),
			className: "h-10 w-12 rounded border border-border shrink-0"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			dir: "ltr",
			value,
			onChange: (e) => onChange(e.target.value),
			className: "font-mono text-xs"
		})]
	})] });
}
//#endregion
export { SettingsPage as component };
