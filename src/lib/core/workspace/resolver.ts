/**
 * NAMA Platform — Workspace Resolver.
 *
 * Resolves the current workspace from the authenticated user/session.
 * This is the bridge between auth and workspace domains.
 *
 * Resolution strategy (in order):
 *   1. If the user has an explicit primary workspace, use it.
 *   2. If the user belongs to exactly one workspace, use it.
 *   3. If the user belongs to multiple workspaces, use the most recent.
 *   4. If the user belongs to no workspaces, create a default one.
 */

import type { WorkspaceEntity, WorkspaceContext } from "./types";
import type { WorkspaceRepository } from "./repository";
import { getDefaultLimits } from "./factory";
import { getCache } from "@/lib/core/repository-cache";

export interface ResolverDependencies {
  workspaceRepository: WorkspaceRepository;
}

export interface ResolveOptions {
  /** Force resolution by workspace ID (admin impersonation). */
  workspaceId?: string;
}

/**
 * Resolve the workspace context for a given user.
 * Results are cached per-request to prevent duplicate workspace lookups.
 */
export async function resolveWorkspace(
  deps: ResolverDependencies,
  userId: string,
  options?: ResolveOptions,
): Promise<WorkspaceContext> {
  if (options?.workspaceId) {
    const cache = getCache();
    return cache.getOrFetch(
      "workspace_resolver",
      `by-id:${options.workspaceId}`,
      async () => {
        const entity = await deps.workspaceRepository.findById(options.workspaceId!);
        if (!entity) {
          return { workspaceId: undefined, entity: undefined };
        }
        return { workspaceId: entity.id, entity };
      },
      10_000, // 10 second TTL for workspace resolution
    );
  }

  const cache = getCache();
  return cache.getOrFetch(
    "workspace_resolver",
    `by-user:${userId}`,
    async () => {
      // Find workspaces the user belongs to
      const workspaces = await deps.workspaceRepository.findByUserId(userId);

      if (workspaces.length === 0) {
        // Create a default workspace for this user
        const entity = await deps.workspaceRepository.getOrCreateDefault(userId);
        return { workspaceId: entity.id, entity };
      }

      if (workspaces.length === 1) {
        const entity = workspaces[0];
        return { workspaceId: entity.id, entity };
      }

      // Multiple workspaces — use the most recently updated one
      const sorted = [...workspaces].sort(
        (a, b) =>
          new Date(b.metadata.updatedAt).getTime() -
          new Date(a.metadata.updatedAt).getTime(),
      );
      const entity = sorted[0];
      return { workspaceId: entity.id, entity };
    },
    10_000, // 10 second TTL — balances freshness with performance
  );
}

/**
 * Create a workspace context from an entity without DB lookup.
 * Useful when the entity is already loaded.
 */
export function contextFromEntity(entity: WorkspaceEntity): WorkspaceContext {
  return {
    workspaceId: entity.id,
    entity,
  };
}

/**
 * Get the default limits for a workspace based on its plan.
 * Falls back to free limits if no entity is available.
 */
export function getEffectiveLimits(ctx: WorkspaceContext) {
  if (ctx.entity) {
    return ctx.entity.limits;
  }
  return getDefaultLimits("free");
}
