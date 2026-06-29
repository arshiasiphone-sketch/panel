/**
 * Theme presets: curated palettes that fill the existing theme form fields.
 *
 * Each preset carries the wider palette specified by design (surface, foreground,
 * muted, success, warning, destructive) for visual previews and possible future
 * expansion. The current DB stores a subset — see `toThemePatch()` — but no
 * schema change is required to use these presets today.
 *
 * Visual styling tokens control the entire visual identity beyond colors.
 */

import type { ThemeSettings } from "./cms";

export type ThemePreset = {
  id: string;
  name: string;
  nameEn: string;

  primary: string;
  secondary: string;
  accent: string;

  background: string;
  surface: string;

  foreground: string;
  text: string;
  muted: string;

  success: string;
  warning: string;
  destructive: string;

  // Visual styling tokens for premium theme engine
  glassOpacity: number;
  glassBlur: number;
  borderOpacity: number;
  buttonRadius: string;
  cardRadius: string;
  shadow: string;
  buttonGlow: string;
  gradientStart: string;
  gradientEnd: string;
  heroOverlay: string;
  sectionDividerOpacity: number;
  inputFocusRing: string;
};

export const THEME_PRESETS: readonly ThemePreset[] = [
  {
    id: "coffee",
    name: "کلاسیک قهوه‌ای",
    nameEn: "Coffee",
    primary: "#8B5E3C",
    secondary: "#A67C52",
    accent: "#D4A373",
    background: "#FFF8F0",
    surface: "#FFFFFF",
    foreground: "#2D221A",
    text: "#2D221A",
    muted: "#6B5B4D",
    success: "#2E7D32",
    warning: "#F59E0B",
    destructive: "#DC2626",
    // Visual styling tokens
    glassOpacity: 0.12,
    glassBlur: 16,
    borderOpacity: 0.24,
    buttonRadius: "1.25rem",
    cardRadius: "1.5rem",
    shadow: "0 10px 44px rgba(139, 94, 60, 0.3)",
    buttonGlow: "0 0 48px rgba(139, 94, 60, 0.4)",
    gradientStart: "#8B5E3C",
    gradientEnd: "#D4A373",
    heroOverlay: "rgba(139, 94, 60, 0.12)",
    sectionDividerOpacity: 0.12,
    inputFocusRing: "rgba(139, 94, 60, 0.4)",
  },
  {
    id: "luxury",
    name: "مشکی لوکس",
    nameEn: "Luxury Black",
    primary: "#111827",
    secondary: "#374151",
    accent: "#D4AF37",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    foreground: "#111827",
    text: "#111827",
    muted: "#6B7280",
    success: "#16A34A",
    warning: "#F59E0B",
    destructive: "#DC2626",
    // Visual styling tokens - dark luxury feel
    glassOpacity: 0.16,
    glassBlur: 24,
    borderOpacity: 0.32,
    buttonRadius: "1rem",
    cardRadius: "1.25rem",
    shadow: "0 10px 44px rgba(17, 24, 39, 0.4)",
    buttonGlow: "0 0 48px rgba(212, 175, 55, 0.3)",
    gradientStart: "#111827",
    gradientEnd: "#D4AF37",
    heroOverlay: "rgba(17, 24, 39, 0.16)",
    sectionDividerOpacity: 0.16,
    inputFocusRing: "rgba(212, 175, 55, 0.4)",
  },
  {
    id: "nature",
    name: "سبز طبیعی",
    nameEn: "Nature",
    primary: "#2E7D32",
    secondary: "#4CAF50",
    accent: "#81C784",
    background: "#F6FFF7",
    surface: "#FFFFFF",
    foreground: "#1B4332",
    text: "#1B4332",
    muted: "#5E8C61",
    success: "#2E7D32",
    warning: "#EAB308",
    destructive: "#DC2626",
    // Visual styling tokens - fresh nature feel
    glassOpacity: 0.1,
    glassBlur: 12,
    borderOpacity: 0.2,
    buttonRadius: "1.5rem",
    cardRadius: "1.75rem",
    shadow: "0 10px 44px rgba(46, 125, 50, 0.25)",
    buttonGlow: "0 0 48px rgba(46, 125, 50, 0.35)",
    gradientStart: "#2E7D32",
    gradientEnd: "#81C784",
    heroOverlay: "rgba(46, 125, 50, 0.1)",
    sectionDividerOpacity: 0.1,
    inputFocusRing: "rgba(46, 125, 50, 0.4)",
  },
  {
    id: "modern",
    name: "آبی مدرن",
    nameEn: "Modern Blue",
    primary: "#2563EB",
    secondary: "#3B82F6",
    accent: "#60A5FA",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    foreground: "#1E293B",
    text: "#1E293B",
    muted: "#64748B",
    success: "#16A34A",
    warning: "#F59E0B",
    destructive: "#DC2626",
    // Visual styling tokens - modern tech feel
    glassOpacity: 0.08,
    glassBlur: 8,
    borderOpacity: 0.16,
    buttonRadius: "0.75rem",
    cardRadius: "1rem",
    shadow: "0 10px 44px rgba(37, 99, 235, 0.3)",
    buttonGlow: "0 0 48px rgba(37, 99, 235, 0.4)",
    gradientStart: "#2563EB",
    gradientEnd: "#60A5FA",
    heroOverlay: "rgba(37, 99, 235, 0.08)",
    sectionDividerOpacity: 0.08,
    inputFocusRing: "rgba(37, 99, 235, 0.4)",
  },
  {
    id: "warm",
    name: "قرمز گرم",
    nameEn: "Warm Red",
    primary: "#C62828",
    secondary: "#E53935",
    accent: "#FF8A65",
    background: "#FFF8F7",
    surface: "#FFFFFF",
    foreground: "#3E2723",
    text: "#3E2723",
    muted: "#795548",
    success: "#16A34A",
    warning: "#F59E0B",
    destructive: "#DC2626",
    // Visual styling tokens - warm energetic feel
    glassOpacity: 0.14,
    glassBlur: 20,
    borderOpacity: 0.28,
    buttonRadius: "1.125rem",
    cardRadius: "1.375rem",
    shadow: "0 10px 44px rgba(198, 40, 40, 0.35)",
    buttonGlow: "0 0 48px rgba(198, 40, 40, 0.45)",
    gradientStart: "#C62828",
    gradientEnd: "#FF8A65",
    heroOverlay: "rgba(198, 40, 40, 0.14)",
    sectionDividerOpacity: 0.14,
    inputFocusRing: "rgba(198, 40, 40, 0.5)",
  },
] as const;

/** Extended theme settings with visual styling tokens */
export type ExtendedThemeSettings = ThemeSettings & {
  glass_blur?: number;
  border_opacity?: number;
  button_radius?: string;
  card_radius?: string;
  shadow?: string;
  button_glow?: string;
  gradient_start?: string;
  gradient_end?: string;
  hero_overlay?: string;
  section_divider_opacity?: number;
  input_focus_ring?: string;
};

/** Fields of the stored `theme_settings` row that a preset writes to. */
export type PresetWritableTheme = Pick<
  ThemeSettings,
  | "primary_color"
  | "secondary_color"
  | "accent_color"
  | "background_color"
  | "text_color"
  | "text_secondary_color"
  | "text_tertiary_color"
  | "border_radius"
  | "glass_opacity"
>;

/**
 * Map a preset's wider palette onto the DB columns the existing form persists.
 *
 *  primary_color        ← primary
 *  secondary_color      ← secondary
 *  accent_color         ← accent
 *  background_color     ← background
 *  text_color           ← text (== foreground)
 *  text_secondary_color ← muted
 *  text_tertiary_color  ← surface (used as the lightest tier today)
 *  border_radius         ← buttonRadius
 *  glass_opacity        ← glassOpacity
 */
export function toThemePatch(preset: ThemePreset): PresetWritableTheme {
  return {
    primary_color: preset.primary,
    secondary_color: preset.secondary,
    accent_color: preset.accent,
    background_color: preset.background,
    text_color: preset.text,
    text_secondary_color: preset.muted,
    text_tertiary_color: preset.surface,
    border_radius: preset.buttonRadius,
    glass_opacity: preset.glassOpacity,
  };
}

/** Map preset visual tokens to extended theme settings for CSS variable generation */
export function getPresetVisualTokens(
  preset: ThemePreset,
): Omit<ExtendedThemeSettings, keyof ThemeSettings> {
  return {
    glass_blur: preset.glassBlur,
    border_opacity: preset.borderOpacity,
    button_radius: preset.buttonRadius,
    card_radius: preset.cardRadius,
    shadow: preset.shadow,
    button_glow: preset.buttonGlow,
    gradient_start: preset.gradientStart,
    gradient_end: preset.gradientEnd,
    hero_overlay: preset.heroOverlay,
    section_divider_opacity: preset.sectionDividerOpacity,
    input_focus_ring: preset.inputFocusRing,
  };
}

/** Visible swatch order used by the preset card preview. */
export const PRESET_SWATCH_KEYS: readonly (keyof Pick<
  ThemePreset,
  "primary" | "secondary" | "accent" | "background" | "foreground" | "muted"
>)[] = ["primary", "secondary", "accent", "background", "foreground", "muted"];

/**
 * Detect which preset (if any) matches a stored theme so the active card can
 * render the selected state. Compares only the columns the preset writes to,
 * case-insensitively.
 */
export function matchActivePreset(theme: PresetWritableTheme): ThemePreset | null {
  const norm = (s: string): string => s.trim().toLowerCase();
  for (const preset of THEME_PRESETS) {
    const patch = toThemePatch(preset);
    const equal =
      norm(patch.primary_color) === norm(theme.primary_color) &&
      norm(patch.secondary_color) === norm(theme.secondary_color) &&
      norm(patch.accent_color) === norm(theme.accent_color) &&
      norm(patch.background_color) === norm(theme.background_color) &&
      norm(patch.text_color) === norm(theme.text_color) &&
      norm(patch.text_secondary_color) === norm(theme.text_secondary_color) &&
      norm(patch.text_tertiary_color) === norm(theme.text_tertiary_color) &&
      norm(patch.border_radius) === norm(theme.border_radius) &&
      patch.glass_opacity === theme.glass_opacity;
    if (equal) return preset;
  }
  return null;
}
