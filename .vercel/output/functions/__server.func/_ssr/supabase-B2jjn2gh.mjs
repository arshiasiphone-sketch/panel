import { r as __exportAll$1 } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-DYndNgbq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rolldown-runtime-D7D4PA-g.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-B2jjn2gh.js
var supabase_B2jjn2gh_exports = /* @__PURE__ */ __exportAll$1({
	n: () => supabase_exports,
	r: () => client_server_exports,
	t: () => getSupabaseProviders
});
var client_server_exports = /* @__PURE__ */ __exportAll({ supabaseAdmin: () => supabaseAdmin });
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createSupabaseAdminClient() {
	const SUPABASE_URL = process.env.SUPABASE_URL;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY) },
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var _supabaseAdmin;
var supabaseAdmin = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
	return Reflect.get(_supabaseAdmin, prop, receiver);
} });
/**
* Creates a database provider backed by Supabase.
* This is the ONLY file that should import/create Supabase clients for DB operations.
*/
function createSupabaseDatabaseProvider(supabase) {
	return {
		from(table) {
			return new SupabaseTableQuery(supabase.from(table));
		},
		async rpc(fn, params) {
			return supabase.rpc(fn, params);
		},
		removeChannel(channel) {
			return supabase.removeChannel(channel);
		}
	};
}
/**
* Internal query builder that wraps a Supabase PostgREST query.
* Implements the fluent chain + thenable pattern.
*
* Modifier calls (.order, .limit, .eq, etc.) are queued and applied
* at execution time, AFTER the initial .select() / .insert() / etc. call,
* since those methods only exist on PostgrestFilterBuilder (the return
* value of .select()), not on PostgrestQueryBuilder (supabase.from()).
*/
var SupabaseTableQuery = class {
	_builder;
	_mode = "select";
	_modeArgs = [];
	_modifiers = [];
	constructor(builder) {
		this._builder = builder;
	}
	select(columns, opts) {
		this._mode = "select";
		if (opts) this._modeArgs = [columns || "*", opts];
		else if (typeof columns === "object" && columns !== null && "count" in columns) this._modeArgs = ["*", columns];
		else this._modeArgs = [columns || "*"];
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
	eq(column, value) {
		this._modifiers.push({
			method: "eq",
			args: [column, value]
		});
		return this;
	}
	like(column, pattern) {
		this._modifiers.push({
			method: "like",
			args: [column, pattern]
		});
		return this;
	}
	in(column, values) {
		this._modifiers.push({
			method: "in",
			args: [column, values]
		});
		return this;
	}
	neq(column, value) {
		this._modifiers.push({
			method: "neq",
			args: [column, value]
		});
		return this;
	}
	gt(column, value) {
		this._modifiers.push({
			method: "gt",
			args: [column, value]
		});
		return this;
	}
	gte(column, value) {
		this._modifiers.push({
			method: "gte",
			args: [column, value]
		});
		return this;
	}
	lt(column, value) {
		this._modifiers.push({
			method: "lt",
			args: [column, value]
		});
		return this;
	}
	lte(column, value) {
		this._modifiers.push({
			method: "lte",
			args: [column, value]
		});
		return this;
	}
	order(column, opts) {
		const ascending = opts?.ascending ?? true;
		this._modifiers.push({
			method: "order",
			args: [column, { ascending }]
		});
		return this;
	}
	limit(count) {
		this._modifiers.push({
			method: "limit",
			args: [count]
		});
		return this;
	}
	async maybeSingle() {
		const result = await this._execute();
		if (result.error) return {
			data: null,
			error: result.error
		};
		return {
			data: result.data?.[0] ?? null,
			error: null
		};
	}
	async single() {
		this._modifiers.push({
			method: "single",
			args: []
		});
		return await this._execute();
	}
	then(onfulfilled, onrejected) {
		return this._execute().then(onfulfilled, onrejected);
	}
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
			if (op.method === "single") continue;
			const fn = current[op.method];
			if (typeof fn !== "function") continue;
			current = fn.call(current, ...op.args);
		}
		return current;
	}
	async _execute() {
		switch (this._mode) {
			case "select": {
				let query = this._builder.select(...this._modeArgs);
				query = this._applyModifiers(query);
				return await query;
			}
			case "insert": {
				let query = this._builder.insert(...this._modeArgs);
				query = this._applyModifiers(query);
				return await query;
			}
			case "upsert": {
				let query = this._builder.upsert(...this._modeArgs);
				query = this._applyModifiers(query);
				return await query;
			}
			case "update": {
				let query = this._builder.update(...this._modeArgs);
				query = this._applyModifiers(query);
				return await query;
			}
			case "delete": {
				let query = this._builder.delete(...this._modeArgs);
				query = this._applyModifiers(query);
				return await query;
			}
			default: return {
				data: null,
				error: /* @__PURE__ */ new Error(`Unknown query mode: ${this._mode}`)
			};
		}
	}
};
/**
* Creates a storage provider backed by Supabase Storage.
*/
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
/**
* Creates an auth provider backed by Supabase Auth.
*/
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
			return await supabase.auth.getSession();
		},
		onAuthStateChange(callback) {
			return supabase.auth.onAuthStateChange(callback);
		},
		async getClaims(token) {
			return supabase.auth.getClaims(token);
		}
	};
}
/**
* Creates a realtime provider backed by Supabase Realtime.
*/
function createSupabaseRealtimeProvider(supabase) {
	return {
		channel(name) {
			return new SupabaseChannelAdapter(supabase.channel(name));
		},
		async removeChannel(channel) {
			await supabase.removeChannel(channel);
		},
		getChannels() {
			return supabase.getChannels();
		}
	};
}
/**
* Internal adapter wrapping a Supabase RealtimeChannel.
* Implements the IChannel interface.
*/
var SupabaseChannelAdapter = class {
	_channel;
	constructor(channel) {
		this._channel = channel;
	}
	on(type, filter, callback) {
		this._channel = this._channel.on(type, filter, callback);
		return this;
	}
	subscribe(callback) {
		this._channel.subscribe(callback);
		return this;
	}
};
/**
* Supabase provider implementations.
* This is the ONLY layer that imports @supabase/supabase-js directly.
* Application code should use repositories, not providers directly.
*/
var supabase_exports = /* @__PURE__ */ __exportAll({
	createSupabaseAdminProviders: () => createSupabaseAdminProviders,
	createSupabaseProviders: () => createSupabaseProviders,
	getSupabaseProviders: () => getSupabaseProviders
});
/**
* Create all Supabase providers using the client-side supabase client.
*/
function createSupabaseProviders() {
	return {
		database: createSupabaseDatabaseProvider(supabase),
		storage: createSupabaseStorageProvider(supabase),
		auth: createSupabaseAuthProvider(supabase),
		realtime: createSupabaseRealtimeProvider(supabase)
	};
}
/**
* Create all Supabase providers using the admin (server-side) client.
* Bypasses RLS — use only in trusted server contexts.
*/
function createSupabaseAdminProviders() {
	return {
		database: createSupabaseDatabaseProvider(supabaseAdmin),
		storage: createSupabaseStorageProvider(supabaseAdmin),
		auth: createSupabaseAuthProvider(supabaseAdmin),
		realtime: createSupabaseRealtimeProvider(supabaseAdmin)
	};
}
var _providers = null;
function getSupabaseProviders() {
	if (!_providers) _providers = createSupabaseProviders();
	return _providers;
}
//#endregion
export { supabase_B2jjn2gh_exports as n, __exportAll as r, getSupabaseProviders as t };
