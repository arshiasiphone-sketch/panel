/**
 * Performance benchmarks for Provision Engine operations.
 * These measure duration of key operations to detect regressions.
 * Tests are informational — they don't assert on specific durations
 * but log metrics for comparison.
 *
 * Run: npx vitest run src/lib/core/provision/__tests__/provision-benchmarks.test.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProvisionStep, PROVISION_PIPELINE, PROVISION_STEP_LABELS } from "../types";
import { createSession } from "../session-context";
import { getRetryDelayMs, type RetryPolicy } from "../steps";
import { ProvisionReportGenerator } from "../report";
import { ProvisionValidator } from "../validator";
import { ProvisionHealthChecker } from "../health-checker";
import { ProvisionSeeder } from "../seeder";
import { BlueprintVersioning } from "../blueprint/versioning";
import { BlueprintLoader } from "../blueprint/loader";
import { RepositoryCache, getCache, resetCache } from "../../repository-cache";
import { createMockDependencies } from "../../../testing/mock-providers";
import { ConsoleLogger } from "../../../logger";
import {
  isStepRetryable,
  isTransientError,
  getRetryDelay,
  shouldRetry,
} from "../retry";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockBlueprint = {
  id: "test-v1", slug: "test", version: "1.0.0",
  name: "Test Blueprint", description: "A test blueprint", category: "test",
  pages: [{ key: "home", title: "Home", path: "/", blockKeys: ["hero"] }],
  blocks: [{ key: "hero", type: "hero", data: { title: "Welcome" }, sortOrder: 0 }],
  theme: { presetId: "default", overrides: undefined },
  navigation: [{ title: "Home", path: "/", sortOrder: 0 }],
  fonts: { body: "inherit", heading: "inherit", importGoogleFonts: false },
  seo: { title: "Test", description: "Test site" },
  analytics: { enabled: true },
  menus: [], gallery: [], businessSettings: {},
  personalitySettings: [], mediaFolderStructure: [],
  permissions: { admin: [], member: [], viewer: [] },
  metadata: { createdBy: "system", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z", tags: [], isPublished: true },
};

function measure(name: string, fn: () => Promise<void>): Promise<number> {
  const start = performance.now();
  return fn().then(() => {
    const duration = performance.now() - start;
    console.log(`[BENCHMARK] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  });
}

// ─── Benchmarks ──────────────────────────────────────────────────────────────

describe("Provision Benchmarks", () => {
  beforeEach(() => {
    resetCache();
  });

  it("retry delay calculation", async () => {
    const policy: RetryPolicy = { type: "exponential", maxRetries: 10, baseDelayMs: 100, maxDelayMs: 30000 };

    await measure("getRetryDelayMs × 1000 calls", async () => {
      for (let i = 0; i < 1000; i++) {
        getRetryDelayMs(policy, i % 10, new Error());
      }
    });
  });

  it("shouldRetry × 500 calls", async () => {
    await measure("shouldRetry × 500 calls", async () => {
      for (let i = 0; i < 500; i++) {
        shouldRetry(ProvisionStep.INSTALL_BLUEPRINT, 0, 3, new Error("timeout"));
      }
    });
  });

  it("isTransientError × 1000 calls", async () => {
    const errors = [
      "timeout", "Network error", "ECONNREFUSED", "429 Too Many Requests",
      "502 Bad Gateway", "503 Service Unavailable", "Invalid input",
      "Not found", "Database timeout", "rate limit",
    ];

    await measure("isTransientError × 1000 calls", async () => {
      for (let i = 0; i < 100; i++) {
        for (const msg of errors) {
          isTransientError(new Error(msg));
        }
      }
    });
  });

  it("getRetryDelay × 1000 calls", async () => {
    await measure("getRetryDelay × 1000 calls", async () => {
      for (let i = 0; i < 1000; i++) {
        getRetryDelay(i % 10);
      }
    });
  });

  it("versioning.parse × 1000 calls", async () => {
    const versioning = new BlueprintVersioning({ registry: {} as any });

    await measure("versioning.parse × 1000", async () => {
      for (let i = 0; i < 1000; i++) {
        versioning.parse("1.2.3");
      }
    });
  });

  it("session creation", async () => {
    const ctx = { workspaceId: "ws-1", transactionId: "tx-1", blueprintSlug: "test", blueprintVersion: "1.0.0", initiatedBy: "user-1", startedAt: "2024-01-01T00:00:00Z" };

    await measure("createSession × 1000", async () => {
      for (let i = 0; i < 1000; i++) {
        createSession(ctx);
      }
    });
  });

  it("repository cache getOrFetch (cache hit)", async () => {
    const cache = getCache();
    const fetchFn = vi.fn().mockResolvedValue({ data: "test" });
    await cache.getOrFetch("bench", "hit", fetchFn);

    await measure("cache getOrFetch hit × 1000", async () => {
      for (let i = 0; i < 1000; i++) {
        await cache.getOrFetch("bench", "hit", fetchFn);
      }
    });
  });

  it("repository cache getOrFetch (cache miss)", async () => {
    const cache = getCache();

    await measure("cache getOrFetch miss × 100", async () => {
      for (let i = 0; i < 100; i++) {
        await cache.getOrFetch("bench", `miss-${i}`, async () => ({ data: i }));
      }
    });
  });

  it("report generation", async () => {
    const generator = new ProvisionReportGenerator();
    const tx = {
      id: "tx-bench", workspaceId: "ws-1", blueprintId: "test-v1", blueprintVersion: "1.0.0",
      status: "completed" as const, initiatedBy: "user-1",
      startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:01Z",
      steps: Array.from({ length: 10 }, (_, i) => ({
        step: PROVISION_PIPELINE[i] ?? "validate_request" as ProvisionStep,
        success: true, startedAt: "2024-01-01T00:00:00Z",
        completedAt: "2024-01-01T00:00:01Z", durationMs: i * 100,
      })),
      currentStepIndex: 10, retryCount: 0, maxRetries: 3,
    };

    await measure("report.generate × 100", async () => {
      for (let i = 0; i < 100; i++) {
        generator.generate(tx, mockBlueprint, { id: "ws-1", name: "Test", status: "active", plan: "free" });
      }
    });
  });

  it("report format", async () => {
    const generator = new ProvisionReportGenerator();
    const tx = {
      id: "tx-bench", workspaceId: "ws-1", blueprintId: "test-v1", blueprintVersion: "1.0.0",
      status: "completed" as const, initiatedBy: "user-1",
      startedAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:00:01Z",
      steps: []
    } as any;
    const report = generator.generate(tx, mockBlueprint, { id: "ws-1", name: "Test", status: "active", plan: "free" });

    await measure("report.format × 100", async () => {
      for (let i = 0; i < 100; i++) {
        generator.format(report);
      }
    });
  });

  it("versioning compare × 1000", async () => {
    const versioning = new BlueprintVersioning({ registry: {} as any });

    await measure("versioning.compare × 1000", async () => {
      for (let i = 0; i < 1000; i++) {
        versioning.compare("1.0.0", "2.0.0");
        versioning.isCompatible("1.0.0", "1.5.0");
        versioning.getBreakingChangeSeverity("1.0.0", "2.0.0");
        versioning.satisfies("1.5.0", "^1.0.0");
      }
    });
  });

  it("validator request validation", async () => {
    const deps = createMockDependencies();
    const validator = new ProvisionValidator({
      ...deps,
      blueprintLoader: { load: vi.fn().mockResolvedValue(mockBlueprint) } as any,
      workspaceRepository: { findByUserId: vi.fn().mockResolvedValue([]) } as any,
    });

    await measure("validator.validateRequest × 100", async () => {
      for (let i = 0; i < 100; i++) {
        validator.validateRequest({ blueprintSlug: "test", ownerUserId: "user-1" });
      }
    });
  });
});
