/**
 * NAMA Platform — Workspace Entity.
 *
 * Rich domain entity with helper methods for status checks,
 * plan queries, limit enforcement, and membership management.
 */

import type {
  WorkspaceEntity,
  WorkspaceStatus,
  WorkspacePlan,
  WorkspaceLimits,
  WorkspaceMembership,
  WorkspaceMetadata,
  WorkspaceRole,
  QuotaCheck,
} from "./types";
import { ACTIVE_WORKSPACE_STATUSES } from "./types";

// ─── Entity helpers ─────────────────────────────────────────────────────────

/**
 * Check if a workspace is in a state that allows operations.
 */
export function isWorkspaceOperational(entity: WorkspaceEntity): boolean {
  return ACTIVE_WORKSPACE_STATUSES.has(entity.status);
}

/**
 * Check if a workspace has a specific status.
 */
export function hasStatus(entity: WorkspaceEntity, status: WorkspaceStatus): boolean {
  return entity.status === status;
}

/**
 * Check if workspace is on or above a given plan tier.
 */
export function meetsPlanTier(
  current: WorkspacePlan,
  minimum: WorkspacePlan,
): boolean {
  const tiers: Record<WorkspacePlan, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3,
  };
  return tiers[current] >= tiers[minimum];
}

/**
 * Get the maximum value for a workspace limit.
 */
export function getLimit(
  entity: WorkspaceEntity,
  limit: keyof WorkspaceLimits,
): number {
  return entity.limits[limit];
}

/**
 * Check if an operation would exceed a workspace limit.
 *
 * @example
 *   const check = checkLimit(workspace, "maxPages", currentPageCount);
 *   if (!check.allowed) throw new Error(check.message);
 */
export function checkLimit(
  entity: WorkspaceEntity,
  limit: keyof WorkspaceLimits,
  currentUsage: number,
): QuotaCheck {
  const maximum = entity.limits[limit];
  const allowed = currentUsage < maximum;
  return {
    allowed,
    limit,
    current: currentUsage,
    maximum,
    message: allowed
      ? undefined
      : `Workspace limit exceeded: ${limit} (${currentUsage}/${maximum})`,
  };
}

/**
 * Check multiple limits at once. Returns the first violation or a passed check.
 */
export function checkLimits(
  entity: WorkspaceEntity,
  checks: Array<{ limit: keyof WorkspaceLimits; currentUsage: number }>,
): QuotaCheck {
  for (const { limit, currentUsage } of checks) {
    const result = checkLimit(entity, limit, currentUsage);
    if (!result.allowed) return result;
  }
  return { allowed: true };
}

// ─── Membership helpers ──────────────────────────────────────────────────────

/**
 * Find a user's membership in a workspace.
 */
export function findMembership(
  entity: WorkspaceEntity,
  userId: string,
): WorkspaceMembership | undefined {
  return entity.membership.find((m) => m.userId === userId);
}

/**
 * Check if a user has at least the given role in the workspace.
 */
export function hasRole(
  entity: WorkspaceEntity,
  userId: string,
  minimumRole: WorkspaceRole,
): boolean {
  const member = findMembership(entity, userId);
  if (!member) return false;

  const hierarchy: Record<WorkspaceRole, number> = {
    viewer: 0,
    member: 1,
    admin: 2,
    owner: 3,
  };

  return hierarchy[member.role] >= hierarchy[minimumRole];
}

/**
 * Check if a user is an admin or owner of the workspace.
 */
export function isAdmin(entity: WorkspaceEntity, userId: string): boolean {
  return hasRole(entity, userId, "admin");
}

/**
 * Check if a user is the owner of the workspace.
 */
export function isOwner(entity: WorkspaceEntity, userId: string): boolean {
  const member = findMembership(entity, userId);
  return member?.role === "owner";
}

// ─── Metadata helpers ────────────────────────────────────────────────────────

/**
 * Update workspace metadata with partial values.
 */
export function updateMetadata(
  entity: WorkspaceEntity,
  patch: Partial<WorkspaceMetadata>,
): WorkspaceEntity {
  return {
    ...entity,
    metadata: {
      ...entity.metadata,
      ...patch,
      updatedAt: new Date().toISOString(),
    },
  };
}

// ─── Status transition ───────────────────────────────────────────────────────

import { WORKSPACE_STATUS_TRANSITIONS } from "./types";

/**
 * Check if a status transition is valid.
 */
export function canTransitionTo(
  current: WorkspaceStatus,
  next: WorkspaceStatus,
): boolean {
  return WORKSPACE_STATUS_TRANSITIONS[current]?.includes(next) ?? false;
}

/**
 * Transition workspace status. Returns a new entity or throws if invalid.
 */
export function transitionStatus(
  entity: WorkspaceEntity,
  next: WorkspaceStatus,
): WorkspaceEntity {
  if (!canTransitionTo(entity.status, next)) {
    throw new Error(
      `Invalid workspace status transition: ${entity.status} → ${next}`,
    );
  }
  return {
    ...entity,
    status: next,
    metadata: {
      ...entity.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}
