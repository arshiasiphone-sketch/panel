import { createFileRoute } from "@tanstack/react-router";
import { PLATFORM_DOMAIN } from "@/lib/constants";
import { WorkspaceRepository } from "@/lib/core/workspace/repository";
import { getLogger } from "@/lib/logger";
import type { RepositoryDependencies } from "@/lib/repositories/base";

// Slug format — must match provisionRequestSchema.requestedSlug:
// lowercase letters, numbers, hyphens; 3-30 chars.
const SLUG_RE = /^[a-z0-9-]{3,30}$/;

export const Route = createFileRoute("/api/public/check-slug")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");

        if (!slug) {
          return Response.json(
            { error: "slug query parameter is required" },
            { status: 400 },
          );
        }

        if (!SLUG_RE.test(slug)) {
          return Response.json({ available: false, reason: "invalid_slug" });
        }

        // The platform stores the FULL domain (e.g. "foo.nama.app") in
        // workspaces.domain. findBySubdomain queries a non-existent column
        // and is a latent bug, so we use findByDomain with the full domain.
        const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
        const repoDeps: RepositoryDependencies = {
          ...createSupabaseAdminProviders(),
          logger: getLogger(),
        };
        const workspaceRepository = new WorkspaceRepository(repoDeps);

        const existing = await workspaceRepository.findByDomain(`${slug}.${PLATFORM_DOMAIN}`);
        return Response.json({
          available: existing === null,
          ...(existing ? { reason: "taken" } : {}),
        });
      },
    },
  },
});
