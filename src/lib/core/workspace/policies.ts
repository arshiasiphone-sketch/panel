/**
 * NAMA Platform — Workspace Policies.
 *
 * Authorization rules for workspace operations.
 * These define who can do what within a workspace context.
 */

import type { WorkspaceEntity, WorkspaceRole, WorkspaceStatus } from "./types";
import { ACTIVE_WORKSPACE_STATUSES, WORKSPACE_STATUS_TRANSITIONS } from "./types";
import { isAdmin, isOwner, hasRole } from "./entity";

// ─── Policy check results ────────────────────────────────────────────────────

export interface PolicyResult {
  allowed: boolean;
  reason?: string;
}

function allowed(): PolicyResult {
  return { allowed: true };
}

function denied(reason: string): PolicyResult {
  return { allowed: false, reason };
}

// ─── Access policies ─────────────────────────────────────────────────────────

/**
 * Check if the workspace is in an operational state.
 */
export function canAccessWorkspace(entity: WorkspaceEntity): PolicyResult {
  if (!entity) return denied("Workspace not found");
  if (!ACTIVE_WORKSPACE_STATUSES.has(entity.status)) {
    return denied(`Workspace is ${entity.status}`);
  }
  return allowed();
}

/**
 * Whether a user can view workspace data.
 */
export function canView(
  entity: WorkspaceEntity,
  userId?: string,
): PolicyResult {
  if (!userId) return denied("Not authenticated");
  const access = canAccessWorkspace(entity);
  if (!access.allowed) return access;
  if (!hasRole(entity, userId, "viewer")) return denied("Not a workspace member");
  return allowed();
}

/**
 * Whether a user can edit workspace data.
 */
export function canEdit(
  entity: WorkspaceEntity,
  userId?: string,
): PolicyResult {
  if (!userId) return denied("Not authenticated");
  const access = canAccessWorkspace(entity);
  if (!access.allowed) return access;
  if (!hasRole(entity, userId, "member")) return denied("Insufficient role: member+ required");
  return allowed();
}

/**
 * Whether a user can manage workspace settings and members.
 */
export function canManage(
  entity: WorkspaceEntity,
  userId?: string,
): PolicyResult {
  if (!userId) return denied("Not authenticated");
  const access = canAccessWorkspace(entity);
  if (!access.allowed) return access;
  if (!hasRole(entity, userId, "admin")) return denied("Insufficient role: admin+ required");
  return allowed();
}

/**
 * Whether a user can delete or transfer the workspace.
 */
export function canAdminister(
  entity: WorkspaceEntity,
  userId?: string,
): PolicyResult {
  if (!userId) return denied("Not authenticated");
  const access = canAccessWorkspace(entity);
  if (!access.allowed) return access;
  if (!isOwner(entity, userId)) return denied("Only workspace owner can administer");
  return allowed();
}

/**
 * Whether a user can change workspace plan/billing.
 */
export function canChangePlan(
  entity: WorkspaceEntity,
  userId?: string,
): PolicyResult {
  return canAdminister(entity, userId);
}

// ─── Status transition policies ──────────────────────────────────────────────

/**
 * Whether a user can transition workspace to a new status.
 */
export function canChangeStatus(
  entity: WorkspaceEntity,
  nextStatus: WorkspaceStatus,
  userId?: string,
): PolicyResult {
  if (!userId) return denied("Not authenticated");

  // Check if the transition is valid
  const valid = WORKSPACE_STATUS_TRANSITIONS[entity.status]?.includes(nextStatus);
  if (!valid) {
    return denied(`Cannot transition from ${entity.status} to ${nextStatus}`);
  }

  // Only owner can delete
  if (nextStatus === "deleted" && !isOwner(entity, userId)) {
    return denied("Only workspace owner can delete");
  }

  // Admin+ can suspend/archive
  if ((nextStatus === "suspended" || nextStatus === "archived") && !hasRole(entity, userId, "admin")) {
    return denied("Insufficient role to change workspace status");
  }

  return allowed();
}

// ─── Membership policies ─────────────────────────────────────────────────────

/**
 * Whether a user can add a member to the workspace.
 */
export function canAddMember(
  entity: WorkspaceEntity,
  newRole: WorkspaceRole,
  userId?: string,
): PolicyResult {
  if (!userId) return denied("Not authenticated");

  // Check admin limit
  if (newRole === "admin" || newRole === "owner") {
    const adminCount = entity.membership.filter(
      (m) => m.role === "admin" || m.role === "owner",
    ).length;
    if (adminCount >= entity.limits.maxAdmins) {
      return denied("Maximum admin count reached for this plan");
    }
  }

  return canManage(entity, userId);
}

/**
 * Whether a user can remove a member from the workspace.
 */
export function canRemoveMember(
  entity: WorkspaceEntity,
  targetUserId: string,
  userId?: string,
): PolicyResult {
  if (!userId) return denied("Not authenticated");
  // Owner can remove anyone (except themselves)
  if (isOwner(entity, userId)) return allowed();
  // Admin can remove members/viewers but not other admins/owners
  if (isAdmin(entity, userId)) {
    const target = entity.membership.find((m) => m.userId === targetUserId);
    if (target && (target.role === "admin" || target.role === "owner")) {
      return denied("Admins cannot remove other admins or owners");
    }
    return allowed();
  }
  return denied("Insufficient role to remove members");
}
