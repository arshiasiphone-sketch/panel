/**
 * Theme presets — complete visual identities for the NAMA Theme Engine.
 *
 * Each preset is a complete `ThemeDocument`: base palette + knobs that
 * drive shadow opacity, glass blur, motion duration, hover scale, gradient
 * angle, radius, etc. The engine derives every downstream token from these
 * inputs (no manual lighter/darker variants kept in the preset).
 *
 * IMPORTANT: Radius is NOT changed between presets — all presets inherit
 * radius from ThemeEngine defaults. Only glass, shadow, gradient, hover,
 * opacity, and color properties change between presets.
 *
 * Backward-compatible exports (`THEME_PRESETS`, `toThemePatch`,
 * `matchActivePreset`, `PRESET_SWATCH_KEYS`, `ExtendedThemeSettings`,
 * `getPresetVisualTokens`) preserve the existing admin / DB integration.
 */
import { DEFAULT_KNOBS } from "./theme/defaults";
import { applyDocumentToRow } from "./theme/bridge";
import type { ThemeDocument, ThemeKnobs, ThemeBase } from "./theme/types";
import type { ThemeSettings } from "./cms";

export type ThemePreset = {
  id: string;
  name: string;
  nameEn: string;

  /** Short description shown below the name. */
  description: string;

  /** The complete theme document this preset represents. */
  document: ThemeDocument;

  /* Legacy fields preserved so existing UI keeps working without changes. */
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

type PresetBlueprint = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  base: ThemeBase;
  knobs?: Partial<ThemeKnobs>;
  /** Optional muted/surface overrides used by legacy swatches. */
  legacy?: {
    muted?: string;
    surface?: string;
  };
};

/**
 * The eight canonical NAMA presets.
 *
 * Each preset carries its own glass, shadow, and gradient personality.
 * Radius is inherited from ThemeEngine defaults — never overridden here.
 */
const BLUEPRINTS: readonly PresetBlueprint[] = [
  /* ───────── 1. Cappuccino ☕ ───────── */
  {
    id: "cappuccino",
    name: "کاپوچینو",
    nameEn: "Cappuccino",
    description: "گرم و صمیمی، مناسب کافه و رستوران",
    base: {
      primary: "#8B5E3C",
      secondary: "#A67C52",
      accent: "#D4A373",
      background: "#FFF8F1",
      foreground: "#2F241E",
      textSecondary: "#6B5B4D",
      textTertiary: "#9C8A78",
      success: "#2E7D32",
      warning: "#D97706",
      danger: "#DC2626",
      info: "#2563EB",
    },
    knobs: {
      glassOpacity: 0.16,
      glassBlur: 14,
      glassSaturation: 1.4,
      shadowOpacity: 0.18,
      shadowRadius: 28,
      gradientAngle: 135,
      motionDuration: 240,
      hoverScale: 1.035,
      pressScale: 0.97,
      borderOpacity: 0.22,
    },
    legacy: { muted: "#F3ECE5", surface: "#FFFFFF" },
  },

  /* ───────── 2. Emerald (زمرد) ───────── */
  {
    id: "emerald",
    name: "زمرد",
    nameEn: "Emerald",
    description: "طبیعی و تازه، مناسب سلامت و طبیعت",
    base: {
      primary: "#174C3C",
      secondary: "#1E6B52",
      accent: "#4CAF7A",
      background: "#F4FBF8",
      foreground: "#18322B",
      textSecondary: "#3D6B5A",
      textTertiary: "#7BA69A",
      success: "#16A34A",
      warning: "#D97706",
      danger: "#DC2626",
      info: "#0284C7",
    },
    knobs: {
      glassOpacity: 0.12,
      glassBlur: 16,
      glassSaturation: 1.5,
      shadowOpacity: 0.14,
      shadowRadius: 26,
      gradientAngle: 140,
      motionDuration: 260,
      hoverScale: 1.04,
      pressScale: 0.97,
      borderOpacity: 0.18,
    },
    legacy: { muted: "#EDF6F2", surface: "#FFFFFF" },
  },

  /* ───────── 3. Royal (رویال) ───────── */
  {
    id: "royal",
    name: "رویال",
    nameEn: "Royal",
    description: "مدرن و حرفه‌ای، مناسب استارتاپ و فناوری",
    base: {
      primary: "#1F3A8A",
      secondary: "#2D55C7",
      accent: "#4F8BFF",
      background: "#F7F9FD",
      foreground: "#14213D",
      textSecondary: "#4B5563",
      textTertiary: "#8896AB",
      success: "#16A34A",
      warning: "#F59E0B",
      danger: "#DC2626",
      info: "#3B82F6",
    },
    knobs: {
      glassOpacity: 0.1,
      glassBlur: 18,
      glassSaturation: 1.6,
      shadowOpacity: 0.2,
      shadowRadius: 30,
      gradientAngle: 130,
      motionDuration: 200,
      hoverScale: 1.03,
      pressScale: 0.97,
      borderOpacity: 0.2,
    },
    legacy: { muted: "#EEF3FA", surface: "#FFFFFF" },
  },

  /* ───────── 4. Luxury Wine (شرابی لوکس) ───────── */
  {
    id: "luxury-wine",
    name: "شرابی لوکس",
    nameEn: "Luxury Wine",
    description: "لوکس و مجلل، مناسب برندهای سطح بالا",
    base: {
      primary: "#6E2137",
      secondary: "#8E3A50",
      accent: "#D4AF37",
      background: "#FCF8F9",
      foreground: "#31161E",
      textSecondary: "#6B4952",
      textTertiary: "#A88490",
      success: "#16A34A",
      warning: "#D97706",
      danger: "#DC2626",
      info: "#7C3AED",
    },
    knobs: {
      glassOpacity: 0.14,
      glassBlur: 20,
      glassSaturation: 1.5,
      shadowOpacity: 0.22,
      shadowRadius: 34,
      gradientAngle: 125,
      motionDuration: 220,
      hoverScale: 1.03,
      pressScale: 0.97,
      borderOpacity: 0.24,
    },
    legacy: { muted: "#F5ECEF", surface: "#FFFFFF" },
  },

  /* ───────── 5. Black Edition (مشکی مینیمال) ───────── */
  {
    id: "black-edition",
    name: "مشکی مینیمال",
    nameEn: "Black Edition",
    description: "مینیمال و مدرن، مناسب طراحی‌های ساده و شیک",
    base: {
      primary: "#18181B",
      secondary: "#27272A",
      accent: "#F4B400",
      background: "#FAFAFA",
      foreground: "#18181B",
      textSecondary: "#52525B",
      textTertiary: "#A1A1AA",
      success: "#16A34A",
      warning: "#F59E0B",
      danger: "#DC2626",
      info: "#3B82F6",
    },
    knobs: {
      glassOpacity: 0.06,
      glassBlur: 12,
      glassSaturation: 1.2,
      shadowOpacity: 0.12,
      shadowRadius: 24,
      gradientAngle: 180,
      motionDuration: 180,
      hoverScale: 1.02,
      pressScale: 0.98,
      borderOpacity: 0.14,
    },
    legacy: { muted: "#F4F4F5", surface: "#FFFFFF" },
  },

  /* ───────── 6. Sunset (غروب) ───────── */
  {
    id: "sunset",
    name: "غروب",
    nameEn: "Sunset",
    description: "پر انرژی و گرم، مناسب برندهای خلاق و هنری",
    base: {
      primary: "#D94841",
      secondary: "#E8655E",
      accent: "#F4A261",
      background: "#FFF8F6",
      foreground: "#3D2320",
      textSecondary: "#7C5550",
      textTertiary: "#B89490",
      success: "#16A34A",
      warning: "#F59E0B",
      danger: "#B93833",
      info: "#3B82F6",
    },
    knobs: {
      glassOpacity: 0.14,
      glassBlur: 18,
      glassSaturation: 1.5,
      shadowOpacity: 0.18,
      shadowRadius: 30,
      gradientAngle: 135,
      motionDuration: 220,
      hoverScale: 1.04,
      pressScale: 0.97,
      borderOpacity: 0.22,
    },
    legacy: { muted: "#F7ECE9", surface: "#FFFFFF" },
  },

  /* ───────── 7. Ocean (اقیانوس) ───────── */
  {
    id: "ocean",
    name: "اقیانوس",
    nameEn: "Ocean",
    description: "آرامش‌بخش و مطمئن، مناسب برندهای خدماتی",
    base: {
      primary: "#0F4C81",
      secondary: "#1A6BB5",
      accent: "#5DA9E9",
      background: "#F4F9FC",
      foreground: "#173042",
      textSecondary: "#476A80",
      textTertiary: "#8AA8BC",
      success: "#16A34A",
      warning: "#F59E0B",
      danger: "#DC2626",
      info: "#0EA5E9",
    },
    knobs: {
      glassOpacity: 0.1,
      glassBlur: 16,
      glassSaturation: 1.4,
      shadowOpacity: 0.16,
      shadowRadius: 28,
      gradientAngle: 145,
      motionDuration: 220,
      hoverScale: 1.03,
      pressScale: 0.97,
      borderOpacity: 0.18,
    },
    legacy: { muted: "#EAF3F9", surface: "#FFFFFF" },
  },

  /* ───────── 8. Slate (اسلیت) ───────── */
  {
    id: "slate",
    name: "اسلیت",
    nameEn: "Slate",
    description: "مودبانه و جدی، مناسب برندهای شرکتی و رسمی",
    base: {
      primary: "#374151",
      secondary: "#4B5563",
      accent: "#06B6D4",
      background: "#F9FAFB",
      foreground: "#111827",
      textSecondary: "#6B7280",
      textTertiary: "#9CA3AF",
      success: "#16A34A",
      warning: "#F59E0B",
      danger: "#DC2626",
      info: "#06B6D4",
    },
    knobs: {
      glassOpacity: 0.08,
      glassBlur: 14,
      glassSaturation: 1.3,
      shadowOpacity: 0.1,
      shadowRadius: 22,
      gradientAngle: 160,
      motionDuration: 180,
      hoverScale: 1.02,
      pressScale: 0.98,
      borderOpacity: 0.16,
    },
    legacy: { muted: "#F3F4F6", surface: "#FFFFFF" },
  },
] as const;

/* ─────────── Legacy helper builders ─────────── */

function buildLegacyShadow(base: ThemeBase, opacity: number, radius: number): string {
  const hex = base.primary.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `0 10px ${radius * 1.4}px rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function buildLegacyButtonGlow(base: ThemeBase, opacity: number, radius: number): string {
  const hex = base.primary.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `0 0 ${radius * 1.5}px rgba(${r}, ${g}, ${b}, ${Math.min(1, opacity + 0.1)})`;
}

function buildHeroOverlay(base: ThemeBase, opacity: number): string {
  const hex = base.primary.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function buildInputFocusRing(base: ThemeBase): string {
  const hex = base.primary.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.4)`;
}

function blueprintToPreset(b: PresetBlueprint): ThemePreset {
  const knobs: ThemeKnobs = { ...DEFAULT_KNOBS, ...(b.knobs ?? {}) };
  const document: ThemeDocument = {
    version: 1,
    presetId: b.id,
    name: b.nameEn,
    base: b.base,
    knobs,
  };
  const op = knobs.shadowOpacity ?? DEFAULT_KNOBS.shadowOpacity;
  const radius = knobs.shadowRadius ?? DEFAULT_KNOBS.shadowRadius;

  return {
    id: b.id,
    name: b.name,
    nameEn: b.nameEn,
    description: b.description,
    document,

    primary: b.base.primary,
    secondary: b.base.secondary,
    accent: b.base.accent,
    background: b.base.background,
    surface: b.legacy?.surface ?? "#FFFFFF",
    foreground: b.base.foreground,
    text: b.base.foreground,
    muted: b.legacy?.muted ?? b.base.textSecondary,
    success: b.base.success ?? "#16A34A",
    warning: b.base.warning ?? "#F59E0B",
    destructive: b.base.danger ?? "#DC2626",

    glassOpacity: knobs.glassOpacity ?? DEFAULT_KNOBS.glassOpacity,
    glassBlur: knobs.glassBlur ?? DEFAULT_KNOBS.glassBlur,
    borderOpacity: knobs.borderOpacity ?? DEFAULT_KNOBS.borderOpacity,
    buttonRadius: knobs.radiusBase ?? DEFAULT_KNOBS.radiusBase,
    cardRadius: knobs.radiusBase ?? DEFAULT_KNOBS.radiusBase,
    shadow: buildLegacyShadow(b.base, op, radius),
    buttonGlow: buildLegacyButtonGlow(b.base, op, radius),
    gradientStart: b.base.primary,
    gradientEnd: b.base.accent,
    heroOverlay: buildHeroOverlay(b.base, knobs.glassOpacity ?? DEFAULT_KNOBS.glassOpacity),
    sectionDividerOpacity: knobs.borderOpacity ?? DEFAULT_KNOBS.borderOpacity,
    inputFocusRing: buildInputFocusRing(b.base),
  };
}

export const THEME_PRESETS: readonly ThemePreset[] = BLUEPRINTS.map(blueprintToPreset);

/** Extended theme settings (legacy alias kept for downstream callers). */
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
 * Maps a preset to the full row patch (legacy columns + `tokens` JSONB +
 * `preset_id` + `name`). This is the primary path used by the admin presets
 * card — applying a preset now propagates the complete visual identity.
 */
export function toThemePatch(preset: ThemePreset): Partial<ThemeSettings> & {
  tokens: ThemeDocument;
  preset_id: string | null;
  name: string | null;
} {
  return applyDocumentToRow(preset.document);
}

/** Legacy preset visual-token getter kept for any callers still using it. */
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

/** Six swatch keys shown on each preset card. */
export const PRESET_SWATCH_KEYS: readonly (keyof Pick<
  ThemePreset,
  "primary" | "accent" | "background" | "surface" | "foreground" | "secondary"
>)[] = ["primary", "accent", "background", "surface", "foreground", "secondary"];

/**
 * Normalize a hex color string for comparison.
 */
function normalizeColor(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Detect which preset (if any) matches a stored theme.
 *
 * When `preset_id` is present we use it as a fast lookup, but then verify the
 * core colors still match. If the user has diverged from the preset (e.g. by
 * manually editing a color field), we return `null` so the UI shows
 * "✨ Custom Theme" instead of incorrectly showing the old preset as active.
 */
export function matchActivePreset(
  theme: PresetWritableTheme & { preset_id?: string | null },
): ThemePreset | null {
  if (theme.preset_id) {
    const direct = THEME_PRESETS.find((p) => p.id === theme.preset_id);
    if (direct) {
      // Verify the core colors still match the preset
      // If the user edited any color manually, the preset is no longer "active"
      const equal =
        normalizeColor(direct.primary) === normalizeColor(theme.primary_color) &&
        normalizeColor(direct.secondary) === normalizeColor(theme.secondary_color) &&
        normalizeColor(direct.accent) === normalizeColor(theme.accent_color) &&
        normalizeColor(direct.background) === normalizeColor(theme.background_color) &&
        normalizeColor(direct.text) === normalizeColor(theme.text_color);
      if (equal) return direct;
      // Colors diverged — treat as custom theme
      return null;
    }
  }

  // Legacy fallback: compare by color values
  const norm = (s: string): string => s.trim().toLowerCase();
  for (const preset of THEME_PRESETS) {
    const equal =
      norm(preset.primary) === norm(theme.primary_color) &&
      norm(preset.secondary) === norm(theme.secondary_color) &&
      norm(preset.accent) === norm(theme.accent_color) &&
      norm(preset.background) === norm(theme.background_color) &&
      norm(preset.text) === norm(theme.text_color);
    if (equal) return preset;
  }
  return null;
}
