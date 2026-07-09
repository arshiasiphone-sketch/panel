import { createServerFn } from "@tanstack/react-start";

export const recordPageView = createServerFn({ method: "POST" })
  .validator((data: { path?: string; referrer?: string; userAgent?: string }) => data)
  .handler(async ({ data }) => {
<<<<<<< HEAD
    const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
    const providers = createSupabaseAdminProviders();
    const { error } = await providers.database.from("page_views").insert({
=======
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("page_views").insert({
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
      path: data.path ?? "/",
      referrer: data.referrer ?? null,
      user_agent: data.userAgent ?? null,
    });
    if (error) throw error;
    return { ok: true as const };
  });
