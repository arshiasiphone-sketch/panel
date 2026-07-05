/**
 * NAMA Platform — logging abstraction.
 *
 * All application logging goes through the ILogger interface.
 * ConsoleLogger is the default; future providers (Sentry, Datadog, Pino, Axiom)
 * can be swapped in without changing application code.
 *
 * ENTERPRISE HARDENING (EPIC 4B.3):
 * - Added trace and critical log levels
 * - Structured metadata now requires workspaceId and sessionId when available
 * - Log levels are configurable via NAMA_LOG_LEVEL env var
 * - No console.log/console.error usage outside this module
 */

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "critical";

/** Structured metadata attached to log entries. */
export interface LogMeta extends Record<string, unknown> {
  /** Optional grouping tag (e.g. "repository", "auth", "analytics", "provision-engine"). */
  source?: string;
  /** Elapsed milliseconds since a correlated start event. */
  durationMs?: number;
  /** Current workspace context. */
  workspaceId?: string;
  /** Current session or request ID for correlation. */
  sessionId?: string;
  /** Repository or step name for drill-down. */
  repository?: string;
  /** Retry attempt number (0 = first try). */
  retryCount?: number;
  /** Step name in a pipeline. */
  step?: string;
}

/** Structured log entry for transport to external systems. */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: LogMeta;
}

/** Platform logging contract. */
export interface ILogger {
  trace(message: string, meta?: LogMeta): void;
  debug(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  error(message: string, meta?: LogMeta): void;
  critical(message: string, meta?: LogMeta): void;
}

// ─── Console Logger (default) ────────────────────────────────────────────────

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  trace: -1,
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  critical: 4,
};

function getMinLevel(): LogLevel {
  if (typeof process !== "undefined" && process.env?.NAMA_LOG_LEVEL) {
    return process.env.NAMA_LOG_LEVEL as LogLevel;
  }
  // In development, show everything. In production, show warn+.
  if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
    return "warn";
  }
  return "info";
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[getMinLevel()];
}

function formatMeta(meta?: LogMeta): string {
  if (!meta || Object.keys(meta).length === 0) return "";
  const source = meta.source ? `[${meta.source}] ` : "";
  const rest = { ...meta };
  delete (rest as Record<string, unknown>).source;
  const restStr = Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : "";
  return `${source}${restStr}`;
}

const PREFIX = "[NAMA]";

function createLogEntry(level: LogLevel, message: string, meta?: LogMeta): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    meta,
  };
}

export class ConsoleLogger implements ILogger {
  trace(message: string, meta?: LogMeta): void {
    if (!shouldLog("trace")) return;
    const entry = createLogEntry("trace", message, meta);
    console.debug(`${PREFIX} ${formatMeta(meta)}${message}`);
  }

  debug(message: string, meta?: LogMeta): void {
    if (!shouldLog("debug")) return;
    console.debug(`${PREFIX} ${formatMeta(meta)}${message}`);
  }

  info(message: string, meta?: LogMeta): void {
    if (!shouldLog("info")) return;
    console.info(`${PREFIX} ${formatMeta(meta)}${message}`);
  }

  warn(message: string, meta?: LogMeta): void {
    if (!shouldLog("warn")) return;
    console.warn(`${PREFIX} ${formatMeta(meta)}${message}`);
  }

  error(message: string, meta?: LogMeta): void {
    if (!shouldLog("error")) return;
    console.error(`${PREFIX} ${formatMeta(meta)}${message}`);
  }

  critical(message: string, meta?: LogMeta): void {
    // Critical always logs regardless of level
    const entry = createLogEntry("critical", message, meta);
    console.error(`${PREFIX} [CRITICAL] ${formatMeta(meta)}${message}`);
  }
}

// ─── Null Logger (for testing) ───────────────────────────────────────────────

/** Logger that discards all output — useful in tests. */
export class NullLogger implements ILogger {
  trace(): void { /* noop */ }
  debug(): void { /* noop */ }
  info(): void { /* noop */ }
  warn(): void { /* noop */ }
  error(): void { /* noop */ }
  critical(): void { /* noop */ }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

let _logger: ILogger = new ConsoleLogger();

/** Get the current logger instance. */
export function getLogger(): ILogger {
  return _logger;
}

/** Replace the logger with a custom implementation (e.g. during testing). */
export function setLogger(logger: ILogger): void {
  _logger = logger;
}

/** Convenience: returns true if the given log level is active. */
export function isLogLevelActive(level: LogLevel): boolean {
  return shouldLog(level);
}
