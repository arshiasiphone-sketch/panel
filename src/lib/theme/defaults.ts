/**
 * NAMA Theme Engine — default knobs.
 *
 * Sane defaults applied to every derived theme. Presets override these
 * selectively; the engine guarantees a complete token set even when only a
 * base palette is supplied (e.g. from the legacy CMS row).
 */
import type { ThemeBase, ThemeDocument, ThemeKnobs } from "./types";

export const DEFAULT_KNOBS: Required<ThemeKnobs> = {
  radiusBase: "0.75rem",
  glassOpacity: 0.08,
  glassBlur: 14,
  glassSaturation: 1.4,
  shadowOpacity: 0.18,
  shadowRadius: 28,
  gradientAngle: 135,
  gradientOpacity: 1,
  motionDuration: 220,
  hoverScale: 1.03,
  pressScale: 0.97,
  borderOpacity: 0.16,
  fontFamily: '"Vazirmatn", system-ui, sans-serif',
};

/** Default state colors when a preset omits them. */
export const DEFAULT_STATE_COLORS = {
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
  info: "#2563eb",
} as const;

/**
 * Fallback base palette — derived from the existing DB defaults so the engine
 * keeps the current look when no preset is selected and no `tokens` JSONB is
 * stored yet. Coffee-house warm scheme matching `DEFAULT_THEME_SETTINGS`.
 */
export const DEFAULT_BASE: ThemeBase = {
  primary: "#9f1239",
  secondary: "#0f172a",
  accent: "#d4af37",
  background: "#0a0a0a",
  foreground: "#f0e6d3",
  textSecondary: "#9a8a78",
  textTertiary: "#c9b89e",
  success: DEFAULT_STATE_COLORS.success,
  warning: DEFAULT_STATE_COLORS.warning,
  danger: DEFAULT_STATE_COLORS.danger,
  info: DEFAULT_STATE_COLORS.info,
};

export const DEFAULT_DOCUMENT: ThemeDocument = {
  version: 1,
  base: DEFAULT_BASE,
  knobs: DEFAULT_KNOBS,
};
