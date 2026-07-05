CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  path TEXT,
  referrer TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS page_views_visited_at_idx ON public.page_views (visited_at DESC);

GRANT INSERT ON public.page_views TO anon;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can log page view"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin read page views"
  ON public.page_views FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
