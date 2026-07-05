import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface TrackVisitPayload {
  session_id: string;
  page_path: string;
  referrer?: string;
  user_agent?: string;
  device_type?: string;
  country?: string;
  city?: string;
  ip_hash?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /slackbot/i,
    /discordbot/i,
    /headless/i,
    /phantomjs/i,
    /puppeteer/i,
    /playwright/i,
    /selenium/i,
    /webdriver/i,
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /monitoring/i,
    /uptime/i,
    /pingdom/i,
    /statuscake/i,
    /newrelic/i,
    /datadog/i,
    /semrush/i,
    /ahrefs/i,
    /majestic/i,
    /moz/i,
    /screaming/i,
    /frog/i,
    /sitebulb/i,
    /botpress/i,
    /dialogflow/i,
    /rasa/i,
    /wit\.ai/i,
    /luis/i,
    /lex/i,
    /api\.ai/i,
    /assistant/i,
    /alexa/i,
    /google\-cloud/i,
    /amazonaws/i,
    /digitalocean/i,
    /vultr/i,
    /linode/i,
    /scaleway/i,
    /hetzner/i,
    /ovh/i,
    /contabo/i,
    /rackspace/i,
    /azure/i,
    /gcp/i,
  ];
  return botPatterns.some((pattern) => pattern.test(userAgent));
}

function extractDeviceType(userAgent: string | undefined): string {
  if (!userAgent) return "unknown";
  if (/mobile|android|iphone|ipod|blackberry|windows phone|opera mini|iemobile/i.test(userAgent)) {
    return "mobile";
  }
  if (/tablet|ipad|playbook|kindle|silk/i.test(userAgent)) {
    return "tablet";
  }
  return "desktop";
}

function hashIp(ip: string, salt: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const hashBuffer = crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(await hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const RECENT_VISIT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload: TrackVisitPayload = await req.json();

    // Validate required fields
    if (!payload.session_id || !payload.page_path) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ignore admin pages
    if (payload.page_path.startsWith("/admin")) {
      return new Response(JSON.stringify({ ok: true, ignored: true, reason: "admin_page" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const analyticsSalt = Deno.env.get("ANALYTICS_SALT") || "default-salt-change-in-production";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Bot detection
    const isBotVisit = isBot(payload.user_agent);

    // Determine device type
    const deviceType = payload.device_type || extractDeviceType(payload.user_agent);

    // Hash IP if provided (for privacy)
    let ipHash = payload.ip_hash;
    if (!ipHash) {
      // Try to get IP from headers
      const forwarded = req.headers.get("x-forwarded-for");
      const realIp = req.headers.get("x-real-ip");
      const ip = forwarded?.split(",")[0]?.trim() || realIp;
      if (ip) {
        ipHash = await hashIp(ip, analyticsSalt);
      }
    }

    // Check for duplicate visit (same session, same page, within 30 minutes)
    const thirtyMinAgo = new Date(Date.now() - RECENT_VISIT_WINDOW_MS).toISOString();
    const { data: existingVisit, error: checkError } = await supabase
      .from("site_visits")
      .select("id")
      .eq("session_id", payload.session_id)
      .eq("page_path", payload.page_path)
      .eq("is_bot", false)
      .gte("created_at", thirtyMinAgo)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking duplicate:", checkError);
    }

    if (existingVisit) {
      return new Response(JSON.stringify({ ok: true, ignored: true, reason: "duplicate" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert the visit
    const { error: insertError } = await supabase.from("site_visits").insert({
      session_id: payload.session_id,
      page_path: payload.page_path,
      referrer: payload.referrer || null,
      user_agent: payload.user_agent || null,
      device_type: deviceType,
      country: payload.country || null,
      city: payload.city || null,
      ip_hash: ipHash || null,
      is_bot: isBotVisit,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to record visit" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, is_bot: isBotVisit }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
