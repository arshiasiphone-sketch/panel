/**
 * NAMA Theme Engine — color utilities.
 *
 * Pure functions. No CSS variable knowledge here — this module only knows
 * about color spaces. Reused by `derive.ts`, contrast checks, and any tool
 * (admin UI, import/export) that needs to validate user input.
 */
import type { HexColor } from "./types";

/** Light foreground on dark surfaces. */
export const LIGHT_FG = "oklch(0.984 0.003 247.858)";
/** Dark foreground on light surfaces. */
export const DARK_FG = "oklch(0.129 0.042 264.695)";

function parseHex(hex: HexColor): [number, number, number] | null {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1], 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Converts a 6-digit hex to an `oklch(L C H)` string. */
export function hexToOklch(hex: HexColor): string {
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

  if (C < 0.0001) return `oklch(${L.toFixed(4)} 0 0)`;
  return `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(3)})`;
}

/** Hex → linear RGB tuple in [0,1]. */
export function hexToRgb(hex: HexColor): { r: number; g: number; b: number } {
  const rgb = parseHex(hex) ?? [0, 0, 0];
  return { r: rgb[0], g: rgb[1], b: rgb[2] };
}

/** Relative luminance (WCAG). */
export function relativeLuminance(hex: HexColor): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map(srgbToLinear) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Picks a readable foreground oklch token for text/icons on top of `hex`. */
export function contrastForeground(hex: HexColor): string {
  return relativeLuminance(hex) > 0.179 ? DARK_FG : LIGHT_FG;
}

/** WCAG contrast ratio between two hex colors. */
export function contrastRatio(a: HexColor, b: HexColor): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Hex → `rgba(r, g, b, alpha)` for inline tints when needed. */
export function hexToRgba(hex: HexColor, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Builds an oklch `color-mix` expression. Used everywhere derived tones are
 * needed (hover/active, surface elevation, dividers, etc.) so consumers never
 * hardcode lighter/darker shades.
 */
export function mix(a: string, b: string, percent: number): string {
  const clamped = Math.max(0, Math.min(100, percent));
  return `color-mix(in oklch, ${a} ${clamped}%, ${b})`;
}
