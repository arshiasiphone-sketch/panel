/**
 * NAMA Platform — Provision Retry.
 *
 * Retry logic for the provisioning pipeline.
 * Some steps can be retried on transient failures (e.g., database timeouts).
 * Non-transient failures (e.g., invalid blueprint, validation errors)
 * are NOT retried — they trigger a rollback instead.
 */

import { ProvisionStep } from "./types";

export interface RetryConfig {
  /** Maximum number of retry attempts. */
  maxRetries: number;
  /** Base delay in ms before the first retry. */
  baseDelayMs: number;
  /** Maximum delay in ms between retries. */
  maxDelayMs: number;
  /** Multiply delay by this factor each retry. */
  backoffFactor: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  backoffFactor: 2,
};

/**
 * Steps that can be retried on transient failures.
 * Non-transient steps will always trigger a rollback on failure.
 */
export const RETRYABLE_STEPS: ReadonlySet<ProvisionStep> = new Set<ProvisionStep>([
  ProvisionStep.CREATE_WORKSPACE,
  ProvisionStep.INSTALL_BLUEPRINT,
  ProvisionStep.SEED_DATA,
  ProvisionStep.INSERT_THEME,
  ProvisionStep.INSERT_FONTS,
  ProvisionStep.INSERT_DEFAULT_MEDIA,
  ProvisionStep.INSERT_ANALYTICS_DEFAULTS,
  ProvisionStep.RUN_HEALTH_CHECK,
  ProvisionStep.WORKSPACE_READY,
]);

/**
 * Steps that should NOT be retried because they involve validation
 * or user input that won't change between retries.
 */
export const NON_RETRYABLE_STEPS: ReadonlySet<ProvisionStep> = new Set<ProvisionStep>([
  ProvisionStep.VALIDATE_REQUEST,
]);

/**
 * Check if a step can be retried.
 */
export function isStepRetryable(step: ProvisionStep): boolean {
  return RETRYABLE_STEPS.has(step);
}

/**
 * Check if an error is transient (network issue, timeout, etc.)
 * and thus retryable.
 */
export function isTransientError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  const cause = error instanceof Error && error.cause
    ? String(error.cause).toLowerCase()
    : "";

  const transientPatterns = [
    "timeout",
    "timed out",
    "network",
    "econnrefused",
    "econnreset",
    "etimedout",
    "socket hang up",
    "connection",
    "rate limit",
    "too many requests",
    "429",
    "503",
    "502",
    "internal server error",
    "service unavailable",
    "database timeout",
    "query timeout",
  ];

  const combined = `${message} ${cause}`;
  return transientPatterns.some((pattern) => combined.includes(pattern));
}

/**
 * Calculate the delay before the next retry attempt using exponential backoff.
 */
export function getRetryDelay(
  retryCount: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
): number {
  const delay = config.baseDelayMs * Math.pow(config.backoffFactor, retryCount);
  return Math.min(delay, config.maxDelayMs);
}

/**
 * Determine whether to retry a failed step.
 *
 * @returns The delay in ms before retrying, or -1 if no retry should be attempted.
 */
export function shouldRetry(
  step: ProvisionStep,
  retryCount: number,
  maxRetries: number,
  error: unknown,
): number {
  // Check max retries
  if (retryCount >= maxRetries) {
    return -1;
  }

  // Check if step is retryable
  if (!isStepRetryable(step)) {
    return -1;
  }

  // Check if the error is transient
  if (!isTransientError(error)) {
    return -1;
  }

  // Calculate delay
  return getRetryDelay(retryCount);
}
