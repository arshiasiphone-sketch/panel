/**
 * NAMA Platform — Public tenant content via SSR (service_role).
 *
 * The public landing page renders tenant data. To enable DB-enforced read
 * isolation (revoking anon SELECT later), public reads must NOT go through the
 * anon publishable client. This server function resolves the workspace from the
 * request and reads its scoped rows using the service_role key (bypasses RLS),
 * returning a single bundled object the landing page hydrates from the loader.
 *
 * Only the public landing page uses this. The admin panel keeps its own hooks.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { WorkspaceRepository } from "@/lib/core/workspace/repository";
import { resolveWorkspaceFromRequest } from "@/lib/core/workspace/resolver";
import { getLogger } from "@/lib/logger";

// Server→client dehydrated bundle of arbitrary DB rows. Typed loosely (any)
// because TanStack Start's strict serializability check rejects `unknown`.
export interface PublicWorkspaceContent {
  workspaceId: string | null;
  domain: string | null;
  theme: Record<string, unknown> | null;
  menu: any[];
  gallery: any[];
  events: any[];
  testimonials: any[];
  site: Record<string, any>;
  blocks: any[];
  personalities: any[];
}

const EMPTY: PublicWorkspaceContent = {
  workspaceId: null,
  domain: null,
  theme: null,
  menu: [],
  gallery: [],
  events: [],
  testimonials: [],
  site: {},
  blocks: [],
  personalities: [],
};

// The generated Supabase types predate the workspace_id columns, so the strict
// client types reject `.eq("workspace_id", ...)`. Scope via a loose cast — the
// column exists at runtime (verified against the live DB).
async function scoped(table: string, workspaceId: string): Promise<Record<string, unknown>[]> {
  const q = supabaseAdmin.from(table as never).select("*").eq("workspace_id" as never, workspaceId) as never;
  const { data, error } = await q;
  if (error) {
    getLogger().error("public-content scoped read failed", { table, workspaceId, error });
    return [];
  }
  return (data ?? []) as Record<string, unknown>[];
}

async function resolveWorkspaceId(request: Request): Promise<{
  workspaceId: string | null;
  domain: string | null;
}> {
  const url = new URL(request.url);
  const preview = url.searchParams.get("preview_domain");

  const host = request.headers.get("host") ?? url.host;
  const hostParts = host.split(".");
  const isSubdomain = hostParts.length > 2 && hostParts[0] !== "www";
  const subdomain = isSubdomain ? hostParts[0] : undefined;

  const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
  const repoDeps = { ...createSupabaseAdminProviders(), logger: getLogger() };
  const workspaceRepository = new WorkspaceRepository(repoDeps);

  const domain = preview ?? subdomain;
  const ctx = await resolveWorkspaceFromRequest(
    { workspaceRepository },
    { domain, isSubdomain: !!preview ? false : isSubdomain },
  );
  return {
    workspaceId: ctx.workspaceId ?? null,
    domain: (ctx.entity?.metadata?.domain as string | undefined) ?? domain ?? null,
  };
}

async function readScoped(workspaceId: string): Promise<PublicWorkspaceContent> {
  const [menu, gallery, events, testimonials, siteRows, blocks, personalities, themes] = await Promise.all([
    scoped("menu_items", workspaceId),
    scoped("gallery_images", workspaceId),
    scoped("events", workspaceId),
    scoped("testimonials", workspaceId),
    scoped("site_content", workspaceId),
    scoped("page_blocks", workspaceId),
    scoped("personality_profiles", workspaceId),
    scoped("theme_settings", workspaceId),
  ]);

  const site: Record<string, Record<string, unknown>> = {};
  for (const row of siteRows) {
    site[String(row.key)] = (row.value as Record<string, unknown>) ?? {};
  }

  return {
    workspaceId,
    domain: null,
    theme: (themes[0] as Record<string, unknown> | undefined) ?? null,
    menu,
    gallery,
    events,
    testimonials,
    site,
    blocks,
    personalities,
  };
}

export const getPublicWorkspaceContent = createServerFn({ method: "POST" })
  .inputValidator((data: { workspaceId?: string; domain?: string }) => data)
  .handler(async ({ data }) => {
    let workspaceId = data.workspaceId ?? null;
    let domain = data.domain ?? null;

    if (!workspaceId) {
      const request = getRequest();
      if (request) {
        const resolved = await resolveWorkspaceId(request);
        workspaceId = resolved.workspaceId;
        domain = resolved.domain;
      }
    }

    if (!workspaceId) return { ...EMPTY, domain };
    const content = await readScoped(workspaceId);
    return { ...content, domain };
  });
