-- ============================================================================
-- NAMA Platform — Authoritative multi-tenant isolation (consolidated v2).
--
-- v2 fix: the previous version wrapped DROP+CREATE inside a DO block; when the
-- CREATE hit "policy already exists" (leftover from migration #1b), the whole
-- block rolled back, leaving the stale policies in place and re-triggering the
-- error on every re-run. Here every DROP is a standalone, idempotent statement
-- executed BEFORE any CREATE, so re-running is always safe.
--
-- GUARANTEES:
--   1. WRITES owner-scoped: owner OR platform admin.
--   2. READS on tenant tables: anon SELECT revoked (SSR reads via service_role).
--   3. theme_settings: global singleton, stays PUBLIC read (page must not 500).
--   4. Ownership backfill for NULL-owned workspaces (except platform default).
-- ============================================================================

-- Helper (re-create idempotently)
CREATE OR REPLACE FUNCTION public.user_owns_workspace(_workspace_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = _workspace_id
      AND w.owner_user_id IS NOT NULL
      AND w.owner_user_id = auth.uid()::text
  );
$$;

-- ---------------------------------------------------------------------------
-- DROP every possible legacy/current policy name (standalone, idempotent).
-- Run these unconditionally before any CREATE so re-runs never 42710.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public read menu" ON public.menu_items;
DROP POLICY IF EXISTS "admin write menu" ON public.menu_items;
DROP POLICY IF EXISTS "owner write menu" ON public.menu_items;
DROP POLICY IF EXISTS "owner or admin write menu" ON public.menu_items;

DROP POLICY IF EXISTS "public read gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "admin write gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "owner write gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "owner or admin write gallery" ON public.gallery_images;

DROP POLICY IF EXISTS "public read events" ON public.events;
DROP POLICY IF EXISTS "admin write events" ON public.events;
DROP POLICY IF EXISTS "owner write events" ON public.events;
DROP POLICY IF EXISTS "owner or admin write events" ON public.events;

DROP POLICY IF EXISTS "public read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "admin write testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "owner write testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "owner or admin write testimonials" ON public.testimonials;

DROP POLICY IF EXISTS "public read site content" ON public.site_content;
DROP POLICY IF EXISTS "admin write site content" ON public.site_content;
DROP POLICY IF EXISTS "owner write site content" ON public.site_content;
DROP POLICY IF EXISTS "owner or admin write site content" ON public.site_content;

DROP POLICY IF EXISTS "public read blocks" ON public.page_blocks;
DROP POLICY IF EXISTS "admin write blocks" ON public.page_blocks;
DROP POLICY IF EXISTS "owner write blocks" ON public.page_blocks;
DROP POLICY IF EXISTS "owner or admin write blocks" ON public.page_blocks;

DROP POLICY IF EXISTS "public read personalities" ON public.personality_profiles;
DROP POLICY IF EXISTS "admin write personalities" ON public.personality_profiles;
DROP POLICY IF EXISTS "owner write personalities" ON public.personality_profiles;
DROP POLICY IF EXISTS "owner or admin write personalities" ON public.personality_profiles;

DROP POLICY IF EXISTS "public read theme" ON public.theme_settings;
DROP POLICY IF EXISTS "admin write theme" ON public.theme_settings;

-- ---------------------------------------------------------------------------
-- CREATE the consolidated policies
-- ---------------------------------------------------------------------------
CREATE POLICY "owner or admin write menu" ON public.menu_items
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "owner or admin write gallery" ON public.gallery_images
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "owner or admin write events" ON public.events
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "owner or admin write testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "owner or admin write site content" ON public.site_content
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "owner or admin write blocks" ON public.page_blocks
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "owner or admin write personalities" ON public.personality_profiles
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.user_owns_workspace(workspace_id) OR public.has_role(auth.uid(),'admin'));

-- theme_settings: global singleton, public read + admin write
CREATE POLICY "public read theme" ON public.theme_settings
  FOR SELECT TO anon USING (true);
CREATE POLICY "admin write theme" ON public.theme_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ---------------------------------------------------------------------------
-- Revoke anon SELECT on tenant tables (public reads now via service_role SSR)
-- ---------------------------------------------------------------------------
REVOKE SELECT ON public.menu_items FROM anon;
REVOKE SELECT ON public.gallery_images FROM anon;
REVOKE SELECT ON public.events FROM anon;
REVOKE SELECT ON public.testimonials FROM anon;
REVOKE SELECT ON public.site_content FROM anon;
REVOKE SELECT ON public.page_blocks FROM anon;
REVOKE SELECT ON public.personality_profiles FROM anon;

-- ---------------------------------------------------------------------------
-- Ownership backfill (idempotent: only NULL-owned, non-default workspaces)
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_admin uuid;
  v_default uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  SELECT id INTO v_admin FROM auth.users WHERE email = 'arshiasiphone@gmail.com' LIMIT 1;
  IF v_admin IS NOT NULL THEN
    UPDATE public.workspaces
       SET owner_user_id = v_admin::text
     WHERE owner_user_id IS NULL
       AND id <> v_default;
  END IF;
END $$;

-- ===========================================================================
-- Verify after applying:
--   SELECT table_name FROM information_schema.role_table_grants
--   WHERE grantee='anon' AND table_schema='public'
--     AND table_name IN ('menu_items','gallery_images','events','testimonials',
--                        'site_content','page_blocks','personality_profiles');
--   → expect 0 rows. theme_settings SHOULD still appear.
-- ============================================================================
