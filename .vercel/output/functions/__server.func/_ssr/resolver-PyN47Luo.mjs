import { i as enumType, l as stringType, n as arrayType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resolver-PyN47Luo.js
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
/**
* NAMA Platform — Workspace Validation.
*
* Zod schemas for workspace operations.
* These validate input at the service/repository boundary.
*/
var workspaceStatusSchema = enumType([
	"provisioning",
	"active",
	"trial",
	"suspended",
	"archived",
	"deleted"
]);
var workspacePlanSchema = enumType([
	"free",
	"starter",
	"pro",
	"enterprise"
]);
var workspaceRoleSchema = enumType([
	"owner",
	"admin",
	"member",
	"viewer"
]);
var workspaceLimitsSchema = objectType({
	maxPages: numberType().int().min(0),
	maxMedia: numberType().int().min(0),
	maxStorage: numberType().int().min(0),
	maxTemplates: numberType().int().min(0),
	maxAdmins: numberType().int().min(0),
	maxAnalyticsRetention: numberType().int().min(0),
	maxVisitors: numberType().int().min(0)
});
var workspaceMembershipSchema = objectType({
	userId: stringType().min(1).nullable(),
	role: workspaceRoleSchema,
	joinedAt: stringType().datetime({ offset: true })
});
var workspaceMetadataSchema = objectType({
	name: stringType().min(1).max(200),
	description: stringType().max(2e3).optional(),
	logo: stringType().url().optional(),
	domain: stringType().optional(),
	locale: stringType().min(2).max(10),
	timezone: stringType().min(1).max(50),
	createdAt: stringType().datetime({ offset: true }),
	updatedAt: stringType().datetime({ offset: true })
});
var workspaceEntitySchema = objectType({
	id: stringType().min(1),
	status: workspaceStatusSchema,
	plan: workspacePlanSchema,
	limits: workspaceLimitsSchema,
	membership: arrayType(workspaceMembershipSchema),
	metadata: workspaceMetadataSchema
});
objectType({
	name: stringType().min(1).max(200),
	description: stringType().max(2e3).optional(),
	plan: workspacePlanSchema.optional().default("free"),
	ownerUserId: stringType().min(1),
	locale: stringType().min(2).max(10).optional().default("fa-IR"),
	timezone: stringType().min(1).max(50).optional().default("Asia/Tehran")
});
objectType({
	name: stringType().min(1).max(200).optional(),
	description: stringType().max(2e3).optional(),
	logo: stringType().url().optional(),
	domain: stringType().optional(),
	locale: stringType().min(2).max(10).optional(),
	timezone: stringType().min(1).max(50).optional()
});
objectType({
	userId: stringType().min(1),
	role: workspaceRoleSchema.optional().default("member")
});
objectType({
	userId: stringType().min(1),
	role: workspaceRoleSchema
});
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/**
* Generate a unique ID using crypto.randomUUID().
* Falls back to a timestamp + random string for environments without crypto.
*/
function createId() {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
var PLAN_LIMITS = {
	free: {
		maxPages: 10,
		maxMedia: 20,
		maxStorage: 50 * 1024 * 1024,
		maxTemplates: 1,
		maxAdmins: 1,
		maxAnalyticsRetention: 30,
		maxVisitors: 1e3
	},
	starter: {
		maxPages: 50,
		maxMedia: 100,
		maxStorage: 500 * 1024 * 1024,
		maxTemplates: 5,
		maxAdmins: 3,
		maxAnalyticsRetention: 90,
		maxVisitors: 1e4
	},
	pro: {
		maxPages: 200,
		maxMedia: 500,
		maxStorage: 2 * 1024 * 1024 * 1024,
		maxTemplates: 20,
		maxAdmins: 10,
		maxAnalyticsRetention: 365,
		maxVisitors: 1e5
	},
	enterprise: {
		maxPages: 1e3,
		maxMedia: 5e3,
		maxStorage: 20 * 1024 * 1024 * 1024,
		maxTemplates: 100,
		maxAdmins: 100,
		maxAnalyticsRetention: 730,
		maxVisitors: 1e6
	}
};
/**
* Get the default limits for a plan.
* Returns free limits for unknown plans as a safe fallback.
*/
function getDefaultLimits(plan) {
	return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}
/**
* Create a new workspace entity with proper defaults.
*
* The workspace starts in "provisioning" status.
* The caller (WorkspaceService) transitions it to "active" or "trial"
* after setup is complete.
*/
function createWorkspace(options) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const plan = options.plan ?? "free";
	return {
		id: createId(),
		status: "provisioning",
		plan,
		limits: getDefaultLimits(plan),
		membership: [{
			userId: options.ownerUserId,
			role: "owner",
			joinedAt: now
		}],
		metadata: {
			name: options.name,
			description: options.description,
			locale: options.locale ?? "fa-IR",
			timezone: options.timezone ?? "Asia/Tehran",
			domain: options.domain,
			createdAt: now,
			updatedAt: now
		}
	};
}
/**
* Create the default workspace for single-tenant setups.
* Used by the WorkspaceResolver when no workspace exists for a user.
*/
function createDefaultWorkspace(ownerUserId, name) {
	return createWorkspace({
		name: name ?? "Default Workspace",
		ownerUserId,
		plan: "free"
	});
}
/**
* NAMA Platform — Global constants.
*/
/**
* DEFAULT_WORKSPACE_ID: The workspace ID for the existing single-tenant site.
* This was the original kafekhane before multi-tenant support.
* Used as the workspace_id for all existing data rows during migration.
*
* This is a valid UUID generated once and hardcoded for consistency.
* DO NOT change this after the migration has been applied.
*/
var DEFAULT_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";
/**
* The domain of the main platform site.
* For the original single-tenant workspace, this is the current production domain.
*/
var PLATFORM_DOMAIN = "nama.app";
/**
* NAMA Platform — Workspace Repository.
*
* Persists workspaces table (created by migration 20260707000001).
* Provides direct SQL queries with proper indexes.
* Maintains backward compatibility: the old site_content storage
* pattern is preserved for read-only fallback during migration window.
*/
var WorkspaceRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	/**
	* Find a workspace by ID.
	* Queries the new workspaces table directly.
	* Returns null if not found.
	*/
	async findById(id) {
		try {
			const { data, error } = await this.db.from("workspaces").select("*").eq("id", id).maybeSingle();
			if (error) throw error;
			if (!data) return null;
			return this._mapRowToEntity(data);
		} catch (err) {
			throw this.normalizeError("workspaces", "workspace.findById", err, { id });
		}
	}
	/**
	* Find a workspace by domain.
	* Uses the workspaces.domain index for fast lookup.
	* Returns null if not found.
	*/
	async findByDomain(domain) {
		try {
			const { data, error } = await this.db.from("workspaces").select("*").eq("domain", domain).maybeSingle();
			if (error) throw error;
			if (!data) return null;
			return this._mapRowToEntity(data);
		} catch (err) {
			throw this.normalizeError("workspaces", "workspace.findByDomain", err, { domain });
		}
	}
	/**
	* Find a workspace by subdomain.
	* Workspaces are persisted by their full domain (`${slug}.${PLATFORM_DOMAIN}`,
	* e.g. "khane.nama.app"). A subdomain request (e.g. `khane.<platform>`) maps to
	* the slug `khane`, so resolve via the canonical domain rather than a
	* (non-existent) `subdomain` column.
	* Returns null if not found.
	*/
	async findBySubdomain(subdomain) {
		return this.findByDomain(`${subdomain}.${PLATFORM_DOMAIN}`);
	}
	/**
	* Save (create or update) a workspace entity.
	* Upserts to the workspaces table.
	*/
	async save(entity) {
		try {
			const validated = this.validateOrThrow(workspaceEntitySchema, entity, `workspace.save(${entity.id})`);
			const row = this._mapEntityToRow(validated);
			const { error } = await this.db.from("workspaces").upsert(row);
			if (error) throw error;
			this.logger.info(`Workspace saved: ${entity.id}`, { source: "workspace" });
		} catch (err) {
			throw this.normalizeError("workspaces", "workspace.save", err, { id: entity.id });
		}
	}
	/**
	* Delete a workspace entity from storage.
	*/
	async delete(id) {
		try {
			const { error } = await this.db.from("workspaces").delete().eq("id", id);
			if (error) throw error;
			this.logger.info(`Workspace deleted: ${id}`, { source: "workspace" });
		} catch (err) {
			throw this.normalizeError("workspaces", "workspace.delete", err, { id });
		}
	}
	/**
	* List all stored workspaces.
	*/
	async listAll() {
		try {
			const { data, error } = await this.db.from("workspaces").select("*");
			if (error) throw error;
			if (!data) return [];
			return data.map((row) => this._mapRowToEntity(row)).filter(Boolean);
		} catch (err) {
			throw this.normalizeError("workspaces", "workspace.listAll", err);
		}
	}
	/**
	* Find workspaces a user belongs to.
	* Uses the workspaces.owner_user_id index for fast lookup.
	* Note: This queries by owner_user_id directly.
	* For full membership queries (including non-owner members), we'd need
	* a workspace_members join table — TODO for future.
	*/
	async findByUserId(userId) {
		try {
			const { data, error } = await this.db.from("workspaces").select("*").eq("owner_user_id", userId);
			if (error) throw error;
			if (!data) return [];
			return data.map((row) => this._mapRowToEntity(row)).filter(Boolean);
		} catch (err) {
			throw this.normalizeError("workspaces", "workspace.findByUserId", err, { userId });
		}
	}
	/**
	* Get or create a default workspace for a user.
	* Used in single-tenant mode when no workspace exists yet.
	*/
	async getOrCreateDefault(userId) {
		try {
			const existing = await this.findByUserId(userId);
			if (existing.length > 0) return existing[0];
			const entity = createDefaultWorkspace(userId);
			entity.status = "active";
			await this.save(entity);
			this.logger.info(`Default workspace created for user ${userId}: ${entity.id}`, { source: "workspace" });
			return entity;
		} catch (err) {
			const existing = await this.findByUserId(userId);
			if (existing.length > 0) return existing[0];
			throw this.normalizeError("workspaces", "workspace.getOrCreateDefault", err, { userId });
		}
	}
	/**
	* Ensure the default workspace exists (idempotent).
	* Returns the default workspace entity.
	* Used during app initialization / health checks.
	*/
	async ensureDefault() {
		try {
			let entity = await this.findById(DEFAULT_WORKSPACE_ID);
			if (entity) return entity;
			entity = createDefaultWorkspace("system");
			entity.id = DEFAULT_WORKSPACE_ID;
			entity.status = "active";
			await this.save(entity);
			return entity;
		} catch (err) {
			throw this.normalizeError("workspaces", "workspace.ensureDefault", err);
		}
	}
	_mapRowToEntity(row) {
		try {
			const entity = {
				id: row.id,
				status: row.status,
				plan: row.plan,
				limits: row.limits ?? {},
				membership: [...row.owner_user_id ? [{
					userId: row.owner_user_id,
					role: "owner",
					joinedAt: row.created_at
				}] : []],
				metadata: {
					...row.metadata ?? {},
					domain: row.domain ?? void 0,
					createdAt: row.created_at,
					updatedAt: row.updated_at
				}
			};
			const result = workspaceEntitySchema.safeParse(entity);
			return result.success ? result.data : null;
		} catch {
			return null;
		}
	}
	_mapEntityToRow(entity) {
		const ownerMembership = entity.membership.find((m) => m.role === "owner");
		const domain = entity.metadata?.domain ?? null;
		const { domain: _d, createdAt: _ca, updatedAt: _ua, ...dbMetadata } = entity.metadata ?? {};
		return {
			id: entity.id,
			domain,
			owner_user_id: ownerMembership?.userId ?? null,
			status: entity.status,
			plan: entity.plan,
			limits: entity.limits,
			metadata: dbMetadata,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
	}
};
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
* Resolve workspace by domain name or subdomain.
* Handles both bare domains ("mycafe.com") and subdomains ("mycafe").
*/
async function resolveWorkspaceByDomain(deps, domainOrSubdomain, isSubdomain = false) {
	const cache = getCache();
	const logger = getLogger();
	return cache.getOrFetch("workspace_resolver", `domain:${domainOrSubdomain}:${isSubdomain}`, async () => {
		if (!domainOrSubdomain) return {};
		let exactWorkspace;
		try {
			exactWorkspace = await deps.workspaceRepository.findByDomain(domainOrSubdomain);
		} catch (err) {
			logger.error("resolveWorkspaceByDomain: findByDomain failed", {
				source: "workspace",
				domain: domainOrSubdomain,
				isSubdomain,
				cause: err instanceof Error ? err : new Error(String(err))
			});
			throw err instanceof Error ? err : new Error(String(err));
		}
		if (exactWorkspace) return {
			workspaceId: exactWorkspace.id,
			entity: exactWorkspace
		};
		if (isSubdomain) try {
			const sw = await deps.workspaceRepository.findBySubdomain(domainOrSubdomain);
			if (sw) return {
				workspaceId: sw.id,
				entity: sw
			};
		} catch (err) {
			logger.warn("resolveWorkspaceByDomain: findBySubdomain failed (ignored)", {
				source: "workspace",
				domain: domainOrSubdomain,
				cause: err instanceof Error ? err : new Error(String(err))
			});
		}
		else {
			const withoutWww = domainOrSubdomain.startsWith("www.") ? domainOrSubdomain.slice(4) : void 0;
			if (withoutWww && withoutWww !== domainOrSubdomain) {
				try {
					const ew2 = await deps.workspaceRepository.findByDomain(withoutWww);
					if (ew2) return {
						workspaceId: ew2.id,
						entity: ew2
					};
				} catch (err) {
					logger.warn("resolveWorkspaceByDomain: findByDomain(www-stripped) failed (ignored)", {
						source: "workspace",
						domain: withoutWww,
						cause: err instanceof Error ? err : new Error(String(err))
					});
				}
				const baseDomain = withoutWww.replace(/\.[^.]+$/, "");
				try {
					const sw2 = await deps.workspaceRepository.findBySubdomain(baseDomain);
					if (sw2) return {
						workspaceId: sw2.id,
						entity: sw2
					};
				} catch (err) {
					logger.warn("resolveWorkspaceByDomain: findBySubdomain(base) failed (ignored)", {
						source: "workspace",
						domain: baseDomain,
						cause: err instanceof Error ? err : new Error(String(err))
					});
				}
			}
		}
		logger.debug("resolveWorkspaceByDomain: no workspace found for domain", {
			source: "workspace",
			domain: domainOrSubdomain,
			isSubdomain
		});
		return {};
	}, 3e4);
}
/**
* Resolve the workspace context for a given user.
* Results are cached per-request to prevent duplicate workspace lookups.
*/
async function resolveWorkspace(deps, userId, options) {
	if (options?.workspaceId) return getCache().getOrFetch("workspace_resolver", `by-id:${options.workspaceId}`, async () => {
		const entity = await deps.workspaceRepository.findById(options.workspaceId);
		if (!entity) return {
			workspaceId: void 0,
			entity: void 0
		};
		return {
			workspaceId: entity.id,
			entity
		};
	}, 1e4);
	return getCache().getOrFetch("workspace_resolver", `by-user:${userId}`, async () => {
		const workspaces = await deps.workspaceRepository.findByUserId(userId);
		if (workspaces.length === 0) {
			const entity = await deps.workspaceRepository.getOrCreateDefault(userId);
			return {
				workspaceId: entity.id,
				entity
			};
		}
		if (workspaces.length === 1) {
			const entity = workspaces[0];
			return {
				workspaceId: entity.id,
				entity
			};
		}
		const entity = [...workspaces].sort((a, b) => new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime())[0];
		return {
			workspaceId: entity.id,
			entity
		};
	}, 1e4);
}
/**
* Resolve workspace from request context (domain/subdomain + userId + options).
* Priority: explicit workspaceId > domain resolution > user resolution.
*/
async function resolveWorkspaceFromRequest(deps, opts) {
	if (opts.workspaceId) {
		const entity = await deps.workspaceRepository.findById(opts.workspaceId);
		if (entity) return {
			workspaceId: entity.id,
			entity
		};
	}
	if (opts.domain) {
		const result = await resolveWorkspaceByDomain(deps, opts.domain, opts.isSubdomain ?? false);
		if (result.entity) return {
			workspaceId: result.entity.id,
			entity: result.entity
		};
	}
	if (opts.userId) return resolveWorkspace(deps, opts.userId, { workspaceId: opts.workspaceId });
	return {
		workspaceId: void 0,
		entity: void 0
	};
}
//#endregion
export { DEFAULT_WORKSPACE_ID as a, WorkspaceRepository as c, createWorkspace as d, getCache as f, workspacePlanSchema as h, DEFAULT_WORKSPACE as i, cn as l, resolveWorkspaceFromRequest as m, AuthError as n, PLATFORM_DOMAIN as o, getLogger as p, BaseRepository as r, StorageError as s, ACTIVE_WORKSPACE_STATUSES as t, createId as u };
