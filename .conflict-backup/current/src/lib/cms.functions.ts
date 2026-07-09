import { createServerFn } from "@tanstack/react-start";

export const recordPageView = createServerFn({ method: "POST" })
  .validator((data: { path?: string; referrer?: string; userAgent?: string }) => data)
  .handler(async ({ data }) => {
    const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
    const providers = createSupabaseAdminProviders();
    const { error } = await providers.database.from("page_views").insert({
      path: data.path ?? "/",
      referrer: data.referrer ?? null,
      user_agent: data.userAgent ?? null,
    });
    if (error) throw error;
    return { ok: true as const };
  });
