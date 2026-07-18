import { o as __toESM } from "../_runtime.mjs";
import { t as getSupabaseProviders } from "./supabase-CPDyPLwR.mjs";
import { i as DEFAULT_WORKSPACE, m as resolveWorkspaceFromRequest, o as PLATFORM_DOMAIN, p as getLogger, t as ACTIVE_WORKSPACE_STATUSES } from "./resolver-PyN47Luo.mjs";
import { i as initRepositories, r as getRepositories } from "./factory-CzzOJOZz.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms-BzqQuhMP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
* Check that workspace context has been properly resolved.
*/
function checkWorkspaceResolution(ctx) {
	if (!ctx.workspaceId) return {
		name: "workspace-resolution",
		passed: false,
		detail: "Workspace ID is not set — using single-tenant default"
	};
	return {
		name: "workspace-resolution",
		passed: true,
		detail: `Workspace resolved: ${ctx.workspaceId}`,
		data: { workspaceId: ctx.workspaceId }
	};
}
/**
* Check that the workspace entity is available and operational.
*/
function checkWorkspaceEntity(ctx) {
	if (!ctx.entity) return {
		name: "workspace-entity",
		passed: false,
		detail: "Workspace entity not loaded"
	};
	if (!ctx.entity.membership || ctx.entity.membership.length === 0) return {
		name: "workspace-entity",
		passed: false,
		detail: "Workspace has no members",
		data: { workspaceId: ctx.entity.id }
	};
	return {
		name: "workspace-entity",
		passed: true,
		detail: `Workspace "${ctx.entity.metadata.name}" — ${ctx.entity.membership.length} members, plan: ${ctx.entity.plan}, status: ${ctx.entity.status}`,
		data: {
			workspaceId: ctx.entity.id,
			plan: ctx.entity.plan,
			status: ctx.entity.status,
			memberCount: ctx.entity.membership.length
		}
	};
}
/**
* Check that workspace limits are available.
*/
function checkWorkspaceLimits(ctx) {
	if (!ctx.entity) return {
		name: "workspace-limits",
		passed: false,
		detail: "Cannot check limits — workspace entity not loaded"
	};
	const limits = ctx.entity.limits;
	return {
		name: "workspace-limits",
		passed: true,
		detail: `Limits: ${limits.maxPages} pages, ${limits.maxMedia} media, ${limits.maxAdmins} admins`,
		data: limits
	};
}
/**
* Check if the workspace status allows operations.
*/
function checkWorkspaceStatus(ctx) {
	if (!ctx.entity) return {
		name: "workspace-status",
		passed: false,
		detail: "Workspace entity not loaded — cannot check status"
	};
	const isOperational = ["active", "trial"].includes(ctx.entity.status);
	return {
		name: "workspace-status",
		passed: isOperational,
		detail: isOperational ? `Workspace is ${ctx.entity.status} — operations allowed` : `Workspace is ${ctx.entity.status} — operations may be restricted`,
		data: {
			status: ctx.entity.status,
			operational: isOperational
		}
	};
}
/**
* Run all standard health checks for a workspace context.
*/
function runWorkspaceHealthChecks(ctx) {
	const checks = [
		checkWorkspaceResolution(ctx),
		checkWorkspaceEntity(ctx),
		checkWorkspaceLimits(ctx),
		checkWorkspaceStatus(ctx)
	];
	const allPassed = checks.every((c) => c.passed);
	return {
		healthy: allPassed,
		summary: allPassed ? "Workspace layer is healthy" : `Workspace layer has ${checks.filter((c) => !c.passed).length} issue(s)`,
		checks
	};
}
/**
* Get a summary string suitable for logging.
*/
function formatHealthSummary(result) {
	const parts = result.checks.map((c) => `  ${c.passed ? "✓" : "✗"} ${c.name}: ${c.detail ?? "ok"}`);
	return [`[Workspace Health] ${result.summary}`, ...parts].join("\n");
}
/**
* Check if an operation would exceed a workspace limit.
*
* @example
*   const check = checkLimit(workspace, "maxPages", currentPageCount);
*   if (!check.allowed) throw new Error(check.message);
*/
function checkLimit(entity, limit, currentUsage) {
	const maximum = entity.limits[limit];
	const allowed = currentUsage < maximum;
	return {
		allowed,
		limit,
		current: currentUsage,
		maximum,
		message: allowed ? void 0 : `Workspace limit exceeded: ${limit} (${currentUsage}/${maximum})`
	};
}
/**
* Find a user's membership in a workspace.
*/
function findMembership(entity, userId) {
	return entity.membership.find((m) => m.userId === userId);
}
/**
* Check if a user has at least the given role in the workspace.
*/
function hasRole(entity, userId, minimumRole) {
	const member = findMembership(entity, userId);
	if (!member) return false;
	const hierarchy = {
		viewer: 0,
		member: 1,
		admin: 2,
		owner: 3
	};
	return hierarchy[member.role] >= hierarchy[minimumRole];
}
/**
* Check if a user is an admin or owner of the workspace.
*/
function isAdmin(entity, userId) {
	return hasRole(entity, userId, "admin");
}
/**
* Check if a user is the owner of the workspace.
*/
function isOwner(entity, userId) {
	return findMembership(entity, userId)?.role === "owner";
}
/**
* NAMA Platform — Workspace Context Provider.
*
* React context provider that resolves the current workspace and makes it
* available to the entire application tree. Repositories automatically
* use this workspace context via setWorkspaceOnRepositories().
*
* Components should never manually pass workspaceId.
* Use useCurrentWorkspace() to access workspace info.
*
* The provider self-resolves the userId from the auth provider,
* so it can be placed at the root level without requiring userId prop.
*
* IMPORTANT: Import from @/lib/repositories/factory (not @/lib/repositories barrel)
* to avoid circular dependencies with the workspace domain exports.
*/
var WorkspaceCtx = (0, import_react.createContext)(null);
var PREVIEW_WS_STORAGE_KEY = "nama:preview-workspace-id";
/**
* Extract domain/subdomain information from the browser location.
* Returns { domain, subdomain, isSubdomain } or null if running in SSR/non-browser context.
*/
function extractDomainInfo() {
	if (typeof window === "undefined") return null;
	const hostname = window.location.hostname;
	if (!hostname) return null;
	if (hostname === "localhost" || hostname.startsWith("127.") || hostname.startsWith("::")) return null;
	const parts = hostname.split(".");
	if (parts.length >= 3) {
		const potentialSubdomain = parts[0];
		if (![
			"www",
			"api",
			"cdn",
			"static",
			"assets",
			"app",
			"mail",
			"shop"
		].includes(potentialSubdomain.toLowerCase())) return {
			domain: hostname,
			subdomain: potentialSubdomain,
			isSubdomain: false
		};
	}
	return {
		domain: hostname,
		subdomain: void 0,
		isSubdomain: false
	};
}
/**
* Parse the `?preview_domain=<domain>` override from a search string.
* Local-testing-only: disabled unless VITE_ENABLE_DOMAIN_PREVIEW === "true".
* Strips leading/trailing slashes so "?preview_domain=khane.nama.app/" (a common
* typo / copy-paste from a URL bar) still matches the stored "khane.nama.app"
* domain exactly in findByDomain.
*/
function parsePreviewDomain(search) {
	const value = new URLSearchParams(search).get("preview_domain")?.trim().replace(/^\/+/, "").replace(/\/+$/, "");
	return value ? value : void 0;
}
/**
* Extract workspace ID from the URL path.
* Matches patterns like:
*   /cafe/<workspace-id>       — admin/owner cafe mode
*   /cafe/<workspace-slug>     — admin/owner cafe slug mode (workspace slug stored in DB)
*   /p/<workspace-id>/<page>   — public page URL pattern (new multi-domain format)
*
* `previewDomain` is passed in (read reactively from the router by the provider)
* so resolution re-runs whenever the param changes — e.g. navigating between
* admin sections that preserve ?preview_domain, or adding/removing it.
*/
function extractWorkspaceFromPath(previewDomain, workspaceIdFromRoute) {
	if (typeof window === "undefined") return {
		workspaceId: workspaceIdFromRoute,
		domain: void 0,
		isSubdomain: false
	};
	if (previewDomain) return {
		workspaceId: void 0,
		domain: previewDomain,
		isSubdomain: false
	};
	const pathname = window.location.pathname;
	if (workspaceIdFromRoute) return {
		workspaceId: workspaceIdFromRoute,
		domain: void 0,
		isSubdomain: false
	};
	const cafeMatch = pathname.match(/^\/cafe(?:\/([^/]+))?(?:\/(shop|cms))?$/);
	if (cafeMatch && cafeMatch[1]) return {
		workspaceId: void 0,
		domain: `${cafeMatch[1]}.${PLATFORM_DOMAIN}`,
		isSubdomain: false
	};
	const domainInfo = extractDomainInfo();
	if (domainInfo) return {
		workspaceId: void 0,
		domain: domainInfo.domain ?? void 0,
		isSubdomain: domainInfo.isSubdomain
	};
	try {
		const stored = sessionStorage.getItem(PREVIEW_WS_STORAGE_KEY);
		if (stored) return {
			workspaceId: stored,
			domain: void 0,
			isSubdomain: false
		};
	} catch {}
	return {
		workspaceId: void 0,
		domain: void 0,
		isSubdomain: false
	};
}
/**
* Resolves the current workspace and makes it available to the app tree.
* Automatically sets workspace context on all repositories.
*
* Resolution strategy (in priority order):
*   1. Route params (workspaceId from URL)
*   2. Subdomain-based domain resolution
*   3. Full domain resolution
*   4. User membership resolution (fallback for auth flows)
*
* Must be placed inside QueryClientProvider (uses getRepositories internally).
*/
function CurrentWorkspaceProvider({ children }) {
	const [workspace, setWorkspace] = (0, import_react.useState)(DEFAULT_WORKSPACE);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const logger = (0, import_react.useMemo)(() => getLogger(), []);
	const queryClient = useQueryClient();
	const locationSearch = useRouterState({ select: (s) => s.location.search });
	const previewDomain = (0, import_react.useMemo)(() => parsePreviewDomain(locationSearch), [locationSearch]);
	const refetchCmsForWorkspace = (0, import_react.useCallback)(() => {
		queryClient.invalidateQueries({ queryKey: ["cms"] });
		queryClient.invalidateQueries({ queryKey: ["test"] });
	}, [queryClient]);
	const resolve = (0, import_react.useCallback)(async () => {
		const { getRepositories, setWorkspaceOnRepositories } = await import("./factory-CzzOJOZz.mjs").then((n) => n.n).then((n) => n.n);
		const repos = getRepositories();
		try {
			setLoading(true);
			setError(null);
			const workspaceRepo = repos.workspace;
			const pathResolution = extractWorkspaceFromPath(previewDomain);
			const requestedDomain = pathResolution.domain;
			let ctx;
			if (pathResolution.workspaceId) ctx = await resolveWorkspaceFromRequest({ workspaceRepository: workspaceRepo }, { workspaceId: pathResolution.workspaceId });
			else if (requestedDomain) {
				ctx = await resolveWorkspaceFromRequest({ workspaceRepository: workspaceRepo }, {
					domain: requestedDomain,
					isSubdomain: pathResolution.isSubdomain
				});
				if (previewDomain && ctx?.workspaceId) try {
					sessionStorage.setItem(PREVIEW_WS_STORAGE_KEY, ctx.workspaceId);
				} catch {}
			}
			if (!ctx?.workspaceId && !requestedDomain) {
				let userId;
				try {
					const { user } = await repos.auth.getSession();
					userId = user?.id;
				} catch {}
				if (!userId) {
					setWorkspace(DEFAULT_WORKSPACE);
					setWorkspaceOnRepositories(repos, DEFAULT_WORKSPACE);
					refetchCmsForWorkspace();
					setLoading(false);
					return;
				}
				ctx = await resolveWorkspaceFromRequest({ workspaceRepository: workspaceRepo }, { userId });
			}
			if (!ctx?.workspaceId) {
				if (requestedDomain) logger.warn(`No workspace resolved for requested domain "${requestedDomain}" — degrading to default workspace`, { source: "workspace" });
				ctx = DEFAULT_WORKSPACE;
			}
			setWorkspaceOnRepositories(repos, ctx);
			setWorkspace(ctx);
			refetchCmsForWorkspace();
			const health = runWorkspaceHealthChecks(ctx);
			if (!health.healthy) logger.warn(formatHealthSummary(health), { source: "workspace" });
			else logger.info(formatHealthSummary(health), { source: "workspace" });
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			setError(error);
			logger.error("Failed to resolve workspace", {
				source: "workspace",
				cause: error
			});
			setWorkspaceOnRepositories(repos, DEFAULT_WORKSPACE);
			setWorkspace(DEFAULT_WORKSPACE);
			refetchCmsForWorkspace();
		} finally {
			setLoading(false);
		}
	}, [
		logger,
		refetchCmsForWorkspace,
		previewDomain
	]);
	(0, import_react.useEffect)(() => {
		resolve();
	}, [resolve]);
	const value = (0, import_react.useMemo)(() => ({
		workspace,
		entity: workspace.entity ?? null,
		loading,
		error,
		isOperational: workspace.entity ? ACTIVE_WORKSPACE_STATUSES.has(workspace.entity.status) : true,
		checkLimit: (limit, currentUsage) => {
			if (!workspace.entity) return true;
			return checkLimit(workspace.entity, limit, currentUsage).allowed;
		},
		hasRole: (uid, minimumRole) => {
			if (!workspace.entity) return true;
			return hasRole(workspace.entity, uid, minimumRole);
		},
		isAdmin: (uid) => {
			if (!workspace.entity) return false;
			return isAdmin(workspace.entity, uid);
		},
		isOwner: (uid) => {
			if (!workspace.entity) return false;
			return isOwner(workspace.entity, uid);
		}
	}), [
		workspace,
		loading,
		error
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceCtx.Provider, {
		value,
		children
	});
}
/**
* Get the raw workspace context (for non-React usage).
* Returns null if not in a provider.
*/
function useOptionalWorkspace() {
	return (0, import_react.useContext)(WorkspaceCtx);
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
function useAllMenuItems() {
	const repos = useRepositories();
	return useQuery({
		queryKey: [...QK.menu, "all"],
		queryFn: () => repos.menu.getAll()
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
	const { createSupabaseProviders } = await import("./supabase-CPDyPLwR.mjs").then((n) => n.n).then((n) => n.n);
	const { ThemeRepository } = await import("./theme-DgPaYO0s.mjs").then((n) => n.m).then((n) => n.n);
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
	const ws = useOptionalWorkspace();
	return useMutation({
		mutationFn: async (input) => {
			return repos.pages.create({
				...input,
				workspace_id: ws?.workspace?.workspaceId ?? void 0
			});
		},
		onMutate: async (input) => {
			const optimistic = {
				id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
				type: input.type,
				data: input.data,
				sort_order: input.sort_order,
				visible: true,
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			const { prev } = await beginOptimisticUpdate(qc, QK.blocks, (list) => upsertById(list, optimistic));
			return { prev };
		},
		onError: (_err, _input, ctx) => {
			if (ctx?.prev !== void 0) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
		},
		onSuccess: (data) => {
			touchLocalCmsEdit();
			qc.setQueryData(QK.blocks, (list) => upsertById(list, data));
		},
		onSettled: () => {
			qc.invalidateQueries({ queryKey: QK.blocks });
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
export { useUpdateTheme as A, useRealtimeCmsSync as C, useTestimonials as D, useSiteContent as E, useUpsertSiteContent as F, useUser as I, useUpsertGalleryImage as M, useUpsertMenuItem as N, useTheme as O, useUpsertPersonalityProfile as P, usePersonalityProfiles as S, useRepositories as T, useDeleteMenuItem as _, fetchThemeSettings as a, usePageBlocks as b, touchLocalCmsEdit as c, useAllGalleryImages as d, useAllMenuItems as f, useDeleteGalleryImage as g, useDeleteEvent as h, beginOptimisticUpdate as i, useUpsertEvent as j, useUpdateBlock as k, upsertById as l, useDeleteBlock as m, DEFAULT_THEME_SETTINGS as n, removeById as o, useCreateBlock as p, QK as r, rollbackOptimisticUpdate as s, CurrentWorkspaceProvider as t, useAllEvents as u, useEvents as v, useReorderBlocks as w, usePageViewStats as x, useIsAdmin as y };
