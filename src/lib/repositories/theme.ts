/**
 * Theme repository — encapsulates theme_settings table operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { themeSchema } from "@/lib/cms-schemas";
import { getCache } from "@/lib/core/repository-cache";

type ThemeRow = Database["public"]["Tables"]["theme_settings"]["Row"];
type ThemeUpdate = Database["public"]["Tables"]["theme_settings"]["Update"];

const SELECT_COLUMNS = "id,primary_color,secondary_color,accent_color,background_color,text_color,text_secondary_color,text_tertiary_color,border_radius,glass_opacity,name,preset_id,tokens,updated_at" as const;

export const DEFAULT_THEME_SETTINGS: ThemeRow = {
  id: 1,
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
  updated_at: new Date().toISOString(),
};

export class ThemeRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async get(): Promise<ThemeRow> {
    const cache = getCache();
    return cache.getOrFetch("theme_settings", "get", async () => {
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
          // Insert default if missing — let the database auto-generate the ID
          const { data: inserted } = await this.db
            .from<ThemeRow>("theme_settings")
            .insert({ workspace_id: this.workspaceId, ...{} } as ThemeUpdate)
            .select()
            .maybeSingle();
          return { ...DEFAULT_THEME_SETTINGS, ...(inserted ?? {}) };
        }
        return { ...DEFAULT_THEME_SETTINGS, ...data };
      } catch (err) {
        throw this.normalizeError("theme_settings", "get", err);
      }
    });
  }

  /**
   * Install theme settings from blueprint data.
   *
   * theme_settings is a GLOBAL singleton (one row, id=1 — enforced by the
   * `theme_singleton` CHECK). It is intentionally NOT workspace-scoped (it has
   * no `workspace_id` column in the deployed schema), so this must upsert the
   * singleton row directly rather than via withWorkspace(). The previous
   * implementation filtered/seeded by `workspace_id`, which threw on every
   * provision and aborted the pipeline before WORKSPACE_READY — leaving every
   * workspace stuck at `provisioning` despite its content being written.
   *
   * Idempotent: re-running upserts the same singleton row.
   */
  async installBlueprintTheme(theme: {
    presetId: string;
    overrides?: Partial<{
      primaryColor: string; secondaryColor: string; accentColor: string;
      backgroundColor: string; textColor: string; textSecondaryColor: string;
      textTertiaryColor: string; borderRadius: string; glassOpacity: number;
    }>;
  }): Promise<void> {
    // Singleton row is always id=1; reuse it if present, else create it.
    const { data: existing } = await this.db
      .from("theme_settings")
      .select("id")
      .limit(1);
    const targetId = (existing && existing[0]?.id) ?? 1;

    const update: Partial<ThemeRow> = {
      preset_id: theme.presetId,
      updated_at: new Date().toISOString(),
    };

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

    const { error } = await this.db
      .from("theme_settings")
      .upsert({ id: targetId, ...update });
    if (error) throw this.normalizeError("theme_settings", "installBlueprintTheme", error);
  }

  async update(patch: Partial<ThemeRow>): Promise<void> {
    try {
      this.validateOrThrow(themeSchema, patch, "theme_settings");
      // Fetch the first theme settings row (no hardcoded id)
      const { data: existing } = await this.withWorkspace(
        this.db.from<ThemeRow>("theme_settings").select("id").limit(1),
      ).maybeSingle();

      if (!existing) {
        throw new Error("No theme settings found to update");
      }

      const { error } = await this.db
        .from("theme_settings")
        .update(patch as ThemeUpdate)
        .eq("id", existing.id);
      if (error) throw error;

      // Invalidate cache after mutation
      getCache().invalidate("theme_settings");
    } catch (err) {
      throw this.normalizeError("theme_settings", "update", err);
    }
  }
}
