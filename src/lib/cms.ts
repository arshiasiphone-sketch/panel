/**
 * CMS data layer. The Admin Panel and Landing Page consume these hooks.
 * Source of truth = Lovable Cloud (Supabase). NO localStorage for CMS data.
 */
import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  beginOptimisticUpdate,
  rollbackOptimisticUpdate,
  scheduleRemoteSync,
  touchLocalCmsEdit,
  upsertById,
  removeById,
} from "@/lib/cms-sync";

type TablesRow<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

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
  return useQuery({
    queryKey: QK.menu,
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase.from("menu_items").select("*").eq("visible", true).order("sort_order");
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
  });
}

export function useGalleryImages() {
  return useQuery({
    queryKey: QK.gallery,
    queryFn: async (): Promise<GalleryImage[]> => {
      const { data, error } = await supabase.from("gallery_images").select("*").eq("visible", true).order("sort_order");
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
  });
}

export function useEvents() {
  return useQuery({
    queryKey: QK.events,
    queryFn: async (): Promise<EventItem[]> => {
      const { data, error } = await supabase.from("events").select("*").eq("visible", true).order("sort_order");
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
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: QK.testimonials,
    queryFn: async (): Promise<Testimonial[]> => {
      const { data, error } = await supabase.from("testimonials").select("*").eq("visible", true).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePageBlocks() {
  return useQuery({
    queryKey: QK.blocks,
    queryFn: async (): Promise<PageBlock[]> => {
      const { data, error } = await supabase.from("page_blocks").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
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
  updated_at: new Date().toISOString(),
};

export async function fetchThemeSettings(): Promise<ThemeSettings> {
  const { data, error } = await supabase.from("theme_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  if (!data) {
    // Insert default if missing (auth-required, swallow if denied).
    const { data: inserted } = await supabase.from("theme_settings").insert({ id: 1 }).select("*").maybeSingle();
    return { ...DEFAULT_THEME_SETTINGS, ...(inserted ?? {}) };
  }
  return { ...DEFAULT_THEME_SETTINGS, ...data };
}

export function useTheme() {
  return useQuery({
    queryKey: QK.theme,
    queryFn: fetchThemeSettings,
    staleTime: 60_000,
  });
}

export type SiteContentMap = Record<string, Record<string, unknown>>;
export function useSiteContent() {
  return useQuery({
    queryKey: QK.site,
    queryFn: async (): Promise<SiteContentMap> => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      const out: SiteContentMap = {};
      for (const row of data ?? []) out[row.key] = (row.value as Record<string, unknown>) ?? {};
      return out;
    },
  });
}

function upsertPersonalityRow(list: PersonalityProfileRow[] | undefined, row: PersonalityProfileRow): PersonalityProfileRow[] {
  if (!list?.length) return [row];
  const idx = list.findIndex((r) => r.key === row.key);
  if (idx < 0) return [...list, row];
  const next = [...list];
  next[idx] = { ...next[idx], ...row };
  return next;
}

type IdRow = { id: string };

/* ============== Mutations (require admin) ============== */

function makeUpsertHook<T extends { id?: string }>(table: "menu_items" | "gallery_images" | "events" | "testimonials" | "page_blocks", qk: readonly unknown[]) {
  return function useUpsert() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async (row: T) => {
        const { data, error } = await supabase.from(table).upsert(row as never).select().maybeSingle();
        if (error) throw error;
        return data;
      },
      onMutate: async (row) => {
        if (!row.id) return { prev: undefined as T[] | undefined, prevAll: undefined as T[] | undefined };
        const optimistic = { ...(row as T & { id: string }), id: row.id } as T & { id: string };
        const { prev } = await beginOptimisticUpdate<T[]>(qc, qk, (list) => upsertById(list as (T & { id: string })[] | undefined, optimistic as T & { id: string }) as T[]);
        const { prev: prevAll } = await beginOptimisticUpdate<T[]>(qc, [...qk, "all"], (list) => upsertById(list as (T & { id: string })[] | undefined, optimistic as T & { id: string }) as T[]);
        return { prev, prevAll };
      },
      onError: (_err, _row, ctx) => {
        if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, qk, ctx.prev);
        if (ctx?.prevAll !== undefined) rollbackOptimisticUpdate(qc, [...qk, "all"], ctx.prevAll);
      },
      onSuccess: (data) => {
        if (!data?.id) return;
        touchLocalCmsEdit();
        qc.setQueryData<T[]>(qk, (list) => upsertById(list as (T & { id: string })[] | undefined, data as T & { id: string }));
        qc.setQueryData<T[]>([...qk, "all"], (list) => upsertById(list as (T & { id: string })[] | undefined, data as T & { id: string }));
      },
    });
  };
}
function makeDeleteHook(table: "menu_items" | "gallery_images" | "events" | "testimonials" | "page_blocks", qk: readonly unknown[]) {
  return function useDelete() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
      },
      onMutate: async (id) => {
        const { prev } = await beginOptimisticUpdate<IdRow[]>(qc, qk, (list) => removeById(list, id));
        const { prev: prevAll } = await beginOptimisticUpdate<IdRow[]>(qc, [...qk, "all"], (list) => removeById(list, id));
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

export const useUpsertMenuItem = makeUpsertHook<Partial<MenuItem>>("menu_items", QK.menu);
export const useDeleteMenuItem = makeDeleteHook("menu_items", QK.menu);
export const useUpsertGalleryImage = makeUpsertHook<Partial<GalleryImage>>("gallery_images", QK.gallery);
export const useDeleteGalleryImage = makeDeleteHook("gallery_images", QK.gallery);
export const useUpsertEvent = makeUpsertHook<Partial<EventItem>>("events", QK.events);
export const useDeleteEvent = makeDeleteHook("events", QK.events);
export const useUpsertTestimonial = makeUpsertHook<Partial<Testimonial>>("testimonials", QK.testimonials);
export const useDeleteTestimonial = makeDeleteHook("testimonials", QK.testimonials);

/* Blocks: special handling — insert, update, delete, reorder */
export function useCreateBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { type: string; data: Record<string, unknown>; sort_order: number }) => {
      const { data, error } = await supabase.from("page_blocks").insert(input as never).select().maybeSingle();
      if (error) throw error;
      return data;
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
  return useMutation({
    mutationFn: async (input: { id: string; data?: Record<string, unknown>; visible?: boolean; sort_order?: number }) => {
      const { id, ...patch } = input;
      const { error } = await supabase.from("page_blocks").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onMutate: async (input) => beginOptimisticUpdate<PageBlock[]>(qc, QK.blocks, (list) => {
      if (!list) return list;
      return list.map((block) => block.id === input.id
        ? { ...block, ...input, data: (input.data ?? block.data) as PageBlock["data"] }
        : block);
    }),
    onError: (_err, _input, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}
export function useDeleteBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("page_blocks").delete().eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => beginOptimisticUpdate<PageBlock[]>(qc, QK.blocks, (list) => removeById(list, id)),
    onError: (_err, _id, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}
export function useReorderBlocks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const results = await Promise.all(orderedIds.map((id, idx) =>
        supabase.from("page_blocks").update({ sort_order: idx }).eq("id", id)
      ));
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    },
    onMutate: async (orderedIds) => beginOptimisticUpdate<PageBlock[]>(qc, QK.blocks, (list) => {
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
  return useMutation({
    mutationFn: async (patch: Partial<ThemeSettings>) => {
      const { error } = await supabase.from("theme_settings").update(patch).eq("id", 1);
      if (error) throw error;
    },
    onMutate: async (patch) => beginOptimisticUpdate<ThemeSettings>(qc, QK.theme, (prev) => (prev ? { ...prev, ...patch } : prev)),
    onError: (_err, _patch, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.theme, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}
export function useUpsertSiteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { key: string; value: Record<string, unknown> }) => {
      const { error } = await supabase.from("site_content").upsert({ key: input.key, value: input.value as never });
      if (error) throw error;
    },
    onMutate: async (input) => beginOptimisticUpdate<SiteContentMap>(qc, QK.site, (prev) => ({ ...(prev ?? {}), [input.key]: input.value })),
    onError: (_err, _input, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.site, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}

export function usePersonalityProfiles() {
  return useQuery({
    queryKey: QK.personalities,
    queryFn: async (): Promise<PersonalityProfileRow[]> => {
      const { data, error } = await supabase.from("personality_profiles").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpdatePersonalityProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<PersonalityProfileRow> & { key: string }) => {
      const { key, ...patch } = input;
      const { error } = await supabase.from("personality_profiles").update(patch as never).eq("key", key);
      if (error) throw error;
    },
    onMutate: async (input) => beginOptimisticUpdate<PersonalityProfileRow[]>(qc, QK.personalities, (list) => {
      if (!list) return list;
      return list.map((row) => row.key === input.key ? { ...row, ...input } : row);
    }),
    onError: (_err, _input, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.personalities, ctx.prev);
    },
    onSuccess: () => touchLocalCmsEdit(),
  });
}

export function useUpsertPersonalityProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: PersonalityProfileRow) => {
      const { error } = await supabase.from("personality_profiles").upsert(row as never);
      if (error) throw error;
    },
    onMutate: async (row) => beginOptimisticUpdate<PersonalityProfileRow[]>(qc, QK.personalities, (list) => upsertPersonalityRow(list, row)),
    onError: (_err, _row, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.personalities, ctx.prev);
    },
    onSuccess: (_data, row) => {
      touchLocalCmsEdit();
      qc.setQueryData<PersonalityProfileRow[]>(QK.personalities, (list) => upsertPersonalityRow(list, row));
    },
  });
}

/* ============== Page views ============== */

export type PageViewStats = { total: number; today: number };

export function usePageViewStats() {
  return useQuery({
    queryKey: QK.pageViews,
    queryFn: async (): Promise<PageViewStats> => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [totalRes, todayRes] = await Promise.all([
        supabase.from("page_views").select("*", { count: "exact", head: true }),
        supabase.from("page_views").select("*", { count: "exact", head: true }).gte("visited_at", startOfDay.toISOString()),
      ]);
      if (totalRes.error) throw totalRes.error;
      if (todayRes.error) throw todayRes.error;
      return { total: totalRes.count ?? 0, today: todayRes.count ?? 0 };
    },
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
      }).catch(() => { /* silent — analytics must not break the page */ }),
    );
  }, []);
}

/* ============== Auth ============== */
import { useState } from "react";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);
  return { user, loading };
}

export function useIsAdmin(userId: string | undefined) {
  return useQuery({
    queryKey: QK.role(userId),
    enabled: !!userId,
    queryFn: async (): Promise<boolean> => {
      if (!userId) return false;
      const { data, error } = await supabase
        .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
      if (error) throw error;
      return !!data;
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

let cmsSyncChannel: RealtimeChannel | null = null;
let cmsSyncRefCount = 0;
let cmsSyncQueryClient: QueryClient | null = null;

function createCmsSyncChannel(): RealtimeChannel {
  let channel: RealtimeChannel = supabase.channel(CMS_SYNC_CHANNEL);
  for (const { table, queryKey } of CMS_SYNC_TABLES) {
    channel = channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      () => {
        if (!cmsSyncQueryClient) return;
        scheduleRemoteSync(cmsSyncQueryClient, queryKey);
        if (table === "site_content") {
          scheduleRemoteSync(cmsSyncQueryClient, ["test", "questions"]);
        }
      },
    );
  }
  channel.subscribe();
  return channel;
}

function acquireCmsSyncChannel(qc: QueryClient): void {
  cmsSyncQueryClient = qc;
  cmsSyncRefCount += 1;
  if (cmsSyncChannel) return;
  cmsSyncChannel = createCmsSyncChannel();
}

function releaseCmsSyncChannel(): void {
  cmsSyncRefCount = Math.max(0, cmsSyncRefCount - 1);
  if (cmsSyncRefCount > 0) return;
  const channel = cmsSyncChannel;
  cmsSyncChannel = null;
  cmsSyncQueryClient = null;
  if (channel) void supabase.removeChannel(channel);
}

/** Single shared cms-sync channel; safe to call from multiple components. */
export function useRealtimeCmsSync() {
  const qc = useQueryClient();
  useEffect(() => {
    acquireCmsSyncChannel(qc);
    return () => { releaseCmsSyncChannel(); };
  }, [qc]);
}
