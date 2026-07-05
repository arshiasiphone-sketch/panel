/**
 * NAMA Platform — Blueprint Loader.
 *
 * Loads blueprint definitions from the registry.
 * Provides caching and resolution logic for fetching blueprints
 * by slug, version, or latest.
 */

import type { Blueprint } from "../types";
import type { BlueprintRegistry } from "./registry";
import { getCache } from "@/lib/core/repository-cache";

export interface LoaderDependencies {
  registry: BlueprintRegistry;
}

export class BlueprintLoader {
  private readonly registry: BlueprintRegistry;

  constructor(deps: LoaderDependencies) {
    this.registry = deps.registry;
  }

  /**
   * Load a blueprint by slug, optionally specifying a version.
   * If no version is specified, the latest published version is returned.
   *
   * Blueprints are DATA — this just loads the data definition.
   */
  async load(slug: string, version?: string): Promise<Blueprint | null> {
    const cacheKey = version ? `${slug}:${version}` : `${slug}:latest`;
    const cache = getCache();
    return cache.getOrFetch("blueprints", cacheKey, async () => {
      if (version) {
        // Load a specific version
        const blueprint = await this.registry.getByVersion(slug, version);
        if (!blueprint) {
          return null;
        }
        return blueprint;
      }

      // Load the latest published version
      const latest = await this.registry.getLatest(slug);
      if (!latest) {
        return null;
      }
      return latest;
    });
  }

  /**
   * Load a blueprint by slug and version, throwing if not found.
   */
  async loadOrThrow(slug: string, version?: string): Promise<Blueprint> {
    const blueprint = await this.load(slug, version);
    if (!blueprint) {
      const versionStr = version ?? "latest";
      throw new Error(`Blueprint not found: ${slug}@${versionStr}`);
    }
    return blueprint;
  }

  /**
   * Check if a blueprint exists (slug + optional version).
   */
  async exists(slug: string, version?: string): Promise<boolean> {
    const bp = await this.load(slug, version);
    return bp !== null;
  }

  /**
   * List all available blueprint slugs with their latest version info.
   */
  async listAvailable() {
    return this.registry.listBlueprints();
  }

  /**
   * List all versions of a specific blueprint.
   */
  async listVersions(slug: string) {
    return this.registry.listVersions(slug);
  }
}
