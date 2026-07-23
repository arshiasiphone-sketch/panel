/**
 * Theme repository — encapsulates theme_settings table operations.
 * All operations are workspace-scoped. Each workspace has its own theme settings.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { themeSchema } from "@/lib/cms-schemas";
import { getCache } from "@/lib/core/repository-cache";

type ThemeRow = Database["public"]["Tables"]["theme_settings"]["Row"];
type ThemeUpdate = Database["public"]["Tables"]["theme_settings"]["Update"];

const SELECT_COLUMNS = "id,primary_color,secondary_color,accent_color,background_color,text_color,text_secondary_color,text_tertiary_color,border_radius,glass_opacity,name,preset_id,tokens,updated_at,workspace_id" as const;

export const DEFAULT_THEME_SETTINGS: Omit<ThemeRow, "id" | "workspace_id" | "updated_at"> = {
  primary_color: "#d4af37",
  secondary_color: "#0f172a",
  accent_color: "#d4af37",
  background_color: "#0a0a0a",
  text_color: "#f0e6d3",
  text_secondary_color: "#978876",
  text_tertiary_color: "#c9b89e",
  border_radius: "0.75rem",
  glass_opacity: 0.08,
  name: null,
  preset_id: null,
  tokens: null,
};

export class ThemeRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  /**
   * Build a workspace-scoped cache key for theme operations.
   * Ensures cache isolation between workspaces.
   */
  private getCacheKey(method: string): string {
    return getCache().buildCacheKey("theme_settings", method, this.workspaceId);
  }

  async get(): Promise<ThemeRow> {
    const cache = getCache();
    const fullCacheKey = this.getCacheKey("get");
    return cache.getOrFetch(fullCacheKey, async () => {
      try {
        const { data, error } = await this.withWorkspace(
          this.db
            .from<ThemeRow>("theme_settings")
            .select(SELECT_COLUMNS)
            .order("id", { ascending: true })
            .limit(1),
        ).maybeSingle();
        if (error) throw error;
        if (!data) {
          // Insert default theme for this workspace
          const insertData = {
            ...DEFAULT_THEME_SETTINGS,
            workspace_id: this.workspaceId ?? undefined,
            updated_at: new Date().toISOString(),
          } as ThemeUpdate & { workspace_id?: string | null };
          const { data: inserted } = await this.withWorkspace(
            this.db.from<ThemeRow>("theme_settings").insert(insertData as unknown as ThemeUpdate).select(),
          ).maybeSingle();
          return { ...DEFAULT_THEME_SETTINGS, ...(inserted ?? {}) } as ThemeRow;
        }
        return { ...DEFAULT_THEME_SETTINGS, ...data };
      } catch (err) {
        throw this.normalizeError("theme_settings", "get", err);
      }
    });
  }

  /**
   * Install theme settings from blueprint data.
   * Creates or updates theme settings for the current workspace.
   * Each workspace gets its own theme settings row.
   *
   * Idempotent: re-running for the same workspace updates the existing row.
   */
  async installBlueprintTheme(theme: {
    presetId: string;
    overrides?: Partial<{
      primaryColor: string; secondaryColor: string; accentColor: string;
      backgroundColor: string; textColor: string; textSecondaryColor: string;
      textTertiaryColor: string; borderRadius: string; glassOpacity: number;
    }>;
  }): Promise<void> {
    // Check if theme settings already exist for this workspace
    const { data: existing } = await this.withWorkspace(
      this.db.from<ThemeRow>("theme_settings").select("id").limit(1),
    ).maybeSingle();

    const targetId = existing?.id ?? undefined;

    const update = {
      preset_id: theme.presetId,
      updated_at: new Date().toISOString(),
      workspace_id: this.workspaceId ?? undefined,
    } as Partial<ThemeRow> & { workspace_id?: string | null };

    if (theme.overrides) {
      if (theme.overrides.primaryColor) update.primary_color = theme.overrides.primaryColor;
      if (theme.overrides.secondaryColor) update.secondary_color = theme.overrides.secondaryColor;
      if (theme.overrides.accentColor) update.accent_color = theme.overrides.accentColor;
      if (theme.overrides.backgroundColor) update.background_color = theme.overrides.backgroundColor;
      if (theme.overrides.textColor) update.text_color = theme.overrides.textColor;
      if (theme.overrides.textSecondaryColor) update.text_secondary_color = theme.overrides.textSecondaryColor;
      if (theme.overrides.textTertiaryColor) update.text_tertiary_color = theme.overrides.textTertiaryColor;
      if (theme.overrides.borderRadius) update.border_radius = theme.overrides.borderRadius;
      if (theme.overrides.glassOpacity !== undefined) update.glass_opacity = theme.overrides.glassOpacity;
    }

    // Use workspace-scoped upsert
    const upsertData = targetId ? { id: targetId, ...update } : update;
    const { error } = await this.withWorkspace(
      this.db.from("theme_settings").upsert(upsertData as unknown as ThemeUpdate),
    );
    if (error) throw this.normalizeError("theme_settings", "installBlueprintTheme", error);
    
    // Invalidate cache for this workspace after install
    if (this.workspaceId) {
      getCache().invalidateByPrefix(`theme_settings:workspace-${this.workspaceId}`);
    }
  }

  async update(patch: Partial<ThemeRow>): Promise<void> {
    try {
      this.validateOrThrow(themeSchema, patch, "theme_settings");

      const { data: existing } = await this.withWorkspace(
        this.db.from<ThemeRow>("theme_settings").select("id").limit(1),
      ).maybeSingle();

      const rowPatch = {
        ...patch,
        updated_at: new Date().toISOString(),
        workspace_id: this.workspaceId ?? undefined,
      } as Partial<ThemeRow> & { workspace_id?: string | null };

      const upsertData = existing?.id
        ? { id: existing.id, ...rowPatch }
        : rowPatch;

      const { error } = await this.withWorkspace(
        this.db.from("theme_settings").upsert(upsertData as unknown as ThemeUpdate),
      );
      if (error) throw error;

      // Invalidate cache for this workspace after mutation
      if (this.workspaceId) {
        getCache().invalidateByPrefix(`theme_settings:workspace-${this.workspaceId}`);
      }
    } catch (err) {
      throw this.normalizeError("theme_settings", "update", err);
    }
  }
}
