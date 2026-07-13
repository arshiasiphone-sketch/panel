/**
 * One-off data fix: re-isolate legacy workspaces that were provisioned BEFORE the
 * write-isolation fix, so their content landed in the shared DEFAULT workspace
 * (00000000-0000-0000-0000-000000000001). Each listed slug is deleted and
 * re-provisioned (fresh, isolated content), then the two workspaces that were
 * correctly isolated but stuck at `provisioning` are flipped to `active`.
 *
 * Runs the SAME ProvisionEngine the API uses — no data is hand-edited.
 * Safe to re-run (deletes-then-recreates; result is idempotent).
 *
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the environment.
 * Run with:  bun run _reprovision_workspaces.ts
 */
import { randomUUID } from "node:crypto";
import { createSupabaseAdminProviders } from "@/lib/providers/supabase";
import { WorkspaceRepository } from "@/lib/core/workspace/repository";
import { ProvisionService } from "@/lib/core/provision/service";
import { getLogger } from "@/lib/logger";
import { PLATFORM_DOMAIN } from "@/lib/constants";
import type { ProvisionRequestInput } from "@/lib/core/provision/validation";

const fullDomain = (slug: string) => `${slug}.${PLATFORM_DOMAIN}`;

// DRY_RUN=1 → connect, load blueprint, and report exactly what WOULD be done
// (lookups + intent) without deleting or re-provisioning anything. Use it to
// validate the runtime and credentials before running for real.
const DRY_RUN = process.env.DRY_RUN === "1";

// Workspaces that dumped their content into DEFAULT — wipe + re-provision.
const OLD_SLUGS = [
  "khane",
  "e2e-provision-01",
  "e2e-provision-02",
  "test-cafe-001",
  "cafeteria-mrfsnhoe",
];

// Workspaces that provisioned correctly but never flipped to active (Signature B).
const FLIP_SLUGS = ["yek", "test2"];

async function main() {
  const logger = getLogger();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Load them first (e.g. `node --env-file=.env`).",
    );
  }

  if (DRY_RUN) console.log("[DRY_RUN] No writes will be performed.\n");

  const repoDeps = { ...createSupabaseAdminProviders(), logger };
  const db = repoDeps.database;
  const workspaceRepository = new WorkspaceRepository(repoDeps);
  const provisionService = new ProvisionService({
    repositoryDependencies: repoDeps,
    workspaceRepository,
  });

  const blueprint = await provisionService.getBlueprint("cafeteria");
  if (!blueprint) {
    throw new Error("cafeteria blueprint not found — cannot re-provision");
  }
  console.log(`Blueprint loaded: ${blueprint.slug} v${blueprint.version}`);

  // 1. Re-provision old workspaces (isolated content).
  for (const slug of OLD_SLUGS) {
    const domain = fullDomain(slug);
    console.log(`\n=== Re-provisioning ${slug} (${domain}) ===`);

    const { data: existing, error: findErr } = await db
      .from("workspaces")
      .select("id, status")
      .eq("domain", domain)
      .maybeSingle();
    if (findErr) throw new Error(`lookup failed for ${slug}: ${String(findErr)}`);

    if (existing) {
      if (DRY_RUN) {
        console.log(`  [DRY_RUN] would DELETE workspace ${existing.id} (status ${existing.status}) + its provision_transactions`);
      } else {
        console.log(`  deleting old workspace ${existing.id} (status ${existing.status})`);
        const { error: txErr } = await db
          .from("provision_transactions")
          .delete()
          .eq("workspace_id", existing.id);
        if (txErr) throw new Error(`delete transactions failed for ${slug}: ${String(txErr)}`);
        const { error: wsErr } = await db.from("workspaces").delete().eq("id", existing.id);
        if (wsErr) throw new Error(`delete workspace failed for ${slug}: ${String(wsErr)}`);
      }
    } else {
      console.log("  no existing workspace row — provisioning fresh");
    }

    if (DRY_RUN) {
      console.log("  [DRY_RUN] would provision a fresh isolated workspace");
      continue;
    }

    const input: ProvisionRequestInput = {
      blueprintSlug: "cafeteria",
      requestedSlug: slug,
      externalOrderId: randomUUID(),
      businessName: slug,
      customerEmail: `${slug}@nama.app`,
      workspaceName: slug,
      domain,
      metadata: {},
    };

    const report = await provisionService.provision(input);
    if (report.success) {
      console.log(`  OK → workspace ${report.workspace.id} (status ${report.workspace.status})`);
    } else {
      const msg = report.errors?.map((e) => e.message).join("; ") || "unknown error";
      console.error(`  FAILED: ${msg}`);
    }
  }

  // 2. Flip correctly-isolated-but-stuck workspaces to active.
  for (const slug of FLIP_SLUGS) {
    const domain = fullDomain(slug);
    const { data: ws, error } = await db
      .from("workspaces")
      .select("id, status")
      .eq("domain", domain)
      .maybeSingle();
    if (error) throw new Error(`lookup failed for ${slug}: ${String(error)}`);
    if (!ws) {
      console.log(`\n${slug}: not found, skipping`);
      continue;
    }
    console.log(`\n=== Flipping ${slug} (${ws.id}) ${ws.status} → active ===`);
    if (DRY_RUN) {
      console.log("  [DRY_RUN] would set workspaces.status=active and provision_transactions.status=completed");
      continue;
    }
    const { error: wsErr } = await db.from("workspaces").update({ status: "active" }).eq("id", ws.id);
    if (wsErr) throw new Error(`update workspace failed for ${slug}: ${String(wsErr)}`);
    const { error: txErr } = await db
      .from("provision_transactions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("workspace_id", ws.id);
    if (txErr) throw new Error(`update transaction failed for ${slug}: ${String(txErr)}`);
    console.log("  done");
  }

  console.log("\nRe-provision complete.");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
