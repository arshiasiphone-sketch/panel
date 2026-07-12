import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as usePersonalityProfiles, I as useUpsertPersonalityProfile } from "./cms-8dCoOJLq.mjs";
import { n as X, v as RotateCcw, y as Plus } from "../_libs/lucide-react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, r as GhostButton, s as PrimaryButton, u as triggerSave } from "./admin-shell-Dw5XLj0B.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PERSONALITY_PROFILES } from "./test-data-CeIpy77Z.mjs";
import { n as defaultDbRow, r as resolveProfile, t as ALL_TYPES } from "./personality-store-KqXFjgUL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.personality-types-D-H88-TA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isCustom(type, rows) {
	const row = rows?.find((r) => r.key === type);
	const base = PERSONALITY_PROFILES[type];
	if (!row) return false;
	return row.label !== base.label || row.tagline !== base.tagline || row.description !== base.description || row.drink !== base.drink || row.spot !== base.spot || row.color_from !== base.color || row.color_to !== base.accentColor || JSON.stringify(row.traits ?? []) !== JSON.stringify(base.traits);
}
function PersonalityTypesAdmin() {
	const { data: rows, isLoading } = usePersonalityProfiles();
	const upsert = useUpsertPersonalityProfile();
	const [active, setActive] = (0, import_react.useState)("paparoch");
	const profile = resolveProfile(active, rows);
	const savePatch = (0, import_react.useCallback)((patch) => {
		triggerSave();
		const merged = {
			...resolveProfile(active, rows),
			...patch
		};
		upsert.mutate({
			...defaultDbRow(active, ALL_TYPES.indexOf(active) + 1),
			label: merged.label,
			tagline: merged.tagline,
			description: merged.description,
			traits: merged.traits,
			drink: merged.drink,
			spot: merged.spot,
			color_from: merged.color,
			color_to: merged.accentColor
		}, { onError: (e) => toast.error(e.message) });
	}, [
		active,
		rows,
		upsert
	]);
	function resetType(type) {
		triggerSave();
		upsert.mutate(defaultDbRow(type, ALL_TYPES.indexOf(type) + 1), {
			onSuccess: () => toast.success("به پیش‌فرض برگشت"),
			onError: (e) => toast.error(e.message)
		});
	}
	function resetAll() {
		triggerSave();
		Promise.all(ALL_TYPES.map((t, i) => upsert.mutateAsync(defaultDbRow(t, i + 1)))).then(() => toast.success("همه به پیش‌فرض بازگشتند")).catch((e) => toast.error(e instanceof Error ? e.message : "خطا"));
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "تیپ‌های شخصیتی",
			subtitle: "ویرایش متن، رنگ، نوشیدنی و فضای پیشنهادی برای هر تیپ. تغییرات در پایگاه داده ذخیره می‌شوند.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
				onClick: resetAll,
				disabled: upsert.isPending,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " ریست همه"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2 mb-4",
			children: ALL_TYPES.map((t) => {
				const def = PERSONALITY_PROFILES[t];
				const p = resolveProfile(t, rows);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActive(t),
					className: `px-3 py-2 rounded-xl text-sm font-bold border transition ${active === t ? "ring-2 ring-foreground/20" : ""}`,
					style: {
						background: p.bgColor,
						borderColor: p.borderColor,
						color: p.color
					},
					children: [
						p.label,
						isCustom(t, rows) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ms-2 text-[10px] opacity-70",
							children: "(تغییریافته)"
						}),
						def.label !== p.label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ms-1 text-[10px] opacity-60",
							children: [
								"[",
								def.label,
								"]"
							]
						})
					]
				}, t);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نام تیپ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.label,
							onChange: (e) => savePatch({ label: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "شعار (Tagline)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.tagline,
							onChange: (e) => savePatch({ tagline: e.target.value })
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "توضیحات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 4,
						value: profile.description,
						onChange: (e) => savePatch({ description: e.target.value })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ویژگی‌ها" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitsEditor, {
						value: profile.traits,
						onChange: (traits) => savePatch({ traits })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نوشیدنی پیشنهادی" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.drink,
							onChange: (e) => savePatch({ drink: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "بهترین جای نشستن" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.spot,
							onChange: (e) => savePatch({ spot: e.target.value })
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "رنگ اصلی" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								value: profile.color,
								onChange: (e) => savePatch({ color: e.target.value }),
								className: "h-9 w-12 rounded border border-border bg-background"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								dir: "ltr",
								value: profile.color,
								onChange: (e) => savePatch({ color: e.target.value })
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "رنگ ثانوی" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								value: profile.accentColor,
								onChange: (e) => savePatch({ accentColor: e.target.value }),
								className: "h-9 w-12 rounded border border-border bg-background"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								dir: "ltr",
								value: profile.accentColor,
								onChange: (e) => savePatch({ accentColor: e.target.value })
							})]
						})] })]
					}),
					isCustom(active, rows) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
						tone: "danger",
						onClick: () => resetType(active),
						disabled: upsert.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " بازگشت این تیپ به پیش‌فرض"]
					}) })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold mb-3",
				children: "پیش‌نمایش"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl p-5 text-center flex flex-col items-center gap-3",
				style: {
					background: profile.bgColor,
					border: `1px solid ${profile.borderColor}`
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl font-extrabold",
						style: { color: profile.color },
						children: profile.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						style: { color: profile.accentColor },
						children: profile.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm max-w-md leading-7",
						style: { color: "#9a8a78" },
						children: profile.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap justify-center gap-2 mt-2",
						children: profile.traits.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2.5 py-1 rounded-full text-xs font-bold",
							style: {
								background: profile.bgColor,
								border: `1px solid ${profile.borderColor}`,
								color: profile.color
							},
							children: t
						}, t))
					})
				]
			})]
		})
	] });
}
function TraitsEditor({ value, onChange }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: value.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-muted",
				children: [t, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onChange(value.filter((_, j) => j !== i)),
					"aria-label": "حذف",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
				})]
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: "ویژگی جدید...",
				onKeyDown: (e) => {
					if (e.key === "Enter" && draft.trim()) {
						onChange([...value, draft.trim()]);
						setDraft("");
					}
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
				onClick: () => {
					if (draft.trim()) {
						onChange([...value, draft.trim()]);
						setDraft("");
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
			})]
		})]
	});
}
//#endregion
export { PersonalityTypesAdmin as component };
