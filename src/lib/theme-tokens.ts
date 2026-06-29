/** CMS theme_settings color fields consumed by the token bridge. */
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

/** Light foreground on dark surfaces (matches design-system default). */
const LIGHT_FG = "oklch(0.984 0.003 247.858)";
/** Dark foreground on light surfaces (matches design-system default). */
const DARK_FG = "oklch(0.129 0.042 264.695)";

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1], 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Converts a 6-digit hex color to an `oklch(L C H)` string for Tailwind v4 tokens. */
export function hexToOklch(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return "oklch(0 0 0)";

  const [r, g, b] = rgb.map(srgbToLinear) as [number, number, number];

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bOk = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + bOk * bOk);
  let H = (Math.atan2(bOk, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  if (C < 0.0001) {
    return `oklch(${L.toFixed(4)} 0 0)`;
  }
  return `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(3)})`;
}

function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map(srgbToLinear) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Picks a readable foreground oklch token for text/icons on top of `hex`. */
export function contrastForeground(hex: string): string {
  return relativeLuminance(hex) > 0.179 ? DARK_FG : LIGHT_FG;
}

/** CSS scope for CMS theme — only descendants receive Tailwind token overrides. */
export const LANDING_THEME_CLASS = "cms-theme";

/**
 * Maps CMS theme_settings to Tailwind v4 design tokens under `scope`.
 * CMS hex colors are converted to oklch; derived tokens use color-mix in oklch space.
 */
export function themeSettingsToCss(
  theme: CmsThemeInput,
  scope = `.${LANDING_THEME_CLASS}`,
): string {
  const textSecondary = theme.text_secondary_color ?? "#9a8a78";
  const textTertiary = theme.text_tertiary_color ?? "#c9b89e";
  const primary = hexToOklch(theme.primary_color);
  const secondary = hexToOklch(theme.secondary_color);
  const accent = hexToOklch(theme.accent_color);
  const background = hexToOklch(theme.background_color);
  const foreground = hexToOklch(theme.text_color);
  const textSecondaryOklch = hexToOklch(textSecondary);
  const textTertiaryOklch = hexToOklch(textTertiary);

  const primaryFg = contrastForeground(theme.primary_color);
  const secondaryFg = contrastForeground(theme.secondary_color);
  const accentFg = contrastForeground(theme.accent_color);

  return `${scope} {
  --radius: ${theme.border_radius};
  --glass-opacity: ${theme.glass_opacity};
  --primary: ${primary};
  --primary-foreground: ${primaryFg};
  --secondary: ${secondary};
  --secondary-foreground: ${secondaryFg};
  --accent: ${accent};
  --accent-foreground: ${accentFg};
  --background: ${background};
  --foreground: ${foreground};
  --text-secondary: ${textSecondaryOklch};
  --text-tertiary: ${textTertiaryOklch};
  --card: color-mix(in oklch, ${background} 92%, ${foreground} 8%);
  --card-foreground: ${foreground};
  --popover: ${background};
  --popover-foreground: ${foreground};
  --muted: color-mix(in oklch, ${secondary} 35%, ${background});
  --muted-foreground: ${textSecondaryOklch};
  --border: color-mix(in oklch, ${foreground} 12%, ${background});
  --input: color-mix(in oklch, ${foreground} 15%, ${background});
  --ring: color-mix(in oklch, ${primary} 60%, ${foreground});
  --sidebar: color-mix(in oklch, ${secondary} 20%, ${background});
  --sidebar-foreground: ${foreground};
  --sidebar-primary: ${primary};
  --sidebar-primary-foreground: ${primaryFg};
  --sidebar-accent: color-mix(in oklch, ${secondary} 40%, ${background});
  --sidebar-accent-foreground: ${foreground};
  --sidebar-border: color-mix(in oklch, ${foreground} 10%, ${background});
  --sidebar-ring: color-mix(in oklch, ${primary} 50%, ${foreground});
}`.trim();
}
