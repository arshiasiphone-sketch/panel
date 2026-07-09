-- ============================================================
-- Public Provisioning API — idempotency key
--
-- Adds external_order_id to provision_transactions so the Public
-- Provisioning API (Convex sales panel, etc.) can guarantee
-- exactly-once provisioning per external order.
--
-- The column is NULLable and uniquely constrained ONLY for
-- non-NULL values (partial unique index), so:
--   - legacy rows without an external order keep external_order_id = NULL
--   - each external order id may appear at most once
-- ============================================================

ALTER TABLE public.provision_transactions
  ADD COLUMN IF NOT EXISTS external_order_id text;

-- Unique per non-null external_order_id only (allows many NULLs).
CREATE UNIQUE INDEX IF NOT EXISTS provision_transactions_external_order_id_key
  ON public.provision_transactions (external_order_id)
  WHERE external_order_id IS NOT NULL;
