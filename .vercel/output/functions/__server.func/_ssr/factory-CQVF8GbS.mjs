import { r as __exportAll } from "../_runtime.mjs";
import { r as __exportAll$1 } from "./supabase-B2jjn2gh.mjs";
import { i as enumType, l as stringType, n as arrayType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { _ as testConfigSchema, a as StorageError, c as eventSchema, f as mediaFileSchema, g as siteContentValueSchema, h as personalityProfileUpdateSchema, l as galleryImageSchema, m as pageViewSchema, n as AuthError, o as ThemeRepository, p as menuItemSchema, r as BaseRepository, s as blockSchema, v as testResponseSchema, y as testimonialSchema } from "./theme-HySvB7Iw.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/factory-CQVF8GbS.js
var factory_CQVF8GbS_exports = /* @__PURE__ */ __exportAll({
	a: () => WorkspaceRepository,
	c: () => cn,
	i: () => initRepositories,
	l: () => createId,
	n: () => factory_exports,
	o: () => PLATFORM_DOMAIN,
	r: () => getRepositories,
	s: () => createWorkspace,
	t: () => createRepositories,
	u: () => workspacePlanSchema
});
/**
* Menu repository — encapsulates menu_items table operations.
*/
var SELECT_COLUMNS$7 = "id,category,name,description,price,image_url,sort_order,visible,created_at,updated_at";
var VISIBLE_COLUMNS$3 = "id,category,name,description,price,image_url,sort_order,visible";
var MenuRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async getAll(opts) {
		try {
			let query = this.withWorkspace(this.db.from("menu_items").select(SELECT_COLUMNS$7).order("sort_order"));
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
			let query = this.withWorkspace(this.db.from("menu_items").select(VISIBLE_COLUMNS$3).eq("visible", true).order("sort_order"));
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
			if (resourceMap) resourceMap.menuItemIds.push(id);
		}
		return ids;
	}
	async upsert(row) {
		try {
			const validated = this.validateOrThrow(menuItemSchema, row, "menu_items");
			const upsertData = this.workspaceId ? {
				...validated,
				workspace_id: this.workspaceId
			} : validated;
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
			const { error } = await this.withWorkspace(this.db.from("menu_items").delete().in("id", ids));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("menu_items", "batchDelete", err, { count: ids.length });
		}
	}
	async delete(id) {
		try {
			const { error } = await this.withWorkspace(this.db.from("menu_items").delete().eq("id", id));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("menu_items", "delete", err, { id });
		}
	}
};
/**
* Gallery repository — encapsulates gallery_images table operations.
*/
var SELECT_COLUMNS$6 = "id,title,image_url,tags,sort_order,visible,created_at,updated_at";
var VISIBLE_COLUMNS$2 = "id,title,image_url,tags,sort_order,visible";
var GalleryRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async getAll(opts) {
		try {
			let query = this.withWorkspace(this.db.from("gallery_images").select(SELECT_COLUMNS$6).order("sort_order"));
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
			let query = this.withWorkspace(this.db.from("gallery_images").select(VISIBLE_COLUMNS$2).eq("visible", true).order("sort_order"));
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
			if (resourceMap) resourceMap.galleryImageIds.push(id);
		}
		return ids;
	}
	async upsert(row) {
		try {
			const validated = this.validateOrThrow(galleryImageSchema, row, "gallery_images");
			const upsertData = this.workspaceId ? {
				...validated,
				workspace_id: this.workspaceId
			} : validated;
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
			const { error } = await this.withWorkspace(this.db.from("gallery_images").delete().in("id", ids));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("gallery_images", "batchDelete", err, { count: ids.length });
		}
	}
	async delete(id) {
		try {
			const { error } = await this.withWorkspace(this.db.from("gallery_images").delete().eq("id", id));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("gallery_images", "delete", err, { id });
		}
	}
};
/**
* Events repository — encapsulates events table operations.
*/
var SELECT_COLUMNS$5 = "id,title,description,date_label,image_url,sort_order,visible,created_at,updated_at";
var VISIBLE_COLUMNS$1 = "id,title,description,date_label,image_url,sort_order,visible";
var EventsRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async getAll(opts) {
		try {
			let query = this.withWorkspace(this.db.from("events").select(SELECT_COLUMNS$5).order("sort_order"));
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
			let query = this.withWorkspace(this.db.from("events").select(VISIBLE_COLUMNS$1).eq("visible", true).order("sort_order"));
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
			const upsertData = this.workspaceId ? {
				...validated,
				workspace_id: this.workspaceId
			} : validated;
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
			const { error } = await this.withWorkspace(this.db.from("events").delete().in("id", ids));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("events", "batchDelete", err, { count: ids.length });
		}
	}
	async delete(id) {
		try {
			const { error } = await this.withWorkspace(this.db.from("events").delete().eq("id", id));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("events", "delete", err, { id });
		}
	}
};
/**
* Testimonials repository — encapsulates testimonials table operations.
*/
var SELECT_COLUMNS$4 = "id,name,type,text,sort_order,visible,created_at,updated_at";
var VISIBLE_COLUMNS = "id,name,type,text,sort_order,visible";
var TestimonialsRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async getAll(opts) {
		try {
			let query = this.withWorkspace(this.db.from("testimonials").select(SELECT_COLUMNS$4).order("sort_order"));
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
			let query = this.withWorkspace(this.db.from("testimonials").select(VISIBLE_COLUMNS).eq("visible", true).order("sort_order"));
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
			const upsertData = this.workspaceId ? {
				...validated,
				workspace_id: this.workspaceId
			} : validated;
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
			const { error } = await this.withWorkspace(this.db.from("testimonials").delete().in("id", ids));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("testimonials", "batchDelete", err, { count: ids.length });
		}
	}
	async delete(id) {
		try {
			const { error } = await this.withWorkspace(this.db.from("testimonials").delete().eq("id", id));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("testimonials", "delete", err, { id });
		}
	}
};
/**
* NAMA Platform — Shared Hashing and Serialization Utilities.
*
* Provides deterministic, stable hashing and stringification utilities
* used throughout the provisioning system for idempotency and dedup.
*
* ENTERPRISE HARDENING (EPIC 4B.3, Phase 11):
* - Single source of truth for stableStringify (used by both pages.ts and installer.ts)
* - Single source of truth for SHA-256 block key hashing
* - Eliminates duplicated implementation of _stableStringify and _computeBlockKeyHash
* - Uses Web Crypto API for browser/edge/Node compatibility
*/
/**
* Create a stable, sorted string representation of a value.
* Ensures object keys are always in the same order for deterministic hashing.
* Replaces the previous duplicate implementations in pages.ts and installer.ts.
*
* @param value - Any JSON-serializable value
* @returns A deterministic string representation
*/
function stableStringify(value) {
	if (value === null) return "null";
	if (typeof value !== "object") return JSON.stringify(value);
	if (Array.isArray(value)) return "[" + value.map((v) => stableStringify(v)).join(",") + "]";
	const obj = value;
	return "{" + Object.keys(obj).sort().map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") + "}";
}
/**
* Compute a deterministic SHA-256 hash for a block definition.
* Uses Web Crypto API for stable, order-independent identification.
* Works in both browser (Vite) and server (Node 18+) environments.
*
* @param pageKey - The page this block belongs to
* @param type - The block type (e.g., "hero", "features")
* @param data - The block data content
* @returns Hex-encoded SHA-256 hash string
*/
async function computeBlockKeyHash(pageKey, type, data) {
	const stable = stableStringify({
		pageKey,
		type,
		data
	});
	const dataBuffer = new TextEncoder().encode(stable);
	const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
/**
* Pages repository — encapsulates page_blocks table operations.
*/
var SELECT_COLUMNS$3 = "id,type,data,sort_order,visible,created_at,updated_at";
var PagesRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async getAll(opts) {
		try {
			let query = this.withWorkspace(this.db.from("page_blocks").select(SELECT_COLUMNS$3).order("sort_order"));
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
		for (const bd of blocks) blockMap.set(bd.key, bd);
		for (const page of pages) for (const blockKey of page.blockKeys) {
			const blockDef = blockMap.get(blockKey);
			if (!blockDef) continue;
			const blockKeyHash = await computeBlockKeyHash(page.key, blockDef.type, blockDef.data);
			if (await this._blockExistsByKeyHash(blockKeyHash)) continue;
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
			if (resourceMap) resourceMap.pageBlockIds.push(id);
		}
		return { blockIds };
	}
	async create(input) {
		try {
			const validated = this.validateOrThrow(blockSchema, {
				...input,
				visible: true
			}, "page_blocks.create");
			const insertData = this.workspaceId ? {
				...validated,
				workspace_id: this.workspaceId
			} : validated;
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
			const { error } = await this.withWorkspace(this.db.from("page_blocks").delete().in("id", ids));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("page_blocks", "batchDelete", err, { count: ids.length });
		}
	}
	async delete(id) {
		try {
			const { error } = await this.withWorkspace(this.db.from("page_blocks").delete().eq("id", id));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("page_blocks", "delete", err, { id });
		}
	}
	async reorder(orderedIds) {
		try {
			const failed = (await Promise.all(orderedIds.map((id, idx) => this.db.from("page_blocks").update({ sort_order: idx }).eq("id", id)))).find((r) => r.error);
			if (failed?.error) throw failed.error;
		} catch (err) {
			throw this.normalizeError("page_blocks", "reorder", err);
		}
	}
	/**
	* Check if a block with a given hash already exists.
	*/
	/**
	* Check if a block with a given hash already exists.
	*/
	async _blockExistsByKeyHash(blockKeyHash) {
		const { data } = await this.withWorkspace(this.db.from("page_blocks").select("id").eq("data->>block_key_hash", blockKeyHash)).maybeSingle();
		return !!data;
	}
};
/**
* Site content repository — encapsulates site_content table operations.
*/
var SELECT_COLUMNS$2 = "key,value,updated_at";
var SiteContentRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async getAll() {
		try {
			const { data, error } = await this.withWorkspace(this.db.from("site_content").select(SELECT_COLUMNS$2));
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
			const { data, error } = await this.withWorkspace(this.db.from("site_content").select(SELECT_COLUMNS$2).eq("key", key)).maybeSingle();
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
		const { data: existing } = await this.withWorkspace(this.db.from("site_content").select("key").eq("key", navKey)).maybeSingle();
		if (existing) return null;
		const upsertNav = {
			key: navKey,
			value: { items: navigation.sort((a, b) => a.sortOrder - b.sortOrder).map((entry, index) => ({
				id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
				title: entry.title,
				path: entry.path,
				sort_order: index,
				visible: true
			})) },
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (this.workspaceId) upsertNav.workspace_id = this.workspaceId;
		const { error } = await this.db.from("site_content").upsert(upsertNav);
		if (error) throw this.normalizeError("site_content", "installBlueprintNavigation", error);
		if (resourceMap) resourceMap.siteContentKeys.push(navKey);
		return navKey;
	}
	/**
	* Install SEO defaults with workspace-scoped key.
	*/
	async installBlueprintSEO(seo, workspaceId, resourceMap) {
		const seoKey = `seo_defaults:${workspaceId}`;
		const { data: existing } = await this.withWorkspace(this.db.from("site_content").select("key").eq("key", seoKey)).maybeSingle();
		if (existing) return [];
		const upsertSeo = {
			key: seoKey,
			value: {
				title: seo.title,
				description: seo.description,
				ogImage: seo.ogImage ?? ""
			},
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (this.workspaceId) upsertSeo.workspace_id = this.workspaceId;
		const { error } = await this.db.from("site_content").upsert(upsertSeo);
		if (error) throw this.normalizeError("site_content", "installBlueprintSEO", error);
		if (resourceMap) resourceMap.siteContentKeys.push(seoKey);
		return [seoKey];
	}
	/**
	* Install analytics config with workspace-scoped key.
	*/
	async installBlueprintAnalytics(analytics, workspaceId, resourceMap) {
		const analyticsKey = `analytics_config:${workspaceId}`;
		const { data: existing } = await this.withWorkspace(this.db.from("site_content").select("key").eq("key", analyticsKey)).maybeSingle();
		if (existing) return [];
		const upsertAnalytics = {
			key: analyticsKey,
			value: {
				enabled: analytics.enabled,
				provider: analytics.provider ?? "supabase"
			},
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (this.workspaceId) upsertAnalytics.workspace_id = this.workspaceId;
		const { error } = await this.db.from("site_content").upsert(upsertAnalytics);
		if (error) throw this.normalizeError("site_content", "installBlueprintAnalytics", error);
		if (resourceMap) resourceMap.siteContentKeys.push(analyticsKey);
		return [analyticsKey];
	}
	/**
	* Install business settings with workspace-scoped key.
	*/
	async installBlueprintBusinessSettings(settings, workspaceId, resourceMap) {
		if (Object.keys(settings).length === 0) return [];
		const businessKey = `business_settings:${workspaceId}`;
		const { data: existing } = await this.withWorkspace(this.db.from("site_content").select("key").eq("key", businessKey)).maybeSingle();
		if (existing) return [];
		const upsertBusiness = {
			key: businessKey,
			value: settings,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (this.workspaceId) upsertBusiness.workspace_id = this.workspaceId;
		const { error } = await this.db.from("site_content").upsert(upsertBusiness);
		if (error) throw this.normalizeError("site_content", "installBlueprintBusinessSettings", error);
		if (resourceMap) resourceMap.siteContentKeys.push(businessKey);
		return [businessKey];
	}
	/**
	* Get a provision log entry.
	*/
	async getProvisionLog(workspaceId, blueprintSlug, blueprintVersion) {
		const key = `provision:log:${workspaceId}:${blueprintSlug}:${blueprintVersion}`;
		try {
			const { data } = await this.withWorkspace(this.db.from("site_content").select("value").eq("key", key)).maybeSingle();
			if (data?.value) return data.value;
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
		const upsertLog = {
			key: `provision:log:${workspaceId}:${blueprintSlug}:${blueprintVersion}`,
			value: {
				workspaceId,
				blueprintSlug,
				blueprintVersion,
				provisionedAt: (/* @__PURE__ */ new Date()).toISOString(),
				entities: log.entities
			},
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
			const { error } = await this.withWorkspace(this.db.from("site_content").delete().eq("key", key));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("site_content", "deleteByKey", err, { key });
		}
	}
	async upsert(key, value) {
		try {
			this.validateOrThrow(siteContentValueSchema, value, "site_content");
			const upsertItem = {
				key,
				value
			};
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
			const { error } = await this.withWorkspace(this.db.from("site_content").delete().in("key", keys));
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
			const { data, error } = await this.withWorkspace(this.db.from("site_content").select(SELECT_COLUMNS$2).in("key", keys));
			if (error) throw error;
			const result = /* @__PURE__ */ new Map();
			for (const row of data ?? []) result.set(row.key, row);
			return result;
		} catch (err) {
			throw this.normalizeError("site_content", "batchGetByKeys", err, { count: keys.length });
		}
	}
};
/**
* Personality repository — encapsulates personality_profiles table operations.
*/
var SELECT_COLUMNS$1 = "key,label,tagline,description,traits,drink,spot,color_from,color_to,sort_order,updated_at";
var PersonalityRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async getAll(opts) {
		try {
			let query = this.withWorkspace(this.db.from("personality_profiles").select(SELECT_COLUMNS$1).order("sort_order"));
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
			if (resourceMap) resourceMap.personalityKeys.push(profile.key);
		}
		return keys;
	}
	async upsert(row) {
		try {
			this.validateOrThrow(personalityProfileUpdateSchema, { ...row }, "personality_profiles");
			const insertRow = this.workspaceId ? {
				...row,
				workspace_id: this.workspaceId
			} : row;
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
			const { error } = await this.withWorkspace(this.db.from("personality_profiles").delete().in("key", keys));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("personality_profiles", "batchDelete", err, { count: keys.length });
		}
	}
	async update(key, patch) {
		try {
			this.validateOrThrow(personalityProfileUpdateSchema, patch, "personality_profiles.update");
			const { error } = await this.withWorkspace(this.db.from("personality_profiles").update(patch).eq("key", key));
			if (error) throw error;
		} catch (err) {
			throw this.normalizeError("personality_profiles", "update", err, { key });
		}
	}
};
/**
* Media repository — encapsulates media_files table and storage operations.
*/
/**
* Storage bucket for media files.
* NOTE: When adding workspace support, include workspace ID in bucket name or path.
*/
var MEDIA_BUCKET = "media";
var SELECT_COLUMNS = "id,name,storage_path,folder,tags,size_bytes,mime_type,created_at";
var MediaRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async getAll(opts) {
		try {
			let query = this.withWorkspace(this.db.from("media_files").select(SELECT_COLUMNS).order("created_at", { ascending: false }));
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
		this.logger.info(`Uploading media`, {
			folder,
			fileName: file.name,
			size: file.size
		});
		const { error: uploadError } = await this.storage.upload(MEDIA_BUCKET, storagePath, file, { contentType: file.type });
		if (uploadError) throw new StorageError("upload", MEDIA_BUCKET, {
			cause: uploadError,
			context: { storagePath }
		});
		try {
			const metadata = this.validateOrThrow(mediaFileSchema, {
				name: file.name,
				storage_path: storagePath,
				folder,
				tags: [],
				size_bytes: file.size,
				mime_type: file.type
			}, "media_files.upload");
			const insertData = this.workspaceId ? {
				...metadata,
				workspace_id: this.workspaceId
			} : metadata;
			const { data, error } = await this.db.from("media_files").insert(insertData).select().single();
			if (error) {
				this.logger.warn("DB insert failed, cleaning up storage", {
					storagePath,
					error
				});
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
			if (storageError) throw new StorageError("remove", MEDIA_BUCKET, {
				cause: storageError,
				context: { storagePath: file.storage_path }
			});
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
			const pathMatch = new URL(publicUrl).pathname.match(/\/media\/(.+)/);
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
/**
* Test repository — encapsulates test_responses table operations.
*/
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
			const validated = this.validateOrThrow(testResponseSchema, {
				answers: input.answers,
				result: input.result,
				tied: input.tied,
				user_full_name: input.userInfo?.fullName ?? "",
				user_phone: input.userInfo?.phone ?? "",
				user_age: input.userInfo?.age ?? null,
				user_gender: input.userInfo?.gender ?? ""
			}, "test_responses");
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
			const EMPTY = {
				overrides: {},
				orderedIds: null
			};
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
/**
* Analytics repository — encapsulates analytics queries.
*/
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
			const fiveMinAgo = /* @__PURE__ */ new Date(Date.now() - 300 * 1e3);
			const sv = this._siteVisitsQuery();
			const [totalRes, todayRes, yesterdayRes, realtimeRes] = await Promise.all([
				sv.selectCount("session_id", { is_bot: false }),
				sv.selectCount("session_id", {
					is_bot: false,
					gte: startOfDay.toISOString()
				}),
				sv.selectCount("session_id", {
					is_bot: false,
					gte: startOfYesterday.toISOString(),
					lt: startOfDay.toISOString()
				}),
				sv.selectCount("session_id", {
					is_bot: false,
					gte: fiveMinAgo.toISOString()
				})
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
				const { data, error } = await this.db.rpc("get_top_pages", { limit_count: limit });
				if (!error && data) return data;
			} catch {}
			const { data: fallback } = await this._siteVisitsQuery().selectColumns("page_path");
			if (!fallback) return [];
			const counts = /* @__PURE__ */ new Map();
			for (const row of fallback) {
				const path = row.page_path ?? "";
				counts.set(path, (counts.get(path) ?? 0) + 1);
			}
			return Array.from(counts.entries()).map(([page_path, visit_count]) => ({
				page_path,
				visit_count
			})).sort((a, b) => b.visit_count - a.visit_count).slice(0, limit);
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
				const { data, error } = await this.db.rpc("get_device_distribution");
				if (!error && data) return data;
			} catch {}
			const { data: fallback } = await this._siteVisitsQuery().selectColumns("device_type");
			if (!fallback) return [];
			const counts = /* @__PURE__ */ new Map();
			for (const row of fallback) counts.set(row.device_type ?? "unknown", (counts.get(row.device_type ?? "unknown") ?? 0) + 1);
			return Array.from(counts.entries()).map(([device_type, count]) => ({
				device_type,
				count
			})).sort((a, b) => b.count - a.count);
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
				const { data, error } = await this.db.rpc("get_visits_over_time", { days });
				if (!error && data) return data;
			} catch {}
			const cutoff = /* @__PURE__ */ new Date();
			cutoff.setDate(cutoff.getDate() - days);
			cutoff.setHours(0, 0, 0, 0);
			const { data: fallback } = await this._siteVisitsQuery().selectColumns("created_at");
			if (!fallback) return [];
			const dayCounts = /* @__PURE__ */ new Map();
			for (const row of fallback) {
				const date = new Date(row.created_at ?? "").toISOString().split("T")[0];
				dayCounts.set(date, (dayCounts.get(date) ?? 0) + 1);
			}
			return Array.from(dayCounts.entries()).map(([date, visits]) => ({
				date,
				visits
			})).sort((a, b) => a.date.localeCompare(b.date));
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
			const [totalRes, todayRes] = await Promise.all([this.db.from("page_views").select("*", {
				count: "exact",
				head: true
			}), this.db.from("page_views").select("*", {
				count: "exact",
				head: true
			}).gte("visited_at", startOfDay.toISOString())]);
			if (totalRes.error) throw totalRes.error;
			if (todayRes.error) throw todayRes.error;
			return {
				total: totalRes.count ?? 0,
				today: todayRes.count ?? 0
			};
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
	/**
	* Wrapper for site_visits queries (not yet in generated Supabase types).
	*/
	_siteVisitsQuery() {
		const db = this.db;
		return {
			selectCount: async (_column, filter) => {
				let query = db.from("site_visits").select("*", {
					count: "exact",
					head: true
				});
				if (filter?.gte) query = query.gte("created_at", filter.gte);
				if (filter?.lt) query = query.lt("created_at", filter.lt);
				return query;
			},
			selectColumns: async (columns) => {
				return await db.from("site_visits").select(columns);
			}
		};
	}
};
/**
* Auth repository — encapsulates authentication operations.
*/
var AuthRepository = class extends BaseRepository {
	constructor(deps) {
		super(deps);
	}
	async signIn(email, password) {
		try {
			const { error } = await this.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
			this.logger.info("User signed in", { source: "auth" });
		} catch (err) {
			throw new AuthError("signIn", {
				cause: err,
				context: { email }
			});
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
			throw new AuthError("signUp", {
				cause: err,
				context: { email }
			});
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
			return {
				user: data.session?.user ?? null,
				loading: false
			};
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
			throw new AuthError("isAdmin", {
				cause: err,
				context: { userId }
			});
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
	joinedAt: stringType().datetime()
});
var workspaceMetadataSchema = objectType({
	name: stringType().min(1).max(200),
	description: stringType().max(2e3).optional(),
	logo: stringType().url().optional(),
	domain: stringType().optional(),
	locale: stringType().min(2).max(10),
	timezone: stringType().min(1).max(50),
	createdAt: stringType().datetime(),
	updatedAt: stringType().datetime()
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
	* Uses the workspaces.subdomain index for fast lookup.
	* Returns null if not found.
	*/
	async findBySubdomain(subdomain) {
		try {
			const { data, error } = await this.db.from("workspaces").select("*").eq("subdomain", subdomain).maybeSingle();
			if (error) throw error;
			if (!data) return null;
			return this._mapRowToEntity(data);
		} catch (err) {
			throw this.normalizeError("workspaces", "workspace.findBySubdomain", err, { subdomain });
		}
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
var factory_exports = /* @__PURE__ */ __exportAll$1({
	createRepositories: () => createRepositories,
	getRepositories: () => getRepositories,
	initRepositories: () => initRepositories,
	setWorkspaceOnRepositories: () => setWorkspaceOnRepositories
});
/**
* Create all repositories from the given dependencies.
*/
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
var _repositories = null;
/**
* Get or create the singleton repositories instance (client-side).
*/
function getRepositories(deps) {
	if (!_repositories && deps) _repositories = createRepositories(deps);
	if (!_repositories) throw new Error("Repositories not initialized. Call getRepositories with dependencies first, or import from '@/lib/providers/supabase' to create providers.");
	return _repositories;
}
/**
* Initialize repositories with the given dependencies.
*/
function initRepositories(deps) {
	_repositories = createRepositories(deps);
	return _repositories;
}
/**
* Set workspace context on all repositories.
*/
function setWorkspaceOnRepositories(repos, workspace) {
	for (const repo of Object.values(repos)) if (typeof repo.setWorkspace === "function") repo.setWorkspace(workspace);
}
//#endregion
export { createRepositories as a, getRepositories as c, createId as i, initRepositories as l, WorkspaceRepository as n, createWorkspace as o, cn as r, factory_CQVF8GbS_exports as s, PLATFORM_DOMAIN as t, workspacePlanSchema as u };
