/**
 * NAMA Platform — Provision Rollback.
 *
 * Rollback logic for the provisioning pipeline.
 * If a step fails, the rollback mechanism reverses all completed steps
 * to ensure no partial data is left behind.
 *
 * ENTERPRISE HARDENING (EPIC 4B.1):
 * - Every rollback operation is scoped to workspace + transaction session
 * - No DELETE without workspace filtering
 * - Uses ProvisionResourceMap to track exactly what was created
 * - Never deletes data from other workspaces
 *
 * Rules:
 * - Never leave partial data
 * - Each step knows how to undo itself
 * - Rollback is also tracked in the transaction
 * - If rollback itself fails, it's logged as a critical error
 */

import { BaseRepository, type RepositoryDependencies } from "@/lib/repositories/base";
import type { ProvisionTransaction, ProvisionStep } from "./types";
import { PROVISION_PIPELINE } from "./types";
import type { ProvisionTransactionManager } from "./transaction";
import type { ProvisionResourceMap } from "./session-context";

export interface RollbackDependencies {
  transactionManager: ProvisionTransactionManager;
}

export class ProvisionRollback extends BaseRepository {
  private readonly transactionManager: ProvisionTransactionManager;

  constructor(deps: RepositoryDependencies & RollbackDependencies) {
    super(deps);
    this.transactionManager = deps.transactionManager;
  }

  /**
   * Roll back a failed provision transaction.
   * Uses the resource map to scope all destructive operations to only
   * resources created during this session. Never deletes data from
   * other workspaces.
   *
   * @returns Whether the rollback was fully successful.
   */
  async rollback(tx: ProvisionTransaction, resourceMap?: ProvisionResourceMap): Promise<boolean> {
    this.logger.info(`Rolling back transaction ${tx.id}`, {
      source: "provision-rollback",
      workspaceId: tx.workspaceId,
      stepIndex: tx.currentStepIndex,
      hasResourceMap: !!resourceMap,
    });

    // Mark the transaction as rolling back
    tx = await this.transactionManager.updateStatus(tx.id, "rolling_back");

    // Get completed steps (in reverse order)
    const completedSteps = [...tx.steps]
      .filter((s) => s.success)
      .sort((a, b) => PROVISION_PIPELINE.indexOf(a.step) - PROVISION_PIPELINE.indexOf(b.step))
      .reverse();

    let allRolledBack = true;

    for (const step of completedSteps) {
      try {
        await this._revertStep(step.step, tx.workspaceId, resourceMap);
        this.logger.info(`Rolled back step: ${step.step}`, {
          source: "provision-rollback",
          transactionId: tx.id,
          workspaceId: tx.workspaceId,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`Failed to rollback step ${step.step}: ${message}`, {
          source: "provision-rollback",
          transactionId: tx.id,
          workspaceId: tx.workspaceId,
        });
        allRolledBack = false;
      }
    }

    // Mark the transaction as rolled back (or failed if rollback itself failed)
    await this.transactionManager.updateStatus(
      tx.id,
      allRolledBack ? "rolled_back" : "failed",
    );

    return allRolledBack;
  }

  /**
   * Revert a single provision step.
   * Each step type knows how to undo itself.
   * All destructive operations include workspace scoping.
   */
  private async _revertStep(step: ProvisionStep, workspaceId: string, resourceMap?: ProvisionResourceMap): Promise<void> {
    switch (step) {
      case "validate_request":
        // Validation has no side effects — nothing to revert
        break;

      case "create_workspace":
        await this._revertCreateWorkspace(workspaceId);
        break;

      case "install_blueprint":
        await this._revertInstallBlueprint(workspaceId, resourceMap);
        break;

      case "seed_data":
        await this._revertSeedData(workspaceId, resourceMap);
        break;

      case "insert_theme":
        await this._revertInsertTheme(workspaceId, resourceMap);
        break;

      case "insert_fonts":
        // Fonts are stored with workspace-relative keys — handled in resource map
        await this._revertSiteContentKeys(resourceMap);
        break;

      case "insert_default_media":
        await this._revertInsertMedia(workspaceId, resourceMap);
        break;

      case "insert_analytics_defaults":
        await this._revertInsertAnalyticsDefaults(workspaceId, resourceMap);
        break;

      case "run_health_check":
        // Health check has no side effects — nothing to revert
        break;

      case "workspace_ready":
        // Status transition is undone by deleting/reverting the workspace
        break;
    }
  }

  // ─── Step-specific revert logic ─────────────────────────────────────────

  /**
   * Revert workspace creation by deleting the workspace entity key.
   * This is inherently workspace-scoped via the key pattern.
   */
  private async _revertCreateWorkspace(workspaceId: string): Promise<void> {
    const { error } = await this.db
      .from("site_content")
      .delete()
      .eq("key", `workspace:${workspaceId}:entity`);
    if (error) throw this.normalizeError("site_content", "rollback.workspace", error, { workspaceId });
  }

  /**
   * Revert blueprint installation by deleting only the resources that were
   * created during this session, tracked by the resource map.
   * If no resource map is available, scopes by workspace key prefix.
   */
  private async _revertInstallBlueprint(workspaceId: string, resourceMap?: ProvisionResourceMap): Promise<void> {
    // Remove provision logs scoped to this workspace
    const { error } = await this.db
      .from("site_content")
      .delete()
      .like("key", `provision:log:${workspaceId}:%`);
    if (error) this.logger.warn("Failed to remove provision logs during rollback", {
      source: "provision-rollback",
      workspaceId,
    });

    // Remove page blocks by resource map or session-scoped
    await this._deleteScopedPageBlocks(resourceMap);

    // Remove menu items by resource map
    await this._deleteScopedMenuItems(resourceMap);

    // Remove gallery images by resource map
    await this._deleteScopedGalleryImages(resourceMap);

    // Remove personality profiles by resource map
    await this._deleteScopedPersonalityProfiles(resourceMap);

    // Remove CMS data keys by resource map
    await this._revertSiteContentKeys(resourceMap);
  }

  /**
   * Revert seed data (navigation, business settings, SEO).
   * Uses resource map for precise cleanup.
   */
  private async _revertSeedData(workspaceId: string, resourceMap?: ProvisionResourceMap): Promise<void> {
    if (resourceMap?.siteContentKeys && resourceMap.siteContentKeys.length > 0) {
      await this._revertSiteContentKeys(resourceMap);
    }

    // Remove navigation scoped to workspace
    const { error } = await this.db
      .from("site_content")
      .delete()
      .eq("key", `navigation:${workspaceId}`);
    if (error) this.logger.warn("Failed to remove navigation during rollback", {
      source: "provision-rollback",
      workspaceId,
    });
  }

  /**
   * Revert theme installation. Theme data is cleaned up as part of
   * workspace deletion (_revertCreateWorkspace), so this step is a no-op.
   * In a future multi-tenant implementation, this would delete
   * workspace-scoped theme settings.
   */
  private async _revertInsertTheme(workspaceId: string, resourceMap?: ProvisionResourceMap): Promise<void> {
    if (resourceMap && resourceMap.themeInstalled) {
      this.logger.info("Theme was installed during this session — will be cleaned up by workspace deletion", {
        source: "provision-rollback",
        workspaceId,
      });
    }
    // Theme cleanup is handled by workspace entity deletion
  }

  /**
   * Revert media insertion scoped to the resource map.
   */
  private async _revertInsertMedia(workspaceId: string, resourceMap?: ProvisionResourceMap): Promise<void> {
    if (resourceMap?.mediaFileIds && resourceMap.mediaFileIds.length > 0) {
      // Batch delete media files in a single round-trip
      const { error } = await this.db
        .from("media_files")
        .delete()
        .in("id", resourceMap.mediaFileIds);
      if (error) this.logger.warn("Failed to batch delete media files during rollback", {
        source: "provision-rollback",
        count: resourceMap.mediaFileIds.length,
      });
    } else {
      // Fallback: delete media folders scoped to workspace session
      const { error } = await this.db
        .from("site_content")
        .delete()
        .like("key", `media_folder:${workspaceId}:%`);
      if (error) this.logger.warn("Failed to remove media folders during rollback", {
        source: "provision-rollback",
        workspaceId,
      });
    }
  }

  /**
   * Revert analytics defaults by removing workspace-scoped key.
   */
  private async _revertInsertAnalyticsDefaults(workspaceId: string, resourceMap?: ProvisionResourceMap): Promise<void> {
    const key = `analytics_defaults:${workspaceId}`;
    const { error } = await this.db
      .from("site_content")
      .delete()
      .eq("key", key);
    if (error) this.logger.warn(`Failed to remove analytics defaults during rollback`, {
      source: "provision-rollback",
    });
  }

  // ─── Scoped delete helpers ───────────────────────────────────────────────

  /**
   * Delete page blocks by resource map IDs using batch delete.
   */
  private async _deleteScopedPageBlocks(resourceMap?: ProvisionResourceMap): Promise<void> {
    if (resourceMap?.pageBlockIds && resourceMap.pageBlockIds.length > 0) {
      const { error } = await this.db
        .from("page_blocks")
        .delete()
        .in("id", resourceMap.pageBlockIds);
      if (error) this.logger.warn("Failed to batch delete page blocks", {
        source: "provision-rollback",
        count: resourceMap.pageBlockIds.length,
      });
      this.logger.info(`Rolled back ${resourceMap.pageBlockIds.length} page block(s)`);
    }
  }

  /**
   * Delete menu items by resource map IDs using batch delete.
   */
  private async _deleteScopedMenuItems(resourceMap?: ProvisionResourceMap): Promise<void> {
    if (resourceMap?.menuItemIds && resourceMap.menuItemIds.length > 0) {
      const { error } = await this.db
        .from("menu_items")
        .delete()
        .in("id", resourceMap.menuItemIds);
      if (error) this.logger.warn("Failed to batch delete menu items", {
        source: "provision-rollback",
        count: resourceMap.menuItemIds.length,
      });
      this.logger.info(`Rolled back ${resourceMap.menuItemIds.length} menu item(s)`);
    }
  }

  /**
   * Delete gallery images by resource map IDs using batch delete.
   */
  private async _deleteScopedGalleryImages(resourceMap?: ProvisionResourceMap): Promise<void> {
    if (resourceMap?.galleryImageIds && resourceMap.galleryImageIds.length > 0) {
      const { error } = await this.db
        .from("gallery_images")
        .delete()
        .in("id", resourceMap.galleryImageIds);
      if (error) this.logger.warn("Failed to batch delete gallery images", {
        source: "provision-rollback",
        count: resourceMap.galleryImageIds.length,
      });
      this.logger.info(`Rolled back ${resourceMap.galleryImageIds.length} gallery image(s)`);
    }
  }

  /**
   * Delete personality profiles by resource map keys using batch delete.
   */
  private async _deleteScopedPersonalityProfiles(resourceMap?: ProvisionResourceMap): Promise<void> {
    if (resourceMap?.personalityKeys && resourceMap.personalityKeys.length > 0) {
      const { error } = await this.db
        .from("personality_profiles")
        .delete()
        .in("key", resourceMap.personalityKeys);
      if (error) this.logger.warn("Failed to batch delete personality profiles", {
        source: "provision-rollback",
        count: resourceMap.personalityKeys.length,
      });
      this.logger.info(`Rolled back ${resourceMap.personalityKeys.length} personality profile(s)`);
    }
  }

  /**
   * Delete site content keys from the resource map using batch delete.
   */
  private async _revertSiteContentKeys(resourceMap?: ProvisionResourceMap): Promise<void> {
    if (!resourceMap?.siteContentKeys || resourceMap.siteContentKeys.length === 0) return;

    const { error } = await this.db
      .from("site_content")
      .delete()
      .in("key", resourceMap.siteContentKeys);
    if (error) this.logger.warn("Failed to batch delete site_content keys", {
      source: "provision-rollback",
      count: resourceMap.siteContentKeys.length,
    });
    this.logger.info(`Rolled back ${resourceMap.siteContentKeys.length} site_content key(s)`);
  }
}
