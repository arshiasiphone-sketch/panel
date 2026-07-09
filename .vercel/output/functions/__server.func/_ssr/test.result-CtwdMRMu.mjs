import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { A as useTheme } from "./cms-DpxCyY4I.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as calculateScores, t as PERSONALITY_PROFILES } from "./test-data-CeIpy77Z.mjs";
import { i as useResolvedProfiles } from "./personality-store-POoN25rC.mjs";
import { i as AnimatePresence, r as motion } from "../_libs/framer-motion.mjs";
import { n as useHasHydrated, r as useTestStore, t as TestPageShell } from "./test-store-VxWjc1-S.mjs";
import { t as confetti_module_default } from "../_libs/canvas-confetti.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test.result-CtwdMRMu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/test.result.tsx?tsr-split=component";
var ALL_TYPES = [
	"paparoch",
	"zhampin",
	"fofino",
	"gombak"
];
function fireConfetti(color, accent, foreground) {
	const end = Date.now() + 2e3;
	const frame = () => {
		confetti_module_default({
			particleCount: 4,
			angle: 60,
			spread: 58,
			origin: { x: 0 },
			colors: [
				color,
				accent,
				foreground
			],
			zIndex: 9999
		});
		confetti_module_default({
			particleCount: 4,
			angle: 120,
			spread: 58,
			origin: { x: 1 },
			colors: [
				color,
				accent,
				foreground
			],
			zIndex: 9999
		});
		if (Date.now() < end) requestAnimationFrame(frame);
	};
	frame();
}
function SteamParticle({ delay, x }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		"aria-hidden": "true",
		className: "absolute rounded-full pointer-events-none",
		style: {
			width: 6,
			height: 6,
			background: "rgba(255,255,255,0.18)",
			left: x,
			bottom: "105%",
			filter: "blur(2px)"
		},
		animate: {
			y: [
				0,
				-36,
				-68
			],
			x: [
				0,
				5,
				-4
			],
			opacity: [
				0,
				.5,
				0
			],
			scale: [
				.6,
				1.2,
				.3
			]
		},
		transition: {
			duration: 2.2,
			delay,
			repeat: Infinity,
			ease: "easeOut"
		}
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 45,
		columnNumber: 10
	}, this);
}
function ScoreBar({ label, score, maxScore, color, revealed, index }) {
	const pct = maxScore > 0 ? Math.round(score / maxScore * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		initial: {
			opacity: 0,
			x: 20
		},
		animate: {
			opacity: revealed ? 1 : 0,
			x: revealed ? 0 : 20
		},
		transition: {
			duration: .5,
			delay: 1.4 + index * .1
		},
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-xs font-bold",
				style: { color },
				children: label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 91,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-xs font-semibold text-text-tertiary/70",
				children: [score, " امتیاز"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 96,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 90,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "w-full h-2 rounded-full overflow-hidden",
			style: { background: "rgba(255,255,255,0.05)" },
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				className: "h-full rounded-full",
				initial: { width: 0 },
				animate: { width: revealed ? `${pct}%` : "0%" },
				transition: {
					duration: .8,
					delay: 1.5 + index * .12,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				style: {
					background: `linear-gradient(90deg, ${color}66, ${color})`,
					boxShadow: `0 0 8px ${color}44`
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 101,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 98,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 80,
		columnNumber: 10
	}, this);
}
function ShareCard({ label, color, borderColor, bgColor, scores, maxScore, userName, pageBackground, accentColor, textSecondaryColor, textTertiaryColor }) {
	const [dataUrl, setDataUrl] = (0, import_react.useState)(null);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const generate = (0, import_react.useCallback)(async () => {
		setGenerating(true);
		try {
			const { default: html2canvas } = await import("../_libs/html2canvas.mjs").then((n) => n.t);
			const el = document.getElementById("share-card-source");
			if (!el) return;
			const canvas = await html2canvas(el, {
				backgroundColor: pageBackground,
				scale: 2,
				logging: false,
				useCORS: true
			});
			setDataUrl(canvas.toDataURL("image/png"));
		} catch {} finally {
			setGenerating(false);
		}
	}, [pageBackground]);
	const download = () => {
		if (!dataUrl) return;
		const a = document.createElement("a");
		a.href = dataUrl;
		a.download = `kafekhaneh-result.png`;
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			id: "share-card-source",
			style: {
				position: "absolute",
				left: "-9999px",
				top: 0,
				width: 380,
				padding: 32,
				background: pageBackground,
				fontFamily: "Tahoma, sans-serif",
				direction: "rtl",
				borderRadius: 20,
				border: `1px solid ${borderColor}`
			},
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 18
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							style: {
								color: accentColor,
								fontSize: 10,
								letterSpacing: "0.22em",
								fontWeight: 700
							},
							children: "کافه خانه · ۱۴۰۵"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 194,
							columnNumber: 13
						}, this), userName && /* @__PURE__ */ (void 0)("span", {
							style: {
								color: textSecondaryColor,
								fontSize: 10
							},
							children: userName
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 202,
							columnNumber: 26
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 189,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 4
						},
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							style: {
								color,
								fontSize: 32,
								fontWeight: 900
							},
							children: label
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 212,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 207,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 9
						},
						children: ALL_TYPES.map((t) => {
							const p = PERSONALITY_PROFILES[t];
							const sc = scores[t] ?? 0;
							const pct = maxScore > 0 ? Math.round(sc / maxScore * 100) : 0;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 3
								},
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									style: {
										display: "flex",
										justifyContent: "space-between"
									},
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										style: {
											color: p.color,
											fontSize: 11,
											fontWeight: 700
										},
										children: p.label
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 236,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										style: {
											color: textTertiaryColor,
											fontSize: 10,
											opacity: .7
										},
										children: sc
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 241,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 232,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									style: {
										background: "rgba(255,255,255,0.06)",
										height: 5,
										borderRadius: 999,
										overflow: "hidden"
									},
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { style: {
										width: `${pct}%`,
										height: "100%",
										background: p.color,
										borderRadius: 999
									} }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 255,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 249,
									columnNumber: 19
								}, this)]
							}, t, true, {
								fileName: _jsxFileName,
								lineNumber: 227,
								columnNumber: 20
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 218,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						style: {
							color: textTertiaryColor,
							fontSize: 9,
							textAlign: "center",
							opacity: .6
						},
						children: "kafekhaneh.ir"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 265,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 184,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 172,
			columnNumber: 7
		}, this), dataUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
				src: dataUrl,
				alt: "کارت اشتراک‌گذاری",
				className: "w-full rounded-2xl border",
				style: { borderColor }
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 277,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
				whileHover: { scale: 1.02 },
				whileTap: { scale: .97 },
				onClick: download,
				className: "w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer",
				style: {
					background: bgColor,
					border: `1px solid ${borderColor}`,
					color
				},
				children: "دانلود تصویر"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 280,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 276,
			columnNumber: 18
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
			whileHover: { scale: 1.02 },
			whileTap: { scale: .97 },
			onClick: generate,
			disabled: generating,
			className: "w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-text-tertiary",
			style: {
				background: "rgba(255,255,255,0.04)",
				border: "1px solid rgba(255,255,255,0.09)"
			},
			children: generating ? "در حال ساخت..." : "ساخت کارت اشتراک‌گذاری"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 291,
			columnNumber: 18
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 171,
		columnNumber: 10
	}, this);
}
function ResultPage() {
	const navigate = useNavigate();
	const hasHydrated = useHasHydrated();
	const { data: theme } = useTheme();
	const pageBackground = theme?.background_color ?? "#0d0a0e";
	const accentColor = theme?.accent_color ?? "#d4af37";
	const foregroundColor = theme?.text_color ?? "#f0e6d3";
	const { lastResult, lastResponse, resetTest } = useTestStore();
	const profiles = useResolvedProfiles();
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [showShare, setShowShare] = (0, import_react.useState)(false);
	const confettiFired = (0, import_react.useRef)(false);
	const tied = lastResponse?.tied ?? (lastResult ? [lastResult] : []);
	const isHybrid = tied.length > 1;
	const visualProfile = isHybrid ? profiles["bedone"] : lastResult ? profiles[lastResult] : null;
	const displayLabel = isHybrid ? tied.map((t) => profiles[t].label).join(" + ") : visualProfile?.label ?? "";
	const displayTagline = isHybrid ? "ترکیبی از چند تیپ — قدرت تو در تنوعه" : visualProfile?.tagline ?? "";
	const displayDescription = isHybrid ? `شخصیت تو ترکیبی از ${tied.map((t) => profiles[t].label).join(" و ")} است. بسته به موقعیت، یکی از این وجه‌ها در تو پررنگ‌تره.` : visualProfile?.description ?? "";
	const displayTraits = isHybrid ? Array.from(new Set(tied.flatMap((t) => profiles[t].traits))).slice(0, 6) : visualProfile?.traits ?? [];
	const displayDrink = isHybrid ? tied.map((t) => profiles[t].drink).join(" یا ") : visualProfile?.drink ?? "";
	const displaySpot = isHybrid ? tied.map((t) => profiles[t].spot).join(" / ") : visualProfile?.spot ?? "";
	const scores = lastResponse?.answers ? calculateScores(lastResponse.answers) : null;
	const maxScore = scores ? Math.max(...Object.values(scores), 1) : 1;
	(0, import_react.useEffect)(() => {
		if (!hasHydrated) return;
		if (!lastResult) {
			navigate({
				to: "/",
				replace: true
			});
			return;
		}
		const t = setTimeout(() => {
			setRevealed(true);
			if (!confettiFired.current && visualProfile) {
				confettiFired.current = true;
				fireConfetti(visualProfile.color, accentColor, foregroundColor);
			}
		}, 600);
		return () => clearTimeout(t);
	}, [
		hasHydrated,
		lastResult,
		navigate,
		visualProfile,
		accentColor,
		foregroundColor
	]);
	function handleRetake() {
		resetTest();
		navigate({ to: "/test/info" });
	}
	if (!hasHydrated) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TestPageShell, {
		className: "flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			className: "relative z-10 w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary",
			animate: { rotate: 360 },
			transition: {
				duration: .9,
				repeat: Infinity,
				ease: "linear"
			}
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 358,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 357,
		columnNumber: 12
	}, this);
	if (!visualProfile) return null;
	const profile = visualProfile;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TestPageShell, {
		className: "flex flex-col items-center justify-center px-4 py-12",
		orbPrimary: profile.color,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "w-full max-w-md flex flex-col gap-6 relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.p, {
					initial: {
						opacity: 0,
						y: 14
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .5 },
					className: "text-center text-xs font-bold uppercase tracking-widest text-muted-foreground",
					children: "نتیجه‌ی تست شخصیت کافه‌ای"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 371,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						scale: .9,
						y: 28
					},
					animate: {
						opacity: revealed ? 1 : 0,
						scale: revealed ? 1 : .9,
						y: revealed ? 0 : 28
					},
					transition: {
						duration: .8,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "rounded-3xl p-7 flex flex-col items-center gap-5 text-center relative overflow-hidden",
					style: {
						background: profile.bgColor,
						border: `1px solid ${profile.borderColor}`,
						backdropFilter: "blur(24px)",
						boxShadow: `0 0 80px ${profile.color}1a`
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							className: "absolute inset-0 rounded-3xl pointer-events-none",
							style: { background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${profile.color}14, transparent)` },
							animate: { opacity: [
								.6,
								1,
								.6
							] },
							transition: {
								duration: 3.5,
								repeat: Infinity,
								ease: "easeInOut"
							}
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 400,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							initial: {
								scale: 0,
								rotate: -20
							},
							animate: {
								scale: revealed ? 1 : 0,
								rotate: revealed ? 0 : -20
							},
							transition: {
								duration: .6,
								delay: .4,
								type: "spring",
								stiffness: 200,
								damping: 18
							},
							className: "relative w-20 h-20 rounded-2xl flex items-center justify-center",
							style: {
								background: profile.bgColor,
								border: `2px solid ${profile.borderColor}`,
								boxShadow: `0 0 48px ${profile.color}44`
							},
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								width: "32",
								height: "32",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: profile.color,
								strokeWidth: "1.6",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M17 8h1a4 4 0 0 1 0 8h-1" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 427,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 428,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "6",
										y1: "2",
										x2: "6",
										y2: "4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 429,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "10",
										y1: "2",
										x2: "10",
										y2: "4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 430,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: "14",
										y1: "2",
										x2: "14",
										y2: "4"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 431,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 426,
								columnNumber: 13
							}, this), revealed && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
								/* @__PURE__ */ (void 0)(SteamParticle, {
									delay: 0,
									x: "22%"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 434,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)(SteamParticle, {
									delay: .8,
									x: "50%"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 435,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)(SteamParticle, {
									delay: 1.5,
									x: "74%"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 436,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 433,
								columnNumber: 26
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 409,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							initial: {
								opacity: 0,
								y: 16
							},
							animate: {
								opacity: revealed ? 1 : 0,
								y: revealed ? 0 : 16
							},
							transition: {
								duration: .6,
								delay: .55
							},
							className: "flex flex-col gap-1.5 relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "text-4xl font-extrabold",
								style: { color: profile.color },
								children: displayLabel
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 450,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm font-semibold text-accent",
								children: displayTagline
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 455,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 440,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.p, {
							initial: { opacity: 0 },
							animate: { opacity: revealed ? 1 : 0 },
							transition: {
								duration: .8,
								delay: .85
							},
							className: "text-sm leading-[1.85] relative z-10 text-text-tertiary",
							children: displayDescription
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 458,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 383,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: revealed ? 1 : 0,
						y: revealed ? 0 : 20
					},
					transition: {
						duration: .6,
						delay: 1.2
					},
					className: "rounded-2xl p-5 flex flex-col gap-5",
					style: {
						background: "rgba(255,255,255,0.03)",
						border: "1px solid rgba(255,255,255,0.07)",
						backdropFilter: "blur(12px)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: "تفکیک امتیاز"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 485,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 484,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-3",
						children: ALL_TYPES.map((t, i) => {
							const p = PERSONALITY_PROFILES[t];
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScoreBar, {
								label: p.label,
								score: scores ? scores[t] ?? 0 : 0,
								maxScore,
								color: p.color,
								revealed,
								index: i
							}, t, false, {
								fileName: _jsxFileName,
								lineNumber: 492,
								columnNumber: 20
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 489,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 470,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: revealed ? 1 : 0,
						y: revealed ? 0 : 16
					},
					transition: {
						duration: .6,
						delay: 1
					},
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
						children: "ویژگی‌های شخصیتی"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 507,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap gap-2",
						children: displayTraits.map((trait, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.span, {
							initial: {
								opacity: 0,
								scale: .75
							},
							animate: {
								opacity: revealed ? 1 : 0,
								scale: revealed ? 1 : .75
							},
							transition: {
								delay: 1.05 + i * .08,
								duration: .32
							},
							className: "px-3 py-1.5 rounded-full text-xs font-bold",
							style: {
								background: profile.bgColor,
								border: `1px solid ${profile.borderColor}`,
								color: profile.color
							},
							children: trait
						}, trait, false, {
							fileName: _jsxFileName,
							lineNumber: 511,
							columnNumber: 46
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 510,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 497,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: revealed ? 1 : 0,
						y: revealed ? 0 : 16
					},
					transition: {
						duration: .6,
						delay: 1.35
					},
					className: "rounded-2xl p-5 flex flex-col gap-4",
					style: {
						background: "rgba(255,255,255,0.03)",
						border: "1px solid rgba(255,255,255,0.07)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
						children: "توی کافه خانه"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 543,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-3",
						children: [{
							label: "نوشیدنی پیشنهادی",
							value: displayDrink
						}, {
							label: "بهترین جای نشستن",
							value: displaySpot
						}].map(({ label, value }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
								style: {
									background: "rgba(212,175,55,0.1)",
									border: "1px solid rgba(212,175,55,0.2)"
								},
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
									width: "14",
									height: "14",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "text-accent",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
										cx: "12",
										cy: "12",
										r: "3"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 562,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 561,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 557,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: label
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 566,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm font-semibold text-foreground",
								children: value
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 567,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 565,
								columnNumber: 17
							}, this)]
						}, label, true, {
							fileName: _jsxFileName,
							lineNumber: 556,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 546,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 530,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: revealed ? 1 : 0,
						y: revealed ? 0 : 16
					},
					transition: {
						duration: .6,
						delay: 2
					},
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => setShowShare((s) => !s),
						className: "flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-sm font-semibold cursor-pointer text-text-tertiary",
						style: {
							background: "rgba(255,255,255,0.04)",
							border: "1px solid rgba(255,255,255,0.08)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "اشتراک‌گذاری نتیجه" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 587,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.svg, {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							animate: { rotate: showShare ? 180 : 0 },
							transition: { duration: .25 },
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("polyline", { points: "6 9 12 15 18 9" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 593,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 588,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 583,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, { children: showShare && /* @__PURE__ */ (void 0)(motion.div, {
						initial: {
							opacity: 0,
							height: 0
						},
						animate: {
							opacity: 1,
							height: "auto"
						},
						exit: {
							opacity: 0,
							height: 0
						},
						transition: { duration: .3 },
						style: { overflow: "hidden" },
						children: /* @__PURE__ */ (void 0)(ShareCard, {
							label: displayLabel,
							color: profile.color,
							bgColor: profile.bgColor,
							borderColor: profile.borderColor,
							scores: scores ?? {
								paparoch: 0,
								zhampin: 0,
								fofino: 0,
								gombak: 0
							},
							maxScore,
							userName: lastResponse?.userInfo?.fullName,
							pageBackground,
							accentColor,
							textSecondaryColor: theme?.text_secondary_color ?? "#9a8a78",
							textTertiaryColor: theme?.text_tertiary_color ?? "#c9b89e"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 611,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 597,
						columnNumber: 27
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 596,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 573,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: revealed ? 1 : 0,
						y: revealed ? 0 : 16
					},
					transition: {
						duration: .6,
						delay: 1.75
					},
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
						onClick: handleRetake,
						whileHover: { scale: 1.02 },
						whileTap: { scale: .97 },
						className: "w-full py-4 rounded-2xl text-base font-bold cursor-pointer text-foreground",
						style: {
							background: "linear-gradient(135deg, #9f1239 0%, #be123c 100%)",
							boxShadow: "0 0 32px rgba(159,18,57,0.32)",
							letterSpacing: "0.02em"
						},
						children: "دوباره تست بده"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 631,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							className: "w-full py-3 rounded-2xl text-sm font-medium cursor-pointer text-muted-foreground",
							style: {
								background: "rgba(255,255,255,0.04)",
								border: "1px solid rgba(255,255,255,0.08)"
							},
							children: "برگشت به خانه"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 643,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 642,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 621,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 370,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 369,
		columnNumber: 10
	}, this);
}
//#endregion
export { ResultPage as component };
