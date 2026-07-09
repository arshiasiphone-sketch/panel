-- ==========================================
-- MIGRATION 11: workspaces table + data migration
-- ==========================================
-- Creates a proper SQL table for workspaces, migrates existing data
-- from site_content (key pattern workspace:{id}:entity).
-- This is the foundation for multi-tenant workspace isolation.

-- ============ 1. Create workspaces table ============
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE,
  owner_user_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  plan TEXT NOT NULL DEFAULT 'free',
  limits JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS workspaces_domain_idx ON public.workspaces (domain);
CREATE INDEX IF NOT EXISTS workspaces_owner_user_id_idx ON public.workspaces (owner_user_id);
CREATE INDEX IF NOT EXISTS workspaces_status_idx ON public.workspaces (status);

-- updated_at trigger
DO $$ BEGIN
  CREATE TRIGGER workspaces_updated BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ 2. Grant permissions ============
GRANT SELECT ON public.workspaces TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT ALL ON public.workspaces TO service_role;

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public read workspaces" ON public.workspaces FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin write workspaces" ON public.workspaces FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ 3. Migrate existing data from site_content ============
-- Existing workspaces are stored as site_content rows with key = 'workspace:{id}:entity'
-- and value = full WorkspaceEntity JSONB.
-- We extract these and insert into the new workspaces table.

INSERT INTO public.workspaces (id, domain, owner_user_id, status, plan, limits, metadata, created_at, updated_at)
SELECT
  -- Extract workspace ID from key pattern 'workspace:{id}:entity'
  (regexp_match(sc.key, '^workspace:(.+):entity$'))[1]::uuid AS id,
  -- domain is stored in metadata->>'domain'
  (sc.value->'metadata'->>'domain')::text AS domain,
  -- owner_user_id: first membership with role 'owner'
  (SELECT (membership_item->>'userId')::text
   FROM jsonb_array_elements(sc.value->'membership') AS membership_item
   WHERE membership_item->>'role' = 'owner'
   LIMIT 1) AS owner_user_id,
  -- status
  COALESCE(sc.value->>'status', 'active') AS status,
  -- plan
  COALESCE(sc.value->>'plan', 'free') AS plan,
  -- limits (full object)
  COALESCE(sc.value->'limits', '{}'::jsonb) AS limits,
  -- metadata (full object)
  COALESCE(sc.value->'metadata', '{}'::jsonb) AS metadata,
  -- created_at from metadata
  COALESCE(
    (sc.value->'metadata'->>'createdAt')::timestamptz,
    (sc.value->'metadata'->>'created_at')::timestamptz,
    now()
  ) AS created_at,
  -- updated_at from metadata
  COALESCE(
    (sc.value->'metadata'->>'updatedAt')::timestamptz,
    (sc.value->'metadata'->>'updated_at')::timestamptz,
    now()
  ) AS updated_at
FROM public.site_content sc
WHERE sc.key LIKE 'workspace:%:entity'
  AND sc.key ~ '^workspace:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:entity$'
ON CONFLICT (id) DO NOTHING;

-- ============ 4. Ensure DEFAULT_WORKSPACE exists ============
-- The default workspace (00000000-0000-0000-0000-000000000001) is for the
-- original single-tenant site. Create it if no workspace was migrated.
INSERT INTO public.workspaces (id, domain, owner_user_id, status, plan, limits, metadata)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  current_setting('app.platform_domain', true),
  NULL,
  'active',
  'free',
  '{"maxPages":100,"maxMedia":100,"maxStorage":524288000,"maxTemplates":5,"maxAdmins":5,"maxAnalyticsRetention":90,"maxVisitors":10000}'::jsonb,
  jsonb_build_object(
    'name', COALESCE(
      (SELECT value->'metadata'->>'name' FROM public.site_content WHERE key LIKE 'workspace:%:entity' LIMIT 1),
      'کافه خانه'
    ),
    'locale', 'fa-IR',
    'timezone', 'Asia/Tehran',
    'domain', current_setting('app.platform_domain', true),
    'createdAt', now()::text,
    'updatedAt', now()::text
  )
)
ON CONFLICT (id) DO NOTHING;

-- 4b. Set app.platform_domain if not set (for local dev)
-- This allows local testing without the setting
UPDATE public.workspaces
SET domain = 'localhost'
WHERE id = '00000000-0000-0000-0000-000000000001'
  AND domain IS NULL;

-- ============ 5. Add to realtime publication ============
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.workspaces;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
