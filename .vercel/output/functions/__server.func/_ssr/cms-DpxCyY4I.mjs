import { o as __toESM } from "../_runtime.mjs";
import { t as getSupabaseProviders } from "./supabase-B2jjn2gh.mjs";
import { c as getRepositories, l as initRepositories } from "./factory-DhqSLdOF.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms-DpxCyY4I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** While the admin user is typing, skip remote cache refreshes. */
var LOCAL_EDIT_PAUSE_MS = 3500;
/** Batch remote postgres_changes before refetching. */
var REMOTE_SYNC_DEBOUNCE_MS = 2e3;
var remoteSyncPausedUntil = 0;
var invalidationTimers = /* @__PURE__ */ new Map();
function touchLocalCmsEdit(durationMs = LOCAL_EDIT_PAUSE_MS) {
	remoteSyncPausedUntil = Date.now() + durationMs;
}
function isRemoteSyncPaused() {
	return Date.now() < remoteSyncPausedUntil;
}
function queryKeyId(queryKey) {
	return JSON.stringify(queryKey);
}
/** Debounced refetch for changes from other tabs or collaborators. */
function scheduleRemoteSync(qc, queryKey) {
	const id = queryKeyId(queryKey);
	const existing = invalidationTimers.get(id);
	if (existing) clearTimeout(existing);
	invalidationTimers.set(id, setTimeout(function tick() {
		if (isRemoteSyncPaused()) {
			invalidationTimers.set(id, setTimeout(tick, 500));
			return;
		}
		invalidationTimers.delete(id);
		qc.invalidateQueries({ queryKey });
	}, REMOTE_SYNC_DEBOUNCE_MS));
}
async function beginOptimisticUpdate(qc, queryKey, updater) {
	touchLocalCmsEdit();
	await qc.cancelQueries({ queryKey });
	const prev = qc.getQueryData(queryKey);
	const next = updater(prev);
	if (next !== void 0) qc.setQueryData(queryKey, next);
	return { prev };
}
function rollbackOptimisticUpdate(qc, queryKey, prev) {
	if (prev !== void 0) qc.setQueryData(queryKey, prev);
	else qc.removeQueries({ queryKey });
}
function upsertById(list, item) {
	if (!list?.length) return [item];
	const idx = list.findIndex((row) => row.id === item.id);
	if (idx < 0) return [...list, item];
	const next = [...list];
	next[idx] = item;
	return next;
}
function removeById(list, id) {
	return (list ?? []).filter((row) => row.id !== id);
}
/**
* Provider initialization.
* This module wires the Supabase providers to the repository layer.
* Application code should import from here or from @/lib/repositories.
*
* Architecture: User → Workspace → Repositories → Provider → Database
* The workspace layer sits between user auth and repositories, ensuring
* all data access is scoped to the current workspace.
*/
var _initialized = false;
/**
* Initialize the repository layer with Supabase providers.
* Call this once at application startup.
*/
function initializeRepositories() {
	if (_initialized) return getRepositories();
	const repos = initRepositories(getSupabaseProviders());
	_initialized = true;
	return repos;
}
/**
* Get the initialized repositories.
* Throws if not yet initialized.
*/
function useRepositories() {
	return initializeRepositories();
}
/**
* CMS data layer. The Admin Panel and Landing Page consume these hooks.
* Source of truth = Lovable Cloud (Supabase). NO localStorage for CMS data.
*
* Refactored to use the Repository layer instead of direct Supabase calls.
* All public exports and hook signatures are unchanged.
*/
var QK = {
	menu: ["cms", "menu"],
	gallery: ["cms", "gallery"],
	events: ["cms", "events"],
	testimonials: ["cms", "testimonials"],
	blocks: ["cms", "blocks"],
	theme: ["cms", "theme"],
	site: ["cms", "site"],
	personalities: ["cms", "personalities"],
	pageViews: ["cms", "page-views"],
	role: (uid) => [
		"auth",
		"role",
		uid
	]
};
function useMenuItems() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.menu,
		queryFn: () => repos.menu.getVisible()
	});
}
function useAllMenuItems() {
	const repos = useRepositories();
	return useQuery({
		queryKey: [...QK.menu, "all"],
		queryFn: () => repos.menu.getAll()
	});
}
function useGalleryImages() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.gallery,
		queryFn: () => repos.gallery.getVisible()
	});
}
function useAllGalleryImages() {
	const repos = useRepositories();
	return useQuery({
		queryKey: [...QK.gallery, "all"],
		queryFn: () => repos.gallery.getAll()
	});
}
function useEvents() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.events,
		queryFn: () => repos.events.getVisible()
	});
}
function useAllEvents() {
	const repos = useRepositories();
	return useQuery({
		queryKey: [...QK.events, "all"],
		queryFn: () => repos.events.getAll()
	});
}
function useTestimonials() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.testimonials,
		queryFn: () => repos.testimonials.getVisible()
	});
}
function usePageBlocks() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.blocks,
		queryFn: () => repos.pages.getAll()
	});
}
var DEFAULT_THEME_SETTINGS = {
	id: 1,
	primary_color: "#d4af37",
	secondary_color: "#0f172a",
	accent_color: "#d4af37",
	background_color: "#0a0a0a",
	text_color: "#f0e6d3",
	text_secondary_color: "#9a8a78",
	text_tertiary_color: "#c9b89e",
	border_radius: "0.75rem",
	glass_opacity: .08,
	name: null,
	preset_id: null,
	tokens: null,
	updated_at: (/* @__PURE__ */ new Date()).toISOString()
};
var _themeRepo = null;
async function getThemeRepo() {
	if (_themeRepo) return _themeRepo;
	const { createSupabaseProviders } = await import("./supabase-B2jjn2gh.mjs").then((n) => n.n).then((n) => n.n);
	const { ThemeRepository } = await import("./theme-SnWyrOGi.mjs").then((n) => n.x).then((n) => n.n);
	_themeRepo = new ThemeRepository(createSupabaseProviders());
	return _themeRepo;
}
async function fetchThemeSettings() {
	return (await getThemeRepo()).get();
}
function useTheme() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.theme,
		queryFn: () => repos.theme.get(),
		staleTime: 6e4
	});
}
function useSiteContent() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.site,
		queryFn: () => repos.siteContent.getAll()
	});
}
function upsertPersonalityRow(list, row) {
	if (!list?.length) return [row];
	const idx = list.findIndex((r) => r.key === row.key);
	if (idx < 0) return [...list, row];
	const next = [...list];
	next[idx] = {
		...next[idx],
		...row
	};
	return next;
}
function makeUpsertHook(repoKey, qk) {
	return function useUpsert() {
		const qc = useQueryClient();
		const repo = useRepositories()[repoKey];
		return useMutation({
			mutationFn: async (row) => {
				return repo.upsert(row);
			},
			onMutate: async (row) => {
				if (!row.id) return {
					prev: void 0,
					prevAll: void 0
				};
				const optimistic = {
					...row,
					id: row.id
				};
				const { prev } = await beginOptimisticUpdate(qc, qk, (list) => upsertById(list, optimistic));
				const { prev: prevAll } = await beginOptimisticUpdate(qc, [...qk, "all"], (list) => upsertById(list, optimistic));
				return {
					prev,
					prevAll
				};
			},
			onError: (_err, _row, ctx) => {
				if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, qk, ctx.prev);
				if (ctx?.prevAll !== void 0) rollbackOptimisticUpdate(qc, [...qk, "all"], ctx.prevAll);
			},
			onSuccess: (data) => {
				if (!data?.id) return;
				touchLocalCmsEdit();
				qc.setQueryData(qk, (list) => upsertById(list, data));
				qc.setQueryData([...qk, "all"], (list) => upsertById(list, data));
			}
		});
	};
}
function makeDeleteHook(repoKey, qk) {
	return function useDelete() {
		const qc = useQueryClient();
		const repo = useRepositories()[repoKey];
		return useMutation({
			mutationFn: async (id) => {
				await repo.delete(id);
			},
			onMutate: async (id) => {
				const { prev } = await beginOptimisticUpdate(qc, qk, (list) => removeById(list, id));
				const { prev: prevAll } = await beginOptimisticUpdate(qc, [...qk, "all"], (list) => removeById(list, id));
				return {
					prev,
					prevAll
				};
			},
			onError: (_err, _id, ctx) => {
				if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, qk, ctx.prev);
				if (ctx?.prevAll !== void 0) rollbackOptimisticUpdate(qc, [...qk, "all"], ctx.prevAll);
			},
			onSuccess: () => touchLocalCmsEdit()
		});
	};
}
var useUpsertMenuItem = makeUpsertHook("menu", QK.menu);
var useDeleteMenuItem = makeDeleteHook("menu", QK.menu);
var useUpsertGalleryImage = makeUpsertHook("gallery", QK.gallery);
var useDeleteGalleryImage = makeDeleteHook("gallery", QK.gallery);
var useUpsertEvent = makeUpsertHook("events", QK.events);
var useDeleteEvent = makeDeleteHook("events", QK.events);
QK.testimonials;
QK.testimonials;
function useCreateBlock() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (input) => {
			return repos.pages.create(input);
		},
		onSuccess: (data) => {
			if (!data) return;
			touchLocalCmsEdit();
			qc.setQueryData(QK.blocks, (list) => upsertById(list, data));
		}
	});
}
function useUpdateBlock() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (input) => {
			const { id, ...patch } = input;
			await repos.pages.update(id, patch);
		},
		onMutate: async (input) => beginOptimisticUpdate(qc, QK.blocks, (list) => {
			if (!list) return list;
			return list.map((block) => block.id === input.id ? {
				...block,
				...input,
				data: input.data ?? block.data
			} : block);
		}),
		onError: (_err, _input, ctx) => {
			if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
		},
		onSuccess: () => touchLocalCmsEdit()
	});
}
function useDeleteBlock() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (id) => {
			await repos.pages.delete(id);
		},
		onMutate: async (id) => beginOptimisticUpdate(qc, QK.blocks, (list) => removeById(list, id)),
		onError: (_err, _id, ctx) => {
			if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
		},
		onSuccess: () => touchLocalCmsEdit()
	});
}
function useReorderBlocks() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (orderedIds) => {
			await repos.pages.reorder(orderedIds);
		},
		onMutate: async (orderedIds) => beginOptimisticUpdate(qc, QK.blocks, (list) => {
			if (!list) return list;
			const byId = new Map(list.map((block) => [block.id, block]));
			return orderedIds.map((id, sort_order) => {
				const block = byId.get(id);
				return block ? {
					...block,
					sort_order
				} : null;
			}).filter(Boolean);
		}),
		onError: (_err, _ids, ctx) => {
			if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
		},
		onSuccess: () => touchLocalCmsEdit()
	});
}
function useUpdateTheme() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (patch) => {
			await repos.theme.update(patch);
		},
		onMutate: async (patch) => beginOptimisticUpdate(qc, QK.theme, (prev) => prev ? {
			...prev,
			...patch
		} : prev),
		onError: (_err, _patch, ctx) => {
			if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, QK.theme, ctx.prev);
		},
		onSuccess: () => touchLocalCmsEdit()
	});
}
function useUpsertSiteContent() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (input) => {
			await repos.siteContent.upsert(input.key, input.value);
		},
		onMutate: async (input) => beginOptimisticUpdate(qc, QK.site, (prev) => ({
			...prev ?? {},
			[input.key]: input.value
		})),
		onError: (_err, _input, ctx) => {
			if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, QK.site, ctx.prev);
		},
		onSuccess: () => touchLocalCmsEdit()
	});
}
function usePersonalityProfiles() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.personalities,
		queryFn: () => repos.personality.getAll()
	});
}
function useUpsertPersonalityProfile() {
	const qc = useQueryClient();
	const repos = useRepositories();
	return useMutation({
		mutationFn: async (row) => {
			await repos.personality.upsert(row);
		},
		onMutate: async (row) => beginOptimisticUpdate(qc, QK.personalities, (list) => upsertPersonalityRow(list, row)),
		onError: (_err, _row, ctx) => {
			if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, QK.personalities, ctx.prev);
		},
		onSuccess: (_data, row) => {
			touchLocalCmsEdit();
			qc.setQueryData(QK.personalities, (list) => upsertPersonalityRow(list, row));
		}
	});
}
function usePageViewStats() {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.pageViews,
		queryFn: () => repos.analytics.fetchPageViewStats()
	});
}
var PAGE_VIEW_SESSION_KEY = "cms-page-view-recorded";
function useRecordPageView() {
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (sessionStorage.getItem(PAGE_VIEW_SESSION_KEY)) return;
		sessionStorage.setItem(PAGE_VIEW_SESSION_KEY, "1");
		import("./cms.functions-C4qY0Eak.mjs").then(({ recordPageView }) => recordPageView({ data: {
			path: window.location.pathname,
			referrer: document.referrer || void 0,
			userAgent: navigator.userAgent
		} }).catch(() => {}));
	}, []);
}
function useUser() {
	const repos = useRepositories();
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		repos.auth.getSession().then(({ user: u }) => {
			if (!mounted) return;
			setUser(u);
			setLoading(false);
		});
		const { data: sub } = repos.auth.onAuthStateChange((_e, session) => {
			const u = session?.user ?? null;
			setUser(u ?? null);
			setLoading(false);
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, [repos]);
	return {
		user,
		loading
	};
}
function useIsAdmin(userId) {
	const repos = useRepositories();
	return useQuery({
		queryKey: QK.role(userId),
		enabled: !!userId,
		queryFn: async () => {
			if (!userId) return false;
			return repos.auth.isAdmin(userId);
		}
	});
}
var CMS_SYNC_CHANNEL = "cms-sync";
var CMS_SYNC_TABLES = [
	{
		table: "menu_items",
		queryKey: QK.menu
	},
	{
		table: "gallery_images",
		queryKey: QK.gallery
	},
	{
		table: "events",
		queryKey: QK.events
	},
	{
		table: "testimonials",
		queryKey: QK.testimonials
	},
	{
		table: "page_blocks",
		queryKey: QK.blocks
	},
	{
		table: "theme_settings",
		queryKey: QK.theme
	},
	{
		table: "site_content",
		queryKey: QK.site
	},
	{
		table: "personality_profiles",
		queryKey: QK.personalities
	},
	{
		table: "test_responses",
		queryKey: ["test", "responses"]
	},
	{
		table: "media_files",
		queryKey: ["media"]
	}
];
var cmsSyncChannel = null;
var cmsSyncRefCount = 0;
var cmsSyncQueryClient = null;
function createCmsSyncChannel(repos) {
	let channel = repos.realtime.channel(CMS_SYNC_CHANNEL);
	for (const { table, queryKey } of CMS_SYNC_TABLES) channel = channel.on("postgres_changes", {
		event: "*",
		schema: "public",
		table
	}, () => {
		if (!cmsSyncQueryClient) return;
		scheduleRemoteSync(cmsSyncQueryClient, queryKey);
		if (table === "site_content") scheduleRemoteSync(cmsSyncQueryClient, ["test", "questions"]);
	});
	channel.subscribe();
	return channel;
}
function acquireCmsSyncChannel(qc, repos) {
	cmsSyncQueryClient = qc;
	cmsSyncRefCount += 1;
	if (cmsSyncChannel) return;
	cmsSyncChannel = createCmsSyncChannel(repos);
}
function releaseCmsSyncChannel() {
	cmsSyncRefCount = Math.max(0, cmsSyncRefCount - 1);
	if (cmsSyncRefCount > 0) return;
	const channel = cmsSyncChannel;
	cmsSyncChannel = null;
	cmsSyncQueryClient = null;
	if (channel) getRepositories().realtime.removeChannel(channel);
}
/** Single shared cms-sync channel; safe to call from multiple components. */
function useRealtimeCmsSync() {
	const qc = useQueryClient();
	const repos = useRepositories();
	(0, import_react.useEffect)(() => {
		acquireCmsSyncChannel(qc, repos);
		return () => {
			releaseCmsSyncChannel();
		};
	}, [qc, repos]);
}
//#endregion
export { useTheme as A, usePersonalityProfiles as C, useRepositories as D, useReorderBlocks as E, useUpsertMenuItem as F, useUpsertPersonalityProfile as I, useUpsertSiteContent as L, useUpdateTheme as M, useUpsertEvent as N, useSiteContent as O, useUpsertGalleryImage as P, useUser as R, usePageViewStats as S, useRecordPageView as T, useEvents as _, removeById as a, useMenuItems as b, upsertById as c, useAllMenuItems as d, useCreateBlock as f, useDeleteMenuItem as g, useDeleteGalleryImage as h, fetchThemeSettings as i, useUpdateBlock as j, useTestimonials as k, useAllEvents as l, useDeleteEvent as m, QK as n, rollbackOptimisticUpdate as o, useDeleteBlock as p, beginOptimisticUpdate as r, touchLocalCmsEdit as s, DEFAULT_THEME_SETTINGS as t, useAllGalleryImages as u, useGalleryImages as v, useRealtimeCmsSync as w, usePageBlocks as x, useIsAdmin as y };
