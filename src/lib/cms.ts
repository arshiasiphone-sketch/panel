/**
 * CMS data layer. The Admin Panel and Landing Page consume these hooks.
 * Source of truth = Lovable Cloud (Supabase). NO localStorage for CMS data.
<<<<<<< HEAD
 *
 * Refactored to use the Repository layer instead of direct Supabase calls.
 * All public exports and hook signatures are unchanged.
 */
import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { IChannel } from "@/lib/interfaces/realtime";
=======
 */
import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
import {
  beginOptimisticUpdate,
  rollbackOptimisticUpdate,
  scheduleRemoteSync,
  touchLocalCmsEdit,
  upsertById,
  removeById,
} from "@/lib/cms-sync";
<<<<<<< HEAD
import { useRepositories, getRepositories } from "@/lib/providers";
import type { Repositories } from "@/lib/providers";
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a

type TablesRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type MenuItem = TablesRow<"menu_items">;
export type GalleryImage = TablesRow<"gallery_images">;
export type EventItem = TablesRow<"events">;
export type Testimonial = TablesRow<"testimonials">;
export type PageBlock = TablesRow<"page_blocks">;
export type ThemeSettings = TablesRow<"theme_settings">;
export type SiteContentRow = TablesRow<"site_content">;
export type PersonalityProfileRow = TablesRow<"personality_profiles">;

export const QK = {
  menu: ["cms", "menu"] as const,
  gallery: ["cms", "gallery"] as const,
  events: ["cms", "events"] as const,
  testimonials: ["cms", "testimonials"] as const,
  blocks: ["cms", "blocks"] as const,
  theme: ["cms", "theme"] as const,
  site: ["cms", "site"] as const,
  personalities: ["cms", "personalities"] as const,
  pageViews: ["cms", "page-views"] as const,
  role: (uid?: string) => ["auth", "role", uid] as const,
};

/* ============== Public read hooks (no auth required) ============== */

export function useMenuItems() {
<<<<<<< HEAD
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.menu,
    queryFn: (): Promise<MenuItem[]> => repos.menu.getVisible(),
  });
}
export function useAllMenuItems() {
  const repos = useRepositories();
  return useQuery({
    queryKey: [...QK.menu, "all"],
    queryFn: (): Promise<MenuItem[]> => repos.menu.getAll(),
=======
  return useQuery({
    queryKey: QK.menu,
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}
export function useAllMenuItems() {
  return useQuery({
    queryKey: [...QK.menu, "all"],
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase.from("menu_items").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  });
}

export function useGalleryImages() {
<<<<<<< HEAD
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.gallery,
    queryFn: (): Promise<GalleryImage[]> => repos.gallery.getVisible(),
  });
}
export function useAllGalleryImages() {
  const repos = useRepositories();
  return useQuery({
    queryKey: [...QK.gallery, "all"],
    queryFn: (): Promise<GalleryImage[]> => repos.gallery.getAll(),
=======
  return useQuery({
    queryKey: QK.gallery,
    queryFn: async (): Promise<GalleryImage[]> => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}
export function useAllGalleryImages() {
  return useQuery({
    queryKey: [...QK.gallery, "all"],
    queryFn: async (): Promise<GalleryImage[]> => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  });
}

export function useEvents() {
<<<<<<< HEAD
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.events,
    queryFn: (): Promise<EventItem[]> => repos.events.getVisible(),
  });
}
export function useAllEvents() {
  const repos = useRepositories();
  return useQuery({
    queryKey: [...QK.events, "all"],
    queryFn: (): Promise<EventItem[]> => repos.events.getAll(),
=======
  return useQuery({
    queryKey: QK.events,
    queryFn: async (): Promise<EventItem[]> => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}
export function useAllEvents() {
  return useQuery({
    queryKey: [...QK.events, "all"],
    queryFn: async (): Promise<EventItem[]> => {
      const { data, error } = await supabase.from("events").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  });
}

export function useTestimonials() {
<<<<<<< HEAD
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.testimonials,
    queryFn: (): Promise<Testimonial[]> => repos.testimonials.getVisible(),
=======
  return useQuery({
    queryKey: QK.testimonials,
    queryFn: async (): Promise<Testimonial[]> => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  });
}

export function usePageBlocks() {
<<<<<<< HEAD
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.blocks,
    queryFn: (): Promise<PageBlock[]> => repos.pages.getAll(),
=======
  return useQuery({
    queryKey: QK.blocks,
    queryFn: async (): Promise<PageBlock[]> => {
      const { data, error } = await supabase.from("page_blocks").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  });
}

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  id: 1,
  primary_color: "#d4af37",
  secondary_color: "#0f172a",
  accent_color: "#d4af37",
  background_color: "#0a0a0a",
  text_color: "#f0e6d3",
  text_secondary_color: "#9a8a78",
  text_tertiary_color: "#c9b89e",
  border_radius: "0.75rem",
  glass_opacity: 0.08,
  name: null,
  preset_id: null,
  tokens: null,
  updated_at: new Date().toISOString(),
};

<<<<<<< HEAD
// Cache for fetchThemeSettings to avoid dynamic imports on every route load
let _themeRepo: import("@/lib/repositories/theme").ThemeRepository | null = null;

async function getThemeRepo(): Promise<import("@/lib/repositories/theme").ThemeRepository> {
  if (_themeRepo) return _themeRepo;
  const { createSupabaseProviders } = await import("@/lib/providers/supabase");
  const { ThemeRepository } = await import("@/lib/repositories/theme");
  _themeRepo = new ThemeRepository(createSupabaseProviders());
  return _themeRepo;
}

export async function fetchThemeSettings(): Promise<ThemeSettings> {
  const repo = await getThemeRepo();
  return repo.get();
}

export function useTheme() {
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.theme,
    queryFn: (): Promise<ThemeSettings> => repos.theme.get(),
=======
export async function fetchThemeSettings(): Promise<ThemeSettings> {
  const { data, error } = await supabase
    .from("theme_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    // Insert default if missing (auth-required, swallow if denied).
    const { data: inserted } = await supabase
      .from("theme_settings")
      .insert({ id: 1 })
      .select("*")
      .maybeSingle();
    return { ...DEFAULT_THEME_SETTINGS, ...(inserted ?? {}) };
  }
  return { ...DEFAULT_THEME_SETTINGS, ...data };
}

export function useTheme() {
  return useQuery({
    queryKey: QK.theme,
    queryFn: fetchThemeSettings,
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    staleTime: 60_000,
  });
}

export type SiteContentMap = Record<string, Record<string, unknown>>;
export function useSiteContent() {
<<<<<<< HEAD
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.site,
    queryFn: (): Promise<SiteContentMap> => repos.siteContent.getAll(),
=======
  return useQuery({
    queryKey: QK.site,
    queryFn: async (): Promise<SiteContentMap> => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      const out: SiteContentMap = {};
      for (const row of data ?? []) out[row.key] = (row.value as Record<string, unknown>) ?? {};
      return out;
    },
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  });
}

function upsertPersonalityRow(
  list: PersonalityProfileRow[] | undefined,
  row: PersonalityProfileRow,
): PersonalityProfileRow[] {
  if (!list?.length) return [row];
  const idx = list.findIndex((r) => r.key === row.key);
  if (idx < 0) return [...list, row];
  const next = [...list];
  next[idx] = { ...next[idx], ...row };
  return next;
}

type IdRow = { id: string };

/* ============== Mutations (require admin) ============== */

function makeUpsertHook<T extends { id?: string }>(
<<<<<<< HEAD
  repoKey: "menu" | "gallery" | "events" | "testimonials",
=======
  table: "menu_items" | "gallery_images" | "events" | "testimonials" | "page_blocks",
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  qk: readonly unknown[],
) {
  return function useUpsert() {
    const qc = useQueryClient();
<<<<<<< HEAD
    const repos = useRepositories();
    const repo = repos[repoKey];
    return useMutation({
      mutationFn: async (row: T) => {
        return repo.upsert(row as never) as Promise<T | null>;
=======
    return useMutation({
      mutationFn: async (row: T) => {
        const { data, error } = await supabase
          .from(table)
          .upsert(row as never)
          .select()
          .maybeSingle();
        if (error) throw error;
        return data;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
      },
      onMutate: async (row) => {
        if (!row.id)
          return { prev: undefined as T[] | undefined, prevAll: undefined as T[] | undefined };
        const optimistic = { ...(row as T & { id: string }), id: row.id } as T & { id: string };
        const { prev } = await beginOptimisticUpdate<T[]>(
          qc,
          qk,
          (list) =>
            upsertById(
              list as (T & { id: string })[] | undefined,
              optimistic as T & { id: string },
            ) as T[],
        );
        const { prev: prevAll } = await beginOptimisticUpdate<T[]>(
          qc,
          [...qk, "all"],
          (list) =>
            upsertById(
              list as (T & { id: string })[] | undefined,
              optimistic as T & { id: string },
            ) as T[],
        );
        return { prev, prevAll };
      },
      onError: (_err, _row, ctx) => {
        if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, qk, ctx.prev);
        if (ctx?.prevAll !== undefined) rollbackOptimisticUpdate(qc, [...qk, "all"], ctx.prevAll);
      },
      onSuccess: (data) => {
        if (!data?.id) return;
        touchLocalCmsEdit();
        qc.setQueryData<T[]>(qk, (list) =>
          upsertById(
            list as (T & { id: string })[] | undefined,
            data as unknown as T & { id: string },
          ),
        );
        qc.setQueryData<T[]>([...qk, "all"], (list) =>
          upsertById(
            list as (T & { id: string })[] | undefined,
            data as unknown as T & { id: string },
          ),
        );
      },
    });
  };
}
function makeDeleteHook(
<<<<<<< HEAD
  repoKey: "menu" | "gallery" | "events" | "testimonials",
=======
  table: "menu_items" | "gallery_images" | "events" | "testimonials" | "page_blocks",
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  qk: readonly unknown[],
) {
  return function useDelete() {
    const qc = useQueryClient();
<<<<<<< HEAD
    const repos = useRepositories();
    const repo = repos[repoKey];
    return useMutation({
      mutationFn: async (id: string) => {
        await repo.delete(id);
=======
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
      },
      onMutate: async (id) => {
        const { prev } = await beginOptimisticUpdate<IdRow[]>(qc, qk, (list) =>
          removeById(list, id),
        );
        const { prev: prevAll } = await beginOptimisticUpdate<IdRow[]>(qc, [...qk, "all"], (list) =>
          removeById(list, id),
        );
        return { prev, prevAll };
      },
      onError: (_err, _id, ctx) => {
        if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, qk, ctx.prev);
        if (ctx?.prevAll !== undefined) rollbackOptimisticUpdate(qc, [...qk, "all"], ctx.prevAll);
      },
      onSuccess: () => touchLocalCmsEdit(),
    });
  };
}

<<<<<<< HEAD
export const useUpsertMenuItem = makeUpsertHook<Partial<MenuItem>>("menu", QK.menu);
export const useDeleteMenuItem = makeDeleteHook("menu", QK.menu);
export const useUpsertGalleryImage = makeUpsertHook<Partial<GalleryImage>>("gallery", QK.gallery);
export const useDeleteGalleryImage = makeDeleteHook("gallery", QK.gallery);
export const useUpsertEvent = makeUpsertHook<Partial<EventItem>>("events", QK.events);
export const useDeleteEvent = makeDeleteHook("events", QK.events);
export const useUpsertTestimonial = makeUpsertHook<Partial<Testimonial>>("testimonials", QK.testimonials);
=======
export const useUpsertMenuItem = makeUpsertHook<Partial<MenuItem>>("menu_items", QK.menu);
export const useDeleteMenuItem = makeDeleteHook("menu_items", QK.menu);
export const useUpsertGalleryImage = makeUpsertHook<Partial<GalleryImage>>(
  "gallery_images",
  QK.gallery,
);
export const useDeleteGalleryImage = makeDeleteHook("gallery_images", QK.gallery);
export const useUpsertEvent = makeUpsertHook<Partial<EventItem>>("events", QK.events);
export const useDeleteEvent = makeDeleteHook("events", QK.events);
export const useUpsertTestimonial = makeUpsertHook<Partial<Testimonial>>(
  "testimonials",
  QK.testimonials,
);
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
export const useDeleteTestimonial = makeDeleteHook("testimonials", QK.testimonials);

/* Blocks: special handling — insert, update, delete, reorder */
export function useCreateBlock() {
  const qc = useQueryClient();
<<<<<<< HEAD
  const repos = useRepositories();
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  return useMutation({
    mutationFn: async (input: {
      type: string;
      data: Record<string, unknown>;
      sort_order: number;
    }) => {
<<<<<<< HEAD
      return repos.pages.create(input as never);
=======
      const { data, error } = await supabase
        .from("page_blocks")
        .insert(input as never)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    },
    onSuccess: (data) => {
      if (!data) return;
      touchLocalCmsEdit();
      qc.setQueryData<PageBlock[]>(QK.blocks, (list) => upsertById(list, data));
    },
  });
}
export function useUpdateBlock() {
  const qc = useQueryClient();
<<<<<<< HEAD
  const repos = useRepositories();
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  return useMutation({
    mutationFn: async (input: {
      id: string;
      data?: Record<string, unknown>;
      visible?: boolean;
      sort_order?: number;
    }) => {
      const { id, ...patch } = input;
<<<<<<< HEAD
      await repos.pages.update(id, patch as never);
=======
      const { error } = await supabase
        .from("page_blocks")
        .update(patch as never)
        .eq("id", id);
      if (error) throw error;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    },
    onMutate: async (input) =>
      beginOptimisticUpdate<PageBlock[]>(qc, QK.blocks, (list) => {
        if (!list) return list;
        return list.map((block) =>
          block.id === input.id
            ? { ...block, ...input, data: (input.data ?? block.data) as PageBlock["data"] }
            : block,
        );
      }),
    onError: (_err, _input, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}
export function useDeleteBlock() {
  const qc = useQueryClient();
<<<<<<< HEAD
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (id: string) => {
      await repos.pages.delete(id);
=======
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("page_blocks").delete().eq("id", id);
      if (error) throw error;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    },
    onMutate: async (id) =>
      beginOptimisticUpdate<PageBlock[]>(qc, QK.blocks, (list) => removeById(list, id)),
    onError: (_err, _id, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}
export function useReorderBlocks() {
  const qc = useQueryClient();
<<<<<<< HEAD
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await repos.pages.reorder(orderedIds);
=======
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const results = await Promise.all(
        orderedIds.map((id, idx) =>
          supabase.from("page_blocks").update({ sort_order: idx }).eq("id", id),
        ),
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    },
    onMutate: async (orderedIds) =>
      beginOptimisticUpdate<PageBlock[]>(qc, QK.blocks, (list) => {
        if (!list) return list;
        const byId = new Map(list.map((block) => [block.id, block]));
        return orderedIds
          .map((id, sort_order) => {
            const block = byId.get(id);
            return block ? { ...block, sort_order } : null;
          })
          .filter(Boolean) as PageBlock[];
      }),
    onError: (_err, _ids, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}

/* Theme + SiteContent upsert */
export function useUpdateTheme() {
  const qc = useQueryClient();
<<<<<<< HEAD
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (patch: Partial<ThemeSettings>) => {
      await repos.theme.update(patch);
=======
  return useMutation({
    mutationFn: async (patch: Partial<ThemeSettings>) => {
      const { error } = await supabase.from("theme_settings").update(patch).eq("id", 1);
      if (error) throw error;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    },
    onMutate: async (patch) =>
      beginOptimisticUpdate<ThemeSettings>(qc, QK.theme, (prev) =>
        prev ? { ...prev, ...patch } : prev,
      ),
    onError: (_err, _patch, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.theme, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}
export function useUpsertSiteContent() {
  const qc = useQueryClient();
<<<<<<< HEAD
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (input: { key: string; value: Record<string, unknown> }) => {
      await repos.siteContent.upsert(input.key, input.value);
=======
  return useMutation({
    mutationFn: async (input: { key: string; value: Record<string, unknown> }) => {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key: input.key, value: input.value as never });
      if (error) throw error;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    },
    onMutate: async (input) =>
      beginOptimisticUpdate<SiteContentMap>(qc, QK.site, (prev) => ({
        ...(prev ?? {}),
        [input.key]: input.value,
      })),
    onError: (_err, _input, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.site, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}

export function usePersonalityProfiles() {
<<<<<<< HEAD
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.personalities,
    queryFn: (): Promise<PersonalityProfileRow[]> => repos.personality.getAll(),
=======
  return useQuery({
    queryKey: QK.personalities,
    queryFn: async (): Promise<PersonalityProfileRow[]> => {
      const { data, error } = await supabase
        .from("personality_profiles")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  });
}

export function useUpdatePersonalityProfile() {
  const qc = useQueryClient();
<<<<<<< HEAD
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (input: Partial<PersonalityProfileRow> & { key: string }) => {
      const { key, ...patch } = input;
      await repos.personality.update(key, patch);
=======
  return useMutation({
    mutationFn: async (input: Partial<PersonalityProfileRow> & { key: string }) => {
      const { key, ...patch } = input;
      const { error } = await supabase
        .from("personality_profiles")
        .update(patch as never)
        .eq("key", key);
      if (error) throw error;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    },
    onMutate: async (input) =>
      beginOptimisticUpdate<PersonalityProfileRow[]>(qc, QK.personalities, (list) => {
        if (!list) return list;
        return list.map((row) => (row.key === input.key ? { ...row, ...input } : row));
      }),
    onError: (_err, _input, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.personalities, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}

export function useUpsertPersonalityProfile() {
  const qc = useQueryClient();
<<<<<<< HEAD
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (row: PersonalityProfileRow) => {
      await repos.personality.upsert(row);
=======
  return useMutation({
    mutationFn: async (row: PersonalityProfileRow) => {
      const { error } = await supabase.from("personality_profiles").upsert(row as never);
      if (error) throw error;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    },
    onMutate: async (row) =>
      beginOptimisticUpdate<PersonalityProfileRow[]>(qc, QK.personalities, (list) =>
        upsertPersonalityRow(list, row),
      ),
    onError: (_err, _row, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.personalities, ctx.prev);
    },
    onSuccess: (_data, row) => {
      touchLocalCmsEdit();
      qc.setQueryData<PersonalityProfileRow[]>(QK.personalities, (list) =>
        upsertPersonalityRow(list, row),
      );
    },
  });
}

/* ============== Page views ============== */

export type PageViewStats = { total: number; today: number };

export function usePageViewStats() {
<<<<<<< HEAD
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.pageViews,
    queryFn: (): Promise<PageViewStats> => repos.analytics.fetchPageViewStats(),
=======
  return useQuery({
    queryKey: QK.pageViews,
    queryFn: async (): Promise<PageViewStats> => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [totalRes, todayRes] = await Promise.all([
        supabase.from("page_views").select("*", { count: "exact", head: true }),
        supabase
          .from("page_views")
          .select("*", { count: "exact", head: true })
          .gte("visited_at", startOfDay.toISOString()),
      ]);
      if (totalRes.error) throw totalRes.error;
      if (todayRes.error) throw todayRes.error;
      return { total: totalRes.count ?? 0, today: todayRes.count ?? 0 };
    },
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  });
}

const PAGE_VIEW_SESSION_KEY = "cms-page-view-recorded";

export function useRecordPageView() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(PAGE_VIEW_SESSION_KEY)) return;
    sessionStorage.setItem(PAGE_VIEW_SESSION_KEY, "1");
    void import("@/lib/cms.functions").then(({ recordPageView }) =>
      recordPageView({
        data: {
          path: window.location.pathname,
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent,
        },
      }).catch(() => {
        /* silent — analytics must not break the page */
      }),
    );
  }, []);
}

/* ============== Auth ============== */
<<<<<<< HEAD
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const repos = useRepositories();
=======
import { useState } from "react";
import type { User } from "@supabase/supabase-js";

export function useUser() {
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
<<<<<<< HEAD
    repos.auth.getSession().then(({ user: u }) => {
      if (!mounted) return;
      setUser(u as unknown as User | null);
      setLoading(false);
    });
    const { data: sub } = repos.auth.onAuthStateChange((_e, session) => {
      const u = (session as { user?: User } | null)?.user ?? null;
      setUser(u ?? null);
=======
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
      setLoading(false);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
<<<<<<< HEAD
  }, [repos]);
=======
  }, []);
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  return { user, loading };
}

export function useIsAdmin(userId: string | undefined) {
<<<<<<< HEAD
  const repos = useRepositories();
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  return useQuery({
    queryKey: QK.role(userId),
    enabled: !!userId,
    queryFn: async (): Promise<boolean> => {
      if (!userId) return false;
<<<<<<< HEAD
      return repos.auth.isAdmin(userId);
=======
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    },
  });
}

/* ============== Realtime: invalidate caches on remote changes ============== */

const CMS_SYNC_CHANNEL = "cms-sync";

const CMS_SYNC_TABLES: { table: string; queryKey: readonly unknown[] }[] = [
  { table: "menu_items", queryKey: QK.menu },
  { table: "gallery_images", queryKey: QK.gallery },
  { table: "events", queryKey: QK.events },
  { table: "testimonials", queryKey: QK.testimonials },
  { table: "page_blocks", queryKey: QK.blocks },
  { table: "theme_settings", queryKey: QK.theme },
  { table: "site_content", queryKey: QK.site },
  { table: "personality_profiles", queryKey: QK.personalities },
  { table: "test_responses", queryKey: ["test", "responses"] },
  { table: "media_files", queryKey: ["media"] },
];

<<<<<<< HEAD
let cmsSyncChannel: IChannel | null = null;
let cmsSyncRefCount = 0;
let cmsSyncQueryClient: QueryClient | null = null;

function createCmsSyncChannel(repos: Repositories): IChannel {
  let channel = repos.realtime.channel(CMS_SYNC_CHANNEL);
=======
let cmsSyncChannel: RealtimeChannel | null = null;
let cmsSyncRefCount = 0;
let cmsSyncQueryClient: QueryClient | null = null;

function createCmsSyncChannel(): RealtimeChannel {
  let channel: RealtimeChannel = supabase.channel(CMS_SYNC_CHANNEL);
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  for (const { table, queryKey } of CMS_SYNC_TABLES) {
    channel = channel.on("postgres_changes", { event: "*", schema: "public", table }, () => {
      if (!cmsSyncQueryClient) return;
      scheduleRemoteSync(cmsSyncQueryClient, queryKey);
      if (table === "site_content") {
        scheduleRemoteSync(cmsSyncQueryClient, ["test", "questions"]);
      }
    });
  }
  channel.subscribe();
  return channel;
}

<<<<<<< HEAD
function acquireCmsSyncChannel(qc: QueryClient, repos: Repositories): void {
  cmsSyncQueryClient = qc;
  cmsSyncRefCount += 1;
  if (cmsSyncChannel) return;
  cmsSyncChannel = createCmsSyncChannel(repos);
=======
function acquireCmsSyncChannel(qc: QueryClient): void {
  cmsSyncQueryClient = qc;
  cmsSyncRefCount += 1;
  if (cmsSyncChannel) return;
  cmsSyncChannel = createCmsSyncChannel();
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
}

function releaseCmsSyncChannel(): void {
  cmsSyncRefCount = Math.max(0, cmsSyncRefCount - 1);
  if (cmsSyncRefCount > 0) return;
  const channel = cmsSyncChannel;
  cmsSyncChannel = null;
  cmsSyncQueryClient = null;
<<<<<<< HEAD
  if (channel) {
    const repos = getRepositories();
    repos.realtime.removeChannel(channel);
  }
=======
  if (channel) void supabase.removeChannel(channel);
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
}

/** Single shared cms-sync channel; safe to call from multiple components. */
export function useRealtimeCmsSync() {
  const qc = useQueryClient();
<<<<<<< HEAD
  const repos = useRepositories();
  useEffect(() => {
    acquireCmsSyncChannel(qc, repos);
    return () => {
      releaseCmsSyncChannel();
    };
  }, [qc, repos]);
=======
  useEffect(() => {
    acquireCmsSyncChannel(qc);
    return () => {
      releaseCmsSyncChannel();
    };
  }, [qc]);
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
}
