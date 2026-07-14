import { r as __exportAll } from "../_runtime.mjs";
import { r as __exportAll$1 } from "./supabase-B2jjn2gh.mjs";
import { a as literalType, c as recordType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType, t as anyType, u as unknownType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-BCfTkcdv.js
var theme_BCfTkcdv_exports = /* @__PURE__ */ __exportAll({
	_: () => AuthError,
	a: () => eventSchema,
	b: () => ACTIVE_WORKSPACE_STATUSES,
	c: () => menuItemSchema,
	d: () => siteContentValueSchema,
	f: () => testConfigSchema,
	g: () => BaseRepository,
	h: () => themeSchema,
	i: () => blockSchema,
	l: () => pageViewSchema,
	m: () => testimonialSchema,
	n: () => theme_exports,
	o: () => galleryImageSchema,
	p: () => testResponseSchema,
	r: () => getCache,
	s: () => mediaFileSchema,
	t: () => ThemeRepository,
	u: () => personalityProfileUpdateSchema,
	v: () => StorageError,
	x: () => DEFAULT_WORKSPACE,
	y: () => getLogger
});
/** Workspace statuses that allow read/write operations. */
var ACTIVE_WORKSPACE_STATUSES = /* @__PURE__ */ new Set(["active", "trial"]);
/** Default single-tenant workspace context. */
var DEFAULT_WORKSPACE = {
	workspaceId: void 0,
	entity: void 0
};
var LOG_LEVEL_PRIORITY = {
	trace: -1,
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
	critical: 4
};
function getMinLevel() {
	if (typeof process !== "undefined" && process.env?.NAMA_LOG_LEVEL) return process.env.NAMA_LOG_LEVEL;
	if (typeof process !== "undefined" && true) return "warn";
	return "info";
}
function shouldLog(level) {
	return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[getMinLevel()];
}
function formatMeta(meta) {
	if (!meta || Object.keys(meta).length === 0) return "";
	const source = meta.source ? `[${meta.source}] ` : "";
	const rest = { ...meta };
	delete rest.source;
	return `${source}${Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : ""}`;
}
var PREFIX = "[NAMA]";
function createLogEntry(level, message, meta) {
	return {
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		level,
		message,
		meta
	};
}
var ConsoleLogger = class {
	trace(message, meta) {
		if (!shouldLog("trace")) return;
		createLogEntry("trace", message, meta);
		console.debug(`${PREFIX} ${formatMeta(meta)}${message}`);
	}
	debug(message, meta) {
		if (!shouldLog("debug")) return;
		console.debug(`${PREFIX} ${formatMeta(meta)}${message}`);
	}
	info(message, meta) {
		if (!shouldLog("info")) return;
		console.info(`${PREFIX} ${formatMeta(meta)}${message}`);
	}
	warn(message, meta) {
		if (!shouldLog("warn")) return;
		console.warn(`${PREFIX} ${formatMeta(meta)}${message}`);
	}
	error(message, meta) {
		if (!shouldLog("error")) return;
		console.error(`${PREFIX} ${formatMeta(meta)}${message}`);
	}
	critical(message, meta) {
		createLogEntry("critical", message, meta);
		console.error(`${PREFIX} [CRITICAL] ${formatMeta(meta)}${message}`);
	}
};
var _logger = new ConsoleLogger();
/** Get the current logger instance. */
function getLogger() {
	return _logger;
}
var BaseAppError = class extends Error {
	/** Machine-readable error code (e.g. "REPO_NOT_FOUND", "VALIDATION_FAILED"). */
	code;
	/** The original error that caused this one (if any). */
	cause;
	/** Additional structured metadata. */
	context;
	constructor(message, opts) {
		super(message);
		this.name = this.constructor.name;
		this.code = opts?.code;
		this.cause = opts?.cause;
		this.context = opts?.context ?? {};
	}
	/** Human-readable representation including code when available. */
	get fullMessage() {
		return this.code ? `[${this.code}] ${this.message}` : this.message;
	}
};
var RepositoryError = class extends BaseAppError {
	constructor(table, operation, opts) {
		super(opts?.message ?? `Repository operation failed: ${operation} on ${table}`, {
			code: opts?.code ?? `REPO_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
			cause: opts?.cause,
			context: {
				...opts?.context,
				table,
				operation
			}
		});
	}
};
var ValidationError = class extends BaseAppError {
	constructor(target, issues, opts) {
		const detail = issues.map((i) => `${i.path}: ${i.message}`).join("; ");
		super(`Validation failed for ${target}: ${detail}`, {
			code: "VALIDATION_FAILED",
			cause: opts?.cause,
			context: {
				...opts?.context,
				target,
				issues
			}
		});
	}
};
var ProviderError = class extends BaseAppError {
	constructor(provider, operation, opts) {
		super(opts?.message ?? `${provider} provider error during ${operation}`, {
			code: `PROVIDER_${provider.toUpperCase()}_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
			cause: opts?.cause,
			context: {
				...opts?.context,
				provider,
				operation
			}
		});
	}
};
var StorageError = class extends ProviderError {
	constructor(operation, bucket, opts) {
		super("storage", operation, {
			message: opts?.message ?? `Storage ${operation} failed on bucket "${bucket}"`,
			code: `STORAGE_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
			cause: opts?.cause,
			context: {
				...opts?.context,
				bucket
			}
		});
	}
};
var AuthError = class extends ProviderError {
	constructor(operation, opts) {
		super("auth", operation, {
			message: opts?.message ?? `Auth ${operation} failed`,
			code: `AUTH_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
			cause: opts?.cause,
			context: opts?.context
		});
	}
};
/**
* Base repository with workspace awareness, logging, and shared utilities.
*/
var BaseRepository = class {
	db;
	storage;
	auth;
	realtime;
	logger;
	workspace;
	constructor(deps) {
		this.db = deps.database;
		this.storage = deps.storage;
		this.auth = deps.auth;
		this.realtime = deps.realtime;
		this.workspace = deps.workspace ?? DEFAULT_WORKSPACE;
		this.logger = deps.logger ?? getLogger();
	}
	/**
	* Set the workspace context for this repository.
	*/
	setWorkspace(workspace) {
		this.workspace = workspace;
	}
	/**
	* Get the current workspace ID.
	*/
	get workspaceId() {
		return this.workspace.workspaceId;
	}
	/**
	* Apply workspace filter to a query. Mutates query in-place via .eq().
	* No-op if workspaceId is undefined (e.g. system-level queries).
	*/
	withWorkspace(query, column = "workspace_id") {
		if (this.workspaceId) return query.eq(column, this.workspaceId);
		return query;
	}
	/**
	* Validate input data against a Zod schema and return the parsed result.
	* Throws `ValidationError` if validation fails.
	*/
	validateOrThrow(schema, data, target) {
		const result = schema.safeParse(data);
		if (!result.success) {
			const issues = result.error.issues.map((i) => ({
				path: i.path.join(".") || "(root)",
				message: i.message
			}));
			this.logger.warn(`Validation failed for ${target}`, { issues });
			throw new ValidationError(target, issues);
		}
		return result.data;
	}
	/**
	* Wrap a provider error into a typed RepositoryError.
	* Use this in every catch block so callers always receive BaseAppError subclasses.
	*/
	normalizeError(table, operation, err, context) {
		if (err instanceof RepositoryError) return err;
		if (err instanceof BaseAppError) throw err;
		return new RepositoryError(table, operation, {
			cause: err,
			context: {
				...context,
				workspaceId: this.workspaceId
			}
		});
	}
	/**
	* Apply optional pagination to a query.
	* No-op if opts is undefined or empty — maintains backward compatibility.
	*
	* @example
	*   const query = this.db.from<T>("my_table").select("*");
	*   const paginated = this.applyPagination(query, opts);
	*/
	applyPagination(query, opts) {
		if (!opts) return query;
		if (opts.offset !== void 0 && opts.limit !== void 0) return query.range(opts.offset, opts.offset + opts.limit - 1);
		if (opts.limit !== void 0) return query.limit(opts.limit);
		return query;
	}
};
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
var RepositoryCache = class RepositoryCache {
	/** Default TTL for cached entries (5 seconds). */
	static DEFAULT_TTL_MS = 5e3;
	/** Per-request cache store. */
	store = {};
	/**
	* Get a value from cache, or fetch and cache it if not present.
	*
	* @param table - The table/entity type (e.g., "theme_settings", "site_content")
	* @param key - The cache key within the table (e.g., method name + args)
	* @param fetchFn - Function that returns the value if not cached
	* @param ttlMs - Optional TTL override
	* @returns The cached or freshly-fetched value
	*/
	async getOrFetch(table, key, fetchFn, ttlMs = RepositoryCache.DEFAULT_TTL_MS) {
		const cached = this._get(table, key);
		if (cached !== void 0) return cached;
		const value = await fetchFn();
		this._set(table, key, value, ttlMs);
		return value;
	}
	/**
	* Get a value synchronously if it exists in cache.
	* Returns undefined if not cached or expired.
	*/
	get(table, key) {
		return this._get(table, key);
	}
	/**
	* Set a value in cache.
	*/
	set(table, key, value, ttlMs) {
		this._set(table, key, value, ttlMs);
	}
	/**
	* Invalidate all cached entries for a given table.
	* Call this after any write/mutation on that table.
	*/
	invalidate(table) {
		const entries = this.store[table];
		if (entries) entries.clear();
	}
	/**
	* Invalidate a specific cached entry.
	*/
	invalidateKey(table, key) {
		const entries = this.store[table];
		if (entries) entries.delete(key);
	}
	/**
	* Clear the entire cache.
	*/
	clear() {
		for (const table of Object.keys(this.store)) this.store[table].clear();
	}
	/**
	* Get cache statistics.
	*/
	stats() {
		let entries = 0;
		for (const table of Object.keys(this.store)) entries += this.store[table].size;
		return {
			tables: Object.keys(this.store).length,
			entries
		};
	}
	_get(table, key) {
		const entries = this.store[table];
		if (!entries) return void 0;
		const entry = entries.get(key);
		if (!entry) return void 0;
		if (Date.now() - entry.createdAt >= entry.ttlMs) {
			entries.delete(key);
			return;
		}
		return entry.value;
	}
	_set(table, key, value, ttlMs) {
		if (!this.store[table]) this.store[table] = /* @__PURE__ */ new Map();
		this.store[table].set(key, {
			value,
			createdAt: Date.now(),
			ttlMs: ttlMs ?? RepositoryCache.DEFAULT_TTL_MS
		});
	}
};
var _instance = null;
/**
* Get the singleton RepositoryCache instance.
* In a multi-request environment (e.g., server), each request should
* get a fresh instance via `new RepositoryCache()`.
*/
function getCache() {
	if (!_instance) _instance = new RepositoryCache();
	return _instance;
}
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
export { testConfigSchema as _, StorageError as a, themeSchema as b, eventSchema as c, getLogger as d, mediaFileSchema as f, siteContentValueSchema as g, personalityProfileUpdateSchema as h, DEFAULT_WORKSPACE as i, galleryImageSchema as l, pageViewSchema as m, AuthError as n, ThemeRepository as o, menuItemSchema as p, BaseRepository as r, blockSchema as s, ACTIVE_WORKSPACE_STATUSES as t, getCache as u, testResponseSchema as v, theme_BCfTkcdv_exports as x, testimonialSchema as y };
