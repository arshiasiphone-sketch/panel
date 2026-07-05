/**
 * NAMA Platform — Workspace Domain.
 *
 * Barrel exports for the workspace architecture.
 * Import from @/lib/core/workspace for all workspace types and utilities.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type {
  WorkspaceEntity,
  WorkspaceContext,
  WorkspaceStatus,
  WorkspacePlan,
  WorkspaceLimits,
  WorkspaceMembership,
  WorkspaceMetadata,
  WorkspaceRole,
  QuotaCheck,
} from "./types";

export {
  DEFAULT_WORKSPACE,
  ACTIVE_WORKSPACE_STATUSES,
  WORKSPACE_STATUS_TRANSITIONS,
  WORKSPACE_STATUS_LABELS,
  WORKSPACE_PLAN_LABELS,
} from "./types";

// ─── Entity ──────────────────────────────────────────────────────────────────

export {
  isWorkspaceOperational,
  hasStatus,
  meetsPlanTier,
  getLimit,
  checkLimit,
  checkLimits,
  findMembership,
  hasRole,
  isAdmin,
  isOwner,
  updateMetadata,
  canTransitionTo,
  transitionStatus,
} from "./entity";

// ─── Factory ─────────────────────────────────────────────────────────────────

export { createWorkspace, createDefaultWorkspace, getDefaultLimits, getAvailablePlans } from "./factory";
export type { CreateWorkspaceOptions } from "./factory";

// ─── Validation ──────────────────────────────────────────────────────────────

export {
  workspaceStatusSchema,
  workspacePlanSchema,
  workspaceRoleSchema,
  workspaceLimitsSchema,
  workspaceMembershipSchema,
  workspaceMetadataSchema,
  workspaceEntitySchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema,
} from "./validation";

export type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  AddMemberInput,
  UpdateMemberRoleInput,
} from "./validation";

// ─── Policies ────────────────────────────────────────────────────────────────

export type { PolicyResult } from "./policies";

export {
  canAccessWorkspace,
  canView,
  canEdit,
  canManage,
  canAdminister,
  canChangePlan,
  canChangeStatus,
  canAddMember,
  canRemoveMember,
} from "./policies";

// ─── Repository ──────────────────────────────────────────────────────────────

export { WorkspaceRepository } from "./repository";

// ─── Resolver ────────────────────────────────────────────────────────────────

export type { ResolverDependencies, ResolveOptions } from "./resolver";

export { resolveWorkspace, contextFromEntity, getEffectiveLimits } from "./resolver";

// ─── Service ─────────────────────────────────────────────────────────────────

export { WorkspaceService, WorkspaceError } from "./service";
export type { ServiceDependencies } from "./service";

// ─── Health ──────────────────────────────────────────────────────────────────

export type { HealthCheckResult, HealthCheck } from "./health";

export {
  checkWorkspaceResolution,
  checkWorkspaceEntity,
  checkWorkspaceLimits,
  checkWorkspaceStatus,
  runWorkspaceHealthChecks,
  formatHealthSummary,
} from "./health";

// ─── React Context ───────────────────────────────────────────────────────────

export type { WorkspaceContextValue } from "./context";

export { CurrentWorkspaceProvider, useCurrentWorkspace, useOptionalWorkspace } from "./context";
