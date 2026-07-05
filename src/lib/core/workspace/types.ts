/**
 * NAMA Platform — Workspace Domain Types.
 *
 * Workspace is the center of the system.
 * Everything works through Workspace, never directly through User.
 *
 * Architecture: User → Workspace → Repositories → Provider → Database
 *
 * IMPORTANT: No database schema changes are made in this epic.
 * Workspace data is persisted via existing tables (site_content, user_roles).
 * Workspace_id columns do not yet exist in data tables — filtering is
 * architecture-ready but inert until columns are added.
 */

// ─── Status ─────────────────────────────────────────────────────────────────
// Never use isActive boolean. Always use status.

/**
 * Workspace lifecycle status.
 *
 * Provisioning → Active/Trial → Suspended → Archived → Deleted
 *                        ↓
 *                   Suspended (can return to Active)
 */
export type WorkspaceStatus =
  | "provisioning"  // Being created, not yet usable
  | "active"        // Fully operational
  | "trial"         // Limited trial period
  | "suspended"     // Temporarily disabled (payment, violation)
  | "archived"      // Frozen, can be restored
  | "deleted";      // Irreversibly removed

/** All statuses reachable from the given status. */
export const WORKSPACE_STATUS_TRANSITIONS: Record<WorkspaceStatus, WorkspaceStatus[]> = {
  provisioning: ["active", "trial", "deleted"],
  active: ["suspended", "trial", "archived", "deleted"],
  trial: ["active", "suspended", "archived", "deleted"],
  suspended: ["active", "archived", "deleted"],
  archived: ["active", "deleted"],
  deleted: [],
};

/** Workspace statuses that allow read/write operations. */
export const ACTIVE_WORKSPACE_STATUSES: ReadonlySet<WorkspaceStatus> = new Set([
  "active",
  "trial",
]);

/** Human-readable labels for workspace statuses. */
export const WORKSPACE_STATUS_LABELS: Record<WorkspaceStatus, string> = {
  provisioning: "Provisioning",
  active: "Active",
  trial: "Trial",
  suspended: "Suspended",
  archived: "Archived",
  deleted: "Deleted",
};

// ─── Plan ────────────────────────────────────────────────────────────────────

/** Available workspace plans. */
export type WorkspacePlan = "free" | "starter" | "pro" | "enterprise";

/** Human-readable labels for workspace plans. */
export const WORKSPACE_PLAN_LABELS: Record<WorkspacePlan, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

// ─── Limits — DATA, never hardcoded ──────────────────────────────────────────

/**
 * Workspace resource limits.
 * These are **data** — stored per-workspace, never hardcoded.
 * Defaults are provided by WorkspaceFactory for each plan.
 */
export interface WorkspaceLimits {
  /** Maximum number of pages/blocks. */
  maxPages: number;
  /** Maximum number of media files. */
  maxMedia: number;
  /** Maximum storage in bytes. */
  maxStorage: number;
  /** Maximum number of theme templates. */
  maxTemplates: number;
  /** Maximum number of admin users. */
  maxAdmins: number;
  /** Analytics data retention in days. */
  maxAnalyticsRetention: number;
  /** Maximum monthly visitors. */
  maxVisitors: number;
}

// ─── Membership ──────────────────────────────────────────────────────────────

/** Role a user has within a workspace. */
export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

/** A user's membership in a workspace. */
export interface WorkspaceMembership {
  /** Auth user ID. */
  userId: string;
  /** Role within this workspace. */
  role: WorkspaceRole;
  /** When the user joined. */
  joinedAt: string;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

/** User-facing workspace metadata. */
export interface WorkspaceMetadata {
  /** Display name. */
  name: string;
  /** Optional description. */
  description?: string;
  /** Logo URL. */
  logo?: string;
  /** Custom domain (e.g., cafe.example.com). */
  domain?: string;
  /** Locale (e.g., "fa-IR", "en-US"). */
  locale: string;
  /** Timezone (e.g., "Asia/Tehran"). */
  timezone: string;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

// ─── Entity ──────────────────────────────────────────────────────────────────

/** Complete workspace entity. */
export interface WorkspaceEntity {
  /** Unique workspace identifier. */
  id: string;
  /** Current lifecycle status. */
  status: WorkspaceStatus;
  /** Billing/service plan. */
  plan: WorkspacePlan;
  /** Resource limits for this workspace. */
  limits: WorkspaceLimits;
  /** User membership list. */
  membership: WorkspaceMembership[];
  /** Display metadata. */
  metadata: WorkspaceMetadata;
}

// ─── Context (non-React) ────────────────────────────────────────────────────

/**
 * Opaque workspace context injected into repositories.
 * This is the type used by BaseRepository and RepositoryDependencies.
 * Extends the existing WorkspaceContext with richer entity info.
 */
export interface WorkspaceContext {
  workspaceId?: string;
  /** The full workspace entity when available. */
  entity?: WorkspaceEntity;
}

// ─── Default ─────────────────────────────────────────────────────────────────

/** Default single-tenant workspace context. */
export const DEFAULT_WORKSPACE: WorkspaceContext = {
  workspaceId: undefined,
  entity: undefined,
};

// ─── Quota check result ──────────────────────────────────────────────────────

/** Result of a quota/limit check. */
export interface QuotaCheck {
  /** Whether the operation is allowed. */
  allowed: boolean;
  /** Which limit was hit (if denied). */
  limit?: keyof WorkspaceLimits;
  /** Current usage value. */
  current?: number;
  /** Maximum allowed value. */
  maximum?: number;
  /** Human-readable message. */
  message?: string;
}
