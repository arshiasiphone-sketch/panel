/**
 * NAMA Platform — Provision Transaction.
 *
 * Transaction manager for the provisioning pipeline.
 * Tracks each step's execution state, manages the transaction log,
 * and coordinates with the rollback mechanism.
 *
 * Every provision is transactional — if one step fails, the system
 * never leaves partial data. It either rolls back or retries.
 */

import { BaseRepository, type RepositoryDependencies } from "@/lib/repositories/base";
import { createId } from "@/lib/utils";
import type {
  ProvisionTransaction,
  ProvisionStep,
  ProvisionStepResult,
  ProvisionTransactionStatus,
} from "./types";
import { PROVISION_PIPELINE } from "./types";
import { provisionTransactionSchema } from "./validation";

// ─── Storage key ─────────────────────────────────────────────────────────────

const TX_KEY_PREFIX = "provision:tx:";

function transactionKey(txId: string): string {
  return `${TX_KEY_PREFIX}${txId}`;
}

export class ProvisionTransactionManager extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  /**
   * Begin a new provision transaction.
   */
  async begin(params: {
    workspaceId: string;
    blueprintId: string;
    blueprintVersion: string;
    initiatedBy: string | null;
    maxRetries?: number;
  }): Promise<ProvisionTransaction> {
    const tx: ProvisionTransaction = {
      id: createId(),
      workspaceId: params.workspaceId,
      blueprintId: params.blueprintId,
      blueprintVersion: params.blueprintVersion,
      status: "pending",
      initiatedBy: params.initiatedBy,
      startedAt: new Date().toISOString(),
      steps: [],
      currentStepIndex: 0,
      retryCount: 0,
      maxRetries: params.maxRetries ?? 3,
    };

    await this._save(tx);
    this.logger.info(`Provision transaction started: ${tx.id}`, {
      source: "provision",
      workspaceId: tx.workspaceId,
      blueprintId: tx.blueprintId,
    });

    return tx;
  }

  /**
   * Update the transaction status.
   */
  async updateStatus(txId: string, status: ProvisionTransactionStatus): Promise<ProvisionTransaction> {
    const tx = await this._loadOrThrow(txId);
    tx.status = status;
    if (status === "completed" || status === "failed" || status === "rolled_back") {
      tx.completedAt = new Date().toISOString();
    }
    await this._save(tx);
    return tx;
  }

  /**
   * Record a step result and advance to the next step.
   */
  async recordStep(
    txId: string,
    step: ProvisionStep,
    result: Omit<ProvisionStepResult, "step" | "startedAt">,
  ): Promise<ProvisionTransaction> {
    const tx = await this._loadOrThrow(txId);

    const stepResult: ProvisionStepResult = {
      step,
      ...result,
      startedAt: new Date().toISOString(),
    };

    // Update or append the step result
    const existingIndex = tx.steps.findIndex((s) => s.step === step);
    if (existingIndex >= 0) {
      tx.steps[existingIndex] = stepResult;
    } else {
      tx.steps.push(stepResult);
    }

    // Advance to the next step index
    const currentPipelineIndex = PROVISION_PIPELINE.indexOf(step);
    tx.currentStepIndex = Math.min(currentPipelineIndex + 1, PROVISION_PIPELINE.length);

    await this._save(tx);
    return tx;
  }

  /**
   * Get a transaction by ID.
   */
  async get(txId: string): Promise<ProvisionTransaction | null> {
    try {
      return await this._loadOrThrow(txId);
    } catch (err) {
      this.logger.warn(`Provision transaction not found: ${txId}`, {
        source: "provision-transaction",
        txId,
        cause: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }

  /**
   * Get all transactions for a workspace.
   */
  async getByWorkspace(workspaceId: string): Promise<ProvisionTransaction[]> {
    try {
      const { data } = await this.db
        .from("site_content")
        .select("value")
        .like("key", `${TX_KEY_PREFIX}%`);

      if (!data) return [];

      return data
        .map((row) => {
          const result = provisionTransactionSchema.safeParse(row.value);
          return result.success && result.data.workspaceId === workspaceId
            ? result.data
            : null;
        })
        .filter(Boolean) as ProvisionTransaction[];
    } catch (err) {
      this.logger.warn(`Failed to fetch transactions for workspace ${workspaceId}`, {
        source: "provision-transaction",
        workspaceId,
        cause: err instanceof Error ? err.message : String(err),
      });
      return [];
    }
  }

  /**
   * Get the next step in the pipeline.
   * Returns null if the pipeline is complete.
   */
  getNextStep(tx: ProvisionTransaction): ProvisionStep | null {
    if (tx.currentStepIndex >= PROVISION_PIPELINE.length) {
      return null;
    }
    return PROVISION_PIPELINE[tx.currentStepIndex];
  }

  /**
   * Calculate the total duration of a transaction.
   */
  getDuration(tx: ProvisionTransaction): number {
    const start = new Date(tx.startedAt).getTime();
    const end = tx.completedAt
      ? new Date(tx.completedAt).getTime()
      : Date.now();
    return end - start;
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private async _save(tx: ProvisionTransaction): Promise<void> {
    this.validateOrThrow(
      provisionTransactionSchema,
      tx as unknown as Record<string, unknown>,
      "provision.transaction.save",
    );
    const key = transactionKey(tx.id);
    const { error } = await this.db
      .from("site_content")
      .upsert({
        key,
        value: tx as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      });
    if (error) throw this.normalizeError("site_content", "provision.saveTransaction", error, { txId: tx.id });
  }

  private async _loadOrThrow(txId: string): Promise<ProvisionTransaction> {
    const key = transactionKey(txId);
    const { data, error } = await this.db
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) throw this.normalizeError("site_content", "provision.loadTransaction", error, { txId });
    if (!data) {
      throw new Error(`Provision transaction not found: ${txId}`);
    }

    const result = provisionTransactionSchema.safeParse(data.value);
    if (!result.success) {
      throw new Error(`Invalid provision transaction data: ${txId}`);
    }

    return result.data as ProvisionTransaction;
  }
}
