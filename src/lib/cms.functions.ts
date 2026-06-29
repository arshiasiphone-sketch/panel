import { createServerFn } from "@tanstack/react-start";

/** Simple in-memory rate limiter for page views. */
const pageViewLog = new Map<string, number>();
const PAGE_VIEW_MIN_INTERVAL_MS = 3000; // min 3s between views from same session

export const recordPageView = createServerFn({ method: "POST" })
  .validator((data: { path?: string; referrer?: string; userAgent?: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Rate limiting: skip if same session key was recorded recently
    const sessionKey = `${data.path ?? "/"}|${data.userAgent ?? ""}`;
    const now = Date.now();
    const last = pageViewLog.get(sessionKey);
    if (last && now - last < PAGE_VIEW_MIN_INTERVAL_MS) {
      return { ok: true as const };
    }
    pageViewLog.set(sessionKey, now);

    // Cleanup old entries to prevent memory leak
    if (pageViewLog.size > 10000) {
      const cutoff = now - 60000;
      for (const [key, ts] of pageViewLog) {
        if (ts < cutoff) pageViewLog.delete(key);
      }
    }

    const { error } = await supabaseAdmin.from("page_views").insert({
      path: data.path ?? "/",
      referrer: data.referrer ?? null,
      user_agent: data.userAgent ?? null,
    });
    if (error) throw error;
    return { ok: true as const };
  });
