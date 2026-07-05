/**
 * NAMA Platform — Provision Report.
 *
 * Generates comprehensive reports for provision transactions.
 * Reports include duration, pages, blocks, errors, warnings,
 * workspace info, theme info, and version info.
 *
 * ENTERPRISE FEATURES:
 * - Session metrics integration (timings, memory, resource counts)
 * - Rollback info (duration, success/failure)
 * - Retry statistics
 * - Step-level timing breakdown
 * - Warning collection from session context
 * - Human-readable and machine-readable output
 */

import type {
  ProvisionTransaction,
  ProvisionReport,
  ProvisionStepResult,
  Blueprint,
} from "./types";
import { PROVISION_STEP_LABELS } from "./types";
import type { ProvisionSession } from "./session-context";

/**
 * Extended report data only available when a ProvisionSession is provided.
 */
interface SessionReportData {
  /** Rollback information. */
  rollbackInfo?: {
    attempted: boolean;
    success: boolean;
    durationMs?: number;
    error?: string;
  };
  /** Retry statistics. */
  retryStats?: {
    totalRetries: number;
    stepsRetried: string[];
  };
  /** Resource counts from the resource map. */
  resourceCounts?: {
    pageBlocks: number;
    menuItems: number;
    galleryImages: number;
    personalityKeys: number;
    siteContentKeys: number;
    mediaFileIds: number;
  };
  /** Warnings from the session (in addition to transaction warnings). */
  sessionWarnings: Array<{ step: string; message: string }>;
  /** Extended step timings with retry information. */
  stepTimings: StepTimingDetail[];
}

/** Detailed step timing with additional context. */
interface StepTimingDetail {
  step: string;
  label: string;
  durationMs: number;
  success: boolean;
  retryCount: number;
  output?: Record<string, unknown>;
}

export class ProvisionReportGenerator {
  /**
   * Generate a complete provision report from a transaction and blueprint.
   * Accepts an optional ProvisionSession for expanded metrics.
   */
  generate(
    transaction: ProvisionTransaction,
    blueprint: Blueprint,
    workspaceInfo: {
      id: string;
      name: string;
      status: string;
      plan: string;
    },
    session?: ProvisionSession,
  ): ProvisionReport {
    const completedAt = transaction.completedAt ?? new Date().toISOString();
    const startTime = new Date(transaction.startedAt).getTime();
    const endTime = new Date(completedAt).getTime();
    const durationMs = endTime - startTime;

    // Extract session data if available
    const sessionData = session ? this._extractSessionData(session, transaction) : null;

    // Extract step outputs
    const blueprintStep = this._findStep(transaction.steps, "install_blueprint");
    const themeStep = this._findStep(transaction.steps, "insert_theme");

    // Calculate errors and warnings
    const errors = transaction.steps
      .filter((s) => !s.success && s.error)
      .map((s) => ({
        step: s.step,
        message: s.error!,
        retried: s.output?.retryCount != null && (s.output?.retryCount as number) > 0,
        recovered: sessionData?.retryStats?.totalRetries != null && sessionData.retryStats.totalRetries > 0,
      }));

    // Merge transaction warnings with session warnings
    const warnings: Array<{ step: string; message: string }> = [];
    if (sessionData?.sessionWarnings) {
      warnings.push(...sessionData.sessionWarnings);
    }

    // Generate step timings — prefer session data for richer detail
    const stepTimings = sessionData?.stepTimings ?? transaction.steps.map((s) => ({
      step: s.step,
      label: PROVISION_STEP_LABELS[s.step] ?? s.step,
      durationMs: s.durationMs ?? 0,
      success: s.success,
      retryCount: 0,
      output: s.output,
    }));

    return {
      transactionId: transaction.id,
      success: transaction.status === "completed",
      startedAt: transaction.startedAt,
      completedAt,
      durationMs,

      workspace: workspaceInfo,

      blueprint: {
        id: blueprint.id,
        slug: blueprint.slug,
        version: blueprint.version,
        name: blueprint.name,
        category: blueprint.category,
      },

      theme: {
        presetId: blueprint.theme.presetId,
        applied: themeStep?.success ?? false,
      },

      pages: {
        total: blueprint.pages.length,
        created: (blueprintStep?.output?.pageBlocks as number) ?? blueprint.pages.length,
      },

      blocks: {
        total: blueprint.blocks.length,
        inserted: (blueprintStep?.output?.pageBlocks as number) ?? blueprint.blocks.length,
      },

      navigation: {
        total: blueprint.navigation.length,
        created: (blueprintStep?.output?.navigation as number) ?? (blueprint.navigation.length > 0 ? 1 : 0),
      },

      errors,
      warnings,
      stepTimings,
    } as ProvisionReport;
  }

  /**
   * Format a report as a human-readable string (for logging or display).
   * Includes all available metrics including session data and rollback info.
   */
  format(report: ProvisionReport): string {
    const lines: string[] = [];
    const divider = "═".repeat(60);
    const subDivider = "─".repeat(60);

    lines.push(divider);
    lines.push(`  PROVISION REPORT`);
    lines.push(divider);
    lines.push(`  Status:       ${report.success ? "✓ SUCCESS" : "✗ FAILED"}`);
    lines.push(`  Duration:     ${this._formatDuration(report.durationMs)}`);
    lines.push("");
    lines.push(`  Workspace:`);
    lines.push(`    ID:     ${report.workspace.id}`);
    lines.push(`    Name:   ${report.workspace.name}`);
    lines.push(`    Status: ${report.workspace.status}`);
    lines.push(`    Plan:   ${report.workspace.plan}`);
    lines.push("");
    lines.push(`  Blueprint:`);
    lines.push(`    Name:    ${report.blueprint.name}`);
    lines.push(`    Slug:    ${report.blueprint.slug}`);
    lines.push(`    Version: ${report.blueprint.version}`);
    lines.push(`    Category: ${report.blueprint.category}`);
    lines.push("");
    lines.push(`  Theme:      ${report.theme.presetId} (${report.theme.applied ? "applied" : "not applied"})`);
    lines.push(`  Pages:      ${report.pages.created}/${report.pages.total}`);
    lines.push(`  Blocks:     ${report.blocks.inserted}/${report.blocks.total}`);
    lines.push(`  Navigation: ${report.navigation.created}/${report.navigation.total}`);

    // Rollback info if available
    const reportAny = report as unknown as Record<string, unknown>;
    const rollbackInfo = reportAny.rollbackInfo as {
      attempted: boolean; success: boolean; durationMs?: number; error?: string;
    } | undefined;
    if (rollbackInfo?.attempted) {
      lines.push("");
      lines.push(`  Rollback:`);
      lines.push(`    Attempted: ${rollbackInfo.attempted}`);
      lines.push(`    Success:   ${rollbackInfo.success ? "✓" : "✗"}`);
      if (rollbackInfo.durationMs != null) {
        lines.push(`    Duration:  ${this._formatDuration(rollbackInfo.durationMs)}`);
      }
      if (rollbackInfo.error) {
        lines.push(`    Error:     ${rollbackInfo.error}`);
      }
    }

    // Resource counts if available
    const resourceCounts = reportAny.resourceCounts as Record<string, number> | undefined;
    if (resourceCounts) {
      lines.push("");
      lines.push(`  Resources Created:`);
      lines.push(`    Page Blocks:     ${resourceCounts.pageBlocks ?? 0}`);
      lines.push(`    Menu Items:      ${resourceCounts.menuItems ?? 0}`);
      lines.push(`    Gallery Images:  ${resourceCounts.galleryImages ?? 0}`);
      lines.push(`    Personality:     ${resourceCounts.personalityKeys ?? 0}`);
      lines.push(`    Site Content:    ${resourceCounts.siteContentKeys ?? 0}`);
      lines.push(`    Media Files:     ${resourceCounts.mediaFileIds ?? 0}`);
    }

    lines.push("");

    if (report.errors.length > 0) {
      lines.push(`  Errors (${report.errors.length}):`);
      for (const err of report.errors) {
        lines.push(`    ✗ [${err.step}] ${err.message}`);
        if (err.retried) lines.push(`      (retried, recovered: ${err.recovered})`);
      }
      lines.push("");
    }

    if (report.warnings.length > 0) {
      lines.push(`  Warnings (${report.warnings.length}):`);
      for (const w of report.warnings) {
        lines.push(`    ! [${w.step}] ${w.message}`);
      }
      lines.push("");
    }

    // Step timings
    lines.push(subDivider);
    lines.push(`  Step Timings:`);
    lines.push(subDivider);
    for (const st of report.stepTimings) {
      const icon = st.success ? "✓" : "✗";
      lines.push(`    ${icon} ${st.label.padEnd(25)} ${this._formatDuration(st.durationMs)}`);
    }
    lines.push(subDivider);

    // Summary
    const successCount = report.stepTimings.filter((s) => s.success).length;
    const totalCount = report.stepTimings.length;
    lines.push(`  Total: ${successCount}/${totalCount} steps passed`);
    lines.push(divider);

    return lines.join("\n");
  }

  /**
   * Extract enhanced session data from a ProvisionSession.
   */
  private _extractSessionData(
    session: ProvisionSession,
    transaction: ProvisionTransaction,
  ): SessionReportData {
    // Rollback info
    const rollbackInfo = session.rollback
      ? {
          attempted: session.rollback.attempted,
          success: session.rollback.success,
          durationMs: session.rollback.durationMs,
          error: session.rollback.error,
        }
      : undefined;

    // Retry statistics
    const retriedSteps = session.stepMetrics.filter((m) => m.retryCount > 0);
    const retryStats = {
      totalRetries: retriedSteps.reduce((sum, m) => sum + m.retryCount, 0),
      stepsRetried: retriedSteps.map((m) => m.step),
    };

    // Resource counts from resource map
    const rm = session.resourceMap;
    const resourceCounts = {
      pageBlocks: rm.pageBlockIds.length,
      menuItems: rm.menuItemIds.length,
      galleryImages: rm.galleryImageIds.length,
      personalityKeys: rm.personalityKeys.length,
      siteContentKeys: rm.siteContentKeys.length,
      mediaFileIds: rm.mediaFileIds.length,
    };

    // Session warnings
    const sessionWarnings = session.warnings.map((w) => ({
      step: w.step,
      message: w.message,
    }));

    // Step timings with retry counts from the session
    const stepTimings: StepTimingDetail[] = session.stepMetrics.map((m) => ({
      step: m.step,
      label: PROVISION_STEP_LABELS[m.step] ?? m.step,
      durationMs: m.durationMs,
      success: m.success,
      retryCount: m.retryCount,
      output: m.output,
    }));

    return {
      rollbackInfo,
      retryStats,
      resourceCounts,
      sessionWarnings,
      stepTimings,
    };
  }

  private _findStep(
    steps: ProvisionStepResult[],
    stepName: string,
  ): ProvisionStepResult | undefined {
    return steps.find((s) => s.step === stepName);
  }

  private _formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.round((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
}
