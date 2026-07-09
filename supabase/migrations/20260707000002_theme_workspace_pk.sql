-- ==========================================
-- MIGRATION 12: theme_settings composite PK (workspace_id, id)
-- ==========================================
-- Adds workspace_id to theme_settings, changes PK to composite (workspace_id, id).
-- Adds workspace_id to theme_history for multi-tenant isolation.
-- Backward compatible: existing rows get DEFAULT_WORKSPACE_ID.

-- ============ 1. theme_settings: add workspace_id ============
ALTER TABLE public.theme_settings
  ADD COLUMN IF NOT EXISTS workspace_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';

-- Backfill any NULL (shouldn't be any due to DEFAULT, but safe)
UPDATE public.theme_settings
SET workspace_id = '00000000-0000-0000-0000-000000000001'
WHERE workspace_id IS NULL;

-- ============ 2. theme_settings: change PK ============
-- Drop old PK (id), create composite PK (workspace_id, id)
ALTER TABLE public.theme_settings DROP CONSTRAINT IF EXISTS theme_settings_pkey;
ALTER TABLE public.theme_settings ADD PRIMARY KEY (workspace_id, id);

-- Index for workspace-scoped queries
CREATE INDEX IF NOT EXISTS theme_settings_workspace_idx
  ON public.theme_settings (workspace_id);

-- FK to workspaces
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