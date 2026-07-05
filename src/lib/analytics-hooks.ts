import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { trackVisit, setupOfflineAnalyticsSync } from "./analytics";
import { useRepositories } from "@/lib/providers";

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

export function useAnalyticsStats() {
  const repos = useRepositories();
  return useQuery({
    queryKey: ANALYTICS_QK.stats,
    queryFn: (): Promise<SiteVisitStats> => repos.analytics.fetchStats(),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useTopPages() {
  const stats = useAnalyticsStats();
  const repos = useRepositories();
  return useQuery({
    queryKey: ANALYTICS_QK.topPages,
    queryFn: (): Promise<TopPage[]> => repos.analytics.fetchTopPages(),
    enabled: stats.data !== undefined,
    staleTime: 60_000,
  });
}

export function useDeviceDistribution() {
  const repos = useRepositories();
  return useQuery({
    queryKey: ANALYTICS_QK.deviceDistribution,
    queryFn: (): Promise<DeviceDistribution[]> => repos.analytics.fetchDeviceDistribution(),
    staleTime: 120_000,
  });
}

export function useVisitsOverTime(days: number) {
  const repos = useRepositories();
  return useQuery({
    queryKey: ANALYTICS_QK.visitsOverTime(days),
    queryFn: () => repos.analytics.fetchVisitsOverTime(days),
    staleTime: 60_000,
  });
}

export function useRealtimeVisitors() {
  const queryClient = useQueryClient();
  const repos = useRepositories();

  useEffect(() => {
    const channel = repos.realtime
      .channel("analytics-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "site_visits" },
        () => {
          queryClient.invalidateQueries({ queryKey: ANALYTICS_QK.stats });
        },
      )
      .subscribe();

    return () => {
      repos.realtime.removeChannel(channel);
    };
  }, [queryClient, repos]);
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
