/**
 * NAMA Platform — Workspace Health.
 *
 * Runtime health checks for workspace resolution and capabilities.
 * Components use these to verify the workspace layer is operational.
 */

import type { WorkspaceContext, WorkspaceEntity } from "./types";

// ─── Health check result ─────────────────────────────────────────────────────

export interface HealthCheckResult {
  /** Overall health status. */
  healthy: boolean;
  /** Human-readable summary. */
  summary: string;
  /** Individual check details. */
  checks: HealthCheck[];
}

export interface HealthCheck {
  /** Check name (e.g., "workspace-resolution", "workspace-limits"). */
  name: string;
  /** Whether the check passed. */
  passed: boolean;
  /** Optional detail message. */
  detail?: string;
  /** Optional diagnostic data. */
  data?: Record<string, unknown>;
}

// ─── Health checks ───────────────────────────────────────────────────────────

/**
 * Check that workspace context has been properly resolved.
 */
export function checkWorkspaceResolution(ctx: WorkspaceContext): HealthCheck {
  if (!ctx.workspaceId) {
    return {
      name: "workspace-resolution",
      passed: false,
      detail: "Workspace ID is not set — using single-tenant default",
    };
  }
  return {
    name: "workspace-resolution",
    passed: true,
    detail: `Workspace resolved: ${ctx.workspaceId}`,
    data: { workspaceId: ctx.workspaceId },
  };
}

/**
 * Check that the workspace entity is available and operational.
 */
export function checkWorkspaceEntity(ctx: WorkspaceContext): HealthCheck {
  if (!ctx.entity) {
    return {
      name: "workspace-entity",
      passed: false,
      detail: "Workspace entity not loaded",
    };
  }

  if (!ctx.entity.membership || ctx.entity.membership.length === 0) {
    return {
      name: "workspace-entity",
      passed: false,
      detail: "Workspace has no members",
      data: { workspaceId: ctx.entity.id },
    };
  }

  return {
    name: "workspace-entity",
    passed: true,
    detail: `Workspace "${ctx.entity.metadata.name}" — ${ctx.entity.membership.length} members, plan: ${ctx.entity.plan}, status: ${ctx.entity.status}`,
    data: {
      workspaceId: ctx.entity.id,
      plan: ctx.entity.plan,
      status: ctx.entity.status,
      memberCount: ctx.entity.membership.length,
    },
  };
}

/**
 * Check that workspace limits are available.
 */
export function checkWorkspaceLimits(ctx: WorkspaceContext): HealthCheck {
  if (!ctx.entity) {
    return {
      name: "workspace-limits",
      passed: false,
      detail: "Cannot check limits — workspace entity not loaded",
    };
  }

  const limits = ctx.entity.limits;
  return {
    name: "workspace-limits",
    passed: true,
    detail: `Limits: ${limits.maxPages} pages, ${limits.maxMedia} media, ${limits.maxAdmins} admins`,
    data: limits as unknown as Record<string, unknown>,
  };
}

/**
 * Check if the workspace status allows operations.
 */
export function checkWorkspaceStatus(ctx: WorkspaceContext): HealthCheck {
  if (!ctx.entity) {
    return {
      name: "workspace-status",
      passed: false,
      detail: "Workspace entity not loaded — cannot check status",
    };
  }

  const operationalStatuses = ["active", "trial"];
  const isOperational = operationalStatuses.includes(ctx.entity.status);

  return {
    name: "workspace-status",
    passed: isOperational,
    detail: isOperational
      ? `Workspace is ${ctx.entity.status} — operations allowed`
      : `Workspace is ${ctx.entity.status} — operations may be restricted`,
    data: {
      status: ctx.entity.status,
      operational: isOperational,
    },
  };
}

/**
 * Run all standard health checks for a workspace context.
 */
export function runWorkspaceHealthChecks(ctx: WorkspaceContext): HealthCheckResult {
  const checks = [
    checkWorkspaceResolution(ctx),
    checkWorkspaceEntity(ctx),
    checkWorkspaceLimits(ctx),
    checkWorkspaceStatus(ctx),
  ];

  const allPassed = checks.every((c) => c.passed);

  return {
    healthy: allPassed,
    summary: allPassed
      ? "Workspace layer is healthy"
      : `Workspace layer has ${checks.filter((c) => !c.passed).length} issue(s)`,
    checks,
  };
}

/**
 * Get a summary string suitable for logging.
 */
export function formatHealthSummary(result: HealthCheckResult): string {
  const parts = result.checks.map(
    (c) => `  ${c.passed ? "✓" : "✗"} ${c.name}: ${c.detail ?? "ok"}`,
  );
  return [
    `[Workspace Health] ${result.summary}`,
    ...parts,
  ].join("\n");
}
