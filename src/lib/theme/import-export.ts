/**
 * NAMA Theme Engine — import / export.
 *
 * Round-trips a `ThemeDocument` to/from a portable JSON file.
 * Defensive on the read side: an export from a future engine version is
 * accepted as long as the shape is parseable; unknown fields are ignored.
 */
import { z } from "zod";
import { DEFAULT_KNOBS, DEFAULT_DOCUMENT } from "./defaults";
import type { ThemeDocument } from "./types";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const baseSchema = z.object({
  primary: hex,
  secondary: hex,
  accent: hex,
  background: hex,
  foreground: hex,
  textSecondary: hex,
  textTertiary: hex,
  success: hex.optional(),
  warning: hex.optional(),
  danger: hex.optional(),
  info: hex.optional(),
});

const knobsSchema = z.object({
  radiusBase: z.string().optional(),
  glassOpacity: z.number().min(0).max(1).optional(),
  glassBlur: z.number().min(0).max(80).optional(),
  glassSaturation: z.number().min(0).max(3).optional(),
  shadowOpacity: z.number().min(0).max(1).optional(),
  shadowRadius: z.number().min(0).max(200).optional(),
  gradientAngle: z.number().min(0).max(360).optional(),
  gradientOpacity: z.number().min(0).max(1).optional(),
  motionDuration: z.number().min(0).max(2000).optional(),
  hoverScale: z.number().min(0.5).max(2).optional(),
  pressScale: z.number().min(0.5).max(2).optional(),
  borderOpacity: z.number().min(0).max(1).optional(),
  fontFamily: z.string().optional(),
});

const docSchema = z.object({
  version: z.literal(1),
  presetId: z.string().optional(),
  name: z.string().optional(),
  base: baseSchema,
  knobs: knobsSchema.default({}),
});

export const themeDocumentSchema = docSchema;

/** Stable JSON for clipboard / file download. */
export function exportThemeDocument(doc: ThemeDocument): string {
  return JSON.stringify(doc, null, 2);
}

/** Parse + validate a user-supplied theme JSON. Throws on invalid input. */
export function importThemeDocument(json: string): ThemeDocument {
  const parsed = JSON.parse(json) as unknown;
  const result = docSchema.parse(parsed);
  return {
    ...result,
    knobs: { ...DEFAULT_KNOBS, ...result.knobs },
  };
}

/** Triggers a browser download for the given theme document. */
export function downloadThemeDocument(doc: ThemeDocument, filename?: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([exportThemeDocument(doc)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? `nama-theme-${doc.presetId ?? "custom"}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Duplicates a theme document with a new name; clears preset linkage. */
export function duplicateThemeDocument(doc: ThemeDocument, newName?: string): ThemeDocument {
  return {
    ...doc,
    presetId: undefined,
    name: newName ?? `${doc.name ?? "Theme"} (copy)`,
  };
}

/** Returns the engine's built-in default document. */
export function resetThemeDocument(): ThemeDocument {
  return JSON.parse(JSON.stringify(DEFAULT_DOCUMENT)) as ThemeDocument;
}
