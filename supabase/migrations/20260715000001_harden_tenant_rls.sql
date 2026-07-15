-- ============================================================================
-- Harden multi-tenant RLS: owner-scoped writes + DB-enforced tenant read scoping
--
-- Context: prior policies allowed any authenticated admin to write ANY tenant's
-- rows (no workspace_id / ownership check) and allowed anon to read across tenants
-- (USING (true)). Tenant read isolation now moves to the server: public reads are
-- served by SSR/API routes using the service_role key (which bypasses RLS), so the
-- anon client no longer needs table-level SELECT. Writes become owner-scoped.
--
-- NOTE: there is no workspace_members table; ownership is workspaces.owner_user_id
-- (TEXT, compared to auth.uid()::text).
-- ============================================================================

-- Helper: is the current user the owner of the row's workspace?
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
-- menu_items
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public read menu" ON public.menu_items;
DROP POLICY IF EXISTS "admin write menu" ON public.menu_items;
CREATE POLICY "owner write menu" ON public.menu_items
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id))
  WITH CHECK (public.user_owns_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- gallery_images
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public read gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "admin write gallery" ON public.gallery_images;
CREATE POLICY "owner write gallery" ON public.gallery_images
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id))
  WITH CHECK (public.user_owns_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public read events" ON public.events;
DROP POLICY IF EXISTS "admin write events" ON public.events;
CREATE POLICY "owner write events" ON public.events
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id))
  WITH CHECK (public.user_owns_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "admin write testimonials" ON public.testimonials;
CREATE POLICY "owner write testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id))
  WITH CHECK (public.user_owns_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- site_content
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public read site content" ON public.site_content;
DROP POLICY IF EXISTS "admin write site content" ON public.site_content;
CREATE POLICY "owner write site content" ON public.site_content
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id))
  WITH CHECK (public.user_owns_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- page_blocks
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public read blocks" ON public.page_blocks;
DROP POLICY IF EXISTS "admin write blocks" ON public.page_blocks;
CREATE POLICY "owner write blocks" ON public.page_blocks
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id))
  WITH CHECK (public.user_owns_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- personality_profiles
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public read personalities" ON public.personality_profiles;
DROP POLICY IF EXISTS "admin write personalities" ON public.personality_profiles;
CREATE POLICY "owner write personalities" ON public.personality_profiles
  FOR ALL TO authenticated
  USING (public.user_owns_workspace(workspace_id))
  WITH CHECK (public.user_owns_workspace(workspace_id));

-- ---------------------------------------------------------------------------
-- theme_settings (global singleton, id=1) — keep admin-writable, no workspace scope
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public read theme" ON public.theme_settings;
DROP POLICY IF EXISTS "admin write theme" ON public.theme_settings;
CREATE POLICY "admin write theme" ON public.theme_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ===========================================================================
-- READ access: anon table-level SELECT is intentionally KEPT for now.
-- Public reads currently happen client-side via the publishable key. Revoking
-- anon SELECT must happen ONLY AFTER the public site reads are moved to SSR
-- (server functions using the service_role key, which bypasses RLS).
-- See migration 20260715000002_revoke_anon_tenant_reads.sql (apply after SSR).
-- ===========================================================================
-- REVOKE SELECT ON public.menu_items FROM anon;            -- deferred to SSR step
-- REVOKE SELECT ON public.gallery_images FROM anon;
-- REVOKE SELECT ON public.events FROM anon;
-- REVOKE SELECT ON public.testimonials FROM anon;
-- REVOKE SELECT ON public.site_content FROM anon;
-- REVOKE SELECT ON public.page_blocks FROM anon;
-- REVOKE SELECT ON public.personality_profiles FROM anon;

-- theme_settings remains publicly readable (global singleton, no tenant data)
-- GRANT SELECT ON public.theme_settings TO anon; -- already granted, keep as-is
