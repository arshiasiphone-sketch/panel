/**
 * NAMA Platform — Blueprint Registry.
 *
 * Stores and retrieves blueprint definitions.
 * Blueprints are DATA — they are stored in site_content like workspace entities.
 * Each blueprint is stored with a key pattern: blueprint:{slug}:{version}
 *
 * The registry is the single source of truth for available blueprints.
 * All blueprints are DATA, never hardcoded React components.
 */

import { BaseRepository, type RepositoryDependencies } from "@/lib/repositories/base";
import { blueprintSchema, type BlueprintInput } from "../validation";
import type { Blueprint } from "../types";

// ─── Storage key pattern ─────────────────────────────────────────────────────

const BP_KEY_PREFIX = "blueprint:";

function blueprintKey(slug: string, version: string): string {
  return `${BP_KEY_PREFIX}${slug}:${version}`;
}

function blueprintIndexKey(): string {
  return `${BP_KEY_PREFIX}index`;
}

// ─── Registry entry ──────────────────────────────────────────────────────────

/** Lightweight index entry for listing available blueprints. */
export interface BlueprintIndexEntry {
  slug: string;
  version: string;
  name: string;
  description: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Complete blueprint index stored in site_content. */
export interface BlueprintIndex {
  entries: BlueprintIndexEntry[];
}

// ─── Registry ────────────────────────────────────────────────────────────────

export class BlueprintRegistry extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  /**
   * Register a new blueprint (store its definition).
   * If a blueprint with the same slug+version exists, it is overwritten.
   */
  async register(blueprintInput: BlueprintInput): Promise<Blueprint> {
    // Parse with Zod to apply defaults for all fields
    const parsed = blueprintSchema.parse(blueprintInput);
    const now = new Date().toISOString();
    const meta = parsed.metadata ?? { createdBy: "system", tags: [], isPublished: true, createdAt: now, updatedAt: now };
    const metaUpdated = { ...meta, updatedAt: now, createdAt: meta.createdAt ?? now };
    const fullBlueprint = { ...parsed, metadata: metaUpdated } as unknown as Blueprint;

    // Store the full blueprint definition
    const key = blueprintKey(fullBlueprint.slug, fullBlueprint.version);
    const { error } = await this.db
      .from("site_content")
      .upsert({
        key,
        value: fullBlueprint as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      });
    if (error) throw this.normalizeError("site_content", "blueprint.register", error, { key });

    // Update the index
    await this._updateIndex(fullBlueprint);

    this.logger.info(`Blueprint registered: ${fullBlueprint.slug} v${fullBlueprint.version}`, {
      source: "blueprint",
    });

    return fullBlueprint;
  }

  /**
   * Get a blueprint by slug and version.
   * Returns null if not found.
   */
  async getByVersion(slug: string, version: string): Promise<Blueprint | null> {
    try {
      const key = blueprintKey(slug, version);
      const { data, error } = await this.db
        .from("site_content")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;

      const result = blueprintSchema.safeParse(data.value);
      return (result.success ? result.data : null) as Blueprint | null;
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.getByVersion", err, { slug, version });
    }
  }

  /**
   * Get the latest version of a blueprint by slug.
   * Returns null if no blueprint with that slug exists.
   */
  async getLatest(slug: string): Promise<Blueprint | null> {
    try {
      const index = await this._loadIndex();
      const entries = index.entries
        .filter((e) => e.slug === slug && e.isPublished)
        .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));

      if (entries.length === 0) return null;
      return this.getByVersion(slug, entries[0].version);
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.getLatest", err, { slug });
    }
  }

  /**
   * List all available blueprint slugs with their latest versions.
   */
  async listBlueprints(): Promise<BlueprintIndexEntry[]> {
    try {
      const index = await this._loadIndex();
      // Return only the latest version per slug
      const latest = new Map<string, BlueprintIndexEntry>();
      for (const entry of index.entries) {
        if (!entry.isPublished) continue;
        const existing = latest.get(entry.slug);
        if (!existing || entry.version.localeCompare(existing.version, undefined, { numeric: true }) > 0) {
          latest.set(entry.slug, entry);
        }
      }
      return Array.from(latest.values());
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.listBlueprints", err);
    }
  }

  /**
   * List all versions of a specific blueprint slug.
   */
  async listVersions(slug: string): Promise<BlueprintIndexEntry[]> {
    try {
      const index = await this._loadIndex();
      return index.entries
        .filter((e) => e.slug === slug)
        .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.listVersions", err, { slug });
    }
  }

  /**
   * Delete a blueprint version from the registry.
   */
  async delete(slug: string, version: string): Promise<void> {
    try {
      const key = blueprintKey(slug, version);
      const { error } = await this.db
        .from("site_content")
        .delete()
        .eq("key", key);
      if (error) throw error;

      // Remove from index
      const index = await this._loadIndex();
      index.entries = index.entries.filter(
        (e) => !(e.slug === slug && e.version === version),
      );
      await this._saveIndex(index);

      this.logger.info(`Blueprint deleted: ${slug} v${version}`, { source: "blueprint" });
    } catch (err) {
      throw this.normalizeError("site_content", "blueprint.delete", err, { slug, version });
    }
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  /**
   * Load the blueprint index from storage.
   * Returns an empty index if none exists.
   */
  private async _loadIndex(): Promise<BlueprintIndex> {
    try {
      const key = blueprintIndexKey();
      const { data, error } = await this.db
        .from("site_content")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      if (!data) return { entries: [] };

      return (data.value as BlueprintIndex) ?? { entries: [] };
    } catch {
      return { entries: [] };
    }
  }

  /**
   * Save the blueprint index to storage.
   */
  private async _saveIndex(index: BlueprintIndex): Promise<void> {
    const key = blueprintIndexKey();
    const { error } = await this.db
      .from("site_content")
      .upsert({
        key,
        value: index as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      });
    if (error) throw this.normalizeError("site_content", "blueprint.saveIndex", error);
  }

  /**
   * Update the index with a newly registered blueprint.
   */
  private async _updateIndex(blueprint: Blueprint): Promise<void> {
    const index = await this._loadIndex();

    // Remove any existing entry for this exact slug+version
    index.entries = index.entries.filter(
      (e) => !(e.slug === blueprint.slug && e.version === blueprint.version),
    );

    // Add the new entry
    const entry: BlueprintIndexEntry = {
      slug: blueprint.slug,
      version: blueprint.version,
      name: blueprint.name,
      description: blueprint.description,
      category: blueprint.category,
      isPublished: blueprint.metadata.isPublished,
      createdAt: blueprint.metadata.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    index.entries.push(entry);

    await this._saveIndex(index);
  }
}
