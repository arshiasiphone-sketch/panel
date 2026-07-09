import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/provision-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const externalOrderId = new URL(request.url).searchParams.get("externalOrderId");
        if (!externalOrderId) {
          return Response.json(
            { error: "externalOrderId query parameter is required" },
            { status: 400 },
          );
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("provision_transactions")
          .select("*")
          .eq("external_order_id", externalOrderId)
          .maybeSingle();

        if (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }
        if (!data) {
          return Response.json({ found: false }, { status: 404 });
        }

        // domain is only meaningful once provisioning succeeded; join via workspace_id.
        let domain: string | null = null;
        if (data.workspace_id && data.status === "completed") {
          const { data: ws } = await supabaseAdmin
            .from("workspaces")
            .select("domain")
            .eq("id", data.workspace_id)
            .maybeSingle();
          domain = (ws?.domain as string | undefined) ?? null;
        }

        return Response.json({
          externalOrderId,
          status: data.status === "completed" ? "ready" : data.status,
          domain,
          error: data.error ?? null,
        });
      },
    },
  },
});
