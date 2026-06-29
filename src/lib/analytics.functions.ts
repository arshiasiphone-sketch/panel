import { createServerFn } from "@tanstack/react-start";

export const getSiteVisitStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("get_site_visit_stats");
    if (error) throw error;
    return data as { total: number; today: number; yesterday: number; realtime: number };
  });

export const getTopPages = createServerFn({ method: "GET" })
  .validator((data: { limit?: number } | undefined) => data ?? { limit: 10 })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("get_top_pages", { limit_count: data.limit });
    if (error) throw error;
    return result as Array<{ page_path: string; visit_count: number }>;
  });

export const getDeviceDistribution = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("get_device_distribution");
    if (error) throw error;
    return data as Array<{ device_type: string; count: number }>;
  });

export const getVisitsOverTime = createServerFn({ method: "GET" })
  .validator((data: { days?: number } | undefined) => data ?? { days: 7 })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("get_visits_over_time", { days: data.days });
    if (error) throw error;
    return result as Array<{ date: string; visits: number }>;
  });