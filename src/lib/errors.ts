/**
 * NAMA Platform — standardized error hierarchy.
 *
 * Every error thrown by the platform extends BaseAppError, providing:
 *   - A human-readable message
 *   - An optional error code for programmatic handling
 *   - The original cause (for chaining)
 *   - Structured context metadata
 *
 * Repositories, providers, and validators must only throw these errors.
 * Callers can catch BaseAppError and inspect .code / .context without
 * type-narrowing unknown errors.
 */

/** Severity level for error reporting. */
export type ErrorSeverity = "critical" | "error" | "warning" | "info";

/** Structured context attached to every platform error. */
export interface ErrorContext extends Record<string, unknown> {
  severity?: ErrorSeverity;
  source?: string;
}

// ─── Base ────────────────────────────────────────────────────────────────────

export abstract class BaseAppError extends Error {
  /** Machine-readable error code (e.g. "REPO_NOT_FOUND", "VALIDATION_FAILED"). */
  readonly code?: string;
  /** The original error that caused this one (if any). */
  readonly cause?: unknown;
  /** Additional structured metadata. */
  readonly context: ErrorContext;

  constructor(
    message: string,
    opts?: {
      code?: string;
      cause?: unknown;
      context?: ErrorContext;
    },
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = opts?.code;
    this.cause = opts?.cause;
    this.context = opts?.context ?? {};
  }

  /** Human-readable representation including code when available. */
  get fullMessage(): string {
    return this.code ? `[${this.code}] ${this.message}` : this.message;
  }
}

// ─── Repository ──────────────────────────────────────────────────────────────

export class RepositoryError extends BaseAppError {
  constructor(
    table: string,
    operation: string,
    opts?: {
      message?: string;
      code?: string;
      cause?: unknown;
      context?: ErrorContext;
    },
  ) {
    super(opts?.message ?? `Repository operation failed: ${operation} on ${table}`, {
      code: opts?.code ?? `REPO_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
      cause: opts?.cause,
      context: { ...opts?.context, table, operation },
    });
  }
}

export class NotFoundError extends RepositoryError {
  readonly id?: string;

  constructor(
    table: string,
    id?: string,
    opts?: { cause?: unknown; context?: ErrorContext },
  ) {
    super(table, "find", {
      message: id ? `Record not found in ${table}: ${id}` : `Record not found in ${table}`,
      code: "REPO_NOT_FOUND",
      cause: opts?.cause,
      context: { ...opts?.context, id },
    });
    this.id = id;
  }
}

// ─── Validation ──────────────────────────────────────────────────────────────

export class ValidationError extends BaseAppError {
  constructor(
    target: string,
    issues: Array<{ path: string; message: string }>,
    opts?: { cause?: unknown; context?: ErrorContext },
  ) {
    const detail = issues.map((i) => `${i.path}: ${i.message}`).join("; ");
    super(`Validation failed for ${target}: ${detail}`, {
      code: "VALIDATION_FAILED",
      cause: opts?.cause,
      context: { ...opts?.context, target, issues },
    });
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export class ProviderError extends BaseAppError {
  constructor(
    provider: string,
    operation: string,
    opts?: {
      message?: string;
      code?: string;
      cause?: unknown;
      context?: ErrorContext;
    },
  ) {
    super(opts?.message ?? `${provider} provider error during ${operation}`, {
      code: `PROVIDER_${provider.toUpperCase()}_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
      cause: opts?.cause,
      context: { ...opts?.context, provider, operation },
    });
  }
}

export class StorageError extends ProviderError {
  constructor(
    operation: string,
    bucket: string,
    opts?: { message?: string; cause?: unknown; context?: ErrorContext },
  ) {
    super("storage", operation, {
      message: opts?.message ?? `Storage ${operation} failed on bucket "${bucket}"`,
      code: `STORAGE_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
      cause: opts?.cause,
      context: { ...opts?.context, bucket },
    });
  }
}

export class AuthError extends ProviderError {
  constructor(
    operation: string,
    opts?: { message?: string; cause?: unknown; context?: ErrorContext },
  ) {
    super("auth", operation, {
      message: opts?.message ?? `Auth ${operation} failed`,
      code: `AUTH_${operation.toUpperCase().replace(/\s+/g, "_")}_ERROR`,
      cause: opts?.cause,
      context: opts?.context,
    });
  }
}
