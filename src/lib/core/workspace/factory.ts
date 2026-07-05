/**
 * NAMA Platform — Workspace Factory.
 *
 * Creates workspace entities with proper defaults for each plan.
 * Limits are DATA — they come from plan defaults here but can be
 * overridden per-workspace at runtime.
 */

import type { WorkspaceEntity, WorkspaceLimits } from "./types";
import { createId } from "@/lib/utils";

// ─── Default limits per plan ─────────────────────────────────────────────────

const PLAN_LIMITS: Record<string, WorkspaceLimits> = {
  free: {
    maxPages: 10,
    maxMedia: 20,
    maxStorage: 50 * 1024 * 1024, // 50 MB
    maxTemplates: 1,
    maxAdmins: 1,
    maxAnalyticsRetention: 30,
    maxVisitors: 1000,
  },
  starter: {
    maxPages: 50,
    maxMedia: 100,
    maxStorage: 500 * 1024 * 1024, // 500 MB
    maxTemplates: 5,
    maxAdmins: 3,
    maxAnalyticsRetention: 90,
    maxVisitors: 10000,
  },
  pro: {
    maxPages: 200,
    maxMedia: 500,
    maxStorage: 2 * 1024 * 1024 * 1024, // 2 GB
    maxTemplates: 20,
    maxAdmins: 10,
    maxAnalyticsRetention: 365,
    maxVisitors: 100000,
  },
  enterprise: {
    maxPages: 1000,
    maxMedia: 5000,
    maxStorage: 20 * 1024 * 1024 * 1024, // 20 GB
    maxTemplates: 100,
    maxAdmins: 100,
    maxAnalyticsRetention: 730,
    maxVisitors: 1000000,
  },
};

/**
 * Get the default limits for a plan.
 * Returns free limits for unknown plans as a safe fallback.
 */
export function getDefaultLimits(plan: string): WorkspaceLimits {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

/**
 * Get all available plans with their labels and limits.
 */
export function getAvailablePlans() {
  return Object.entries(PLAN_LIMITS).map(([id, limits]) => ({
    id,
    limits,
  }));
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export interface CreateWorkspaceOptions {
  name: string;
  description?: string;
  ownerUserId: string;
  plan?: string;
  locale?: string;
  timezone?: string;
}

/**
 * Create a new workspace entity with proper defaults.
 *
 * The workspace starts in "provisioning" status.
 * The caller (WorkspaceService) transitions it to "active" or "trial"
 * after setup is complete.
 */
export function createWorkspace(options: CreateWorkspaceOptions): WorkspaceEntity {
  const now = new Date().toISOString();
  const plan = options.plan ?? "free";

  return {
    id: createId(),
    status: "provisioning",
    plan: plan as WorkspaceEntity["plan"],
    limits: getDefaultLimits(plan),
    membership: [
      {
        userId: options.ownerUserId,
        role: "owner",
        joinedAt: now,
      },
    ],
    metadata: {
      name: options.name,
      description: options.description,
      locale: options.locale ?? "fa-IR",
      timezone: options.timezone ?? "Asia/Tehran",
      createdAt: now,
      updatedAt: now,
    },
  };
}

/**
 * Create the default workspace for single-tenant setups.
 * Used by the WorkspaceResolver when no workspace exists for a user.
 */
export function createDefaultWorkspace(
  ownerUserId: string,
  name?: string,
): WorkspaceEntity {
  return createWorkspace({
    name: name ?? "Default Workspace",
    ownerUserId,
    plan: "free",
  });
}
