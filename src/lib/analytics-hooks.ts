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

async function fetchStats(): Promise<SiteVisitStats> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfDay);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

  const [totalRes, todayRes, yesterdayRes, realtimeRes] = await Promise.all([
    supabase.from("site_visits").select("*", { count: "exact", head: true }).eq("is_bot", false),
    supabase
      .from("site_visits")
      .select("*", { count: "exact", head: true })
      .eq("is_bot", false)
      .gte("created_at", startOfDay.toISOString()),
    supabase
      .from("site_visits")
      .select("*", { count: "exact", head: true })
      .eq("is_bot", false)
      .gte("created_at", startOfYesterday.toISOString())
      .lt("created_at", startOfDay.toISOString()),
    supabase
      .from("site_visits")
      .select("session_id", { count: "exact", head: true })
      .eq("is_bot", false)
      .gte("created_at", fiveMinAgo.toISOString()),
  ]);

  if (totalRes.error) throw totalRes.error;
  if (todayRes.error) throw todayRes.error;
  if (yesterdayRes.error) throw yesterdayRes.error;
  if (realtimeRes.error) throw realtimeRes.error;

  return {
    total: totalRes.count ?? 0,
    today: todayRes.count ?? 0,
    yesterday: yesterdayRes.count ?? 0,
    realtime: realtimeRes.count ?? 0,
  };
}

async function fetchTopPages(): Promise<TopPage[]> {
  const { data, error } = await supabase.rpc("get_top_pages", { limit_count: 10 });

  if (error) {
    // Fallback: direct query
    const { data: fallback, error: fallbackError } = await supabase
      .from("site_visits")
      .select("page_path")
      .eq("is_bot", false);

    if (fallbackError) throw fallbackError;

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
  const { data, error } = await supabase.rpc("get_device_distribution");

  if (error) {
    // Fallback
    const { data: fallback, error: fallbackError } = await supabase
      .from("site_visits")
      .select("device_type")
      .eq("is_bot", false);

    if (fallbackError) throw fallbackError;

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
  const { data, error } = await supabase.rpc("get_visits_over_time", { days });

  if (error) {
    // Fallback: direct query with grouping
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    const { data: fallback, error: fallbackError } = await supabase
      .from("site_visits")
      .select("created_at")
      .eq("is_bot", false)
      .gte("created_at", cutoff.toISOString())
      .order("created_at", { ascending: true });

    if (fallbackError) throw fallbackError;

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
