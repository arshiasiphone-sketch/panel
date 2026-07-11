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

import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react";
import type { WorkspaceContext, WorkspaceEntity, WorkspaceLimits } from "./types";
import { DEFAULT_WORKSPACE, ACTIVE_WORKSPACE_STATUSES } from "./types";
import { getLogger } from "@/lib/logger";
import { resolveWorkspace, resolveWorkspaceByDomain, resolveWorkspaceFromRequest } from "./resolver";
import { runWorkspaceHealthChecks, formatHealthSummary } from "./health";
import { checkLimit, isAdmin, isOwner, hasRole } from "./entity";
import type { WorkspaceRole } from "./types";

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

// ─── Provider ────────────────────────────────────────────────────────────────

export interface CurrentWorkspaceProviderProps {
  children: ReactNode;
}

/**
 * Extract domain/subdomain information from the browser location.
 * Returns { domain, subdomain, isSubdomain } or null if running in SSR/non-browser context.
 */
function extractDomainInfo(): { domain: string | undefined; subdomain: string | undefined; isSubdomain: boolean } | null {
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
      return {
        domain: parts.slice(1).join("."),
        subdomain: potentialSubdomain,
        isSubdomain: true,
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
 * Local-testing-only override: `?preview_domain=<domain>` forces the resolver to
 * render the workspace that owns that domain, ignoring the real Host header.
 * Disabled unless VITE_ENABLE_DOMAIN_PREVIEW === "true", so it can never
 * accidentally work in a real production / customer-facing deployment.
 */
function extractPreviewDomain(): string | undefined {
  if (import.meta.env.VITE_ENABLE_DOMAIN_PREVIEW !== "true") return undefined;
  if (typeof window === "undefined") return undefined;
  const value = new URLSearchParams(window.location.search).get("preview_domain")?.trim();
  return value ? value : undefined;
}

/**
 * Extract workspace ID from the URL path.
 * Matches patterns like:
 *   /cafe/<workspace-id>       — admin/owner cafe mode
 *   /cafe/<workspace-slug>     — admin/owner cafe slug mode (workspace slug stored in DB)
 *   /p/<workspace-id>/<page>   — public page URL pattern (new multi-domain format)
 */
function extractWorkspaceFromPath(workspaceIdFromRoute?: string): { workspaceId: string | undefined; domain: string | undefined; isSubdomain: boolean } {
  if (typeof window === "undefined") {
    return { workspaceId: workspaceIdFromRoute, domain: undefined, isSubdomain: false };
  }

  // Local-testing override takes priority over everything else (incl. route params).
  const previewDomain = extractPreviewDomain();
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
    // /cafe/<slug> — the slug might be a workspace ID or a slug identifier
    // We'll try it as a path-based lookup; if no workspace found, fall through to domain
    return { workspaceId: cafeMatch[1], domain: undefined, isSubdomain: false };
  }

  // Check for subdomain-based resolution
  const domainInfo = extractDomainInfo();
  if (domainInfo) {
    return { workspaceId: undefined, domain: domainInfo.domain ?? undefined, isSubdomain: domainInfo.isSubdomain };
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
export function CurrentWorkspaceProvider({
  children,
}: CurrentWorkspaceProviderProps) {
  const [workspace, setWorkspace] = useState<WorkspaceContext>(DEFAULT_WORKSPACE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const logger = useMemo(() => getLogger(), []);

  const resolve = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Dynamic import to avoid circular dependency with workspace barrel
      const { getRepositories, setWorkspaceOnRepositories } = await import(
        "@/lib/repositories/factory"
      );

      const repos = getRepositories();
      const workspaceRepo = repos.workspace;

      // Try domain/subdomain resolution first (public provisioned sites)
      const pathResolution = extractWorkspaceFromPath();

      let ctx: WorkspaceContext | undefined;

      if (pathResolution.workspaceId) {
        // Path-based workspace ID from URL (e.g., /cafe/<slug>)
        ctx = await resolveWorkspaceFromRequest(
          { workspaceRepository: workspaceRepo },
          { workspaceId: pathResolution.workspaceId },
        );
      } else if (pathResolution.domain) {
        // Domain or subdomain-based resolution
        ctx = await resolveWorkspaceFromRequest(
          { workspaceRepository: workspaceRepo },
          {
            domain: pathResolution.domain,
            isSubdomain: pathResolution.isSubdomain,
          },
        );
      }

      // If domain/path resolution failed, try user-based resolution (auth flow)
      if (!ctx?.workspaceId) {
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
          setLoading(false);
          return;
        }

        ctx = await resolveWorkspaceFromRequest(
          { workspaceRepository: workspaceRepo },
          { userId },
        );
      }

      // Set workspace on all repositories
      setWorkspaceOnRepositories(repos, ctx);
      setWorkspace(ctx);

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
      logger.error("Failed to resolve workspace", {
        source: "workspace",
        cause: error,
      });
    } finally {
      setLoading(false);
    }
  }, [logger]);

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

  return (
    <WorkspaceCtx.Provider value={value}>
      {children}
    </WorkspaceCtx.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Access the current workspace context.
 * Throws if used outside CurrentWorkspaceProvider.
 */
export function useCurrentWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceCtx);
  if (!ctx) {
    throw new Error(
      "useCurrentWorkspace must be used within a CurrentWorkspaceProvider",
    );
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
