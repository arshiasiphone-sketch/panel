ALTER TABLE public.theme_settings
  ADD COLUMN IF NOT EXISTS text_secondary_color TEXT NOT NULL DEFAULT '#9a8a78',
  ADD COLUMN IF NOT EXISTS text_tertiary_color TEXT NOT NULL DEFAULT '#c9b89e';

UPDATE public.theme_settings
SET
  text_color = '#f0e6d3',
  text_secondary_color = COALESCE(NULLIF(text_secondary_color, ''), '#9a8a78'),
  text_tertiary_color = COALESCE(NULLIF(text_tertiary_color, ''), '#c9b89e')
WHERE id = 1;
