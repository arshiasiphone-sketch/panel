import { createFileRoute } from "@tanstack/react-router";
import { randomUUID } from "node:crypto";
import { ProvisionService } from "@/lib/core/provision/service";
import { WorkspaceRepository } from "@/lib/core/workspace/repository";
import { PLATFORM_DOMAIN } from "@/lib/constants";
import { getLogger } from "@/lib/logger";
import {
  provisionRequestSchema,
  type ProvisionRequestInput,
} from "@/lib/core/provision/validation";

// Build the full domain the platform expects (e.g. "foo.nama.app").
const fullDomain = (slug: string) => `${slug}.${PLATFORM_DOMAIN}`;

export const Route = createFileRoute("/api/provision")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Parse the in-app form payload (shape differs from the public API).
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ success: false, error: "invalid JSON body" }, { status: 400 });
        }

        const p = (body ?? {}) as Record<string, unknown>;
        const slug = String(p.slug ?? "");
        if (slug.length < 3) {
          return Response.json(
            { success: false, error: "slug must be at least 3 characters" },
            { status: 400 },
          );
        }

        const logger = getLogger();
        const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
        const repoDeps = { ...createSupabaseAdminProviders(), logger };
        const workspaceRepository = new WorkspaceRepository(repoDeps);
        const provisionService = new ProvisionService({
          repositoryDependencies: repoDeps,
          workspaceRepository,
        });

        // 2. Resolve a real blueprint. The in-app form uses display slugs
        // (e.g. "cafe-restaurant") that are not registered blueprint slugs;
        // only "cafeteria" is seeded, so fall back to it when unmatched.
        const requestedSlug = String(p.blueprintSlug ?? "cafeteria");
        const resolved =
          (await provisionService.getBlueprint(requestedSlug)) ??
          (await provisionService.getBlueprint("cafeteria"));
        if (!resolved) {
          return Response.json({ success: false, error: "no blueprint available" }, { status: 400 });
        }

        // 3. Map the form payload into a valid ProvisionRequestInput.
        const displayName = String(p.workspaceName ?? "My Site");
        const email = String(p.email ?? "");
        const input: ProvisionRequestInput = {
          blueprintSlug: resolved.slug,
          requestedSlug: slug,
          externalOrderId: randomUUID(),
          businessName: displayName,
          customerEmail: email || `${slug}@nama.app`,
          workspaceName: displayName,
          domain: fullDomain(slug),
          metadata: { theme: p.theme, phone: p.phone, customerEmail: p.email },
        };

        const parsed = provisionRequestSchema.safeParse(input);
        if (!parsed.success) {
          return Response.json(
            { success: false, error: "validation_failed", issues: parsed.error.flatten() },
            { status: 400 },
          );
        }

        // 4. Run the same provisioning engine the public API uses (isolation-safe).
        let report;
        try {
          report = await provisionService.provision(parsed.data);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return Response.json({ success: false, error: message }, { status: 500 });
        }

        if (report.success) {
          return Response.json(
            { success: true, workspaceId: report.workspace.id, domain: fullDomain(slug) },
            { status: 201 },
          );
        }

        const message = report.errors?.map((e) => e.message).join("; ") || "provision failed";
        return Response.json({ success: false, error: message }, { status: 500 });
      },
    },
  },
});
