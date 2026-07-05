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
import { resolveWorkspace } from "./resolver";
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
 * Resolves the current workspace and makes it available to the app tree.
 * Automatically sets workspace context on all repositories.
 *
 * Self-resolves the current user from the auth provider, so it can be
 * placed at the root level without needing a userId prop.
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

      // Get current user from auth provider
      const repos = getRepositories();
      let userId: string | undefined;

      try {
        const { user } = await repos.auth.getSession();
        userId = user?.id;
      } catch {
        // Not authenticated — use default workspace
        setWorkspace(DEFAULT_WORKSPACE);
        setWorkspaceOnRepositories(repos, DEFAULT_WORKSPACE);
        setLoading(false);
        return;
      }

      if (!userId) {
        // Not authenticated — use default workspace
        setWorkspace(DEFAULT_WORKSPACE);
        setWorkspaceOnRepositories(repos, DEFAULT_WORKSPACE);
        setLoading(false);
        return;
      }

      // Use the existing repository graph (single provider instance)
      // WorkspaceRepository is already part of repos — reuse it
      const workspaceRepo = repos.workspace;

      const ctx = await resolveWorkspace(
        { workspaceRepository: workspaceRepo },
        userId,
      );

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
