/**
 * NAMA Theme Engine — CMS bridge.
 *
 * Maps between the Supabase `theme_settings` row (legacy color columns +
 * new `tokens` JSONB) and the engine's `ThemeDocument`.
 *
 * The bridge is forgiving by design:
 *   - Legacy rows (no `tokens` column) still produce a complete document by
 *     populating `base` from the color columns and using default knobs.
 *   - Rows with `tokens` JSONB take precedence: that JSONB IS a `ThemeDocument`.
 *   - On write, we update BOTH the legacy color columns AND the `tokens`
 *     JSONB so older clients still see a usable palette.
 */
import type { ThemeSettings } from "../cms";
import { DEFAULT_BASE, DEFAULT_KNOBS } from "./defaults";
import type { ThemeBase, ThemeDocument } from "./types";

type LegacyAwareRow = ThemeSettings & {
  tokens?: unknown;
  preset_id?: string | null;
  name?: string | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Reads a `theme_settings` row and returns the canonical `ThemeDocument`. */
export function themeRowToDocument(row: ThemeSettings | null | undefined): ThemeDocument {
  const r = (row ?? {}) as LegacyAwareRow;

  const baseFromColumns: ThemeBase = {
    primary: r.primary_color ?? DEFAULT_BASE.primary,
    secondary: r.secondary_color ?? DEFAULT_BASE.secondary,
    accent: r.accent_color ?? DEFAULT_BASE.accent,
    background: r.background_color ?? DEFAULT_BASE.background,
    foreground: r.text_color ?? DEFAULT_BASE.foreground,
    textSecondary: r.text_secondary_color ?? DEFAULT_BASE.textSecondary,
    textTertiary: r.text_tertiary_color ?? DEFAULT_BASE.textTertiary,
  };

  // If the row already carries a tokens document, trust it as the source of
  // truth — but always reconcile `base` with the legacy color columns so a
  // direct edit to one of those still propagates.
  if (isRecord(r.tokens) && r.tokens.version === 1 && isRecord(r.tokens.base)) {
    const stored = r.tokens as unknown as ThemeDocument;
    return {
      version: 1,
      presetId: r.preset_id ?? stored.presetId,
      name: r.name ?? stored.name,
      base: { ...stored.base, ...baseFromColumns },
      knobs: { ...DEFAULT_KNOBS, ...stored.knobs },
    };
  }

  // Legacy row: build a document from columns + a few rescued knobs.
  return {
    version: 1,
    presetId: r.preset_id ?? undefined,
    name: r.name ?? undefined,
    base: baseFromColumns,
    knobs: {
      ...DEFAULT_KNOBS,
      radiusBase: r.border_radius ?? DEFAULT_KNOBS.radiusBase,
      glassOpacity:
        typeof r.glass_opacity === "number" ? r.glass_opacity : DEFAULT_KNOBS.glassOpacity,
    },
  };
}

/** Builds the row patch (legacy columns + `tokens` JSONB) for a document. */
export function applyDocumentToRow(doc: ThemeDocument): Partial<ThemeSettings> & {
  tokens: ThemeDocument;
  preset_id: string | null;
  name: string | null;
} {
  return {
    primary_color: doc.base.primary,
    secondary_color: doc.base.secondary,
    accent_color: doc.base.accent,
    background_color: doc.base.background,
    text_color: doc.base.foreground,
    text_secondary_color: doc.base.textSecondary,
    text_tertiary_color: doc.base.textTertiary,
    border_radius: doc.knobs.radiusBase ?? DEFAULT_KNOBS.radiusBase,
    glass_opacity: doc.knobs.glassOpacity ?? DEFAULT_KNOBS.glassOpacity,
    tokens: doc,
    preset_id: doc.presetId ?? null,
    name: doc.name ?? null,
  };
}
