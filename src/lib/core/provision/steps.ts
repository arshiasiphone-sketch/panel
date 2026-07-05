/**
 * NAMA Platform — Provision Step Commands.
 *
 * Command Pattern implementation for the provisioning pipeline.
 * Each step is a self-contained command with:
 * - execute(): Perform the step's work
 * - rollback(): Undo the step's work
 * - validate(): Pre-flight validation
 *
 * Benefits:
 * - No switch statements or giant engine methods
 * - Each step is independently testable
 * - Rollback is built into each step (no separate rollback knowledge)
 * - Retry policy is configurable per step
 */

import type { Blueprint } from "./types";
import { ProvisionStep } from "./types";
import type { ProvisionSession } from "./session-context";
import type { Repositories } from "@/lib/repositories/factory";

// ─── Retry Policy ────────────────────────────────────────────────────────────

export type RetryPolicy =
  | { type: "never" }
  | { type: "immediate"; maxRetries: number }
  | { type: "exponential"; maxRetries: number; baseDelayMs?: number; maxDelayMs?: number }
  | { type: "linear"; maxRetries: number; delayMs?: number }
  | { type: "custom"; shouldRetry: (attempt: number, error: unknown) => number | null };

// ─── Step Command Interface ──────────────────────────────────────────────────

export interface ProvisionStepCommand {
  /** The step identifier. */
  readonly step: ProvisionStep;
  /** Human-readable label. */
  readonly label: string;
  /** Retry policy for this step. */
  readonly retryPolicy: RetryPolicy;

  /** Execute the step. Returns output data. */
  execute(blueprint: Blueprint, workspaceId: string, repos: Repositories, session: ProvisionSession): Promise<Record<string, unknown> | undefined>;

  /** Rollback the step. Only knows resource identifiers, not domain details. */
  rollback(blueprint: Blueprint, workspaceId: string, repos: Repositories, session: ProvisionSession): Promise<void>;

  /** Pre-flight validation. Return null if valid, or an error message. */
  validate?(blueprint: Blueprint, workspaceId: string): Promise<string | null>;
}

// ─── Default Retry Policies ─────────────────────────────────────────────────

export const DEFAULT_RETRY_POLICIES: Partial<Record<ProvisionStep, RetryPolicy>> = {
  [ProvisionStep.VALIDATE_REQUEST]: { type: "never" },
  [ProvisionStep.CREATE_WORKSPACE]: { type: "exponential", maxRetries: 3, baseDelayMs: 500, maxDelayMs: 5000 },
  [ProvisionStep.INSTALL_BLUEPRINT]: { type: "exponential", maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 10000 },
  [ProvisionStep.SEED_DATA]: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5000 },
  [ProvisionStep.INSERT_THEME]: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5000 },
  [ProvisionStep.INSERT_FONTS]: { type: "immediate", maxRetries: 1 },
  [ProvisionStep.INSERT_DEFAULT_MEDIA]: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5000 },
  [ProvisionStep.INSERT_ANALYTICS_DEFAULTS]: { type: "immediate", maxRetries: 1 },
  [ProvisionStep.RUN_HEALTH_CHECK]: { type: "never" },
  [ProvisionStep.WORKSPACE_READY]: { type: "immediate", maxRetries: 2 },
};

// ─── Retry Helper ───────────────────────────────────────────────────────────

/**
 * Calculate delay based on retry policy.
 * Returns delay in ms, or -1 if no retry should be attempted.
 */
export function getRetryDelayMs(policy: RetryPolicy, attempt: number, _error: unknown): number {
  switch (policy.type) {
    case "never":
      return -1;

    case "immediate":
      return attempt < policy.maxRetries ? 0 : -1;

    case "exponential": {
      if (attempt >= policy.maxRetries) return -1;
      const base = policy.baseDelayMs ?? 1000;
      const max = policy.maxDelayMs ?? 30000;
      const delay = base * Math.pow(2, attempt);
      return Math.min(delay, max);
    }

    case "linear": {
      if (attempt >= policy.maxRetries) return -1;
      return policy.delayMs ?? 1000;
    }

    case "custom": {
      const result = policy.shouldRetry(attempt, _error);
      return result !== null ? result : -1;
    }
  }
}

// ─── Step Registry ───────────────────────────────────────────────────────────

/**
 * Create the command registry — maps each pipeline step to its command.
 * This is the single source of truth for the pipeline.
 */
export function createStepRegistry(): Map<ProvisionStep, ProvisionStepCommand> {
  const registry = new Map<ProvisionStep, ProvisionStepCommand>();

  // Validate Request
  registry.set(ProvisionStep.VALIDATE_REQUEST, {
    step: ProvisionStep.VALIDATE_REQUEST,
    label: "Validate Request",
    retryPolicy: { type: "never" },
    async execute() {
      return { validated: true };
    },
    async rollback() {
      // Validation has no side effects
    },
  });

  // Create Workspace
  registry.set(ProvisionStep.CREATE_WORKSPACE, {
    step: ProvisionStep.CREATE_WORKSPACE,
    label: "Create Workspace",
    retryPolicy: { type: "exponential", maxRetries: 3, baseDelayMs: 500, maxDelayMs: 5000 },
    async execute() {
      // Workspace is created by the engine before the pipeline starts
      return { workspaceCreated: true };
    },
    async rollback(_blueprint, _workspaceId, repos) {
      // Workspace deletion is handled by rollback at engine level
      // This step is a no-op here because the engine manages workspace lifecycle
    },
  });

  // Install Blueprint — pure orchestration, delegates to repositories
  registry.set(ProvisionStep.INSTALL_BLUEPRINT, {
    step: ProvisionStep.INSTALL_BLUEPRINT,
    label: "Install Blueprint",
    retryPolicy: { type: "exponential", maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 10000 },
    async execute(blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;

      // Get or create provision log for idempotency
      const log = await repos.siteContent.getProvisionLog(workspaceId, blueprint.slug, blueprint.version);

      // Install pages and blocks via PagesRepository
      if (!log.entities.includes("pages")) {
        await repos.pages.installBlueprintPages(blueprint.pages, blueprint.blocks, resourceMap);
        log.entities.push("pages");
      }

      // Install navigation via SiteContentRepository
      if (!log.entities.includes("navigation")) {
        const navKey = await repos.siteContent.installBlueprintNavigation(blueprint.navigation, workspaceId, resourceMap);
        if (navKey) {
          resourceMap.navigationKey = navKey;
          log.entities.push("navigation");
        }
      }

      // Install menu items via MenuRepository
      if (!log.entities.includes("menus") && blueprint.menus.length > 0) {
        await repos.menu.installBlueprintMenuItems(blueprint.menus, resourceMap);
        log.entities.push("menus");
      }

      // Install gallery images via GalleryRepository
      if (!log.entities.includes("gallery") && blueprint.gallery.length > 0) {
        await repos.gallery.installBlueprintGallery(blueprint.gallery, resourceMap);
        log.entities.push("gallery");
      }

      // Install personality profiles via PersonalityRepository
      if (!log.entities.includes("personalities") && blueprint.personalitySettings.length > 0) {
        await repos.personality.installBlueprintPersonalities(blueprint.personalitySettings, resourceMap);
        log.entities.push("personalities");
      }

      // Install CMS data (business settings, SEO)
      if (!log.entities.includes("cms_data")) {
        await repos.siteContent.installBlueprintBusinessSettings(blueprint.businessSettings, workspaceId, resourceMap);
        await repos.siteContent.installBlueprintSEO({ title: blueprint.seo.title, description: blueprint.seo.description, ogImage: blueprint.seo.ogImage }, workspaceId, resourceMap);
        log.entities.push("cms_data");
      }

      // Install analytics config
      if (!log.entities.includes("analytics")) {
        await repos.siteContent.installBlueprintAnalytics(blueprint.analytics, workspaceId, resourceMap);
        log.entities.push("analytics");
      }

      // Save provision log
      await repos.siteContent.saveProvisionLog(workspaceId, blueprint.slug, blueprint.version, log);

      return {
        pageBlocks: resourceMap.pageBlockIds.length,
        menus: resourceMap.menuItemIds.length,
        gallery: resourceMap.galleryImageIds.length,
        personalities: resourceMap.personalityKeys.length,
        navigation: resourceMap.navigationKey ? 1 : 0,
        count: blueprint.pages.length,
      };
    },
    async rollback(_blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;

      // Generic rollback via repositories — no domain knowledge needed
      if (resourceMap.pageBlockIds.length > 0) {
        await repos.pages.batchDelete(resourceMap.pageBlockIds);
      }
      if (resourceMap.menuItemIds.length > 0) {
        await repos.menu.batchDelete(resourceMap.menuItemIds);
      }
      if (resourceMap.galleryImageIds.length > 0) {
        await repos.gallery.batchDelete(resourceMap.galleryImageIds);
      }
      if (resourceMap.personalityKeys.length > 0) {
        await repos.personality.batchDelete(resourceMap.personalityKeys);
      }
      if (resourceMap.siteContentKeys.length > 0) {
        // Batch delete all site content keys in a single round-trip
        const allKeys = [...resourceMap.siteContentKeys];
        if (resourceMap.navigationKey) {
          allKeys.push(resourceMap.navigationKey);
        }
        // Clean up provision log
        allKeys.push(`provision:log:${workspaceId}:${_blueprint.slug}:${_blueprint.version}`);
        await repos.siteContent.batchDeleteByKeys(allKeys);
      }
    },
  });

  // Seed Data — delegates to repositories
  registry.set(ProvisionStep.SEED_DATA, {
    step: ProvisionStep.SEED_DATA,
    label: "Seed Data",
    retryPolicy: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5000 },
    async execute(blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;
      const results: Record<string, unknown> = {};

      // Seed media folders via SiteContentRepository — batch check and insert
      if (blueprint.mediaFolderStructure.length > 0) {
        const folderKeys = blueprint.mediaFolderStructure.map(
          (f) => `media_folder:${workspaceId}:${f.path}`,
        );
        // Batch check which keys already exist
        const existingMap = await repos.siteContent.batchGetByKeys(folderKeys);

        let count = 0;
        for (const folder of blueprint.mediaFolderStructure) {
          const folderKey = `media_folder:${workspaceId}:${folder.path}`;
          if (existingMap.has(folderKey)) continue;

          await repos.siteContent.upsert(folderKey, {
            path: folder.path,
            workspaceId,
            description: folder.description,
            createdAt: new Date().toISOString(),
          });
          resourceMap.siteContentKeys.push(folderKey);
          count++;
        }
        results.mediaFolders = count;
      }

      // Seed fonts via SiteContentRepository
      if (blueprint.fonts) {
        const fontKey = "fonts_config";
        const existing = await repos.siteContent.getByKey(fontKey);
        if (!existing) {
          await repos.siteContent.upsert(fontKey, {
            body: blueprint.fonts.body,
            heading: blueprint.fonts.heading,
            importGoogleFonts: blueprint.fonts.importGoogleFonts,
            imports: blueprint.fonts.imports ?? [],
          });
          resourceMap.siteContentKeys.push(fontKey);
        }
        results.fontsConfigured = true;
      }

      return results;
    },
    async rollback(_blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;
      // Remove media folder keys and font config
      const keysToRemove = resourceMap.siteContentKeys.filter(
        (k) => k.startsWith(`media_folder:${workspaceId}:`) || k === "fonts_config",
      );
      if (keysToRemove.length > 0) {
        await repos.siteContent.batchDeleteByKeys(keysToRemove);
      }
    },
  });

  // Insert Theme — delegates to ThemeRepository
  registry.set(ProvisionStep.INSERT_THEME, {
    step: ProvisionStep.INSERT_THEME,
    label: "Insert Theme",
    retryPolicy: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5000 },
    async execute(blueprint, _workspaceId, repos, session) {
      await repos.theme.installBlueprintTheme(blueprint.theme);
      session.resourceMap.themeInstalled = true;
      return { presetId: blueprint.theme.presetId };
    },
    async rollback() {
      // Theme is a singleton — no rollback needed at this level
      // In future multi-workspace, this would delete workspace-scoped theme
    },
  });

  // Insert Fonts
  registry.set(ProvisionStep.INSERT_FONTS, {
    step: ProvisionStep.INSERT_FONTS,
    label: "Insert Fonts",
    retryPolicy: { type: "immediate", maxRetries: 1 },
    async execute(blueprint) {
      return { body: blueprint.fonts.body, heading: blueprint.fonts.heading };
    },
    async rollback() {
      // Fonts are handled by seed_data rollback if needed
    },
  });

  // Insert Default Media
  registry.set(ProvisionStep.INSERT_DEFAULT_MEDIA, {
    step: ProvisionStep.INSERT_DEFAULT_MEDIA,
    label: "Insert Default Media",
    retryPolicy: { type: "exponential", maxRetries: 2, baseDelayMs: 500, maxDelayMs: 5000 },
    async execute(blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;

      // Batch check which folders exist, then batch insert new ones
      const folderKeys = blueprint.mediaFolderStructure.map(
        (f) => `media_folder:${workspaceId}:${f.path}`,
      );
      const existingMap = await repos.siteContent.batchGetByKeys(folderKeys);

      let count = 0;
      for (const folder of blueprint.mediaFolderStructure) {
        const folderKey = `media_folder:${workspaceId}:${folder.path}`;
        if (existingMap.has(folderKey)) continue;

        await repos.siteContent.upsert(folderKey, {
          path: folder.path,
          workspaceId,
          description: folder.description,
          createdAt: new Date().toISOString(),
        });
        resourceMap.siteContentKeys.push(folderKey);
        count++;
      }

      return { mediaFolders: count };
    },
    async rollback(_blueprint, workspaceId, repos, session) {
      const resourceMap = session.resourceMap;
      const mediaKeys = resourceMap.siteContentKeys.filter(
        (k) => k.startsWith(`media_folder:${workspaceId}:`),
      );
      if (mediaKeys.length > 0) {
        await repos.siteContent.batchDeleteByKeys(mediaKeys);
      }
    },
  });

  // Insert Analytics Defaults
  registry.set(ProvisionStep.INSERT_ANALYTICS_DEFAULTS, {
    step: ProvisionStep.INSERT_ANALYTICS_DEFAULTS,
    label: "Insert Analytics Defaults",
    retryPolicy: { type: "immediate", maxRetries: 1 },
    async execute(blueprint, workspaceId, repos, session) {
      await repos.siteContent.installBlueprintAnalytics(blueprint.analytics, workspaceId, session.resourceMap);
      return { enabled: blueprint.analytics.enabled };
    },
    async rollback(_blueprint, workspaceId, repos) {
      const analyticsKey = `analytics_config:${workspaceId}`;
      await repos.siteContent.deleteByKey(analyticsKey);
    },
  });

  // Run Health Check
  registry.set(ProvisionStep.RUN_HEALTH_CHECK, {
    step: ProvisionStep.RUN_HEALTH_CHECK,
    label: "Run Health Check",
    retryPolicy: { type: "never" },
    async execute() {
      return { healthy: true, checks: 0 };
    },
    async rollback() {
      // Health check has no side effects
    },
  });

  // Workspace Ready
  registry.set(ProvisionStep.WORKSPACE_READY, {
    step: ProvisionStep.WORKSPACE_READY,
    label: "Workspace Ready",
    retryPolicy: { type: "immediate", maxRetries: 2 },
    async execute(_blueprint, workspaceId, repos) {
      // Mark workspace as active
      const entity = await repos.workspace.findById(workspaceId);
      if (entity) {
        entity.status = "active";
        entity.metadata.updatedAt = new Date().toISOString();
        await repos.workspace.save(entity);
      }
      return { activated: true };
    },
    async rollback(_blueprint, workspaceId, repos) {
      const entity = await repos.workspace.findById(workspaceId);
      if (entity) {
        entity.status = "provisioning";
        entity.metadata.updatedAt = new Date().toISOString();
        await repos.workspace.save(entity);
      }
    },
  });

  return registry;
}
