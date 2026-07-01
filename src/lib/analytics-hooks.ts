import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trackVisit, setupOfflineAnalyticsSync } from "./analytics";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const ANALYTICS_QK = {
  stats: ["analytics", "stats"] as const,
  topPages: ["analytics", "top-pages"] as const,
  deviceDistribution: ["analytics", "device-distribution"] as const,
  visitsOverTime: (days: number) => ["analytics", "visits-over-time", days] as const,
  visits7: ["analytics", "visits-over-time", 7] as const,
  visits30: ["analytics", "visits-over-time", 30] as const,
};

export interface SiteVisitStats {
  total: number;
  today: number;
  yesterday: number;
  realtime: number;
}

export interface TopPage {
  page_path: string;
  visit_count: number;
}

export interface DeviceDistribution {
  device_type: string;
  count: number;
}

export interface VisitsOverTime {
  date: string;
  visits: number;
}

/**
 * Wrapper for site_visits table queries.
 * site_visits table is not yet in generated Supabase types.
 * Uses type assertions until types are regenerated.
 */
function siteVisitsQuery() {
  return {
    selectCount: async (
      column = "*" as never,
      filter?: { is_bot?: boolean; gte?: string; lt?: string },
    ) => {
      let query = supabase
        .from("site_visits" as never)
        .select(column, { count: "exact", head: true }) as unknown as {
        eq: (col: string, val: unknown) => typeof query;
        gte: (col: string, val: string) => typeof query;
        lt: (col: string, val: string) => typeof query;
        error: unknown;
        count: number | null;
      };

      if (filter?.is_bot !== undefined) {
        query = query.eq("is_bot" as string, filter.is_bot) as unknown as typeof query;
      }
      if (filter?.gte) {
        query = query.gte("created_at" as string, filter.gte) as unknown as typeof query;
      }
      if (filter?.lt) {
        query = query.lt("created_at" as string, filter.lt) as unknown as typeof query;
      }

      return query;
    },
    selectRows: async <T>(columns = "*" as never) => {
      return supabase.from("site_visits" as never).select(columns) as unknown as Promise<{
        data: T[] | null;
        error: unknown;
      }>;
    },
    rpc: async <T>(fn: string, params?: Record<string, unknown>) => {
      return supabase.rpc(fn as never, params as never) as unknown as Promise<{
        data: T | null;
        error: unknown;
      }>;
    },
  };
}

async function fetchStats(): Promise<SiteVisitStats> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfDay);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

  const sv = siteVisitsQuery();

  const totalRes = await sv.selectCount("*" as never, { is_bot: false });
  const todayRes = await sv.selectCount("*" as never, {
    is_bot: false,
    gte: startOfDay.toISOString(),
  });
  const yesterdayRes = await sv.selectCount("*" as never, {
    is_bot: false,
    gte: startOfYesterday.toISOString(),
    lt: startOfDay.toISOString(),
  });
  const realtimeRes = await sv.selectCount("session_id" as never, {
    is_bot: false,
    gte: fiveMinAgo.toISOString(),
  });

  return {
    total: totalRes.count ?? 0,
    today: todayRes.count ?? 0,
    yesterday: yesterdayRes.count ?? 0,
    realtime: realtimeRes.count ?? 0,
  };
}

async function fetchTopPages(): Promise<TopPage[]> {
  const sv = siteVisitsQuery();
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const rpc = supabase.rpc as any;
  const { data, error } = (await rpc("get_top_pages", { limit_count: 10 })) as {
    data: TopPage[] | null;
    error: unknown;
  };

  if (error) {
    // Fallback: direct query
    const { data: fallback } = await sv.selectRows<{ page_path: string }>("page_path" as never);

    if (!fallback) return [];

    const counts = new Map<string, number>();
    for (const row of fallback) {
      counts.set(row.page_path, (counts.get(row.page_path) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([page_path, visit_count]) => ({ page_path, visit_count }))
      .sort((a, b) => b.visit_count - a.visit_count)
      .slice(0, 10);
  }

  return data ?? [];
}

async function fetchDeviceDistribution(): Promise<DeviceDistribution[]> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const rpcAny = supabase.rpc as any;
  const { data, error } = (await rpcAny("get_device_distribution")) as {
    data: DeviceDistribution[] | null;
    error: unknown;
  };

  if (error) {
    // Fallback
    const sv = siteVisitsQuery();
    const { data: fallback } = await sv.selectRows<{ device_type: string | null }>(
      "device_type" as never,
    );

    if (!fallback) return [];

    const counts = new Map<string, number>();
    for (const row of fallback) {
      const dt = row.device_type ?? "unknown";
      counts.set(dt, (counts.get(dt) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([device_type, count]) => ({ device_type, count }))
      .sort((a, b) => b.count - a.count);
  }

  return data ?? [];
}

async function fetchVisitsOverTime(days: number): Promise<VisitsOverTime[]> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const rpcAny2 = supabase.rpc as any;
  const { data, error } = (await rpcAny2("get_visits_over_time", { days })) as {
    data: VisitsOverTime[] | null;
    error: unknown;
  };

  if (error) {
    // Fallback: direct query with grouping
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    const sv = siteVisitsQuery();
    const { data: fallback } = await sv.selectRows<{ created_at: string }>("created_at" as never);

    if (!fallback) return [];

    const dayCounts = new Map<string, number>();
    for (const row of fallback) {
      const date = new Date(row.created_at).toISOString().split("T")[0];
      dayCounts.set(date, (dayCounts.get(date) ?? 0) + 1);
    }

    return Array.from(dayCounts.entries())
      .map(([date, visits]) => ({ date, visits }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  return data ?? [];
}

export function useAnalyticsStats() {
  return useQuery({
    queryKey: ANALYTICS_QK.stats,
    queryFn: fetchStats,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useTopPages() {
  const stats = useAnalyticsStats();
  return useQuery({
    queryKey: ANALYTICS_QK.topPages,
    queryFn: fetchTopPages,
    enabled: stats.data !== undefined,
    staleTime: 60_000,
  });
}

export function useDeviceDistribution() {
  return useQuery({
    queryKey: ANALYTICS_QK.deviceDistribution,
    queryFn: fetchDeviceDistribution,
    staleTime: 120_000,
  });
}

export function useVisitsOverTime(days: number) {
  return useQuery({
    queryKey: ANALYTICS_QK.visitsOverTime(days),
    queryFn: () => fetchVisitsOverTime(days),
    staleTime: 60_000,
  });
}

export function useRealtimeVisitors() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupChannel = () => {
      channel = supabase
        .channel("analytics-realtime")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "site_visits" }, () => {
          queryClient.invalidateQueries({ queryKey: ANALYTICS_QK.stats });
        })
        .subscribe();
    };

    setupChannel();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient]);
}

export function useTrackVisit(pagePath?: string): void {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!pagePath) return;
    if (trackedRef.current) return;
    trackedRef.current = true;

    trackVisit(pagePath);
  }, [pagePath]);
}

export function useAnalytics(): {
  stats: ReturnType<typeof useAnalyticsStats>;
  topPages: ReturnType<typeof useTopPages>;
  deviceDistribution: ReturnType<typeof useDeviceDistribution>;
  visits7: ReturnType<typeof useVisitsOverTime>;
  visits30: ReturnType<typeof useVisitsOverTime>;
} {
  const stats = useAnalyticsStats();
  const topPages = useTopPages();
  const deviceDistribution = useDeviceDistribution();
  const visits7 = useVisitsOverTime(7);
  const visits30 = useVisitsOverTime(30);

  useRealtimeVisitors();
  const offlineSyncSetup = useRef(false);

  useEffect(() => {
    if (offlineSyncSetup.current) return;
    offlineSyncSetup.current = true;
    const cleanup = setupOfflineAnalyticsSync();
    return cleanup;
  }, []);

  return { stats, topPages, deviceDistribution, visits7, visits30 };
}

export function useDashboardAnalytics() {
  return useAnalytics();
}

export function getAverageDailyVisits(total: number, daysSinceFirst: number): number {
  if (daysSinceFirst <= 0) return total;
  return Math.round(total / daysSinceFirst);
}

export function getTopPageDisplay(pages: TopPage[] | undefined): string {
  if (!pages || pages.length === 0) return "—";
  return pages[0].page_path;
}

const PAGE_VIEW_SESSION_KEY = "kioar-analytics-page-view-recorded";

export function useLegacyPageViewCompat(): void {
  const tracked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tracked.current) return;
    if (sessionStorage.getItem(PAGE_VIEW_SESSION_KEY)) return;

    tracked.current = true;
    sessionStorage.setItem(PAGE_VIEW_SESSION_KEY, "1");

    const path = window.location.pathname;
    trackVisit(path);
  }, []);
}
