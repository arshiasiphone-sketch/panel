-- NAMA Theme Engine — extend theme_settings with token storage.
--
-- The engine derives most tokens at runtime from the base palette + a small set
-- of preset knobs (motion duration, shadow opacity, glass blur, gradient angle,
-- etc.). To keep that fully customizable without future migrations we persist
-- everything under a single JSONB column.
--
-- Backward compatibility: every column is optional / nullable with safe defaults.
-- Existing code paths that read the legacy color columns keep working unchanged.

ALTER TABLE public.theme_settings
  ADD COLUMN IF NOT EXISTS tokens JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS preset_id TEXT,
  ADD COLUMN IF NOT EXISTS name TEXT;

-- Theme version history (Import/Export + Version History support).
-- Each row is an immutable snapshot of `theme_settings` at the moment a
-- preset was applied or a theme was imported. RLS mirrors theme_settings:
-- admins can read/write, everyone can read (used for "undo to previous").
CREATE TABLE IF NOT EXISTS public.theme_history (
  id BIGSERIAL PRIMARY KEY,
  theme_id INTEGER NOT NULL DEFAULT 1,
  preset_id TEXT,
  name TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS theme_history_created_at_idx
  ON public.theme_history (created_at DESC);

ALTER TABLE public.theme_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "theme_history readable by everyone" ON public.theme_history;
CREATE POLICY "theme_history readable by everyone"
  ON public.theme_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "theme_history writable by admins" ON public.theme_history;
CREATE POLICY "theme_history writable by admins"
  ON public.theme_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "theme_history deletable by admins" ON public.theme_history;
CREATE POLICY "theme_history deletable by admins"
  ON public.theme_history FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );
