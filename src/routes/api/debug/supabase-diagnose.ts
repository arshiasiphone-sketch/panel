import { createFileRoute } from "@tanstack/react-router";
import { loadServerEnv } from "@/lib/env.server";
import { createSupabaseAdminProviders } from "@/lib/providers/supabase";
import { WorkspaceRepository } from "@/lib/core/workspace/repository";

export const Route = createFileRoute("/api/debug/supabase-diagnose")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        loadServerEnv();
        const SUPABASE_URL = process.env.SUPABASE_URL ?? null;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? null;
        const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
        const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? null;

        const domain = new URL(request.url).searchParams.get("domain") || "khane.nama.app";

        const results: any = {
          env: {
            SUPABASE_URL,
            VITE_SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY: SUPABASE_PUBLISHABLE_KEY ? String(SUPABASE_PUBLISHABLE_KEY).replace(/(.{6}).+(.{4})/, "$1…$2") : null,
            SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY ? String(SUPABASE_SERVICE_ROLE_KEY).replace(/(.{6}).+(.{4})/, "$1…$2") : null,
          },
        };

        // Direct REST fetch using service role key
        try {
          const restUrl = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/workspaces?select=*&domain=eq.${encodeURIComponent(domain)}`;
          const headers: Record<string,string> = {
            apikey: SUPABASE_SERVICE_ROLE_KEY ?? "",
            Authorization: SUPABASE_SERVICE_ROLE_KEY ? `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` : "",
            Accept: "application/json",
          };

          const t0 = Date.now();
          const resp = await fetch(restUrl, { headers });
          const took = Date.now() - t0;
          const text = await resp.text();
          let json;
          try { json = JSON.parse(text); } catch(e){ json = text; }

          results.rest = {
            restUrl,
            headersSent: headers,
            status: resp.status,
            statusText: resp.statusText,
            body: json,
            tookMs: took,
          };
        } catch (err) {
          results.rest = { error: String(err) };
        }

        // Now run through WorkspaceRepository using admin providers
        try {
          const providers = createSupabaseAdminProviders();
          const repoDeps = { ...providers, logger: console };
          const repo = new WorkspaceRepository(repoDeps);
          const t0 = Date.now();
          const found = await repo.findByDomain(domain);
          const took = Date.now() - t0;
          results.repo = { found: found ?? null, tookMs: took };
        } catch (err) {
          results.repo = { error: String(err) };
        }

        return new Response(JSON.stringify(results, null, 2), { headers: { "Content-Type": "application/json" } });
      },
    },
  },
});
