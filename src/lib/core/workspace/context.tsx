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

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import type { WorkspaceContext, WorkspaceEntity, WorkspaceLimits } from "./types";
import { DEFAULT_WORKSPACE, ACTIVE_WORKSPACE_STATUSES } from "./types";
import { getLogger } from "@/lib/logger";
import { PLATFORM_DOMAIN } from "@/lib/constants";
import {
  resolveWorkspace,
  resolveWorkspaceByDomain,
  resolveWorkspaceFromRequest,
} from "./resolver";
import { runWorkspaceHealthChecks, formatHealthSummary } from "./health";
import { checkLimit, isAdmin, isOwner, hasRole } from "./entity";
import type { WorkspaceRole } from "./types";
import { parsePreviewDomainSafely, canEnablePreviewMode } from "./preview-mode";

// getRepositories / setWorkspaceOnRepositories are imported dynamically inside
// the resolve callback (not at module level) to avoid a circular dependency:
//   factory -> workspace barrel -> context -> factory
// Dynamic imports defer resolution to runtime, breaking the compile-time cycle.

// ─── Context value ───────────────────────────────────────────────────────────

export interface WorkspaceContextValue {
  /** The resolved workspace context (passed to repositories). */
  workspace: WorkspaceContext;
  /** The full workspace entity (if resolved). */
  entity: WorkspaceEntity | null;
  /** Whether the workspace is being resolved. */
  loading: boolean;
  /** Whether resolution encountered an error. */
  error: Error | null;
  /** Whether the workspace is in an operational state. */
  isOperational: boolean;
  /** Check if a resource limit has been reached. */
  checkLimit: (limit: keyof WorkspaceLimits, currentUsage: number) => boolean;
  /** Check if a given user has a minimum role. */
  hasRole: (userId: string, minimumRole: WorkspaceRole) => boolean;
  /** Check if a given user is an admin. */
  isAdmin: (userId: string) => boolean;
  /** Check if a given user is the owner. */
  isOwner: (userId: string) => boolean;
}

const WorkspaceCtx = createContext<WorkspaceContextValue | null>(null);

// Remembers the workspace resolved via ?preview_domain for the lifetime of the
// tab, so a hard reload of /admin (which drops the query param) keeps rendering
// the same workspace instead of falling back to DEFAULT. Preview builds only.
const PREVIEW_WS_STORAGE_KEY = "nama:preview-workspace-id";

// ─── Provider ────────────────────────────────────────────────────────────────

export interface CurrentWorkspaceProviderProps {
  children: ReactNode;
}

/**
 * Extract domain/subdomain information from the browser location.
 * Returns { domain, subdomain, isSubdomain } or null if running in SSR/non-browser context.
 */
function extractDomainInfo(): {
  domain: string | undefined;
  subdomain: string | undefined;
  isSubdomain: boolean;
} | null {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname;
  if (!hostname) return null;

  // Skip localhost and IP addresses
  if (hostname === "localhost" || hostname.startsWith("127.") || hostname.startsWith("::")) {
    return null;
  }

  const parts = hostname.split(".");

  // Check for subdomain pattern: <subdomain>.<domain>.<tld>
  if (parts.length >= 3) {
    const potentialSubdomain = parts[0];
    // Filter out common non-workspace subdomains
    const skipPatterns = ["www", "api", "cdn", "static", "assets", "app", "mail", "shop"];
    if (!skipPatterns.includes(potentialSubdomain.toLowerCase())) {
      // Workspaces are keyed by their FULL domain (e.g. "khane.nama.app"), so
      // resolve against the whole hostname. Passing only parts.slice(1)
      // ("nama.app") made findByDomain miss the row and fall back to the
      // default workspace, rendering the base project on every subdomain.
      return {
        domain: hostname,
        subdomain: potentialSubdomain,
        isSubdomain: false,
      };
    }
  }

  // For bare domains (e.g., "mycafe.com"), check if it matches a workspace domain
  return {
    domain: hostname,
    subdomain: undefined,
    isSubdomain: false,
  };
}

/**
 * Parse the `?preview_domain=<domain>` override from a search string.
 * 
 * IMPORTANT: This uses canEnablePreviewMode() which enforces TIER-2 runtime
 * safety checks (host validation, route validation). The build-time gate
 * (VITE_ENABLE_DOMAIN_PREVIEW) is checked first in parsePreviewDomainSafely.
 * 
 * Returns undefined if:
 *   - Build was not set VITE_ENABLE_DOMAIN_PREVIEW=true
 *   - Not on a SAFE host (production platform or localhost)
 *   - Not in an admin route (/admin, /cafe)
 *   - preview_domain param is missing/empty
 */
function parsePreviewDomain(search: string): string | undefined {
  return parsePreviewDomainSafely(search);
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
function extractWorkspaceFromPath(
  previewDomain: string | undefined,
  workspaceIdFromRoute?: string,
): { workspaceId: string | undefined; domain: string | undefined; isSubdomain: boolean } {
  if (typeof window === "undefined") {
    return { workspaceId: workspaceIdFromRoute, domain: undefined, isSubdomain: false };
  }

  // Local-testing override takes priority over everything else (incl. route params).
  if (previewDomain) {
    return { workspaceId: undefined, domain: previewDomain, isSubdomain: false };
  }

  const pathname = window.location.pathname;

  // Check for cafe mode first: /cafe/<slug> or /cafe/<workspace-id>
  // If already resolved by route params, prefer that
  if (workspaceIdFromRoute) {
    return { workspaceId: workspaceIdFromRoute, domain: undefined, isSubdomain: false };
  }

  const cafeMatch = pathname.match(/^\/cafe(?:\/([^/]+))?(?:\/(shop|cms))?$/);
  if (cafeMatch && cafeMatch[1]) {
    // /cafe/<slug> — the slug is the workspace's domain prefix, NOT its row id
    // (ids are UUIDs; the slug lives in the `domain` column as `${slug}.nama.app`).
    // Resolve via the canonical domain so findByDomain finds the row.
    return {
      workspaceId: undefined,
      domain: `${cafeMatch[1]}.${PLATFORM_DOMAIN}`,
      isSubdomain: false,
    };
  }

  // Check for subdomain-based resolution
  const domainInfo = extractDomainInfo();
  if (domainInfo) {
    return {
      workspaceId: undefined,
      domain: domainInfo.domain ?? undefined,
      isSubdomain: domainInfo.isSubdomain,
    };
  }

  // Preview fallback (preview builds only): reuse the last ?preview_domain-resolved
  // workspace so a hard reload that loses the query param (e.g. /admin) still shows it.
  if (canEnablePreviewMode()) {
    try {
      const stored = sessionStorage.getItem(PREVIEW_WS_STORAGE_KEY);
      if (stored) {
        return { workspaceId: stored, domain: undefined, isSubdomain: false };
      }
    } catch {
      /* sessionStorage unavailable — fall through to default */
    }
  }

  return { workspaceId: undefined, domain: undefined, isSubdomain: false };
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
export function CurrentWorkspaceProvider({ children }: CurrentWorkspaceProviderProps) {
  const [workspace, setWorkspace] = useState<WorkspaceContext>(DEFAULT_WORKSPACE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const logger = useMemo(() => getLogger(), []);
  const queryClient = useQueryClient();

  // Read the preview override from the live router location (not a one-shot
  // window.location read) so the workspace re-resolves whenever ?preview_domain
  // changes — e.g. navigating between admin sections that preserve the param.
  // Note: useRouterState returns the raw search param string, which we use directly
  const previewDomain = useMemo(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    // Use window.location.search directly (simpler, more reliable)
    const result = parsePreviewDomain(window.location.search);
    if (result) {
      console.debug("[NAMA][context] Preview domain extracted", {
        domain: result,
        search: window.location.search
      });
    }
    return result;
  }, []);

  // Once the workspace resolves, the repository singletons carry the correct
  // workspace_id, but the public read hooks (useMenuItems, useGalleryImages,
  // etc.) already cached their mount-time queries — which ran BEFORE resolution
  // with an undefined workspace_id, so withWorkspace() was a no-op and returned
  // every workspace's rows. Their query keys are static, so they never
  // refetch on their own. Invalidate them so they re-run against the now-correct
  // workspace context and show only this workspace's isolated content.
  const refetchCmsForWorkspace = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["cms"] });
    queryClient.invalidateQueries({ queryKey: ["test"] });
  }, [queryClient]);

  const resolve = useCallback(async () => {
    // Dynamic import to avoid circular dependency with workspace barrel.
    // Resolved up-front (outside the try) so the catch handler can still
    // configure repositories if resolution fails.
    const { getRepositories, setWorkspaceOnRepositories } =
      await import("@/lib/repositories/factory");
    const repos = getRepositories();

    try {
      setLoading(true);
      setError(null);

      const workspaceRepo = repos.workspace;

      // Debug: log preview mode state
      if (typeof window !== "undefined") {
        logger.debug("Preview mode check", {
          source: "workspace",
          previewDomain,
          canEnable: canEnablePreviewMode(),
          hostname: window.location.hostname,
          pathname: window.location.pathname,
        });
      }

      // Try domain/subdomain resolution first (public provisioned sites)
      const pathResolution = extractWorkspaceFromPath(previewDomain);
      const requestedDomain = pathResolution.domain;

      logger.debug("Workspace path resolution", {
        source: "workspace",
        requestedDomain,
        isSubdomain: pathResolution.isSubdomain,
        workspaceIdFromPath: pathResolution.workspaceId,
      });

      let ctx: WorkspaceContext | undefined;

      if (pathResolution.workspaceId) {
        // Path-based workspace ID from URL (e.g., /cafe/<slug>)
        ctx = await resolveWorkspaceFromRequest(
          { workspaceRepository: workspaceRepo },
          { workspaceId: pathResolution.workspaceId },
        );
      } else if (requestedDomain) {
        // Domain or subdomain-based resolution
        ctx = await resolveWorkspaceFromRequest(
          { workspaceRepository: workspaceRepo },
          {
            domain: requestedDomain,
            isSubdomain: pathResolution.isSubdomain,
          },
        );
        // Remember a ?preview_domain-resolved workspace so reloads without the
        // query param keep rendering it (preview builds only).
        if (
          canEnablePreviewMode() &&
          previewDomain &&
          ctx?.workspaceId
        ) {
          try {
            sessionStorage.setItem(PREVIEW_WS_STORAGE_KEY, ctx.workspaceId);
          } catch {
            /* sessionStorage unavailable — ignore */
          }
        }
      }

      // Fall back to user-based resolution (auth flow) ONLY when no explicit
      // domain was requested. If a domain WAS requested but not found, creating
      // a brand-new default workspace is both wrong (renders the wrong site)
      // and trips the `uniq_default_workspace_per_owner` constraint
      // (POST 409 / 23505 "Failed to resolve workspace"). Degrade to the
      // default context instead of attempting a conflicting insert.
      if (!ctx?.workspaceId && !requestedDomain) {
        let userId: string | undefined;

        try {
          const { user } = await repos.auth.getSession();
          userId = user?.id;
        } catch {
          // Not authenticated
        }

        if (!userId) {
          // Not authenticated — use default workspace
          setWorkspace(DEFAULT_WORKSPACE);
          setWorkspaceOnRepositories(repos, DEFAULT_WORKSPACE);
          refetchCmsForWorkspace();
          setLoading(false);
          return;
        }

        ctx = await resolveWorkspaceFromRequest({ workspaceRepository: workspaceRepo }, { userId });
      }

      // No context resolved (e.g. a domain was requested but does not exist,
      // or auth resolution returned nothing). Degrade to the default workspace
      // instead of calling getOrCreateDefault — which would insert a conflicting
      // default row and trip `uniq_default_workspace_per_owner`
      // (POST 409 / 23505 "Failed to resolve workspace").
      if (!ctx?.workspaceId) {
        if (requestedDomain) {
          logger.warn(
            `No workspace resolved for requested domain "${requestedDomain}" — degrading to default workspace`,
            { source: "workspace" },
          );
        }
        ctx = DEFAULT_WORKSPACE;
      }

      // Set workspace on all repositories
      setWorkspaceOnRepositories(repos, ctx);
      setWorkspace(ctx);
      // Re-run public CMS read queries against the now-resolved workspace so
      // the site shows only this workspace's isolated content (not the
      // mount-time unfiltered union of every workspace).
      refetchCmsForWorkspace();

      // Log health check
      const health = runWorkspaceHealthChecks(ctx);
      if (!health.healthy) {
        logger.warn(formatHealthSummary(health), { source: "workspace" });
      } else {
        logger.info(formatHealthSummary(health), { source: "workspace" });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      // Surface the real resolution error (previously swallowed inside
      // resolveWorkspaceByDomain). Degrade gracefully so repositories are still
      // configured and the app keeps rendering instead of hanging on an
      // unconfigured workspace context.
      logger.error("Failed to resolve workspace", {
        source: "workspace",
        cause: error,
      });
      setWorkspaceOnRepositories(repos, DEFAULT_WORKSPACE);
      setWorkspace(DEFAULT_WORKSPACE);
      refetchCmsForWorkspace();
    } finally {
      setLoading(false);
    }
  }, [logger, refetchCmsForWorkspace, previewDomain]);

  useEffect(() => {
    resolve();
  }, [resolve]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspace,
      entity: workspace.entity ?? null,
      loading,
      error,
      isOperational: workspace.entity
        ? ACTIVE_WORKSPACE_STATUSES.has(workspace.entity.status)
        : true,

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
      },
    }),
    [workspace, loading, error],
  );

  return <WorkspaceCtx.Provider value={value}>{children}</WorkspaceCtx.Provider>;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Access the current workspace context.
 * Throws if used outside CurrentWorkspaceProvider.
 */
export function useCurrentWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceCtx);
  if (!ctx) {
    throw new Error("useCurrentWorkspace must be used within a CurrentWorkspaceProvider");
  }
  return ctx;
}

/**
 * Get the raw workspace context (for non-React usage).
 * Returns null if not in a provider.
 */
export function useOptionalWorkspace(): WorkspaceContextValue | null {
  return useContext(WorkspaceCtx);
}
