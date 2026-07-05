/**
 * NAMA Platform — Provision Session Context.
 *
 * Comprehensive session context for scoping all provision operations.
 * Every operation is traceable to a specific workspace + transaction.
 *
 * Contains:
 * - Session identity (workspace, transaction, blueprint)
 * - Resource map (all created entities)
 * - Metrics and timings
 * - Warnings and errors
 * - Retry and rollback info
 *
 * INTERNAL — not exported from the provision barrel.
 */

import type { ProvisionStep } from "./types";

// ─── Session Identity ────────────────────────────────────────────────────────

/**
 * Session context passed to every provision operation.
 * Ensures all side-effects are traceable to a specific workspace + session.
 */
export interface ProvisionSessionContext {
  /** The workspace being provisioned. */
  workspaceId: string;
  /** The provision transaction ID. */
  transactionId: string;
  /** The blueprint slug being installed. */
  blueprintSlug: string;
  /** The blueprint version being installed. */
  blueprintVersion: string;
  /** The user who initiated the provision. */
  initiatedBy: string;
  /** Session start timestamp. */
  startedAt: string;
}

// ─── Resource Map ────────────────────────────────────────────────────────────

/**
 * Resource map — tracks all resource identifiers created during a
 * provision session. Used by rollback to know exactly what to clean up.
 * Every create/insert operation registers itself here — nothing is manual.
 */
export interface ProvisionResourceMap {
  /** Provision session this map belongs to. */
  session: ProvisionSessionContext;

  /** Page block IDs created during this session. */
  pageBlockIds: string[];
  /** Menu item IDs created during this session. */
  menuItemIds: string[];
  /** Gallery image IDs created during this session. */
  galleryImageIds: string[];
  /** Personality profile keys created during this session. */
  personalityKeys: string[];
  /** Site content keys created during this session. */
  siteContentKeys: string[];
  /** Media file IDs created during this session. */
  mediaFileIds: string[];
  /** Navigation key created during this session. */
  navigationKey: string | null;
  /** Whether theme was installed during this session. */
  themeInstalled: boolean;

  /** ISO timestamp when the map was created. */
  createdAt: string;
}

// ─── Step Metrics ────────────────────────────────────────────────────────────

/** Metrics for a single pipeline step execution. */
export interface StepMetrics {
  /** Step identifier. */
  step: ProvisionStep;
  /** Duration in milliseconds. */
  durationMs: number;
  /** Whether the step succeeded. */
  success: boolean;
  /** Retry count for this step. */
  retryCount: number;
  /** Error message if the step failed. */
  error?: string;
  /** Any data produced by this step. */
  output?: Record<string, unknown>;
}

// ─── Expanded Session ────────────────────────────────────────────────────────

/**
 * Complete provision session — contains everything related to a single
 * provisioning operation. No scattered state.
 */
export interface ProvisionSession {
  /** Session identity. */
  context: ProvisionSessionContext;
  /** Resource map — all created entities. */
  resourceMap: ProvisionResourceMap;
  /** Step metrics — timing and results for each step. */
  stepMetrics: StepMetrics[];
  /** Warnings collected during provisioning. */
  warnings: Array<{ step: ProvisionStep; message: string }>;
  /** Retry count for this session. */
  retryCount: number;
  /** Rollback info. */
  rollback?: {
    attempted: boolean;
    success: boolean;
    durationMs?: number;
    error?: string;
  };
}

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Create an empty resource map for a session.
 */
export function createResourceMap(session: ProvisionSessionContext): ProvisionResourceMap {
  return {
    session,
    pageBlockIds: [],
    menuItemIds: [],
    galleryImageIds: [],
    personalityKeys: [],
    siteContentKeys: [],
    mediaFileIds: [],
    navigationKey: null,
    themeInstalled: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Create a complete provision session.
 */
export function createSession(context: ProvisionSessionContext): ProvisionSession {
  return {
    context,
    resourceMap: createResourceMap(context),
    stepMetrics: [],
    warnings: [],
    retryCount: 0,
  };
}

/**
 * Append a step metric to the session.
 */
export function appendStepMetric(session: ProvisionSession, metric: StepMetrics): void {
  session.stepMetrics.push(metric);
}

/**
 * Add a warning to the session.
 */
export function addWarning(session: ProvisionSession, step: ProvisionStep, message: string): void {
  session.warnings.push({ step, message });
}

