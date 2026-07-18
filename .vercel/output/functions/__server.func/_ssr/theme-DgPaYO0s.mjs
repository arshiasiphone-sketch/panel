import { r as __exportAll } from "../_runtime.mjs";
import { r as __exportAll$1 } from "./client.server-V7xMqmPH.mjs";
import { a as literalType, c as recordType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType, t as anyType, u as unknownType } from "../_libs/zod.mjs";
import { f as getCache, r as BaseRepository } from "./resolver-PyN47Luo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-DgPaYO0s.js
var theme_DgPaYO0s_exports = /* @__PURE__ */ __exportAll({
	a: () => galleryImageSchema,
	c: () => pageViewSchema,
	d: () => testConfigSchema,
	f: () => testResponseSchema,
	i: () => eventSchema,
	l: () => personalityProfileUpdateSchema,
	m: () => themeSchema,
	n: () => theme_exports,
	o: () => mediaFileSchema,
	p: () => testimonialSchema,
	r: () => blockSchema,
	s: () => menuItemSchema,
	t: () => ThemeRepository,
	u: () => siteContentValueSchema
});
var menuItemSchema = objectType({
	id: stringType().uuid().optional(),
	category: stringType().min(1, "دسته الزامی است"),
	name: stringType().min(1, "نام الزامی است"),
	description: stringType().optional().default(""),
	price: stringType().min(1, "قیمت الزامی است"),
	image_url: stringType().url("آدرس نامعتبر").optional().or(literalType("")).default(""),
	sort_order: numberType().int().default(0),
	visible: booleanType().default(true)
});
var galleryImageSchema = objectType({
	id: stringType().uuid().optional(),
	title: stringType().optional().default(""),
	image_url: stringType().url("آدرس تصویر نامعتبر"),
	tags: arrayType(stringType()).optional().default([]),
	sort_order: numberType().int().default(0),
	visible: booleanType().default(true)
});
var eventSchema = objectType({
	id: stringType().uuid().optional(),
	title: stringType().min(1, "عنوان الزامی است"),
	description: stringType().optional().default(""),
	date_label: stringType().optional().default(""),
	image_url: stringType().optional().default(""),
	sort_order: numberType().int().default(0),
	visible: booleanType().default(true)
});
var testimonialSchema = objectType({
	id: stringType().uuid().optional(),
	name: stringType().min(1, "نام الزامی است"),
	type: stringType().optional().default(""),
	text: stringType().min(1, "متن الزامی است"),
	sort_order: numberType().int().default(0),
	visible: booleanType().default(true)
});
var blockSchema = objectType({
	id: stringType().uuid().optional(),
	type: stringType().min(1),
	data: recordType(anyType()).default({}),
	sort_order: numberType().int().default(0),
	visible: booleanType().default(true)
});
var themeSchema = objectType({
	primary_color: stringType().regex(/^#[0-9a-fA-F]{6}$/, "رنگ نامعتبر"),
	secondary_color: stringType().regex(/^#[0-9a-fA-F]{6}$/),
	accent_color: stringType().regex(/^#[0-9a-fA-F]{6}$/),
	background_color: stringType().regex(/^#[0-9a-fA-F]{6}$/),
	text_color: stringType().regex(/^#[0-9a-fA-F]{6}$/),
	text_secondary_color: stringType().regex(/^#[0-9a-fA-F]{6}$/),
	text_tertiary_color: stringType().regex(/^#[0-9a-fA-F]{6}$/),
	border_radius: stringType(),
	glass_opacity: numberType().min(0).max(1)
});
objectType({
	title: stringType(),
	subtitle: stringType(),
	badge: stringType(),
	cta_text: stringType()
});
objectType({
	address: stringType(),
	phone: stringType(),
	hours: stringType()
});
objectType({
	instagram: stringType(),
	instagram_handle: stringType()
});
objectType({
	title: stringType(),
	bio: stringType(),
	avatar_url: stringType().optional().default("")
});
/** Schema for site_content upsert values. */
var siteContentValueSchema = recordType(unknownType());
/** Schema for media_file metadata. */
var mediaFileSchema = objectType({
	name: stringType().min(1, "نام فایل الزامی است"),
	storage_path: stringType().min(1),
	folder: stringType().min(1).default("uploads"),
	tags: arrayType(stringType()).default([]),
	size_bytes: numberType().int().positive(),
	mime_type: stringType()
});
/** Schema for page view records (analytics). */
var pageViewSchema = objectType({
	path: stringType().default("/"),
	referrer: stringType().nullable().optional(),
	user_agent: stringType().nullable().optional()
});
/** Schema for test response submission. */
var testResponseSchema = objectType({
	answers: recordType(stringType()),
	result: stringType().min(1),
	tied: arrayType(stringType()).default([]),
	user_full_name: stringType().optional().default(""),
	user_phone: stringType().optional().default(""),
	user_age: numberType().int().nullable().optional(),
	user_gender: stringType().optional().default("")
});
/** Schema for test questions configuration (stored as site_content value). */
var testConfigSchema = objectType({
	overrides: recordType(unknownType()).default({}),
	orderedIds: arrayType(numberType()).nullable().default(null)
});
/** Schema for personality profile updates. */
var personalityProfileUpdateSchema = objectType({
	label: stringType().optional(),
	tagline: stringType().optional(),
	description: stringType().optional(),
	traits: arrayType(stringType()).optional(),
	drink: stringType().optional(),
	spot: stringType().optional(),
	color_from: stringType().optional(),
	color_to: stringType().optional()
});
objectType({
	session_id: stringType().min(1),
	page_path: stringType().min(1),
	referrer: stringType().optional().default(""),
	user_agent: stringType().optional().default(""),
	device_type: stringType().optional().default("unknown"),
	ip_hash: stringType().optional().default("")
});
/**
* Theme repository — encapsulates theme_settings table operations.
*/
var theme_exports = /* @__PURE__ */ __exportAll$1({
	DEFAULT_THEME_SETTINGS: () => DEFAULT_THEME_SETTINGS,
	ThemeRepository: () => ThemeRepository
});
var SELECT_COLUMNS = "id,primary_color,secondary_color,accent_color,background_color,text_color,text_secondary_color,text_tertiary_color,border_radius,glass_opacity,name,preset_id,tokens,updated_at";
var DEFAULT_THEME_SETTINGS = {
	id: 1,
	primary_color: "#d4af37",
	secondary_color: "#0f172a",
	accent_color: "#d4af37",
	background_color: "#0a0a0a",
	text_color: "#f0e6d3",
	text_secondary_color: "#978876",
	text_tertiary_color: "#c9b89e",
	border_radius: "0.75rem",
	glass_opacity: .08,
	name: null,
	preset_id: null,
	tokens: null,
	updated_at: (/* @__PURE__ */ new Date()).toISOString()
};
var ThemeRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async get() {
		return getCache().getOrFetch("theme_settings", "get", async () => {
			try {
				const { data, error } = await this.withWorkspace(this.db.from("theme_settings").select(SELECT_COLUMNS).order("id", { ascending: true }).limit(1)).maybeSingle();
				if (error) throw error;
				if (!data) {
					const { data: inserted } = await this.db.from("theme_settings").insert({ workspace_id: this.workspaceId }).select().maybeSingle();
					return {
						...DEFAULT_THEME_SETTINGS,
						...inserted ?? {}
					};
				}
				return {
					...DEFAULT_THEME_SETTINGS,
					...data
				};
			} catch (err) {
				throw this.normalizeError("theme_settings", "get", err);
			}
		});
	}
	/**
	* Install theme settings from blueprint data.
	*
	* theme_settings is a GLOBAL singleton (one row, id=1 — enforced by the
	* `theme_singleton` CHECK). It is intentionally NOT workspace-scoped (it has
	* no `workspace_id` column in the deployed schema), so this must upsert the
	* singleton row directly rather than via withWorkspace(). The previous
	* implementation filtered/seeded by `workspace_id`, which threw on every
	* provision and aborted the pipeline before WORKSPACE_READY — leaving every
	* workspace stuck at `provisioning` despite its content being written.
	*
	* Idempotent: re-running upserts the same singleton row.
	*/
	async installBlueprintTheme(theme) {
		const { data: existing } = await this.db.from("theme_settings").select("id").limit(1);
		const targetId = (existing && existing[0]?.id) ?? 1;
		const update = {
			preset_id: theme.presetId,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (theme.overrides) {
			if (theme.overrides.primaryColor) update.primary_color = theme.overrides.primaryColor;
			if (theme.overrides.secondaryColor) update.secondary_color = theme.overrides.secondaryColor;
			if (theme.overrides.accentColor) update.accent_color = theme.overrides.accentColor;
			if (theme.overrides.backgroundColor) update.background_color = theme.overrides.backgroundColor;
			if (theme.overrides.textColor) update.text_color = theme.overrides.textColor;
			if (theme.overrides.textSecondaryColor) update.text_secondary_color = theme.overrides.textSecondaryColor;
			if (theme.overrides.textTertiaryColor) update.text_tertiary_color = theme.overrides.textTertiaryColor;
			if (theme.overrides.borderRadius) update.border_radius = theme.overrides.borderRadius;
			if (theme.overrides.glassOpacity !== void 0) update.glass_opacity = theme.overrides.glassOpacity;
		}
		const { error } = await this.db.from("theme_settings").upsert({
			id: targetId,
			...update
		});
		if (error) throw this.normalizeError("theme_settings", "installBlueprintTheme", error);
	}
	async update(patch) {
		try {
			this.validateOrThrow(themeSchema, patch, "theme_settings");
			const { data: existing } = await this.withWorkspace(this.db.from("theme_settings").select("id").limit(1)).maybeSingle();
			if (!existing) throw new Error("No theme settings found to update");
			const { error } = await this.db.from("theme_settings").update(patch).eq("id", existing.id);
			if (error) throw error;
			getCache().invalidate("theme_settings");
		} catch (err) {
			throw this.normalizeError("theme_settings", "update", err);
		}
	}
};
//#endregion
export { mediaFileSchema as a, personalityProfileUpdateSchema as c, testResponseSchema as d, testimonialSchema as f, galleryImageSchema as i, siteContentValueSchema as l, theme_DgPaYO0s_exports as m, blockSchema as n, menuItemSchema as o, themeSchema as p, eventSchema as r, pageViewSchema as s, ThemeRepository as t, testConfigSchema as u };
