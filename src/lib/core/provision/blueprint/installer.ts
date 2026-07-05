/**
 * NAMA Platform — Blueprint Installer.
 *
 * Installs a blueprint definition into a workspace using existing repositories.
 * The Blueprint Installer is a PURE ORCHESTRATOR — it delegates ALL data access
 * to the Repositories layer. It never calls `this.db.from(...)` directly.
 *
 * Architecture:
 *   BlueprintInstaller → Repositories → Providers → Database
 *
 * Backward Compatible: All public methods and signatures remain unchanged.
 * Internal implementation now delegates to the repository layer.
 *
 * @deprecated Use the Command Pattern in steps.ts instead.
 *   Kept for backward compatibility with any existing code that imports
 *   BlueprintInstaller directly. The Command Pattern (createStepRegistry)
 *   is the preferred way to install blueprints going forward.
 *
 * ENTERPRISE HARDENING:
 * - ZERO direct database access — delegates everything to repositories
 * - Uses ProvisionResourceMap for workspace-safe rollback tracking
 * - All operations are idempotent via repository-level existence checks
 */

import { BaseRepository, type RepositoryDependencies } from "@/lib/repositories/base";
import type { ProvisionResourceMap } from "../session-context";
import type { Blueprint } from "../types";
import type { Repositories } from "@/lib/repositories/factory";
import { createRepositories } from "@/lib/repositories/factory";

export class BlueprintInstaller extends BaseRepository {
  /** Lazily-created repository instances. */
  private _repos: Repositories | null = null;

  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  /** Get or create the shared repository instances. */
  private get repos(): Repositories {
    if (!this._repos) {
      this._repos = createRepositories({
        database: this.db,
        storage: this.storage,
        auth: this.auth,
        realtime: this.realtime,
        workspace: this.workspace,
        logger: this.logger,
      });
    }
    return this._repos;
  }

  /**
   * Install a complete blueprint into the workspace.
   * Delegates ALL data access to the repositories.
   * Tracks all created resource IDs in the resource map for safe rollback.
   *
   * @returns Updated resource map with all created resource IDs,
   *          plus backward-compatible stats.
   */
  async install(
    blueprint: Blueprint,
    workspaceId: string,
    resourceMap: ProvisionResourceMap,
  ): Promise<ProvisionResourceMap & { pages: number; blocks: number; navigation: number }> {
    const log = await this.repos.siteContent.getProvisionLog(workspaceId, blueprint.slug, blueprint.version);

    // Install pages and blocks via PagesRepository
    if (!log.entities.includes("pages")) {
      const result = await this.repos.pages.installBlueprintPages(blueprint.pages, blueprint.blocks, resourceMap);
      resourceMap.pageBlockIds.push(...result.blockIds);
      log.entities.push("pages");
    }

    // Install navigation via SiteContentRepository
    if (!log.entities.includes("navigation")) {
      const navKey = await this.repos.siteContent.installBlueprintNavigation(blueprint.navigation, workspaceId, resourceMap);
      if (navKey) {
        resourceMap.navigationKey = navKey;
        log.entities.push("navigation");
      }
    }

    // Install menu items via MenuRepository
    if (!log.entities.includes("menus") && blueprint.menus.length > 0) {
      await this.repos.menu.installBlueprintMenuItems(blueprint.menus, resourceMap);
      log.entities.push("menus");
    }

    // Install gallery images via GalleryRepository
    if (!log.entities.includes("gallery") && blueprint.gallery.length > 0) {
      await this.repos.gallery.installBlueprintGallery(blueprint.gallery, resourceMap);
      log.entities.push("gallery");
    }

    // Install personality profiles via PersonalityRepository
    if (!log.entities.includes("personalities") && blueprint.personalitySettings.length > 0) {
      await this.repos.personality.installBlueprintPersonalities(blueprint.personalitySettings, resourceMap);
      log.entities.push("personalities");
    }

    // Install CMS data (business settings, SEO)
    if (!log.entities.includes("cms_data")) {
      await this.repos.siteContent.installBlueprintBusinessSettings(blueprint.businessSettings, workspaceId, resourceMap);
      await this.repos.siteContent.installBlueprintSEO(
        { title: blueprint.seo.title, description: blueprint.seo.description, ogImage: blueprint.seo.ogImage },
        workspaceId,
        resourceMap,
      );
      log.entities.push("cms_data");
    }

    // Install analytics config
    if (!log.entities.includes("analytics")) {
      await this.repos.siteContent.installBlueprintAnalytics(blueprint.analytics, workspaceId, resourceMap);
      log.entities.push("analytics");
    }

    // Save provision log
    await this.repos.siteContent.saveProvisionLog(workspaceId, blueprint.slug, blueprint.version, log);

    const stats = {
      pages: resourceMap.pageBlockIds.length,
      blocks: resourceMap.pageBlockIds.length,
      navigation: blueprint.navigation.length > 0 ? 1 : 0,
    };

    this.logger.info(
      `Blueprint installed: ${blueprint.slug} v${blueprint.version} into workspace ${workspaceId}`,
      {
        source: "blueprint-installer",
        ...stats,
        menus: resourceMap.menuItemIds.length,
        gallery: resourceMap.galleryImageIds.length,
        siteContentKeys: resourceMap.siteContentKeys.length,
      },
    );

    return { ...resourceMap, ...stats };
  }
}
