import { createServerFn } from "@tanstack/react-start";

export const getSiteVisitStats = createServerFn({ method: "GET" }).handler(async () => {
<<<<<<< HEAD
  const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
  const providers = createSupabaseAdminProviders();
  const { data, error } = await providers.database.rpc("get_site_visit_stats");
=======
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (supabaseAdmin.rpc as any)("get_site_visit_stats");
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  if (error) throw error;
  return data as { total: number; today: number; yesterday: number; realtime: number };
});

export const getTopPages = createServerFn({ method: "GET" })
  .validator((data: { limit?: number } | undefined) => data ?? { limit: 10 })
  .handler(async ({ data }) => {
<<<<<<< HEAD
    const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
    const providers = createSupabaseAdminProviders();
    const { data: result, error } = await providers.database.rpc("get_top_pages", {
=======
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await (supabaseAdmin.rpc as any)("get_top_pages", {
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
      limit_count: data.limit,
    });
    if (error) throw error;
    return result as Array<{ page_path: string; visit_count: number }>;
  });

export const getDeviceDistribution = createServerFn({ method: "GET" }).handler(async () => {
<<<<<<< HEAD
  const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
  const providers = createSupabaseAdminProviders();
  const { data, error } = await providers.database.rpc("get_device_distribution");
=======
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (supabaseAdmin.rpc as any)("get_device_distribution");
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  if (error) throw error;
  return data as Array<{ device_type: string; count: number }>;
});

export const getVisitsOverTime = createServerFn({ method: "GET" })
  .validator((data: { days?: number } | undefined) => data ?? { days: 7 })
  .handler(async ({ data }) => {
<<<<<<< HEAD
    const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
    const providers = createSupabaseAdminProviders();
    const { data: result, error } = await providers.database.rpc("get_visits_over_time", {
=======
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await (supabaseAdmin.rpc as any)("get_visits_over_time", {
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
      days: data.days,
    });
    if (error) throw error;
    return result as Array<{ date: string; visits: number }>;
  });
