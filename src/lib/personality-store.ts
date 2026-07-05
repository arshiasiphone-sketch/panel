import { useMemo } from "react";
import { PERSONALITY_PROFILES, type PersonalityProfile, type PersonalityType } from "./test-data";
import { usePersonalityProfiles } from "./cms";
import type { Database } from "@/integrations/supabase/types";

type PersonalityProfileRow = Database["public"]["Tables"]["personality_profiles"]["Row"];

const ALL_TYPES: PersonalityType[] = ["paparoch", "zhampin", "fofino", "gombak", "bedone"];

function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(212,175,55,${alpha})`;
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Merge a database row (if any) with hardcoded defaults. */
export function resolveProfile(
  type: PersonalityType,
  rows: PersonalityProfileRow[] | undefined,
): PersonalityProfile {
  const base = PERSONALITY_PROFILES[type];
  const row = rows?.find((r) => r.key === type);
  if (!row) return base;
  const color = row.color_from || base.color;
  return {
    type,
    label: row.label || base.label,
    tagline: row.tagline || base.tagline,
    description: row.description || base.description,
    traits: row.traits?.length ? row.traits : base.traits,
    drink: row.drink || base.drink,
    spot: row.spot || base.spot,
    color,
    accentColor: row.color_to || base.accentColor,
    bgColor: hexToRgba(color, 0.1),
    borderColor: hexToRgba(color, 0.25),
  };
}

export function profileToDbPatch(
  type: PersonalityType,
  patch: Partial<PersonalityProfile>,
): Partial<PersonalityProfileRow> & { key: string } {
  const out: Partial<PersonalityProfileRow> & { key: string } = { key: type };
  if (patch.label !== undefined) out.label = patch.label;
  if (patch.tagline !== undefined) out.tagline = patch.tagline;
  if (patch.description !== undefined) out.description = patch.description;
  if (patch.traits !== undefined) out.traits = patch.traits;
  if (patch.drink !== undefined) out.drink = patch.drink;
  if (patch.spot !== undefined) out.spot = patch.spot;
  if (patch.color !== undefined) out.color_from = patch.color;
  if (patch.accentColor !== undefined) out.color_to = patch.accentColor;
  return out;
}

export function defaultDbRow(type: PersonalityType, sortOrder: number): PersonalityProfileRow {
  const p = PERSONALITY_PROFILES[type];
  return {
    key: type,
    label: p.label,
    tagline: p.tagline,
    description: p.description,
    traits: p.traits,
    drink: p.drink,
    spot: p.spot,
    color_from: p.color,
    color_to: p.accentColor,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

/** React hook returning all profiles merged with database content. */
export function useResolvedProfiles(): Record<PersonalityType, PersonalityProfile> {
  const { data: rows } = usePersonalityProfiles();
  return useMemo(() => {
    const out = {} as Record<PersonalityType, PersonalityProfile>;
    ALL_TYPES.forEach((t) => {
      out[t] = resolveProfile(t, rows);
    });
    return out;
  }, [rows]);
}

export { ALL_TYPES as PERSONALITY_TYPES };
