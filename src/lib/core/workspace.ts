/**
 * NAMA Platform — Workspace Domain (Legacy Compatibility Layer).
 *
 * This file re-exports workspace types and utilities from the new
 * workspace subdirectory (src/lib/core/workspace/).
 *
 * The old BaseRepository class is preserved here for backward compatibility,
 * but new code should use BaseRepository from @/lib/repositories/base.
 *
 * Import from:
 *   @/lib/core/workspace        — workspace types, context, helpers
 *   @/lib/repositories          — BaseRepository, repositories
 */

// Re-export everything from the new workspace module
export type {
  WorkspaceContext,
  WorkspaceEntity,
  WorkspaceStatus,
  WorkspacePlan,
  WorkspaceLimits,
  WorkspaceMembership,
  WorkspaceMetadata,
  WorkspaceRole,
  QuotaCheck,
} from "./workspace/types";

export {
  DEFAULT_WORKSPACE,
  ACTIVE_WORKSPACE_STATUSES,
  WORKSPACE_STATUS_TRANSITIONS,
  WORKSPACE_STATUS_LABELS,
  WORKSPACE_PLAN_LABELS,
} from "./workspace/types";

export { CurrentWorkspaceProvider, useCurrentWorkspace, useOptionalWorkspace } from "./workspace/context";
export type { WorkspaceContextValue } from "./workspace/context";

// Legacy: old BaseRepository — still available for any code importing it
import { DEFAULT_WORKSPACE as _DEFAULT_WORKSPACE } from "./workspace/types";

/**
 * Base repository class that provides workspace-aware query building.
 * All domain repositories extend this.
 *
 * @deprecated Use BaseRepository from @/lib/repositories/base instead.
 */
export abstract class BaseRepository {
  protected workspace: import("./workspace/types").WorkspaceContext;

  constructor(workspace?: import("./workspace/types").WorkspaceContext) {
    this.workspace = workspace ?? _DEFAULT_WORKSPACE;
  }

  /**
   * Set the workspace context for this repository instance.
   * Useful when switching between workspaces at runtime.
   */
  setWorkspace(workspace: import("./workspace/types").WorkspaceContext): void {
    this.workspace = workspace;
  }

  /**
   * Get the current workspace ID.
   */
  protected get workspaceId(): string | undefined {
    return this.workspace.workspaceId;
  }
}
