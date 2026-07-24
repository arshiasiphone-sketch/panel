/**
 * NAMA Platform — Workspace Resolver.
 *
 * Resolves the current workspace from multiple sources:
 *   1. Domain-based resolution (subdomain or path segment)
 *   2. User membership resolution
 *   3. Explicit workspace ID override
 *
 * Resolution strategy (in order):
 *   1. If an explicit workspaceId is provided, use it (admin impersonation).
 *   2. If a domain is provided, look up the workspace by domain.
 *   3. If a userId is provided:
 *      a. If the user has an explicit primary workspace, use it.
 *      b. If the user belongs to exactly one workspace, use it.
 *      c. If the user belongs to multiple workspaces, use the most recent.
 *   4. If the user belongs to no workspaces, create a default one.
 */

import type { WorkspaceEntity, WorkspaceContext } from "./types";
import type { WorkspaceRepository } from "./repository";
import { getDefaultLimits } from "./factory";
import { getCache } from "@/lib/core/repository-cache";
import { getLogger } from "@/lib/logger";
import { traceWorkspaceLifecycle } from "@/lib/workspace-lifecycle-trace";

export interface ResolverDependencies {
  workspaceRepository: WorkspaceRepository;
}

export interface ResolveOptions {
  /** Force resolution by workspace ID (admin impersonation). */
  workspaceId?: string;
  /** Domain or subdomain to resolve workspace by (e.g. "mycafe.com" or "mycafe"). */
  domain?: string;
  /** Whether the domain value is a subdomain (extracted from hostname) vs full domain. */
  isSubdomain?: boolean;
}

/**
 * Resolve workspace by domain name or subdomain.
 * Handles both bare domains ("mycafe.com") and subdomains ("mycafe").
 */
export async function resolveWorkspaceByDomain(
  deps: ResolverDependencies,
  domainOrSubdomain: string,
  isSubdomain = false,
): Promise<{ workspaceId?: string; entity?: WorkspaceEntity }> {
  const cache = getCache();
  const logger = getLogger();
  traceWorkspaceLifecycle({
    label: "workspace-resolver-by-domain-start",
    location: "core/workspace/resolver",
    stage: "start",
    workspace: undefined,
    details: { domainOrSubdomain, isSubdomain },
  });
  return cache.getOrFetch(
    "workspace_resolver",
    `domain:${domainOrSubdomain}:${isSubdomain}`,
    async () => {
      if (!domainOrSubdomain) {
        traceWorkspaceLifecycle({
          label: "workspace-resolver-by-domain-empty",
          location: "core/workspace/resolver",
          stage: "noop",
          workspace: undefined,
          details: { domainOrSubdomain, isSubdomain },
        });
        return {};
      }

      let exactWorkspace: WorkspaceEntity | null | undefined;

      try {
        // Try exact domain match first
        exactWorkspace = await deps.workspaceRepository.findByDomain(domainOrSubdomain);
      } catch (err) {
        // Surface the real error instead of silently degrading. A bare catch
        // here used to swallow the exception and cache `{}` for 30s, which made
        // a transient DB/RLS/network failure look like "no workspace -> default"
        // with zero diagnostic signal. Rethrow so the error propagates to the
        // provider (which logs it) and is NOT cached as a successful miss.
        logger.error("resolveWorkspaceByDomain: findByDomain failed", {
          source: "workspace",
          domain: domainOrSubdomain,
          isSubdomain,
          cause: err instanceof Error ? err : new Error(String(err)),
        });
        throw err instanceof Error ? err : new Error(String(err));
      }

      if (exactWorkspace) {
        traceWorkspaceLifecycle({
          label: "workspace-resolver-by-domain-found-exact",
          location: "core/workspace/resolver",
          stage: "found",
          workspace: { workspaceId: exactWorkspace.id, domain: exactWorkspace.metadata?.domain as string | undefined },
          details: { domainOrSubdomain, isSubdomain, method: "exact" },
        });
        return { workspaceId: exactWorkspace.id, entity: exactWorkspace };
      }

      if (isSubdomain) {
        try {
          // Try subdomain-based lookup
          const sw = await deps.workspaceRepository.findBySubdomain(domainOrSubdomain);
          if (sw) return { workspaceId: sw.id, entity: sw };
        } catch (err) {
          logger.warn("resolveWorkspaceByDomain: findBySubdomain failed (ignored)", {
            source: "workspace",
            domain: domainOrSubdomain,
            cause: err instanceof Error ? err : new Error(String(err)),
          });
        }
      } else {
        // For full domains, also try stripping www. and TLD variations
        const withoutWww = domainOrSubdomain.startsWith("www.")
          ? domainOrSubdomain.slice(4)
          : undefined;
        if (withoutWww && withoutWww !== domainOrSubdomain) {
          try {
            const ew2 = await deps.workspaceRepository.findByDomain(withoutWww);
            if (ew2) return { workspaceId: ew2.id, entity: ew2 };
          } catch (err) {
            logger.warn("resolveWorkspaceByDomain: findByDomain(www-stripped) failed (ignored)", {
              source: "workspace",
              domain: withoutWww,
              cause: err instanceof Error ? err : new Error(String(err)),
            });
          }

          const baseDomain = withoutWww.replace(/\.[^.]+$/, "");
          try {
            const sw2 = await deps.workspaceRepository.findBySubdomain(baseDomain);
            if (sw2) return { workspaceId: sw2.id, entity: sw2 };
          } catch (err) {
            logger.warn("resolveWorkspaceByDomain: findBySubdomain(base) failed (ignored)", {
              source: "workspace",
              domain: baseDomain,
              cause: err instanceof Error ? err : new Error(String(err)),
            });
          }
        }
      }

      logger.debug("resolveWorkspaceByDomain: no workspace found for domain", {
        source: "workspace",
        domain: domainOrSubdomain,
        isSubdomain,
      });
      traceWorkspaceLifecycle({
        label: "workspace-resolver-by-domain-not-found",
        location: "core/workspace/resolver",
        stage: "not-found",
        workspace: undefined,
        details: { domainOrSubdomain, isSubdomain },
      });
      return { };
    },
    30_000, // 30 second TTL for domain resolution (domains change less frequently)
  );
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
  traceWorkspaceLifecycle({
    label: "workspace-resolver-user-start",
    location: "core/workspace/resolver",
    stage: "start",
    workspace: undefined,
    details: { userId, options },
  });

  if (options?.workspaceId) {
    const cache = getCache();
    return cache.getOrFetch(
      "workspace_resolver",
      `by-id:${options.workspaceId}`,
      async () => {
        const entity = await deps.workspaceRepository.findById(options.workspaceId!);
        if (!entity) {
          traceWorkspaceLifecycle({
            label: "workspace-resolver-by-id-not-found",
            location: "core/workspace/resolver",
            stage: "not-found",
            workspace: undefined,
            details: { workspaceId: options.workspaceId, userId },
          });
          return { workspaceId: undefined, entity: undefined };
        }
        traceWorkspaceLifecycle({
          label: "workspace-resolver-by-id-found",
          location: "core/workspace/resolver",
          stage: "found",
          workspace: { workspaceId: entity.id, domain: entity.metadata?.domain as string | undefined },
          details: { workspaceId: options.workspaceId, userId },
        });
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

/**
 * Resolve workspace from request context (domain/subdomain + userId + options).
 * Priority: explicit workspaceId > domain resolution > user resolution.
 */
export async function resolveWorkspaceFromRequest(
  deps: ResolverDependencies,
  opts: {
    userId?: string;
    domain?: string;
    workspaceId?: string;
    isSubdomain?: boolean;
  },
): Promise<WorkspaceContext> {
  // 1. Explicit workspace ID override (highest priority)
  if (opts.workspaceId) {
    const entity = await deps.workspaceRepository.findById(opts.workspaceId);
    if (entity) {
      return { workspaceId: entity.id, entity };
    }
    // Fall through to user resolution if workspace not found
  }

  // 2. Domain-based resolution
  if (opts.domain) {
    traceWorkspaceLifecycle({
      label: "workspace-resolver-domain-entry",
      location: "core/workspace/resolver",
      stage: "start",
      workspace: undefined,
      details: { domain: opts.domain, isSubdomain: opts.isSubdomain ?? false },
    });
    const result = await resolveWorkspaceByDomain(
      deps,
      opts.domain,
      opts.isSubdomain ?? false,
    );
    if (result.entity) {
      traceWorkspaceLifecycle({
        label: "workspace-resolver-domain-found",
        location: "core/workspace/resolver",
        stage: "found",
        workspace: { workspaceId: result.entity.id, domain: result.entity.metadata?.domain as string | undefined },
        details: { domain: opts.domain, isSubdomain: opts.isSubdomain ?? false },
      });
      return { workspaceId: result.entity.id, entity: result.entity };
    }
  }

  // 3. User-based resolution
  if (opts.userId) {
    return resolveWorkspace(deps, opts.userId, { workspaceId: opts.workspaceId });
  }

  // 4. No resolution possible — return default/unknown context
  traceWorkspaceLifecycle({
    label: "workspace-resolver-fallback-default",
    location: "core/workspace/resolver",
    stage: "fallback",
    workspace: undefined,
    details: { opts },
  });
  return { workspaceId: undefined, entity: undefined };
}
