// _reprovision_workspaces.ts
import { randomUUID } from "node:crypto";

// src/integrations/supabase/client.server.ts
import { createClient } from "@supabase/supabase-js";
function isNewSupabaseApiKey(value) {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY)
    },
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
var _supabaseAdmin;
var supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});

// src/lib/providers/supabase/database.provider.ts
function createSupabaseDatabaseProvider(supabase) {
  return {
    from(table) {
      const sbQuery = supabase.from(table);
      return new SupabaseTableQuery(sbQuery);
    },
    async rpc(fn, params) {
      return supabase.rpc(fn, params);
    },
    removeChannel(channel) {
      return supabase.removeChannel(channel);
    }
  };
}
var SupabaseTableQuery = class {
  // The initial builder (PostgrestQueryBuilder or PostgrestFilterBuilder).
  // Must have at minimum: select, insert, upsert, update, delete.
  _builder;
  // Track the current operation type for execution
  _mode = "select";
  _modeArgs = [];
  // Deferred modifier operations — applied AFTER the initial mode call
  // in _execute(). This is necessary because .order(), .limit(), .eq()
  // etc. only exist on PostgrestFilterBuilder (returned by .select()),
  // not on the initial PostgrestQueryBuilder.
  _modifiers = [];
  constructor(builder) {
    this._builder = builder;
  }
  select(columns, opts) {
    this._mode = "select";
    if (opts) {
      this._modeArgs = [columns || "*", opts];
    } else if (typeof columns === "object" && columns !== null && "count" in columns) {
      this._modeArgs = ["*", columns];
    } else {
      this._modeArgs = [columns || "*"];
    }
    return this;
  }
  insert(values, opts) {
    this._mode = "insert";
    this._modeArgs = opts ? [values, opts] : [values];
    return this;
  }
  upsert(values, opts) {
    this._mode = "upsert";
    this._modeArgs = opts ? [values, opts] : [values];
    return this;
  }
  update(values) {
    this._mode = "update";
    this._modeArgs = [values];
    return this;
  }
  delete() {
    this._mode = "delete";
    this._modeArgs = [];
    return this;
  }
  // --- Filters and modifiers (deferred) ---
  eq(column, value) {
    this._modifiers.push({ method: "eq", args: [column, value] });
    return this;
  }
  like(column, pattern) {
    this._modifiers.push({ method: "like", args: [column, pattern] });
    return this;
  }
  in(column, values) {
    this._modifiers.push({ method: "in", args: [column, values] });
    return this;
  }
  neq(column, value) {
    this._modifiers.push({ method: "neq", args: [column, value] });
    return this;
  }
  gt(column, value) {
    this._modifiers.push({ method: "gt", args: [column, value] });
    return this;
  }
  gte(column, value) {
    this._modifiers.push({ method: "gte", args: [column, value] });
    return this;
  }
  lt(column, value) {
    this._modifiers.push({ method: "lt", args: [column, value] });
    return this;
  }
  lte(column, value) {
    this._modifiers.push({ method: "lte", args: [column, value] });
    return this;
  }
  order(column, opts) {
    const ascending = opts?.ascending ?? true;
    this._modifiers.push({ method: "order", args: [column, { ascending }] });
    return this;
  }
  limit(count) {
    this._modifiers.push({ method: "limit", args: [count] });
    return this;
  }
  // --- Terminal operations ---
  async maybeSingle() {
    const result = await this._execute();
    if (result.error) return { data: null, error: result.error };
    const arr = result.data;
    return { data: arr?.[0] ?? null, error: null };
  }
  async single() {
    this._modifiers.push({ method: "single", args: [] });
    const result = await this._execute();
    return result;
  }
  // --- Thenable ---
  then(onfulfilled, onrejected) {
    return this._execute().then(onfulfilled, onrejected);
  }
  // --- Internal ---
  /**
   * Apply deferred modifier operations on a builder chain.
   * This is used after the initial .select()/.insert() etc. call
   * to apply .order(), .limit(), .eq(), etc.
   *
   * Terminal methods like .single() are handled at the end of _execute().
   */
  _applyModifiers(builder) {
    let current = builder;
    for (const op of this._modifiers) {
      if (op.method === "single") {
        continue;
      }
      const fn = current[op.method];
      if (typeof fn !== "function") {
        continue;
      }
      current = fn.call(current, ...op.args);
    }
    return current;
  }
  async _execute() {
    switch (this._mode) {
      case "select": {
        let query = this._builder.select(...this._modeArgs);
        query = this._applyModifiers(query);
        const result = await query;
        return result;
      }
      case "insert": {
        let query = this._builder.insert(...this._modeArgs);
        query = this._applyModifiers(query);
        const result = await query;
        return result;
      }
      case "upsert": {
        let query = this._builder.upsert(...this._modeArgs);
        query = this._applyModifiers(query);
        const result = await query;
        return result;
      }
      case "update": {
        let query = this._builder.update(...this._modeArgs);
        query = this._applyModifiers(query);
        const result = await query;
        return result;
      }
      case "delete": {
        let query = this._builder.delete(...this._modeArgs);
        query = this._applyModifiers(query);
        const result = await query;
        return result;
      }
      default:
        return { data: null, error: new Error(`Unknown query mode: ${this._mode}`) };
    }
  }
};

// src/lib/providers/supabase/storage.provider.ts
function createSupabaseStorageProvider(supabase) {
  return {
    async upload(bucket, path, file, options) {
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        contentType: options?.contentType,
        upsert: options?.upsert
      });
      return { error };
    },
    async remove(bucket, paths) {
      const { error } = await supabase.storage.from(bucket).remove(paths);
      return { error };
    },
    getPublicUrl(bucket, path) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    }
  };
}

// src/lib/providers/supabase/auth.provider.ts
function createSupabaseAuthProvider(supabase) {
  return {
    async signInWithPassword(input) {
      return supabase.auth.signInWithPassword(input);
    },
    async signUp(input) {
      return supabase.auth.signUp(input);
    },
    async signOut() {
      await supabase.auth.signOut();
    },
    async getSession() {
      const result = await supabase.auth.getSession();
      return result;
    },
    onAuthStateChange(callback) {
      return supabase.auth.onAuthStateChange(
        callback
      );
    },
    async getClaims(token) {
      return supabase.auth.getClaims(token);
    }
  };
}

// src/lib/providers/supabase/realtime.provider.ts
function createSupabaseRealtimeProvider(supabase) {
  return {
    channel(name) {
      const sbChannel = supabase.channel(name);
      return new SupabaseChannelAdapter(sbChannel);
    },
    async removeChannel(channel) {
      await supabase.removeChannel(channel);
    },
    getChannels() {
      return supabase.getChannels();
    }
  };
}
var SupabaseChannelAdapter = class {
  _channel;
  constructor(channel) {
    this._channel = channel;
  }
  on(type, filter, callback) {
    this._channel = this._channel.on(
      type,
      filter,
      callback
    );
    return this;
  }
  subscribe(callback) {
    this._channel.subscribe(callback);
    return this;
  }
};

// src/lib/providers/supabase/index.ts
function createSupabaseAdminProviders() {
  return {
    database: createSupabaseDatabaseProvider(supabaseAdmin),
    storage: createSupabaseStorageProvider(supabaseAdmin),
    auth: createSupabaseAuthProvider(supabaseAdmin),
    realtime: createSupabaseRealtimeProvider(supabaseAdmin)
  };
}

// src/lib/core/workspace/types.ts
var DEFAULT_WORKSPACE = {
  workspaceId: void 0,
  entity: void 0
};

// src/lib/logger.ts
var LOG_LEVEL_PRIORITY = {
  trace: -1,
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  critical: 4
};
function getMinLevel() {
  if (typeof process !== "undefined" && process.env?.NAMA_LOG_LEVEL) {
    return process.env.NAMA_LOG_LEVEL;
  }
  if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
    return "warn";
  }
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
  const restStr = Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : "";
  return `${source}${restStr}`;
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
    const entry = createLogEntry("trace", message, meta);
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
    const entry = createLogEntry("critical", message, meta);
    console.error(`${PREFIX} [CRITICAL] ${formatMeta(meta)}${message}`);
  }
};
var _logger = new ConsoleLogger();
function getLogger() {
  return _logger;
}

// src/lib/errors.ts
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
      context: { ...opts?.context, table, operation }
    });
  }
};
var ValidationError = class extends BaseAppError {
  constructor(target, issues, opts) {
    const detail = issues.map((i) => `${i.path}: ${i.message}`).join("; ");
    super(`Validation failed for ${target}: ${detail}`, {
      code: "VALIDATION_FAILED",
      cause: opts?.cause,
      context: { ...opts?.context, target, issues }
    });
  }
};
var ProviderError = class extends BaseAppError {
  constructor(provider, operation, opts) {
    super(opts?.message ?? `${provider} provider error during ${operation}`, {
      code: `PROVIDER_${provider.toUpperCase()}_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
      cause: opts?.cause,
      context: { ...opts?.context, provider, operation }
    });
  }
};
var StorageError = class extends ProviderError {
  constructor(operation, bucket, opts) {
    super("storage", operation, {
      message: opts?.message ?? `Storage ${operation} failed on bucket "${bucket}"`,
      code: `STORAGE_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
      cause: opts?.cause,
      context: { ...opts?.context, bucket }
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

// src/lib/repositories/base.ts
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
    if (this.workspaceId) {
      return query.eq(column, this.workspaceId);
    }
    return query;
  }
  // ─── Validation helpers ───────────────────────────────────────────────────
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
  // ─── Error normalization ──────────────────────────────────────────────────
  /**
   * Wrap a provider error into a typed RepositoryError.
   * Use this in every catch block so callers always receive BaseAppError subclasses.
   */
  normalizeError(table, operation, err, context) {
    if (err instanceof RepositoryError) return err;
    if (err instanceof BaseAppError) throw err;
    return new RepositoryError(table, operation, {
      cause: err,
      context: { ...context, workspaceId: this.workspaceId }
    });
  }
  // ─── Pagination helper ────────────────────────────────────────────────────
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
    if (opts.offset !== void 0 && opts.limit !== void 0) {
      return query.range(opts.offset, opts.offset + opts.limit - 1);
    }
    if (opts.limit !== void 0) {
      return query.limit(opts.limit);
    }
    return query;
  }
};

// src/lib/core/workspace/validation.ts
import { z } from "zod";
var workspaceStatusSchema = z.enum([
  "provisioning",
  "active",
  "trial",
  "suspended",
  "archived",
  "deleted"
]);
var workspacePlanSchema = z.enum([
  "free",
  "starter",
  "pro",
  "enterprise"
]);
var workspaceRoleSchema = z.enum([
  "owner",
  "admin",
  "member",
  "viewer"
]);
var workspaceLimitsSchema = z.object({
  maxPages: z.number().int().min(0),
  maxMedia: z.number().int().min(0),
  maxStorage: z.number().int().min(0),
  maxTemplates: z.number().int().min(0),
  maxAdmins: z.number().int().min(0),
  maxAnalyticsRetention: z.number().int().min(0),
  maxVisitors: z.number().int().min(0)
});
var workspaceMembershipSchema = z.object({
  // Nullable: Public Provisioning API creates workspaces with no direct owner
  // (ownership is resolved externally via externalOrderId). See WorkspaceMembership.
  userId: z.string().min(1).nullable(),
  role: workspaceRoleSchema,
  joinedAt: z.string().datetime()
});
var workspaceMetadataSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2e3).optional(),
  logo: z.string().url().optional(),
  domain: z.string().optional(),
  locale: z.string().min(2).max(10),
  timezone: z.string().min(1).max(50),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
var workspaceEntitySchema = z.object({
  id: z.string().min(1),
  status: workspaceStatusSchema,
  plan: workspacePlanSchema,
  limits: workspaceLimitsSchema,
  membership: z.array(workspaceMembershipSchema),
  metadata: workspaceMetadataSchema
});
var createWorkspaceSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2e3).optional(),
  plan: workspacePlanSchema.optional().default("free"),
  ownerUserId: z.string().min(1),
  locale: z.string().min(2).max(10).optional().default("fa-IR"),
  timezone: z.string().min(1).max(50).optional().default("Asia/Tehran")
});
var updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2e3).optional(),
  logo: z.string().url().optional(),
  domain: z.string().optional(),
  locale: z.string().min(2).max(10).optional(),
  timezone: z.string().min(1).max(50).optional()
});
var addMemberSchema = z.object({
  userId: z.string().min(1),
  role: workspaceRoleSchema.optional().default("member")
});
var updateMemberRoleSchema = z.object({
  userId: z.string().min(1),
  role: workspaceRoleSchema
});

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// src/lib/core/workspace/factory.ts
var PLAN_LIMITS = {
  free: {
    maxPages: 10,
    maxMedia: 20,
    maxStorage: 50 * 1024 * 1024,
    // 50 MB
    maxTemplates: 1,
    maxAdmins: 1,
    maxAnalyticsRetention: 30,
    maxVisitors: 1e3
  },
  starter: {
    maxPages: 50,
    maxMedia: 100,
    maxStorage: 500 * 1024 * 1024,
    // 500 MB
    maxTemplates: 5,
    maxAdmins: 3,
    maxAnalyticsRetention: 90,
    maxVisitors: 1e4
  },
  pro: {
    maxPages: 200,
    maxMedia: 500,
    maxStorage: 2 * 1024 * 1024 * 1024,
    // 2 GB
    maxTemplates: 20,
    maxAdmins: 10,
    maxAnalyticsRetention: 365,
    maxVisitors: 1e5
  },
  enterprise: {
    maxPages: 1e3,
    maxMedia: 5e3,
    maxStorage: 20 * 1024 * 1024 * 1024,
    // 20 GB
    maxTemplates: 100,
    maxAdmins: 100,
    maxAnalyticsRetention: 730,
    maxVisitors: 1e6
  }
};
function getDefaultLimits(plan) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}
function createWorkspace(options) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const plan = options.plan ?? "free";
  return {
    id: createId(),
    status: "provisioning",
    plan,
    limits: getDefaultLimits(plan),
    membership: [
      {
        userId: options.ownerUserId,
        role: "owner",
        joinedAt: now
      }
    ],
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
function createDefaultWorkspace(ownerUserId, name) {
  return createWorkspace({
    name: name ?? "Default Workspace",
    ownerUserId,
    plan: "free"
  });
}

// src/lib/constants.ts
var DEFAULT_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";
var PLATFORM_DOMAIN = "nama.app";

// src/lib/core/workspace/repository.ts
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
      const validated = this.validateOrThrow(
        workspaceEntitySchema,
        entity,
        `workspace.save(${entity.id})`
      );
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
      if (existing.length > 0) {
        return existing[0];
      }
      const entity = createDefaultWorkspace(userId);
      entity.status = "active";
      await this.save(entity);
      this.logger.info(`Default workspace created for user ${userId}: ${entity.id}`, {
        source: "workspace"
      });
      return entity;
    } catch (err) {
      const existing = await this.findByUserId(userId);
      if (existing.length > 0) {
        return existing[0];
      }
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
  // ─── Private mapping helpers ───────────────────────────────────────────────
  _mapRowToEntity(row) {
    try {
      const entity = {
        id: row.id,
        status: row.status,
        plan: row.plan,
        limits: row.limits ?? {},
        membership: [
          ...row.owner_user_id ? [{
            userId: row.owner_user_id,
            role: "owner",
            joinedAt: row.created_at
          }] : []
        ],
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

// src/lib/core/provision/types.ts
var PROVISION_STEP_LABELS = {
  ["validate_request" /* VALIDATE_REQUEST */]: "Validate Request",
  ["create_workspace" /* CREATE_WORKSPACE */]: "Create Workspace",
  ["assign_owner" /* ASSIGN_OWNER */]: "Assign Owner",
  ["assign_plan" /* ASSIGN_PLAN */]: "Assign Plan",
  ["install_blueprint" /* INSTALL_BLUEPRINT */]: "Install Blueprint",
  ["create_pages" /* CREATE_PAGES */]: "Create Pages",
  ["create_navigation" /* CREATE_NAVIGATION */]: "Create Navigation",
  ["insert_blocks" /* INSERT_BLOCKS */]: "Insert Blocks",
  ["insert_cms_data" /* INSERT_CMS_DATA */]: "Insert CMS Data",
  ["seed_data" /* SEED_DATA */]: "Seed Data",
  ["insert_theme" /* INSERT_THEME */]: "Insert Theme",
  ["insert_fonts" /* INSERT_FONTS */]: "Insert Fonts",
  ["insert_default_media" /* INSERT_DEFAULT_MEDIA */]: "Insert Default Media",
  ["insert_analytics_defaults" /* INSERT_ANALYTICS_DEFAULTS */]: "Insert Analytics Defaults",
  ["run_health_check" /* RUN_HEALTH_CHECK */]: "Run Health Check",
  ["workspace_ready" /* WORKSPACE_READY */]: "Workspace Ready"
};
var PROVISION_PIPELINE = [
  "validate_request" /* VALIDATE_REQUEST */,
  "create_workspace" /* CREATE_WORKSPACE */,
  "install_blueprint" /* INSTALL_BLUEPRINT */,
  "seed_data" /* SEED_DATA */,
  "insert_theme" /* INSERT_THEME */,
  "insert_fonts" /* INSERT_FONTS */,
  "insert_default_media" /* INSERT_DEFAULT_MEDIA */,
  "insert_analytics_defaults" /* INSERT_ANALYTICS_DEFAULTS */,
  "run_health_check" /* RUN_HEALTH_CHECK */,
  "workspace_ready" /* WORKSPACE_READY */
];

// src/lib/core/provision/validation.ts
import { z as z2 } from "zod";
var blueprintPageSchema = z2.object({
  key: z2.string().min(1),
  title: z2.string().min(1),
  path: z2.string().min(1),
  blockKeys: z2.array(z2.string())
});
var blueprintBlockDefinitionSchema = z2.object({
  key: z2.string().min(1),
  type: z2.string().min(1),
  data: z2.record(z2.unknown()).default({}),
  sortOrder: z2.number().int().default(0)
});
var blueprintThemeSchema = z2.object({
  presetId: z2.string().min(1),
  overrides: z2.object({
    primaryColor: z2.string().optional(),
    secondaryColor: z2.string().optional(),
    accentColor: z2.string().optional(),
    backgroundColor: z2.string().optional(),
    textColor: z2.string().optional(),
    textSecondaryColor: z2.string().optional(),
    textTertiaryColor: z2.string().optional(),
    borderRadius: z2.string().optional(),
    glassOpacity: z2.number().min(0).max(1).optional()
  }).optional()
});
var blueprintNavigationEntrySchema = z2.object({
  title: z2.string().min(1),
  path: z2.string().min(1),
  sortOrder: z2.number().int().default(0)
});
var blueprintFontConfigSchema = z2.object({
  body: z2.string().default("inherit"),
  heading: z2.string().default("inherit"),
  importGoogleFonts: z2.boolean().default(false),
  imports: z2.array(z2.string()).optional()
});
var blueprintSEOConfigSchema = z2.object({
  title: z2.string().default(""),
  description: z2.string().default(""),
  ogImage: z2.string().optional(),
  additionalMeta: z2.record(z2.string()).optional()
});
var blueprintAnalyticsConfigSchema = z2.object({
  enabled: z2.boolean().default(true),
  provider: z2.string().optional().default("supabase")
});
var blueprintMenuItemEntrySchema = z2.object({
  category: z2.string().min(1),
  name: z2.string().min(1),
  description: z2.string().default(""),
  price: z2.string().default(""),
  imageUrl: z2.string().optional().default(""),
  sortOrder: z2.number().int().default(0)
});
var blueprintGalleryEntrySchema = z2.object({
  title: z2.string().default(""),
  tags: z2.array(z2.string()).default([]),
  sortOrder: z2.number().int().default(0)
});
var blueprintPersonalityEntrySchema = z2.object({
  key: z2.string().min(1),
  label: z2.string().min(1),
  tagline: z2.string().default(""),
  description: z2.string().default(""),
  traits: z2.array(z2.string()).default([]),
  drink: z2.string().optional(),
  spot: z2.string().optional(),
  colorFrom: z2.string().optional(),
  colorTo: z2.string().optional()
});
var blueprintMediaFolderSchema = z2.object({
  path: z2.string().min(1),
  description: z2.string().default("")
});
var blueprintPermissionsSchema = z2.object({
  admin: z2.array(z2.string()).default([]),
  member: z2.array(z2.string()).default([]),
  viewer: z2.array(z2.string()).default([])
});
var blueprintMetadataSchema = z2.object({
  createdBy: z2.string().default("system"),
  createdAt: z2.string().datetime().optional(),
  updatedAt: z2.string().datetime().optional(),
  tags: z2.array(z2.string()).default([]),
  isPublished: z2.boolean().default(true)
});
var blueprintSchema = z2.object({
  id: z2.string().min(1),
  slug: z2.string().min(1),
  version: z2.string().min(1),
  name: z2.string().min(1),
  description: z2.string().default(""),
  category: z2.string().min(1),
  pages: z2.array(blueprintPageSchema).default([]),
  blocks: z2.array(blueprintBlockDefinitionSchema).default([]),
  theme: blueprintThemeSchema,
  navigation: z2.array(blueprintNavigationEntrySchema).default([]),
  fonts: blueprintFontConfigSchema.default({ body: "inherit", heading: "inherit", importGoogleFonts: false }),
  seo: blueprintSEOConfigSchema.default({ title: "", description: "" }),
  analytics: blueprintAnalyticsConfigSchema.default({ enabled: true }),
  menus: z2.array(blueprintMenuItemEntrySchema).default([]),
  gallery: z2.array(blueprintGalleryEntrySchema).default([]),
  businessSettings: z2.record(z2.unknown()).default({}),
  personalitySettings: z2.array(blueprintPersonalityEntrySchema).default([]),
  mediaFolderStructure: z2.array(blueprintMediaFolderSchema).default([]),
  permissions: blueprintPermissionsSchema.default({ admin: [], member: [], viewer: [] }),
  metadata: blueprintMetadataSchema.default({ createdBy: "system", tags: [], isPublished: true })
});
var provisionRequestSchema = z2.object({
  blueprintSlug: z2.string().min(1, "Blueprint slug is required"),
  blueprintVersion: z2.string().optional(),
  workspaceName: z2.string().min(1).max(200).optional(),
  workspaceDescription: z2.string().max(2e3).optional(),
  domain: z2.string().min(1).max(253).optional(),
  // ── Public Provisioning API fields (from external systems like Convex sales panel) ──
  requestedSlug: z2.string().min(3, "\u0646\u0627\u0645\u06A9 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F3 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F").max(30, "\u0646\u0627\u0645\u06A9 \u0646\u0628\u0627\u06CC\u062F \u0628\u06CC\u0634\u062A\u0631 \u0627\u0632 \u06F3\u06F0 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F").regex(/^[a-z0-9-]+$/, "\u0641\u0642\u0637 \u062D\u0631\u0648\u0641 \u06A9\u0648\u0686\u06A9 \u0644\u0627\u062A\u06CC\u0646\u060C \u0639\u062F\u062F \u0648 \u062E\u0637 \u062A\u06CC\u0631\u0647 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A"),
  externalOrderId: z2.string().min(1, "\u0634\u0646\u0627\u0633\u0647 \u0633\u0641\u0627\u0631\u0634 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A"),
  customerEmail: z2.string().email("\u0627\u06CC\u0645\u06CC\u0644 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A"),
  businessName: z2.string().min(2, "\u0646\u0627\u0645 \u06A9\u0633\u0628\u200C\u0648\u06A9\u0627\u0631 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A"),
  // ── Internal NAMA fields (optional for Public API flow) ──
  ownerUserId: z2.string().min(1).optional(),
  plan: workspacePlanSchema.optional().default("free"),
  locale: z2.string().min(2).max(10).optional().default("fa-IR"),
  timezone: z2.string().min(1).max(50).optional().default("Asia/Tehran"),
  metadata: z2.record(z2.unknown()).optional()
});
var registerBlueprintSchema = blueprintSchema.pick({
  id: true,
  slug: true,
  version: true,
  name: true,
  description: true,
  category: true,
  metadata: true
});
var provisionStepValues = [
  "validate_request",
  "create_workspace",
  "install_blueprint",
  "seed_data",
  "insert_theme",
  "insert_fonts",
  "insert_default_media",
  "insert_analytics_defaults",
  "run_health_check",
  "workspace_ready"
];
var provisionStepSchema = z2.enum(provisionStepValues);
var provisionStepResultSchema = z2.object({
  step: provisionStepSchema,
  success: z2.boolean(),
  startedAt: z2.string().datetime(),
  completedAt: z2.string().datetime().optional(),
  durationMs: z2.number().int().optional(),
  error: z2.string().optional(),
  output: z2.record(z2.unknown()).optional()
});
var provisionTransactionSchema = z2.object({
  id: z2.string().min(1),
  workspaceId: z2.string().min(1),
  blueprintId: z2.string().min(1),
  blueprintVersion: z2.string().min(1),
  status: z2.enum(["pending", "in_progress", "completed", "failed", "rolling_back", "rolled_back"]),
  initiatedBy: z2.string().min(1).nullable().optional(),
  startedAt: z2.string().datetime(),
  completedAt: z2.string().datetime().optional(),
  steps: z2.array(provisionStepResultSchema).default([]),
  currentStepIndex: z2.number().int().min(0).default(0),
  retryCount: z2.number().int().min(0).default(0),
  maxRetries: z2.number().int().min(0).default(3),
  error: z2.string().optional()
});
var provisionReportSchema = z2.object({
  transactionId: z2.string().min(1),
  success: z2.boolean(),
  startedAt: z2.string().datetime(),
  completedAt: z2.string().datetime(),
  durationMs: z2.number().int(),
  workspace: z2.object({
    id: z2.string(),
    name: z2.string(),
    status: z2.string(),
    plan: z2.string()
  }),
  blueprint: z2.object({
    id: z2.string(),
    slug: z2.string(),
    version: z2.string(),
    name: z2.string(),
    category: z2.string()
  }),
  theme: z2.object({
    presetId: z2.string(),
    applied: z2.boolean()
  }),
  pages: z2.object({
    total: z2.number().int(),
    created: z2.number().int()
  }),
  blocks: z2.object({
    total: z2.number().int(),
    inserted: z2.number().int()
  }),
  navigation: z2.object({
    total: z2.number().int(),
    created: z2.number().int()
  }),
  errors: z2.array(
    z2.object({
      step: z2.string(),
      message: z2.string(),
      retried: z2.boolean(),
      recovered: z2.boolean()
    })
  ),
  warnings: z2.array(
    z2.object({
      step: z2.string(),
      message: z2.string()
    })
  ),
  stepTimings: z2.array(
    z2.object({
      step: z2.string(),
      label: z2.string(),
      durationMs: z2.number().int(),
      success: z2.boolean()
    })
  )
});

// src/lib/core/provision/session-context.ts
function createResourceMap(session) {
  return {
    session,
    pageBlockIds: [],
    menuItemIds: [],
    galleryImageIds: [],
    personalityKeys: [],
    siteContentKeys: [],
    mediaFileIds: [],
    navigationKey: null,
    themeInstalled: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function createSession(context) {
  return {
    context,
    resourceMap: createResourceMap(context),
    stepMetrics: [],
    warnings: [],
    retryCount: 0
  };
}
function appendStepMetric(session, metric) {
  session.stepMetrics.push(metric);
}

// src/lib/core/provision/steps.ts
var DEFAULT_RETRY_POLICIES = {
  ["validate_request" /* VALIDATE_REQUEST */]: { type: "never" },
  ["create_workspace" /* CREATE_WORKSPACE */]: { type: "exponential", maxRetries: 3, baseDelayMs: 500, maxDelayMs: 5e3 },
  ["install_blueprint" /* INSTALL_BLUEPRINT */]: { type: "exponential", maxRetries: 3, baseDelayMs: 1e3, maxDelayMs: 1e4 },
  ["seed_data" /* SEED_DATA */]: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5e3 },
  ["insert_theme" /* INSERT_THEME */]: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5e3 },
  ["insert_fonts" /* INSERT_FONTS */]: { type: "immediate", maxRetries: 1 },
  ["insert_default_media" /* INSERT_DEFAULT_MEDIA */]: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5e3 },
  ["insert_analytics_defaults" /* INSERT_ANALYTICS_DEFAULTS */]: { type: "immediate", maxRetries: 1 },
  ["run_health_check" /* RUN_HEALTH_CHECK */]: { type: "never" },
  ["workspace_ready" /* WORKSPACE_READY */]: { type: "immediate", maxRetries: 2 }
};
function getRetryDelayMs(policy, attempt, _error) {
  switch (policy.type) {
    case "never":
      return -1;
    case "immediate":
      return attempt < policy.maxRetries ? 0 : -1;
    case "exponential": {
      if (attempt >= policy.maxRetries) return -1;
      const base = policy.baseDelayMs ?? 1e3;
      const max = policy.maxDelayMs ?? 3e4;
      const delay = base * Math.pow(2, attempt);
      return Math.min(delay, max);
    }
    case "linear": {
      if (attempt >= policy.maxRetries) return -1;
      return policy.delayMs ?? 1e3;
    }
    case "custom": {
      const result = policy.shouldRetry(attempt, _error);
      return result !== null ? result : -1;
    }
  }
}
function createStepRegistry() {
  const registry = /* @__PURE__ */ new Map();
  registry.set("validate_request" /* VALIDATE_REQUEST */, {
    step: "validate_request" /* VALIDATE_REQUEST */,
    label: "Validate Request",
    retryPolicy: { type: "never" },
    async execute() {
      return { validated: true };
    },
    async rollback() {
    }
  });
  registry.set("create_workspace" /* CREATE_WORKSPACE */, {
    step: "create_workspace" /* CREATE_WORKSPACE */,
    label: "Create Workspace",
    retryPolicy: { type: "exponential", maxRetries: 3, baseDelayMs: 500, maxDelayMs: 5e3 },
    async execute() {
      return { workspaceCreated: true };
    },
    async rollback(_blueprint, _workspaceId, repos) {
    }
  });
  registry.set("install_blueprint" /* INSTALL_BLUEPRINT */, {
    step: "install_blueprint" /* INSTALL_BLUEPRINT */,
    label: "Install Blueprint",
    retryPolicy: { type: "exponential", maxRetries: 3, baseDelayMs: 1e3, maxDelayMs: 1e4 },
    async execute(blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;
      const log = await repos.siteContent.getProvisionLog(workspaceId, blueprint.slug, blueprint.version);
      if (!log.entities.includes("pages")) {
        await repos.pages.installBlueprintPages(blueprint.pages, blueprint.blocks, resourceMap);
        log.entities.push("pages");
      }
      if (!log.entities.includes("navigation")) {
        const navKey = await repos.siteContent.installBlueprintNavigation(blueprint.navigation, workspaceId, resourceMap);
        if (navKey) {
          resourceMap.navigationKey = navKey;
          log.entities.push("navigation");
        }
      }
      if (!log.entities.includes("menus") && blueprint.menus.length > 0) {
        await repos.menu.installBlueprintMenuItems(blueprint.menus, resourceMap);
        log.entities.push("menus");
      }
      if (!log.entities.includes("gallery") && blueprint.gallery.length > 0) {
        await repos.gallery.installBlueprintGallery(blueprint.gallery, resourceMap);
        log.entities.push("gallery");
      }
      if (!log.entities.includes("personalities") && blueprint.personalitySettings.length > 0) {
        await repos.personality.installBlueprintPersonalities(blueprint.personalitySettings, resourceMap);
        log.entities.push("personalities");
      }
      if (!log.entities.includes("cms_data")) {
        await repos.siteContent.installBlueprintBusinessSettings(blueprint.businessSettings, workspaceId, resourceMap);
        await repos.siteContent.installBlueprintSEO({ title: blueprint.seo.title, description: blueprint.seo.description, ogImage: blueprint.seo.ogImage }, workspaceId, resourceMap);
        log.entities.push("cms_data");
      }
      if (!log.entities.includes("analytics")) {
        await repos.siteContent.installBlueprintAnalytics(blueprint.analytics, workspaceId, resourceMap);
        log.entities.push("analytics");
      }
      await repos.siteContent.saveProvisionLog(workspaceId, blueprint.slug, blueprint.version, log);
      return {
        pageBlocks: resourceMap.pageBlockIds.length,
        menus: resourceMap.menuItemIds.length,
        gallery: resourceMap.galleryImageIds.length,
        personalities: resourceMap.personalityKeys.length,
        navigation: resourceMap.navigationKey ? 1 : 0,
        count: blueprint.pages.length
      };
    },
    async rollback(_blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;
      if (resourceMap.pageBlockIds.length > 0) {
        await repos.pages.batchDelete(resourceMap.pageBlockIds);
      }
      if (resourceMap.menuItemIds.length > 0) {
        await repos.menu.batchDelete(resourceMap.menuItemIds);
      }
      if (resourceMap.galleryImageIds.length > 0) {
        await repos.gallery.batchDelete(resourceMap.galleryImageIds);
      }
      if (resourceMap.personalityKeys.length > 0) {
        await repos.personality.batchDelete(resourceMap.personalityKeys);
      }
      if (resourceMap.siteContentKeys.length > 0) {
        const allKeys = [...resourceMap.siteContentKeys];
        if (resourceMap.navigationKey) {
          allKeys.push(resourceMap.navigationKey);
        }
        allKeys.push(`provision:log:${workspaceId}:${_blueprint.slug}:${_blueprint.version}`);
        await repos.siteContent.batchDeleteByKeys(allKeys);
      }
    }
  });
  registry.set("seed_data" /* SEED_DATA */, {
    step: "seed_data" /* SEED_DATA */,
    label: "Seed Data",
    retryPolicy: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5e3 },
    async execute(blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;
      const results = {};
      if (blueprint.mediaFolderStructure.length > 0) {
        const folderKeys = blueprint.mediaFolderStructure.map(
          (f) => `media_folder:${workspaceId}:${f.path}`
        );
        const existingMap = await repos.siteContent.batchGetByKeys(folderKeys);
        let count = 0;
        for (const folder of blueprint.mediaFolderStructure) {
          const folderKey = `media_folder:${workspaceId}:${folder.path}`;
          if (existingMap.has(folderKey)) continue;
          await repos.siteContent.upsert(folderKey, {
            path: folder.path,
            workspaceId,
            description: folder.description,
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          });
          resourceMap.siteContentKeys.push(folderKey);
          count++;
        }
        results.mediaFolders = count;
      }
      if (blueprint.fonts) {
        const fontKey = "fonts_config";
        const existing = await repos.siteContent.getByKey(fontKey);
        if (!existing) {
          await repos.siteContent.upsert(fontKey, {
            body: blueprint.fonts.body,
            heading: blueprint.fonts.heading,
            importGoogleFonts: blueprint.fonts.importGoogleFonts,
            imports: blueprint.fonts.imports ?? []
          });
          resourceMap.siteContentKeys.push(fontKey);
        }
        results.fontsConfigured = true;
      }
      return results;
    },
    async rollback(_blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;
      const keysToRemove = resourceMap.siteContentKeys.filter(
        (k) => k.startsWith(`media_folder:${workspaceId}:`) || k === "fonts_config"
      );
      if (keysToRemove.length > 0) {
        await repos.siteContent.batchDeleteByKeys(keysToRemove);
      }
    }
  });
  registry.set("insert_theme" /* INSERT_THEME */, {
    step: "insert_theme" /* INSERT_THEME */,
    label: "Insert Theme",
    retryPolicy: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5e3 },
    async execute(blueprint, _workspaceId, repos, session) {
      await repos.theme.installBlueprintTheme(blueprint.theme);
      session.resourceMap.themeInstalled = true;
      return { presetId: blueprint.theme.presetId };
    },
    async rollback() {
    }
  });
  registry.set("insert_fonts" /* INSERT_FONTS */, {
    step: "insert_fonts" /* INSERT_FONTS */,
    label: "Insert Fonts",
    retryPolicy: { type: "immediate", maxRetries: 1 },
    async execute(blueprint) {
      return { body: blueprint.fonts.body, heading: blueprint.fonts.heading };
    },
    async rollback() {
    }
  });
  registry.set("insert_default_media" /* INSERT_DEFAULT_MEDIA */, {
    step: "insert_default_media" /* INSERT_DEFAULT_MEDIA */,
    label: "Insert Default Media",
    retryPolicy: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5e3 },
    async execute(blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;
      const folderKeys = blueprint.mediaFolderStructure.map(
        (f) => `media_folder:${workspaceId}:${f.path}`
      );
      const existingMap = await repos.siteContent.batchGetByKeys(folderKeys);
      let count = 0;
      for (const folder of blueprint.mediaFolderStructure) {
        const folderKey = `media_folder:${workspaceId}:${folder.path}`;
        if (existingMap.has(folderKey)) continue;
        await repos.siteContent.upsert(folderKey, {
          path: folder.path,
          workspaceId,
          description: folder.description,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        resourceMap.siteContentKeys.push(folderKey);
        count++;
      }
      return { mediaFolders: count };
    },
    async rollback(_blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;
      const mediaKeys = resourceMap.siteContentKeys.filter(
        (k) => k.startsWith(`media_folder:${workspaceId}:`)
      );
      if (mediaKeys.length > 0) {
        await repos.siteContent.batchDeleteByKeys(mediaKeys);
      }
    }
  });
  registry.set("insert_analytics_defaults" /* INSERT_ANALYTICS_DEFAULTS */, {
    step: "insert_analytics_defaults" /* INSERT_ANALYTICS_DEFAULTS */,
    label: "Insert Analytics Defaults",
    retryPolicy: { type: "immediate", maxRetries: 1 },
    async execute(blueprint, workspaceId, repos, session) {
      await repos.siteContent.installBlueprintAnalytics(blueprint.analytics, workspaceId, session.resourceMap);
      return { enabled: blueprint.analytics.enabled };
    },
    async rollback(_blueprint, workspaceId, repos) {
      const analyticsKey = `analytics_config:${workspaceId}`;
      await repos.siteContent.deleteByKey(analyticsKey);
    }
  });
  registry.set("run_health_check" /* RUN_HEALTH_CHECK */, {
    step: "run_health_check" /* RUN_HEALTH_CHECK */,
    label: "Run Health Check",
    retryPolicy: { type: "never" },
    async execute() {
      return { healthy: true, checks: 0 };
    },
    async rollback() {
    }
  });
  registry.set("workspace_ready" /* WORKSPACE_READY */, {
    step: "workspace_ready" /* WORKSPACE_READY */,
    label: "Workspace Ready",
    retryPolicy: { type: "immediate", maxRetries: 2 },
    async execute(_blueprint, workspaceId, repos) {
      const entity = await repos.workspace.findById(workspaceId);
      if (entity) {
        entity.status = "active";
        entity.metadata.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        await repos.workspace.save(entity);
      }
      return { activated: true };
    },
    async rollback(_blueprint, workspaceId, repos) {
      const entity = await repos.workspace.findById(workspaceId);
      if (entity) {
        entity.status = "provisioning";
        entity.metadata.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        await repos.workspace.save(entity);
      }
    }
  });
  return registry;
}

// src/lib/cms-schemas.ts
import { z as z3 } from "zod";
var menuItemSchema = z3.object({
  id: z3.string().uuid().optional(),
  category: z3.string().min(1, "\u062F\u0633\u062A\u0647 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A"),
  name: z3.string().min(1, "\u0646\u0627\u0645 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A"),
  description: z3.string().optional().default(""),
  price: z3.string().min(1, "\u0642\u06CC\u0645\u062A \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A"),
  image_url: z3.string().url("\u0622\u062F\u0631\u0633 \u0646\u0627\u0645\u0639\u062A\u0628\u0631").optional().or(z3.literal("")).default(""),
  sort_order: z3.number().int().default(0),
  visible: z3.boolean().default(true)
});
var galleryImageSchema = z3.object({
  id: z3.string().uuid().optional(),
  title: z3.string().optional().default(""),
  image_url: z3.string().url("\u0622\u062F\u0631\u0633 \u062A\u0635\u0648\u06CC\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631"),
  tags: z3.array(z3.string()).optional().default([]),
  sort_order: z3.number().int().default(0),
  visible: z3.boolean().default(true)
});
var eventSchema = z3.object({
  id: z3.string().uuid().optional(),
  title: z3.string().min(1, "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A"),
  description: z3.string().optional().default(""),
  date_label: z3.string().optional().default(""),
  image_url: z3.string().optional().default(""),
  sort_order: z3.number().int().default(0),
  visible: z3.boolean().default(true)
});
var testimonialSchema = z3.object({
  id: z3.string().uuid().optional(),
  name: z3.string().min(1, "\u0646\u0627\u0645 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A"),
  type: z3.string().optional().default(""),
  text: z3.string().min(1, "\u0645\u062A\u0646 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A"),
  sort_order: z3.number().int().default(0),
  visible: z3.boolean().default(true)
});
var blockSchema = z3.object({
  id: z3.string().uuid().optional(),
  type: z3.string().min(1),
  data: z3.record(z3.any()).default({}),
  sort_order: z3.number().int().default(0),
  visible: z3.boolean().default(true)
});
var themeSchema = z3.object({
  primary_color: z3.string().regex(/^#[0-9a-fA-F]{6}$/, "\u0631\u0646\u06AF \u0646\u0627\u0645\u0639\u062A\u0628\u0631"),
  secondary_color: z3.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent_color: z3.string().regex(/^#[0-9a-fA-F]{6}$/),
  background_color: z3.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_color: z3.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_secondary_color: z3.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_tertiary_color: z3.string().regex(/^#[0-9a-fA-F]{6}$/),
  border_radius: z3.string(),
  glass_opacity: z3.number().min(0).max(1)
});
var heroContentSchema = z3.object({
  title: z3.string(),
  subtitle: z3.string(),
  badge: z3.string(),
  cta_text: z3.string()
});
var contactContentSchema = z3.object({
  address: z3.string(),
  phone: z3.string(),
  hours: z3.string()
});
var socialContentSchema = z3.object({
  instagram: z3.string(),
  instagram_handle: z3.string()
});
var metaContentSchema = z3.object({
  title: z3.string(),
  bio: z3.string(),
  avatar_url: z3.string().optional().default("")
});
var siteContentValueSchema = z3.record(z3.unknown());
var mediaFileSchema = z3.object({
  name: z3.string().min(1, "\u0646\u0627\u0645 \u0641\u0627\u06CC\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A"),
  storage_path: z3.string().min(1),
  folder: z3.string().min(1).default("uploads"),
  tags: z3.array(z3.string()).default([]),
  size_bytes: z3.number().int().positive(),
  mime_type: z3.string()
});
var pageViewSchema = z3.object({
  path: z3.string().default("/"),
  referrer: z3.string().nullable().optional(),
  user_agent: z3.string().nullable().optional()
});
var testResponseSchema = z3.object({
  answers: z3.record(z3.string()),
  result: z3.string().min(1),
  tied: z3.array(z3.string()).default([]),
  user_full_name: z3.string().optional().default(""),
  user_phone: z3.string().optional().default(""),
  user_age: z3.number().int().nullable().optional(),
  user_gender: z3.string().optional().default("")
});
var testConfigSchema = z3.object({
  overrides: z3.record(z3.unknown()).default({}),
  orderedIds: z3.array(z3.number()).nullable().default(null)
});
var personalityProfileUpdateSchema = z3.object({
  label: z3.string().optional(),
  tagline: z3.string().optional(),
  description: z3.string().optional(),
  traits: z3.array(z3.string()).optional(),
  drink: z3.string().optional(),
  spot: z3.string().optional(),
  color_from: z3.string().optional(),
  color_to: z3.string().optional()
});
var analyticsPayloadSchema = z3.object({
  session_id: z3.string().min(1),
  page_path: z3.string().min(1),
  referrer: z3.string().optional().default(""),
  user_agent: z3.string().optional().default(""),
  device_type: z3.string().optional().default("unknown"),
  ip_hash: z3.string().optional().default("")
});

// src/lib/repositories/menu.ts
var SELECT_COLUMNS = "id,category,name,description,price,image_url,sort_order,visible,created_at,updated_at";
var VISIBLE_COLUMNS = "id,category,name,description,price,image_url,sort_order,visible";
var MenuRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async getAll(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("menu_items").select(SELECT_COLUMNS).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("menu_items", "getAll", err, { opts });
    }
  }
  async getVisible(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("menu_items").select(VISIBLE_COLUMNS).eq("visible", true).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("menu_items", "getVisible", err, { opts });
    }
  }
  /**
   * Install menu items from blueprint data.
   * Uses upsert by stable key for idempotency.
   * Tracks created IDs in the resource map.
   */
  async installBlueprintMenuItems(menus, resourceMap) {
    const ids = [];
    for (const item of menus) {
      const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const upsertItem = {
        id,
        category: item.category,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.imageUrl ?? "",
        sort_order: item.sortOrder,
        visible: true
      };
      if (this.workspaceId) upsertItem.workspace_id = this.workspaceId;
      const { error } = await this.db.from("menu_items").upsert(upsertItem);
      if (error) {
        if (error.code === "23505") continue;
        throw this.normalizeError("menu_items", "installBlueprintMenuItems", error);
      }
      ids.push(id);
      if (resourceMap) {
        resourceMap.menuItemIds.push(id);
      }
    }
    return ids;
  }
  async upsert(row) {
    try {
      const validated = this.validateOrThrow(menuItemSchema, row, "menu_items");
      const upsertData = this.workspaceId ? { ...validated, workspace_id: this.workspaceId } : validated;
      const { data, error } = await this.db.from("menu_items").upsert(upsertData).select().maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("menu_items", "upsert", err);
    }
  }
  /**
   * Batch delete menu items by IDs.
   */
  async batchDelete(ids) {
    if (ids.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("menu_items").delete().in("id", ids)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("menu_items", "batchDelete", err, { count: ids.length });
    }
  }
  async delete(id) {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("menu_items").delete().eq("id", id)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("menu_items", "delete", err, { id });
    }
  }
};

// src/lib/repositories/gallery.ts
var SELECT_COLUMNS2 = "id,title,image_url,tags,sort_order,visible,created_at,updated_at";
var VISIBLE_COLUMNS2 = "id,title,image_url,tags,sort_order,visible";
var GalleryRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async getAll(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("gallery_images").select(SELECT_COLUMNS2).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("gallery_images", "getAll", err, { opts });
    }
  }
  async getVisible(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("gallery_images").select(VISIBLE_COLUMNS2).eq("visible", true).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("gallery_images", "getVisible", err, { opts });
    }
  }
  /**
   * Install gallery images from blueprint data.
   * Uses upsert by stable key for idempotency.
   * Tracks created IDs in the resource map.
   */
  async installBlueprintGallery(gallery, resourceMap) {
    const ids = [];
    for (const item of gallery) {
      const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const upsertItem = {
        id,
        title: item.title,
        image_url: "",
        tags: item.tags,
        sort_order: item.sortOrder,
        visible: true
      };
      if (this.workspaceId) upsertItem.workspace_id = this.workspaceId;
      const { error } = await this.db.from("gallery_images").upsert(upsertItem);
      if (error) {
        if (error.code === "23505") continue;
        throw this.normalizeError("gallery_images", "installBlueprintGallery", error);
      }
      ids.push(id);
      if (resourceMap) {
        resourceMap.galleryImageIds.push(id);
      }
    }
    return ids;
  }
  async upsert(row) {
    try {
      const validated = this.validateOrThrow(galleryImageSchema, row, "gallery_images");
      const upsertData = this.workspaceId ? { ...validated, workspace_id: this.workspaceId } : validated;
      const { data, error } = await this.db.from("gallery_images").upsert(upsertData).select().maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("gallery_images", "upsert", err);
    }
  }
  /**
   * Batch delete gallery images by IDs.
   */
  async batchDelete(ids) {
    if (ids.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("gallery_images").delete().in("id", ids)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("gallery_images", "batchDelete", err, { count: ids.length });
    }
  }
  async delete(id) {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("gallery_images").delete().eq("id", id)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("gallery_images", "delete", err, { id });
    }
  }
};

// src/lib/repositories/events.ts
var SELECT_COLUMNS3 = "id,title,description,date_label,image_url,sort_order,visible,created_at,updated_at";
var VISIBLE_COLUMNS3 = "id,title,description,date_label,image_url,sort_order,visible";
var EventsRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async getAll(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("events").select(SELECT_COLUMNS3).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("events", "getAll", err, { opts });
    }
  }
  async getVisible(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("events").select(VISIBLE_COLUMNS3).eq("visible", true).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("events", "getVisible", err, { opts });
    }
  }
  async upsert(row) {
    try {
      const validated = this.validateOrThrow(eventSchema, row, "events");
      const upsertData = this.workspaceId ? { ...validated, workspace_id: this.workspaceId } : validated;
      const { data, error } = await this.db.from("events").upsert(upsertData).select().maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("events", "upsert", err);
    }
  }
  /**
   * Batch delete event entries by IDs.
   */
  async batchDelete(ids) {
    if (ids.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("events").delete().in("id", ids)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("events", "batchDelete", err, { count: ids.length });
    }
  }
  async delete(id) {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("events").delete().eq("id", id)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("events", "delete", err, { id });
    }
  }
};

// src/lib/repositories/testimonials.ts
var SELECT_COLUMNS4 = "id,name,type,text,sort_order,visible,created_at,updated_at";
var VISIBLE_COLUMNS4 = "id,name,type,text,sort_order,visible";
var TestimonialsRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async getAll(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("testimonials").select(SELECT_COLUMNS4).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("testimonials", "getAll", err, { opts });
    }
  }
  async getVisible(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("testimonials").select(VISIBLE_COLUMNS4).eq("visible", true).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("testimonials", "getVisible", err, { opts });
    }
  }
  async upsert(row) {
    try {
      const validated = this.validateOrThrow(testimonialSchema, row, "testimonials");
      const upsertData = this.workspaceId ? { ...validated, workspace_id: this.workspaceId } : validated;
      const { data, error } = await this.db.from("testimonials").upsert(upsertData).select().maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("testimonials", "upsert", err);
    }
  }
  /**
   * Batch delete testimonial entries by IDs.
   */
  async batchDelete(ids) {
    if (ids.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("testimonials").delete().in("id", ids)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("testimonials", "batchDelete", err, { count: ids.length });
    }
  }
  async delete(id) {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("testimonials").delete().eq("id", id)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("testimonials", "delete", err, { id });
    }
  }
};

// src/lib/hash-utils.ts
function stableStringify(value) {
  if (value === null) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map((v) => stableStringify(v)).join(",") + "]";
  }
  const obj = value;
  const keys = Object.keys(obj).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") + "}";
}
async function computeBlockKeyHash(pageKey, type, data) {
  const stable = stableStringify({ pageKey, type, data });
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(stable);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// src/lib/repositories/pages.ts
var SELECT_COLUMNS5 = "id,type,data,sort_order,visible,created_at,updated_at";
var PagesRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async getAll(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("page_blocks").select(SELECT_COLUMNS5).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("page_blocks", "getAll", err, { opts });
    }
  }
  /**
   * Install page blocks from blueprint data.
   * Uses deterministic hash-based keys for idempotency.
   * Tracks created IDs in the resource map.
   */
  async installBlueprintPages(pages, blocks, resourceMap) {
    const blockIds = [];
    const blockMap = /* @__PURE__ */ new Map();
    for (const bd of blocks) {
      blockMap.set(bd.key, bd);
    }
    for (const page of pages) {
      for (const blockKey of page.blockKeys) {
        const blockDef = blockMap.get(blockKey);
        if (!blockDef) continue;
        const blockKeyHash = await computeBlockKeyHash(page.key, blockDef.type, blockDef.data);
        const exists = await this._blockExistsByKeyHash(blockKeyHash);
        if (exists) continue;
        const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const insert = {
          id,
          type: blockDef.type,
          data: {
            ...blockDef.data,
            block_key_hash: blockKeyHash,
            pageKey: page.key,
            pageTitle: page.title
          },
          sort_order: blockDef.sortOrder,
          visible: true
        };
        if (this.workspaceId) insert.workspace_id = this.workspaceId;
        const { error } = await this.db.from("page_blocks").insert(insert);
        if (error) throw this.normalizeError("page_blocks", "installBlueprintPages", error);
        blockIds.push(id);
        if (resourceMap) {
          resourceMap.pageBlockIds.push(id);
        }
      }
    }
    return { blockIds };
  }
  async create(input) {
    try {
      const validated = this.validateOrThrow(blockSchema, { ...input, visible: true }, "page_blocks.create");
      const insertData = this.workspaceId ? { ...validated, workspace_id: this.workspaceId } : validated;
      const { data, error } = await this.db.from("page_blocks").insert(insertData).select().maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("page_blocks", "create", err);
    }
  }
  async update(id, patch) {
    try {
      const { error } = await this.db.from("page_blocks").update(patch).eq("id", id);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("page_blocks", "update", err, { id });
    }
  }
  /**
   * Batch delete page blocks by IDs.
   */
  async batchDelete(ids) {
    if (ids.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("page_blocks").delete().in("id", ids)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("page_blocks", "batchDelete", err, { count: ids.length });
    }
  }
  async delete(id) {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("page_blocks").delete().eq("id", id)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("page_blocks", "delete", err, { id });
    }
  }
  async reorder(orderedIds) {
    try {
      const results = await Promise.all(
        orderedIds.map(
          (id, idx) => this.db.from("page_blocks").update({ sort_order: idx }).eq("id", id)
        )
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    } catch (err) {
      throw this.normalizeError("page_blocks", "reorder", err);
    }
  }
  // ─── Private helpers for deterministic dedup ───────────────────────────
  /**
   * Check if a block with a given hash already exists.
   */
  /**
   * Check if a block with a given hash already exists.
   */
  async _blockExistsByKeyHash(blockKeyHash) {
    const { data } = await this.withWorkspace(
      this.db.from("page_blocks").select("id").eq("data->>block_key_hash", blockKeyHash)
    ).maybeSingle();
    return !!data;
  }
};

// src/lib/core/repository-cache.ts
var RepositoryCache = class _RepositoryCache {
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
  async getOrFetch(table, key, fetchFn, ttlMs = _RepositoryCache.DEFAULT_TTL_MS) {
    const cached = this._get(table, key);
    if (cached !== void 0) {
      return cached;
    }
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
    if (entries) {
      entries.clear();
    }
  }
  /**
   * Invalidate a specific cached entry.
   */
  invalidateKey(table, key) {
    const entries = this.store[table];
    if (entries) {
      entries.delete(key);
    }
  }
  /**
   * Clear the entire cache.
   */
  clear() {
    for (const table of Object.keys(this.store)) {
      this.store[table].clear();
    }
  }
  /**
   * Get cache statistics.
   */
  stats() {
    let entries = 0;
    for (const table of Object.keys(this.store)) {
      entries += this.store[table].size;
    }
    return { tables: Object.keys(this.store).length, entries };
  }
  // ─── Private ───────────────────────────────────────────────────────────
  _get(table, key) {
    const entries = this.store[table];
    if (!entries) return void 0;
    const entry = entries.get(key);
    if (!entry) return void 0;
    if (Date.now() - entry.createdAt >= entry.ttlMs) {
      entries.delete(key);
      return void 0;
    }
    return entry.value;
  }
  _set(table, key, value, ttlMs) {
    if (!this.store[table]) {
      this.store[table] = /* @__PURE__ */ new Map();
    }
    this.store[table].set(key, {
      value,
      createdAt: Date.now(),
      ttlMs: ttlMs ?? _RepositoryCache.DEFAULT_TTL_MS
    });
  }
};
var _instance = null;
function getCache() {
  if (!_instance) {
    _instance = new RepositoryCache();
  }
  return _instance;
}

// src/lib/repositories/theme.ts
var SELECT_COLUMNS6 = "id,primary_color,secondary_color,accent_color,background_color,text_color,text_secondary_color,text_tertiary_color,border_radius,glass_opacity,name,preset_id,tokens,updated_at";
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
  glass_opacity: 0.08,
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
    const cache = getCache();
    return cache.getOrFetch("theme_settings", "get", async () => {
      try {
        const { data, error } = await this.withWorkspace(
          this.db.from("theme_settings").select(SELECT_COLUMNS6).order("id", { ascending: true }).limit(1)
        ).maybeSingle();
        if (error) throw error;
        if (!data) {
          const { data: inserted } = await this.db.from("theme_settings").insert({ workspace_id: this.workspaceId, ...{} }).select().maybeSingle();
          return { ...DEFAULT_THEME_SETTINGS, ...inserted ?? {} };
        }
        return { ...DEFAULT_THEME_SETTINGS, ...data };
      } catch (err) {
        throw this.normalizeError("theme_settings", "get", err);
      }
    });
  }
  /**
   * Install theme settings from blueprint data.
   * Checks for existing theme first — idempotent.
   * Does NOT assume hardcoded id=1.
   */
  async installBlueprintTheme(theme) {
    const { data: existingThemes } = await this.withWorkspace(
      this.db.from("theme_settings").select("id").limit(1)
    );
    if (existingThemes && existingThemes.length > 0) {
      this.logger.info("Theme settings already exist \u2014 skipping theme installation");
      return;
    }
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
    if (this.workspaceId) update.workspace_id = this.workspaceId;
    const { error } = await this.db.from("theme_settings").upsert(update);
    if (error) throw this.normalizeError("theme_settings", "installBlueprintTheme", error);
  }
  async update(patch) {
    try {
      this.validateOrThrow(themeSchema, patch, "theme_settings");
      const { data: existing } = await this.withWorkspace(
        this.db.from("theme_settings").select("id").limit(1)
      ).maybeSingle();
      if (!existing) {
        throw new Error("No theme settings found to update");
      }
      const { error } = await this.db.from("theme_settings").update(patch).eq("id", existing.id);
      if (error) throw error;
      getCache().invalidate("theme_settings");
    } catch (err) {
      throw this.normalizeError("theme_settings", "update", err);
    }
  }
};

// src/lib/repositories/site-content.ts
var SELECT_COLUMNS7 = "key,value,updated_at";
var SiteContentRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async getAll() {
    try {
      const { data, error } = await this.withWorkspace(
        this.db.from("site_content").select(SELECT_COLUMNS7)
      );
      if (error) throw error;
      const out = {};
      for (const row of data ?? []) out[row.key] = row.value ?? {};
      return out;
    } catch (err) {
      throw this.normalizeError("site_content", "getAll", err);
    }
  }
  async getByKey(key) {
    try {
      const { data, error } = await this.withWorkspace(
        this.db.from("site_content").select(SELECT_COLUMNS7).eq("key", key)
      ).maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("site_content", "getByKey", err, { key });
    }
  }
  /**
   * Install navigation entries as a workspace-scoped site_content key.
   */
  async installBlueprintNavigation(navigation, workspaceId, resourceMap) {
    if (navigation.length === 0) return null;
    const navKey = `navigation:${workspaceId}`;
    const { data: existing } = await this.withWorkspace(
      this.db.from("site_content").select("key").eq("key", navKey)
    ).maybeSingle();
    if (existing) return null;
    const navValue = navigation.sort((a, b) => a.sortOrder - b.sortOrder).map((entry, index) => ({
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: entry.title,
      path: entry.path,
      sort_order: index,
      visible: true
    }));
    const upsertNav = { key: navKey, value: { items: navValue }, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (this.workspaceId) upsertNav.workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertNav);
    if (error) throw this.normalizeError("site_content", "installBlueprintNavigation", error);
    if (resourceMap) {
      resourceMap.siteContentKeys.push(navKey);
    }
    return navKey;
  }
  /**
   * Install SEO defaults with workspace-scoped key.
   */
  async installBlueprintSEO(seo, workspaceId, resourceMap) {
    const seoKey = `seo_defaults:${workspaceId}`;
    const { data: existing } = await this.withWorkspace(
      this.db.from("site_content").select("key").eq("key", seoKey)
    ).maybeSingle();
    if (existing) return [];
    const upsertSeo = { key: seoKey, value: { title: seo.title, description: seo.description, ogImage: seo.ogImage ?? "" }, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (this.workspaceId) upsertSeo.workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertSeo);
    if (error) throw this.normalizeError("site_content", "installBlueprintSEO", error);
    if (resourceMap) {
      resourceMap.siteContentKeys.push(seoKey);
    }
    return [seoKey];
  }
  /**
   * Install analytics config with workspace-scoped key.
   */
  async installBlueprintAnalytics(analytics, workspaceId, resourceMap) {
    const analyticsKey = `analytics_config:${workspaceId}`;
    const { data: existing } = await this.withWorkspace(
      this.db.from("site_content").select("key").eq("key", analyticsKey)
    ).maybeSingle();
    if (existing) return [];
    const upsertAnalytics = { key: analyticsKey, value: { enabled: analytics.enabled, provider: analytics.provider ?? "supabase" }, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (this.workspaceId) upsertAnalytics.workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertAnalytics);
    if (error) throw this.normalizeError("site_content", "installBlueprintAnalytics", error);
    if (resourceMap) {
      resourceMap.siteContentKeys.push(analyticsKey);
    }
    return [analyticsKey];
  }
  /**
   * Install business settings with workspace-scoped key.
   */
  async installBlueprintBusinessSettings(settings, workspaceId, resourceMap) {
    if (Object.keys(settings).length === 0) return [];
    const businessKey = `business_settings:${workspaceId}`;
    const { data: existing } = await this.withWorkspace(
      this.db.from("site_content").select("key").eq("key", businessKey)
    ).maybeSingle();
    if (existing) return [];
    const upsertBusiness = { key: businessKey, value: settings, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (this.workspaceId) upsertBusiness.workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertBusiness);
    if (error) throw this.normalizeError("site_content", "installBlueprintBusinessSettings", error);
    if (resourceMap) {
      resourceMap.siteContentKeys.push(businessKey);
    }
    return [businessKey];
  }
  /**
   * Get a provision log entry.
   */
  async getProvisionLog(workspaceId, blueprintSlug, blueprintVersion) {
    const key = `provision:log:${workspaceId}:${blueprintSlug}:${blueprintVersion}`;
    try {
      const { data } = await this.withWorkspace(
        this.db.from("site_content").select("value").eq("key", key)
      ).maybeSingle();
      if (data?.value) {
        return data.value;
      }
    } catch (err) {
      this.logger.warn(`Failed to fetch provision log for ${key}`, {
        source: "site-content",
        provisionKey: key,
        cause: err instanceof Error ? err.message : String(err)
      });
    }
    return { entities: [] };
  }
  /**
   * Save a provision log entry.
   */
  async saveProvisionLog(workspaceId, blueprintSlug, blueprintVersion, log) {
    const key = `provision:log:${workspaceId}:${blueprintSlug}:${blueprintVersion}`;
    const upsertLog = {
      key,
      value: { workspaceId, blueprintSlug, blueprintVersion, provisionedAt: (/* @__PURE__ */ new Date()).toISOString(), entities: log.entities },
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (this.workspaceId) upsertLog.workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertLog);
    if (error) throw this.normalizeError("site_content", "saveProvisionLog", error);
  }
  /**
   * Delete a site_content entry by key.
   */
  async deleteByKey(key) {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("site_content").delete().eq("key", key)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("site_content", "deleteByKey", err, { key });
    }
  }
  async upsert(key, value) {
    try {
      this.validateOrThrow(siteContentValueSchema, value, "site_content");
      const upsertItem = { key, value };
      if (this.workspaceId) upsertItem.workspace_id = this.workspaceId;
      const { error } = await this.db.from("site_content").upsert(upsertItem);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("site_content", "upsert", err, { key });
    }
  }
  /**
   * Batch delete multiple site_content entries by keys.
   * Uses a single database round-trip instead of N individual deletes.
   *
   * @param keys - Array of keys to delete
   */
  async batchDeleteByKeys(keys) {
    if (keys.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("site_content").delete().in("key", keys)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("site_content", "batchDeleteByKeys", err, { count: keys.length });
    }
  }
  /**
   * Batch get multiple site_content entries by keys.
   * Returns a map of key -> row for all matching entries.
   * Non-existent keys are omitted from the result.
   *
   * @param keys - Array of keys to fetch
   * @returns Map of key -> SiteContentRow for found entries
   */
  async batchGetByKeys(keys) {
    if (keys.length === 0) return /* @__PURE__ */ new Map();
    try {
      const { data, error } = await this.withWorkspace(
        this.db.from("site_content").select(SELECT_COLUMNS7).in("key", keys)
      );
      if (error) throw error;
      const result = /* @__PURE__ */ new Map();
      for (const row of data ?? []) {
        result.set(row.key, row);
      }
      return result;
    } catch (err) {
      throw this.normalizeError("site_content", "batchGetByKeys", err, { count: keys.length });
    }
  }
};

// src/lib/repositories/personality.ts
var SELECT_COLUMNS8 = "key,label,tagline,description,traits,drink,spot,color_from,color_to,sort_order,updated_at";
var PersonalityRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async getAll(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("personality_profiles").select(SELECT_COLUMNS8).order("sort_order")
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("personality_profiles", "getAll", err, { opts });
    }
  }
  /**
   * Install personality profiles from blueprint data.
   * Uses upsert by key (primary key) for idempotency.
   * Tracks created keys in the resource map.
   */
  async installBlueprintPersonalities(profiles, resourceMap) {
    const keys = [];
    for (const profile of profiles) {
      const upsertProfile = {
        key: profile.key,
        label: profile.label,
        tagline: profile.tagline,
        description: profile.description,
        traits: profile.traits,
        drink: profile.drink ?? null,
        spot: profile.spot ?? null,
        color_from: profile.colorFrom ?? null,
        color_to: profile.colorTo ?? null,
        sort_order: keys.length
      };
      if (this.workspaceId) upsertProfile.workspace_id = this.workspaceId;
      const { error } = await this.db.from("personality_profiles").upsert(upsertProfile);
      if (error) {
        if (error.code === "23505") continue;
        throw this.normalizeError("personality_profiles", "installBlueprintPersonalities", error);
      }
      keys.push(profile.key);
      if (resourceMap) {
        resourceMap.personalityKeys.push(profile.key);
      }
    }
    return keys;
  }
  async upsert(row) {
    try {
      this.validateOrThrow(personalityProfileUpdateSchema, { ...row }, "personality_profiles");
      const insertRow = this.workspaceId ? { ...row, workspace_id: this.workspaceId } : row;
      const { error } = await this.db.from("personality_profiles").upsert(insertRow);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("personality_profiles", "upsert", err);
    }
  }
  /**
   * Batch delete personality profiles by keys.
   */
  async batchDelete(keys) {
    if (keys.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("personality_profiles").delete().in("key", keys)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("personality_profiles", "batchDelete", err, { count: keys.length });
    }
  }
  async update(key, patch) {
    try {
      this.validateOrThrow(personalityProfileUpdateSchema, patch, "personality_profiles.update");
      const { error } = await this.withWorkspace(
        this.db.from("personality_profiles").update(patch).eq("key", key)
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("personality_profiles", "update", err, { key });
    }
  }
};

// src/lib/repositories/media.ts
var MEDIA_BUCKET = "media";
var SELECT_COLUMNS9 = "id,name,storage_path,folder,tags,size_bytes,mime_type,created_at";
var MediaRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async getAll(opts) {
    try {
      let query = this.withWorkspace(
        this.db.from("media_files").select(SELECT_COLUMNS9).order("created_at", { ascending: false })
      );
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    } catch (err) {
      throw this.normalizeError("media_files", "getAll", err, { opts });
    }
  }
  /**
   * Upload a file to storage and record metadata.
   *
   * @param file - The file to upload
   * @param folder - Storage subfolder (default: "uploads").
   *   Convention: "{prefix}/{entity-type}" e.g. "default/gallery", "default/events"
   */
  async upload(file, folder = "uploads") {
    const safeName = file.name.replace(/[^\w.\-()+\u0600-\u06FF]/g, "_");
    const storagePath = `${folder}/${crypto.randomUUID()}-${safeName}`;
    this.logger.info(`Uploading media`, { folder, fileName: file.name, size: file.size });
    const { error: uploadError } = await this.storage.upload(MEDIA_BUCKET, storagePath, file, {
      contentType: file.type
    });
    if (uploadError) {
      throw new StorageError("upload", MEDIA_BUCKET, {
        cause: uploadError,
        context: { storagePath }
      });
    }
    try {
      const metadata = this.validateOrThrow(
        mediaFileSchema,
        {
          name: file.name,
          storage_path: storagePath,
          folder,
          tags: [],
          size_bytes: file.size,
          mime_type: file.type
        },
        "media_files.upload"
      );
      const insertData = this.workspaceId ? { ...metadata, workspace_id: this.workspaceId } : metadata;
      const { data, error } = await this.db.from("media_files").insert(insertData).select().single();
      if (error) {
        this.logger.warn("DB insert failed, cleaning up storage", { storagePath, error });
        await this.storage.remove(MEDIA_BUCKET, [storagePath]);
        throw error;
      }
      return data;
    } catch (err) {
      throw this.normalizeError("media_files", "upload", err, { storagePath });
    }
  }
  async delete(file) {
    try {
      const { error: storageError } = await this.storage.remove(MEDIA_BUCKET, [file.storage_path]);
      if (storageError) {
        throw new StorageError("remove", MEDIA_BUCKET, {
          cause: storageError,
          context: { storagePath: file.storage_path }
        });
      }
      const { error } = await this.db.from("media_files").delete().eq("id", file.id);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("media_files", "delete", err, { fileId: file.id });
    }
  }
  getPublicUrl(storagePath) {
    return this.storage.getPublicUrl(MEDIA_BUCKET, storagePath);
  }
  async deleteByPublicUrl(publicUrl) {
    try {
      const url = new URL(publicUrl);
      const pathMatch = url.pathname.match(/\/media\/(.+)/);
      if (!pathMatch) return;
      const storagePath = decodeURIComponent(pathMatch[1]);
      await this.storage.remove(MEDIA_BUCKET, [storagePath]);
    } catch (err) {
      this.logger.warn("Failed to delete media by public URL", {
        publicUrl,
        cause: err instanceof Error ? err.message : String(err)
      });
    }
  }
};

// src/lib/repositories/test.ts
var TEST_RESPONSE_COLUMNS = "id,answers,result,tied,completed_at,user_full_name,user_phone,user_age,user_gender";
var TestRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async getResponses(opts) {
    try {
      let query = this.db.from("test_responses").select(TEST_RESPONSE_COLUMNS).order("completed_at", { ascending: false });
      query = this.applyPagination(query, opts);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map((r) => this._rowToResponse(r));
    } catch (err) {
      throw this.normalizeError("test_responses", "getResponses", err, { opts });
    }
  }
  async submitResponse(input) {
    try {
      const validated = this.validateOrThrow(
        testResponseSchema,
        {
          answers: input.answers,
          result: input.result,
          tied: input.tied,
          user_full_name: input.userInfo?.fullName ?? "",
          user_phone: input.userInfo?.phone ?? "",
          user_age: input.userInfo?.age ?? null,
          user_gender: input.userInfo?.gender ?? ""
        },
        "test_responses"
      );
      const row = {
        answers: validated.answers,
        result: validated.result,
        tied: validated.tied,
        user_full_name: validated.user_full_name,
        user_phone: validated.user_phone,
        user_age: validated.user_age ?? null,
        user_gender: validated.user_gender
      };
      const { data, error } = await this.db.from("test_responses").insert(row).select().single();
      if (error) throw error;
      return this._rowToResponse(data);
    } catch (err) {
      throw this.normalizeError("test_responses", "submitResponse", err);
    }
  }
  async deleteResponse(id) {
    try {
      const { error } = await this.db.from("test_responses").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("test_responses", "deleteResponse", err, { id });
    }
  }
  async clearResponses() {
    try {
      const { error } = await this.db.from("test_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("test_responses", "clearResponses", err);
    }
  }
  async getQuestionsConfig() {
    try {
      const { data, error } = await this.db.from("site_content").select("value").eq("key", "test_questions").maybeSingle();
      if (error) throw error;
      const EMPTY = { overrides: {}, orderedIds: null };
      if (!data?.value) return EMPTY;
      const v = data.value;
      return {
        overrides: v.overrides ?? {},
        orderedIds: v.orderedIds ?? null
      };
    } catch (err) {
      throw this.normalizeError("site_content", "getQuestionsConfig", err);
    }
  }
  async updateQuestionsConfig(config) {
    try {
      this.validateOrThrow(testConfigSchema, config, "test_questions");
      const { error } = await this.db.from("site_content").upsert({
        key: "test_questions",
        value: config
      });
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("site_content", "updateQuestionsConfig", err);
    }
  }
  _rowToResponse(row) {
    return {
      id: row.id,
      completedAt: row.completed_at,
      answers: row.answers ?? {},
      result: row.result,
      tied: row.tied ?? [],
      userInfo: row.user_full_name || row.user_phone ? {
        fullName: row.user_full_name ?? "",
        phone: row.user_phone ?? "",
        age: row.user_age ?? 0,
        gender: row.user_gender ?? ""
      } : void 0
    };
  }
};

// src/lib/repositories/analytics.ts
var AnalyticsRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  /**
   * Fetch aggregate site visit stats.
   */
  async fetchStats() {
    try {
      const startOfDay = /* @__PURE__ */ new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const startOfYesterday = new Date(startOfDay);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1e3);
      const sv = this._siteVisitsQuery();
      const [totalRes, todayRes, yesterdayRes, realtimeRes] = await Promise.all([
        sv.selectCount("session_id", { is_bot: false }),
        sv.selectCount("session_id", { is_bot: false, gte: startOfDay.toISOString() }),
        sv.selectCount("session_id", {
          is_bot: false,
          gte: startOfYesterday.toISOString(),
          lt: startOfDay.toISOString()
        }),
        sv.selectCount("session_id", { is_bot: false, gte: fiveMinAgo.toISOString() })
      ]);
      return {
        total: totalRes.count ?? 0,
        today: todayRes.count ?? 0,
        yesterday: yesterdayRes.count ?? 0,
        realtime: realtimeRes.count ?? 0
      };
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchStats", err);
    }
  }
  /**
   * Fetch top pages by visit count.
   */
  async fetchTopPages(limit = 10) {
    try {
      try {
        const { data, error } = await this.db.rpc("get_top_pages", {
          limit_count: limit
        });
        if (!error && data) return data;
      } catch {
      }
      const sv = this._siteVisitsQuery();
      const { data: fallback } = await sv.selectColumns("page_path");
      if (!fallback) return [];
      const counts = /* @__PURE__ */ new Map();
      for (const row of fallback) {
        const path = row.page_path ?? "";
        counts.set(path, (counts.get(path) ?? 0) + 1);
      }
      return Array.from(counts.entries()).map(([page_path, visit_count]) => ({ page_path, visit_count })).sort((a, b) => b.visit_count - a.visit_count).slice(0, limit);
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchTopPages", err);
    }
  }
  /**
   * Fetch device distribution.
   */
  async fetchDeviceDistribution() {
    try {
      try {
        const { data, error } = await this.db.rpc(
          "get_device_distribution"
        );
        if (!error && data) return data;
      } catch {
      }
      const sv = this._siteVisitsQuery();
      const { data: fallback } = await sv.selectColumns("device_type");
      if (!fallback) return [];
      const counts = /* @__PURE__ */ new Map();
      for (const row of fallback) {
        counts.set(row.device_type ?? "unknown", (counts.get(row.device_type ?? "unknown") ?? 0) + 1);
      }
      return Array.from(counts.entries()).map(([device_type, count]) => ({ device_type, count })).sort((a, b) => b.count - a.count);
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchDeviceDistribution", err);
    }
  }
  /**
   * Fetch visits over time.
   */
  async fetchVisitsOverTime(days) {
    try {
      try {
        const { data, error } = await this.db.rpc(
          "get_visits_over_time",
          { days }
        );
        if (!error && data) return data;
      } catch {
      }
      const cutoff = /* @__PURE__ */ new Date();
      cutoff.setDate(cutoff.getDate() - days);
      cutoff.setHours(0, 0, 0, 0);
      const sv = this._siteVisitsQuery();
      const { data: fallback } = await sv.selectColumns("created_at");
      if (!fallback) return [];
      const dayCounts = /* @__PURE__ */ new Map();
      for (const row of fallback) {
        const date = new Date(row.created_at ?? "").toISOString().split("T")[0];
        dayCounts.set(date, (dayCounts.get(date) ?? 0) + 1);
      }
      return Array.from(dayCounts.entries()).map(([date, visits]) => ({ date, visits })).sort((a, b) => a.date.localeCompare(b.date));
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchVisitsOverTime", err);
    }
  }
  /**
   * Fetch page view stats (from page_views table).
   */
  async fetchPageViewStats() {
    try {
      const startOfDay = /* @__PURE__ */ new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [totalRes, todayRes] = await Promise.all([
        this.db.from("page_views").select("*", { count: "exact", head: true }),
        this.db.from("page_views").select("*", { count: "exact", head: true }).gte("visited_at", startOfDay.toISOString())
      ]);
      if (totalRes.error) throw totalRes.error;
      if (todayRes.error) throw todayRes.error;
      return { total: totalRes.count ?? 0, today: todayRes.count ?? 0 };
    } catch (err) {
      throw this.normalizeError("page_views", "fetchPageViewStats", err);
    }
  }
  /**
   * Record a page view (server-side).
   */
  async recordPageView(input) {
    try {
      const validated = this.validateOrThrow(pageViewSchema, input, "page_views");
      const { error } = await this.db.from("page_views").insert({
        path: validated.path ?? "/",
        referrer: validated.referrer ?? null,
        user_agent: validated.user_agent ?? null
      });
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("page_views", "recordPageView", err);
    }
  }
  /**
   * Get the site visit stats via RPC (server-side).
   */
  async fetchSiteVisitStatsRpc() {
    try {
      const { data, error } = await this.db.rpc("get_site_visit_stats");
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchSiteVisitStatsRpc", err);
    }
  }
  // --- Private helpers ---
  /**
   * Wrapper for site_visits queries (not yet in generated Supabase types).
   */
  _siteVisitsQuery() {
    const db = this.db;
    return {
      selectCount: async (_column, filter) => {
        let query = db.from("site_visits").select("*", { count: "exact", head: true });
        if (filter?.gte) query = query.gte("created_at", filter.gte);
        if (filter?.lt) query = query.lt("created_at", filter.lt);
        return query;
      },
      selectColumns: async (columns) => {
        const result = await db.from("site_visits").select(columns);
        return result;
      }
    };
  }
};

// src/lib/repositories/auth.ts
var AuthRepository = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  async signIn(email, password) {
    try {
      const { error } = await this.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this.logger.info("User signed in", { source: "auth" });
    } catch (err) {
      throw new AuthError("signIn", { cause: err, context: { email } });
    }
  }
  async signUp(email, password, redirectTo) {
    try {
      const { error } = await this.auth.signUp({
        email,
        password,
        options: redirectTo ? { emailRedirectTo: redirectTo } : void 0
      });
      if (error) throw error;
    } catch (err) {
      throw new AuthError("signUp", { cause: err, context: { email } });
    }
  }
  async signOut() {
    try {
      await this.auth.signOut();
    } catch (err) {
      throw new AuthError("signOut", { cause: err });
    }
  }
  async getSession() {
    try {
      const { data } = await this.auth.getSession();
      return { user: data.session?.user ?? null };
    } catch (err) {
      throw new AuthError("getSession", { cause: err });
    }
  }
  async getCurrentUser() {
    try {
      const { data } = await this.auth.getSession();
      return { user: data.session?.user ?? null, loading: false };
    } catch (err) {
      throw new AuthError("getCurrentUser", { cause: err });
    }
  }
  onAuthStateChange(callback) {
    try {
      return this.auth.onAuthStateChange(callback);
    } catch (err) {
      throw new AuthError("onAuthStateChange", { cause: err });
    }
  }
  async isAdmin(userId) {
    try {
      const { data, error } = await this.db.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
      if (error) throw error;
      return !!data;
    } catch (err) {
      throw new AuthError("isAdmin", { cause: err, context: { userId } });
    }
  }
  async getClaims(token) {
    try {
      return this.auth.getClaims(token);
    } catch (err) {
      throw new AuthError("getClaims", { cause: err });
    }
  }
};

// src/lib/repositories/factory.ts
function createRepositories(deps) {
  return {
    menu: new MenuRepository(deps),
    gallery: new GalleryRepository(deps),
    events: new EventsRepository(deps),
    testimonials: new TestimonialsRepository(deps),
    pages: new PagesRepository(deps),
    theme: new ThemeRepository(deps),
    siteContent: new SiteContentRepository(deps),
    personality: new PersonalityRepository(deps),
    media: new MediaRepository(deps),
    test: new TestRepository(deps),
    analytics: new AnalyticsRepository(deps),
    auth: new AuthRepository(deps),
    workspace: new WorkspaceRepository(deps),
    realtime: deps.realtime
  };
}
function setWorkspaceOnRepositories(repos, workspace) {
  for (const repo of Object.values(repos)) {
    if (typeof repo.setWorkspace === "function") {
      repo.setWorkspace(workspace);
    }
  }
}

// src/lib/core/provision/engine.ts
var ProvisionEngine = class {
  deps;
  constructor(deps) {
    this.deps = deps;
  }
  /**
   * Start the provisioning pipeline.
   * One Request → One Ready Website.
   */
  async provision(input) {
    const startedAt = (/* @__PURE__ */ new Date()).toISOString();
    const startMs = Date.now();
    const validation = await this.deps.validator.validate(input);
    if (!validation.valid) {
      throw new Error(`Provision validation failed: ${validation.error}`);
    }
    const parsed = provisionRequestSchema.parse(input);
    const resolved = validation.resolved;
    const blueprint = await this.deps.loader.loadOrThrow(resolved.blueprintSlug, resolved.blueprintVersion);
    const workspaceId = await this._createWorkspace(blueprint, parsed);
    setWorkspaceOnRepositories(this.deps.repos, { workspaceId });
    const initiatedBy = parsed.ownerUserId ?? "public-api";
    const tx = await this.deps.transactionManager.begin({
      workspaceId,
      blueprintId: resolved.blueprintId,
      blueprintVersion: resolved.blueprintVersion,
      initiatedBy
    });
    const session = createSession({
      workspaceId,
      transactionId: tx.id,
      blueprintSlug: resolved.blueprintSlug,
      blueprintVersion: resolved.blueprintVersion,
      initiatedBy,
      startedAt
    });
    try {
      await this._executePipeline(blueprint, session);
      await this.deps.transactionManager.updateStatus(tx.id, "completed");
      this.deps.logger.info(`Provision complete: ${blueprint.name} \u2192 workspace ${workspaceId}`, {
        source: "provision-engine",
        transactionId: tx.id,
        workspaceId,
        durationMs: Date.now() - startMs,
        stepCount: session.stepMetrics.length,
        ...this._summarizeResources(session)
      });
    } catch (err) {
      await this._handleFailure(tx, blueprint, session, err);
    }
    const finalTx = await this.deps.transactionManager.get(tx.id);
    const workspaceInfo = await this._getWorkspaceInfo(workspaceId);
    return this.deps.reportGenerator.generate(finalTx, blueprint, workspaceInfo, session);
  }
  // ─── Pipeline execution ────────────────────────────────────────────────
  /**
   * Execute all pipeline steps in order using the Command Pattern.
   * Each step is executed via its command's execute() method.
   * On failure, rollback() is called on each completed step in reverse order.
   */
  async _executePipeline(blueprint, session) {
    for (const step of PROVISION_PIPELINE) {
      const command = this.deps.stepRegistry.get(step);
      if (!command) {
        throw new Error(`No command registered for step: ${step}`);
      }
      await this._executeStepWithRetry(command, blueprint, session);
    }
  }
  /**
   * Execute a single step with retry support.
   * Retry policy is configurable per step via the command's retryPolicy.
   */
  async _executeStepWithRetry(command, blueprint, session) {
    const step = command.step;
    const policy = command.retryPolicy;
    let retryCount = 0;
    while (true) {
      const stepStartMs = Date.now();
      try {
        const output = await command.execute(
          blueprint,
          session.context.workspaceId,
          this.deps.repos,
          session
        );
        const durationMs = Date.now() - stepStartMs;
        appendStepMetric(session, {
          step,
          durationMs,
          success: true,
          retryCount,
          output
        });
        await this.deps.transactionManager.recordStep(session.context.transactionId, step, {
          success: true,
          completedAt: (/* @__PURE__ */ new Date()).toISOString(),
          durationMs,
          output
        });
        this.deps.logger.info(`Step completed: ${command.label} (${durationMs}ms)`, {
          source: "provision-engine",
          transactionId: session.context.transactionId,
          workspaceId: session.context.workspaceId,
          retryCount
        });
        return;
      } catch (err) {
        retryCount++;
        const durationMs = Date.now() - stepStartMs;
        const delay = getRetryDelayMs(policy, retryCount - 1, err);
        if (delay >= 0) {
          await this.deps.transactionManager.recordStep(session.context.transactionId, step, {
            success: false,
            completedAt: (/* @__PURE__ */ new Date()).toISOString(),
            error: `Retrying (attempt ${retryCount})...`,
            output: { retryCount }
          });
          this.deps.logger.warn(
            `Retrying step ${command.label} (attempt ${retryCount}) after ${delay}ms`,
            {
              source: "provision-engine",
              transactionId: session.context.transactionId,
              workspaceId: session.context.workspaceId
            }
          );
          await this._sleep(delay);
          continue;
        }
        const message = err instanceof Error ? err.message : String(err);
        appendStepMetric(session, {
          step,
          durationMs,
          success: false,
          retryCount: retryCount - 1,
          error: message
        });
        await this.deps.transactionManager.recordStep(session.context.transactionId, step, {
          success: false,
          completedAt: (/* @__PURE__ */ new Date()).toISOString(),
          durationMs,
          error: message
        });
        await this._rollbackCompletedSteps(blueprint, session, command);
        throw err;
      }
    }
  }
  /**
   * Generic rollback — rolls back all completed steps in reverse order.
   * Each step's command knows how to undo itself.
   * No domain knowledge in the engine.
   */
  async _rollbackCompletedSteps(blueprint, session, failedCommand) {
    const rollbackStart = Date.now();
    const completedSteps = session.stepMetrics.filter((m) => m.success).reverse();
    let allRolledBack = true;
    for (const metric of completedSteps) {
      const command = this.deps.stepRegistry.get(metric.step);
      if (!command || command === failedCommand) continue;
      try {
        await command.rollback(
          blueprint,
          session.context.workspaceId,
          this.deps.repos,
          session
        );
        this.deps.logger.info(`Rolled back step: ${command.label}`, {
          source: "provision-engine",
          transactionId: session.context.transactionId,
          workspaceId: session.context.workspaceId
        });
      } catch (rollbackErr) {
        const msg = rollbackErr instanceof Error ? rollbackErr.message : String(rollbackErr);
        this.deps.logger.error(`Rollback failed for step ${command.label}: ${msg}`, {
          source: "provision-engine",
          transactionId: session.context.transactionId,
          workspaceId: session.context.workspaceId
        });
        allRolledBack = false;
      }
    }
    session.rollback = {
      attempted: true,
      success: allRolledBack,
      durationMs: Date.now() - rollbackStart
    };
  }
  // ─── Workspace management ──────────────────────────────────────────────
  /**
   * Create workspace using the existing WorkspaceFactory.
   * The factory owns all construction logic — engine never constructs directly.
   */
  async _createWorkspace(blueprint, request) {
    const entity = createWorkspace({
      name: request.workspaceName ?? blueprint.name,
      description: request.workspaceDescription ?? blueprint.description,
      ownerUserId: request.ownerUserId ?? null,
      // Public Provisioning flow has no direct owner
      plan: request.plan ?? "free",
      locale: request.locale ?? "fa-IR",
      timezone: request.timezone ?? "Asia/Tehran",
      domain: request.domain
      // Pre-validated full domain (check-slug already confirmed availability)
    });
    await this.deps.workspaceRepository.save(entity);
    this.deps.logger.info(`Workspace created for provisioning: ${entity.id}`, {
      source: "provision-engine",
      blueprint: blueprint.slug,
      plan: entity.plan
    });
    return entity.id;
  }
  // ─── Failure handling ───────────────────────────────────────────────────
  async _handleFailure(tx, blueprint, session, err) {
    const message = err instanceof Error ? err.message : String(err);
    this.deps.logger.error(`Provision failed for transaction ${tx.id}: ${message}`, {
      source: "provision-engine",
      transactionId: tx.id,
      workspaceId: tx.workspaceId
    });
    if (session.stepMetrics.length > 0) {
      await this._rollbackCompletedSteps(blueprint, session);
    }
    if (session.rollback) {
      if (session.rollback.success) {
        this.deps.logger.info(`Full rollback successful for transaction ${tx.id}`, {
          source: "provision-engine",
          transactionId: tx.id,
          workspaceId: tx.workspaceId
        });
      } else {
        this.deps.logger.error(`Partial rollback for transaction ${tx.id} \u2014 some data may remain`, {
          source: "provision-engine",
          transactionId: tx.id,
          workspaceId: tx.workspaceId
        });
      }
    }
    await this.deps.transactionManager.updateStatus(tx.id, "failed");
  }
  // ─── Utilities ─────────────────────────────────────────────────────────
  async _getWorkspaceInfo(workspaceId) {
    try {
      const entity = await this.deps.workspaceRepository.findById(workspaceId);
      if (entity) {
        return {
          id: workspaceId,
          name: entity.metadata.name,
          status: entity.status,
          plan: entity.plan
        };
      }
    } catch (err) {
      this.deps.logger.warn(`Could not fetch workspace info for ${workspaceId}`, {
        source: "provision-engine",
        workspaceId,
        cause: err instanceof Error ? err.message : String(err)
      });
    }
    return { id: workspaceId, name: "Unknown", status: "unknown", plan: "free" };
  }
  _summarizeResources(session) {
    const rm = session.resourceMap;
    return {
      pageBlocks: rm.pageBlockIds.length,
      menus: rm.menuItemIds.length,
      gallery: rm.galleryImageIds.length,
      personalities: rm.personalityKeys.length,
      siteContentKeys: rm.siteContentKeys.length
    };
  }
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

// src/lib/core/provision/blueprint/registry.ts
var BP_KEY_PREFIX = "blueprint:";
function blueprintKey(slug, version) {
  return `${BP_KEY_PREFIX}${slug}:${version}`;
}
function blueprintIndexKey() {
  return `${BP_KEY_PREFIX}index`;
}
var BlueprintRegistry = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  /**
   * Register a new blueprint (store its definition).
   * If a blueprint with the same slug+version exists, it is overwritten.
   */
  async register(blueprintInput) {
    const parsed = blueprintSchema.parse(blueprintInput);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const meta = parsed.metadata ?? { createdBy: "system", tags: [], isPublished: true, createdAt: now, updatedAt: now };
    const metaUpdated = { ...meta, updatedAt: now, createdAt: meta.createdAt ?? now };
    const fullBlueprint = { ...parsed, metadata: metaUpdated };
    const key = blueprintKey(fullBlueprint.slug, fullBlueprint.version);
    const { error } = await this.db.from("site_content").upsert({
      key,
      value: fullBlueprint,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error) throw this.normalizeError("site_content", "blueprint.register", error, { key });
    await this._updateIndex(fullBlueprint);
    this.logger.info(`Blueprint registered: ${fullBlueprint.slug} v${fullBlueprint.version}`, {
      source: "blueprint"
    });
    return fullBlueprint;
  }
  /**
   * Get a blueprint by slug and version.
   * Returns null if not found.
   */
  async getByVersion(slug, version) {
    try {
      const key = blueprintKey(slug, version);
      const { data, error } = await this.db.from("site_content").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const result = blueprintSchema.safeParse(data.value);
      return result.success ? result.data : null;
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.getByVersion", err, { slug, version });
    }
  }
  /**
   * Get the latest version of a blueprint by slug.
   * Returns null if no blueprint with that slug exists.
   */
  async getLatest(slug) {
    try {
      const index = await this._loadIndex();
      const entries = index.entries.filter((e) => e.slug === slug && e.isPublished).sort((a, b) => b.version.localeCompare(a.version, void 0, { numeric: true }));
      if (entries.length === 0) return null;
      return this.getByVersion(slug, entries[0].version);
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.getLatest", err, { slug });
    }
  }
  /**
   * List all available blueprint slugs with their latest versions.
   */
  async listBlueprints() {
    try {
      const index = await this._loadIndex();
      const latest = /* @__PURE__ */ new Map();
      for (const entry of index.entries) {
        if (!entry.isPublished) continue;
        const existing = latest.get(entry.slug);
        if (!existing || entry.version.localeCompare(existing.version, void 0, { numeric: true }) > 0) {
          latest.set(entry.slug, entry);
        }
      }
      return Array.from(latest.values());
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.listBlueprints", err);
    }
  }
  /**
   * List all versions of a specific blueprint slug.
   */
  async listVersions(slug) {
    try {
      const index = await this._loadIndex();
      return index.entries.filter((e) => e.slug === slug).sort((a, b) => b.version.localeCompare(a.version, void 0, { numeric: true }));
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.listVersions", err, { slug });
    }
  }
  /**
   * Delete a blueprint version from the registry.
   */
  async delete(slug, version) {
    try {
      const key = blueprintKey(slug, version);
      const { error } = await this.db.from("site_content").delete().eq("key", key);
      if (error) throw error;
      const index = await this._loadIndex();
      index.entries = index.entries.filter(
        (e) => !(e.slug === slug && e.version === version)
      );
      await this._saveIndex(index);
      this.logger.info(`Blueprint deleted: ${slug} v${version}`, { source: "blueprint" });
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.delete", err, { slug, version });
    }
  }
  // ─── Private helpers ─────────────────────────────────────────────────────
  /**
   * Load the blueprint index from storage.
   * Returns an empty index if none exists.
   */
  async _loadIndex() {
    try {
      const key = blueprintIndexKey();
      const { data, error } = await this.db.from("site_content").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      if (!data) return { entries: [] };
      return data.value ?? { entries: [] };
    } catch {
      return { entries: [] };
    }
  }
  /**
   * Save the blueprint index to storage.
   */
  async _saveIndex(index) {
    const key = blueprintIndexKey();
    const { error } = await this.db.from("site_content").upsert({
      key,
      value: index,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error) throw this.normalizeError("site_content", "blueprint.saveIndex", error);
  }
  /**
   * Update the index with a newly registered blueprint.
   */
  async _updateIndex(blueprint) {
    const index = await this._loadIndex();
    index.entries = index.entries.filter(
      (e) => !(e.slug === blueprint.slug && e.version === blueprint.version)
    );
    const entry = {
      slug: blueprint.slug,
      version: blueprint.version,
      name: blueprint.name,
      description: blueprint.description,
      category: blueprint.category,
      isPublished: blueprint.metadata.isPublished,
      createdAt: blueprint.metadata.createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    index.entries.push(entry);
    await this._saveIndex(index);
  }
};

// src/lib/core/provision/blueprint/loader.ts
var BlueprintLoader = class {
  registry;
  constructor(deps) {
    this.registry = deps.registry;
  }
  /**
   * Load a blueprint by slug, optionally specifying a version.
   * If no version is specified, the latest published version is returned.
   *
   * Blueprints are DATA — this just loads the data definition.
   */
  async load(slug, version) {
    const cacheKey = version ? `${slug}:${version}` : `${slug}:latest`;
    const cache = getCache();
    return cache.getOrFetch("blueprints", cacheKey, async () => {
      if (version) {
        const blueprint = await this.registry.getByVersion(slug, version);
        if (!blueprint) {
          return null;
        }
        return blueprint;
      }
      const latest = await this.registry.getLatest(slug);
      if (!latest) {
        return null;
      }
      return latest;
    });
  }
  /**
   * Load a blueprint by slug and version, throwing if not found.
   */
  async loadOrThrow(slug, version) {
    const blueprint = await this.load(slug, version);
    if (!blueprint) {
      const versionStr = version ?? "latest";
      throw new Error(`Blueprint not found: ${slug}@${versionStr}`);
    }
    return blueprint;
  }
  /**
   * Check if a blueprint exists (slug + optional version).
   */
  async exists(slug, version) {
    const bp = await this.load(slug, version);
    return bp !== null;
  }
  /**
   * List all available blueprint slugs with their latest version info.
   */
  async listAvailable() {
    return this.registry.listBlueprints();
  }
  /**
   * List all versions of a specific blueprint.
   */
  async listVersions(slug) {
    return this.registry.listVersions(slug);
  }
};

// src/lib/core/provision/blueprint/versioning.ts
var BlueprintVersioning = class {
  registry;
  constructor(deps) {
    this.registry = deps.registry;
  }
  /**
   * Parse a version string into its components.
   */
  parse(version) {
    const parts = version.split(".");
    if (parts.length !== 3) return null;
    const major = parseInt(parts[0], 10);
    const minor = parseInt(parts[1], 10);
    const patch = parseInt(parts[2], 10);
    if (isNaN(major) || isNaN(minor) || isNaN(patch)) return null;
    return { major, minor, patch };
  }
  /**
   * Format version components into a version string.
   */
  format(major, minor, patch) {
    return `${major}.${minor}.${patch}`;
  }
  /**
   * Calculate the next version for a given slug based on the bump type.
   *
   * @returns The next version string, or "1.0.0" if no existing versions.
   */
  async nextVersion(slug, bump = "patch") {
    const versions = await this.registry.listVersions(slug);
    if (versions.length === 0) {
      return "1.0.0";
    }
    const latest = versions.sort(
      (a, b) => b.version.localeCompare(a.version, void 0, { numeric: true })
    )[0];
    const parsed = this.parse(latest.version);
    if (!parsed) {
      return "1.0.0";
    }
    switch (bump) {
      case "major":
        return this.format(parsed.major + 1, 0, 0);
      case "minor":
        return this.format(parsed.major, parsed.minor + 1, 0);
      case "patch":
        return this.format(parsed.major, parsed.minor, parsed.patch + 1);
    }
  }
  /**
   * Compare two version strings.
   * Returns -1 if a < b, 0 if equal, 1 if a > b.
   */
  compare(a, b) {
    const pa = this.parse(a);
    const pb = this.parse(b);
    if (!pa || !pb) return a.localeCompare(b);
    if (pa.major !== pb.major) return pa.major - pb.major;
    if (pa.minor !== pb.minor) return pa.minor - pb.minor;
    return pa.patch - pb.patch;
  }
  /**
   * Check if version a is compatible with version b (same major version).
   */
  isCompatible(a, b) {
    const pa = this.parse(a);
    const pb = this.parse(b);
    if (!pa || !pb) return false;
    return pa.major === pb.major;
  }
  /**
   * Determine the breaking change severity between two versions.
   * Returns the highest severity found.
   */
  getBreakingChangeSeverity(from, to) {
    const pa = this.parse(from);
    const pb = this.parse(to);
    if (!pa || !pb) return "major";
    if (pa.major !== pb.major) return "major";
    if (pa.minor !== pb.minor) return "minor";
    if (pa.patch !== pb.patch) return "patch";
    return "none";
  }
  /**
   * Generate a migration plan between two versions.
   * Walks through intermediate versions to produce step-by-step migration.
   * Returns a plan even if the migration requires multiple steps.
   */
  async generateMigrationPlan(slug, from, to) {
    const allVersions = await this.registry.listVersions(slug);
    const versionStrings = allVersions.map((v) => v.version).sort((a, b) => this.compare(a, b));
    const fromIdx = versionStrings.indexOf(from);
    const toIdx = versionStrings.indexOf(to);
    if (fromIdx === -1) {
      return {
        from,
        to,
        stepCount: 0,
        possible: false,
        reason: `Source version "${from}" not found in registry`,
        steps: []
      };
    }
    if (toIdx === -1) {
      return {
        from,
        to,
        stepCount: 0,
        possible: false,
        reason: `Target version "${to}" not found in registry`,
        steps: []
      };
    }
    if (fromIdx === toIdx) {
      return {
        from,
        to,
        stepCount: 0,
        possible: true,
        steps: []
      };
    }
    const isUpgrade = toIdx > fromIdx;
    const versionsToMigrate = isUpgrade ? versionStrings.slice(fromIdx + 1, toIdx + 1) : versionStrings.slice(toIdx, fromIdx).reverse();
    const steps = [];
    let currentVersion = from;
    for (const nextVersion of versionsToMigrate) {
      const severity = this.getBreakingChangeSeverity(currentVersion, nextVersion);
      steps.push({
        from: currentVersion,
        to: nextVersion,
        direction: isUpgrade ? "upgrade" : "downgrade",
        description: isUpgrade ? `Upgrade from ${currentVersion} to ${nextVersion}` : `Downgrade from ${currentVersion} to ${nextVersion}`,
        breaking: severity !== "none",
        actions: this._generateActions(severity, currentVersion, nextVersion)
      });
      currentVersion = nextVersion;
    }
    return {
      from,
      to,
      stepCount: steps.length,
      possible: true,
      steps
    };
  }
  /**
   * Check if a version satisfies a semver range.
   * Supports: ^1.0.0 (compatible), ~1.2.0 (approximately), exact, or "*" (any).
   */
  satisfies(version, range) {
    if (range === "*" || range === "x") return true;
    const parsed = this.parse(version);
    if (!parsed) return false;
    if (range === version) return true;
    if (range.startsWith("^")) {
      const rangeParsed = this.parse(range.slice(1));
      if (!rangeParsed) return false;
      return parsed.major === rangeParsed.major && parsed.minor >= rangeParsed.minor;
    }
    if (range.startsWith("~")) {
      const rangeParsed = this.parse(range.slice(1));
      if (!rangeParsed) return false;
      return parsed.major === rangeParsed.major && parsed.minor === rangeParsed.minor && parsed.patch >= rangeParsed.patch;
    }
    return false;
  }
  /**
   * Get the changelog for a blueprint, returning all version entries.
   */
  async getChangelog(slug) {
    const versions = await this.registry.listVersions(slug);
    const sorted = versions.sort((a, b) => this.compare(b.version, a.version));
    const changelog = [];
    let previousVersion = null;
    for (const entry of sorted) {
      const severity = previousVersion ? this.getBreakingChangeSeverity(entry.version, previousVersion) : "none";
      const changes = [];
      if (severity === "major") {
        changes.push(`Breaking changes from ${previousVersion}`);
      } else if (severity === "minor") {
        changes.push(`New features added from ${previousVersion}`);
      } else if (severity === "patch" && previousVersion) {
        changes.push(`Bug fixes and improvements from ${previousVersion}`);
      } else {
        changes.push("Initial release");
      }
      changelog.push({
        version: entry.version,
        date: entry.updatedAt ?? entry.createdAt,
        changes,
        breaking: severity !== "none" && severity !== "patch"
      });
      previousVersion = entry.version;
    }
    return changelog;
  }
  /**
   * Check if a blueprint version is safe to provision from a given current version.
   * Returns true if the provision would not break existing data.
   */
  async isSafeToProvision(slug, targetVersion) {
    const versions = await this.registry.listVersions(slug);
    if (versions.length === 0) return true;
    const latest = versions.sort(
      (a, b) => b.version.localeCompare(a.version, void 0, { numeric: true })
    )[0];
    const severity = this.getBreakingChangeSeverity(latest.version, targetVersion);
    return severity !== "major";
  }
  // ─── Private helpers ─────────────────────────────────────────────────────
  /**
   * Generate recommended actions for a migration step based on severity.
   */
  _generateActions(severity, from, to) {
    const actions = [];
    switch (severity) {
      case "major":
        actions.push("Review all schema changes between versions");
        actions.push("Backup existing data before migrating");
        actions.push("Update any custom integrations that depend on this blueprint");
        actions.push(`Run migration: ${from} \u2192 ${to}`);
        actions.push("Verify all pages render correctly after migration");
        break;
      case "minor":
        actions.push("Review new features available in new version");
        actions.push("Update any optional integrations");
        actions.push(`Run migration: ${from} \u2192 ${to}`);
        break;
      case "patch":
        actions.push("Apply patch update");
        actions.push("Verify no regressions");
        break;
      case "none":
        break;
    }
    return actions;
  }
};

// src/lib/core/provision/transaction.ts
var TX_KEY_PREFIX = "provision:tx:";
function transactionKey(txId) {
  return `${TX_KEY_PREFIX}${txId}`;
}
var ProvisionTransactionManager = class extends BaseRepository {
  constructor(deps) {
    super(deps);
  }
  /**
   * Begin a new provision transaction.
   */
  async begin(params) {
    const tx = {
      id: createId(),
      workspaceId: params.workspaceId,
      blueprintId: params.blueprintId,
      blueprintVersion: params.blueprintVersion,
      status: "pending",
      initiatedBy: params.initiatedBy,
      startedAt: (/* @__PURE__ */ new Date()).toISOString(),
      steps: [],
      currentStepIndex: 0,
      retryCount: 0,
      maxRetries: params.maxRetries ?? 3
    };
    await this._save(tx);
    this.logger.info(`Provision transaction started: ${tx.id}`, {
      source: "provision",
      workspaceId: tx.workspaceId,
      blueprintId: tx.blueprintId
    });
    return tx;
  }
  /**
   * Update the transaction status.
   */
  async updateStatus(txId, status) {
    const tx = await this._loadOrThrow(txId);
    tx.status = status;
    if (status === "completed" || status === "failed" || status === "rolled_back") {
      tx.completedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    await this._save(tx);
    return tx;
  }
  /**
   * Record a step result and advance to the next step.
   */
  async recordStep(txId, step, result) {
    const tx = await this._loadOrThrow(txId);
    const stepResult = {
      step,
      ...result,
      startedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const existingIndex = tx.steps.findIndex((s) => s.step === step);
    if (existingIndex >= 0) {
      tx.steps[existingIndex] = stepResult;
    } else {
      tx.steps.push(stepResult);
    }
    const currentPipelineIndex = PROVISION_PIPELINE.indexOf(step);
    tx.currentStepIndex = Math.min(currentPipelineIndex + 1, PROVISION_PIPELINE.length);
    await this._save(tx);
    return tx;
  }
  /**
   * Get a transaction by ID.
   */
  async get(txId) {
    try {
      return await this._loadOrThrow(txId);
    } catch (err) {
      this.logger.warn(`Provision transaction not found: ${txId}`, {
        source: "provision-transaction",
        txId,
        cause: err instanceof Error ? err.message : String(err)
      });
      return null;
    }
  }
  /**
   * Get all transactions for a workspace.
   */
  async getByWorkspace(workspaceId) {
    try {
      const { data } = await this.db.from("site_content").select("value").like("key", `${TX_KEY_PREFIX}%`);
      if (!data) return [];
      return data.map((row) => {
        const result = provisionTransactionSchema.safeParse(row.value);
        return result.success && result.data.workspaceId === workspaceId ? result.data : null;
      }).filter(Boolean);
    } catch (err) {
      this.logger.warn(`Failed to fetch transactions for workspace ${workspaceId}`, {
        source: "provision-transaction",
        workspaceId,
        cause: err instanceof Error ? err.message : String(err)
      });
      return [];
    }
  }
  /**
   * Get the next step in the pipeline.
   * Returns null if the pipeline is complete.
   */
  getNextStep(tx) {
    if (tx.currentStepIndex >= PROVISION_PIPELINE.length) {
      return null;
    }
    return PROVISION_PIPELINE[tx.currentStepIndex];
  }
  /**
   * Calculate the total duration of a transaction.
   */
  getDuration(tx) {
    const start = new Date(tx.startedAt).getTime();
    const end = tx.completedAt ? new Date(tx.completedAt).getTime() : Date.now();
    return end - start;
  }
  // ─── Private helpers ─────────────────────────────────────────────────────
  async _save(tx) {
    this.validateOrThrow(
      provisionTransactionSchema,
      tx,
      "provision.transaction.save"
    );
    const key = transactionKey(tx.id);
    const { error } = await this.db.from("site_content").upsert({
      key,
      value: tx,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error) throw this.normalizeError("site_content", "provision.saveTransaction", error, { txId: tx.id });
  }
  async _loadOrThrow(txId) {
    const key = transactionKey(txId);
    const { data, error } = await this.db.from("site_content").select("value").eq("key", key).maybeSingle();
    if (error) throw this.normalizeError("site_content", "provision.loadTransaction", error, { txId });
    if (!data) {
      throw new Error(`Provision transaction not found: ${txId}`);
    }
    const result = provisionTransactionSchema.safeParse(data.value);
    if (!result.success) {
      throw new Error(`Invalid provision transaction data: ${txId}`);
    }
    return result.data;
  }
};

// src/lib/core/provision/validator.ts
var ProvisionValidator = class extends BaseRepository {
  blueprintLoader;
  workspaceRepository;
  constructor(deps) {
    super(deps);
    this.blueprintLoader = deps.blueprintLoader;
    this.workspaceRepository = deps.workspaceRepository;
  }
  /**
   * Validate a provision request.
   * Comprehensive validation covering:
   * 1. Input structure validity
   * 2. Blueprint existence
   * 3. Blueprint data integrity (schemas, duplicates, dependencies)
   * 4. Owner user validity
   * 5. Workspace limits
   * 6. Plan compatibility
   * 7. Version compatibility
   */
  async validate(input) {
    const warnings = [];
    const parsed = provisionRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        valid: false,
        error: `Invalid request: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
        warnings
      };
    }
    const data = parsed.data;
    const blueprint = await this.blueprintLoader.load(data.blueprintSlug, data.blueprintVersion);
    if (!blueprint) {
      const versionStr = data.blueprintVersion ?? "latest";
      return {
        valid: false,
        error: `Blueprint not found: ${data.blueprintSlug}@${versionStr}`,
        warnings
      };
    }
    const dataValidation = this._validateBlueprintData(blueprint);
    if (!dataValidation.valid) {
      const errorIssues = dataValidation.issues.filter((i) => i.level === "error").map((i) => i.message);
      const warningIssues = dataValidation.issues.filter((i) => i.level === "warning").map((i) => i.message);
      if (errorIssues.length > 0) {
        return {
          valid: false,
          error: `Blueprint data validation failed: ${errorIssues.join("; ")}`,
          warnings: [...warnings, ...warningIssues]
        };
      }
      warnings.push(...warningIssues);
    }
    if (!blueprint.metadata.isPublished) {
      warnings.push(`Blueprint "${blueprint.name}" is not published \u2014 provisioning with unpublished blueprint`);
    }
    try {
      if (data.ownerUserId) {
        const userWorkspaces = await this.workspaceRepository.findByUserId(data.ownerUserId);
        if (userWorkspaces.length > 0) {
          warnings.push(`User already has ${userWorkspaces.length} workspace(s) \u2014 creating another`);
        }
      }
    } catch {
      warnings.push("Could not verify owner user \u2014 proceeding with provision");
    }
    const blueprintPlanTiers = ["free", "starter", "pro", "enterprise"];
    const requestedTier = blueprintPlanTiers.indexOf(data.plan ?? "free");
    if (requestedTier < 0) {
      warnings.push(`Unknown plan: ${data.plan} \u2014 using free plan`);
    }
    if (blueprint.metadata.updatedAt) {
      const versionAge = Date.now() - new Date(blueprint.metadata.updatedAt).getTime();
      const maxAge = 30 * 24 * 60 * 60 * 1e3;
      if (versionAge > maxAge) {
        warnings.push(
          `Blueprint "${blueprint.name}" v${blueprint.version} has not been updated in over 30 days \u2014 consider checking for a newer version`
        );
      }
    }
    return {
      valid: true,
      warnings,
      resolved: {
        blueprintId: blueprint.id,
        blueprintSlug: blueprint.slug,
        blueprintVersion: blueprint.version,
        blueprintName: blueprint.name
      }
    };
  }
  // ─── Blueprint data validation ──────────────────────────────────────────
  /**
   * Validate the internal consistency of a blueprint data definition.
   * Checks for:
   * - Schema validity (all required fields present)
   * - Duplicate IDs, keys, and block keys
   * - Dependency graph (all referenced blocks exist)
   * - Theme compatibility (preset is valid)
   */
  _validateBlueprintData(blueprint) {
    const issues = [];
    const schemaResult = blueprintSchema.safeParse(blueprint);
    if (!schemaResult.success) {
      for (const issue of schemaResult.error.issues) {
        issues.push({
          level: "error",
          category: "schema",
          message: `${issue.path.join(".")}: ${issue.message}`,
          field: issue.path.join(".")
        });
      }
    }
    const pageKeys = /* @__PURE__ */ new Set();
    for (const page of blueprint.pages) {
      if (pageKeys.has(page.key)) {
        issues.push({
          level: "error",
          category: "duplicate",
          message: `Duplicate page key: "${page.key}"`,
          field: `pages[${page.key}]`
        });
      }
      pageKeys.add(page.key);
    }
    const blockKeys = /* @__PURE__ */ new Set();
    for (const block of blueprint.blocks) {
      if (blockKeys.has(block.key)) {
        issues.push({
          level: "error",
          category: "duplicate",
          message: `Duplicate block key: "${block.key}"`,
          field: `blocks[${block.key}]`
        });
      }
      blockKeys.add(block.key);
    }
    const allBlockKeys = new Set(blueprint.blocks.map((b) => b.key));
    for (const page of blueprint.pages) {
      for (const blockKey of page.blockKeys) {
        if (!allBlockKeys.has(blockKey)) {
          issues.push({
            level: "error",
            category: "dependency",
            message: `Page "${page.key}" references unknown block key: "${blockKey}"`,
            field: `pages[${page.key}].blockKeys`
          });
        }
      }
    }
    const referencedKeys = /* @__PURE__ */ new Set();
    for (const page of blueprint.pages) {
      for (const key of page.blockKeys) {
        referencedKeys.add(key);
      }
    }
    for (const block of blueprint.blocks) {
      if (!referencedKeys.has(block.key)) {
        issues.push({
          level: "warning",
          category: "dependency",
          message: `Block "${block.key}" is not referenced by any page \u2014 may be unused`,
          field: `blocks[${block.key}]`
        });
      }
    }
    if (!blueprint.theme.presetId || blueprint.theme.presetId.trim() === "") {
      issues.push({
        level: "warning",
        category: "theme",
        message: "No theme preset specified \u2014 will use default theme",
        field: "theme.presetId"
      });
    }
    for (let i = 0; i < blueprint.navigation.length; i++) {
      const nav = blueprint.navigation[i];
      if (!nav.title || !nav.path) {
        issues.push({
          level: "error",
          category: "schema",
          message: `Navigation item at index ${i} is missing title or path`,
          field: `navigation[${i}]`
        });
      }
    }
    const pagePaths = /* @__PURE__ */ new Set();
    for (const page of blueprint.pages) {
      if (pagePaths.has(page.path)) {
        issues.push({
          level: "error",
          category: "duplicate",
          message: `Duplicate page path: "${page.path}" (pages "${page.key}" and others)`,
          field: `pages[${page.key}].path`
        });
      }
      pagePaths.add(page.path);
    }
    if (!blueprint.seo.title || !blueprint.seo.description) {
      issues.push({
        level: "warning",
        category: "schema",
        message: "SEO title or description is missing \u2014 search engines may not display results correctly",
        field: "seo"
      });
    }
    return {
      valid: issues.filter((i) => i.level === "error").length === 0,
      issues
    };
  }
  /**
   * Quick validation — just checks if the request structure is valid.
   * Useful for real-time UI validation before submitting.
   */
  validateRequest(input) {
    const parsed = provisionRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        valid: false,
        error: parsed.error.issues.map((i) => i.message).join("; ")
      };
    }
    return { valid: true };
  }
};

// src/lib/core/provision/report.ts
var ProvisionReportGenerator = class {
  /**
   * Generate a complete provision report from a transaction and blueprint.
   * Accepts an optional ProvisionSession for expanded metrics.
   */
  generate(transaction, blueprint, workspaceInfo, session) {
    const completedAt = transaction.completedAt ?? (/* @__PURE__ */ new Date()).toISOString();
    const startTime = new Date(transaction.startedAt).getTime();
    const endTime = new Date(completedAt).getTime();
    const durationMs = endTime - startTime;
    const sessionData = session ? this._extractSessionData(session, transaction) : null;
    const blueprintStep = this._findStep(transaction.steps, "install_blueprint");
    const themeStep = this._findStep(transaction.steps, "insert_theme");
    const errors = transaction.steps.filter((s) => !s.success && s.error).map((s) => ({
      step: s.step,
      message: s.error,
      retried: s.output?.retryCount != null && s.output?.retryCount > 0,
      recovered: sessionData?.retryStats?.totalRetries != null && sessionData.retryStats.totalRetries > 0
    }));
    const warnings = [];
    if (sessionData?.sessionWarnings) {
      warnings.push(...sessionData.sessionWarnings);
    }
    const stepTimings = sessionData?.stepTimings ?? transaction.steps.map((s) => ({
      step: s.step,
      label: PROVISION_STEP_LABELS[s.step] ?? s.step,
      durationMs: s.durationMs ?? 0,
      success: s.success,
      retryCount: 0,
      output: s.output
    }));
    return {
      transactionId: transaction.id,
      success: transaction.status === "completed",
      startedAt: transaction.startedAt,
      completedAt,
      durationMs,
      workspace: workspaceInfo,
      blueprint: {
        id: blueprint.id,
        slug: blueprint.slug,
        version: blueprint.version,
        name: blueprint.name,
        category: blueprint.category
      },
      theme: {
        presetId: blueprint.theme.presetId,
        applied: themeStep?.success ?? false
      },
      pages: {
        total: blueprint.pages.length,
        created: blueprintStep?.output?.pageBlocks ?? blueprint.pages.length
      },
      blocks: {
        total: blueprint.blocks.length,
        inserted: blueprintStep?.output?.pageBlocks ?? blueprint.blocks.length
      },
      navigation: {
        total: blueprint.navigation.length,
        created: blueprintStep?.output?.navigation ?? (blueprint.navigation.length > 0 ? 1 : 0)
      },
      errors,
      warnings,
      stepTimings
    };
  }
  /**
   * Format a report as a human-readable string (for logging or display).
   * Includes all available metrics including session data and rollback info.
   */
  format(report) {
    const lines = [];
    const divider = "\u2550".repeat(60);
    const subDivider = "\u2500".repeat(60);
    lines.push(divider);
    lines.push(`  PROVISION REPORT`);
    lines.push(divider);
    lines.push(`  Status:       ${report.success ? "\u2713 SUCCESS" : "\u2717 FAILED"}`);
    lines.push(`  Duration:     ${this._formatDuration(report.durationMs)}`);
    lines.push("");
    lines.push(`  Workspace:`);
    lines.push(`    ID:     ${report.workspace.id}`);
    lines.push(`    Name:   ${report.workspace.name}`);
    lines.push(`    Status: ${report.workspace.status}`);
    lines.push(`    Plan:   ${report.workspace.plan}`);
    lines.push("");
    lines.push(`  Blueprint:`);
    lines.push(`    Name:    ${report.blueprint.name}`);
    lines.push(`    Slug:    ${report.blueprint.slug}`);
    lines.push(`    Version: ${report.blueprint.version}`);
    lines.push(`    Category: ${report.blueprint.category}`);
    lines.push("");
    lines.push(`  Theme:      ${report.theme.presetId} (${report.theme.applied ? "applied" : "not applied"})`);
    lines.push(`  Pages:      ${report.pages.created}/${report.pages.total}`);
    lines.push(`  Blocks:     ${report.blocks.inserted}/${report.blocks.total}`);
    lines.push(`  Navigation: ${report.navigation.created}/${report.navigation.total}`);
    const reportAny = report;
    const rollbackInfo = reportAny.rollbackInfo;
    if (rollbackInfo?.attempted) {
      lines.push("");
      lines.push(`  Rollback:`);
      lines.push(`    Attempted: ${rollbackInfo.attempted}`);
      lines.push(`    Success:   ${rollbackInfo.success ? "\u2713" : "\u2717"}`);
      if (rollbackInfo.durationMs != null) {
        lines.push(`    Duration:  ${this._formatDuration(rollbackInfo.durationMs)}`);
      }
      if (rollbackInfo.error) {
        lines.push(`    Error:     ${rollbackInfo.error}`);
      }
    }
    const resourceCounts = reportAny.resourceCounts;
    if (resourceCounts) {
      lines.push("");
      lines.push(`  Resources Created:`);
      lines.push(`    Page Blocks:     ${resourceCounts.pageBlocks ?? 0}`);
      lines.push(`    Menu Items:      ${resourceCounts.menuItems ?? 0}`);
      lines.push(`    Gallery Images:  ${resourceCounts.galleryImages ?? 0}`);
      lines.push(`    Personality:     ${resourceCounts.personalityKeys ?? 0}`);
      lines.push(`    Site Content:    ${resourceCounts.siteContentKeys ?? 0}`);
      lines.push(`    Media Files:     ${resourceCounts.mediaFileIds ?? 0}`);
    }
    lines.push("");
    if (report.errors.length > 0) {
      lines.push(`  Errors (${report.errors.length}):`);
      for (const err of report.errors) {
        lines.push(`    \u2717 [${err.step}] ${err.message}`);
        if (err.retried) lines.push(`      (retried, recovered: ${err.recovered})`);
      }
      lines.push("");
    }
    if (report.warnings.length > 0) {
      lines.push(`  Warnings (${report.warnings.length}):`);
      for (const w of report.warnings) {
        lines.push(`    ! [${w.step}] ${w.message}`);
      }
      lines.push("");
    }
    lines.push(subDivider);
    lines.push(`  Step Timings:`);
    lines.push(subDivider);
    for (const st of report.stepTimings) {
      const icon = st.success ? "\u2713" : "\u2717";
      lines.push(`    ${icon} ${st.label.padEnd(25)} ${this._formatDuration(st.durationMs)}`);
    }
    lines.push(subDivider);
    const successCount = report.stepTimings.filter((s) => s.success).length;
    const totalCount = report.stepTimings.length;
    lines.push(`  Total: ${successCount}/${totalCount} steps passed`);
    lines.push(divider);
    return lines.join("\n");
  }
  /**
   * Extract enhanced session data from a ProvisionSession.
   */
  _extractSessionData(session, transaction) {
    const rollbackInfo = session.rollback ? {
      attempted: session.rollback.attempted,
      success: session.rollback.success,
      durationMs: session.rollback.durationMs,
      error: session.rollback.error
    } : void 0;
    const retriedSteps = session.stepMetrics.filter((m) => m.retryCount > 0);
    const retryStats = {
      totalRetries: retriedSteps.reduce((sum, m) => sum + m.retryCount, 0),
      stepsRetried: retriedSteps.map((m) => m.step)
    };
    const rm = session.resourceMap;
    const resourceCounts = {
      pageBlocks: rm.pageBlockIds.length,
      menuItems: rm.menuItemIds.length,
      galleryImages: rm.galleryImageIds.length,
      personalityKeys: rm.personalityKeys.length,
      siteContentKeys: rm.siteContentKeys.length,
      mediaFileIds: rm.mediaFileIds.length
    };
    const sessionWarnings = session.warnings.map((w) => ({
      step: w.step,
      message: w.message
    }));
    const stepTimings = session.stepMetrics.map((m) => ({
      step: m.step,
      label: PROVISION_STEP_LABELS[m.step] ?? m.step,
      durationMs: m.durationMs,
      success: m.success,
      retryCount: m.retryCount,
      output: m.output
    }));
    return {
      rollbackInfo,
      retryStats,
      resourceCounts,
      sessionWarnings,
      stepTimings
    };
  }
  _findStep(steps, stepName) {
    return steps.find((s) => s.step === stepName);
  }
  _formatDuration(ms) {
    if (ms < 1e3) return `${ms}ms`;
    if (ms < 6e4) return `${(ms / 1e3).toFixed(1)}s`;
    const minutes = Math.floor(ms / 6e4);
    const seconds = Math.round(ms % 6e4 / 1e3);
    return `${minutes}m ${seconds}s`;
  }
};

// src/lib/core/provision/service.ts
var ProvisionService = class {
  engine;
  registry;
  loader;
  versioning;
  transactionManager;
  constructor(deps) {
    this.registry = new BlueprintRegistry(deps.repositoryDependencies);
    this.loader = new BlueprintLoader({ registry: this.registry });
    this.versioning = new BlueprintVersioning({ registry: this.registry });
    this.transactionManager = new ProvisionTransactionManager(deps.repositoryDependencies);
    const repos = createRepositories(deps.repositoryDependencies);
    const stepRegistry = createStepRegistry();
    const validator = new ProvisionValidator({
      ...deps.repositoryDependencies,
      blueprintLoader: this.loader,
      workspaceRepository: deps.workspaceRepository
    });
    const reportGenerator = new ProvisionReportGenerator();
    this.engine = new ProvisionEngine({
      loader: this.loader,
      transactionManager: this.transactionManager,
      validator,
      reportGenerator,
      workspaceRepository: deps.workspaceRepository,
      repos,
      stepRegistry,
      logger: deps.repositoryDependencies.logger ?? getLogger()
    });
  }
  // ─── Provisioning ──────────────────────────────────────────────────────
  /**
   * Start the provisioning pipeline for a new website.
   * One Request → One Ready Website.
   */
  async provision(input) {
    return this.engine.provision(input);
  }
  // ─── Blueprint Management ──────────────────────────────────────────────
  /**
   * Register a new blueprint in the registry.
   * Blueprints are DATA — they define everything about a website.
   */
  async registerBlueprint(blueprint) {
    return this.registry.register(blueprint);
  }
  /**
   * Get a blueprint by slug and version.
   */
  async getBlueprint(slug, version) {
    return this.loader.load(slug, version);
  }
  /**
   * List all available blueprint slugs (latest versions).
   */
  async listBlueprints() {
    return this.registry.listBlueprints();
  }
  /**
   * List all versions of a specific blueprint.
   */
  async listBlueprintVersions(slug) {
    return this.registry.listVersions(slug);
  }
  /**
   * Calculate the next version for a blueprint slug.
   */
  async nextBlueprintVersion(slug, bump = "patch") {
    return this.versioning.nextVersion(slug, bump);
  }
  /**
   * Delete a blueprint version from the registry.
   */
  async deleteBlueprint(slug, version) {
    return this.registry.delete(slug, version);
  }
  // ─── Transaction Management ────────────────────────────────────────────
  /**
   * Get a provision transaction by ID.
   */
  async getTransaction(txId) {
    return this.transactionManager.get(txId);
  }
  /**
   * Get all provision transactions for a workspace.
   */
  async getTransactionsByWorkspace(workspaceId) {
    return this.transactionManager.getByWorkspace(workspaceId);
  }
};

// _reprovision_workspaces.ts
var fullDomain = (slug) => `${slug}.${PLATFORM_DOMAIN}`;
var DRY_RUN = process.env.DRY_RUN === "1";
var OLD_SLUGS = [
  "khane",
  "e2e-provision-01",
  "e2e-provision-02",
  "test-cafe-001",
  "cafeteria-mrfsnhoe"
];
var FLIP_SLUGS = ["yek", "test2"];
async function main() {
  const logger = getLogger();
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Load them first (e.g. `node --env-file=.env`)."
    );
  }
  if (DRY_RUN) console.log("[DRY_RUN] No writes will be performed.\n");
  const repoDeps = { ...createSupabaseAdminProviders(), logger };
  const db = repoDeps.database;
  const workspaceRepository = new WorkspaceRepository(repoDeps);
  const provisionService = new ProvisionService({
    repositoryDependencies: repoDeps,
    workspaceRepository
  });
  const blueprint = await provisionService.getBlueprint("cafeteria");
  if (!blueprint) {
    throw new Error("cafeteria blueprint not found \u2014 cannot re-provision");
  }
  console.log(`Blueprint loaded: ${blueprint.slug} v${blueprint.version}`);
  for (const slug of OLD_SLUGS) {
    const domain = fullDomain(slug);
    console.log(`
=== Re-provisioning ${slug} (${domain}) ===`);
    const { data: existing, error: findErr } = await db.from("workspaces").select("id, status").eq("domain", domain).maybeSingle();
    if (findErr) throw new Error(`lookup failed for ${slug}: ${String(findErr)}`);
    if (existing) {
      if (DRY_RUN) {
        console.log(`  [DRY_RUN] would DELETE workspace ${existing.id} (status ${existing.status}) + its provision_transactions`);
      } else {
        console.log(`  deleting old workspace ${existing.id} (status ${existing.status})`);
        const { error: txErr } = await db.from("provision_transactions").delete().eq("workspace_id", existing.id);
        if (txErr) throw new Error(`delete transactions failed for ${slug}: ${String(txErr)}`);
        const { error: wsErr } = await db.from("workspaces").delete().eq("id", existing.id);
        if (wsErr) throw new Error(`delete workspace failed for ${slug}: ${String(wsErr)}`);
      }
    } else {
      console.log("  no existing workspace row \u2014 provisioning fresh");
    }
    if (DRY_RUN) {
      console.log("  [DRY_RUN] would provision a fresh isolated workspace");
      continue;
    }
    const input = {
      blueprintSlug: "cafeteria",
      requestedSlug: slug,
      externalOrderId: randomUUID(),
      businessName: slug,
      customerEmail: `${slug}@nama.app`,
      workspaceName: slug,
      domain,
      metadata: {}
    };
    const report = await provisionService.provision(input);
    if (report.success) {
      console.log(`  OK \u2192 workspace ${report.workspace.id} (status ${report.workspace.status})`);
    } else {
      const msg = report.errors?.map((e) => e.message).join("; ") || "unknown error";
      console.error(`  FAILED: ${msg}`);
    }
  }
  for (const slug of FLIP_SLUGS) {
    const domain = fullDomain(slug);
    const { data: ws, error } = await db.from("workspaces").select("id, status").eq("domain", domain).maybeSingle();
    if (error) throw new Error(`lookup failed for ${slug}: ${String(error)}`);
    if (!ws) {
      console.log(`
${slug}: not found, skipping`);
      continue;
    }
    console.log(`
=== Flipping ${slug} (${ws.id}) ${ws.status} \u2192 active ===`);
    if (DRY_RUN) {
      console.log("  [DRY_RUN] would set workspaces.status=active and provision_transactions.status=completed");
      continue;
    }
    const { error: wsErr } = await db.from("workspaces").update({ status: "active" }).eq("id", ws.id);
    if (wsErr) throw new Error(`update workspace failed for ${slug}: ${String(wsErr)}`);
    const { error: txErr } = await db.from("provision_transactions").update({ status: "completed", completed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("workspace_id", ws.id);
    if (txErr) throw new Error(`update transaction failed for ${slug}: ${String(txErr)}`);
    console.log("  done");
  }
  console.log("\nRe-provision complete.");
}
main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
