/**
 * NAMA Platform — Provision Seeder.
 *
 * Seeds initial data into a workspace from a blueprint definition.
 * The seeder handles media folder structure creation and any other
 * initial data setup that needs to happen during provisioning.
 *
 * All seeding is DATA-driven — it reads from the blueprint definition,
 * never from hardcoded values.
 */

import { BaseRepository, type RepositoryDependencies } from "@/lib/repositories/base";
import type { Blueprint, BlueprintMediaFolder } from "./types";

export interface SeedResults {
  /** Media folders created. */
  mediaFolders: number;
  /** Font configuration applied. */
  fontsConfigured: boolean;
  /** Analytics defaults applied. */
  analyticsConfigured: boolean;
}

export class ProvisionSeeder extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  /**
   * Seed initial data from a blueprint into the workspace.
   * Also updates the resource map with any site content keys created.
   *
   * @param blueprint - The blueprint definition (DATA).
   * @param workspaceId - The target workspace ID.
   * @param resourceMap - Optional resource map to track created resources.
   * @returns Summary of what was seeded.
   */
  async seed(
    blueprint: Blueprint,
    workspaceId: string,
    resourceMap?: import("./session-context").ProvisionResourceMap,
  ): Promise<SeedResults> {
    const results: SeedResults = {
      mediaFolders: 0,
      fontsConfigured: false,
      analyticsConfigured: false,
    };

    // 1. Seed media folder structure
    if (blueprint.mediaFolderStructure.length > 0) {
      results.mediaFolders = await this._seedMediaFolders(blueprint.mediaFolderStructure, workspaceId, resourceMap);
    }

    // 2. Seed font configuration
    if (blueprint.fonts) {
      results.fontsConfigured = await this._seedFonts(blueprint);
    }

    // 3. Seed analytics defaults
    if (blueprint.analytics) {
      results.analyticsConfigured = await this._seedAnalytics(blueprint);
    }

    this.logger.info(`Provision seeding complete for workspace ${workspaceId}`, {
      source: "provision-seeder",
      ...results,
    });

    return results;
  }

  /**
   * Create media folder structure from blueprint definition.
   * Each folder path is created as a site_content entry describing it.
   */
  /**
   * Seed only media folders. Called as a separate step in the pipeline.
   * Updates the resource map with site content keys created.
   */
  async seedMedia(
    blueprint: Blueprint,
    workspaceId: string,
    resourceMap?: import("./session-context").ProvisionResourceMap,
  ): Promise<number> {
    const count = await this._seedMediaFolders(blueprint.mediaFolderStructure, workspaceId, resourceMap);
    this.logger.info(`Seeded ${count} media folder(s) for workspace ${workspaceId}`, {
      source: "provision-seeder",
      mediaFolders: count,
    });
    return count;
  }

  /**
   * Create media folder structure from blueprint definition.
   * Each folder path is created as a site_content entry describing it.
   * Uses workspace-scoped keys to ensure isolation.
   */
  private async _seedMediaFolders(
    folders: BlueprintMediaFolder[],
    workspaceId: string,
    resourceMap?: import("./session-context").ProvisionResourceMap,
  ): Promise<number> {
    if (folders.length === 0) return 0;

    // Batch-check which folder keys already exist — single round-trip
    const folderKeys = folders.map((f) => `media_folder:${workspaceId}:${f.path}`);

    // Direct batch query via db for existing keys
    const { data: existingRows } = await this.db
      .from("site_content")
      .select("key")
      .in("key", folderKeys);

    const existingKeys = new Set(
      (existingRows ?? []).map((r: Record<string, unknown>) => r.key as string),
    );

    let count = 0;
    for (const folder of folders) {
      const folderKey = `media_folder:${workspaceId}:${folder.path}`;
      if (existingKeys.has(folderKey)) continue; // Idempotent

      const { error } = await this.db.from("site_content").upsert({
        key: folderKey,
        value: {
          path: folder.path,
          workspaceId,
          description: folder.description,
          createdAt: new Date().toISOString(),
        } as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      });

      if (error) throw this.normalizeError("site_content", "seedMediaFolder", error, {
        folderPath: folder.path,
      });

      if (resourceMap) {
        resourceMap.siteContentKeys.push(folderKey);
      }
      count++;
    }

    return count;
  }

  /**
   * Seed font configuration into site_content.
   * Font configuration is stored as site_content with key "fonts".
   */
  private async _seedFonts(blueprint: Blueprint): Promise<boolean> {
    const fontKey = "fonts_config";

    const { data: existing } = await this.db
      .from("site_content")
      .select("key")
      .eq("key", fontKey)
      .maybeSingle();

    if (existing) return true; // Already configured

    const { error } = await this.db.from("site_content").upsert({
      key: fontKey,
      value: {
        body: blueprint.fonts.body,
        heading: blueprint.fonts.heading,
        importGoogleFonts: blueprint.fonts.importGoogleFonts,
        imports: blueprint.fonts.imports ?? [],
      } as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    });

    if (error) throw this.normalizeError("site_content", "seedFonts", error);
    return true;
  }

  /**
   * Seed analytics configuration into site_content.
   */
  private async _seedAnalytics(blueprint: Blueprint): Promise<boolean> {
    const analyticsKey = "analytics_defaults";

    const { data: existing } = await this.db
      .from("site_content")
      .select("key")
      .eq("key", analyticsKey)
      .maybeSingle();

    if (existing) return true; // Already configured

    const { error } = await this.db.from("site_content").upsert({
      key: analyticsKey,
      value: {
        enabled: blueprint.analytics.enabled,
        provider: blueprint.analytics.provider ?? "supabase",
      } as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    });

    if (error) throw this.normalizeError("site_content", "seedAnalytics", error);
    return true;
  }
}
