/**
 * CMS data layer. The Admin Panel and Landing Page consume these hooks.
 * Source of truth = Lovable Cloud (Supabase). NO localStorage for CMS data.
 *
 * Refactored to use the Repository layer instead of direct Supabase calls.
 * All public exports and hook signatures are unchanged.
 */
import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { IChannel } from "@/lib/interfaces/realtime";
import {
  beginOptimisticUpdate,
  rollbackOptimisticUpdate,
  scheduleRemoteSync,
  touchLocalCmsEdit,
  upsertById,
  removeById,
} from "@/lib/cms-sync";
import { useOptionalWorkspace } from "@/lib/core/workspace";
import { useRepositories, getRepositories } from "@/lib/providers";
import type { Repositories } from "@/lib/providers";

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
  });
}

export function useGalleryImages() {
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
  });
}

export function useEvents() {
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
  });
}

export function useTestimonials() {
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.testimonials,
    queryFn: (): Promise<Testimonial[]> => repos.testimonials.getVisible(),
  });
}

export function usePageBlocks() {
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.blocks,
    queryFn: (): Promise<PageBlock[]> => repos.pages.getAll(),
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
    staleTime: 60_000,
  });
}

export type SiteContentMap = Record<string, Record<string, unknown>>;
export function useSiteContent() {
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.site,
    queryFn: (): Promise<SiteContentMap> => repos.siteContent.getAll(),
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
  repoKey: "menu" | "gallery" | "events" | "testimonials",
  qk: readonly unknown[],
) {
  return function useUpsert() {
    const qc = useQueryClient();
    const repos = useRepositories();
    const repo = repos[repoKey];
    return useMutation({
      mutationFn: async (row: T) => {
        return repo.upsert(row as never) as Promise<T | null>;
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
  repoKey: "menu" | "gallery" | "events" | "testimonials",
  qk: readonly unknown[],
) {
  return function useDelete() {
    const qc = useQueryClient();
    const repos = useRepositories();
    const repo = repos[repoKey];
    return useMutation({
      mutationFn: async (id: string) => {
        await repo.delete(id);
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

export const useUpsertMenuItem = makeUpsertHook<Partial<MenuItem>>("menu", QK.menu);
export const useDeleteMenuItem = makeDeleteHook("menu", QK.menu);
export const useUpsertGalleryImage = makeUpsertHook<Partial<GalleryImage>>("gallery", QK.gallery);
export const useDeleteGalleryImage = makeDeleteHook("gallery", QK.gallery);
export const useUpsertEvent = makeUpsertHook<Partial<EventItem>>("events", QK.events);
export const useDeleteEvent = makeDeleteHook("events", QK.events);
export const useUpsertTestimonial = makeUpsertHook<Partial<Testimonial>>(
  "testimonials",
  QK.testimonials,
);
export const useDeleteTestimonial = makeDeleteHook("testimonials", QK.testimonials);

/* Blocks: special handling — insert, update, delete, reorder */
export function useCreateBlock() {
  const qc = useQueryClient();
  const repos = useRepositories();
  const ws = useOptionalWorkspace();
  return useMutation({
    mutationFn: async (input: {
      type: string;
      data: Record<string, unknown>;
      sort_order: number;
    }) => {
      return repos.pages.create({
        ...input,
        workspace_id: ws?.workspace?.workspaceId ?? undefined,
      } as never);
    },
    onMutate: async (input) => {
      const optimistic = {
        id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: input.type,
        data: input.data,
        sort_order: input.sort_order,
        visible: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as PageBlock;
      const { prev } = await beginOptimisticUpdate<PageBlock[]>(qc, QK.blocks, (list) =>
        upsertById(list, optimistic),
      );
      return { prev };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.prev !== undefined) rollbackOptimisticUpdate(qc, QK.blocks, ctx.prev);
    },
    onSuccess: (data) => {
      touchLocalCmsEdit();
      qc.setQueryData<PageBlock[]>(QK.blocks, (list) => upsertById(list, data));
    },
    onSettled: () => {
      // Don't force a refetch here: a strict (workspace-scoped) SELECT RLS can
      // temporarily exclude the just-inserted row from getAll(), which would
      // silently drop the block we just added. The realtime cms-sync channel
      // already re-fetches when another session changes page_blocks, and
      // touchLocalCmsEdit() above pauses that refresh briefly so our optimistic
      // insert isn't clobbered.
    },
  });
}
export function useUpdateBlock() {
  const qc = useQueryClient();
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      data?: Record<string, unknown>;
      visible?: boolean;
      sort_order?: number;
    }) => {
      const { id, ...patch } = input;
      await repos.pages.update(id, patch as never);
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
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (id: string) => {
      await repos.pages.delete(id);
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
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await repos.pages.reorder(orderedIds);
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
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (patch: Partial<ThemeSettings>) => {
      await repos.theme.update(patch);
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
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (input: { key: string; value: Record<string, unknown> }) => {
      await repos.siteContent.upsert(input.key, input.value);
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
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.personalities,
    queryFn: (): Promise<PersonalityProfileRow[]> => repos.personality.getAll(),
  });
}

export function useUpdatePersonalityProfile() {
  const qc = useQueryClient();
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (input: Partial<PersonalityProfileRow> & { key: string }) => {
      const { key, ...patch } = input;
      await repos.personality.update(key, patch);
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
  const repos = useRepositories();
  return useMutation({
    mutationFn: async (row: PersonalityProfileRow) => {
      await repos.personality.upsert(row);
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
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.pageViews,
    queryFn: (): Promise<PageViewStats> => repos.analytics.fetchPageViewStats(),
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
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const repos = useRepositories();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    repos.auth.getSession().then(({ user: u }) => {
      if (!mounted) return;
      setUser(u as unknown as User | null);
      setLoading(false);
    });
    const { data: sub } = repos.auth.onAuthStateChange((_e, session) => {
      const u = (session as { user?: User } | null)?.user ?? null;
      setUser(u ?? null);
      setLoading(false);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [repos]);
  return { user, loading };
}

export function useIsAdmin(userId: string | undefined) {
  const repos = useRepositories();
  return useQuery({
    queryKey: QK.role(userId),
    enabled: !!userId,
    queryFn: async (): Promise<boolean> => {
      if (!userId) return false;
      return repos.auth.isAdmin(userId);
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

let cmsSyncChannel: IChannel | null = null;
let cmsSyncRefCount = 0;
let cmsSyncQueryClient: QueryClient | null = null;

function createCmsSyncChannel(repos: Repositories): IChannel {
  let channel = repos.realtime.channel(CMS_SYNC_CHANNEL);
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

function acquireCmsSyncChannel(qc: QueryClient, repos: Repositories): void {
  cmsSyncQueryClient = qc;
  cmsSyncRefCount += 1;
  if (cmsSyncChannel) return;
  cmsSyncChannel = createCmsSyncChannel(repos);
}

function releaseCmsSyncChannel(): void {
  cmsSyncRefCount = Math.max(0, cmsSyncRefCount - 1);
  if (cmsSyncRefCount > 0) return;
  const channel = cmsSyncChannel;
  cmsSyncChannel = null;
  cmsSyncQueryClient = null;
  if (channel) {
    const repos = getRepositories();
    repos.realtime.removeChannel(channel);
  }
}

/** Single shared cms-sync channel; safe to call from multiple components. */
export function useRealtimeCmsSync() {
  const qc = useQueryClient();
  const repos = useRepositories();
  useEffect(() => {
    acquireCmsSyncChannel(qc, repos);
    return () => {
      releaseCmsSyncChannel();
    };
  }, [qc, repos]);
}
