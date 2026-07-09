/**
 * NAMA Platform — Provision Engine.
 *
 * Enterprise-grade Provision Engine using the Command Pattern.
 *
 * Key improvements:
 * - Command Pattern: Each pipeline step is an independent ProvisionStepCommand
 * - Generic rollback: Each step knows how to undo itself via its rollback() method
 * - Configurable retry: Each step has its own RetryPolicy
 * - Comprehensive session: ProvisionSession tracks everything (resources, timings, warnings)
 * - Pure orchestration: Engine orchestrates — all business logic is in repositories
 * - No sub-agents: All sub-component classes (installer, seeder, rollback) consolidated
 * - Backward compatible: Public API unchanged
 *
 * Architecture:
 *   ProvisionEngine
 *     ↓ reads
 *   PROVISION_PIPELINE (ordered steps)
 *     ↓ delegates to
 *   ProvisionStepCommand.execute() / .rollback()
 *     ↓ via
 *   Repositories → Providers → Database
 *
 * One Request → One Ready Website. Everything happens automatically.
 */

import type { ProvisionReport, Blueprint } from "./types";
import { PROVISION_PIPELINE, ProvisionStep } from "./types";
import { provisionRequestSchema, type ProvisionRequestInput } from "./validation";
import type { ProvisionSession } from "./session-context";
import { createSession, appendStepMetric } from "./session-context";
import type { ProvisionStepCommand, RetryPolicy } from "./steps";
import { getRetryDelayMs } from "./steps";
import type { BlueprintLoader } from "./blueprint/loader";
import type { ProvisionTransactionManager } from "./transaction";
import type { ProvisionValidator, ValidationResult } from "./validator";
import type { ProvisionReportGenerator } from "./report";
import { createWorkspace } from "@/lib/core/workspace/factory";
import type { WorkspaceRepository } from "@/lib/core/workspace/repository";
import type { ILogger } from "@/lib/logger";
import type { Repositories } from "@/lib/repositories/factory";

export interface EngineDependencies {
  loader: BlueprintLoader;
  transactionManager: ProvisionTransactionManager;
  validator: ProvisionValidator;
  reportGenerator: ProvisionReportGenerator;
  workspaceRepository: WorkspaceRepository;
  repos: Repositories;
  stepRegistry: Map<ProvisionStep, ProvisionStepCommand>;
  logger: ILogger;
}

export class ProvisionEngine {
  private readonly deps: EngineDependencies;

  constructor(deps: EngineDependencies) {
    this.deps = deps;
  }

  /**
   * Start the provisioning pipeline.
   * One Request → One Ready Website.
   */
  async provision(input: ProvisionRequestInput): Promise<ProvisionReport> {
    const startedAt = new Date().toISOString();
    const startMs = Date.now();

    // 1. Validate request
    const validation = await this.deps.validator.validate(input);
    if (!validation.valid) {
      throw new Error(`Provision validation failed: ${validation.error}`);
    }

    const parsed = provisionRequestSchema.parse(input);
    const resolved = validation.resolved!;

    // 2. Load the blueprint
    const blueprint = await this.deps.loader.loadOrThrow(resolved.blueprintSlug, resolved.blueprintVersion);

    // 3. Create workspace using the existing WorkspaceFactory
    const workspaceId = await this._createWorkspace(blueprint, parsed);

    // 4. Begin transaction — use ownerUserId if present, else fallback to "public-api" for Public Provisioning flow
    const initiatedBy = parsed.ownerUserId ?? "public-api";
    const tx = await this.deps.transactionManager.begin({
      workspaceId,
      blueprintId: resolved.blueprintId,
      blueprintVersion: resolved.blueprintVersion,
      initiatedBy,
    });

    // 5. Create provision session — the single source of truth for this operation
    const session = createSession({
      workspaceId,
      transactionId: tx.id,
      blueprintSlug: resolved.blueprintSlug,
      blueprintVersion: resolved.blueprintVersion,
      initiatedBy,
      startedAt,
    });

    try {
      // 6. Execute the pipeline using the Command Pattern
      await this._executePipeline(blueprint, session);

      // 7. Mark transaction as completed
      await this.deps.transactionManager.updateStatus(tx.id, "completed");

      this.deps.logger.info(`Provision complete: ${blueprint.name} → workspace ${workspaceId}`, {
        source: "provision-engine",
        transactionId: tx.id,
        workspaceId,
        durationMs: Date.now() - startMs,
        stepCount: session.stepMetrics.length,
        ...this._summarizeResources(session),
      });
    } catch (err) {
      await this._handleFailure(tx, blueprint, session, err);
    }

    // 8. Get final transaction state and generate report
    const finalTx = (await this.deps.transactionManager.get(tx.id))!;
    const workspaceInfo = await this._getWorkspaceInfo(workspaceId);

    return this.deps.reportGenerator.generate(finalTx, blueprint, workspaceInfo, session);
  }

  // ─── Pipeline execution ────────────────────────────────────────────────

  /**
   * Execute all pipeline steps in order using the Command Pattern.
   * Each step is executed via its command's execute() method.
   * On failure, rollback() is called on each completed step in reverse order.
   */
  private async _executePipeline(blueprint: Blueprint, session: ProvisionSession): Promise<void> {
    for (const step of PROVISION_PIPELINE) {
      const command = this.deps.stepRegistry.get(step);
      if (!command) {
        throw new Error(`No command registered for step: ${step}`);
      }

      await this._executeStepWithRetry(command, blueprint, session);
    }
  }

  /**
   * Execute a single step with retry support.
   * Retry policy is configurable per step via the command's retryPolicy.
   */
  private async _executeStepWithRetry(
    command: ProvisionStepCommand,
    blueprint: Blueprint,
    session: ProvisionSession,
  ): Promise<void> {
    const step = command.step;
    const policy = command.retryPolicy;
    let retryCount = 0;

    while (true) {
      const stepStartMs = Date.now();

      try {
        const output = await command.execute(
          blueprint,
          session.context.workspaceId,
          this.deps.repos,
          session,
        );

        const durationMs = Date.now() - stepStartMs;

        // Record success metric
        appendStepMetric(session, {
          step,
          durationMs,
          success: true,
          retryCount,
          output,
        });

        // Persist to transaction manager
        await this.deps.transactionManager.recordStep(session.context.transactionId, step, {
          success: true,
          completedAt: new Date().toISOString(),
          durationMs,
          output,
        });

        this.deps.logger.info(`Step completed: ${command.label} (${durationMs}ms)`, {
          source: "provision-engine",
          transactionId: session.context.transactionId,
          workspaceId: session.context.workspaceId,
          retryCount,
        });

        return;
      } catch (err) {
        retryCount++;
        const durationMs = Date.now() - stepStartMs;

        // Calculate delay based on the step's retry policy
        const delay = getRetryDelayMs(policy, retryCount - 1, err);

        if (delay >= 0) {
          // Persist retry attempt
          await this.deps.transactionManager.recordStep(session.context.transactionId, step, {
            success: false,
            completedAt: new Date().toISOString(),
            error: `Retrying (attempt ${retryCount})...`,
            output: { retryCount },
          });

          this.deps.logger.warn(
            `Retrying step ${command.label} (attempt ${retryCount}) after ${delay}ms`,
            {
              source: "provision-engine",
              transactionId: session.context.transactionId,
              workspaceId: session.context.workspaceId,
            },
          );

          await this._sleep(delay);
          continue;
        }

        // No more retries — record failure metric
        const message = err instanceof Error ? err.message : String(err);
        appendStepMetric(session, {
          step,
          durationMs,
          success: false,
          retryCount: retryCount - 1,
          error: message,
        });

        // Persist final failure
        await this.deps.transactionManager.recordStep(session.context.transactionId, step, {
          success: false,
          completedAt: new Date().toISOString(),
          durationMs,
          error: message,
        });

        // Rollback through all completed steps (generic via commands)
        await this._rollbackCompletedSteps(blueprint, session, command);

        throw err;
      }
    }
  }

  /**
   * Generic rollback — rolls back all completed steps in reverse order.
   * Each step's command knows how to undo itself.
   * No domain knowledge in the engine.
   */
  private async _rollbackCompletedSteps(
    blueprint: Blueprint,
    session: ProvisionSession,
    failedCommand?: ProvisionStepCommand,
  ): Promise<void> {
    const rollbackStart = Date.now();
    const completedSteps = session.stepMetrics
      .filter((m) => m.success)
      .reverse();

    let allRolledBack = true;

    for (const metric of completedSteps) {
      const command = this.deps.stepRegistry.get(metric.step);
      if (!command || command === failedCommand) continue;

      try {
        await command.rollback(
          blueprint,
          session.context.workspaceId,
          this.deps.repos,
          session,
        );

        this.deps.logger.info(`Rolled back step: ${command.label}`, {
          source: "provision-engine",
          transactionId: session.context.transactionId,
          workspaceId: session.context.workspaceId,
        });
      } catch (rollbackErr) {
        const msg = rollbackErr instanceof Error ? rollbackErr.message : String(rollbackErr);
        this.deps.logger.error(`Rollback failed for step ${command.label}: ${msg}`, {
          source: "provision-engine",
          transactionId: session.context.transactionId,
          workspaceId: session.context.workspaceId,
        });
        allRolledBack = false;
      }
    }

    session.rollback = {
      attempted: true,
      success: allRolledBack,
      durationMs: Date.now() - rollbackStart,
    };
  }

  // ─── Workspace management ──────────────────────────────────────────────

  /**
   * Create workspace using the existing WorkspaceFactory.
   * The factory owns all construction logic — engine never constructs directly.
   */
  private async _createWorkspace(
    blueprint: Blueprint,
    request: ProvisionRequestInput,
  ): Promise<string> {
    const entity = createWorkspace({
      name: request.workspaceName ?? blueprint.name,
      description: request.workspaceDescription ?? blueprint.description,
      ownerUserId: request.ownerUserId ?? null, // Public Provisioning flow has no direct owner
      plan: request.plan ?? "free",
      locale: request.locale ?? "fa-IR",
      timezone: request.timezone ?? "Asia/Tehran",
      domain: request.domain, // Pre-validated full domain (check-slug already confirmed availability)
    });

    await this.deps.workspaceRepository.save(entity);

    this.deps.logger.info(`Workspace created for provisioning: ${entity.id}`, {
      source: "provision-engine",
      blueprint: blueprint.slug,
      plan: entity.plan,
    });

    return entity.id;
  }

  // ─── Failure handling ───────────────────────────────────────────────────

  private async _handleFailure(
    tx: { id: string; workspaceId: string },
    blueprint: Blueprint,
    session: ProvisionSession,
    err: unknown,
  ): Promise<void> {
    const message = err instanceof Error ? err.message : String(err);
    this.deps.logger.error(`Provision failed for transaction ${tx.id}: ${message}`, {
      source: "provision-engine",
      transactionId: tx.id,
      workspaceId: tx.workspaceId,
    });

    // Rollback is already called for the failed step in _executeStepWithRetry
    // If the pipeline failed before any steps completed, do a full rollback
    if (session.stepMetrics.length > 0) {
      await this._rollbackCompletedSteps(blueprint, session);
    }

    if (session.rollback) {
      if (session.rollback.success) {
        this.deps.logger.info(`Full rollback successful for transaction ${tx.id}`, {
          source: "provision-engine",
          transactionId: tx.id,
          workspaceId: tx.workspaceId,
        });
      } else {
        this.deps.logger.error(`Partial rollback for transaction ${tx.id} — some data may remain`, {
          source: "provision-engine",
          transactionId: tx.id,
          workspaceId: tx.workspaceId,
        });
      }
    }

    await this.deps.transactionManager.updateStatus(tx.id, "failed");
  }

  // ─── Utilities ─────────────────────────────────────────────────────────

  private async _getWorkspaceInfo(workspaceId: string): Promise<{
    id: string;
    name: string;
    status: string;
    plan: string;
  }> {
    try {
      const entity = await this.deps.workspaceRepository.findById(workspaceId);
      if (entity) {
        return {
          id: workspaceId,
          name: entity.metadata.name,
          status: entity.status,
          plan: entity.plan,
        };
      }
    } catch (err) {
      this.deps.logger.warn(`Could not fetch workspace info for ${workspaceId}`, {
        source: "provision-engine",
        workspaceId,
        cause: err instanceof Error ? err.message : String(err),
      });
    }
    return { id: workspaceId, name: "Unknown", status: "unknown", plan: "free" };
  }

  private _summarizeResources(session: ProvisionSession): Record<string, number> {
    const rm = session.resourceMap;
    return {
      pageBlocks: rm.pageBlockIds.length,
      menus: rm.menuItemIds.length,
      gallery: rm.galleryImageIds.length,
      personalities: rm.personalityKeys.length,
      siteContentKeys: rm.siteContentKeys.length,
    };
  }

  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
