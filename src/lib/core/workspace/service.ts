/**
 * NAMA Platform — Workspace Service.
 *
 * Business logic layer for workspace operations.
 * Orchestrates factory, repository, policies, and entity validation.
 */

import type { WorkspaceEntity, WorkspaceContext, WorkspaceStatus, WorkspaceRole } from "./types";
import { DEFAULT_WORKSPACE } from "./types";
import type { WorkspaceRepository } from "./repository";
import { createWorkspace, type CreateWorkspaceOptions } from "./factory";
import { transitionStatus, updateMetadata } from "./entity";
import {
  canAccessWorkspace,
  canManage,
  canAdminister,
  canChangeStatus,
  canAddMember,
  canRemoveMember,
  canView,
} from "./policies";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema,
  type CreateWorkspaceInput,
  type UpdateWorkspaceInput,
  type AddMemberInput,
  type UpdateMemberRoleInput,
} from "./validation";

export interface ServiceDependencies {
  workspaceRepository: WorkspaceRepository;
}

// ─── Errors ──────────────────────────────────────────────────────────────────

export class WorkspaceError extends Error {
  constructor(
    message: string,
    public readonly code: string = "WORKSPACE_ERROR",
  ) {
    super(message);
    this.name = "WorkspaceError";
  }
}

// ─── Service ─────────────────────────────────────────────────────────────────

export class WorkspaceService {
  constructor(private readonly deps: ServiceDependencies) {}

  // ─── Read ──────────────────────────────────────────────────────────────

  /**
   * Get a workspace by ID. Returns null if not found.
   */
  async getById(id: string): Promise<WorkspaceEntity | null> {
    return this.deps.workspaceRepository.findById(id);
  }

  /**
   * Get all workspaces for a user.
   */
  async getForUser(userId: string): Promise<WorkspaceEntity[]> {
    return this.deps.workspaceRepository.findByUserId(userId);
  }

  /**
   * List all workspaces (admin only).
   */
  async listAll(): Promise<WorkspaceEntity[]> {
    return this.deps.workspaceRepository.listAll();
  }

  // ─── Create ────────────────────────────────────────────────────────────

  /**
   * Create a new workspace.
   * The workspace starts in "provisioning" status.
   * Call activate() to transition to "active".
   */
  async create(input: CreateWorkspaceInput): Promise<WorkspaceEntity> {
    const validated = createWorkspaceSchema.parse(input);
    const entity = createWorkspace({
      name: validated.name,
      description: validated.description,
      ownerUserId: validated.ownerUserId,
      plan: validated.plan,
      locale: validated.locale,
      timezone: validated.timezone,
    });
    await this.deps.workspaceRepository.save(entity);
    return entity;
  }

  /**
   * Create a workspace and immediately activate it.
   */
  async createAndActivate(input: CreateWorkspaceInput): Promise<WorkspaceEntity> {
    const entity = await this.create(input);
    return this.activate(entity.id, input.ownerUserId);
  }

  // ─── Update ────────────────────────────────────────────────────────────

  /**
   * Update workspace metadata.
   */
  async update(
    id: string,
    input: UpdateWorkspaceInput,
    userId?: string,
  ): Promise<WorkspaceEntity> {
    const entity = await this._getEntityOrThrow(id);
    const policy = canManage(entity, userId);
    if (!policy.allowed) throw new WorkspaceError(policy.reason!, "FORBIDDEN");

    const validated = updateWorkspaceSchema.parse(input);
    const updated = updateMetadata(entity, validated);
    await this.deps.workspaceRepository.save(updated);
    return updated;
  }

  // ─── Status transitions ────────────────────────────────────────────────

  /**
   * Activate a workspace (provisioning → active).
   */
  async activate(id: string, userId?: string): Promise<WorkspaceEntity> {
    return this._transition(id, "active", userId);
  }

  /**
   * Suspend a workspace.
   */
  async suspend(id: string, userId?: string): Promise<WorkspaceEntity> {
    return this._transition(id, "suspended", userId);
  }

  /**
   * Archive a workspace.
   */
  async archive(id: string, userId?: string): Promise<WorkspaceEntity> {
    return this._transition(id, "archived", userId);
  }

  /**
   * Restore an archived workspace.
   */
  async restore(id: string, userId?: string): Promise<WorkspaceEntity> {
    return this._transition(id, "active", userId);
  }

  /**
   * Delete a workspace.
   */
  async delete(id: string, userId?: string): Promise<void> {
    const entity = await this._getEntityOrThrow(id);
    const policy = canAdminister(entity, userId);
    if (!policy.allowed) throw new WorkspaceError(policy.reason!, "FORBIDDEN");

    const check = canChangeStatus(entity, "deleted", userId);
    if (!check.allowed) throw new WorkspaceError(check.reason!, "FORBIDDEN");

    await this.deps.workspaceRepository.delete(id);
  }

  // ─── Membership ────────────────────────────────────────────────────────

  /**
   * Add a member to the workspace.
   */
  async addMember(
    id: string,
    input: AddMemberInput,
    userId?: string,
  ): Promise<WorkspaceEntity> {
    const entity = await this._getEntityOrThrow(id);
    const validated = addMemberSchema.parse(input);

    const policy = canAddMember(entity, validated.role, userId);
    if (!policy.allowed) throw new WorkspaceError(policy.reason!, "FORBIDDEN");

    // Check if user is already a member
    if (entity.membership.some((m) => m.userId === validated.userId)) {
      throw new WorkspaceError("User is already a member of this workspace", "ALREADY_MEMBER");
    }

    const updated: WorkspaceEntity = {
      ...entity,
      membership: [
        ...entity.membership,
        {
          userId: validated.userId,
          role: validated.role,
          joinedAt: new Date().toISOString(),
        },
      ],
      metadata: {
        ...entity.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    await this.deps.workspaceRepository.save(updated);
    return updated;
  }

  /**
   * Remove a member from the workspace.
   */
  async removeMember(
    id: string,
    targetUserId: string,
    userId?: string,
  ): Promise<WorkspaceEntity> {
    const entity = await this._getEntityOrThrow(id);

    const policy = canRemoveMember(entity, targetUserId, userId);
    if (!policy.allowed) throw new WorkspaceError(policy.reason!, "FORBIDDEN");

    // Cannot remove the last owner
    if (entity.membership.filter((m) => m.role === "owner").length <= 1) {
      const target = entity.membership.find((m) => m.userId === targetUserId);
      if (target?.role === "owner") {
        throw new WorkspaceError("Cannot remove the last owner", "LAST_OWNER");
      }
    }

    const updated: WorkspaceEntity = {
      ...entity,
      membership: entity.membership.filter((m) => m.userId !== targetUserId),
      metadata: {
        ...entity.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    await this.deps.workspaceRepository.save(updated);
    return updated;
  }

  /**
   * Update a member's role.
   */
  async updateMemberRole(
    id: string,
    input: UpdateMemberRoleInput,
    userId?: string,
  ): Promise<WorkspaceEntity> {
    const entity = await this._getEntityOrThrow(id);
    const validated = updateMemberRoleSchema.parse(input);

    const policy = canManage(entity, userId);
    if (!policy.allowed) throw new WorkspaceError(policy.reason!, "FORBIDDEN");

    // Cannot change the last owner's role
    if (entity.membership.filter((m) => m.role === "owner").length <= 1) {
      const target = entity.membership.find((m) => m.userId === validated.userId);
      if (target?.role === "owner" && validated.role !== "owner") {
        throw new WorkspaceError("Cannot change the last owner's role", "LAST_OWNER");
      }
    }

    const updated: WorkspaceEntity = {
      ...entity,
      membership: entity.membership.map((m) =>
        m.userId === validated.userId ? { ...m, role: validated.role } : m,
      ),
      metadata: {
        ...entity.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    await this.deps.workspaceRepository.save(updated);
    return updated;
  }

  // ─── Private ───────────────────────────────────────────────────────

  private async _getEntityOrThrow(id: string): Promise<WorkspaceEntity> {
    const entity = await this.deps.workspaceRepository.findById(id);
    if (!entity) {
      throw new WorkspaceError(`Workspace not found: ${id}`, "NOT_FOUND");
    }
    return entity;
  }

  private async _transition(
    id: string,
    nextStatus: WorkspaceStatus,
    userId?: string,
  ): Promise<WorkspaceEntity> {
    const entity = await this._getEntityOrThrow(id);
    const policy = canChangeStatus(entity, nextStatus, userId);
    if (!policy.allowed) throw new WorkspaceError(policy.reason!, "FORBIDDEN");

    const updated = transitionStatus(entity, nextStatus);
    await this.deps.workspaceRepository.save(updated);
    return updated;
  }
}
