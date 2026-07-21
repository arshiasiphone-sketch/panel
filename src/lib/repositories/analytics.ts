/**
 * Analytics repository — encapsulates analytics queries.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import { pageViewSchema } from "@/lib/cms-schemas";

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

export interface PageViewStats {
  total: number;
  today: number;
}

export class AnalyticsRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  /**
   * Fetch aggregate site visit stats.
   */
  async fetchStats(): Promise<SiteVisitStats> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const startOfYesterday = new Date(startOfDay);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

      const sv = this._siteVisitsQuery();

      const [totalRes, todayRes, yesterdayRes, realtimeRes] = await Promise.all([
        sv.selectCount("session_id", { is_bot: false }),
        sv.selectCount("session_id", { is_bot: false, gte: startOfDay.toISOString() }),
        sv.selectCount("session_id", {
          is_bot: false,
          gte: startOfYesterday.toISOString(),
          lt: startOfDay.toISOString(),
        }),
        sv.selectCount("session_id", { is_bot: false, gte: fiveMinAgo.toISOString() }),
      ]);

      return {
        total: totalRes.count ?? 0,
        today: todayRes.count ?? 0,
        yesterday: yesterdayRes.count ?? 0,
        realtime: realtimeRes.count ?? 0,
      };
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchStats", err);
    }
  }

  /**
   * Fetch top pages by visit count.
   */
  async fetchTopPages(limit = 10): Promise<TopPage[]> {
    try {
      try {
        const { data, error } = await this.db.rpc<TopPage[]>("get_top_pages", {
          limit_count: limit,
        });
        if (!error && data) return data;
      } catch {
        // Fallback to direct query below
      }

      // Fallback: direct query with explicit column
      const sv = this._siteVisitsQuery();
      const { data: fallback } = await sv.selectColumns("page_path");
      if (!fallback) return [];
      const counts = new Map<string, number>();
      for (const row of fallback) {
        const path = row.page_path ?? "";
        counts.set(path, (counts.get(path) ?? 0) + 1);
      }
      return Array.from(counts.entries())
        .map(([page_path, visit_count]) => ({ page_path, visit_count }))
        .sort((a, b) => b.visit_count - a.visit_count)
        .slice(0, limit);
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchTopPages", err);
    }
  }

  /**
   * Fetch device distribution.
   */
  async fetchDeviceDistribution(): Promise<DeviceDistribution[]> {
    try {
      try {
        const { data, error } = await this.db.rpc<DeviceDistribution[]>(
          "get_device_distribution",
        );
        if (!error && data) return data;
      } catch {
        // Fallback below
      }

      // Fallback
      const sv = this._siteVisitsQuery();
      const { data: fallback } = await sv.selectColumns("device_type");
      if (!fallback) return [];
      const counts = new Map<string, number>();
      for (const row of fallback) {
        counts.set(row.device_type ?? "unknown", (counts.get(row.device_type ?? "unknown") ?? 0) + 1);
      }
      return Array.from(counts.entries())
        .map(([device_type, count]) => ({ device_type, count }))
        .sort((a, b) => b.count - a.count);
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchDeviceDistribution", err);
    }
  }

  /**
   * Fetch visits over time.
   */
  async fetchVisitsOverTime(days: number): Promise<VisitsOverTime[]> {
    try {
      try {
        const { data, error } = await this.db.rpc<VisitsOverTime[]>(
          "get_visits_over_time",
          { days },
        );
        if (!error && data) return data;
      } catch {
        // Fallback below
      }

      // Fallback
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      cutoff.setHours(0, 0, 0, 0);
      const sv = this._siteVisitsQuery();
      const { data: fallback } = await sv.selectColumns("created_at");
      if (!fallback) return [];
      const dayCounts = new Map<string, number>();
      for (const row of fallback) {
        const date = new Date(row.created_at ?? "").toISOString().split("T")[0];
        dayCounts.set(date, (dayCounts.get(date) ?? 0) + 1);
      }
      return Array.from(dayCounts.entries())
        .map(([date, visits]) => ({ date, visits }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchVisitsOverTime", err);
    }
  }

  /**
   * Fetch page view stats (from page_views table).
   */
  async fetchPageViewStats(): Promise<PageViewStats> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [totalRes, todayRes] = await Promise.all([
        this.withWorkspace(this.db.from("page_views").select("*", { count: "exact", head: true })),
        this.withWorkspace(
          this.db
            .from("page_views")
            .select("*", { count: "exact", head: true })
            .gte("visited_at", startOfDay.toISOString()),
        ),
      ]);
      if (totalRes.error) throw totalRes.error;
      if (todayRes.error) throw todayRes.error;
      return { total: totalRes.count ?? 0, today: todayRes.count ?? 0 };
    } catch (err) {
      throw this.normalizeError("page_views", "fetchPageViewStats", err);
    }
  }

  /**
   * Record a page view (server-side).
   */
  async recordPageView(input: {
    path?: string;
    referrer?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      const validated = this.validateOrThrow(pageViewSchema, input, "page_views");
      const insertData = {
        path: validated.path ?? "/",
        referrer: validated.referrer ?? null,
        user_agent: validated.user_agent ?? null,
      };
      if (this.workspaceId) (insertData as Record<string, unknown>).workspace_id = this.workspaceId;
      const { error } = await this.withWorkspace(
        this.db.from("page_views").insert(insertData),
      );
      if (error) throw error;
    } catch (err) {
      throw this.normalizeError("page_views", "recordPageView", err);
    }
  }

  /**
   * Get the site visit stats via RPC (server-side).
   */
  async fetchSiteVisitStatsRpc(): Promise<SiteVisitStats> {
    try {
      const { data, error } = await this.db.rpc<SiteVisitStats>("get_site_visit_stats");
      if (error) throw error;
      return data as SiteVisitStats;
    } catch (err) {
      throw this.normalizeError("site_visits", "fetchSiteVisitStatsRpc", err);
    }
  }

  // --- Private helpers ---

  /**
   * Wrapper for site_visits queries (not yet in generated Supabase types).
   */
  private _siteVisitsQuery() {
    const db = this.db;
    return {
      selectCount: async (
        _column: string,
        filter?: { is_bot?: boolean; gte?: string; lt?: string },
      ) => {
        let query = this.withWorkspace(db.from("site_visits").select("*", { count: "exact", head: true }));
        if (filter?.gte) query = query.gte("created_at", filter.gte);
        if (filter?.lt) query = query.lt("created_at", filter.lt);
        return query;
      },
      selectColumns: async (columns: string) => {
        // Await the thenable query to return resolved data directly.
        // site_visits table is not in generated Supabase types, hence the explicit generic.
        const result = await this.withWorkspace(db.from<Record<string, string | null>>("site_visits").select(columns));
        return result;
      },
    };
  }
}
