/**
 * Unit tests for Provision Engine core components.
 * Tests pass via mocked providers — no real database required.
 *
 * Run: npx vitest run src/lib/core/provision/__tests__/
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProvisionStep, PROVISION_PIPELINE, PROVISION_STEP_LABELS } from "../types";
import { createSession, createResourceMap, createSession as createProvisionSession, appendStepMetric, addWarning } from "../session-context";
import { getRetryDelayMs, type RetryPolicy } from "../steps";
import { ProvisionReportGenerator } from "../report";
import { ProvisionValidator } from "../validator";
import { ProvisionHealthChecker } from "../health-checker";
import { ProvisionSeeder } from "../seeder";
import { BlueprintVersioning } from "../blueprint/versioning";
import { BlueprintLoader } from "../blueprint/loader";
import { RepositoryCache, getCache, resetCache } from "../../repository-cache";
import { ProvisionEngine } from "../engine";
import { createMockDependencies } from "../../../testing/mock-providers";
import { ConsoleLogger } from "../../../logger";
import {
  isStepRetryable,
  isTransientError,
  getRetryDelay,
  shouldRetry,
  RETRYABLE_STEPS,
  NON_RETRYABLE_STEPS,
  DEFAULT_RETRY_CONFIG,
} from "../retry";

// Minimal valid public-provision input. The real schema (validation.ts) requires the
// public-API fields (requestedSlug/externalOrderId/customerEmail/businessName) in addition
// to blueprintSlug/ownerUserId. Tests exercise the validator/engine with the real schema,
// so they must supply all of them.
function validProvisionInput(overrides: Record<string, unknown> = {}) {
  return {
    blueprintSlug: "test",
    ownerUserId: "user-1",
    requestedSlug: "test-cafe",
    externalOrderId: "order_test_001",
    customerEmail: "owner@example.com",
    businessName: "Test Cafe",
    ...overrides,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockBlueprint = {
  id: "test-v1",
  slug: "test",
  version: "1.0.0",
  name: "Test Blueprint",
  description: "A test blueprint",
  category: "test",
  pages: [{ key: "home", title: "Home", path: "/", blockKeys: ["hero"] }],
  blocks: [{ key: "hero", type: "hero", data: { title: "Welcome" }, sortOrder: 0 }],
  theme: { presetId: "default", overrides: undefined },
  navigation: [{ title: "Home", path: "/", sortOrder: 0 }],
  fonts: { body: "inherit", heading: "inherit", importGoogleFonts: false },
  seo: { title: "Test", description: "Test site" },
  analytics: { enabled: true },
  menus: [],
  gallery: [],
  businessSettings: {},
  personalitySettings: [],
  mediaFolderStructure: [],
  permissions: { admin: [], member: [], viewer: [] },
  metadata: { createdBy: "system", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z", tags: [], isPublished: true },
};

const mockSessionContext = {
  workspaceId: "ws-1",
  transactionId: "tx-1",
  blueprintSlug: "test",
  blueprintVersion: "1.0.0",
  initiatedBy: "user-1",
  startedAt: "2024-01-01T00:00:00Z",
};

// ─── ProvisionStep ───────────────────────────────────────────────────────────

describe("ProvisionStep", () => {
  it("has all steps in PROVISION_PIPELINE covered by labels", () => {
    for (const step of PROVISION_PIPELINE) {
      expect(PROVISION_STEP_LABELS[step]).toBeDefined();
    }
  });

  it("has the expected pipeline order", () => {
    expect(PROVISION_PIPELINE[0]).toBe(ProvisionStep.VALIDATE_REQUEST);
    expect(PROVISION_PIPELINE[PROVISION_PIPELINE.length - 1]).toBe(ProvisionStep.WORKSPACE_READY);
    expect(PROVISION_PIPELINE.length).toBeGreaterThan(0);
  });

  it("each step in the pipeline has a unique label", () => {
    const labels = PROVISION_PIPELINE.map((s) => PROVISION_STEP_LABELS[s]);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

// ─── getRetryDelayMs ─────────────────────────────────────────────────────────

describe("getRetryDelayMs", () => {
  it("returns -1 for 'never' policy", () => {
    const policy: RetryPolicy = { type: "never" };
    expect(getRetryDelayMs(policy, 0, new Error())).toBe(-1);
  });

  it("returns 0 for 'immediate' within maxRetries", () => {
    const policy: RetryPolicy = { type: "immediate", maxRetries: 3 };
    expect(getRetryDelayMs(policy, 0, new Error())).toBe(0);
    expect(getRetryDelayMs(policy, 2, new Error())).toBe(0);
  });

  it("returns -1 for 'immediate' beyond maxRetries", () => {
    const policy: RetryPolicy = { type: "immediate", maxRetries: 1 };
    expect(getRetryDelayMs(policy, 1, new Error())).toBe(-1);
  });

  it("calculates exponential backoff", () => {
    const policy: RetryPolicy = { type: "exponential", maxRetries: 3, baseDelayMs: 100, maxDelayMs: 5000 };
    expect(getRetryDelayMs(policy, 0, new Error())).toBe(100);
    expect(getRetryDelayMs(policy, 1, new Error())).toBe(200);
    expect(getRetryDelayMs(policy, 2, new Error())).toBe(400);
  });

  it("caps exponential delay at maxDelayMs", () => {
    const policy: RetryPolicy = { type: "exponential", maxRetries: 10, baseDelayMs: 1000, maxDelayMs: 3000 };
    expect(getRetryDelayMs(policy, 9, new Error())).toBe(3000);
  });

  it("returns -1 for 'exponential' beyond maxRetries", () => {
    const policy: RetryPolicy = { type: "exponential", maxRetries: 2, baseDelayMs: 100, maxDelayMs: 5000 };
    expect(getRetryDelayMs(policy, 2, new Error())).toBe(-1);
  });

  it("calculates linear delay", () => {
    const policy: RetryPolicy = { type: "linear", maxRetries: 3, delayMs: 500 };
    expect(getRetryDelayMs(policy, 0, new Error())).toBe(500);
    expect(getRetryDelayMs(policy, 1, new Error())).toBe(500);
  });

  it("supports custom retry policy", () => {
    const customFn = vi.fn().mockReturnValue(100);
    const policy: RetryPolicy = { type: "custom", shouldRetry: customFn };
    expect(getRetryDelayMs(policy, 0, new Error("test"))).toBe(100);
    expect(customFn).toHaveBeenCalledWith(0, expect.any(Error));
  });

  it("custom policy returning null means no retry", () => {
    const policy: RetryPolicy = { type: "custom", shouldRetry: () => null };
    expect(getRetryDelayMs(policy, 0, new Error())).toBe(-1);
  });

  it("handles string errors in custom policy", () => {
    const customFn = vi.fn().mockReturnValue(50);
    const policy: RetryPolicy = { type: "custom", shouldRetry: customFn };
    expect(getRetryDelayMs(policy, 0, "string error")).toBe(50);
    expect(customFn).toHaveBeenCalledWith(0, "string error");
  });
});

// ─── Session Context ─────────────────────────────────────────────────────────

describe("createSession", () => {
  it("creates a session with the correct context", () => {
    const session = createProvisionSession(mockSessionContext);

    expect(session.context.workspaceId).toBe("ws-1");
    expect(session.context.blueprintSlug).toBe("test");
    expect(session.resourceMap.pageBlockIds).toEqual([]);
    expect(session.resourceMap.menuItemIds).toEqual([]);
    expect(session.resourceMap.galleryImageIds).toEqual([]);
    expect(session.resourceMap.personalityKeys).toEqual([]);
    expect(session.resourceMap.siteContentKeys).toEqual([]);
    expect(session.resourceMap.mediaFileIds).toEqual([]);
    expect(session.resourceMap.navigationKey).toBeNull();
    expect(session.resourceMap.themeInstalled).toBe(false);
    expect(session.stepMetrics).toEqual([]);
    expect(session.warnings).toEqual([]);
    expect(session.retryCount).toBe(0);
  });

  it("creates a resource map linked to the session", () => {
    const session = createProvisionSession(mockSessionContext);

    expect(session.resourceMap.session.workspaceId).toBe("ws-1");
    expect(session.resourceMap.createdAt).toBeDefined();
    expect(() => new Date(session.resourceMap.createdAt)).not.toThrow();
  });
});

describe("createResourceMap", () => {
  it("creates an empty resource map", () => {
    const map = createResourceMap(mockSessionContext);

    expect(map.session.workspaceId).toBe("ws-1");
    expect(map.pageBlockIds).toEqual([]);
    expect(map.menuItemIds).toEqual([]);
    expect(map.galleryImageIds).toEqual([]);
    expect(map.personalityKeys).toEqual([]);
    expect(map.siteContentKeys).toEqual([]);
    expect(map.mediaFileIds).toEqual([]);
    expect(map.navigationKey).toBeNull();
    expect(map.themeInstalled).toBe(false);
    expect(map.createdAt).toBeDefined();
  });
});

describe("appendStepMetric", () => {
  it("appends a metric to the session", () => {
    const session = createProvisionSession(mockSessionContext);
    const metric = {
      step: ProvisionStep.VALIDATE_REQUEST,
      durationMs: 10,
      success: true,
      retryCount: 0,
      output: { validated: true },
    };

    appendStepMetric(session, metric);

    expect(session.stepMetrics).toHaveLength(1);
    expect(session.stepMetrics[0].step).toBe(ProvisionStep.VALIDATE_REQUEST);
    expect(session.stepMetrics[0].durationMs).toBe(10);
    expect(session.stepMetrics[0].error).toBeUndefined();
  });

  it("appends multiple metrics in order", () => {
    const session = createProvisionSession(mockSessionContext);

    appendStepMetric(session, { step: ProvisionStep.VALIDATE_REQUEST, durationMs: 10, success: true, retryCount: 0 });
    appendStepMetric(session, { step: ProvisionStep.CREATE_WORKSPACE, durationMs: 50, success: true, retryCount: 0 });
    appendStepMetric(session, { step: ProvisionStep.INSTALL_BLUEPRINT, durationMs: 200, success: false, retryCount: 1, error: "Timeout" });

    expect(session.stepMetrics).toHaveLength(3);
    expect(session.stepMetrics[2].error).toBe("Timeout");
  });
});

describe("addWarning", () => {
  it("adds a warning to the session", () => {
    const session = createProvisionSession(mockSessionContext);

    addWarning(session, ProvisionStep.VALIDATE_REQUEST, "Test warning");

    expect(session.warnings).toHaveLength(1);
    expect(session.warnings[0].step).toBe(ProvisionStep.VALIDATE_REQUEST);
    expect(session.warnings[0].message).toBe("Test warning");
  });

  it("accumulates multiple warnings", () => {
    const session = createProvisionSession(mockSessionContext);

    addWarning(session, ProvisionStep.VALIDATE_REQUEST, "Warning 1");
    addWarning(session, ProvisionStep.INSTALL_BLUEPRINT, "Warning 2");

    expect(session.warnings).toHaveLength(2);
  });
});

// ─── ProvisionRetry ──────────────────────────────────────────────────────────

describe("ProvisionRetry", () => {
  describe("isStepRetryable", () => {
    it("returns true for retryable steps", () => {
      expect(isStepRetryable(ProvisionStep.INSTALL_BLUEPRINT)).toBe(true);
      expect(isStepRetryable(ProvisionStep.SEED_DATA)).toBe(true);
      expect(isStepRetryable(ProvisionStep.INSERT_THEME)).toBe(true);
      expect(isStepRetryable(ProvisionStep.CREATE_WORKSPACE)).toBe(true);
    });

    it("returns false for non-retryable steps", () => {
      expect(isStepRetryable(ProvisionStep.VALIDATE_REQUEST)).toBe(false);
    });

    it("includes all pipeline steps except VALIDATE_REQUEST as retryable", () => {
      for (const step of PROVISION_PIPELINE) {
        if (step === ProvisionStep.VALIDATE_REQUEST) {
          expect(isStepRetryable(step)).toBe(false);
        } else {
          expect(isStepRetryable(step)).toBe(true);
        }
      }
    });
  });

  describe("isTransientError", () => {
    it("detects timeout errors", () => {
      expect(isTransientError(new Error("timeout"))).toBe(true);
      expect(isTransientError(new Error("Timed out"))).toBe(true);
      expect(isTransientError(new Error("Query timeout"))).toBe(true);
    });

    it("detects network errors", () => {
      expect(isTransientError(new Error("Network error"))).toBe(true);
      expect(isTransientError(new Error("ECONNREFUSED"))).toBe(true);
      expect(isTransientError(new Error("socket hang up"))).toBe(true);
    });

    it("detects rate limit errors", () => {
      expect(isTransientError(new Error("Rate limit exceeded"))).toBe(true);
      expect(isTransientError(new Error("429 Too Many Requests"))).toBe(true);
    });

    it("detects server errors", () => {
      expect(isTransientError(new Error("502 Bad Gateway"))).toBe(true);
      expect(isTransientError(new Error("503 Service Unavailable"))).toBe(true);
      expect(isTransientError(new Error("Internal server error"))).toBe(true);
    });

    it("detects database errors", () => {
      expect(isTransientError(new Error("Database timeout"))).toBe(true);
    });

    it("returns false for non-transient errors", () => {
      expect(isTransientError(new Error("Invalid input"))).toBe(false);
      expect(isTransientError(new Error("Not found"))).toBe(false);
      expect(isTransientError("Syntax error")).toBe(false);
    });

    it("handles string errors", () => {
      expect(isTransientError("connection lost")).toBe(true);
      expect(isTransientError("permission denied")).toBe(false);
    });

    it("checks error cause", () => {
      const err = new Error("Something failed");
      err.cause = new Error("Database timeout");
      expect(isTransientError(err)).toBe(true);
    });
  });

  describe("getRetryDelay", () => {
    it("uses exponential backoff by default", () => {
      expect(getRetryDelay(0)).toBe(1000);      // 1000 * 2^0
      expect(getRetryDelay(1)).toBe(2000);      // 1000 * 2^1
      expect(getRetryDelay(2)).toBe(4000);      // 1000 * 2^2
    });

    it("caps at maxDelayMs", () => {
      expect(getRetryDelay(10)).toBe(10000);    // capped
      expect(getRetryDelay(100)).toBe(10000);   // capped
    });

    it("respects custom config", () => {
      const config = { maxRetries: 5, baseDelayMs: 100, maxDelayMs: 5000, backoffFactor: 3 };
      expect(getRetryDelay(0, config)).toBe(100);
      expect(getRetryDelay(1, config)).toBe(300);
      expect(getRetryDelay(2, config)).toBe(900);
    });
  });

  describe("shouldRetry", () => {
    it("returns delay when all conditions met", () => {
      const result = shouldRetry(ProvisionStep.INSTALL_BLUEPRINT, 0, 3, new Error("timeout"));
      expect(result).toBeGreaterThan(0);
    });

    it("returns -1 when max retries exceeded", () => {
      const result = shouldRetry(ProvisionStep.INSTALL_BLUEPRINT, 3, 3, new Error("timeout"));
      expect(result).toBe(-1);
    });

    it("returns -1 for non-retryable steps", () => {
      const result = shouldRetry(ProvisionStep.VALIDATE_REQUEST, 0, 3, new Error("timeout"));
      expect(result).toBe(-1);
    });

    it("returns -1 for non-transient errors", () => {
      const result = shouldRetry(ProvisionStep.INSTALL_BLUEPRINT, 0, 3, new Error("Invalid data"));
      expect(result).toBe(-1);
    });
  });

  describe("constants", () => {
    it("DEFAULT_RETRY_CONFIG has expected values", () => {
      expect(DEFAULT_RETRY_CONFIG.maxRetries).toBe(3);
      expect(DEFAULT_RETRY_CONFIG.baseDelayMs).toBe(1000);
      expect(DEFAULT_RETRY_CONFIG.maxDelayMs).toBe(10000);
      expect(DEFAULT_RETRY_CONFIG.backoffFactor).toBe(2);
    });

    it("RETRYABLE_STEPS and NON_RETRYABLE_STEPS are disjoint", () => {
      for (const step of RETRYABLE_STEPS) {
        expect(NON_RETRYABLE_STEPS.has(step)).toBe(false);
      }
    });

    it("all pipeline steps are covered by at least one set", () => {
      for (const step of PROVISION_PIPELINE) {
        expect(RETRYABLE_STEPS.has(step) || NON_RETRYABLE_STEPS.has(step)).toBe(true);
      }
    });
  });
});

// ─── ProvisionReportGenerator ────────────────────────────────────────────────

describe("ProvisionReportGenerator", () => {
  it("generates a success report", () => {
    const generator = new ProvisionReportGenerator();
    const transaction = {
      id: "tx-1",
      workspaceId: "ws-1",
      blueprintId: "test-v1",
      blueprintVersion: "1.0.0",
      status: "completed" as const,
      initiatedBy: "user-1",
      startedAt: "2024-01-01T00:00:00Z",
      completedAt: "2024-01-01T00:00:01Z",
      steps: [
        { step: "validate_request" as ProvisionStep, success: true, startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:00Z", durationMs: 10 },
        { step: "install_blueprint" as ProvisionStep, success: true, startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:01Z", durationMs: 500, output: { pageBlocks: 3, navigation: 1 } },
        { step: "insert_theme" as ProvisionStep, success: true, startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:01Z", durationMs: 100 },
      ],
      currentStepIndex: 3,
      retryCount: 0,
      maxRetries: 3,
    };

    const report = generator.generate(transaction, mockBlueprint, {
      id: "ws-1", name: "Test", status: "active", plan: "free",
    });

    expect(report.success).toBe(true);
    expect(report.transactionId).toBe("tx-1");
    expect(report.workspace.name).toBe("Test");
    expect(report.blueprint.name).toBe("Test Blueprint");
    expect(report.theme.presetId).toBe("default");
    expect(report.pages.total).toBe(1);
    expect(report.blocks.total).toBe(1);
    expect(report.navigation.total).toBe(1);
    expect(report.stepTimings).toHaveLength(3);
    expect(report.errors).toHaveLength(0);
  });

  it("generates a failure report with errors", () => {
    const generator = new ProvisionReportGenerator();
    const transaction = {
      id: "tx-2",
      workspaceId: "ws-1",
      blueprintId: "test-v1",
      blueprintVersion: "1.0.0",
      status: "failed" as const,
      initiatedBy: "user-1",
      startedAt: "2024-01-01T00:00:00Z",
      completedAt: "2024-01-01T00:00:02Z",
      steps: [
        { step: "validate_request" as ProvisionStep, success: true, startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:00Z", durationMs: 10 },
        { step: "install_blueprint" as ProvisionStep, success: false, startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:02Z", durationMs: 1500, error: "Database timeout" },
      ],
      currentStepIndex: 2,
      retryCount: 1,
      maxRetries: 3,
    };

    const report = generator.generate(transaction, mockBlueprint, {
      id: "ws-1", name: "Test", status: "provisioning", plan: "free",
    });

    expect(report.success).toBe(false);
    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].message).toBe("Database timeout");
    expect(report.errors[0].step).toBe("install_blueprint");
  });

  it("generates report with session data extending step timings", () => {
    const generator = new ProvisionReportGenerator();
    const tx = {
      id: "tx-3", workspaceId: "ws-1", blueprintId: "test-v1", blueprintVersion: "1.0.0",
      status: "completed" as const, initiatedBy: "user-1",
      startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:01Z",
      steps: [{
        step: "validate_request" as ProvisionStep, success: true,
        startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:00Z", durationMs: 10,
      }],
      currentStepIndex: 1, retryCount: 0, maxRetries: 3,
    };
    const session = createProvisionSession(mockSessionContext);
    appendStepMetric(session, { step: ProvisionStep.VALIDATE_REQUEST, durationMs: 10, success: true, retryCount: 0 });
    session.rollback = { attempted: true, success: true, durationMs: 50 };

    const report = generator.generate(tx, mockBlueprint, { id: "ws-1", name: "Test", status: "active", plan: "free" }, session);

    expect(report.stepTimings).toHaveLength(1);
    expect(report.stepTimings[0].label).toBe("Validate Request");
  });

  it("formats a report as readable string", () => {
    const generator = new ProvisionReportGenerator();
    const tx = {
      id: "tx-4", workspaceId: "ws-1", blueprintId: "test-v1", blueprintVersion: "1.0.0",
      status: "completed" as const, initiatedBy: "user-1",
      startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:01Z",
      steps: [{
        step: "validate_request" as ProvisionStep, success: true,
        startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:00Z", durationMs: 10,
      }],
      currentStepIndex: 1, retryCount: 0, maxRetries: 3,
    };
    const report = generator.generate(tx, mockBlueprint, { id: "ws-1", name: "Test", status: "active", plan: "free" });
    const formatted = generator.format(report);

    expect(formatted).toContain("PROVISION REPORT");
    expect(formatted).toContain("SUCCESS");
    expect(formatted).toContain("Test Blueprint");
    expect(formatted).toContain("Test");
  });

  it("handles empty steps gracefully", () => {
    const generator = new ProvisionReportGenerator();
    const tx = {
      id: "tx-5", workspaceId: "ws-1", blueprintId: "test-v1", blueprintVersion: "1.0.0",
      status: "pending" as const, initiatedBy: "user-1",
      startedAt: "2024-01-01T00:00:00Z", completedAt: undefined,
      steps: [],
      currentStepIndex: 0, retryCount: 0, maxRetries: 3,
    };
    const report = generator.generate(tx, mockBlueprint, { id: "ws-1", name: "Test", status: "provisioning", plan: "free" });

    expect(report.success).toBe(false); // status is "pending", not "completed"
    expect(report.stepTimings).toHaveLength(0);
    expect(report.errors).toHaveLength(0);
    expect(report.durationMs).toBeGreaterThanOrEqual(0);
  });
});

// ─── ProvisionValidator ──────────────────────────────────────────────────────

describe("ProvisionValidator", () => {
  it("validates a simple request successfully", async () => {
    const deps = createMockDependencies();
    const mockLoader = {
      load: vi.fn().mockResolvedValue(mockBlueprint),
      loadOrThrow: vi.fn().mockResolvedValue(mockBlueprint),
      exists: vi.fn().mockResolvedValue(true),
      listAvailable: vi.fn().mockResolvedValue([]),
      listVersions: vi.fn().mockResolvedValue([]),
    };
    const mockWorkspaceRepo = {
      findById: vi.fn().mockResolvedValue(null),
      findByUserId: vi.fn().mockResolvedValue([]),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      listAll: vi.fn().mockResolvedValue([]),
      getOrCreateDefault: vi.fn().mockResolvedValue(null),
    };

    const validator = new ProvisionValidator({
      ...deps,
      blueprintLoader: mockLoader as any,
      workspaceRepository: mockWorkspaceRepo as any,
    });

    const result = await validator.validate({
      ...validProvisionInput(),
    });

    expect(result.valid).toBe(true);
    expect(result.resolved?.blueprintId).toBe("test-v1");
    expect(result.resolved?.blueprintVersion).toBe("1.0.0");
  });

  it("rejects missing blueprints", async () => {
    const deps = createMockDependencies();
    const mockLoader = {
      load: vi.fn().mockResolvedValue(null),
      loadOrThrow: vi.fn().mockRejectedValue(new Error("Not found")),
      exists: vi.fn().mockResolvedValue(false),
    } as any;
    const mockWorkspaceRepo = {} as any;

    const validator = new ProvisionValidator({
      ...deps,
      blueprintLoader: mockLoader,
      workspaceRepository: mockWorkspaceRepo,
    });

    const result = await validator.validate({
      ...validProvisionInput({ blueprintSlug: "nonexistent" }),
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain("not found");
  });

  it("detects duplicate page and block keys", async () => {
    const deps = createMockDependencies();
    const mockLoader = {
      load: vi.fn().mockResolvedValue({
        ...mockBlueprint,
        pages: [
          { key: "home", title: "Home", path: "/", blockKeys: ["hero"] },
          { key: "home", title: "Duplicate", path: "/dup", blockKeys: [] },
        ],
        blocks: [
          { key: "hero", type: "hero", data: {}, sortOrder: 0 },
          { key: "hero", type: "duplicate", data: {}, sortOrder: 1 },
        ],
      }),
      loadOrThrow: vi.fn().mockResolvedValue(mockBlueprint),
    } as any;

    const validator = new ProvisionValidator({
      ...deps,
      blueprintLoader: mockLoader,
      workspaceRepository: {} as any,
    });

    const result = await validator.validate({
      ...validProvisionInput(),
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Duplicate");
  });

  it("rejects invalid request structure", async () => {
    const deps = createMockDependencies();
    const validator = new ProvisionValidator({
      ...deps,
      blueprintLoader: {} as any,
      workspaceRepository: {} as any,
    });

    const result = await validator.validate({} as any);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid request");
  });

  it("includes data validation warnings alongside errors", async () => {
    const deps = createMockDependencies();
    const mockLoader = {
      load: vi.fn().mockResolvedValue({
        ...mockBlueprint,
        pages: [
          { key: "home", title: "Home", path: "/", blockKeys: ["hero"] },
          { key: "about", title: "About", path: "/", blockKeys: [] }, // duplicate path!
        ],
        blocks: [
          { key: "hero", type: "hero", data: {}, sortOrder: 0 },
          { key: "orphan", type: "unused", data: {}, sortOrder: 1 }, // orphan!
        ],
      }),
    } as any;
    const mockWorkspaceRepo = {
      findByUserId: vi.fn().mockResolvedValue([]),
    } as any;

    const validator = new ProvisionValidator({
      ...deps,
      blueprintLoader: mockLoader,
      workspaceRepository: mockWorkspaceRepo,
    });

    const result = await validator.validate({
      ...validProvisionInput(),
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Duplicate");
    expect(result.warnings.some((w) => w.includes("not referenced") || w.includes("orphan"))).toBe(true);
  });

  it("performs quick validation with validateRequest", () => {
    const deps = createMockDependencies();
    const validator = new ProvisionValidator({
      ...deps,
      blueprintLoader: {} as any,
      workspaceRepository: {} as any,
    });

    expect(validator.validateRequest(validProvisionInput()).valid).toBe(true);
    expect(validator.validateRequest({} as any).valid).toBe(false);
  });

  it("warns if user already has workspaces", async () => {
    const deps = createMockDependencies();
    const mockLoader = {
      load: vi.fn().mockResolvedValue(mockBlueprint),
    } as any;
    const mockWorkspaceRepo = {
      findByUserId: vi.fn().mockResolvedValue([{ id: "existing-ws" }]),
    } as any;

    const validator = new ProvisionValidator({
      ...deps,
      blueprintLoader: mockLoader,
      workspaceRepository: mockWorkspaceRepo,
    });

    const result = await validator.validate({
      ...validProvisionInput(),
    });

    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes("already has"))).toBe(true);
  });
});

// ─── ProvisionHealthChecker ──────────────────────────────────────────────────

describe("ProvisionHealthChecker", () => {
  it("returns healthy when all checks pass", async () => {
    const deps = createMockDependencies({
      theme_settings: [{ id: "1", preset_id: "default" }],
      page_blocks: [{ id: "1", type: "hero", data: {} }],
      site_content: [
        { key: "navigation:ws-1", value: { items: ["/", "/about"] } },
        { key: "analytics_config:ws-1", value: { enabled: true } },
        { key: "seo_config", value: {} },
        { key: "media_folder:ws-1:/images", value: {} },
        { key: "workspace:ws-1:entity", value: { status: "active" } },
      ],
    });

    const checker = new ProvisionHealthChecker(deps);
    const result = await checker.runChecks(mockBlueprint, "ws-1");

    expect(result.healthy).toBe(true);
    expect(result.checks.length).toBeGreaterThan(0);
  });

  it("reports health check failures", async () => {
    const deps = createMockDependencies({});
    const checker = new ProvisionHealthChecker(deps);
    const result = await checker.runChecks(mockBlueprint, "ws-1");

    expect(result.healthy).toBe(false);
    expect(result.checks.some((c) => !c.passed)).toBe(true);
  });

  it("handles database errors gracefully", async () => {
    // Mock with non-empty data that doesn't match patterns
    const deps = createMockDependencies({
      site_content: [
        { key: "workspace:ws-1:entity", value: "invalid" },
      ],
    });
    const checker = new ProvisionHealthChecker(deps);
    const result = await checker.runChecks(mockBlueprint, "ws-1");

    // Should process without throwing
    expect(result.checks.length).toBeGreaterThan(0);
  });

  it("skips page checks when blueprint has no blocks", async () => {
    const deps = createMockDependencies();
    const checker = new ProvisionHealthChecker(deps);
    const emptyBlueprint = { ...mockBlueprint, blocks: [] };
    const result = await checker.runChecks(emptyBlueprint, "ws-1");

    const pageCheck = result.checks.find((c) => c.name === "pages-created");
    expect(pageCheck?.passed).toBe(true);
    expect(pageCheck?.detail).toContain("No pages");
  });
});

// ─── ProvisionSeeder ─────────────────────────────────────────────────────────

describe("ProvisionSeeder", () => {
  it("seeds media folders from blueprint", async () => {
    const deps = createMockDependencies({});
    const seeder = new ProvisionSeeder(deps);
    const bp = {
      ...mockBlueprint,
      mediaFolderStructure: [
        { path: "default/logo", description: "Logo images" },
        { path: "default/gallery", description: "Gallery images" },
      ],
    };

    const results = await seeder.seed(bp, "ws-1");

    expect(results.mediaFolders).toBe(2);
    expect(results.fontsConfigured).toBe(true);
    expect(results.analyticsConfigured).toBe(true);
  });

  it("skips seeding when media folder list is empty", async () => {
    const deps = createMockDependencies({});
    const seeder = new ProvisionSeeder(deps);
    const results = await seeder.seed(mockBlueprint, "ws-1");

    expect(results.mediaFolders).toBe(0);
  });

  it("seedMedia returns count of media folders created", async () => {
    const deps = createMockDependencies({});
    const seeder = new ProvisionSeeder(deps);
    const bp = {
      ...mockBlueprint,
      mediaFolderStructure: [{ path: "default/photos", description: "Photos" }],
    };

    const count = await seeder.seedMedia(bp, "ws-1");
    expect(count).toBe(1);
  });

  it("is idempotent — existing folders are not recreated", async () => {
    const deps = createMockDependencies({
      site_content: [
        { key: "media_folder:ws-1:default/logo", value: {} },
      ],
    });
    const seeder = new ProvisionSeeder(deps);
    const bp = {
      ...mockBlueprint,
      mediaFolderStructure: [
        { path: "default/logo", description: "Logo" },
        { path: "default/new", description: "New" },
      ],
    };

    const results = await seeder.seed(bp, "ws-1");
    expect(results.mediaFolders).toBe(1); // Only the non-existing one
  });

  it("tracks created keys in resource map", async () => {
    const deps = createMockDependencies({});
    const seeder = new ProvisionSeeder(deps);
    const session = createProvisionSession(mockSessionContext);
    const bp = {
      ...mockBlueprint,
      mediaFolderStructure: [{ path: "default/photos", description: "Photos" }],
    };

    await seeder.seed(bp, "ws-1", session.resourceMap);
    expect(session.resourceMap.siteContentKeys.length).toBeGreaterThan(0);
    expect(session.resourceMap.siteContentKeys[0]).toContain("media_folder:");
  });
});

// ─── RepositoryCache ─────────────────────────────────────────────────────────

describe("RepositoryCache", () => {
  beforeEach(() => {
    resetCache();
  });

  it("caches and returns values", async () => {
    const cache = getCache();
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      return { id: 1, name: "test" };
    };

    const result1 = await cache.getOrFetch("test_table", "get_1", fetchFn);
    const result2 = await cache.getOrFetch("test_table", "get_1", fetchFn);

    expect(result1).toEqual({ id: 1, name: "test" });
    expect(result2).toEqual({ id: 1, name: "test" });
    expect(callCount).toBe(1);
  });

  it("invalidates by table", async () => {
    const cache = getCache();
    let callCount = 0;
    const fetchFn = async () => {
      callCount++;
      return { id: callCount };
    };

    await cache.getOrFetch("table_a", "key_1", fetchFn);
    cache.invalidate("table_a");
    await cache.getOrFetch("table_a", "key_1", fetchFn);

    expect(callCount).toBe(2);
  });

  it("invalidates by specific key", async () => {
    const cache = getCache();
    let callCount = 0;

    await cache.getOrFetch("table_a", "key_1", async () => { callCount++; return 1; });
    cache.invalidateKey("table_a", "key_1");
    await cache.getOrFetch("table_a", "key_1", async () => { callCount++; return 1; });

    expect(callCount).toBe(2);
  });

  it("keeps other keys after invalidation", async () => {
    const cache = getCache();
    let countA = 0, countB = 0;

    await cache.getOrFetch("t", "a", async () => { countA++; return "A"; });
    await cache.getOrFetch("t", "b", async () => { countB++; return "B"; });
    cache.invalidateKey("t", "a");
    await cache.getOrFetch("t", "a", async () => { countA++; return "A"; });
    await cache.getOrFetch("t", "b", async () => { countB++; return "B"; });

    expect(countA).toBe(2);
    expect(countB).toBe(1);
  });

  it("respects TTL", async () => {
    const cache = getCache();
    let callCount = 0;

    await cache.getOrFetch("t", "k", async () => { callCount++; return "v"; }, 0);
    await new Promise((r) => setTimeout(r, 1));
    await cache.getOrFetch("t", "k", async () => { callCount++; return "v"; }, 0);

    expect(callCount).toBe(2);
  });

  it("clear removes all entries", async () => {
    const cache = getCache();

    await cache.getOrFetch("t1", "k1", async () => 1);
    await cache.getOrFetch("t2", "k2", async () => 2);
    cache.clear();

    expect(cache.stats().entries).toBe(0);
  });

  it("sync get returns cached value", async () => {
    const cache = getCache();
    await cache.getOrFetch("t", "k", async () => "hello");
    expect(cache.get<string>("t", "k")).toBe("hello");
  });

  it("sync set then get works", async () => {
    const cache = getCache();
    cache.set("t", "k", "direct");
    expect(cache.get<string>("t", "k")).toBe("direct");
  });

  it("stats returns correct counts", async () => {
    const cache = getCache();
    expect(cache.stats()).toEqual({ tables: 0, entries: 0 });

    await cache.getOrFetch("t1", "k1", async () => 1);
    await cache.getOrFetch("t1", "k2", async () => 2);
    await cache.getOrFetch("t2", "k1", async () => 3);

    expect(cache.stats().tables).toBe(2);
    expect(cache.stats().entries).toBe(3);
  });

  it("returns undefined for missing sync get", () => {
    const cache = getCache();
    expect(cache.get("nonexistent", "key")).toBeUndefined();
  });

  it("workspace isolation — different tables don't interfere", async () => {
    const cache = getCache();
    await cache.getOrFetch("ws1", "data", async () => "workspace1");
    await cache.getOrFetch("ws2", "data", async () => "workspace2");

    expect(cache.get<string>("ws1", "data")).toBe("workspace1");
    expect(cache.get<string>("ws2", "data")).toBe("workspace2");

    cache.invalidate("ws1");
    expect(cache.get<string>("ws1", "data")).toBeUndefined();
    expect(cache.get<string>("ws2", "data")).toBe("workspace2");
  });
});

// ─── BlueprintVersioning ─────────────────────────────────────────────────────

describe("BlueprintLoader", () => {
  beforeEach(() => {
    resetCache();
  });

  it("loads a blueprint by slug", async () => {
    const mockRegistry = {
      getByVersion: vi.fn().mockResolvedValue(mockBlueprint),
      getLatest: vi.fn().mockResolvedValue(mockBlueprint),
      listBlueprints: vi.fn().mockResolvedValue([]),
      listVersions: vi.fn().mockResolvedValue([]),
      register: vi.fn(),
      delete: vi.fn(),
    };

    const loader = new BlueprintLoader({ registry: mockRegistry as any });
    const blueprint = await loader.load("test");

    expect(blueprint).toEqual(mockBlueprint);
    expect(mockRegistry.getLatest).toHaveBeenCalledWith("test");
  });

  it("loads a specific blueprint version", async () => {
    const mockRegistry = {
      getByVersion: vi.fn().mockResolvedValue(mockBlueprint),
      getLatest: vi.fn(),
    };

    const loader = new BlueprintLoader({ registry: mockRegistry as any });
    const blueprint = await loader.load("test", "1.0.0");

    expect(blueprint).toEqual(mockBlueprint);
    expect(mockRegistry.getByVersion).toHaveBeenCalledWith("test", "1.0.0");
    expect(mockRegistry.getLatest).not.toHaveBeenCalled();
  });

  it("returns null for missing blueprint", async () => {
    const mockRegistry = {
      getByVersion: vi.fn().mockResolvedValue(null),
      getLatest: vi.fn().mockResolvedValue(null),
    };

    const loader = new BlueprintLoader({ registry: mockRegistry as any });
    const blueprint = await loader.load("nonexistent");

    expect(blueprint).toBeNull();
  });

  it("loadOrThrow throws for missing blueprint", async () => {
    const mockRegistry = {
      getByVersion: vi.fn().mockResolvedValue(null),
      getLatest: vi.fn().mockResolvedValue(null),
    };

    const loader = new BlueprintLoader({ registry: mockRegistry as any });

    await expect(loader.loadOrThrow("nonexistent")).rejects.toThrow("not found");
  });

  it("loadOrThrow returns blueprint when found", async () => {
    const mockRegistry = {
      getByVersion: vi.fn().mockResolvedValue(mockBlueprint),
      getLatest: vi.fn().mockResolvedValue(mockBlueprint),
    };

    const loader = new BlueprintLoader({ registry: mockRegistry as any });
    const blueprint = await loader.loadOrThrow("test", "1.0.0");

    expect(blueprint).toEqual(mockBlueprint);
  });

  it("exists returns true when blueprint found", async () => {
    const mockRegistry = {
      getByVersion: vi.fn().mockResolvedValue(mockBlueprint),
      getLatest: vi.fn().mockResolvedValue(mockBlueprint),
    };

    const loader = new BlueprintLoader({ registry: mockRegistry as any });
    const exists = await loader.exists("test");

    expect(exists).toBe(true);
  });

  it("exists returns false when blueprint not found", async () => {
    const mockRegistry = {
      getByVersion: vi.fn().mockResolvedValue(null),
      getLatest: vi.fn().mockResolvedValue(null),
    };

    const loader = new BlueprintLoader({ registry: mockRegistry as any });
    const exists = await loader.exists("nonexistent");

    expect(exists).toBe(false);
  });

  it("listAvailable delegates to registry", async () => {
    const mockRegistry = {
      listBlueprints: vi.fn().mockResolvedValue([{ slug: "test", version: "1.0.0" }]),
    };

    const loader = new BlueprintLoader({ registry: mockRegistry as any });
    const available = await loader.listAvailable();

    expect(mockRegistry.listBlueprints).toHaveBeenCalled();
    expect(available).toHaveLength(1);
  });

  it("listVersions delegates to registry", async () => {
    const mockRegistry = {
      listVersions: vi.fn().mockResolvedValue([{ slug: "test", version: "1.0.0" }]),
    };

    const loader = new BlueprintLoader({ registry: mockRegistry as any });
    const versions = await loader.listVersions("test");

    expect(mockRegistry.listVersions).toHaveBeenCalledWith("test");
    expect(versions).toHaveLength(1);
  });
});

describe("BlueprintVersioning", () => {
  const mockRegistry = {
    listVersions: vi.fn(),
    getByVersion: vi.fn(),
    getLatest: vi.fn(),
    listBlueprints: vi.fn(),
    register: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("parse", () => {
    const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

    it("parses valid semver", () => {
      expect(versioning.parse("1.2.3")).toEqual({ major: 1, minor: 2, patch: 3 });
    });

    it("returns null for invalid versions", () => {
      expect(versioning.parse("1.2")).toBeNull();
      expect(versioning.parse("abc")).toBeNull();
      expect(versioning.parse("")).toBeNull();
    });
  });

  describe("format", () => {
    const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

    it("formats version components", () => {
      expect(versioning.format(1, 2, 3)).toBe("1.2.3");
      expect(versioning.format(0, 0, 1)).toBe("0.0.1");
    });
  });

  describe("compare", () => {
    const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

    it("compares versions correctly", () => {
      expect(versioning.compare("1.0.0", "2.0.0")).toBeLessThan(0);
      expect(versioning.compare("2.0.0", "1.0.0")).toBeGreaterThan(0);
      expect(versioning.compare("1.0.0", "1.0.0")).toBe(0);
    });
  });

  describe("isCompatible", () => {
    const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

    it("same major = compatible", () => {
      expect(versioning.isCompatible("1.0.0", "1.5.0")).toBe(true);
    });

    it("different major = incompatible", () => {
      expect(versioning.isCompatible("1.0.0", "2.0.0")).toBe(false);
    });

    it("invalid version = incompatible", () => {
      expect(versioning.isCompatible("abc", "1.0.0")).toBe(false);
    });
  });

  describe("satisfies", () => {
    const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

    it("exact match", () => {
      expect(versioning.satisfies("1.0.0", "1.0.0")).toBe(true);
    });

    it("caret range (^)", () => {
      expect(versioning.satisfies("1.5.0", "^1.0.0")).toBe(true);
      expect(versioning.satisfies("2.0.0", "^1.0.0")).toBe(false);
    });

    it("tilde range (~)", () => {
      expect(versioning.satisfies("1.2.5", "~1.2.0")).toBe(true);
      expect(versioning.satisfies("1.3.0", "~1.2.0")).toBe(false);
    });

    it("wildcard", () => {
      expect(versioning.satisfies("99.99.99", "*")).toBe(true);
      expect(versioning.satisfies("0.0.1", "x")).toBe(true);
    });

    it("invalid version returns false", () => {
      expect(versioning.satisfies("abc", "^1.0.0")).toBe(false);
    });
  });

  describe("getBreakingChangeSeverity", () => {
    const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

    it("major version bump = major severity", () => {
      expect(versioning.getBreakingChangeSeverity("1.0.0", "2.0.0")).toBe("major");
    });

    it("minor version bump = minor severity", () => {
      expect(versioning.getBreakingChangeSeverity("1.0.0", "1.1.0")).toBe("minor");
    });

    it("patch version bump = patch severity", () => {
      expect(versioning.getBreakingChangeSeverity("1.0.0", "1.0.1")).toBe("patch");
    });

    it("same version = none", () => {
      expect(versioning.getBreakingChangeSeverity("1.0.0", "1.0.0")).toBe("none");
    });

    it("invalid versions return major as safe default", () => {
      expect(versioning.getBreakingChangeSeverity("abc", "1.0.0")).toBe("major");
    });
  });

  describe("nextVersion", () => {
    it("returns 1.0.0 for no existing versions", async () => {
      mockRegistry.listVersions.mockResolvedValue([]);
      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

      const next = await versioning.nextVersion("new-blueprint");
      expect(next).toBe("1.0.0");
    });

    it("bumps patch by default", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0" },
      ] as any[]);
      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

      const next = await versioning.nextVersion("test");
      expect(next).toBe("1.0.1");
    });

    it("bumps minor version", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0" },
      ] as any[]);
      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

      const next = await versioning.nextVersion("test", "minor");
      expect(next).toBe("1.1.0");
    });

    it("bumps major version", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0" },
      ] as any[]);
      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

      const next = await versioning.nextVersion("test", "major");
      expect(next).toBe("2.0.0");
    });
  });

  describe("generateMigrationPlan", () => {
    it("generates upgrade plan between versions", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0", name: "v1", updatedAt: "" },
        { slug: "test", version: "1.1.0", name: "v1.1", updatedAt: "" },
        { slug: "test", version: "2.0.0", name: "v2", updatedAt: "" },
      ] as any[]);

      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });
      const plan = await versioning.generateMigrationPlan("test", "1.0.0", "2.0.0");

      expect(plan.possible).toBe(true);
      expect(plan.steps).toHaveLength(2);
      expect(plan.steps[0].direction).toBe("upgrade");
      expect(plan.steps[1].direction).toBe("upgrade");
    });

    it("returns not possible for missing source version", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0", name: "v1" },
      ] as any[]);

      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });
      const plan = await versioning.generateMigrationPlan("test", "0.0.1", "1.0.0");

      expect(plan.possible).toBe(false);
      expect(plan.reason).toContain("not found");
    });

    it("returns not possible for missing target version", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0", name: "v1" },
      ] as any[]);

      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });
      const plan = await versioning.generateMigrationPlan("test", "1.0.0", "9.9.9");

      expect(plan.possible).toBe(false);
    });

    it("same from and to versions returns empty plan", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0", name: "v1" },
      ] as any[]);

      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });
      const plan = await versioning.generateMigrationPlan("test", "1.0.0", "1.0.0");

      expect(plan.possible).toBe(true);
      expect(plan.steps).toHaveLength(0);
    });

    it("generates downgrade plan when needed", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0", name: "v1", updatedAt: "" },
        { slug: "test", version: "2.0.0", name: "v2", updatedAt: "" },
      ] as any[]);

      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });
      const plan = await versioning.generateMigrationPlan("test", "2.0.0", "1.0.0");

      expect(plan.possible).toBe(true);
      expect(plan.steps[0].direction).toBe("downgrade");
    });
  });

  describe("getChangelog", () => {
    it("generates changelog from versions", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0", name: "v1", updatedAt: "2024-01-01" },
        { slug: "test", version: "1.1.0", name: "v1.1", updatedAt: "2024-02-01" },
      ] as any[]);

      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });
      const changelog = await versioning.getChangelog("test");

      expect(changelog).toHaveLength(2);
      expect(changelog[0].version).toBe("1.1.0"); // Sorted newest first
      expect(changelog[1].version).toBe("1.0.0");
    });

    it("returns empty array for no versions", async () => {
      mockRegistry.listVersions.mockResolvedValue([]);
      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });
      const changelog = await versioning.getChangelog("nonexistent");

      expect(changelog).toHaveLength(0);
    });
  });

  describe("isSafeToProvision", () => {
    it("returns true when no versions exist", async () => {
      mockRegistry.listVersions.mockResolvedValue([]);
      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });

      expect(await versioning.isSafeToProvision("test", "1.0.0")).toBe(true);
    });

    it("returns false for major version changes", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0", name: "v1" },
      ] as any[]);

      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });
      expect(await versioning.isSafeToProvision("test", "2.0.0")).toBe(false);
    });

    it("returns true for minor/patch version changes", async () => {
      mockRegistry.listVersions.mockResolvedValue([
        { slug: "test", version: "1.0.0", name: "v1" },
      ] as any[]);

      const versioning = new BlueprintVersioning({ registry: mockRegistry as any });
      expect(await versioning.isSafeToProvision("test", "1.1.0")).toBe(true);
      expect(await versioning.isSafeToProvision("test", "1.0.1")).toBe(true);
    });
  });
});

// ─── ProvisionEngine ─────────────────────────────────────────────────────────

describe("ProvisionEngine", () => {
  beforeEach(() => {
    resetCache();
  });

  function createEngineDeps() {
    const mockStepRegistry = new Map();
    // Register all pipeline steps with default mocks
    for (const step of PROVISION_PIPELINE) {
      mockStepRegistry.set(step, {
        step,
        label: PROVISION_STEP_LABELS[step],
        retryPolicy: { type: "never" },
        execute: vi.fn().mockResolvedValue({ done: true }),
        rollback: vi.fn().mockResolvedValue(undefined),
      });
    }

    return {
      loader: {
        load: vi.fn().mockResolvedValue(mockBlueprint),
        loadOrThrow: vi.fn().mockResolvedValue(mockBlueprint),
        exists: vi.fn().mockResolvedValue(true),
        listAvailable: vi.fn().mockResolvedValue([]),
        listVersions: vi.fn().mockResolvedValue([]),
      },
      transactionManager: {
        begin: vi.fn().mockImplementation(async () => {
          const tx = {
            id: "tx-1", workspaceId: "ws-1", blueprintId: "test-v1", blueprintVersion: "1.0.0",
            status: "in_progress", steps: [], currentStepIndex: 0, retryCount: 0, maxRetries: 3,
          };
          return tx;
        }),
        updateStatus: vi.fn().mockImplementation(async (_id: string, status: string) => {
          return { id: "tx-1", workspaceId: "ws-1", status, steps: [], currentStepIndex: 2, retryCount: 0, maxRetries: 3 };
        }),
        recordStep: vi.fn().mockResolvedValue(undefined),
        get: vi.fn().mockImplementation(async () => ({
          id: "tx-1", workspaceId: "ws-1", blueprintId: "test-v1", blueprintVersion: "1.0.0",
          status: "completed", initiatedBy: "user-1",
          startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:01Z",
          steps: [], currentStepIndex: 2, retryCount: 0, maxRetries: 3,
        })),
        getByWorkspace: vi.fn().mockResolvedValue([]),
        getNextStep: vi.fn().mockReturnValue(null),
        getDuration: vi.fn().mockReturnValue(1000),
      },
      validator: {
        validate: vi.fn().mockResolvedValue({
          valid: true,
          warnings: [],
          resolved: { blueprintId: "test-v1", blueprintSlug: "test", blueprintVersion: "1.0.0", blueprintName: "Test" },
        }),
        validateRequest: vi.fn().mockReturnValue({ valid: true }),
      },
      reportGenerator: {
        generate: vi.fn().mockImplementation(() => ({
          transactionId: "tx-1",
          success: false,
          durationMs: 100,
          workspace: { id: "ws-1", name: "Test", status: "active", plan: "free" },
          blueprint: { id: "test-v1", slug: "test", version: "1.0.0", name: "Test", category: "test" },
          theme: { presetId: "default", applied: true },
          pages: { total: 1, created: 1 },
          blocks: { total: 1, inserted: 1 },
          navigation: { total: 1, created: 1 },
          errors: [], warnings: [], stepTimings: [],
        })),
        format: vi.fn().mockReturnValue("formatted report"),
      },
      workspaceRepository: {
        findById: vi.fn().mockResolvedValue({
          id: "ws-1", status: "active", plan: "free",
          metadata: { name: "Test", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z", locale: "fa-IR", timezone: "Asia/Tehran" },
          limits: { maxPages: 10, maxMedia: 20, maxStorage: 52428800, maxTemplates: 1, maxAdmins: 1, maxAnalyticsRetention: 30, maxVisitors: 1000 },
          membership: [{ userId: "user-1", role: "owner", joinedAt: "2024-01-01T00:00:00Z" }],
        }),
        findByUserId: vi.fn().mockResolvedValue([]),
        save: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
        listAll: vi.fn().mockResolvedValue([]),
        getOrCreateDefault: vi.fn().mockResolvedValue(null),
      },
      repos: {
        siteContent: {
          getProvisionLog: vi.fn().mockResolvedValue({ entities: [] }),
          saveProvisionLog: vi.fn().mockResolvedValue(undefined),
        },
      } as any,
      stepRegistry: mockStepRegistry,
      logger: new ConsoleLogger(),
    };
  }

  it("provision completes successfully with valid input", async () => {
    const deps = createEngineDeps();
    const engine = new ProvisionEngine(deps as any);

    await engine.provision({
      ...validProvisionInput(),
    });

    expect(deps.validator.validate).toHaveBeenCalled();
    expect(deps.loader.loadOrThrow).toHaveBeenCalledWith("test", "1.0.0");
    expect(deps.transactionManager.begin).toHaveBeenCalled();
    expect(deps.transactionManager.updateStatus).toHaveBeenCalledWith("tx-1", "completed");
    expect(deps.reportGenerator.generate).toHaveBeenCalled();
  });

  it("throws on validation failure", async () => {
    const deps = createEngineDeps();
    deps.validator.validate = vi.fn().mockResolvedValue({
      valid: false,
      error: "Blueprint not found",
      warnings: [],
    });
    const engine = new ProvisionEngine(deps as any);

    await expect(
      engine.provision(validProvisionInput({ blueprintSlug: "nonexistent" })),
    ).rejects.toThrow("Provision validation failed");

    expect(deps.transactionManager.begin).not.toHaveBeenCalled();
  });

  it("rolls back completed steps on failure", async () => {
    const deps = createEngineDeps();

    // Make SEED_DATA (3rd pipeline step) fail
    const seedStep = ProvisionStep.SEED_DATA;
    const seedCmd = deps.stepRegistry.get(seedStep);
    seedCmd.execute = vi.fn().mockRejectedValue(new Error("Seed failed"));
    seedCmd.retryPolicy = { type: "never" };

    const engine = new ProvisionEngine(deps as any);

    await engine.provision({
      ...validProvisionInput(),
    });

    // Check that updateStatus was called with "failed" — confirming rollback path was taken
    expect(deps.transactionManager.updateStatus).toHaveBeenCalledWith("tx-1", "failed");
    // The two preceding steps (validate_request, create_workspace) should have rollback called
    const validateCmd = deps.stepRegistry.get(ProvisionStep.VALIDATE_REQUEST);
    expect(validateCmd.rollback).toHaveBeenCalled();
  });

  it("records step metrics via transaction manager", async () => {
    const deps = createEngineDeps();
    const engine = new ProvisionEngine(deps as any);

    await engine.provision({
      ...validProvisionInput(),
    });

    expect(deps.transactionManager.recordStep).toHaveBeenCalled();
  });
});
