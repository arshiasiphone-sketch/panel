import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as normalizeBlockType } from "./blocks-SD5k4s2V.mjs";
import { n as useScroll, r as motion, t as useTransform } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/landing-sections-BvlKRTsO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var CupSvg = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17 8h1a4 4 0 0 1 0 8h-1" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "6",
			y1: "2",
			x2: "6",
			y2: "4"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "10",
			y1: "2",
			x2: "10",
			y2: "4"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "14",
			y1: "2",
			x2: "14",
			y2: "4"
		})
	]
});
function SectionHeading({ kicker, title, subtitle }) {
	if (!kicker && !title && !subtitle) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		variants: fadeUp,
		initial: "hidden",
		whileInView: "show",
		viewport: { once: true },
		transition: { duration: .5 },
		className: "flex flex-col items-center gap-3 text-center",
		children: [
			kicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] font-bold uppercase text-accent",
				style: {
					letterSpacing: "var(--nama-tracking-wider)",
					color: T.accent
				},
				children: kicker
			}),
			title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl sm:text-3xl font-extrabold text-balance",
				style: { color: T.foreground },
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm max-w-md",
				style: { color: T.mutedFg },
				children: subtitle
			})
		]
	});
}
function HeroSection({ s, ctx }) {
	const siteHero = ctx.site?.hero ?? {};
	const title = String(s.title ?? siteHero.title ?? "شخصیت کافه‌ای‌ات\nرو کشف کن");
	const subtitle = s.subtitle ?? siteHero.subtitle;
	const badge = s.badge ?? siteHero.badge;
	const ctaText = String(s.cta_text ?? siteHero.cta_text ?? "شروع تست");
	const heroLines = title.split("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative flex flex-col items-center justify-center px-5 pt-24 pb-16 text-center min-h-[92vh]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-lg flex flex-col items-center gap-9",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-[78px] h-[78px] rounded-[22px] flex items-center justify-center",
						style: {
							background: clr(T.primary, .12),
							border: `1px solid ${clr(T.primary, .32)}`,
							backdropFilter: T.glassBlur,
							boxShadow: `${T.shadowGlow}, inset 0 1px 0 ${clr(T.foreground, .08)}`
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CupSvg, {})
					}), badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold uppercase",
						style: {
							letterSpacing: "var(--nama-tracking-wider)",
							color: T.accent
						},
						children: String(badge)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[2.6rem] sm:text-[3.2rem] font-extrabold leading-[1.18] text-balance",
						style: { color: T.foreground },
						children: heroLines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [l, i < heroLines.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})] }, i))
					}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base leading-[1.9] text-pretty mx-auto max-w-md",
						style: { color: T.mutedFg },
						children: String(subtitle)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: s.cta_url ?? "/test/info",
						className: "block w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
							whileHover: { scale: Number(T.hoverScale) || 1.035 },
							whileTap: { scale: Number(T.pressScale) || .96 },
							className: "relative block w-full py-[18px] rounded-2xl text-lg font-extrabold text-center cursor-pointer select-none overflow-hidden",
							style: {
								color: T.foreground,
								background: T.gradButton,
								boxShadow: `${T.shadowGlow}, inset 0 1px 0 ${clr(T.foreground, .14)}`
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "relative z-10",
								children: ctaText
							})]
						})
					}), s.note !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs",
						style: { color: T.textTertiary },
						children: String(s.note ?? "رایگان · بدون ثبت‌نام · کمتر از ۳ دقیقه")
					})]
				})
			]
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		ref: cardRef,
		style: {
			scale,
			opacity
		},
		className: "relative shrink-0 snap-center rounded-3xl overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-[72vw] sm:w-[52vw] md:w-[42vw] lg:w-[32vw] aspect-[3/4]",
			style: {
				background: clr(T.primary, .04),
				border: `1px solid ${clr(T.accent, .18)}`,
				boxShadow: `${T.shadowHero}`
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
				src: image.image_url,
				alt: image.title || `gallery-${index + 1}`,
				loading: "lazy",
				style: { x: imgX },
				className: "absolute inset-0 w-[140%] h-full object-cover",
				draggable: false
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-0 bottom-0 p-5 text-right",
				dir: "rtl",
				style: {
					color: T.foreground,
					background: T.gradOverlay
				},
				children: image.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold",
					children: image.title
				})
			})]
		})
	});
}
function ParallaxGallerySection({ s, ctx }) {
	const scrollRef = (0, import_react.useRef)(null);
	if (ctx.gallery.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-5xl mx-auto px-5 flex flex-col gap-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: scrollRef,
			dir: "ltr",
			className: "mt-8 flex gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-[10vw] pb-6",
			style: {
				scrollbarWidth: "none",
				WebkitOverflowScrolling: "touch"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.parallax-scroller::-webkit-scrollbar{display:none}` }), ctx.gallery.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParallaxCard, {
				image: img,
				container: scrollRef,
				index: i
			}, img.id))]
		})]
	});
}
function MenuHighlightsSection({ s, ctx }) {
	const count = Number(s.count ?? 4);
	const items = ctx.menu.slice(0, count);
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-5xl mx-auto flex flex-col gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative aspect-square",
						style: { background: clr(T.bg, .3) },
						children: item.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.image_url,
							alt: item.name,
							loading: "lazy",
							decoding: "async",
							className: "absolute inset-0 w-full h-full object-cover"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 flex flex-col gap-1.5 text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold",
								style: { color: T.accent },
								children: item.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold",
								style: { color: T.foreground },
								children: item.name
							}),
							s.show_prices !== false && item.price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold",
								style: { color: T.mutedFg },
								children: item.price
							})
						]
					})]
				}, item.id))
			})]
		})
	});
}
function HowItWorksSection({ s }) {
	const steps = Array.isArray(s.steps) && s.steps.length ? s.steps : HOW_STEPS_DEFAULT;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto flex flex-col gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-11 h-11 rounded-xl flex items-center justify-center",
								style: {
									background: clr(T.accent, .1),
									border: `1px solid ${clr(T.accent, .22)}`
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									width: "18",
									height: "18",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.8",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "text-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: step.d ?? HOW_STEPS_DEFAULT[i % 3].d })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl font-extrabold",
								style: { color: clr(T.primary, .45) },
								children: step.n
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold",
							style: { color: T.foreground },
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-[1.8]",
							style: { color: T.mutedFg },
							children: step.desc
						})
					]
				}, i))
			})]
		})
	});
}
function GalleryPreviewSection({ s, ctx }) {
	const count = Number(s.count ?? 6);
	const columns = Number(s.columns ?? 6);
	const images = ctx.gallery.slice(0, count);
	if (images.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-5xl mx-auto flex flex-col gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid grid-cols-3 ${{
					3: "md:grid-cols-3",
					4: "md:grid-cols-4",
					5: "md:grid-cols-5",
					6: "md:grid-cols-6"
				}[columns] ?? "md:grid-cols-6"} gap-2.5`,
				children: images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: img.image_url,
						alt: img.title || "تصویر کافه",
						loading: "lazy",
						decoding: "async",
						className: "absolute inset-0 w-full h-full object-cover"
					})
				}, img.id))
			})]
		})
	});
}
function EventsPreviewSection({ s, ctx }) {
	const count = Number(s.count ?? 2);
	const items = ctx.events.slice(0, count);
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto flex flex-col gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: items.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative h-44",
						style: { background: clr(T.bg, .3) },
						children: ev.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: ev.image_url,
							alt: ev.title,
							loading: "lazy",
							decoding: "async",
							className: "absolute inset-0 w-full h-full object-cover"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 flex flex-col gap-2 text-right",
						children: [
							ev.date_label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold",
								style: { color: T.accent },
								children: ev.date_label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-extrabold",
								style: { color: T.foreground },
								children: ev.title
							}),
							ev.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-[1.8]",
								style: { color: T.mutedFg },
								children: ev.description
							})
						]
					})]
				}, ev.id))
			})]
		})
	});
}
function LocationSection({ s, ctx }) {
	const contact = ctx.site?.contact ?? {};
	const social = ctx.site?.social ?? {};
	const address = s.address ?? contact.address;
	const hours = s.hours ?? contact.hours;
	const phone = s.phone ?? contact.phone;
	const instagram = s.instagram ?? social.instagram;
	if (!address && !phone && !hours && !instagram) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-4xl mx-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col gap-3",
					children: [
						s.kicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold uppercase",
							style: {
								letterSpacing: "var(--nama-tracking-wider)",
								color: T.accent
							},
							children: s.kicker
						}),
						s.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl font-extrabold",
							style: { color: T.foreground },
							children: s.title
						}),
						address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-[1.9]",
							style: { color: T.mutedFg },
							children: address
						}),
						hours && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							style: { color: T.textTertiary },
							children: hours
						}),
						phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							style: { color: T.textTertiary },
							dir: "ltr",
							children: phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-3 pt-2",
							children: instagram && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
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
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0",
					style: {
						background: clr(T.primary, .12),
						border: `1px solid ${clr(T.primary, .3)}`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: "40",
						height: "40",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.4",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						className: "text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "12",
							cy: "10",
							r: "3"
						})]
					})
				})]
			})
		})
	});
}
function StatsSection({ s }) {
	const items = Array.isArray(s.items) ? s.items : [];
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				style: { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` },
				children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-4xl sm:text-5xl font-extrabold",
						style: { color: T.accent },
						children: item.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs sm:text-sm",
						style: { color: T.mutedFg },
						children: item.label
					})]
				}, i))
			})
		})
	});
}
function TestimonialsSection({ s, ctx }) {
	if (ctx.testimonials.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto flex flex-col gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				kicker: s.kicker,
				title: s.title,
				subtitle: s.subtitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: ctx.testimonials.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.figure, {
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "26",
							height: "26",
							viewBox: "0 0 24 24",
							fill: clr(T.accent, .3),
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.5 4C6.5 4 4 6.5 4 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C11 6.5 11 4 9.5 4Zm9 0C15.5 4 13 6.5 13 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C20 6.5 20 4 18.5 4Z" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
							className: "text-sm leading-[1.85]",
							style: { color: T.textTertiary },
							children: t.text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "flex items-center gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold",
								style: { color: T.foreground },
								children: t.name
							}), t.type && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs px-2 py-0.5 rounded-full",
								style: {
									color: T.accent,
									background: clr(T.accent, .1),
									border: `1px solid ${clr(T.accent, .2)}`
								},
								children: t.type
							})]
						})
					]
				}, t.id))
			})]
		})
	});
}
function SpacerSection({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: `${Number(s.height ?? 60)}px` } });
}
function DividerSection({ s }) {
	if (s.style === "space") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative px-5 py-6 max-w-3xl mx-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { borderTop: s.style === "dots" ? `2px dotted ${clr(T.accent, .3)}` : `1px solid ${clr(T.accent, .25)}` } })
	});
}
function RichTextSection({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl mx-auto text-center",
			dir: "rtl",
			children: [s.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-extrabold mb-3",
				style: { color: T.foreground },
				children: s.title
			}), s.text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-[1.95] whitespace-pre-wrap",
				style: { color: T.textTertiary },
				children: s.text
			})]
		})
	});
}
function ImageBlockSection({ s }) {
	if (!s.url) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: s.url,
				alt: s.caption ?? "",
				loading: "lazy",
				decoding: "async",
				className: "w-full rounded-3xl",
				style: { border: `1px solid ${clr(T.border, .07)}` }
			}), s.caption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-center mt-3",
				style: { color: T.mutedFg },
				children: s.caption
			})]
		})
	});
}
function VideoBlockSection({ s }) {
	if (!s.url) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden",
			style: { border: `1px solid ${clr(T.border, .07)}` },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				src: s.url,
				className: "w-full h-full",
				allowFullScreen: true,
				title: s.title ?? "video"
			})
		})
	});
}
function CustomHtmlSection({ s }) {
	if (!s.html) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-3xl mx-auto",
			dangerouslySetInnerHTML: { __html: String(s.html) }
		})
	});
}
function ParagraphSection({ s }) {
	if (!s.text) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-2xl mx-auto text-sm leading-[1.95] whitespace-pre-wrap text-center",
			style: { color: T.textTertiary },
			children: s.text
		})
	});
}
function ButtonSection({ s }) {
	if (!s.label) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
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
		})
	});
}
function MenuSection({ s, ctx }) {
	const fromBlock = Array.isArray(s.items) ? s.items.filter((it) => it?.name) : [];
	const items = fromBlock.length ? fromBlock : ctx.menu.map((m) => ({
		name: m.name,
		price: m.price
	}));
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-lg mx-auto rounded-3xl p-6 text-right",
			style: {
				background: clr(T.surface, .03),
				border: `1px solid ${clr(T.border, .07)}`
			},
			children: [s.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-bold mb-4",
				style: { color: T.foreground },
				children: s.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "text-sm divide-y",
				style: { borderColor: clr(T.border, .06) },
				children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between py-2.5 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: T.foreground },
						children: it.name
					}), it.price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: T.mutedFg },
						children: it.price
					})]
				}, i))
			})]
		})
	});
}
function GalleryStaticSection({ s }) {
	const images = Array.isArray(s.images) ? s.images.filter(Boolean) : [];
	if (images.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-5xl mx-auto grid grid-cols-3 gap-2.5",
			children: images.map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative aspect-square rounded-2xl overflow-hidden",
				style: {
					border: `1px solid ${clr(T.border, .07)}`,
					background: clr(T.bg, .3)
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: url,
					alt: "",
					loading: "lazy",
					decoding: "async",
					className: "absolute inset-0 w-full h-full object-cover"
				})
			}, i))
		})
	});
}
function FaqSection({ s }) {
	const items = Array.isArray(s.items) ? s.items : [];
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto flex flex-col gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				kicker: s.kicker,
				title: s.title ?? "سوالات متداول"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "rounded-2xl p-4 text-right",
					style: {
						background: clr(T.surface, .03),
						border: `1px solid ${clr(T.border, .07)}`
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer text-sm font-bold",
						style: { color: T.foreground },
						children: it.q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm mt-3 leading-[1.9]",
						style: { color: T.mutedFg },
						children: it.a
					})]
				}, i))
			})]
		})
	});
}
function InstagramSection({ s }) {
	if (!s.handle) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-10 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
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
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-5xl mx-auto flex flex-col gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				kicker: s.kicker ?? "تیپ‌ها",
				title: s.title ?? "چهار شخصیت کافه‌ای",
				subtitle: s.subtitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: items.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 rounded-2xl",
							style: {
								background: p.color ?? T.accent,
								opacity: .85
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold",
							style: { color: T.foreground },
							children: p.label
						}),
						p.tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							style: { color: T.mutedFg },
							children: p.tagline
						})
					]
				}, i))
			})]
		})
	});
}
function HeaderSection({ s }) {
	if (!s.title) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: { once: true },
			transition: { duration: .6 },
			className: "max-w-3xl mx-auto flex flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl sm:text-3xl font-extrabold text-balance",
				style: { color: T.foreground },
				children: s.title
			}), s.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-[1.9] max-w-xl mx-auto",
				style: { color: T.mutedFg },
				children: s.subtitle
			})]
		})
	});
}
function QuoteSection({ s }) {
	if (!s.text) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.figure, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					width: "40",
					height: "40",
					viewBox: "0 0 24 24",
					fill: clr(T.accent, .35),
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.5 4C6.5 4 4 6.5 4 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C11 6.5 11 4 9.5 4Zm9 0C15.5 4 13 6.5 13 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C20 6.5 20 4 18.5 4Z" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
					className: "text-lg sm:text-xl font-bold leading-[1.7] italic",
					style: { color: T.foreground },
					children: [
						"«",
						s.text,
						"»"
					]
				}),
				s.author && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
					className: "text-sm",
					style: { color: T.accent },
					children: ["— ", s.author]
				})
			]
		})
	});
}
function BookingSection({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-14 h-14 rounded-2xl flex items-center justify-center",
					style: {
						background: clr(T.accent, .12),
						border: `1px solid ${clr(T.accent, .28)}`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: "26",
						height: "26",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.6",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						className: "text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 2v4M16 2v4M3 10h18" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "3",
							y: "4",
							width: "18",
							height: "18",
							rx: "2"
						})]
					})
				}),
				s.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl sm:text-2xl font-extrabold",
					style: { color: T.foreground },
					children: s.title
				}),
				s.ctaLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.a, {
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
				})
			]
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
				const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs",
					style: { color: T.textTertiary },
					children: r.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-bold",
					style: { color: T.foreground },
					dir: "ltr",
					children: r.value
				})] });
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between px-5 py-4",
					style: { borderBottom: i < rows.length - 1 ? `1px solid ${clr(T.border, .06)}` : void 0 },
					children: r.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: r.href,
						className: "flex items-center justify-between w-full",
						children: content
					}) : content
				}, i);
			})
		})
	});
}
function MapSection({ s }) {
	const lat = Number(s.lat ?? 35.7);
	const lng = Number(s.lng ?? 51.4);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				className: "w-full h-64 sm:h-80",
				style: { filter: "saturate(0.9)" },
				loading: "lazy",
				title: s.label ? String(s.label) : "نقشه",
				src: `https://www.openstreetmap.org/export/embed.html?bbox=${lng - .005}%2C${lat - .003}%2C${lng + .005}%2C${lat + .003}&marker=${lat}%2C${lng}`
			}), s.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 py-3 text-sm",
				style: {
					background: clr(T.surface, .04),
					color: T.foreground
				},
				children: s.label
			})]
		})
	});
}
var SOCIAL_ICONS = {
	instagram: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "2",
			y: "2",
			width: "20",
			height: "20",
			rx: "5"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "4"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "17.5",
			y1: "6.5",
			x2: "17.5",
			y2: "6.5"
		})
	] }),
	telegram: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22 4L2.5 12.5l6 2 2.5 6 3.5-4.5 5.5 4z" }),
	whatsapp: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 21l1.5-4.5A8 8 0 1 1 12 20a8 8 0 0 1-4.5-1.4z" }),
	twitter: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22 5.8a8 8 0 0 1-2.4.7 4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.6 1 4 4 0 0 0-6.8 3.6A11 11 0 0 1 3 4.8a4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.3a11 11 0 0 0 6 1.8c7.2 0 11.2-6 11.2-11.2v-.5A8 8 0 0 0 22 5.8z" }),
	youtube: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22 8.2a3 3 0 0 0-2.1-2.1C18 5.5 12 5.5 12 5.5s-6 0-7.9.6A3 3 0 0 0 2 8.2 31 31 0 0 0 1.7 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.6 7.9.6 7.9.6s6 0 7.9-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22.3 12 31 31 0 0 0 22 8.2z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 15V9l5 3z" })] }),
	spotify: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 10c3-1 8-1 11 1M7.5 13c2.5-.8 6.5-.8 9 .8M8 16c2-.5 5-.5 7 .5" })] }),
	website: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" })] })
};
function SocialSection({ s }) {
	const links = Array.isArray(s.links) ? s.links.filter((l) => l?.url) : [];
	if (links.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-3xl mx-auto flex flex-wrap justify-center gap-3",
			children: links.map((l, i) => {
				const icon = SOCIAL_ICONS[l.platform] ?? SOCIAL_ICONS.website;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.a, {
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
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						width: "20",
						height: "20",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.7",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: icon
					})
				}, i);
			})
		})
	});
}
function TestSection({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-14 h-14 rounded-2xl flex items-center justify-center",
					style: {
						background: clr(T.accent, .12),
						border: `1px solid ${clr(T.accent, .3)}`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CupSvg, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl sm:text-2xl font-extrabold",
					style: { color: T.foreground },
					children: s.title ?? "تست شخصیت کافه"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/test/info",
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
						whileHover: { scale: Number(T.hoverScale) || 1.035 },
						whileTap: { scale: Number(T.pressScale) || .96 },
						className: "inline-block px-8 py-3.5 rounded-2xl text-sm font-extrabold",
						style: {
							color: T.foreground,
							background: T.gradButton,
							boxShadow: T.shadowGlow
						},
						children: s.ctaLabel ?? "شروع تست"
					})
				})
			]
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
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
				dateLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-block text-xs font-bold px-3 py-1 rounded-full mb-3",
					style: {
						color: T.accent,
						background: clr(T.accent, .1),
						border: `1px solid ${clr(T.accent, .22)}`
					},
					children: dateLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl font-extrabold mb-2",
					style: { color: T.foreground },
					children: s.title
				}),
				s.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-[1.9]",
					style: { color: T.mutedFg },
					children: s.description
				})
			]
		})
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
			children: [s.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-extrabold",
				style: { color: T.foreground },
				children: s.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-3 w-full max-w-sm",
				children: cells.map(([n, label], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl py-4 flex flex-col items-center gap-1",
					style: {
						background: clr(T.surface, .04),
						border: `1px solid ${clr(T.border, .08)}`
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl sm:text-4xl font-extrabold tabular-nums",
						style: { color: T.accent },
						children: String(n).padStart(2, "0")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px]",
						style: { color: T.mutedFg },
						children: label
					})]
				}, i))
			})]
		})
	});
}
function FileSection({ s }) {
	if (!s.url) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.a, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
					style: {
						background: clr(T.accent, .12),
						border: `1px solid ${clr(T.accent, .26)}`,
						color: T.accent
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						width: "22",
						height: "22",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.7",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-bold truncate",
						style: { color: T.foreground },
						children: s.label ?? "دانلود فایل"
					}), s.size && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs mt-0.5",
						style: { color: T.textTertiary },
						children: s.size
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold flex-shrink-0",
					style: { color: T.accent },
					children: "دانلود"
				})
			]
		})
	});
}
function MusicSection({ s }) {
	if (!s.url) return null;
	const provider = String(s.provider ?? "spotify");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-5 py-3",
				style: { borderBottom: `1px solid ${clr(T.border, .06)}` },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 18V5l12-2v13" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "6",
							cy: "18",
							r: "3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "18",
							cy: "16",
							r: "3"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold",
					style: { color: T.foreground },
					children: {
						spotify: "Spotify",
						soundcloud: "SoundCloud",
						youtube: "YouTube"
					}[provider] ?? provider
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				src: s.url,
				className: "w-full",
				style: {
					height: provider === "soundcloud" ? 166 : 152,
					border: 0
				},
				allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
				loading: "lazy",
				title: "music-player"
			})]
		})
	});
}
function dispatch(type, settings, ctx) {
	switch (normalizeBlockType(type)) {
		case "hero": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSection, {
			s: settings,
			ctx
		});
		case "personality_types": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonalityTypesSection, { s: settings });
		case "how_it_works": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorksSection, { s: settings });
		case "menu_highlights": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuHighlightsSection, {
			s: settings,
			ctx
		});
		case "menu": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuSection, {
			s: settings,
			ctx
		});
		case "parallax_gallery": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParallaxGallerySection, {
			s: settings,
			ctx
		});
		case "gallery_preview": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryPreviewSection, {
			s: settings,
			ctx
		});
		case "gallery": return Array.isArray(settings.images) && settings.images.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryStaticSection, { s: settings }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryPreviewSection, {
			s: settings,
			ctx
		});
		case "events_preview": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventsPreviewSection, {
			s: settings,
			ctx
		});
		case "testimonials_section": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialsSection, {
			s: settings,
			ctx
		});
		case "location": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationSection, {
			s: settings,
			ctx
		});
		case "stats": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsSection, { s: settings });
		case "faq": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqSection, { s: settings });
		case "instagram": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstagramSection, { s: settings });
		case "spacer": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpacerSection, { s: settings });
		case "divider": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DividerSection, { s: settings });
		case "rich_text": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextSection, { s: settings });
		case "paragraph": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParagraphSection, { s: settings });
		case "button": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonSection, { s: settings });
		case "image": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageBlockSection, { s: settings });
		case "video": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoBlockSection, { s: settings });
		case "custom_html": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomHtmlSection, { s: settings });
		case "header": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderSection, { s: settings });
		case "quote": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteSection, { s: settings });
		case "booking": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingSection, { s: settings });
		case "contact": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactSection, { s: settings });
		case "map": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSection, { s: settings });
		case "social": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialSection, { s: settings });
		case "test": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestSection, { s: settings });
		case "event": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventSection, { s: settings });
		case "countdown": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountdownSection, { s: settings });
		case "file": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSection, { s: settings });
		case "music": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicSection, { s: settings });
		default: return null;
	}
}
var LandingBlockRender = (0, import_react.memo)(function LandingBlockRender({ type, settings, ctx }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: dispatch(type, settings, ctx) });
});
LandingBlockRender.displayName = "LandingBlockRender";
//#endregion
export { LandingBlockRender };
