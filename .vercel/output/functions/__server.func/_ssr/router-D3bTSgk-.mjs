import { o as __toESM } from "../_runtime.mjs";
import { c as recordType, i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType, u as unknownType } from "../_libs/zod.mjs";
import { d as getLogger, i as DEFAULT_WORKSPACE, r as BaseRepository, t as ACTIVE_WORKSPACE_STATUSES, u as getCache } from "./theme-BCfTkcdv.mjs";
import { a as createRepositories, d as workspacePlanSchema, i as createId, n as WorkspaceRepository, o as createWorkspace, t as PLATFORM_DOMAIN, u as setWorkspaceOnRepositories } from "./factory-b_K-lSwh.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { i as fetchThemeSettings, n as QK } from "./cms-BguKx8mI.mjs";
import { M as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as CmsSyncProvider } from "./theme-provider-XoJhLeY1.mjs";
import { t as Route$31 } from "./routes-BfsyZeCs.mjs";
import { randomUUID } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D3bTSgk-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CF-QSdXy.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
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
* Local-testing-only override: `?preview_domain=<domain>` forces the resolver to
* render the workspace that owns that domain, ignoring the real Host header.
* Disabled unless VITE_ENABLE_DOMAIN_PREVIEW === "true", so it can never
* accidentally work in a real production / customer-facing deployment.
*/
function extractPreviewDomain() {
	if (typeof window === "undefined") return void 0;
	const value = new URLSearchParams(window.location.search).get("preview_domain")?.trim().replace(/^\/+/, "").replace(/\/+$/, "");
	return value ? value : void 0;
}
/**
* Extract workspace ID from the URL path.
* Matches patterns like:
*   /cafe/<workspace-id>       — admin/owner cafe mode
*   /cafe/<workspace-slug>     — admin/owner cafe slug mode (workspace slug stored in DB)
*   /p/<workspace-id>/<page>   — public page URL pattern (new multi-domain format)
*/
function extractWorkspaceFromPath(workspaceIdFromRoute) {
	if (typeof window === "undefined") return {
		workspaceId: workspaceIdFromRoute,
		domain: void 0,
		isSubdomain: false
	};
	const previewDomain = extractPreviewDomain();
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
	const resolve = (0, import_react.useCallback)(async () => {
		const { getRepositories, setWorkspaceOnRepositories } = await import("./factory-b_K-lSwh.mjs").then((n) => n.s).then((n) => n.n);
		const repos = getRepositories();
		try {
			setLoading(true);
			setError(null);
			const workspaceRepo = repos.workspace;
			const pathResolution = extractWorkspaceFromPath();
			const requestedDomain = pathResolution.domain;
			let ctx;
			if (pathResolution.workspaceId) ctx = await resolveWorkspaceFromRequest({ workspaceRepository: workspaceRepo }, { workspaceId: pathResolution.workspaceId });
			else if (requestedDomain) {
				ctx = await resolveWorkspaceFromRequest({ workspaceRepository: workspaceRepo }, {
					domain: requestedDomain,
					isSubdomain: pathResolution.isSubdomain
				});
				if (extractPreviewDomain() && ctx?.workspaceId) try {
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
		} finally {
			setLoading(false);
		}
	}, [logger]);
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
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$30 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "کافه خانه" },
			{
				name: "description",
				content: "خانه دوم شما، یک فنجان آرامش"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "preload",
				href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;900&display=swap",
				as: "style"
			},
			{
				rel: "stylesheet",
				href: styles_default
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fa",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$30.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentWorkspaceProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CmsSyncProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			richColors: true,
			position: "top-center"
		})] }) })
	});
}
/**
* NAMA Platform — Public Provisioning Page.
* Multi-step form for creating a new workspace/site from a blueprint.
*/
var $$splitComponentImporter$17 = () => import("./provision-B6XUseWW.mjs");
var Route$29 = createFileRoute("/provision")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./admin-CO8eKeL_.mjs");
var Route$28 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "پنل مدیریت" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var Route$27 = createFileRoute("/test/")({ beforeLoad: () => {
	throw redirect({ to: "/test/info" });
} });
var $$splitComponentImporter$15 = () => import("./admin.index-Bj4h5XfD.mjs");
var Route$26 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./test.result-C2jN_Up4.mjs");
var Route$25 = createFileRoute("/test/result")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData({
			queryKey: QK.theme,
			queryFn: fetchThemeSettings
		});
	},
	head: () => ({ meta: [{ title: "نتیجه‌ی تست شخصیت — کافه خانه" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./test.info-CAivAv4F.mjs");
var Route$24 = createFileRoute("/test/info")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData({
			queryKey: QK.theme,
			queryFn: fetchThemeSettings
		});
	},
	head: () => ({ meta: [{ title: "تست شخصیت کافه‌ای — کافه خانه" }, {
		name: "description",
		content: "اطلاعات خودت رو وارد کن و تست شخصیت کافه‌ای رو شروع کن."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./test._step-DR0JYA21.mjs");
var Route$23 = createFileRoute("/test/$step")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData({
			queryKey: QK.theme,
			queryFn: fetchThemeSettings
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
/** The sequential steps in the provisioning pipeline. */
var ProvisionStep = /* @__PURE__ */ function(ProvisionStep) {
	ProvisionStep["VALIDATE_REQUEST"] = "validate_request";
	ProvisionStep["CREATE_WORKSPACE"] = "create_workspace";
	/** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
	ProvisionStep["ASSIGN_OWNER"] = "assign_owner";
	/** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
	ProvisionStep["ASSIGN_PLAN"] = "assign_plan";
	ProvisionStep["INSTALL_BLUEPRINT"] = "install_blueprint";
	/** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
	ProvisionStep["CREATE_PAGES"] = "create_pages";
	/** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
	ProvisionStep["CREATE_NAVIGATION"] = "create_navigation";
	/** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
	ProvisionStep["INSERT_BLOCKS"] = "insert_blocks";
	/** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
	ProvisionStep["INSERT_CMS_DATA"] = "insert_cms_data";
	ProvisionStep["SEED_DATA"] = "seed_data";
	ProvisionStep["INSERT_THEME"] = "insert_theme";
	ProvisionStep["INSERT_FONTS"] = "insert_fonts";
	ProvisionStep["INSERT_DEFAULT_MEDIA"] = "insert_default_media";
	ProvisionStep["INSERT_ANALYTICS_DEFAULTS"] = "insert_analytics_defaults";
	ProvisionStep["RUN_HEALTH_CHECK"] = "run_health_check";
	ProvisionStep["WORKSPACE_READY"] = "workspace_ready";
	return ProvisionStep;
}({});
/** Labels for each pipeline step (including deprecated values for backward compatibility). */
var PROVISION_STEP_LABELS = {
	["validate_request"]: "Validate Request",
	["create_workspace"]: "Create Workspace",
	["assign_owner"]: "Assign Owner",
	["assign_plan"]: "Assign Plan",
	["install_blueprint"]: "Install Blueprint",
	["create_pages"]: "Create Pages",
	["create_navigation"]: "Create Navigation",
	["insert_blocks"]: "Insert Blocks",
	["insert_cms_data"]: "Insert CMS Data",
	["seed_data"]: "Seed Data",
	["insert_theme"]: "Insert Theme",
	["insert_fonts"]: "Insert Fonts",
	["insert_default_media"]: "Insert Default Media",
	["insert_analytics_defaults"]: "Insert Analytics Defaults",
	["run_health_check"]: "Run Health Check",
	["workspace_ready"]: "Workspace Ready"
};
/** Ordered list of pipeline steps — consolidated from the original 15 to 10 meaningful steps. */
var PROVISION_PIPELINE = [
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
/**
* NAMA Platform — Provision Validation.
*
* Zod schemas for provision operations, blueprint definitions,
* and provision requests. Everything is DATA-driven.
*/
var blueprintPageSchema = objectType({
	key: stringType().min(1),
	title: stringType().min(1),
	path: stringType().min(1),
	blockKeys: arrayType(stringType())
});
var blueprintBlockDefinitionSchema = objectType({
	key: stringType().min(1),
	type: stringType().min(1),
	data: recordType(unknownType()).default({}),
	sortOrder: numberType().int().default(0)
});
var blueprintThemeSchema = objectType({
	presetId: stringType().min(1),
	overrides: objectType({
		primaryColor: stringType().optional(),
		secondaryColor: stringType().optional(),
		accentColor: stringType().optional(),
		backgroundColor: stringType().optional(),
		textColor: stringType().optional(),
		textSecondaryColor: stringType().optional(),
		textTertiaryColor: stringType().optional(),
		borderRadius: stringType().optional(),
		glassOpacity: numberType().min(0).max(1).optional()
	}).optional()
});
var blueprintNavigationEntrySchema = objectType({
	title: stringType().min(1),
	path: stringType().min(1),
	sortOrder: numberType().int().default(0)
});
var blueprintFontConfigSchema = objectType({
	body: stringType().default("inherit"),
	heading: stringType().default("inherit"),
	importGoogleFonts: booleanType().default(false),
	imports: arrayType(stringType()).optional()
});
var blueprintSEOConfigSchema = objectType({
	title: stringType().default(""),
	description: stringType().default(""),
	ogImage: stringType().optional(),
	additionalMeta: recordType(stringType()).optional()
});
var blueprintAnalyticsConfigSchema = objectType({
	enabled: booleanType().default(true),
	provider: stringType().optional().default("supabase")
});
var blueprintMenuItemEntrySchema = objectType({
	category: stringType().min(1),
	name: stringType().min(1),
	description: stringType().default(""),
	price: stringType().default(""),
	imageUrl: stringType().optional().default(""),
	sortOrder: numberType().int().default(0)
});
var blueprintGalleryEntrySchema = objectType({
	title: stringType().default(""),
	tags: arrayType(stringType()).default([]),
	sortOrder: numberType().int().default(0)
});
var blueprintPersonalityEntrySchema = objectType({
	key: stringType().min(1),
	label: stringType().min(1),
	tagline: stringType().default(""),
	description: stringType().default(""),
	traits: arrayType(stringType()).default([]),
	drink: stringType().optional(),
	spot: stringType().optional(),
	colorFrom: stringType().optional(),
	colorTo: stringType().optional()
});
var blueprintMediaFolderSchema = objectType({
	path: stringType().min(1),
	description: stringType().default("")
});
var blueprintPermissionsSchema = objectType({
	admin: arrayType(stringType()).default([]),
	member: arrayType(stringType()).default([]),
	viewer: arrayType(stringType()).default([])
});
var blueprintMetadataSchema = objectType({
	createdBy: stringType().default("system"),
	createdAt: stringType().datetime().optional(),
	updatedAt: stringType().datetime().optional(),
	tags: arrayType(stringType()).default([]),
	isPublished: booleanType().default(true)
});
var blueprintSchema = objectType({
	id: stringType().min(1),
	slug: stringType().min(1),
	version: stringType().min(1),
	name: stringType().min(1),
	description: stringType().default(""),
	category: stringType().min(1),
	pages: arrayType(blueprintPageSchema).default([]),
	blocks: arrayType(blueprintBlockDefinitionSchema).default([]),
	theme: blueprintThemeSchema,
	navigation: arrayType(blueprintNavigationEntrySchema).default([]),
	fonts: blueprintFontConfigSchema.default({
		body: "inherit",
		heading: "inherit",
		importGoogleFonts: false
	}),
	seo: blueprintSEOConfigSchema.default({
		title: "",
		description: ""
	}),
	analytics: blueprintAnalyticsConfigSchema.default({ enabled: true }),
	menus: arrayType(blueprintMenuItemEntrySchema).default([]),
	gallery: arrayType(blueprintGalleryEntrySchema).default([]),
	businessSettings: recordType(unknownType()).default({}),
	personalitySettings: arrayType(blueprintPersonalityEntrySchema).default([]),
	mediaFolderStructure: arrayType(blueprintMediaFolderSchema).default([]),
	permissions: blueprintPermissionsSchema.default({
		admin: [],
		member: [],
		viewer: []
	}),
	metadata: blueprintMetadataSchema.default({
		createdBy: "system",
		tags: [],
		isPublished: true
	})
});
var provisionRequestSchema = objectType({
	blueprintSlug: stringType().min(1, "Blueprint slug is required"),
	blueprintVersion: stringType().optional(),
	workspaceName: stringType().min(1).max(200).optional(),
	workspaceDescription: stringType().max(2e3).optional(),
	domain: stringType().min(1).max(253).optional(),
	requestedSlug: stringType().min(3, "نامک باید حداقل ۳ کاراکتر باشد").max(30, "نامک نباید بیشتر از ۳۰ کاراکتر باشد").regex(/^[a-z0-9-]+$/, "فقط حروف کوچک لاتین، عدد و خط تیره مجاز است"),
	externalOrderId: stringType().min(1, "شناسه سفارش الزامی است"),
	customerEmail: stringType().email("ایمیل نامعتبر است"),
	businessName: stringType().min(2, "نام کسب‌وکار الزامی است"),
	ownerUserId: stringType().min(1).optional(),
	plan: workspacePlanSchema.optional().default("free"),
	locale: stringType().min(2).max(10).optional().default("fa-IR"),
	timezone: stringType().min(1).max(50).optional().default("Asia/Tehran"),
	metadata: recordType(unknownType()).optional()
});
blueprintSchema.pick({
	id: true,
	slug: true,
	version: true,
	name: true,
	description: true,
	category: true,
	metadata: true
});
var provisionStepResultSchema = objectType({
	step: enumType([
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
	]),
	success: booleanType(),
	startedAt: stringType().datetime(),
	completedAt: stringType().datetime().optional(),
	durationMs: numberType().int().optional(),
	error: stringType().optional(),
	output: recordType(unknownType()).optional()
});
var provisionTransactionSchema = objectType({
	id: stringType().min(1),
	workspaceId: stringType().min(1),
	blueprintId: stringType().min(1),
	blueprintVersion: stringType().min(1),
	status: enumType([
		"pending",
		"in_progress",
		"completed",
		"failed",
		"rolling_back",
		"rolled_back"
	]),
	initiatedBy: stringType().min(1).nullable().optional(),
	startedAt: stringType().datetime(),
	completedAt: stringType().datetime().optional(),
	steps: arrayType(provisionStepResultSchema).default([]),
	currentStepIndex: numberType().int().min(0).default(0),
	retryCount: numberType().int().min(0).default(0),
	maxRetries: numberType().int().min(0).default(3),
	error: stringType().optional()
});
objectType({
	transactionId: stringType().min(1),
	success: booleanType(),
	startedAt: stringType().datetime(),
	completedAt: stringType().datetime(),
	durationMs: numberType().int(),
	workspace: objectType({
		id: stringType(),
		name: stringType(),
		status: stringType(),
		plan: stringType()
	}),
	blueprint: objectType({
		id: stringType(),
		slug: stringType(),
		version: stringType(),
		name: stringType(),
		category: stringType()
	}),
	theme: objectType({
		presetId: stringType(),
		applied: booleanType()
	}),
	pages: objectType({
		total: numberType().int(),
		created: numberType().int()
	}),
	blocks: objectType({
		total: numberType().int(),
		inserted: numberType().int()
	}),
	navigation: objectType({
		total: numberType().int(),
		created: numberType().int()
	}),
	errors: arrayType(objectType({
		step: stringType(),
		message: stringType(),
		retried: booleanType(),
		recovered: booleanType()
	})),
	warnings: arrayType(objectType({
		step: stringType(),
		message: stringType()
	})),
	stepTimings: arrayType(objectType({
		step: stringType(),
		label: stringType(),
		durationMs: numberType().int(),
		success: booleanType()
	}))
});
/**
* Create an empty resource map for a session.
*/
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
/**
* Create a complete provision session.
*/
function createSession(context) {
	return {
		context,
		resourceMap: createResourceMap(context),
		stepMetrics: [],
		warnings: [],
		retryCount: 0
	};
}
/**
* Append a step metric to the session.
*/
function appendStepMetric(session, metric) {
	session.stepMetrics.push(metric);
}
ProvisionStep.VALIDATE_REQUEST, ProvisionStep.CREATE_WORKSPACE, ProvisionStep.INSTALL_BLUEPRINT, ProvisionStep.SEED_DATA, ProvisionStep.INSERT_THEME, ProvisionStep.INSERT_FONTS, ProvisionStep.INSERT_DEFAULT_MEDIA, ProvisionStep.INSERT_ANALYTICS_DEFAULTS, ProvisionStep.RUN_HEALTH_CHECK, ProvisionStep.WORKSPACE_READY;
/**
* Calculate delay based on retry policy.
* Returns delay in ms, or -1 if no retry should be attempted.
*/
function getRetryDelayMs(policy, attempt, _error) {
	switch (policy.type) {
		case "never": return -1;
		case "immediate": return attempt < policy.maxRetries ? 0 : -1;
		case "exponential": {
			if (attempt >= policy.maxRetries) return -1;
			const base = policy.baseDelayMs ?? 1e3;
			const max = policy.maxDelayMs ?? 3e4;
			const delay = base * Math.pow(2, attempt);
			return Math.min(delay, max);
		}
		case "linear":
			if (attempt >= policy.maxRetries) return -1;
			return policy.delayMs ?? 1e3;
		case "custom": {
			const result = policy.shouldRetry(attempt, _error);
			return result !== null ? result : -1;
		}
	}
}
/**
* Create the command registry — maps each pipeline step to its command.
* This is the single source of truth for the pipeline.
*/
function createStepRegistry() {
	const registry = /* @__PURE__ */ new Map();
	registry.set(ProvisionStep.VALIDATE_REQUEST, {
		step: ProvisionStep.VALIDATE_REQUEST,
		label: "Validate Request",
		retryPolicy: { type: "never" },
		async execute() {
			return { validated: true };
		},
		async rollback() {}
	});
	registry.set(ProvisionStep.CREATE_WORKSPACE, {
		step: ProvisionStep.CREATE_WORKSPACE,
		label: "Create Workspace",
		retryPolicy: {
			type: "exponential",
			maxRetries: 3,
			baseDelayMs: 500,
			maxDelayMs: 5e3
		},
		async execute() {
			return { workspaceCreated: true };
		},
		async rollback(_blueprint, _workspaceId, repos) {}
	});
	registry.set(ProvisionStep.INSTALL_BLUEPRINT, {
		step: ProvisionStep.INSTALL_BLUEPRINT,
		label: "Install Blueprint",
		retryPolicy: {
			type: "exponential",
			maxRetries: 3,
			baseDelayMs: 1e3,
			maxDelayMs: 1e4
		},
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
				await repos.siteContent.installBlueprintSEO({
					title: blueprint.seo.title,
					description: blueprint.seo.description,
					ogImage: blueprint.seo.ogImage
				}, workspaceId, resourceMap);
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
			if (resourceMap.pageBlockIds.length > 0) await repos.pages.batchDelete(resourceMap.pageBlockIds);
			if (resourceMap.menuItemIds.length > 0) await repos.menu.batchDelete(resourceMap.menuItemIds);
			if (resourceMap.galleryImageIds.length > 0) await repos.gallery.batchDelete(resourceMap.galleryImageIds);
			if (resourceMap.personalityKeys.length > 0) await repos.personality.batchDelete(resourceMap.personalityKeys);
			if (resourceMap.siteContentKeys.length > 0) {
				const allKeys = [...resourceMap.siteContentKeys];
				if (resourceMap.navigationKey) allKeys.push(resourceMap.navigationKey);
				allKeys.push(`provision:log:${workspaceId}:${_blueprint.slug}:${_blueprint.version}`);
				await repos.siteContent.batchDeleteByKeys(allKeys);
			}
		}
	});
	registry.set(ProvisionStep.SEED_DATA, {
		step: ProvisionStep.SEED_DATA,
		label: "Seed Data",
		retryPolicy: {
			type: "exponential",
			maxRetries: 2,
			baseDelayMs: 500,
			maxDelayMs: 5e3
		},
		async execute(blueprint, workspaceId, repos, session) {
			const resourceMap = session.resourceMap;
			const results = {};
			if (blueprint.mediaFolderStructure.length > 0) {
				const folderKeys = blueprint.mediaFolderStructure.map((f) => `media_folder:${workspaceId}:${f.path}`);
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
				if (!await repos.siteContent.getByKey(fontKey)) {
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
			const keysToRemove = session.resourceMap.siteContentKeys.filter((k) => k.startsWith(`media_folder:${workspaceId}:`) || k === "fonts_config");
			if (keysToRemove.length > 0) await repos.siteContent.batchDeleteByKeys(keysToRemove);
		}
	});
	registry.set(ProvisionStep.INSERT_THEME, {
		step: ProvisionStep.INSERT_THEME,
		label: "Insert Theme",
		retryPolicy: {
			type: "exponential",
			maxRetries: 2,
			baseDelayMs: 500,
			maxDelayMs: 5e3
		},
		async execute(blueprint, _workspaceId, repos, session) {
			await repos.theme.installBlueprintTheme(blueprint.theme);
			session.resourceMap.themeInstalled = true;
			return { presetId: blueprint.theme.presetId };
		},
		async rollback() {}
	});
	registry.set(ProvisionStep.INSERT_FONTS, {
		step: ProvisionStep.INSERT_FONTS,
		label: "Insert Fonts",
		retryPolicy: {
			type: "immediate",
			maxRetries: 1
		},
		async execute(blueprint) {
			return {
				body: blueprint.fonts.body,
				heading: blueprint.fonts.heading
			};
		},
		async rollback() {}
	});
	registry.set(ProvisionStep.INSERT_DEFAULT_MEDIA, {
		step: ProvisionStep.INSERT_DEFAULT_MEDIA,
		label: "Insert Default Media",
		retryPolicy: {
			type: "exponential",
			maxRetries: 2,
			baseDelayMs: 500,
			maxDelayMs: 5e3
		},
		async execute(blueprint, workspaceId, repos, session) {
			const resourceMap = session.resourceMap;
			const folderKeys = blueprint.mediaFolderStructure.map((f) => `media_folder:${workspaceId}:${f.path}`);
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
			const mediaKeys = session.resourceMap.siteContentKeys.filter((k) => k.startsWith(`media_folder:${workspaceId}:`));
			if (mediaKeys.length > 0) await repos.siteContent.batchDeleteByKeys(mediaKeys);
		}
	});
	registry.set(ProvisionStep.INSERT_ANALYTICS_DEFAULTS, {
		step: ProvisionStep.INSERT_ANALYTICS_DEFAULTS,
		label: "Insert Analytics Defaults",
		retryPolicy: {
			type: "immediate",
			maxRetries: 1
		},
		async execute(blueprint, workspaceId, repos, session) {
			await repos.siteContent.installBlueprintAnalytics(blueprint.analytics, workspaceId, session.resourceMap);
			return { enabled: blueprint.analytics.enabled };
		},
		async rollback(_blueprint, workspaceId, repos) {
			const analyticsKey = `analytics_config:${workspaceId}`;
			await repos.siteContent.deleteByKey(analyticsKey);
		}
	});
	registry.set(ProvisionStep.RUN_HEALTH_CHECK, {
		step: ProvisionStep.RUN_HEALTH_CHECK,
		label: "Run Health Check",
		retryPolicy: { type: "never" },
		async execute() {
			return {
				healthy: true,
				checks: 0
			};
		},
		async rollback() {}
	});
	registry.set(ProvisionStep.WORKSPACE_READY, {
		step: ProvisionStep.WORKSPACE_READY,
		label: "Workspace Ready",
		retryPolicy: {
			type: "immediate",
			maxRetries: 2
		},
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
		if (!validation.valid) throw new Error(`Provision validation failed: ${validation.error}`);
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
			this.deps.logger.info(`Provision complete: ${blueprint.name} → workspace ${workspaceId}`, {
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
	/**
	* Execute all pipeline steps in order using the Command Pattern.
	* Each step is executed via its command's execute() method.
	* On failure, rollback() is called on each completed step in reverse order.
	*/
	async _executePipeline(blueprint, session) {
		for (const step of PROVISION_PIPELINE) {
			const command = this.deps.stepRegistry.get(step);
			if (!command) throw new Error(`No command registered for step: ${step}`);
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
				const output = await command.execute(blueprint, session.context.workspaceId, this.deps.repos, session);
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
					this.deps.logger.warn(`Retrying step ${command.label} (attempt ${retryCount}) after ${delay}ms`, {
						source: "provision-engine",
						transactionId: session.context.transactionId,
						workspaceId: session.context.workspaceId
					});
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
				await command.rollback(blueprint, session.context.workspaceId, this.deps.repos, session);
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
	/**
	* Create workspace using the existing WorkspaceFactory.
	* The factory owns all construction logic — engine never constructs directly.
	*/
	async _createWorkspace(blueprint, request) {
		const entity = createWorkspace({
			name: request.workspaceName ?? blueprint.name,
			description: request.workspaceDescription ?? blueprint.description,
			ownerUserId: request.ownerUserId ?? null,
			plan: request.plan ?? "free",
			locale: request.locale ?? "fa-IR",
			timezone: request.timezone ?? "Asia/Tehran",
			domain: request.domain
		});
		await this.deps.workspaceRepository.save(entity);
		this.deps.logger.info(`Workspace created for provisioning: ${entity.id}`, {
			source: "provision-engine",
			blueprint: blueprint.slug,
			plan: entity.plan
		});
		return entity.id;
	}
	async _handleFailure(tx, blueprint, session, err) {
		const message = err instanceof Error ? err.message : String(err);
		this.deps.logger.error(`Provision failed for transaction ${tx.id}: ${message}`, {
			source: "provision-engine",
			transactionId: tx.id,
			workspaceId: tx.workspaceId
		});
		if (session.stepMetrics.length > 0) await this._rollbackCompletedSteps(blueprint, session);
		if (session.rollback) if (session.rollback.success) this.deps.logger.info(`Full rollback successful for transaction ${tx.id}`, {
			source: "provision-engine",
			transactionId: tx.id,
			workspaceId: tx.workspaceId
		});
		else this.deps.logger.error(`Partial rollback for transaction ${tx.id} — some data may remain`, {
			source: "provision-engine",
			transactionId: tx.id,
			workspaceId: tx.workspaceId
		});
		await this.deps.transactionManager.updateStatus(tx.id, "failed");
	}
	async _getWorkspaceInfo(workspaceId) {
		try {
			const entity = await this.deps.workspaceRepository.findById(workspaceId);
			if (entity) return {
				id: workspaceId,
				name: entity.metadata.name,
				status: entity.status,
				plan: entity.plan
			};
		} catch (err) {
			this.deps.logger.warn(`Could not fetch workspace info for ${workspaceId}`, {
				source: "provision-engine",
				workspaceId,
				cause: err instanceof Error ? err.message : String(err)
			});
		}
		return {
			id: workspaceId,
			name: "Unknown",
			status: "unknown",
			plan: "free"
		};
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
/**
* NAMA Platform — Blueprint Registry.
*
* Stores and retrieves blueprint definitions.
* Blueprints are DATA — they are stored in site_content like workspace entities.
* Each blueprint is stored with a key pattern: blueprint:{slug}:{version}
*
* The registry is the single source of truth for available blueprints.
* All blueprints are DATA, never hardcoded React components.
*/
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
		const meta = parsed.metadata ?? {
			createdBy: "system",
			tags: [],
			isPublished: true,
			createdAt: now,
			updatedAt: now
		};
		const metaUpdated = {
			...meta,
			updatedAt: now,
			createdAt: meta.createdAt ?? now
		};
		const fullBlueprint = {
			...parsed,
			metadata: metaUpdated
		};
		const key = blueprintKey(fullBlueprint.slug, fullBlueprint.version);
		const { error } = await this.db.from("site_content").upsert({
			key,
			value: fullBlueprint,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (error) throw this.normalizeError("site_content", "blueprint.register", error, { key });
		await this._updateIndex(fullBlueprint);
		this.logger.info(`Blueprint registered: ${fullBlueprint.slug} v${fullBlueprint.version}`, { source: "blueprint" });
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
			throw this.normalizeError("site_content", "blueprint.getByVersion", err, {
				slug,
				version
			});
		}
	}
	/**
	* Get the latest version of a blueprint by slug.
	* Returns null if no blueprint with that slug exists.
	*/
	async getLatest(slug) {
		try {
			const entries = (await this._loadIndex()).entries.filter((e) => e.slug === slug && e.isPublished).sort((a, b) => b.version.localeCompare(a.version, void 0, { numeric: true }));
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
				if (!existing || entry.version.localeCompare(existing.version, void 0, { numeric: true }) > 0) latest.set(entry.slug, entry);
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
			return (await this._loadIndex()).entries.filter((e) => e.slug === slug).sort((a, b) => b.version.localeCompare(a.version, void 0, { numeric: true }));
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
			index.entries = index.entries.filter((e) => !(e.slug === slug && e.version === version));
			await this._saveIndex(index);
			this.logger.info(`Blueprint deleted: ${slug} v${version}`, { source: "blueprint" });
		} catch (err) {
			throw this.normalizeError("site_content", "blueprint.delete", err, {
				slug,
				version
			});
		}
	}
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
		index.entries = index.entries.filter((e) => !(e.slug === blueprint.slug && e.version === blueprint.version));
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
		return getCache().getOrFetch("blueprints", cacheKey, async () => {
			if (version) {
				const blueprint = await this.registry.getByVersion(slug, version);
				if (!blueprint) return null;
				return blueprint;
			}
			const latest = await this.registry.getLatest(slug);
			if (!latest) return null;
			return latest;
		});
	}
	/**
	* Load a blueprint by slug and version, throwing if not found.
	*/
	async loadOrThrow(slug, version) {
		const blueprint = await this.load(slug, version);
		if (!blueprint) throw new Error(`Blueprint not found: ${slug}@${version ?? "latest"}`);
		return blueprint;
	}
	/**
	* Check if a blueprint exists (slug + optional version).
	*/
	async exists(slug, version) {
		return await this.load(slug, version) !== null;
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
/**
* Blueprint Version Manager.
*
* Blueprints are versioned data definitions.
* Version changes do NOT modify existing provisioned workspaces —
* they only affect future provisions.
*
* ENTERPRISE HARDENING:
* - Supports upgrade/downgrade between any two versions
* - Generates migration plans with step-by-step instructions
* - Checks compatibility matrix before provisioning
* - Maintains changelog for audit trail
*/
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
		return {
			major,
			minor,
			patch
		};
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
		if (versions.length === 0) return "1.0.0";
		const latest = versions.sort((a, b) => b.version.localeCompare(a.version, void 0, { numeric: true }))[0];
		const parsed = this.parse(latest.version);
		if (!parsed) return "1.0.0";
		switch (bump) {
			case "major": return this.format(parsed.major + 1, 0, 0);
			case "minor": return this.format(parsed.major, parsed.minor + 1, 0);
			case "patch": return this.format(parsed.major, parsed.minor, parsed.patch + 1);
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
		const versionStrings = (await this.registry.listVersions(slug)).map((v) => v.version).sort((a, b) => this.compare(a, b));
		const fromIdx = versionStrings.indexOf(from);
		const toIdx = versionStrings.indexOf(to);
		if (fromIdx === -1) return {
			from,
			to,
			stepCount: 0,
			possible: false,
			reason: `Source version "${from}" not found in registry`,
			steps: []
		};
		if (toIdx === -1) return {
			from,
			to,
			stepCount: 0,
			possible: false,
			reason: `Target version "${to}" not found in registry`,
			steps: []
		};
		if (fromIdx === toIdx) return {
			from,
			to,
			stepCount: 0,
			possible: true,
			steps: []
		};
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
		const sorted = (await this.registry.listVersions(slug)).sort((a, b) => this.compare(b.version, a.version));
		const changelog = [];
		let previousVersion = null;
		for (const entry of sorted) {
			const severity = previousVersion ? this.getBreakingChangeSeverity(entry.version, previousVersion) : "none";
			const changes = [];
			if (severity === "major") changes.push(`Breaking changes from ${previousVersion}`);
			else if (severity === "minor") changes.push(`New features added from ${previousVersion}`);
			else if (severity === "patch" && previousVersion) changes.push(`Bug fixes and improvements from ${previousVersion}`);
			else changes.push("Initial release");
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
		const latest = versions.sort((a, b) => b.version.localeCompare(a.version, void 0, { numeric: true }))[0];
		return this.getBreakingChangeSeverity(latest.version, targetVersion) !== "major";
	}
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
				actions.push(`Run migration: ${from} → ${to}`);
				actions.push("Verify all pages render correctly after migration");
				break;
			case "minor":
				actions.push("Review new features available in new version");
				actions.push("Update any optional integrations");
				actions.push(`Run migration: ${from} → ${to}`);
				break;
			case "patch":
				actions.push("Apply patch update");
				actions.push("Verify no regressions");
				break;
			case "none": break;
		}
		return actions;
	}
};
/**
* NAMA Platform — Provision Transaction.
*
* Transaction manager for the provisioning pipeline.
* Tracks each step's execution state, manages the transaction log,
* and coordinates with the rollback mechanism.
*
* Every provision is transactional — if one step fails, the system
* never leaves partial data. It either rolls back or retries.
*/
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
		if (status === "completed" || status === "failed" || status === "rolled_back") tx.completedAt = (/* @__PURE__ */ new Date()).toISOString();
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
		if (existingIndex >= 0) tx.steps[existingIndex] = stepResult;
		else tx.steps.push(stepResult);
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
		if (tx.currentStepIndex >= PROVISION_PIPELINE.length) return null;
		return PROVISION_PIPELINE[tx.currentStepIndex];
	}
	/**
	* Calculate the total duration of a transaction.
	*/
	getDuration(tx) {
		const start = new Date(tx.startedAt).getTime();
		return (tx.completedAt ? new Date(tx.completedAt).getTime() : Date.now()) - start;
	}
	async _save(tx) {
		this.validateOrThrow(provisionTransactionSchema, tx, "provision.transaction.save");
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
		if (!data) throw new Error(`Provision transaction not found: ${txId}`);
		const result = provisionTransactionSchema.safeParse(data.value);
		if (!result.success) throw new Error(`Invalid provision transaction data: ${txId}`);
		return result.data;
	}
};
/**
* NAMA Platform — Provision Validator.
*
* Validates provision requests before the pipeline starts.
* All validation is DATA-driven — checks blueprint existence,
* user permissions, plan compatibility, and request integrity.
*
* ENTERPRISE FEATURES:
* - Schema validation: Full blueprint data structure check
* - Duplicate detection: Detect duplicate IDs, keys, and block keys
* - Dependency graph: Verify all referenced blocks exist
* - Version compatibility: Check blueprint version compatibility
* - Workspace readiness: Verify workspace limits and user capacity
* - Theme compatibility: Ensure theme preset is valid
*/
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
		if (!parsed.success) return {
			valid: false,
			error: `Invalid request: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
			warnings
		};
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
			if (errorIssues.length > 0) return {
				valid: false,
				error: `Blueprint data validation failed: ${errorIssues.join("; ")}`,
				warnings: [...warnings, ...warningIssues]
			};
			warnings.push(...warningIssues);
		}
		if (!blueprint.metadata.isPublished) warnings.push(`Blueprint "${blueprint.name}" is not published — provisioning with unpublished blueprint`);
		try {
			if (data.ownerUserId) {
				const userWorkspaces = await this.workspaceRepository.findByUserId(data.ownerUserId);
				if (userWorkspaces.length > 0) warnings.push(`User already has ${userWorkspaces.length} workspace(s) — creating another`);
			}
		} catch {
			warnings.push("Could not verify owner user — proceeding with provision");
		}
		if ([
			"free",
			"starter",
			"pro",
			"enterprise"
		].indexOf(data.plan ?? "free") < 0) warnings.push(`Unknown plan: ${data.plan} — using free plan`);
		if (blueprint.metadata.updatedAt) {
			if (Date.now() - new Date(blueprint.metadata.updatedAt).getTime() > 720 * 60 * 60 * 1e3) warnings.push(`Blueprint "${blueprint.name}" v${blueprint.version} has not been updated in over 30 days — consider checking for a newer version`);
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
		if (!schemaResult.success) for (const issue of schemaResult.error.issues) issues.push({
			level: "error",
			category: "schema",
			message: `${issue.path.join(".")}: ${issue.message}`,
			field: issue.path.join(".")
		});
		const pageKeys = /* @__PURE__ */ new Set();
		for (const page of blueprint.pages) {
			if (pageKeys.has(page.key)) issues.push({
				level: "error",
				category: "duplicate",
				message: `Duplicate page key: "${page.key}"`,
				field: `pages[${page.key}]`
			});
			pageKeys.add(page.key);
		}
		const blockKeys = /* @__PURE__ */ new Set();
		for (const block of blueprint.blocks) {
			if (blockKeys.has(block.key)) issues.push({
				level: "error",
				category: "duplicate",
				message: `Duplicate block key: "${block.key}"`,
				field: `blocks[${block.key}]`
			});
			blockKeys.add(block.key);
		}
		const allBlockKeys = new Set(blueprint.blocks.map((b) => b.key));
		for (const page of blueprint.pages) for (const blockKey of page.blockKeys) if (!allBlockKeys.has(blockKey)) issues.push({
			level: "error",
			category: "dependency",
			message: `Page "${page.key}" references unknown block key: "${blockKey}"`,
			field: `pages[${page.key}].blockKeys`
		});
		const referencedKeys = /* @__PURE__ */ new Set();
		for (const page of blueprint.pages) for (const key of page.blockKeys) referencedKeys.add(key);
		for (const block of blueprint.blocks) if (!referencedKeys.has(block.key)) issues.push({
			level: "warning",
			category: "dependency",
			message: `Block "${block.key}" is not referenced by any page — may be unused`,
			field: `blocks[${block.key}]`
		});
		if (!blueprint.theme.presetId || blueprint.theme.presetId.trim() === "") issues.push({
			level: "warning",
			category: "theme",
			message: "No theme preset specified — will use default theme",
			field: "theme.presetId"
		});
		for (let i = 0; i < blueprint.navigation.length; i++) {
			const nav = blueprint.navigation[i];
			if (!nav.title || !nav.path) issues.push({
				level: "error",
				category: "schema",
				message: `Navigation item at index ${i} is missing title or path`,
				field: `navigation[${i}]`
			});
		}
		const pagePaths = /* @__PURE__ */ new Set();
		for (const page of blueprint.pages) {
			if (pagePaths.has(page.path)) issues.push({
				level: "error",
				category: "duplicate",
				message: `Duplicate page path: "${page.path}" (pages "${page.key}" and others)`,
				field: `pages[${page.key}].path`
			});
			pagePaths.add(page.path);
		}
		if (!blueprint.seo.title || !blueprint.seo.description) issues.push({
			level: "warning",
			category: "schema",
			message: "SEO title or description is missing — search engines may not display results correctly",
			field: "seo"
		});
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
		if (!parsed.success) return {
			valid: false,
			error: parsed.error.issues.map((i) => i.message).join("; ")
		};
		return { valid: true };
	}
};
var ProvisionReportGenerator = class {
	/**
	* Generate a complete provision report from a transaction and blueprint.
	* Accepts an optional ProvisionSession for expanded metrics.
	*/
	generate(transaction, blueprint, workspaceInfo, session) {
		const completedAt = transaction.completedAt ?? (/* @__PURE__ */ new Date()).toISOString();
		const startTime = new Date(transaction.startedAt).getTime();
		const durationMs = new Date(completedAt).getTime() - startTime;
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
		if (sessionData?.sessionWarnings) warnings.push(...sessionData.sessionWarnings);
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
		const divider = "═".repeat(60);
		const subDivider = "─".repeat(60);
		lines.push(divider);
		lines.push(`  PROVISION REPORT`);
		lines.push(divider);
		lines.push(`  Status:       ${report.success ? "✓ SUCCESS" : "✗ FAILED"}`);
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
			lines.push(`    Success:   ${rollbackInfo.success ? "✓" : "✗"}`);
			if (rollbackInfo.durationMs != null) lines.push(`    Duration:  ${this._formatDuration(rollbackInfo.durationMs)}`);
			if (rollbackInfo.error) lines.push(`    Error:     ${rollbackInfo.error}`);
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
				lines.push(`    ✗ [${err.step}] ${err.message}`);
				if (err.retried) lines.push(`      (retried, recovered: ${err.recovered})`);
			}
			lines.push("");
		}
		if (report.warnings.length > 0) {
			lines.push(`  Warnings (${report.warnings.length}):`);
			for (const w of report.warnings) lines.push(`    ! [${w.step}] ${w.message}`);
			lines.push("");
		}
		lines.push(subDivider);
		lines.push(`  Step Timings:`);
		lines.push(subDivider);
		for (const st of report.stepTimings) {
			const icon = st.success ? "✓" : "✗";
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
		return {
			rollbackInfo,
			retryStats,
			resourceCounts: {
				pageBlocks: rm.pageBlockIds.length,
				menuItems: rm.menuItemIds.length,
				galleryImages: rm.galleryImageIds.length,
				personalityKeys: rm.personalityKeys.length,
				siteContentKeys: rm.siteContentKeys.length,
				mediaFileIds: rm.mediaFileIds.length
			},
			sessionWarnings: session.warnings.map((w) => ({
				step: w.step,
				message: w.message
			})),
			stepTimings: session.stepMetrics.map((m) => ({
				step: m.step,
				label: PROVISION_STEP_LABELS[m.step] ?? m.step,
				durationMs: m.durationMs,
				success: m.success,
				retryCount: m.retryCount,
				output: m.output
			}))
		};
	}
	_findStep(steps, stepName) {
		return steps.find((s) => s.step === stepName);
	}
	_formatDuration(ms) {
		if (ms < 1e3) return `${ms}ms`;
		if (ms < 6e4) return `${(ms / 1e3).toFixed(1)}s`;
		return `${Math.floor(ms / 6e4)}m ${Math.round(ms % 6e4 / 1e3)}s`;
	}
};
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
	/**
	* Start the provisioning pipeline for a new website.
	* One Request → One Ready Website.
	*/
	async provision(input) {
		return this.engine.provision(input);
	}
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
var fullDomain$1 = (slug) => `${slug}.${PLATFORM_DOMAIN}`;
var Route$22 = createFileRoute("/api/provision")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({
			success: false,
			error: "invalid JSON body"
		}, { status: 400 });
	}
	const p = body ?? {};
	const slug = String(p.slug ?? "");
	if (slug.length < 3) return Response.json({
		success: false,
		error: "slug must be at least 3 characters"
	}, { status: 400 });
	const logger = getLogger();
	const { createSupabaseAdminProviders } = await import("./supabase-B2jjn2gh.mjs").then((n) => n.n).then((n) => n.n);
	const repoDeps = {
		...createSupabaseAdminProviders(),
		logger
	};
	const provisionService = new ProvisionService({
		repositoryDependencies: repoDeps,
		workspaceRepository: new WorkspaceRepository(repoDeps)
	});
	const requestedSlug = String(p.blueprintSlug ?? "cafeteria");
	const resolved = await provisionService.getBlueprint(requestedSlug) ?? await provisionService.getBlueprint("cafeteria");
	if (!resolved) return Response.json({
		success: false,
		error: "no blueprint available"
	}, { status: 400 });
	const displayName = String(p.workspaceName ?? "My Site");
	const email = String(p.email ?? "");
	const input = {
		blueprintSlug: resolved.slug,
		requestedSlug: slug,
		externalOrderId: randomUUID(),
		businessName: displayName,
		customerEmail: email || `${slug}@nama.app`,
		workspaceName: displayName,
		domain: fullDomain$1(slug),
		metadata: {
			theme: p.theme,
			phone: p.phone,
			customerEmail: p.email
		}
	};
	const parsed = provisionRequestSchema.safeParse(input);
	if (!parsed.success) return Response.json({
		success: false,
		error: "validation_failed",
		issues: parsed.error.flatten()
	}, { status: 400 });
	let report;
	try {
		report = await provisionService.provision(parsed.data);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return Response.json({
			success: false,
			error: message
		}, { status: 500 });
	}
	if (report.success) return Response.json({
		success: true,
		workspaceId: report.workspace.id,
		domain: fullDomain$1(slug)
	}, { status: 201 });
	const message = report.errors?.map((e) => e.message).join("; ") || "provision failed";
	return Response.json({
		success: false,
		error: message
	}, { status: 500 });
} } } });
var Route$21 = createFileRoute("/api/health")({ server: { handlers: { GET: () => {
	return Response.json({ status: "ok" });
} } } });
var $$splitComponentImporter$11 = () => import("./admin.test-results-DEvekhyK.mjs");
var Route$20 = createFileRoute("/admin/test-results")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.test-questions-XL1F-oQo.mjs");
var Route$19 = createFileRoute("/admin/test-questions")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin.test-analytics-DS6wA9l9.mjs");
var Route$18 = createFileRoute("/admin/test-analytics")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.site-content-T_-VWcuB.mjs");
var Route$17 = createFileRoute("/admin/site-content")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.settings-BCNMsvPZ.mjs");
var Route$16 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.personality-types-kbDjiU75.mjs");
var Route$15 = createFileRoute("/admin/personality-types")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.page-M4M4-s0A.mjs");
var Route$14 = createFileRoute("/admin/page")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
/** Debounced block editor for the mobile drawer — prevents rapid mutations. */
var Route$13 = createFileRoute("/admin/notifications")({ beforeLoad: () => {
	throw redirect({ to: "/admin" });
} });
var $$splitComponentImporter$4 = () => import("./admin.menu-Dk61hj2m.mjs");
var Route$12 = createFileRoute("/admin/menu")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.media-DanxmLHt.mjs");
var Route$11 = createFileRoute("/admin/media")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.gallery-By4pJ7YN.mjs");
var Route$10 = createFileRoute("/admin/gallery")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var Route$9 = createFileRoute("/admin/forms")({ beforeLoad: () => {
	throw redirect({ to: "/admin" });
} });
var $$splitComponentImporter$1 = () => import("./admin.events-BLbk7qkc.mjs");
var Route$8 = createFileRoute("/admin/events")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var Route$7 = createFileRoute("/admin/calendar")({ beforeLoad: () => {
	throw redirect({ to: "/admin" });
} });
var Route$6 = createFileRoute("/admin/bookings")({ beforeLoad: () => {
	throw redirect({ to: "/admin" });
} });
var $$splitComponentImporter = () => import("./admin.analytics-B0EirMp5.mjs");
var Route$5 = createFileRoute("/admin/analytics")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$4 = createFileRoute("/admin/activity")({ beforeLoad: () => {
	throw redirect({ to: "/admin" });
} });
var Route$3 = createFileRoute("/api/public/provision-status")({ server: { handlers: { GET: async ({ request }) => {
	const externalOrderId = new URL(request.url).searchParams.get("externalOrderId");
	if (!externalOrderId) return Response.json({ error: "externalOrderId query parameter is required" }, { status: 400 });
	const { supabaseAdmin } = await import("./supabase-B2jjn2gh.mjs").then((n) => n.n).then((n) => n.r);
	const { data, error } = await supabaseAdmin.from("provision_transactions").select("*").eq("external_order_id", externalOrderId).maybeSingle();
	if (error) return Response.json({ error: error.message }, { status: 500 });
	if (!data) return Response.json({ found: false }, { status: 404 });
	let domain = null;
	if (data.workspace_id && data.status === "completed") {
		const { data: ws } = await supabaseAdmin.from("workspaces").select("domain").eq("id", data.workspace_id).maybeSingle();
		domain = ws?.domain ?? null;
	}
	return Response.json({
		externalOrderId,
		status: data.status === "completed" ? "ready" : data.status,
		domain,
		error: data.error ?? null
	});
} } } });
async function admin() {
	const { supabaseAdmin } = await import("./supabase-B2jjn2gh.mjs").then((n) => n.n).then((n) => n.r);
	return supabaseAdmin;
}
/** Find a provision transaction by its external order id (NULL if none). */
async function findTransactionByExternalOrderId(externalOrderId) {
	const { data, error } = await (await admin()).from("provision_transactions").select("*").eq("external_order_id", externalOrderId).maybeSingle();
	if (error) throw new Error(`idempotency lookup failed: ${error.message}`);
	return data ?? null;
}
/** Insert a new provision transaction row; returns its id. */
async function createTransaction(input) {
	const { data, error } = await (await admin()).from("provision_transactions").insert({
		external_order_id: input.externalOrderId,
		blueprint_slug: input.blueprintSlug,
		blueprint_version: input.blueprintVersion ?? "latest",
		workspace_id: input.workspaceId ?? null,
		status: input.status ?? "in_progress",
		initiated_by: input.initiatedBy ?? null
	}).select("id").single();
	if (error) throw new Error(`failed to create transaction: ${error.message}`);
	return data.id;
}
/** Patch a provision transaction (sets completed_at when terminal). */
async function updateTransaction(id, patch) {
	const db = await admin();
	const terminal = patch.status === "completed" || patch.status === "failed";
	const { error } = await db.from("provision_transactions").update({
		...patch.status ? { status: patch.status } : {},
		...patch.workspaceId !== void 0 ? { workspace_id: patch.workspaceId } : {},
		...patch.error !== void 0 ? { error: patch.error } : {},
		...terminal ? { completed_at: (/* @__PURE__ */ new Date()).toISOString() } : {}
	}).eq("id", id);
	if (error) throw new Error(`failed to update transaction: ${error.message}`);
}
var fullDomain = (slug) => `${slug}.${PLATFORM_DOMAIN}`;
function unauthorized() {
	return Response.json({
		success: false,
		error: "unauthorized"
	}, { status: 401 });
}
var Route$2 = createFileRoute("/api/public/provision")({ server: { handlers: { POST: async ({ request }) => {
	const expectedKey = process.env.NAMA_PUBLIC_API_KEY;
	const providedKey = request.headers.get("x-api-key");
	if (!expectedKey || providedKey !== expectedKey) return unauthorized();
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({
			success: false,
			error: "invalid JSON body"
		}, { status: 400 });
	}
	const parsed = provisionRequestSchema.safeParse(body);
	if (!parsed.success) return Response.json({
		success: false,
		error: "validation_failed",
		issues: parsed.error.flatten()
	}, { status: 400 });
	const input = parsed.data;
	const domain = fullDomain(input.requestedSlug);
	const existing = await findTransactionByExternalOrderId(input.externalOrderId);
	if (existing && existing.status === "completed") return Response.json({
		success: true,
		workspaceId: existing.workspace_id,
		domain,
		status: "already_exists"
	}, { status: 200 });
	let txId;
	if (existing && existing.status === "failed") {
		txId = existing.id;
		await updateTransaction(txId, {
			status: "in_progress",
			error: null
		});
	} else txId = await createTransaction({
		externalOrderId: input.externalOrderId,
		blueprintSlug: input.blueprintSlug,
		blueprintVersion: input.blueprintVersion
	});
	const logger = getLogger();
	const { createSupabaseAdminProviders } = await import("./supabase-B2jjn2gh.mjs").then((n) => n.n).then((n) => n.n);
	const repoDeps = {
		...createSupabaseAdminProviders(),
		logger
	};
	const provisionService = new ProvisionService({
		repositoryDependencies: repoDeps,
		workspaceRepository: new WorkspaceRepository(repoDeps)
	});
	const provisionInput = {
		...input,
		domain,
		workspaceName: input.businessName,
		metadata: {
			...input.metadata ?? {},
			customerEmail: input.customerEmail
		}
	};
	let report;
	try {
		report = await provisionService.provision(provisionInput);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		await updateTransaction(txId, {
			status: "failed",
			error: message
		});
		return Response.json({
			success: false,
			error: message
		}, { status: 500 });
	}
	if (report.success) {
		await updateTransaction(txId, {
			status: "completed",
			workspaceId: report.workspace.id,
			error: null
		});
		return Response.json({
			success: true,
			workspaceId: report.workspace.id,
			domain,
			status: "ready"
		}, { status: 201 });
	}
	const message = report.errors?.map((e) => e.message).join("; ") || "provision failed";
	await updateTransaction(txId, {
		status: "failed",
		error: message
	});
	return Response.json({
		success: false,
		error: message
	}, { status: 500 });
} } } });
var SLUG_RE = /^[a-z0-9-]{3,30}$/;
var Route$1 = createFileRoute("/api/public/check-slug")({ server: { handlers: { GET: async ({ request }) => {
	const slug = new URL(request.url).searchParams.get("slug");
	if (!slug) return Response.json({ error: "slug query parameter is required" }, { status: 400 });
	if (!SLUG_RE.test(slug)) return Response.json({
		available: false,
		reason: "invalid_slug"
	});
	const { createSupabaseAdminProviders } = await import("./supabase-B2jjn2gh.mjs").then((n) => n.n).then((n) => n.n);
	const existing = await new WorkspaceRepository({
		...createSupabaseAdminProviders(),
		logger: getLogger()
	}).findByDomain(`${slug}.${PLATFORM_DOMAIN}`);
	return Response.json({
		available: existing === null,
		...existing ? { reason: "taken" } : {}
	});
} } } });
var cafeteriaBlueprint = {
	id: "blueprint-cafeteria-default",
	slug: "cafeteria",
	version: "1.0.0",
	name: "Café Starter Kit",
	description: "A complete starter kit for cafés, including menu, gallery, personality quiz, testimonials, and events pages.",
	category: "restaurant",
	pages: [
		{
			key: "home",
			title: "Home",
			path: "/",
			blockKeys: [
				"hero-home",
				"about-home",
				"features-home"
			]
		},
		{
			key: "menu-page",
			title: "Menu",
			path: "/menu",
			blockKeys: ["gallery-menu"]
		},
		{
			key: "quiz",
			title: "شخصیت کافه‌ای تو",
			path: "/quiz",
			blockKeys: ["personality-quiz-section"]
		},
		{
			key: "testimonials",
			title: "نظرات مشتریان",
			path: "/testimonials",
			blockKeys: ["testimonials-list"]
		},
		{
			key: "events",
			title: "رویدادها",
			path: "/events",
			blockKeys: ["events-list"]
		}
	],
	blocks: [
		{
			key: "hero-home",
			type: "hero",
			data: {
				title: "کافه خانه",
				subtitle: "جایی که هر فنجان قهوه یک داستان جدید را آغاز می‌کند.",
				backgroundImage: "",
				buttonText: "مشاهده منو",
				buttonLink: "/menu"
			},
			sortOrder: 1
		},
		{
			key: "about-home",
			type: "text",
			data: {
				title: "درباره ما",
				content: "کافه خانه با فضایی گرم و دوستانه، مکانی ایده‌آل برای لذت بردن از بهترین قهوه‌ها، گفتگوهای صمیمی و لحظات بی‌نظیر است. ما از دانه‌های عربیکا و روبوستای مرغوب استفاده می‌کنیم."
			},
			sortOrder: 2
		},
		{
			key: "features-home",
			type: "feature-grid",
			data: {
				columns: 3,
				features: [
					{
						title: "قهوه تازه رُست‌شده",
						description: "۱۰۰٪ عربیکا و روبوستا"
					},
					{
						title: "فضای دنج",
						description: "مکانی آرام برای کار و گفتگو"
					},
					{
						title: "رویدادهای هفتگی",
						description: "موسیقی زنده، کتاب‌گردانی و بیشتر"
					}
				]
			},
			sortOrder: 3
		},
		{
			key: "gallery-menu",
			type: "media-gallery",
			data: {
				columns: 3,
				showLightbox: true,
				images: [
					{
						title: "لاته‌آرت زیبا",
						tags: ["coffee", "latte-art"],
						sortOrder: 1
					},
					{
						title: "فضای نشیمن دنج کافه",
						tags: ["interior", "cozy"],
						sortOrder: 2
					},
					{
						title: "شیرینی‌های تازه",
						tags: ["pastry", "dessert"],
						sortOrder: 3
					}
				]
			},
			sortOrder: 4
		},
		{
			key: "personality-quiz-section",
			type: "personality-quiz",
			data: {
				title: "شخصیت کافه‌ای تو چیه؟",
				description: "۱۱ سوال کوتاه — ببین کدام نوشیدنی با شخصیتت سازگارتر است.",
				totalQuestions: 11
			},
			sortOrder: 5
		},
		{
			key: "testimonials-list",
			type: "testimonial-slider",
			data: { items: [
				{
					name: "سارا م.",
					text: "قهوه‌شون واقعاً عالیه!",
					rating: 5
				},
				{
					name: "امین ر.",
					text: "مکان خوب برای کار کردن.",
					rating: 4
				},
				{
					name: "لیلا ک.",
					text: "لاته کاراملشون بهترین لاته‌ای بود که تا به حال خوردم!",
					rating: 5
				}
			] },
			sortOrder: 6
		},
		{
			key: "events-list",
			type: "event-list",
			data: { events: [{
				title: "موسیقی زنده — شنبه شب",
				description: "اجرای زنده پیانو و گیتار.",
				location: "سالن اصلی"
			}, {
				title: "کتاب‌گردانی شبانه",
				description: "جلسه هفتگی مطالعه و نقد کتاب.",
				location: "آی‌بِک کافه"
			}] },
			sortOrder: 7
		}
	],
	theme: {
		presetId: "café-rose-gold",
		overrides: {
			primaryColor: "#9f1239",
			accentColor: "#d4af37"
		}
	},
	navigation: [
		{
			title: "خانه",
			path: "/",
			sortOrder: 1
		},
		{
			title: "منو",
			path: "/menu",
			sortOrder: 2
		},
		{
			title: "کوییز",
			path: "/quiz",
			sortOrder: 3
		},
		{
			title: "نظرات",
			path: "/testimonials",
			sortOrder: 4
		},
		{
			title: "رویدادها",
			path: "/events",
			sortOrder: 5
		}
	],
	fonts: {
		body: "inherit",
		heading: "inherit",
		importGoogleFonts: false,
		imports: []
	},
	seo: {
		title: "کافه خانه — شخصیت کافه‌ای‌ات رو کشف کن",
		description: "تجربه‌ای فراتر از قهوه."
	},
	analytics: {
		enabled: true,
		provider: "supabase"
	},
	menus: [
		{
			name: "اسپرسو",
			description: "۱۰۰٪ عربیکا، رُست مدیوم",
			price: "35000",
			category: "قهوه گرم",
			sortOrder: 1
		},
		{
			name: "کاپوچینو",
			description: "اسپرسو + شیر بخار داده شده",
			price: "45000",
			category: "قهوه گرم",
			sortOrder: 2
		},
		{
			name: "لاته کارامل",
			description: "اسپرسو + شیر + سس کارامل",
			price: "50000",
			category: "قهوه ویژه",
			sortOrder: 3
		},
		{
			name: "چای ماسالا",
			description: "چای سیاه + دارچین + زنجبیل",
			price: "30000",
			category: "نوشیدنی گرم",
			sortOrder: 4
		},
		{
			name: "موهیتو کلاسیک",
			description: "نعنای تازه + لیمو + سودا",
			price: "40000",
			category: "نوشیدنی سرد",
			sortOrder: 5
		},
		{
			name: "چیزکیک نیویورکی",
			description: "دست‌ساز، با پنیر خامه‌ای و سس توت‌فرنگی",
			price: "60000",
			category: "شیرینی",
			sortOrder: 6
		}
	],
	gallery: [
		{
			title: "لاته‌آرت زیبا",
			tags: ["coffee", "latte-art"],
			sortOrder: 1
		},
		{
			title: "فضای نشیمن دنج کافه",
			tags: ["interior", "cozy"],
			sortOrder: 2
		},
		{
			title: "شیرینی‌های تازه",
			tags: ["pastry", "dessert"],
			sortOrder: 3
		}
	],
	personalitySettings: [
		{
			key: "espresso",
			label: "اسپرسو",
			tagline: "تند و قدرتمند",
			description: "شخصیتی قوی، تصمیم‌گیرنده سریع",
			traits: [
				"قوی",
				"سریع",
				"مستقیم"
			],
			drink: "Espresso",
			colorFrom: "#1a0f00",
			colorTo: "#5d3a1a"
		},
		{
			key: "latte",
			label: "لاته",
			tagline: "نرم و دوستانه",
			description: "شخصیتی آرام، گوش‌دهنده خوب",
			traits: [
				"آرام",
				"مهربان",
				"صبور"
			],
			drink: "Café Latte",
			colorFrom: "#d4a574",
			colorTo: "#f5e6d3"
		},
		{
			key: "mocha",
			label: "موکا",
			tagline: "شیرین و خلاق",
			description: "تخیل قوی، عاشق هنر",
			traits: [
				"خلاق",
				"شیرین",
				"هیجانی"
			],
			drink: "Mocha",
			colorFrom: "#3e1f00",
			colorTo: "#8b4513"
		}
	],
	mediaFolderStructure: [
		{
			path: "/images/coffee",
			description: "تصاویر قهوه"
		},
		{
			path: "/images/interior",
			description: "فضای داخلی کافه"
		},
		{
			path: "/images/pastries",
			description: "شیرینی‌ها و غذاها"
		}
	],
	permissions: {
		admin: ["*"],
		member: ["pages.read", "gallery.read"],
		viewer: ["pages.read"]
	},
	metadata: {
		createdBy: "system",
		tags: [
			"cafe",
			"restaurant",
			"starter"
		],
		isPublished: true
	}
};
/**
* GET /api/public/blueprints
*
* Public catalog of available workspace blueprints. Used by external callers
* (e.g. Convex) to discover which blueprintSlug values are valid when calling
* the provision endpoint.
*
* Returns a lightweight shape — never the full BlueprintInput manifest.
*/
var Route = createFileRoute("/api/public/blueprints")({ server: { handlers: { GET: () => {
	const blueprints = [cafeteriaBlueprint].map((b) => ({
		slug: b.slug,
		name: b.name,
		description: b.description
	}));
	return Response.json(blueprints);
} } } });
var ProvisionRoute = Route$29.update({
	id: "/provision",
	path: "/provision",
	getParentRoute: () => Route$30
});
var AdminRoute = Route$28.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$30
});
var IndexRoute = Route$31.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$30
});
var TestIndexRoute = Route$27.update({
	id: "/test/",
	path: "/test/",
	getParentRoute: () => Route$30
});
var AdminIndexRoute = Route$26.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var TestResultRoute = Route$25.update({
	id: "/test/result",
	path: "/test/result",
	getParentRoute: () => Route$30
});
var TestInfoRoute = Route$24.update({
	id: "/test/info",
	path: "/test/info",
	getParentRoute: () => Route$30
});
var TestStepRoute = Route$23.update({
	id: "/test/$step",
	path: "/test/$step",
	getParentRoute: () => Route$30
});
var ApiProvisionRoute = Route$22.update({
	id: "/api/provision",
	path: "/api/provision",
	getParentRoute: () => Route$30
});
var ApiHealthRoute = Route$21.update({
	id: "/api/health",
	path: "/api/health",
	getParentRoute: () => Route$30
});
var AdminTestResultsRoute = Route$20.update({
	id: "/test-results",
	path: "/test-results",
	getParentRoute: () => AdminRoute
});
var AdminTestQuestionsRoute = Route$19.update({
	id: "/test-questions",
	path: "/test-questions",
	getParentRoute: () => AdminRoute
});
var AdminTestAnalyticsRoute = Route$18.update({
	id: "/test-analytics",
	path: "/test-analytics",
	getParentRoute: () => AdminRoute
});
var AdminSiteContentRoute = Route$17.update({
	id: "/site-content",
	path: "/site-content",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$16.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminPersonalityTypesRoute = Route$15.update({
	id: "/personality-types",
	path: "/personality-types",
	getParentRoute: () => AdminRoute
});
var AdminPageRoute = Route$14.update({
	id: "/page",
	path: "/page",
	getParentRoute: () => AdminRoute
});
var AdminNotificationsRoute = Route$13.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AdminRoute
});
var AdminMenuRoute = Route$12.update({
	id: "/menu",
	path: "/menu",
	getParentRoute: () => AdminRoute
});
var AdminMediaRoute = Route$11.update({
	id: "/media",
	path: "/media",
	getParentRoute: () => AdminRoute
});
var AdminGalleryRoute = Route$10.update({
	id: "/gallery",
	path: "/gallery",
	getParentRoute: () => AdminRoute
});
var AdminFormsRoute = Route$9.update({
	id: "/forms",
	path: "/forms",
	getParentRoute: () => AdminRoute
});
var AdminEventsRoute = Route$8.update({
	id: "/events",
	path: "/events",
	getParentRoute: () => AdminRoute
});
var AdminCalendarRoute = Route$7.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => AdminRoute
});
var AdminBookingsRoute = Route$6.update({
	id: "/bookings",
	path: "/bookings",
	getParentRoute: () => AdminRoute
});
var AdminAnalyticsRoute = Route$5.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AdminRoute
});
var AdminActivityRoute = Route$4.update({
	id: "/activity",
	path: "/activity",
	getParentRoute: () => AdminRoute
});
var ApiPublicProvisionStatusRoute = Route$3.update({
	id: "/api/public/provision-status",
	path: "/api/public/provision-status",
	getParentRoute: () => Route$30
});
var ApiPublicProvisionRoute = Route$2.update({
	id: "/api/public/provision",
	path: "/api/public/provision",
	getParentRoute: () => Route$30
});
var ApiPublicCheckSlugRoute = Route$1.update({
	id: "/api/public/check-slug",
	path: "/api/public/check-slug",
	getParentRoute: () => Route$30
});
var ApiPublicBlueprintsRoute = Route.update({
	id: "/api/public/blueprints",
	path: "/api/public/blueprints",
	getParentRoute: () => Route$30
});
var AdminRouteChildren = {
	AdminActivityRoute,
	AdminAnalyticsRoute,
	AdminBookingsRoute,
	AdminCalendarRoute,
	AdminEventsRoute,
	AdminFormsRoute,
	AdminGalleryRoute,
	AdminMediaRoute,
	AdminMenuRoute,
	AdminNotificationsRoute,
	AdminPageRoute,
	AdminPersonalityTypesRoute,
	AdminSettingsRoute,
	AdminSiteContentRoute,
	AdminTestAnalyticsRoute,
	AdminTestQuestionsRoute,
	AdminTestResultsRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	ProvisionRoute,
	ApiHealthRoute,
	ApiProvisionRoute,
	TestStepRoute,
	TestInfoRoute,
	TestResultRoute,
	TestIndexRoute,
	ApiPublicBlueprintsRoute,
	ApiPublicCheckSlugRoute,
	ApiPublicProvisionRoute,
	ApiPublicProvisionStatusRoute
};
var routeTree = Route$30._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
