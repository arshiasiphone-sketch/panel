import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { C as usePersonalityProfiles } from "./cms-BguKx8mI.mjs";
import { t as PERSONALITY_PROFILES } from "./test-data-CeIpy77Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/personality-store-B4NZghru.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var ALL_TYPES = [
	"paparoch",
	"zhampin",
	"fofino",
	"gombak",
	"bedone"
];
function hexToRgba(hex, alpha) {
	const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
	if (!m) return `rgba(212,175,55,${alpha})`;
	const int = parseInt(m[1], 16);
	return `rgba(${int >> 16 & 255},${int >> 8 & 255},${int & 255},${alpha})`;
}
/** Merge a database row (if any) with hardcoded defaults. */
function resolveProfile(type, rows) {
	const base = PERSONALITY_PROFILES[type];
	const row = rows?.find((r) => r.key === type);
	if (!row) return base;
	const color = row.color_from || base.color;
	return {
		type,
		label: row.label || base.label,
		tagline: row.tagline || base.tagline,
		description: row.description || base.description,
		traits: row.traits?.length ? row.traits : base.traits,
		drink: row.drink || base.drink,
		spot: row.spot || base.spot,
		color,
		accentColor: row.color_to || base.accentColor,
		bgColor: hexToRgba(color, .1),
		borderColor: hexToRgba(color, .25)
	};
}
function defaultDbRow(type, sortOrder) {
	const p = PERSONALITY_PROFILES[type];
	return {
		key: type,
		label: p.label,
		tagline: p.tagline,
		description: p.description,
		traits: p.traits,
		drink: p.drink,
		spot: p.spot,
		color_from: p.color,
		color_to: p.accentColor,
		sort_order: sortOrder,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
/** React hook returning all profiles merged with database content. */
function useResolvedProfiles() {
	const { data: rows } = usePersonalityProfiles();
	return (0, import_react.useMemo)(() => {
		const out = {};
		ALL_TYPES.forEach((t) => {
			out[t] = resolveProfile(t, rows);
		});
		return out;
	}, [rows]);
}
//#endregion
export { useResolvedProfiles as i, defaultDbRow as n, resolveProfile as r, ALL_TYPES as t };
