/**
 * NAMA Platform — Workspace Validation.
 *
 * Zod schemas for workspace operations.
 * These validate input at the service/repository boundary.
 */

import { z } from "zod";
import type {
  WorkspaceStatus,
  WorkspacePlan,
  WorkspaceRole,
} from "./types";

// ─── Status & Plan enums ─────────────────────────────────────────────────────

export const workspaceStatusSchema = z.enum([
  "provisioning",
  "active",
  "trial",
  "suspended",
  "archived",
  "deleted",
]) satisfies z.ZodType<WorkspaceStatus>;

export const workspacePlanSchema = z.enum([
  "free",
  "starter",
  "pro",
  "enterprise",
]) satisfies z.ZodType<WorkspacePlan>;

export const workspaceRoleSchema = z.enum([
  "owner",
  "admin",
  "member",
  "viewer",
]) satisfies z.ZodType<WorkspaceRole>;

// ─── Limits schema ───────────────────────────────────────────────────────────

export const workspaceLimitsSchema = z.object({
  maxPages: z.number().int().min(0),
  maxMedia: z.number().int().min(0),
  maxStorage: z.number().int().min(0),
  maxTemplates: z.number().int().min(0),
  maxAdmins: z.number().int().min(0),
  maxAnalyticsRetention: z.number().int().min(0),
  maxVisitors: z.number().int().min(0),
});

// ─── Membership schema ───────────────────────────────────────────────────────

export const workspaceMembershipSchema = z.object({
  // Nullable: Public Provisioning API creates workspaces with no direct owner
  // (ownership is resolved externally via externalOrderId). See WorkspaceMembership.
  userId: z.string().min(1).nullable(),
  role: workspaceRoleSchema,
  joinedAt: z.string().datetime(),
});

// ─── Metadata schema ─────────────────────────────────────────────────────────

export const workspaceMetadataSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  logo: z.string().url().optional(),
  domain: z.string().optional(),
  locale: z.string().min(2).max(10),
  timezone: z.string().min(1).max(50),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ─── Full entity schema ──────────────────────────────────────────────────────

export const workspaceEntitySchema = z.object({
  id: z.string().min(1),
  status: workspaceStatusSchema,
  plan: workspacePlanSchema,
  limits: workspaceLimitsSchema,
  membership: z.array(workspaceMembershipSchema),
  metadata: workspaceMetadataSchema,
});

// ─── Create / Update schemas ────────────────────────────────────────────

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  plan: workspacePlanSchema.optional().default("free"),
  ownerUserId: z.string().min(1),
  locale: z.string().min(2).max(10).optional().default("fa-IR"),
  timezone: z.string().min(1).max(50).optional().default("Asia/Tehran"),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  logo: z.string().url().optional(),
  domain: z.string().optional(),
  locale: z.string().min(2).max(10).optional(),
  timezone: z.string().min(1).max(50).optional(),
});

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

// ─── Membership mutation schemas ─────────────────────────────────────────────

export const addMemberSchema = z.object({
  userId: z.string().min(1),
  role: workspaceRoleSchema.optional().default("member"),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;

export const updateMemberRoleSchema = z.object({
  userId: z.string().min(1),
  role: workspaceRoleSchema,
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
