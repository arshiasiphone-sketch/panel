-- ==========================================
-- MIGRATION 13: Add workspace_id to all data tables
-- ==========================================
-- Adds workspace_id column to all tenant-scoped tables.
-- Backward compatible: existing rows get DEFAULT_WORKSPACE_ID.
-- Tables: site_content, menu_items, gallery_images, events,
--         testimonials, page_blocks, personality_profiles,
--         media_files, page_views, site_visits, test_responses
-- (theme_settings & theme_history already done in migration 12)

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

-- site_content PK is `key` (TEXT). For multi-tenant, we need composite PK.
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

-- personality_profiles PK is `key` (TEXT). Composite PK needed.
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