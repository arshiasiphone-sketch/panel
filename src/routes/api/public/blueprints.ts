import { createFileRoute } from "@tanstack/react-router";
import { cafeteriaBlueprint } from "@/lib/core/provision/blueprints/cafeteria-blueprint";

/**
 * GET /api/public/blueprints
 *
 * Public catalog of available workspace blueprints. Used by external callers
 * (e.g. Convex) to discover which blueprintSlug values are valid when calling
 * the provision endpoint.
 *
 * Returns a lightweight shape — never the full BlueprintInput manifest.
 */
export const Route = createFileRoute("/api/public/blueprints")({
  server: {
    handlers: {
      GET: () => {
        const blueprints = [cafeteriaBlueprint].map((b) => ({
          slug: b.slug,
          name: b.name,
          description: b.description,
        }));
        return Response.json(blueprints);
      },
    },
  },
});
