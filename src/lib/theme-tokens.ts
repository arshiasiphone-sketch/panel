/**
 * Legacy theme-tokens module — DELEGATES to the NAMA Theme Engine.
 *
 * Kept as a thin compatibility layer so any third-party / generated code that
 * still imports `themeSettingsToCss`, `hexToOklch`, `contrastForeground`,
 * `LANDING_THEME_CLASS`, etc. continues to work. New code should import from
 * `@/lib/theme` directly.
 */
import { themeRowToDocument } from "./theme/bridge";
import { tokensToCss, LANDING_THEME_CLASS as ENGINE_CLASS } from "./theme/css-vars";
import { deriveTokens } from "./theme/derive";
import type { ThemeSettings } from "./cms";

export { hexToOklch, contrastForeground } from "./theme/color";
export const LANDING_THEME_CLASS = ENGINE_CLASS;

/** Legacy input shape (still used by older callers). */
export type CmsThemeInput = {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  text_secondary_color: string;
  text_tertiary_color: string;
  border_radius: string;
  glass_opacity: number;
};

/**
 * Builds the CSS rule for a legacy CMS theme input. Now powered by the engine,
 * so the emitted variables cover the full token system (shadows, motion,
 * gradients, glass, typography), not just colors.
 */
export function themeSettingsToCss(
  theme: CmsThemeInput,
  scope = `.${LANDING_THEME_CLASS}`,
): string {
  const row = theme as unknown as ThemeSettings;
  const doc = themeRowToDocument(row);
  const tokens = deriveTokens(doc);
  return tokensToCss(tokens, scope);
}
