import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as useTheme } from "./cms-8dCoOJLq.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as calculateScores, t as PERSONALITY_PROFILES } from "./test-data-CeIpy77Z.mjs";
import { i as useResolvedProfiles } from "./personality-store-KqXFjgUL.mjs";
import { i as AnimatePresence, r as motion } from "../_libs/framer-motion.mjs";
import { n as useHasHydrated, r as useTestStore, t as TestPageShell } from "./test-store-Fo5x2Vvr.mjs";
import { t as confetti_module_default } from "../_libs/canvas-confetti.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test.result-0RfzZZjd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
	});
}
function ScoreBar({ label, score, maxScore, color, revealed, index }) {
	const pct = maxScore > 0 ? Math.round(score / maxScore * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-bold",
				style: { color },
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs font-semibold text-text-tertiary/70",
				children: [score, " امتیاز"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full h-2 rounded-full overflow-hidden",
			style: { background: "rgba(255,255,255,0.05)" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
			})
		})]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 18
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								color: accentColor,
								fontSize: 10,
								letterSpacing: "0.22em",
								fontWeight: 700
							},
							children: "کافه خانه · ۱۴۰۵"
						}), userName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								color: textSecondaryColor,
								fontSize: 10
							},
							children: userName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 4
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								color,
								fontSize: 32,
								fontWeight: 900
							},
							children: label
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 9
						},
						children: ALL_TYPES.map((t) => {
							const p = PERSONALITY_PROFILES[t];
							const sc = scores[t] ?? 0;
							const pct = maxScore > 0 ? Math.round(sc / maxScore * 100) : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 3
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										justifyContent: "space-between"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: p.color,
											fontSize: 11,
											fontWeight: 700
										},
										children: p.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: textTertiaryColor,
											fontSize: 10,
											opacity: .7
										},
										children: sc
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										background: "rgba(255,255,255,0.06)",
										height: 5,
										borderRadius: 999,
										overflow: "hidden"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
										width: `${pct}%`,
										height: "100%",
										background: p.color,
										borderRadius: 999
									} })
								})]
							}, t);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							color: textTertiaryColor,
							fontSize: 9,
							textAlign: "center",
							opacity: .6
						},
						children: "kafekhaneh.ir"
					})
				]
			})
		}), dataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: dataUrl,
				alt: "کارت اشتراک‌گذاری",
				className: "w-full rounded-2xl border",
				style: { borderColor }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
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
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
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
		})]
	});
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
	if (!hasHydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestPageShell, {
		className: "flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			className: "relative z-10 w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary",
			animate: { rotate: 360 },
			transition: {
				duration: .9,
				repeat: Infinity,
				ease: "linear"
			}
		})
	});
	if (!visualProfile) return null;
	const profile = visualProfile;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestPageShell, {
		className: "flex flex-col items-center justify-center px-4 py-12",
		orbPrimary: profile.color,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md flex flex-col gap-6 relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
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
							}), revealed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SteamParticle, {
									delay: 0,
									x: "22%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SteamParticle, {
									delay: .8,
									x: "50%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SteamParticle, {
									delay: 1.5,
									x: "74%"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl font-extrabold",
								style: { color: profile.color },
								children: displayLabel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-accent",
								children: displayTagline
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
							initial: { opacity: 0 },
							animate: { opacity: revealed ? 1 : 0 },
							transition: {
								duration: .8,
								delay: .85
							},
							className: "text-sm leading-[1.85] relative z-10 text-text-tertiary",
							children: displayDescription
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: "تفکیک امتیاز"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: ALL_TYPES.map((t, i) => {
							const p = PERSONALITY_PROFILES[t];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBar, {
								label: p.label,
								score: scores ? scores[t] ?? 0 : 0,
								maxScore,
								color: p.color,
								revealed,
								index: i
							}, t);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
						children: "ویژگی‌های شخصیتی"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: displayTraits.map((trait, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
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
						}, trait))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
						children: "توی کافه خانه"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: [{
							label: "نوشیدنی پیشنهادی",
							value: displayDrink
						}, {
							label: "بهترین جای نشستن",
							value: displaySpot
						}].map(({ label, value }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
								style: {
									background: "rgba(212,175,55,0.1)",
									border: "1px solid rgba(212,175,55,0.2)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									width: "14",
									height: "14",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "text-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "12",
										cy: "12",
										r: "3"
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: value
							})] })]
						}, label))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowShare((s) => !s),
						className: "flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-sm font-semibold cursor-pointer text-text-tertiary",
						style: {
							background: "rgba(255,255,255,0.04)",
							border: "1px solid rgba(255,255,255,0.08)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اشتراک‌گذاری نتیجه" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.svg, {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							animate: { rotate: showShare ? 180 : 0 },
							transition: { duration: .25 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "6 9 12 15 18 9" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showShare && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareCard, {
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
						})
					}) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "w-full py-3 rounded-2xl text-sm font-medium cursor-pointer text-muted-foreground",
							style: {
								background: "rgba(255,255,255,0.04)",
								border: "1px solid rgba(255,255,255,0.08)"
							},
							children: "برگشت به خانه"
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { ResultPage as component };
