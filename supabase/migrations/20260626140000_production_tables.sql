
-- ============ TEST RESPONSES ============
CREATE TABLE public.test_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  result TEXT NOT NULL,
  tied TEXT[] DEFAULT '{}',
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_full_name TEXT DEFAULT '',
  user_phone TEXT DEFAULT '',
  user_age INT,
  user_gender TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX test_responses_completed_at_idx ON public.test_responses (completed_at DESC);
CREATE INDEX test_responses_result_idx ON public.test_responses (result);

GRANT INSERT ON public.test_responses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_responses TO authenticated;
GRANT ALL ON public.test_responses TO service_role;
ALTER TABLE public.test_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit test response" ON public.test_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read test responses" ON public.test_responses FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete test responses" ON public.test_responses FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update test responses" ON public.test_responses FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.test_responses;

-- ============ MEDIA FILES (metadata; blobs in storage bucket) ============
CREATE TABLE public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  folder TEXT NOT NULL DEFAULT 'uploads',
  tags TEXT[] DEFAULT '{}',
  size_bytes BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX media_files_folder_idx ON public.media_files (folder);
CREATE INDEX media_files_created_at_idx ON public.media_files (created_at DESC);

GRANT SELECT ON public.media_files TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_files TO authenticated;
GRANT ALL ON public.media_files TO service_role;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read media metadata" ON public.media_files FOR SELECT USING (true);
CREATE POLICY "admin write media metadata" ON public.media_files FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.media_files;

-- ============ TEST QUESTIONS CONFIG (site_content key) ============
INSERT INTO public.site_content (key, value) VALUES
  ('test_questions', '{"overrides":{},"orderedIds":null}'::jsonb)
ON CONFLICT DO NOTHING;

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "public read media objects" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "admin insert media objects" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update media objects" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete media objects" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
