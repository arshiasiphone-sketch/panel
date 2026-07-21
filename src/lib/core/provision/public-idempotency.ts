/**
 * Public Provisioning API — idempotency + transaction journaling.
 *
 * IMPORTANT: ProvisionTransactionManager (the engine's own manager) persists to
 * site_content, NOT to the provision_transactions table. The Public API owns that
 * table directly so it can (a) guarantee idempotency by external_order_id and
 * (b) let /api/public/provision-status read status without the engine in the loop.
 *
 * This module is server-only — it dynamically imports supabaseAdmin so it never
 * leaks into the client bundle, regardless of how it is imported.
 */

import type { ProvisionTransactionStatus } from "./types";

export interface ProvisionTransactionRow {
  id: string;
  external_order_id: string | null;
  workspace_id: string | null;
  blueprint_slug: string | null;
  blueprint_version: string | null;
  status: ProvisionTransactionStatus;
  error: string | null;
  started_at: string;
  completed_at: string | null;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

/** Find a provision transaction by its external order id (NULL if none). */
export async function findTransactionByExternalOrderId(
  externalOrderId: string,
): Promise<ProvisionTransactionRow | null> {
  const db = await admin();
  const { data, error } = await db
    .from("provision_transactions")
    .select("*")
    .eq("external_order_id", externalOrderId)
    .maybeSingle();
  if (error) throw new Error(`idempotency lookup failed: ${error.message}`);
  return (data as ProvisionTransactionRow | null) ?? null;
}

export interface CreateTransactionInput {
  externalOrderId: string;
  blueprintSlug: string;
  blueprintVersion?: string;
  workspaceId?: string | null;
  /** Defaults to "in_progress". */
  status?: ProvisionTransactionStatus;
  /**
   * initiated_by for the Public API is NULL (no auth user). The column is a uuid
   * FK, so a non-uuid string would fail the insert — keep it null.
   */
  initiatedBy?: string | null;
}

/** Insert a new provision transaction row; returns its id. */
export async function createTransaction(input: CreateTransactionInput): Promise<string> {
  const db = await admin();
  const { data, error } = await db
    .from("provision_transactions")
    .insert({
      external_order_id: input.externalOrderId,
      blueprint_slug: input.blueprintSlug,
      blueprint_version: input.blueprintVersion ?? "latest",
      workspace_id: input.workspaceId ?? null,
      status: input.status ?? "in_progress",
      initiated_by: input.initiatedBy ?? null,
    })
    .select("id")
    .single();
  if (error) throw new Error(`failed to create transaction: ${error.message}`);
  return (data as { id: string }).id;
}

export interface UpdateTransactionPatch {
  status?: ProvisionTransactionStatus;
  workspaceId?: string | null;
  error?: string | null;
}

/** Patch a provision transaction (sets completed_at when terminal). */
export async function updateTransaction(id: string, patch: UpdateTransactionPatch): Promise<void> {
  const db = await admin();
  const terminal = patch.status === "completed" || patch.status === "failed";
  const { error } = await db
    .from("provision_transactions")
    .update({
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.workspaceId !== undefined ? { workspace_id: patch.workspaceId } : {}),
      ...(patch.error !== undefined ? { error: patch.error } : {}),
      ...(terminal ? { completed_at: new Date().toISOString() } : {}),
    })
    .eq("id", id);
  if (error) throw new Error(`failed to update transaction: ${error.message}`);
}
