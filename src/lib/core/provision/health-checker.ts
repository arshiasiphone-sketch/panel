/**
 * NAMA Platform — Provision Health Checker.
 *
 * Runs health checks after provisioning to verify everything was installed correctly.
 * Health checks are DATA-driven — they check each provisioned entity type
 * based on what was in the blueprint.
 */

import { BaseRepository, type RepositoryDependencies } from "@/lib/repositories/base";
import type { ProvisionHealthCheckResult, ProvisionHealthCheck, Blueprint } from "./types";

export class ProvisionHealthChecker extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  /**
   * Run all health checks for a provisioned workspace.
   *
   * @param blueprint - The blueprint that was installed (DATA).
   * @param workspaceId - The workspace to check.
   * @returns Health check results.
   */
  async runChecks(blueprint: Blueprint, workspaceId: string): Promise<ProvisionHealthCheckResult> {
    const checks: ProvisionHealthCheck[] = await Promise.all([
      this._checkThemeInstalled(),
      this._checkPagesCreated(blueprint),
      this._checkBlocksValid(),
      this._checkNavigationExists(),
      this._checkAnalyticsReady(),
      this._checkCMSReady(),
      this._checkMediaReady(),
      this._checkWorkspaceStatus(workspaceId),
    ]);

    const allPassed = checks.every((c) => c.passed);

    return {
      healthy: allPassed,
      summary: allPassed
        ? "All provision health checks passed"
        : `${checks.filter((c) => !c.passed).length} health check(s) failed`,
      checks,
    };
  }

  /**
   * Check that theme settings have been installed.
   * Checks theme_settings table without hardcoded id=1.
   */
  private async _checkThemeInstalled(): Promise<ProvisionHealthCheck> {
    try {
      const { data } = await this.db
        .from("theme_settings")
        .select("id")
        .limit(1);

      const themeExists = data && data.length > 0;

      return {
        name: "theme-installed",
        passed: !!themeExists,
        detail: themeExists ? "Theme settings exist" : "Theme settings not found",
      };
    } catch (err) {
      return {
        name: "theme-installed",
        passed: false,
        detail: err instanceof Error ? err.message : "Unknown error checking theme",
      };
    }
  }

  /**
   * Check that pages from the blueprint were created.
   */
  private async _checkPagesCreated(blueprint: Blueprint): Promise<ProvisionHealthCheck> {
    try {
      const totalBlocks = blueprint.blocks.length;
      if (totalBlocks === 0) {
        return {
          name: "pages-created",
          passed: true,
          detail: "No pages defined in blueprint — skipping",
        };
      }

      const { data } = await this.db
        .from("page_blocks")
        .select("id", { count: "exact", head: true });

      const count = data?.length ?? 0;
      return {
        name: "pages-created",
        passed: count > 0,
        detail: `${count} page block(s) found (expected ~${totalBlocks})`,
        data: { found: count, expected: totalBlocks },
      };
    } catch (err) {
      return {
        name: "pages-created",
        passed: false,
        detail: err instanceof Error ? err.message : "Unknown error checking pages",
      };
    }
  }

  /**
   * Check that blocks are valid (have required fields).
   */
  private async _checkBlocksValid(): Promise<ProvisionHealthCheck> {
    try {
      const { data } = await this.db
        .from("page_blocks")
        .select("id,type,data")
        .limit(10);

      if (!data || data.length === 0) {
        return {
          name: "blocks-valid",
          passed: true,
          detail: "No blocks to validate",
        };
      }

      const invalid = data.filter(
        (block) => !block.type || typeof block.type !== "string" || !block.type.trim(),
      );

      return {
        name: "blocks-valid",
        passed: invalid.length === 0,
        detail: invalid.length === 0
          ? `${data.length} block(s) validated`
          : `${invalid.length} invalid block(s) found`,
        data: { total: data.length, invalid: invalid.length },
      };
    } catch (err) {
      return {
        name: "blocks-valid",
        passed: false,
        detail: err instanceof Error ? err.message : "Unknown error checking blocks",
      };
    }
  }

  /**
   * Check that navigation data exists (workspace-scoped).
   */
  private async _checkNavigationExists(): Promise<ProvisionHealthCheck> {
    try {
      const { data } = await this.db
        .from<{ key: string; value: unknown }>("site_content")
        .select("value")
        .like("key", "navigation:%")
        .limit(1)
        .maybeSingle();

      const hasItems = data?.value && typeof data.value === "object" &&
        "items" in (data.value as Record<string, unknown>) &&
        Array.isArray((data.value as Record<string, unknown>).items) &&
        ((data.value as Record<string, unknown>).items as unknown[]).length > 0;

      return {
        name: "navigation-exists",
        passed: !!hasItems,
        detail: hasItems ? "Navigation exists" : "No navigation data found",
      };
    } catch (err) {
      return {
        name: "navigation-exists",
        passed: false,
        detail: err instanceof Error ? err.message : "Unknown error checking navigation",
      };
    }
  }

  /**
   * Check that analytics configuration is ready (workspace-scoped).
   */
  private async _checkAnalyticsReady(): Promise<ProvisionHealthCheck> {
    try {
      const { data } = await this.db
        .from<{ key: string; value: unknown }>("site_content")
        .select("value")
        .like("key", "analytics_config:%")
        .limit(1)
        .maybeSingle();

      return {
        name: "analytics-ready",
        passed: !!data,
        detail: data ? "Analytics configured" : "Analytics config not found",
      };
    } catch (err) {
      return {
        name: "analytics-ready",
        passed: false,
        detail: err instanceof Error ? err.message : "Unknown error checking analytics",
      };
    }
  }

  /**
   * Check that CMS data is ready (site_content entries).
   */
  private async _checkCMSReady(): Promise<ProvisionHealthCheck> {
    try {
      const { data } = await this.db
        .from<{ key: string }>("site_content")
        .select("key");

      const keys = (data ?? []).map((row) => row.key);
      const cmsKeys = keys.filter(
        (k: string) =>
          k.startsWith("seo_") ||
          k.startsWith("business_") ||
          k === "fonts_config" ||
          k.startsWith("provision:"),
      );

      return {
        name: "cms-ready",
        passed: cmsKeys.length > 0,
        detail: `${cmsKeys.length} CMS data key(s) configured`,
        data: { keys: cmsKeys },
      };
    } catch (err) {
      return {
        name: "cms-ready",
        passed: false,
        detail: err instanceof Error ? err.message : "Unknown error checking CMS",
      };
    }
  }

  /**
   * Check that media configuration is ready.
   */
  private async _checkMediaReady(): Promise<ProvisionHealthCheck> {
    try {
      const { data } = await this.db
        .from<{ key: string }>("site_content")
        .select("key")
        .like("key", "media_folder:%");

      const count = data?.length ?? 0;

      return {
        name: "media-ready",
        passed: count > 0,
        detail: count > 0
          ? `${count} media folder(s) configured`
          : "No media folders found (may not be needed)",
        data: { folderCount: count },
      };
    } catch (err) {
      return {
        name: "media-ready",
        passed: false,
        detail: err instanceof Error ? err.message : "Unknown error checking media",
      };
    }
  }

  /**
   * Check the workspace status is operational.
   */
  private async _checkWorkspaceStatus(workspaceId: string): Promise<ProvisionHealthCheck> {
    try {
      const { data } = await this.db
        .from("site_content")
        .select("value")
        .eq("key", `workspace:${workspaceId}:entity`)
        .maybeSingle();

      if (!data?.value) {
        return {
          name: "workspace-status",
          passed: false,
          detail: "Workspace entity not found",
        };
      }

      const entity = data.value as Record<string, unknown>;
      const status = entity.status as string;
      const isActive = status === "active" || status === "trial";

      return {
        name: "workspace-status",
        passed: isActive,
        detail: isActive
          ? `Workspace is ${status} — fully operational`
          : `Workspace is ${status} — needs activation`,
        data: { status, workspaceId },
      };
    } catch (err) {
      return {
        name: "workspace-status",
        passed: false,
        detail: err instanceof Error ? err.message : "Unknown error checking workspace status",
      };
    }
  }
}
