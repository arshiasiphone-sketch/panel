import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { s as normalizeBlockType } from "./blocks-QGV7I2Iw.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useScroll, r as motion, t as useTransform } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/landing-sections-BwI1uZbu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/**
* Landing page section renderers.
* These reuse the EXACT same JSX/animations from the original hardcoded landing
* page; only their data flows from page_blocks settings + shared CMS context.
*
* THEME TOKEN COMPLIANCE — All visual properties (colors, radius, glass, shadow,
* gradient, typography, spacing, motion) reference `--nama-*` CSS variables set
* by the Theme Engine so changing a preset instantly updates every section.
* NO raw hex/RGBA strings are allowed — use `color-mix()` with token variables
* for opacity variants.
*/
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/components/landing/landing-sections.tsx";
/** CSS variable shorthands for theme tokens — keeps JSX clean. */
var T = {
	primary: "var(--nama-primary)",
	primaryHover: "var(--nama-primary-hover)",
	accent: "var(--nama-accent)",
	foreground: "var(--nama-foreground)",
	mutedFg: "var(--nama-muted-fg)",
	textSecondary: "var(--nama-text-secondary)",
	textTertiary: "var(--nama-text-tertiary)",
	border: "var(--nama-border)",
	surface: "var(--nama-surface)",
	bg: "var(--nama-background)",
	glassBlur: "var(--nama-glass-blur)",
	glassBorder: "var(--nama-glass-border)",
	glassHighlight: "var(--nama-glass-highlight)",
	glassTint: "var(--nama-glass-tint)",
	gradHero: "var(--nama-gradient-hero)",
	gradCta: "var(--nama-gradient-cta)",
	gradButton: "var(--nama-gradient-button)",
	gradCard: "var(--nama-gradient-card)",
	gradSection: "var(--nama-gradient-section)",
	gradOverlay: "var(--nama-gradient-overlay)",
	shadowGlow: "var(--nama-shadow-glow)",
	shadowGlowAccent: "var(--nama-shadow-glow-accent)",
	shadowHero: "var(--nama-shadow-hero)",
	easeStandard: "var(--nama-ease-standard)",
	easeInOut: "var(--nama-ease-in-out)",
	easeSpring: "var(--nama-ease-spring)",
	hoverScale: "var(--nama-hover-scale)",
	pressScale: "var(--nama-press-scale)",
	transitionButton: "var(--nama-transition-button)"
};
function clr(token, opacity) {
	return `color-mix(in srgb, ${token} ${Math.round(opacity * 100)}%, transparent)`;
}
var fadeUp = {
	hidden: {
		opacity: 0,
		y: 28
	},
	show: {
		opacity: 1,
		y: 0
	}
};
var HOW_STEPS_DEFAULT = [
	{
		n: "۱",
		title: "تست رو شروع کن",
		desc: "روی دکمه بزن و وارد مسیر کشف شخصیت کافه‌ای‌ات شو.",
		d: "M5 12h14M13 6l6 6-6 6"
	},
	{
		n: "۲",
		title: "به ۱۱ سوال جواب بده",
		desc: "سوال‌های کوتاه و ساده درباره‌ی سلیقه و حال‌وهوای تو.",
		d: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
	},
	{
		n: "۳",
		title: "نتیجه‌ات رو ببین",
		desc: "تیپ شخصیتی، نوشیدنی پیشنهادی و بهترین جای نشستنت رو کشف کن.",
		d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6"
	}
];
var CupSvg = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
	width: "30",
	height: "30",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "1.6",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className: "text-accent",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M17 8h1a4 4 0 0 1 0 8h-1" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 103,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 104,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
			x1: "6",
			y1: "2",
			x2: "6",
			y2: "4"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 105,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
			x1: "10",
			y1: "2",
			x2: "10",
			y2: "4"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 106,
			columnNumber: 5
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
			x1: "14",
			y1: "2",
			x2: "14",
			y2: "4"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 107,
			columnNumber: 5
		}, void 0)
	]
}, void 0, true, {
	fileName: _jsxFileName,
	lineNumber: 91,
	columnNumber: 3
}, void 0);
function SectionHeading({ kicker, title, subtitle }) {
	if (!kicker && !title && !subtitle) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		variants: fadeUp,
		initial: "hidden",
		whileInView: "show",
		viewport: { once: true },
		transition: { duration: .5 },
		className: "flex flex-col items-center gap-3 text-center",
		children: [
			kicker && /* @__PURE__ */ (void 0)("span", {
				className: "text-[11px] font-bold uppercase text-accent",
				style: {
					letterSpacing: "var(--nama-tracking-wider)",
					color: T.accent
				},
				children: kicker
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 131,
				columnNumber: 9
			}, this),
			title && /* @__PURE__ */ (void 0)("h2", {
				className: "text-2xl sm:text-3xl font-extrabold text-balance",
				style: { color: T.foreground },
				children: title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 139,
				columnNumber: 9
			}, this),
			subtitle && /* @__PURE__ */ (void 0)("p", {
				className: "text-sm max-w-md",
				style: { color: T.mutedFg },
				children: subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 147,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 122,
		columnNumber: 5
	}, this);
}
function HeroSection({ s, ctx }) {
	const siteHero = ctx.site?.hero ?? {};
	const title = String(s.title ?? siteHero.title ?? "شخصیت کافه‌ای‌ات\nرو کشف کن");
	const subtitle = s.subtitle ?? siteHero.subtitle;
	const badge = s.badge ?? siteHero.badge;
	const ctaText = String(s.cta_text ?? siteHero.cta_text ?? "شروع تست");
	const heroLines = title.split("\n");
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative flex flex-col items-center justify-center px-5 pt-24 pb-16 text-center min-h-[92vh]",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative w-full max-w-lg flex flex-col items-center gap-9",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						scale: .75
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					transition: {
						duration: .65,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "flex flex-col items-center gap-3",
					style: { willChange: "transform, opacity" },
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "w-[78px] h-[78px] rounded-[22px] flex items-center justify-center",
						style: {
							background: clr(T.primary, .12),
							border: `1px solid ${clr(T.primary, .32)}`,
							backdropFilter: T.glassBlur,
							boxShadow: `${T.shadowGlow}, inset 0 1px 0 ${clr(T.foreground, .08)}`
						},
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CupSvg, {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 182,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 173,
						columnNumber: 11
					}, this), badge && /* @__PURE__ */ (void 0)("span", {
						className: "text-[10px] font-bold uppercase",
						style: {
							letterSpacing: "var(--nama-tracking-wider)",
							color: T.accent
						},
						children: String(badge)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 185,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 166,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						y: 28
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .65,
						delay: .15,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "flex flex-col gap-5",
					style: { willChange: "transform, opacity" },
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "text-[2.6rem] sm:text-[3.2rem] font-extrabold leading-[1.18] text-balance",
						style: { color: T.foreground },
						children: heroLines.map((l, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [l, i < heroLines.length - 1 && /* @__PURE__ */ (void 0)("br", {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 208,
							columnNumber: 46
						}, this)] }, i, true, {
							fileName: _jsxFileName,
							lineNumber: 206,
							columnNumber: 15
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 201,
						columnNumber: 11
					}, this), subtitle && /* @__PURE__ */ (void 0)("p", {
						className: "text-base leading-[1.9] text-pretty mx-auto max-w-md",
						style: { color: T.mutedFg },
						children: String(subtitle)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 213,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 194,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .55,
						delay: .45
					},
					className: "w-full max-w-xs",
					style: { willChange: "transform, opacity" },
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: s.cta_url ?? "/test/info",
						className: "block w-full",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.span, {
							whileHover: { scale: Number(T.hoverScale) || 1.035 },
							whileTap: { scale: Number(T.pressScale) || .96 },
							className: "relative block w-full py-[18px] rounded-2xl text-lg font-extrabold text-center cursor-pointer select-none overflow-hidden",
							style: {
								color: T.foreground,
								background: T.gradButton,
								boxShadow: `${T.shadowGlow}, inset 0 1px 0 ${clr(T.foreground, .14)}`
							},
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.span, {
								"aria-hidden": "true",
								className: "absolute inset-0 pointer-events-none",
								style: { background: `linear-gradient(110deg, transparent 30%, ${clr(T.foreground, .28)} 50%, transparent 70%)` },
								animate: { x: ["-120%", "120%"] },
								transition: {
									duration: 2.6,
									repeat: Infinity,
									ease: "easeInOut",
									repeatDelay: 1.4
								}
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 240,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "relative z-10",
								children: ctaText
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 254,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 230,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 229,
						columnNumber: 11
					}, this), s.note !== "" && /* @__PURE__ */ (void 0)("p", {
						className: "mt-3 text-xs",
						style: { color: T.textTertiary },
						children: String(s.note ?? "رایگان · بدون ثبت‌نام · کمتر از ۳ دقیقه")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 258,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 222,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 165,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 164,
		columnNumber: 5
	}, this);
}
function ParallaxCard({ image, container, index }) {
	const cardRef = (0, import_react.useRef)(null);
	const { scrollXProgress } = useScroll({
		container,
		target: cardRef,
		axis: "x",
		offset: ["start end", "end start"]
	});
	const imgX = useTransform(scrollXProgress, [0, 1], ["-18%", "18%"]);
	const scale = useTransform(scrollXProgress, [
		0,
		.5,
		1
	], [
		.94,
		1.04,
		.94
	]);
	const opacity = useTransform(scrollXProgress, [
		0,
		.5,
		1
	], [
		.55,
		1,
		.55
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		ref: cardRef,
		style: {
			scale,
			opacity
		},
		className: "relative shrink-0 snap-center rounded-3xl overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative w-[72vw] sm:w-[52vw] md:w-[42vw] lg:w-[32vw] aspect-[3/4]",
			style: {
				background: clr(T.primary, .04),
				border: `1px solid ${clr(T.accent, .18)}`,
				boxShadow: `${T.shadowHero}`
			},
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.img, {
				src: image.image_url,
				alt: image.title || `gallery-${index + 1}`,
				loading: "lazy",
				style: { x: imgX },
				className: "absolute inset-0 w-[140%] h-full object-cover",
				draggable: false
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 302,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute inset-x-0 bottom-0 p-5 text-right",
				dir: "rtl",
				style: {
					color: T.foreground,
					background: T.gradOverlay
				},
				children: image.title && /* @__PURE__ */ (void 0)("p", {
					className: "text-sm font-bold",
					children: image.title
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 315,
					columnNumber: 27
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 310,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 294,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 289,
		columnNumber: 5
	}, this);
}
function ParallaxGallerySection({ s, ctx }) {
	const scrollRef = (0, import_react.useRef)(null);
	if (ctx.gallery.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative py-20",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-5xl mx-auto px-5 flex flex-col gap-10",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 328,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 327,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			ref: scrollRef,
			dir: "ltr",
			className: "mt-8 flex gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-[10vw] pb-6",
			style: {
				scrollbarWidth: "none",
				WebkitOverflowScrolling: "touch"
			},
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("style", { children: `.parallax-scroller::-webkit-scrollbar{display:none}` }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 336,
				columnNumber: 9
			}, this), ctx.gallery.map((img, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ParallaxCard, {
				image: img,
				container: scrollRef,
				index: i
			}, img.id, false, {
				fileName: _jsxFileName,
				lineNumber: 338,
				columnNumber: 11
			}, this))]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 330,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 326,
		columnNumber: 5
	}, this);
}
function MenuHighlightsSection({ s, ctx }) {
	const count = Number(s.count ?? 4);
	const items = ctx.menu.slice(0, count);
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-5xl mx-auto flex flex-col gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 353,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					variants: fadeUp,
					initial: "hidden",
					whileInView: "show",
					viewport: {
						once: true,
						margin: "-50px"
					},
					transition: {
						duration: .5,
						delay: i * .07
					},
					className: "rounded-3xl overflow-hidden flex flex-col",
					style: {
						background: clr(T.surface, .03),
						border: `1px solid ${clr(T.border, .07)}`
					},
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative aspect-square",
						style: { background: clr(T.bg, .3) },
						children: item.image_url && /* @__PURE__ */ (void 0)("img", {
							src: item.image_url,
							alt: item.name,
							loading: "lazy",
							decoding: "async",
							className: "absolute inset-0 w-full h-full object-cover"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 371,
							columnNumber: 19
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 369,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "p-4 flex flex-col gap-1.5 text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] font-bold",
								style: { color: T.accent },
								children: item.category
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 381,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-sm font-bold",
								style: { color: T.foreground },
								children: item.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 384,
								columnNumber: 17
							}, this),
							s.show_prices !== false && item.price && /* @__PURE__ */ (void 0)("span", {
								className: "text-xs font-bold",
								style: { color: T.mutedFg },
								children: item.price
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 388,
								columnNumber: 19
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 380,
						columnNumber: 15
					}, this)]
				}, item.id, true, {
					fileName: _jsxFileName,
					lineNumber: 356,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 354,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 352,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 351,
		columnNumber: 5
	}, this);
}
function HowItWorksSection({ s }) {
	const steps = Array.isArray(s.steps) && s.steps.length ? s.steps : HOW_STEPS_DEFAULT;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-4xl mx-auto flex flex-col gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 407,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					variants: fadeUp,
					initial: "hidden",
					whileInView: "show",
					viewport: {
						once: true,
						margin: "-60px"
					},
					transition: {
						duration: .5,
						delay: i * .1
					},
					className: "rounded-3xl p-6 flex flex-col gap-4 text-right",
					style: {
						background: clr(T.surface, .03),
						border: `1px solid ${clr(T.border, .07)}`,
						backdropFilter: T.glassBlur
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "w-11 h-11 rounded-xl flex items-center justify-center",
								style: {
									background: clr(T.accent, .1),
									border: `1px solid ${clr(T.accent, .22)}`
								},
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.8",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "text-accent",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: step.d ?? HOW_STEPS_DEFAULT[i % 3].d }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 443,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 432,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 425,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-4xl font-extrabold",
								style: { color: clr(T.primary, .45) },
								children: step.n
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 446,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 424,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "text-base font-bold",
							style: { color: T.foreground },
							children: step.title
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 450,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm leading-[1.8]",
							style: { color: T.mutedFg },
							children: step.desc
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 453,
							columnNumber: 15
						}, this)
					]
				}, i, true, {
					fileName: _jsxFileName,
					lineNumber: 410,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 408,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 406,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 405,
		columnNumber: 5
	}, this);
}
function GalleryPreviewSection({ s, ctx }) {
	const count = Number(s.count ?? 6);
	const columns = Number(s.columns ?? 6);
	const images = ctx.gallery.slice(0, count);
	if (images.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-5xl mx-auto flex flex-col gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 479,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `grid grid-cols-3 ${{
					3: "md:grid-cols-3",
					4: "md:grid-cols-4",
					5: "md:grid-cols-5",
					6: "md:grid-cols-6"
				}[columns] ?? "md:grid-cols-6"} gap-2.5`,
				children: images.map((img, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					variants: fadeUp,
					initial: "hidden",
					whileInView: "show",
					viewport: {
						once: true,
						margin: "-40px"
					},
					transition: {
						duration: .45,
						delay: i * .05
					},
					className: "relative aspect-square rounded-2xl overflow-hidden",
					style: {
						border: `1px solid ${clr(T.border, .07)}`,
						background: clr(T.bg, .3)
					},
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: img.image_url,
						alt: img.title || "تصویر کافه",
						loading: "lazy",
						decoding: "async",
						className: "absolute inset-0 w-full h-full object-cover"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 492,
						columnNumber: 15
					}, this)
				}, img.id, false, {
					fileName: _jsxFileName,
					lineNumber: 482,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 480,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 478,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 477,
		columnNumber: 5
	}, this);
}
function EventsPreviewSection({ s, ctx }) {
	const count = Number(s.count ?? 2);
	const items = ctx.events.slice(0, count);
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-4xl mx-auto flex flex-col gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 515,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: items.map((ev, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.article, {
					variants: fadeUp,
					initial: "hidden",
					whileInView: "show",
					viewport: {
						once: true,
						margin: "-50px"
					},
					transition: {
						duration: .5,
						delay: i * .08
					},
					className: "rounded-3xl overflow-hidden flex flex-col",
					style: {
						background: clr(T.surface, .03),
						border: `1px solid ${clr(T.border, .07)}`
					},
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative h-44",
						style: { background: clr(T.bg, .3) },
						children: ev.image_url && /* @__PURE__ */ (void 0)("img", {
							src: ev.image_url,
							alt: ev.title,
							loading: "lazy",
							decoding: "async",
							className: "absolute inset-0 w-full h-full object-cover"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 533,
							columnNumber: 19
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 531,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "p-5 flex flex-col gap-2 text-right",
						children: [
							ev.date_label && /* @__PURE__ */ (void 0)("span", {
								className: "text-xs font-bold",
								style: { color: T.accent },
								children: ev.date_label
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 544,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "text-lg font-extrabold",
								style: { color: T.foreground },
								children: ev.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 548,
								columnNumber: 17
							}, this),
							ev.description && /* @__PURE__ */ (void 0)("p", {
								className: "text-sm leading-[1.8]",
								style: { color: T.mutedFg },
								children: ev.description
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 552,
								columnNumber: 19
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 542,
						columnNumber: 15
					}, this)]
				}, ev.id, true, {
					fileName: _jsxFileName,
					lineNumber: 518,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 516,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 514,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 513,
		columnNumber: 5
	}, this);
}
function LocationSection({ s, ctx }) {
	const contact = ctx.site?.contact ?? {};
	const social = ctx.site?.social ?? {};
	const address = s.address ?? contact.address;
	const hours = s.hours ?? contact.hours;
	const phone = s.phone ?? contact.phone;
	const instagram = s.instagram ?? social.instagram;
	if (!address && !phone && !hours && !instagram) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-4xl mx-auto",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				variants: fadeUp,
				initial: "hidden",
				whileInView: "show",
				viewport: { once: true },
				transition: { duration: .6 },
				className: "rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-7 text-right",
				style: {
					background: clr(T.primary, .07),
					border: `1px solid ${clr(T.primary, .2)}`,
					backdropFilter: T.glassBlur
				},
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex-1 flex flex-col gap-3",
					children: [
						s.kicker && /* @__PURE__ */ (void 0)("span", {
							className: "text-[11px] font-bold uppercase",
							style: {
								letterSpacing: "var(--nama-tracking-wider)",
								color: T.accent
							},
							children: s.kicker
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 592,
							columnNumber: 15
						}, this),
						s.title && /* @__PURE__ */ (void 0)("h3", {
							className: "text-2xl font-extrabold",
							style: { color: T.foreground },
							children: s.title
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 600,
							columnNumber: 15
						}, this),
						address && /* @__PURE__ */ (void 0)("p", {
							className: "text-sm leading-[1.9]",
							style: { color: T.mutedFg },
							children: address
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 605,
							columnNumber: 15
						}, this),
						hours && /* @__PURE__ */ (void 0)("p", {
							className: "text-sm",
							style: { color: T.textTertiary },
							children: hours
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 610,
							columnNumber: 15
						}, this),
						phone && /* @__PURE__ */ (void 0)("p", {
							className: "text-sm",
							style: { color: T.textTertiary },
							dir: "ltr",
							children: phone
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 615,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap gap-3 pt-2",
							children: instagram && /* @__PURE__ */ (void 0)("a", {
								href: instagram,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2",
								style: {
									color: T.foreground,
									background: clr(T.surface, .04),
									border: `1px solid ${clr(T.border, .1)}`
								},
								children: "اینستاگرام"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 621,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 619,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 590,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0",
					style: {
						background: clr(T.primary, .12),
						border: `1px solid ${clr(T.primary, .3)}`
					},
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
						width: "40",
						height: "40",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.4",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						className: "text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 652,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
							cx: "12",
							cy: "10",
							r: "3"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 653,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 641,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 637,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 577,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 576,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 575,
		columnNumber: 5
	}, this);
}
function StatsSection({ s }) {
	const items = Array.isArray(s.items) ? s.items : [];
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: { once: true },
			transition: { duration: .6 },
			className: "max-w-4xl mx-auto rounded-3xl px-6 py-10",
			style: {
				background: clr(T.primary, .06),
				border: `1px solid ${clr(T.primary, .18)}`,
				backdropFilter: T.glassBlur
			},
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4",
				style: { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` },
				children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col items-center gap-2 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-4xl sm:text-5xl font-extrabold",
						style: { color: T.accent },
						children: item.value
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 687,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs sm:text-sm",
						style: { color: T.mutedFg },
						children: item.label
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 690,
						columnNumber: 15
					}, this)]
				}, i, true, {
					fileName: _jsxFileName,
					lineNumber: 686,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 681,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 668,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 667,
		columnNumber: 5
	}, this);
}
function TestimonialsSection({ s, ctx }) {
	if (ctx.testimonials.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-4xl mx-auto flex flex-col gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 707,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: ctx.testimonials.map((t, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.figure, {
					variants: fadeUp,
					initial: "hidden",
					whileInView: "show",
					viewport: {
						once: true,
						margin: "-60px"
					},
					transition: {
						duration: .5,
						delay: i * .1
					},
					className: "rounded-3xl p-6 flex flex-col gap-4 text-right",
					style: {
						background: clr(T.surface, .03),
						border: `1px solid ${clr(T.border, .07)}`,
						backdropFilter: T.glassBlur
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
							width: "26",
							height: "26",
							viewBox: "0 0 24 24",
							fill: clr(T.accent, .3),
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M9.5 4C6.5 4 4 6.5 4 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C11 6.5 11 4 9.5 4Zm9 0C15.5 4 13 6.5 13 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C20 6.5 20 4 18.5 4Z" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 731,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 724,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("blockquote", {
							className: "text-sm leading-[1.85]",
							style: { color: T.textTertiary },
							children: t.text
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 733,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("figcaption", {
							className: "flex items-center gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-sm font-bold",
								style: { color: T.foreground },
								children: t.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 737,
								columnNumber: 17
							}, this), t.type && /* @__PURE__ */ (void 0)("span", {
								className: "text-xs px-2 py-0.5 rounded-full",
								style: {
									color: T.accent,
									background: clr(T.accent, .1),
									border: `1px solid ${clr(T.accent, .2)}`
								},
								children: t.type
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 741,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 736,
							columnNumber: 15
						}, this)
					]
				}, t.id, true, {
					fileName: _jsxFileName,
					lineNumber: 710,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 708,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 706,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 705,
		columnNumber: 5
	}, this);
}
function SpacerSection({ s }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: { height: `${Number(s.height ?? 60)}px` } }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 763,
		columnNumber: 10
	}, this);
}
function DividerSection({ s }) {
	if (s.style === "space") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-12" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 766,
		columnNumber: 35
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative px-5 py-6 max-w-3xl mx-auto",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: { borderTop: s.style === "dots" ? `2px dotted ${clr(T.accent, .3)}` : `1px solid ${clr(T.accent, .25)}` } }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 769,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 768,
		columnNumber: 5
	}, this);
}
function RichTextSection({ s }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-12",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-2xl mx-auto text-center",
			dir: "rtl",
			children: [s.title && /* @__PURE__ */ (void 0)("h3", {
				className: "text-xl font-extrabold mb-3",
				style: { color: T.foreground },
				children: s.title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 785,
				columnNumber: 11
			}, this), s.text && /* @__PURE__ */ (void 0)("p", {
				className: "text-sm leading-[1.95] whitespace-pre-wrap",
				style: { color: T.textTertiary },
				children: s.text
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 790,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 783,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 782,
		columnNumber: 5
	}, this);
}
function ImageBlockSection({ s }) {
	if (!s.url) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-4xl mx-auto",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
				src: s.url,
				alt: s.caption ?? "",
				loading: "lazy",
				decoding: "async",
				className: "w-full rounded-3xl",
				style: { border: `1px solid ${clr(T.border, .07)}` }
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 806,
				columnNumber: 9
			}, this), s.caption && /* @__PURE__ */ (void 0)("p", {
				className: "text-xs text-center mt-3",
				style: { color: T.mutedFg },
				children: s.caption
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 815,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 805,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 804,
		columnNumber: 5
	}, this);
}
function VideoBlockSection({ s }) {
	if (!s.url) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden",
			style: { border: `1px solid ${clr(T.border, .07)}` },
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("iframe", {
				src: s.url,
				className: "w-full h-full",
				allowFullScreen: true,
				title: s.title ?? "video"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 831,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 827,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 826,
		columnNumber: 5
	}, this);
}
function CustomHtmlSection({ s }) {
	if (!s.html) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-3xl mx-auto",
			dangerouslySetInnerHTML: { __html: String(s.html) }
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 840,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 839,
		columnNumber: 5
	}, this);
}
function ParagraphSection({ s }) {
	if (!s.text) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-8",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "max-w-2xl mx-auto text-sm leading-[1.95] whitespace-pre-wrap text-center",
			style: { color: T.textTertiary },
			children: s.text
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 849,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 848,
		columnNumber: 5
	}, this);
}
function ButtonSection({ s }) {
	if (!s.label) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
			href: s.url || "#",
			className: "inline-block px-8 py-3.5 rounded-2xl text-sm font-bold",
			style: {
				color: T.foreground,
				...s.style === "outline" ? {
					border: `1px solid ${clr(T.border, .2)}`,
					background: "transparent"
				} : s.style === "secondary" ? {
					background: clr(T.surface, .06),
					border: `1px solid ${clr(T.border, .1)}`
				} : {
					background: T.gradButton,
					boxShadow: T.shadowGlow
				}
			},
			children: s.label
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 864,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 863,
		columnNumber: 5
	}, this);
}
function MenuSection({ s, ctx }) {
	const fromBlock = Array.isArray(s.items) ? s.items.filter((it) => it?.name) : [];
	const items = fromBlock.length ? fromBlock : ctx.menu.map((m) => ({
		name: m.name,
		price: m.price
	}));
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-lg mx-auto rounded-3xl p-6 text-right",
			style: {
				background: clr(T.surface, .03),
				border: `1px solid ${clr(T.border, .07)}`
			},
			children: [s.title && /* @__PURE__ */ (void 0)("h3", {
				className: "text-lg font-bold mb-4",
				style: { color: T.foreground },
				children: s.title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 897,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
				className: "text-sm divide-y",
				style: { borderColor: clr(T.border, .06) },
				children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
					className: "flex justify-between py-2.5 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						style: { color: T.foreground },
						children: it.name
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 904,
						columnNumber: 15
					}, this), it.price && /* @__PURE__ */ (void 0)("span", {
						style: { color: T.mutedFg },
						children: it.price
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 905,
						columnNumber: 28
					}, this)]
				}, i, true, {
					fileName: _jsxFileName,
					lineNumber: 903,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 901,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 892,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 891,
		columnNumber: 5
	}, this);
}
function GalleryStaticSection({ s }) {
	const images = Array.isArray(s.images) ? s.images.filter(Boolean) : [];
	if (images.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-5xl mx-auto grid grid-cols-3 gap-2.5",
			children: images.map((url, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative aspect-square rounded-2xl overflow-hidden",
				style: {
					border: `1px solid ${clr(T.border, .07)}`,
					background: clr(T.bg, .3)
				},
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
					src: url,
					alt: "",
					loading: "lazy",
					decoding: "async",
					className: "absolute inset-0 w-full h-full object-cover"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 926,
					columnNumber: 13
				}, this)
			}, i, false, {
				fileName: _jsxFileName,
				lineNumber: 921,
				columnNumber: 11
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 919,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 918,
		columnNumber: 5
	}, this);
}
function FaqSection({ s }) {
	const items = Array.isArray(s.items) ? s.items : [];
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-3xl mx-auto flex flex-col gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeading, {
				kicker: s.kicker,
				title: s.title ?? "سوالات متداول"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 946,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-3",
				children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("details", {
					className: "rounded-2xl p-4 text-right",
					style: {
						background: clr(T.surface, .03),
						border: `1px solid ${clr(T.border, .07)}`
					},
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("summary", {
						className: "cursor-pointer text-sm font-bold",
						style: { color: T.foreground },
						children: it.q
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 957,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm mt-3 leading-[1.9]",
						style: { color: T.mutedFg },
						children: it.a
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 960,
						columnNumber: 15
					}, this)]
				}, i, true, {
					fileName: _jsxFileName,
					lineNumber: 949,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 947,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 945,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 944,
		columnNumber: 5
	}, this);
}
function InstagramSection({ s }) {
	if (!s.handle) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-10 text-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
			href: `https://instagram.com/${String(s.handle).replace("@", "")}`,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "inline-block px-6 py-3 rounded-2xl text-sm font-bold",
			style: {
				color: T.accent,
				background: clr(T.accent, .1),
				border: `1px solid ${clr(T.accent, .25)}`
			},
			children: [s.handle, " در اینستاگرام"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 974,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 973,
		columnNumber: 5
	}, this);
}
function PersonalityTypesSection({ s }) {
	const items = Array.isArray(s.items) ? s.items : [
		{
			label: "آرام",
			tagline: "گوشه‌نشین",
			color: T.accent
		},
		{
			label: "اجتماعی",
			tagline: "پر انرژی",
			color: T.primary
		},
		{
			label: "خلاق",
			tagline: "ذهن باز",
			color: T.primaryHover
		},
		{
			label: "متفکر",
			tagline: "عمیق",
			color: T.textTertiary
		}
	];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-5xl mx-auto flex flex-col gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeading, {
				kicker: s.kicker ?? "تیپ‌ها",
				title: s.title ?? "چهار شخصیت کافه‌ای",
				subtitle: s.subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1002,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: items.map((p, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					variants: fadeUp,
					initial: "hidden",
					whileInView: "show",
					viewport: {
						once: true,
						margin: "-40px"
					},
					transition: {
						duration: .5,
						delay: i * .08
					},
					className: "rounded-3xl p-6 flex flex-col items-center gap-3 text-center",
					style: {
						background: clr(T.surface, .03),
						border: `1px solid ${clr(T.border, .07)}`
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "w-14 h-14 rounded-2xl",
							style: {
								background: p.color ?? T.accent,
								opacity: .85
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1022,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "text-base font-bold",
							style: { color: T.foreground },
							children: p.label
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1026,
							columnNumber: 15
						}, this),
						p.tagline && /* @__PURE__ */ (void 0)("p", {
							className: "text-xs",
							style: { color: T.mutedFg },
							children: p.tagline
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1030,
							columnNumber: 17
						}, this)
					]
				}, i, true, {
					fileName: _jsxFileName,
					lineNumber: 1009,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1007,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1001,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1e3,
		columnNumber: 5
	}, this);
}
function HeaderSection({ s }) {
	if (!s.title) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16 text-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: { once: true },
			transition: { duration: .6 },
			className: "max-w-3xl mx-auto flex flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-2xl sm:text-3xl font-extrabold text-balance",
				style: { color: T.foreground },
				children: s.title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1055,
				columnNumber: 9
			}, this), s.subtitle && /* @__PURE__ */ (void 0)("p", {
				className: "text-sm leading-[1.9] max-w-xl mx-auto",
				style: { color: T.mutedFg },
				children: s.subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1062,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1047,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1046,
		columnNumber: 5
	}, this);
}
function QuoteSection({ s }) {
	if (!s.text) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.figure, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: {
				once: true,
				margin: "-60px"
			},
			transition: { duration: .6 },
			className: "max-w-2xl mx-auto rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center gap-5",
			style: {
				background: clr(T.surface, .03),
				border: `1px solid ${clr(T.border, .07)}`,
				backdropFilter: T.glassBlur
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
					width: "40",
					height: "40",
					viewBox: "0 0 24 24",
					fill: clr(T.accent, .35),
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M9.5 4C6.5 4 4 6.5 4 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C11 6.5 11 4 9.5 4Zm9 0C15.5 4 13 6.5 13 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C20 6.5 20 4 18.5 4Z" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1096,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1089,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("blockquote", {
					className: "text-lg sm:text-xl font-bold leading-[1.7] italic",
					style: { color: T.foreground },
					children: [
						"«",
						s.text,
						"»"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1098,
					columnNumber: 9
				}, this),
				s.author && /* @__PURE__ */ (void 0)("figcaption", {
					className: "text-sm",
					style: { color: T.accent },
					children: ["— ", s.author]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1105,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1076,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1075,
		columnNumber: 5
	}, this);
}
function BookingSection({ s }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: {
				once: true,
				margin: "-50px"
			},
			transition: { duration: .6 },
			className: "max-w-2xl mx-auto rounded-3xl p-8 sm:p-10 flex flex-col items-center gap-5 text-center",
			style: {
				background: clr(T.primary, .08),
				border: `1px solid ${clr(T.accent, .25)}`,
				backdropFilter: T.glassBlur
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "w-14 h-14 rounded-2xl flex items-center justify-center",
					style: {
						background: clr(T.accent, .12),
						border: `1px solid ${clr(T.accent, .28)}`
					},
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
						width: "26",
						height: "26",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.6",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						className: "text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M8 2v4M16 2v4M3 10h18" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1146,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
							x: "3",
							y: "4",
							width: "18",
							height: "18",
							rx: "2"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1147,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1135,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1131,
					columnNumber: 9
				}, this),
				s.title && /* @__PURE__ */ (void 0)("h3", {
					className: "text-xl sm:text-2xl font-extrabold",
					style: { color: T.foreground },
					children: s.title
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1151,
					columnNumber: 11
				}, this),
				s.ctaLabel && /* @__PURE__ */ (void 0)(motion.a, {
					href: "#",
					whileHover: { scale: Number(T.hoverScale) || 1.035 },
					whileTap: { scale: Number(T.pressScale) || .96 },
					className: "inline-block px-8 py-3.5 rounded-2xl text-sm font-extrabold",
					style: {
						color: T.foreground,
						background: T.gradButton,
						boxShadow: T.shadowGlow
					},
					children: s.ctaLabel
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1156,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1118,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1117,
		columnNumber: 5
	}, this);
}
function ContactSection({ s }) {
	const rows = [];
	if (s.phone) rows.push({
		label: "تلفن",
		value: String(s.phone),
		href: `tel:${String(s.phone).replace(/\s/g, "")}`
	});
	if (s.email) rows.push({
		label: "ایمیل",
		value: String(s.email),
		href: `mailto:${s.email}`
	});
	if (s.whatsapp) {
		const wa = String(s.whatsapp).replace(/[^\d]/g, "");
		rows.push({
			label: "واتس‌اپ",
			value: String(s.whatsapp),
			href: `https://wa.me/${wa}`
		});
	}
	if (rows.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: {
				once: true,
				margin: "-50px"
			},
			transition: { duration: .6 },
			className: "max-w-lg mx-auto rounded-3xl overflow-hidden text-right",
			style: {
				background: clr(T.surface, .03),
				border: `1px solid ${clr(T.border, .07)}`,
				backdropFilter: T.glassBlur
			},
			children: rows.map((r, i) => {
				const content = /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-xs",
					style: { color: T.textTertiary },
					children: r.label
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1208,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-sm font-bold",
					style: { color: T.foreground },
					dir: "ltr",
					children: r.value
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1211,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1207,
					columnNumber: 13
				}, this);
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between px-5 py-4",
					style: { borderBottom: i < rows.length - 1 ? `1px solid ${clr(T.border, .06)}` : void 0 },
					children: r.href ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: r.href,
						className: "flex items-center justify-between w-full",
						children: content
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1225,
						columnNumber: 17
					}, this) : content
				}, i, false, {
					fileName: _jsxFileName,
					lineNumber: 1217,
					columnNumber: 13
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1192,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1191,
		columnNumber: 5
	}, this);
}
function MapSection({ s }) {
	const lat = Number(s.lat ?? 35.7);
	const lng = Number(s.lng ?? 51.4);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: {
				once: true,
				margin: "-50px"
			},
			transition: { duration: .6 },
			className: "max-w-4xl mx-auto rounded-3xl overflow-hidden",
			style: { border: `1px solid ${clr(T.border, .07)}` },
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("iframe", {
				className: "w-full h-64 sm:h-80",
				style: { filter: "saturate(0.9)" },
				loading: "lazy",
				title: s.label ? String(s.label) : "نقشه",
				src: `https://www.openstreetmap.org/export/embed.html?bbox=${lng - .005}%2C${lat - .003}%2C${lng + .005}%2C${lat + .003}&marker=${lat}%2C${lng}`
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1255,
				columnNumber: 9
			}, this), s.label && /* @__PURE__ */ (void 0)("div", {
				className: "px-5 py-3 text-sm",
				style: {
					background: clr(T.surface, .04),
					color: T.foreground
				},
				children: s.label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1263,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1246,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1245,
		columnNumber: 5
	}, this);
}
var SOCIAL_ICONS = {
	instagram: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
			x: "2",
			y: "2",
			width: "20",
			height: "20",
			rx: "5"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1279,
			columnNumber: 7
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
			cx: "12",
			cy: "12",
			r: "4"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1280,
			columnNumber: 7
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
			x1: "17.5",
			y1: "6.5",
			x2: "17.5",
			y2: "6.5"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1281,
			columnNumber: 7
		}, void 0)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1278,
		columnNumber: 5
	}, void 0),
	telegram: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M22 4L2.5 12.5l6 2 2.5 6 3.5-4.5 5.5 4z" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1284,
		columnNumber: 13
	}, void 0),
	whatsapp: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M3 21l1.5-4.5A8 8 0 1 1 12 20a8 8 0 0 1-4.5-1.4z" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1285,
		columnNumber: 13
	}, void 0),
	twitter: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M22 5.8a8 8 0 0 1-2.4.7 4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.6 1 4 4 0 0 0-6.8 3.6A11 11 0 0 1 3 4.8a4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.3a11 11 0 0 0 6 1.8c7.2 0 11.2-6 11.2-11.2v-.5A8 8 0 0 0 22 5.8z" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1287,
		columnNumber: 5
	}, void 0),
	youtube: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M22 8.2a3 3 0 0 0-2.1-2.1C18 5.5 12 5.5 12 5.5s-6 0-7.9.6A3 3 0 0 0 2 8.2 31 31 0 0 0 1.7 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.6 7.9.6 7.9.6s6 0 7.9-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22.3 12 31 31 0 0 0 22 8.2z" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1291,
		columnNumber: 7
	}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M10 15V9l5 3z" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1292,
		columnNumber: 7
	}, void 0)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1290,
		columnNumber: 5
	}, void 0),
	spotify: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1297,
		columnNumber: 7
	}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M7 10c3-1 8-1 11 1M7.5 13c2.5-.8 6.5-.8 9 .8M8 16c2-.5 5-.5 7 .5" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1298,
		columnNumber: 7
	}, void 0)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1296,
		columnNumber: 5
	}, void 0),
	website: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1303,
		columnNumber: 7
	}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1304,
		columnNumber: 7
	}, void 0)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1302,
		columnNumber: 5
	}, void 0)
};
function SocialSection({ s }) {
	const links = Array.isArray(s.links) ? s.links.filter((l) => l?.url) : [];
	if (links.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-3xl mx-auto flex flex-wrap justify-center gap-3",
			children: links.map((l, i) => {
				const icon = SOCIAL_ICONS[l.platform] ?? SOCIAL_ICONS.website;
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.a, {
					href: l.url,
					target: "_blank",
					rel: "noopener noreferrer",
					variants: fadeUp,
					initial: "hidden",
					whileInView: "show",
					viewport: {
						once: true,
						margin: "-30px"
					},
					transition: {
						duration: .4,
						delay: i * .06
					},
					whileHover: {
						scale: Number(T.hoverScale) || 1.06,
						y: -3
					},
					className: "w-12 h-12 rounded-2xl flex items-center justify-center",
					style: {
						background: clr(T.surface, .04),
						border: `1px solid ${clr(T.border, .1)}`,
						color: T.accent
					},
					"aria-label": l.platform,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
						width: "20",
						height: "20",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.7",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: icon
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1339,
						columnNumber: 15
					}, this)
				}, i, false, {
					fileName: _jsxFileName,
					lineNumber: 1320,
					columnNumber: 13
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1316,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1315,
		columnNumber: 5
	}, this);
}
function TestSection({ s }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: {
				once: true,
				margin: "-50px"
			},
			transition: { duration: .6 },
			className: "max-w-2xl mx-auto rounded-3xl p-8 sm:p-10 flex flex-col items-center gap-5 text-center",
			style: {
				background: clr(T.primary, .07),
				border: `1px solid ${clr(T.primary, .22)}`,
				backdropFilter: T.glassBlur
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "w-14 h-14 rounded-2xl flex items-center justify-center",
					style: {
						background: clr(T.accent, .12),
						border: `1px solid ${clr(T.accent, .3)}`
					},
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CupSvg, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1380,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1376,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
					className: "text-xl sm:text-2xl font-extrabold",
					style: { color: T.foreground },
					children: s.title ?? "تست شخصیت کافه"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1382,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/test/info",
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.span, {
						whileHover: { scale: Number(T.hoverScale) || 1.035 },
						whileTap: { scale: Number(T.pressScale) || .96 },
						className: "inline-block px-8 py-3.5 rounded-2xl text-sm font-extrabold",
						style: {
							color: T.foreground,
							background: T.gradButton,
							boxShadow: T.shadowGlow
						},
						children: s.ctaLabel ?? "شروع تست"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1386,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1385,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1363,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1362,
		columnNumber: 5
	}, this);
}
function EventSection({ s }) {
	if (!s.title) return null;
	let dateLabel = null;
	if (s.date) try {
		dateLabel = new Intl.DateTimeFormat("fa-IR", {
			dateStyle: "long",
			timeStyle: "short"
		}).format(new Date(s.date));
	} catch {
		dateLabel = String(s.date);
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.article, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: {
				once: true,
				margin: "-50px"
			},
			transition: { duration: .6 },
			className: "max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 text-right",
			style: {
				background: clr(T.surface, .03),
				border: `1px solid ${clr(T.border, .07)}`,
				backdropFilter: T.glassBlur
			},
			children: [
				dateLabel && /* @__PURE__ */ (void 0)("span", {
					className: "inline-block text-xs font-bold px-3 py-1 rounded-full mb-3",
					style: {
						color: T.accent,
						background: clr(T.accent, .1),
						border: `1px solid ${clr(T.accent, .22)}`
					},
					children: dateLabel
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1430,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
					className: "text-xl font-extrabold mb-2",
					style: { color: T.foreground },
					children: s.title
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1441,
					columnNumber: 9
				}, this),
				s.description && /* @__PURE__ */ (void 0)("p", {
					className: "text-sm leading-[1.9]",
					style: { color: T.mutedFg },
					children: s.description
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1445,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1416,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1415,
		columnNumber: 5
	}, this);
}
function CountdownSection({ s }) {
	const target = Number(new Date(s.target ?? Date.now()).getTime());
	const compute = (0, import_react.useCallback)(() => {
		const diff = Math.max(0, target - Date.now());
		return {
			days: Math.floor(diff / 864e5),
			hours: Math.floor(diff % 864e5 / 36e5),
			mins: Math.floor(diff % 36e5 / 6e4),
			done: diff === 0
		};
	}, [target]);
	const [t, setT] = (0, import_react.useState)(compute);
	(0, import_react.useEffect)(() => {
		setT(compute());
		const id = setInterval(() => setT(compute()), 1e3);
		return () => clearInterval(id);
	}, [compute]);
	if (t.done) return null;
	const cells = [
		[t.days, "روز"],
		[t.hours, "ساعت"],
		[t.mins, "دقیقه"]
	];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: {
				once: true,
				margin: "-50px"
			},
			transition: { duration: .6 },
			className: "max-w-2xl mx-auto rounded-3xl p-8 flex flex-col items-center gap-6 text-center",
			style: {
				background: clr(T.primary, .06),
				border: `1px solid ${clr(T.primary, .18)}`,
				backdropFilter: T.glassBlur
			},
			children: [s.title && /* @__PURE__ */ (void 0)("h3", {
				className: "text-lg font-extrabold",
				style: { color: T.foreground },
				children: s.title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1494,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-3 gap-3 w-full max-w-sm",
				children: cells.map(([n, label], i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "rounded-2xl py-4 flex flex-col items-center gap-1",
					style: {
						background: clr(T.surface, .04),
						border: `1px solid ${clr(T.border, .08)}`
					},
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-3xl sm:text-4xl font-extrabold tabular-nums",
						style: { color: T.accent },
						children: String(n).padStart(2, "0")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1508,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-[11px]",
						style: { color: T.mutedFg },
						children: label
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1514,
						columnNumber: 15
					}, this)]
				}, i, true, {
					fileName: _jsxFileName,
					lineNumber: 1500,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1498,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1480,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1479,
		columnNumber: 5
	}, this);
}
function FileSection({ s }) {
	if (!s.url) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.a, {
			href: s.url,
			download: true,
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: {
				once: true,
				margin: "-50px"
			},
			transition: { duration: .6 },
			whileHover: { y: -3 },
			className: "max-w-xl mx-auto flex items-center gap-4 rounded-3xl p-5 text-right",
			style: {
				background: clr(T.surface, .03),
				border: `1px solid ${clr(T.border, .07)}`,
				backdropFilter: T.glassBlur
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
					style: {
						background: clr(T.accent, .12),
						border: `1px solid ${clr(T.accent, .26)}`,
						color: T.accent
					},
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
						width: "22",
						height: "22",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.7",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1564,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1554,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1546,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-sm font-bold truncate",
						style: { color: T.foreground },
						children: s.label ?? "دانلود فایل"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1568,
						columnNumber: 11
					}, this), s.size && /* @__PURE__ */ (void 0)("div", {
						className: "text-xs mt-0.5",
						style: { color: T.textTertiary },
						children: s.size
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1572,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1567,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-xs font-bold flex-shrink-0",
					style: { color: T.accent },
					children: "دانلود"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1577,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1530,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1529,
		columnNumber: 5
	}, this);
}
function MusicSection({ s }) {
	if (!s.url) return null;
	const provider = String(s.provider ?? "spotify");
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: {
				once: true,
				margin: "-50px"
			},
			transition: { duration: .6 },
			className: "max-w-2xl mx-auto rounded-3xl overflow-hidden",
			style: {
				background: clr(T.surface, .03),
				border: `1px solid ${clr(T.border, .07)}`,
				backdropFilter: T.glassBlur
			},
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-3 px-5 py-3",
				style: { borderBottom: `1px solid ${clr(T.border, .06)}` },
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
					width: "18",
					height: "18",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.7",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					style: { color: T.accent },
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M9 18V5l12-2v13" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1624,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
							cx: "6",
							cy: "18",
							r: "3"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1625,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
							cx: "18",
							cy: "16",
							r: "3"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1626,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1613,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-xs font-bold",
					style: { color: T.foreground },
					children: {
						spotify: "Spotify",
						soundcloud: "SoundCloud",
						youtube: "YouTube"
					}[provider] ?? provider
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1628,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1609,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("iframe", {
				src: s.url,
				className: "w-full",
				style: {
					height: provider === "soundcloud" ? 166 : 152,
					border: 0
				},
				allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
				loading: "lazy",
				title: "music-player"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1632,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1596,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1595,
		columnNumber: 5
	}, this);
}
function dispatch(type, settings, ctx) {
	switch (normalizeBlockType(type)) {
		case "hero": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeroSection, {
			s: settings,
			ctx
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1686,
			columnNumber: 14
		}, this);
		case "personality_types": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PersonalityTypesSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1688,
			columnNumber: 14
		}, this);
		case "how_it_works": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HowItWorksSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1690,
			columnNumber: 14
		}, this);
		case "menu_highlights": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MenuHighlightsSection, {
			s: settings,
			ctx
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1692,
			columnNumber: 14
		}, this);
		case "menu": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MenuSection, {
			s: settings,
			ctx
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1694,
			columnNumber: 14
		}, this);
		case "parallax_gallery": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ParallaxGallerySection, {
			s: settings,
			ctx
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1696,
			columnNumber: 14
		}, this);
		case "gallery_preview": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GalleryPreviewSection, {
			s: settings,
			ctx
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1698,
			columnNumber: 14
		}, this);
		case "gallery": return Array.isArray(settings.images) && settings.images.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GalleryStaticSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1701,
			columnNumber: 9
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GalleryPreviewSection, {
			s: settings,
			ctx
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1703,
			columnNumber: 9
		}, this);
		case "events_preview": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EventsPreviewSection, {
			s: settings,
			ctx
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1706,
			columnNumber: 14
		}, this);
		case "testimonials_section": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TestimonialsSection, {
			s: settings,
			ctx
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1708,
			columnNumber: 14
		}, this);
		case "location": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LocationSection, {
			s: settings,
			ctx
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1710,
			columnNumber: 14
		}, this);
		case "stats": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatsSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1712,
			columnNumber: 14
		}, this);
		case "faq": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FaqSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1714,
			columnNumber: 14
		}, this);
		case "instagram": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(InstagramSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1716,
			columnNumber: 14
		}, this);
		case "spacer": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SpacerSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1718,
			columnNumber: 14
		}, this);
		case "divider": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DividerSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1720,
			columnNumber: 14
		}, this);
		case "rich_text": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RichTextSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1722,
			columnNumber: 14
		}, this);
		case "paragraph": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ParagraphSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1724,
			columnNumber: 14
		}, this);
		case "button": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ButtonSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1726,
			columnNumber: 14
		}, this);
		case "image": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ImageBlockSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1728,
			columnNumber: 14
		}, this);
		case "video": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VideoBlockSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1730,
			columnNumber: 14
		}, this);
		case "custom_html": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CustomHtmlSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1732,
			columnNumber: 14
		}, this);
		case "header": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeaderSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1734,
			columnNumber: 14
		}, this);
		case "quote": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QuoteSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1736,
			columnNumber: 14
		}, this);
		case "booking": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BookingSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1738,
			columnNumber: 14
		}, this);
		case "contact": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ContactSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1740,
			columnNumber: 14
		}, this);
		case "map": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1742,
			columnNumber: 14
		}, this);
		case "social": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SocialSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1744,
			columnNumber: 14
		}, this);
		case "test": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TestSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1746,
			columnNumber: 14
		}, this);
		case "event": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EventSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1748,
			columnNumber: 14
		}, this);
		case "countdown": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CountdownSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1750,
			columnNumber: 14
		}, this);
		case "file": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1752,
			columnNumber: 14
		}, this);
		case "music": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MusicSection, { s: settings }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1754,
			columnNumber: 14
		}, this);
		default: return null;
	}
}
var LandingBlockRender = (0, import_react.memo)(function LandingBlockRender({ type, settings, ctx }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: dispatch(type, settings, ctx) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1769,
		columnNumber: 10
	}, this);
});
LandingBlockRender.displayName = "LandingBlockRender";
//#endregion
export { LandingBlockRender };
