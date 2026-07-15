-- ============================================================================
-- Migration #1c: backfill owner_user_id on existing workspaces
--
-- Every custom workspace was provisioned with owner_user_id = NULL (the self-serve
-- ownership flow didn't exist yet). Migration #1b keeps them editable by platform
-- admins, but for TRUE self-serve each tenant should be owned by its customer.
--
-- This backfill assigns a single platform-admin owner to the legacy workspaces so
-- they remain manageable. To give each its REAL customer owner instead, replace the
-- id below per domain (see the per-workspace UPDATEs).
--
-- Replace PLATFORM_ADMIN_ID with your actual admin user id (auth.users.id).
-- Safe to re-run: it only touches rows where owner_user_id IS NULL.
-- ============================================================================

DO $$
DECLARE
  v_admin text := 'PLATFORM_ADMIN_ID'; -- <-- replace with real admin user id
BEGIN
  -- Default: assign all null-owned workspaces to the platform admin.
  UPDATE public.workspaces
  SET owner_user_id = v_admin
  WHERE owner_user_id IS NULL
    AND id <> '00000000-0000-0000-0000-000000000001'; -- never touch the default ws

  -- Optional: give specific workspaces their real customer owner.
  -- Uncomment and set the correct customer auth user id for each domain:
  -- UPDATE public.workspaces SET owner_user_id = 'CUSTOMER_UUID_FOR_KHANE' WHERE domain = 'khane.nama.app';
  -- UPDATE public.workspaces SET owner_user_id = 'CUSTOMER_UUID_FOR_YEK'   WHERE domain = 'yek.nama.app';
END $$;
