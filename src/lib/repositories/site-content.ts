/**
 * Site content repository — encapsulates site_content table operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { siteContentValueSchema } from "@/lib/cms-schemas";
import { DEFAULT_WORKSPACE_ID } from "@/lib/constants";

type SiteContentRow = Database["public"]["Tables"]["site_content"]["Row"];

export type SiteContentMap = Record<string, Record<string, unknown>>;

const SELECT_COLUMNS = "key,value,updated_at" as const;

export class SiteContentRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async getAll(): Promise<SiteContentMap> {
    try {
      const { data, error } = await this.withWorkspace(
        this.db.from<SiteContentRow>("site_content").select(SELECT_COLUMNS),
      );
      if (error) throw error;
      const out: SiteContentMap = {};
      for (const row of data ?? []) out[row.key] = (row.value as Record<string, unknown>) ?? {};

      // Merge in the global (default-workspace-owned) keys — hero, contact,
      // social, meta, etc. — so the landing page always has them regardless of
      // which workspace context is active. Workspace-scoped rows take
      // precedence on key collisions. Skipped when no workspace is resolved
      // (the unfiltered query already returns everything) or when the active
      // workspace is the default (it owns these keys outright).
      if (this.workspaceId && this.workspaceId !== DEFAULT_WORKSPACE_ID) {
        const { data: globals, error: globalsError } = await this.db
          .from<SiteContentRow>("site_content")
          .select(SELECT_COLUMNS)
          .eq("workspace_id", DEFAULT_WORKSPACE_ID);
        if (globalsError) throw globalsError;
        for (const row of globals ?? []) {
          if (!(row.key in out)) out[row.key] = (row.value as Record<string, unknown>) ?? {};
        }
      }

      return out;
    } catch (err) {
      throw this.normalizeError("site_content", "getAll", err);
    }
  }

  async getByKey(key: string): Promise<SiteContentRow | null> {
    try {
      const { data, error } = await this.withWorkspace(
        this.db.from<SiteContentRow>("site_content").select(SELECT_COLUMNS).eq("key", key),
      ).maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      throw this.normalizeError("site_content", "getByKey", err, { key });
    }
  }

  /**
   * Install navigation entries as a workspace-scoped site_content key.
   */
  async installBlueprintNavigation(
    navigation: Array<{ title: string; path: string; sortOrder: number }>,
    workspaceId: string,
    resourceMap?: import("../core/provision/session-context").ProvisionResourceMap,
  ): Promise<string | null> {
    if (navigation.length === 0) return null;

    const navKey = `navigation:${workspaceId}`;

    const { data: existing } = await this.withWorkspace(
      this.db.from("site_content").select("key").eq("key", navKey),
    ).maybeSingle();

    if (existing) return null; // Already exists

    const navValue = navigation
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((entry, index) => ({
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: entry.title,
        path: entry.path,
        sort_order: index,
        visible: true,
      }));

    const upsertNav = { key: navKey, value: { items: navValue } as Record<string, unknown>, updated_at: new Date().toISOString() };
    if (this.workspaceId) (upsertNav as Record<string, unknown>).workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertNav);

    if (error) throw this.normalizeError("site_content", "installBlueprintNavigation", error);

    if (resourceMap) {
      resourceMap.siteContentKeys.push(navKey);
    }
    return navKey;
  }

  /**
   * Install SEO defaults with workspace-scoped key.
   */
  async installBlueprintSEO(
    seo: { title: string; description: string; ogImage?: string },
    workspaceId: string,
    resourceMap?: import("../core/provision/session-context").ProvisionResourceMap,
  ): Promise<string[]> {
    const seoKey = `seo_defaults:${workspaceId}`;
    const { data: existing } = await this.withWorkspace(
      this.db.from("site_content").select("key").eq("key", seoKey),
    ).maybeSingle();

    if (existing) return [];

    const upsertSeo = { key: seoKey, value: { title: seo.title, description: seo.description, ogImage: seo.ogImage ?? "" } as Record<string, unknown>, updated_at: new Date().toISOString() };
    if (this.workspaceId) (upsertSeo as Record<string, unknown>).workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertSeo);

    if (error) throw this.normalizeError("site_content", "installBlueprintSEO", error);

    if (resourceMap) {
      resourceMap.siteContentKeys.push(seoKey);
    }
    return [seoKey];
  }

  /**
   * Install analytics config with workspace-scoped key.
   */
  async installBlueprintAnalytics(
    analytics: { enabled: boolean; provider?: string },
    workspaceId: string,
    resourceMap?: import("../core/provision/session-context").ProvisionResourceMap,
  ): Promise<string[]> {
    const analyticsKey = `analytics_config:${workspaceId}`;
    const { data: existing } = await this.withWorkspace(
      this.db.from("site_content").select("key").eq("key", analyticsKey),
    ).maybeSingle();

    if (existing) return [];

    const upsertAnalytics = { key: analyticsKey, value: { enabled: analytics.enabled, provider: analytics.provider ?? "supabase" } as Record<string, unknown>, updated_at: new Date().toISOString() };
    if (this.workspaceId) (upsertAnalytics as Record<string, unknown>).workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertAnalytics);

    if (error) throw this.normalizeError("site_content", "installBlueprintAnalytics", error);

    if (resourceMap) {
      resourceMap.siteContentKeys.push(analyticsKey);
    }
    return [analyticsKey];
  }

  /**
   * Install business settings with workspace-scoped key.
   */
  async installBlueprintBusinessSettings(
    settings: Record<string, unknown>,
    workspaceId: string,
    resourceMap?: import("../core/provision/session-context").ProvisionResourceMap,
  ): Promise<string[]> {
    if (Object.keys(settings).length === 0) return [];

    const businessKey = `business_settings:${workspaceId}`;
    const { data: existing } = await this.withWorkspace(
      this.db.from("site_content").select("key").eq("key", businessKey),
    ).maybeSingle();

    if (existing) return [];

    const upsertBusiness = { key: businessKey, value: settings, updated_at: new Date().toISOString() };
    if (this.workspaceId) (upsertBusiness as Record<string, unknown>).workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertBusiness);

    if (error) throw this.normalizeError("site_content", "installBlueprintBusinessSettings", error);

    if (resourceMap) {
      resourceMap.siteContentKeys.push(businessKey);
    }
    return [businessKey];
  }

  /**
   * Get a provision log entry.
   */
  async getProvisionLog(
    workspaceId: string,
    blueprintSlug: string,
    blueprintVersion: string,
  ): Promise<{ entities: string[] }> {
    const key = `provision:log:${workspaceId}:${blueprintSlug}:${blueprintVersion}`;
    try {
      const { data } = await this.withWorkspace(
        this.db.from("site_content").select("value").eq("key", key),
      ).maybeSingle();
      if (data?.value) {
        return data.value as unknown as { entities: string[] };
      }
    } catch (err) {
      this.logger.warn(`Failed to fetch provision log for ${key}`, {
        source: "site-content",
        provisionKey: key,
        cause: err instanceof Error ? err.message : String(err),
      });
    }
    return { entities: [] };
  }

  /**
   * Save a provision log entry.
   */
  async saveProvisionLog(
    workspaceId: string,
    blueprintSlug: string,
    blueprintVersion: string,
    log: { entities: string[] },
  ): Promise<void> {
    const key = `provision:log:${workspaceId}:${blueprintSlug}:${blueprintVersion}`;
    const upsertLog = {
      key,
      value: { workspaceId, blueprintSlug, blueprintVersion, provisionedAt: new Date().toISOString(), entities: log.entities } as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    };
    if (this.workspaceId) (upsertLog as Record<string, unknown>).workspace_id = this.workspaceId;
    const { error } = await this.db.from("site_content").upsert(upsertLog);
    if (error) throw this.normalizeError("site_content", "saveProvisionLog", error);
  }

  /**
   * Delete a site_content entry by key.
   */
  async deleteByKey(key: string): Promise<void> {
    try {
      const { error } = await this.withWorkspace(
        this.db.from("site_content").delete().eq("key", key),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("site_content", "deleteByKey", err, { key });
    }
  }

  async upsert(key: string, value: Record<string, unknown>): Promise<void> {
    try {
      this.validateOrThrow(siteContentValueSchema, value, "site_content");
      const upsertItem = { key, value };
      if (this.workspaceId) (upsertItem as Record<string, unknown>).workspace_id = this.workspaceId;
      const { error } = await this.db.from("site_content").upsert(upsertItem as Record<string, unknown>);
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("site_content", "upsert", err, { key });
    }
  }

  /**
   * Batch delete multiple site_content entries by keys.
   * Uses a single database round-trip instead of N individual deletes.
   *
   * @param keys - Array of keys to delete
   */
  async batchDeleteByKeys(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    try {
      const { error } = await this.withWorkspace(
        this.db.from("site_content").delete().in("key", keys),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("site_content", "batchDeleteByKeys", err, { count: keys.length });
    }
  }

  /**
   * Batch get multiple site_content entries by keys.
   * Returns a map of key -> row for all matching entries.
   * Non-existent keys are omitted from the result.
   *
   * @param keys - Array of keys to fetch
   * @returns Map of key -> SiteContentRow for found entries
   */
  async batchGetByKeys(keys: string[]): Promise<Map<string, SiteContentRow>> {
    if (keys.length === 0) return new Map();
    try {
      const { data, error } = await this.withWorkspace(
        this.db.from<SiteContentRow>("site_content").select(SELECT_COLUMNS).in("key", keys),
      );
      if (error) throw error;

      const result = new Map<string, SiteContentRow>();
      for (const row of data ?? []) {
        result.set(row.key, row);
      }
      return result;
    } catch (err) {
      throw this.normalizeError("site_content", "batchGetByKeys", err, { count: keys.length });
    }
  }
}
