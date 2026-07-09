import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { C as usePersonalityProfiles, I as useUpsertPersonalityProfile } from "./cms-DpxCyY4I.mjs";
import { n as X, v as RotateCcw, y as Plus } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, r as GhostButton, s as PrimaryButton, u as triggerSave } from "./admin-shell-BJzvwuI4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PERSONALITY_PROFILES } from "./test-data-CeIpy77Z.mjs";
import { n as defaultDbRow, r as resolveProfile, t as ALL_TYPES } from "./personality-store-POoN25rC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.personality-types-DeqVbDMQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.personality-types.tsx?tsr-split=component";
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
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 56,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "تیپ‌های شخصیتی",
			subtitle: "ویرایش متن، رنگ، نوشیدنی و فضای پیشنهادی برای هر تیپ. تغییرات در پایگاه داده ذخیره می‌شوند.",
			actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GhostButton, {
				onClick: resetAll,
				disabled: upsert.isPending,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RotateCcw, { className: "h-3.5 w-3.5" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 60,
					columnNumber: 13
				}, this), " ریست همه"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 59,
				columnNumber: 154
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 59,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-wrap gap-2 mb-4",
			children: ALL_TYPES.map((t) => {
				const def = PERSONALITY_PROFILES[t];
				const p = resolveProfile(t, rows);
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: () => setActive(t),
					className: `px-3 py-2 rounded-xl text-sm font-bold border transition ${active === t ? "ring-2 ring-foreground/20" : ""}`,
					style: {
						background: p.bgColor,
						borderColor: p.borderColor,
						color: p.color
					},
					children: [
						p.label,
						isCustom(t, rows) && /* @__PURE__ */ (void 0)("span", {
							className: "ms-2 text-[10px] opacity-70",
							children: "(تغییریافته)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 73,
							columnNumber: 37
						}, this),
						def.label !== p.label && /* @__PURE__ */ (void 0)("span", {
							className: "ms-1 text-[10px] opacity-60",
							children: [
								"[",
								def.label,
								"]"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 74,
							columnNumber: 41
						}, this)
					]
				}, t, true, {
					fileName: _jsxFileName,
					lineNumber: 67,
					columnNumber: 16
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 63,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-4",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "نام تیپ" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 83,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: profile.label,
							onChange: (e) => savePatch({ label: e.target.value })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 84,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 82,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "شعار (Tagline)" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 89,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: profile.tagline,
							onChange: (e) => savePatch({ tagline: e.target.value })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 90,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 81,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "توضیحات" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 96,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
						rows: 4,
						value: profile.description,
						onChange: (e) => savePatch({ description: e.target.value })
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 97,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "ویژگی‌ها" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 103,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TraitsEditor, {
						value: profile.traits,
						onChange: (traits) => savePatch({ traits })
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 102,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "نوشیدنی پیشنهادی" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 111,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: profile.drink,
							onChange: (e) => savePatch({ drink: e.target.value })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 112,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 110,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "بهترین جای نشستن" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 117,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: profile.spot,
							onChange: (e) => savePatch({ spot: e.target.value })
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 118,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 116,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "رنگ اصلی" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "color",
								value: profile.color,
								onChange: (e) => savePatch({ color: e.target.value }),
								className: "h-9 w-12 rounded border border-border bg-background"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								dir: "ltr",
								value: profile.color,
								onChange: (e) => savePatch({ color: e.target.value })
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 131,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "رنگ ثانوی" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 137,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "color",
								value: profile.accentColor,
								onChange: (e) => savePatch({ accentColor: e.target.value }),
								className: "h-9 w-12 rounded border border-border bg-background"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 139,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								dir: "ltr",
								value: profile.accentColor,
								onChange: (e) => savePatch({ accentColor: e.target.value })
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 142,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 138,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 136,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 11
					}, this),
					isCustom(active, rows) && /* @__PURE__ */ (void 0)("div", { children: /* @__PURE__ */ (void 0)(GhostButton, {
						tone: "danger",
						onClick: () => resetType(active),
						disabled: upsert.isPending,
						children: [/* @__PURE__ */ (void 0)(RotateCcw, { className: "h-3.5 w-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 151,
							columnNumber: 17
						}, this), " بازگشت این تیپ به پیش‌فرض"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 150,
						columnNumber: 15
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 149,
						columnNumber: 38
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 80,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 79,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-4 mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
				className: "text-sm font-bold mb-3",
				children: "پیش‌نمایش"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 158,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-2xl p-5 text-center flex flex-col items-center gap-3",
				style: {
					background: profile.bgColor,
					border: `1px solid ${profile.borderColor}`
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-3xl font-extrabold",
						style: { color: profile.color },
						children: profile.label
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 163,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm font-semibold",
						style: { color: profile.accentColor },
						children: profile.tagline
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 168,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm max-w-md leading-7",
						style: { color: "#9a8a78" },
						children: profile.description
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 173,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap justify-center gap-2 mt-2",
						children: profile.traits.map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "px-2.5 py-1 rounded-full text-xs font-bold",
							style: {
								background: profile.bgColor,
								border: `1px solid ${profile.borderColor}`,
								color: profile.color
							},
							children: t
						}, t, false, {
							fileName: _jsxFileName,
							lineNumber: 179,
							columnNumber: 38
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 178,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 159,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 157,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 58,
		columnNumber: 10
	}, this);
}
function TraitsEditor({ value, onChange }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-wrap gap-2",
			children: value.map((t, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-muted",
				children: [t, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: () => onChange(value.filter((_, j) => j !== i)),
					"aria-label": "حذف",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-3 w-3" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 204,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 203,
					columnNumber: 13
				}, this)]
			}, i, true, {
				fileName: _jsxFileName,
				lineNumber: 201,
				columnNumber: 30
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 200,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: "ویژگی جدید...",
				onKeyDown: (e) => {
					if (e.key === "Enter" && draft.trim()) {
						onChange([...value, draft.trim()]);
						setDraft("");
					}
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 209,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PrimaryButton, {
				onClick: () => {
					if (draft.trim()) {
						onChange([...value, draft.trim()]);
						setDraft("");
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 221,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 215,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 208,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 199,
		columnNumber: 10
	}, this);
}
//#endregion
export { PersonalityTypesAdmin as component };
