-- ============================================================================
-- CONSOLIDATED PROVISION ISOLATION MIGRATION (paste-ready)
-- ============================================================================
-- Combines migrations 02, 03, 04, 09 into a single idempotent script.
-- Apply by pasting the ENTIRE contents into the Supabase SQL Editor and
-- running it once.
--
-- Order matters:
--   02  theme_settings / theme_history get workspace_id (composite PK)
--   03  every content table gets workspace_id (composite PK + FK + backfill)
--   04  provisioning infra: blueprints / provision_transactions / provision_steps
--   09  external_order_id idempotency column on provision_transactions
--
-- Idempotency: every statement uses IF NOT EXISTS / DROP ... IF EXISTS /
-- ON CONFLICT, so re-running is harmless.
--
-- PREREQUISITE: migration 01 (workspaces table) must already be applied.
-- It is — the `yek.nama.app` row exists, proving the workspaces table
-- is live. This script's FKs reference public.workspaces(id).
--
-- AFTER APPLYING:
--   1. Re-provision any workspace created before this ran (its seed steps
--      errored on the missing workspace_id column, so it has no content).
--   2. Regenerate database.types.ts so the `provision_transactions` /
--      `workspaces` / `workspace_id` columns are reflected and the tsc
--      errors clear.
-- ============================================================================


-- ============================================================================
-- MIGRATION 12: theme_settings composite PK (workspace_id, id)
-- ============================================================================

-- ============ 1. theme_settings: add workspace_id ============
ALTER TABLE public.theme_settings
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.theme_settings
SET workspace_id = '00000000-0000-0000-0000-000000000001'
WHERE workspace_id IS NULL;

-- ============ 2. theme_settings: change PK ============
ALTER TABLE public.theme_settings DROP CONSTRAINT IF EXISTS theme_settings_pkey;
ALTER TABLE public.theme_settings ADD PRIMARY KEY (workspace_id, id);

CREATE INDEX IF NOT EXISTS theme_settings_workspace_idx
  ON public.theme_settings (workspace_id);

ALTER TABLE public.theme_settings
  DROP CONSTRAINT IF EXISTS theme_settings_workspace_fk;
ALTER TABLE public.theme_settings
  ADD CONSTRAINT theme_settings_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

-- ============ 3. theme_history: add workspace_id ============
ALTER TABLE public.theme_history
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.theme_history
SET workspace_id = '00000000-0000-0000-0000-000000000001'
WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS theme_history_workspace_idx
  ON public.theme_history (workspace_id);

ALTER TABLE public.theme_history
  DROP CONSTRAINT IF EXISTS theme_history_workspace_fk;
ALTER TABLE public.theme_history
  ADD CONSTRAINT theme_history_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

-- ============ 4. Protect workspace_id from NULL on update ============
CREATE OR REPLACE FUNCTION public.theme_settings_protect_workspace()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.workspace_id IS NULL THEN
    NEW.workspace_id = OLD.workspace_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS theme_settings_protect_workspace ON public.theme_settings;
CREATE TRIGGER theme_settings_protect_workspace
  BEFORE UPDATE ON public.theme_settings
  FOR EACH ROW EXECUTE FUNCTION public.theme_settings_protect_workspace();


-- ============================================================================
-- MIGRATION 13: Add workspace_id to all data tables
-- ============================================================================

-- Reusable: protect workspace_id from NULL on update
CREATE OR REPLACE FUNCTION public.protect_workspace_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.workspace_id IS NULL THEN
    NEW.workspace_id = OLD.workspace_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============ site_content ============
ALTER TABLE public.site_content
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.site_content SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

ALTER TABLE public.site_content DROP CONSTRAINT IF EXISTS site_content_pkey;
ALTER TABLE public.site_content ADD PRIMARY KEY (workspace_id, key);

CREATE INDEX IF NOT EXISTS site_content_workspace_idx ON public.site_content (workspace_id);

ALTER TABLE public.site_content
  DROP CONSTRAINT IF EXISTS site_content_workspace_fk;
ALTER TABLE public.site_content
  ADD CONSTRAINT site_content_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

DROP TRIGGER IF EXISTS site_content_protect_workspace ON public.site_content;
CREATE TRIGGER site_content_protect_workspace
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.protect_workspace_id();

-- ============ menu_items ============
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.menu_items SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS menu_items_workspace_idx ON public.menu_items (workspace_id);

ALTER TABLE public.menu_items
  DROP CONSTRAINT IF EXISTS menu_items_workspace_fk;
ALTER TABLE public.menu_items
  ADD CONSTRAINT menu_items_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

DROP TRIGGER IF EXISTS menu_items_protect_workspace ON public.menu_items;
CREATE TRIGGER menu_items_protect_workspace
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.protect_workspace_id();

-- ============ gallery_images ============
ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.gallery_images SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS gallery_images_workspace_idx ON public.gallery_images (workspace_id);

ALTER TABLE public.gallery_images
  DROP CONSTRAINT IF EXISTS gallery_images_workspace_fk;
ALTER TABLE public.gallery_images
  ADD CONSTRAINT gallery_images_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

DROP TRIGGER IF EXISTS gallery_images_protect_workspace ON public.gallery_images;
CREATE TRIGGER gallery_images_protect_workspace
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.protect_workspace_id();

-- ============ events ============
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.events SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS events_workspace_idx ON public.events (workspace_id);

ALTER TABLE public.events
  DROP CONSTRAINT IF EXISTS events_workspace_fk;
ALTER TABLE public.events
  ADD CONSTRAINT events_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

DROP TRIGGER IF EXISTS events_protect_workspace ON public.events;
CREATE TRIGGER events_protect_workspace
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.protect_workspace_id();

-- ============ testimonials ============
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.testimonials SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS testimonials_workspace_idx ON public.testimonials (workspace_id);

ALTER TABLE public.testimonials
  DROP CONSTRAINT IF EXISTS testimonials_workspace_fk;
ALTER TABLE public.testimonials
  ADD CONSTRAINT testimonials_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

DROP TRIGGER IF EXISTS testimonials_protect_workspace ON public.testimonials;
CREATE TRIGGER testimonials_protect_workspace
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.protect_workspace_id();

-- ============ page_blocks ============
ALTER TABLE public.page_blocks
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.page_blocks SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS page_blocks_workspace_idx ON public.page_blocks (workspace_id);

ALTER TABLE public.page_blocks
  DROP CONSTRAINT IF EXISTS page_blocks_workspace_fk;
ALTER TABLE public.page_blocks
  ADD CONSTRAINT page_blocks_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

DROP TRIGGER IF EXISTS page_blocks_protect_workspace ON public.page_blocks;
CREATE TRIGGER page_blocks_protect_workspace
  BEFORE UPDATE ON public.page_blocks
  FOR EACH ROW EXECUTE FUNCTION public.protect_workspace_id();

-- ============ personality_profiles ============
ALTER TABLE public.personality_profiles
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.personality_profiles SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

ALTER TABLE public.personality_profiles DROP CONSTRAINT IF EXISTS personality_profiles_pkey;
ALTER TABLE public.personality_profiles ADD PRIMARY KEY (workspace_id, key);

CREATE INDEX IF NOT EXISTS personality_profiles_workspace_idx ON public.personality_profiles (workspace_id);

ALTER TABLE public.personality_profiles
  DROP CONSTRAINT IF EXISTS personality_profiles_workspace_fk;
ALTER TABLE public.personality_profiles
  ADD CONSTRAINT personality_profiles_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

DROP TRIGGER IF EXISTS personality_profiles_protect_workspace ON public.personality_profiles;
CREATE TRIGGER personality_profiles_protect_workspace
  BEFORE UPDATE ON public.personality_profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_workspace_id();

-- ============ media_files ============
ALTER TABLE public.media_files
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.media_files SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS media_files_workspace_idx ON public.media_files (workspace_id);

ALTER TABLE public.media_files
  DROP CONSTRAINT IF EXISTS media_files_workspace_fk;
ALTER TABLE public.media_files
  ADD CONSTRAINT media_files_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

DROP TRIGGER IF EXISTS media_files_protect_workspace ON public.media_files;
CREATE TRIGGER media_files_protect_workspace
  BEFORE UPDATE ON public.media_files
  FOR EACH ROW EXECUTE FUNCTION public.protect_workspace_id();

-- ============ page_views ============
ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.page_views SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS page_views_workspace_idx ON public.page_views (workspace_id);

ALTER TABLE public.page_views
  DROP CONSTRAINT IF EXISTS page_views_workspace_fk;
ALTER TABLE public.page_views
  ADD CONSTRAINT page_views_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

-- No protect trigger for page_views (append-only analytics table)

-- ============ site_visits ============
ALTER TABLE public.site_visits
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.site_visits SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS site_visits_workspace_idx ON public.site_visits (workspace_id);

ALTER TABLE public.site_visits
  DROP CONSTRAINT IF EXISTS site_visits_workspace_fk;
ALTER TABLE public.site_visits
  ADD CONSTRAINT site_visits_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

-- No protect trigger for site_visits (append-only analytics table)

-- ============ test_responses ============
ALTER TABLE public.test_responses
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

UPDATE public.test_responses SET workspace_id = '00000000-0000-0000-0000-000000000001'
  WHERE workspace_id IS NULL;

CREATE INDEX IF NOT EXISTS test_responses_workspace_idx ON public.test_responses (workspace_id);

ALTER TABLE public.test_responses
  DROP CONSTRAINT IF EXISTS test_responses_workspace_fk;
ALTER TABLE public.test_responses
  ADD CONSTRAINT test_responses_workspace_fk
  FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id) ON DELETE CASCADE;

-- No protect trigger for test_responses (append-only)

-- ============ Add all tables to realtime publication ============
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.page_blocks;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.personality_profiles;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.media_files;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.test_responses;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================================
-- MIGRATION: Provisioning Tables — Blueprints, Transactions, Steps
-- ============================================================================

-- 1. Blueprints — reusable templates for workspaces
CREATE TABLE IF NOT EXISTS public.blueprints (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  version       text NOT NULL,
  name          text NOT NULL,
  description   text DEFAULT '',
  category      text NOT NULL DEFAULT 'general',
  manifest      jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.blueprints IS 'Available blueprints that can be used to provision new workspaces';
COMMENT ON COLUMN public.blueprints.manifest IS 'JSON: full blueprint definition (pages, blocks, theme, menus, etc.)';

-- 2. Provision transactions — top-level record of each provisioning attempt
CREATE TABLE IF NOT EXISTS public.provision_transactions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      uuid REFERENCES public.workspaces(id) ON DELETE SET NULL,
  blueprint_id      uuid REFERENCES public.blueprints(id) ON DELETE SET NULL,
  blueprint_slug    text,
  blueprint_version text NOT NULL,
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'rolling_back', 'rolled_back')),
  initiated_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at        timestamptz NOT NULL DEFAULT now(),
  completed_at      timestamptz,
  error             text,
  logs              jsonb NOT NULL DEFAULT '[]'::jsonb
);

COMMENT ON TABLE public.provision_transactions IS 'Tracks each provisioning attempt with status and metadata';

-- 3. Provision steps — individual step records within a transaction
CREATE TABLE IF NOT EXISTS public.provision_steps (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.provision_transactions(id) ON DELETE CASCADE,
  step_name     text NOT NULL,
  step_index    int NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  started_at    timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz,
  duration_ms   bigint DEFAULT 0,
  error         text,
  output        jsonb DEFAULT '{}'::jsonb
);

COMMENT ON TABLE public.provision_steps IS 'Individual provisioning steps within a transaction';

-- ============ Indexes ============

CREATE INDEX IF NOT EXISTS idx_provision_transactions_workspace
  ON public.provision_transactions(workspace_id) WHERE workspace_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_provision_transactions_status
  ON public.provision_transactions(status);

CREATE INDEX IF NOT EXISTS idx_provision_steps_transaction
  ON public.provision_steps(transaction_id);

CREATE INDEX IF NOT EXISTS idx_provision_steps_step_name
  ON public.provision_steps(step_name);

-- ============ RLS Policies ============

ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provision_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provision_steps ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Blueprints are publicly readable"
    ON public.blueprints FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Blueprints are manageable by auth users"
    ON public.blueprints
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can read own provision transactions"
    ON public.provision_transactions FOR SELECT
    USING (
      auth.uid() = initiated_by
      OR auth.role() = 'service_role'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own provision transactions"
    ON public.provision_transactions FOR INSERT
    WITH CHECK (auth.uid() = initiated_by);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Steps inherit transaction read access"
    ON public.provision_steps FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.provision_transactions pt
        WHERE pt.id = provision_steps.transaction_id
          AND (pt.initiated_by = auth.uid() OR auth.role() = 'service_role')
      )
      OR auth.role() = 'service_role'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ Seed: default cafeteria blueprint ============

INSERT INTO public.blueprints (slug, version, name, description, category, manifest)
VALUES (
  'cafeteria',
  '1.0.0',
  'Café Starter Kit',
  'A complete starter kit for cafés including menu, gallery, personality quiz, testimonials, and events pages.',
  'restaurant',
  '{
    "id": "blueprint-cafeteria-default",
    "slug": "cafeteria",
    "version": "1.0.0",
    "name": "Café Starter Kit",
    "description": "A complete starter kit for cafés.",
    "category": "restaurant",
    "pages": [
      {"key": "home", "title": "Home", "path": "/", "blockKeys": ["hero-home"]},
      {"key": "menu", "title": "Menu", "path": "/menu", "blockKeys": ["gallery-menu"]},
      {"key": "quiz", "title": "Personality Quiz", "path": "/quiz", "blockKeys": ["personality-quiz-section"]},
      {"key": "testimonials", "title": "Testimonials", "path": "/testimonials", "blockKeys": ["testimonials-list"]},
      {"key": "events", "title": "Events", "path": "/events", "blockKeys": ["events-list"]}
    ],
    "theme": {
      "presetId": "cafe-rose-gold",
      "overrides": {"primaryColor": "#9f1239", "accentColor": "#d4af37"}
    },
    "menus": [
      {"name": "Espresso", "category": "Hot Coffee", "price": "35000"},
      {"name": "Cappuccino", "category": "Hot Coffee", "price": "45000"},
      {"name": "Caramel Latte", "category": "Specialty Coffee", "price": "50000"}
    ]
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- MIGRATION: Public Provisioning API — idempotency key
-- ============================================================================

ALTER TABLE public.provision_transactions
  ADD COLUMN IF NOT EXISTS external_order_id text;

CREATE UNIQUE INDEX IF NOT EXISTS provision_transactions_external_order_id_key
  ON public.provision_transactions (external_order_id)
  WHERE external_order_id IS NOT NULL;
