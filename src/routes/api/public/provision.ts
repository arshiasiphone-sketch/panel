import { createFileRoute } from "@tanstack/react-router";
import { provisionRequestSchema, type ProvisionRequestInput } from "@/lib/core/provision/validation";
import { ProvisionService } from "@/lib/core/provision/service";
import { WorkspaceRepository } from "@/lib/core/workspace/repository";
import { PLATFORM_DOMAIN } from "@/lib/constants";
import { getLogger } from "@/lib/logger";
import type { RepositoryDependencies } from "@/lib/repositories/base";
import type { ProvisionReport } from "@/lib/core/provision/types";
import {
  findTransactionByExternalOrderId,
  createTransaction,
  updateTransaction,
} from "@/lib/core/provision/public-idempotency";

// Build the full domain the platform expects (e.g. "foo.nama.app").
const fullDomain = (slug: string) => `${slug}.${PLATFORM_DOMAIN}`;

function unauthorized() {
  return Response.json({ success: false, error: "unauthorized" }, { status: 401 });
}

export const Route = createFileRoute("/api/public/provision")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. API key gate (X-API-Key vs NAMA_PUBLIC_API_KEY).
        const expectedKey = process.env.NAMA_PUBLIC_API_KEY;
        const providedKey = request.headers.get("x-api-key");
        if (!expectedKey || providedKey !== expectedKey) {
          return unauthorized();
        }

        // 2. Parse + validate the request body.
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ success: false, error: "invalid JSON body" }, { status: 400 });
        }

        const parsed = provisionRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { success: false, error: "validation_failed", issues: parsed.error.flatten() },
            { status: 400 },
          );
        }
        const input = parsed.data;
        const domain = fullDomain(input.requestedSlug);

        // 3. Idempotency by externalOrderId.
        const existing = await findTransactionByExternalOrderId(input.externalOrderId);
        if (existing && existing.status === "completed") {
          // Already provisioned → return the existing workspace, no re-provision.
          return Response.json(
            {
              success: true,
              workspaceId: existing.workspace_id,
              domain,
              status: "already_exists",
            },
            { status: 200 },
          );
        }

        // 4. Open (or reuse a failed) transaction row for status tracking.
        let txId: string;
        if (existing && existing.status === "failed") {
          txId = existing.id; // design decision: allow retry of failed orders
          await updateTransaction(txId, { status: "in_progress", error: null });
        } else {
          txId = await createTransaction({
            externalOrderId: input.externalOrderId,
            blueprintSlug: input.blueprintSlug,
            blueprintVersion: input.blueprintVersion,
          });
        }

        // 5. Assemble + run the provisioning service inline (fully awaited).
        const logger = getLogger();
        const { createSupabaseAdminProviders } = await import("@/lib/providers/supabase");
        const repoDeps: RepositoryDependencies = {
          ...createSupabaseAdminProviders(),
          logger,
        };
        const workspaceRepository = new WorkspaceRepository(repoDeps);
        const provisionService = new ProvisionService({
          repositoryDependencies: repoDeps,
          workspaceRepository,
        });

        const provisionInput: ProvisionRequestInput = {
          ...input,
          domain,
          workspaceName: input.businessName,
          metadata: { ...(input.metadata ?? {}), customerEmail: input.customerEmail },
        };

        let report: ProvisionReport;
        try {
          report = await provisionService.provision(provisionInput);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          await updateTransaction(txId, { status: "failed", error: message });
          return Response.json({ success: false, error: message }, { status: 500 });
        }

        // 6. Map the report to the public contract.
        if (report.success) {
          await updateTransaction(txId, {
            status: "completed",
            workspaceId: report.workspace.id,
            error: null,
          });
          return Response.json(
            {
              success: true,
              workspaceId: report.workspace.id,
              domain,
              status: "ready",
            },
            { status: 201 },
          );
        }

        const message =
          report.errors?.map((e) => e.message).join("; ") || "provision failed";
        await updateTransaction(txId, { status: "failed", error: message });
        return Response.json({ success: false, error: message }, { status: 500 });
      },
    },
  },
});
