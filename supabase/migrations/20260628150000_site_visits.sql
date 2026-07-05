-- ============ SITE VISITS ANALYTICS ============
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT,
  country TEXT,
  city TEXT,
  ip_hash TEXT,
  is_bot BOOLEAN NOT NULL DEFAULT false
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS site_visits_created_at_idx ON public.site_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS site_visits_page_path_idx ON public.site_visits (page_path);
CREATE INDEX IF NOT EXISTS site_visits_session_id_idx ON public.site_visits (session_id);
CREATE INDEX IF NOT EXISTS site_visits_is_bot_idx ON public.site_visits (is_bot);
CREATE INDEX IF NOT EXISTS site_visits_session_page_time_idx ON public.site_visits (session_id, page_path, created_at DESC);

-- Partial index for non-bot visits (most common query)
CREATE INDEX IF NOT EXISTS site_visits_nonbot_created_at_idx ON public.site_visits (created_at DESC) WHERE is_bot = false;

GRANT INSERT ON public.site_visits TO anon;
GRANT SELECT ON public.site_visits TO authenticated;
GRANT ALL ON public.site_visits TO service_role;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Anyone can insert analytics (for public tracking)
CREATE POLICY "anyone can log site visit"
  ON public.site_visits FOR INSERT
  WITH CHECK (true);

-- Admins can read all analytics
CREATE POLICY "admin read site visits"
  ON public.site_visits FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update (for manual corrections)
CREATE POLICY "admin update site visits"
  ON public.site_visits FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for live visitor counts
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;

-- Function to hash IP address for privacy
CREATE OR REPLACE FUNCTION public.hash_ip(ip TEXT) RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT encode(digest(ip || current_setting('app.analytics_salt', true), 'sha256'), 'hex')
$$;

-- Function to detect bots from user agent
CREATE OR REPLACE FUNCTION public.is_bot_user_agent(user_agent TEXT) RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN user_agent IS NULL THEN false
    WHEN user_agent ~* 'googlebot|bingbot|facebookexternalhit|twitterbot|slackbot|discordbot|headless|phantomjs|puppeteer|playwright|selenium|webdriver|bot|crawler|spider|scraper|monitoring|uptime|pingdom|statuscake|newrelic|datadog|semrush|ahrefs|majestic|moz|screaming|frog|sitebulb|botpress|dialogflow|rasa|wit\.ai|luis|lex|api\.ai|assistant|alexa|google\-cloud|amazonaws|digitalocean|vultr|linode|scaleway|hetzner|ovh|contabo|rackspace|azure|gcp' THEN true
    ELSE false
  END
$$;

-- Function to extract device type from user agent
CREATE OR REPLACE FUNCTION public.extract_device_type(user_agent TEXT) RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN user_agent IS NULL THEN 'unknown'
    WHEN user_agent ~* 'mobile|android|iphone|ipod|blackberry|windows phone|opera mini|iemobile' THEN 'mobile'
    WHEN user_agent ~* 'tablet|ipad|playbook|kindle|silk' THEN 'tablet'
    ELSE 'desktop'
  END
$$;

-- Function to get visit stats (total, today, yesterday, realtime)
CREATE OR REPLACE FUNCTION public.get_site_visit_stats()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total', (
      SELECT COUNT(*) FROM site_visits WHERE is_bot = false
    ),
    'today', (
      SELECT COUNT(*) FROM site_visits
      WHERE is_bot = false
      AND created_at >= CURRENT_DATE
    ),
    'yesterday', (
      SELECT COUNT(*) FROM site_visits
      WHERE is_bot = false
      AND created_at >= CURRENT_DATE - INTERVAL '1 day'
      AND created_at < CURRENT_DATE
    ),
    'realtime', (
      SELECT COUNT(DISTINCT session_id) FROM site_visits
      WHERE is_bot = false
      AND created_at >= NOW() - INTERVAL '5 minutes'
    )
  )
$$;

-- Function to get top pages
CREATE OR REPLACE FUNCTION public.get_top_pages(limit_count INT DEFAULT 10)
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_agg(json_build_object(
    'page_path', page_path,
    'visit_count', visit_count
  ) ORDER BY visit_count DESC)
  FROM (
    SELECT page_path, COUNT(*) as visit_count
    FROM site_visits
    WHERE is_bot = false
    GROUP BY page_path
    ORDER BY visit_count DESC
    LIMIT limit_count
  ) sub
$$;

-- Function to get device distribution
CREATE OR REPLACE FUNCTION public.get_device_distribution()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_agg(json_build_object(
    'device_type', device_type,
    'count', cnt
  ) ORDER BY cnt DESC)
  FROM (
    SELECT COALESCE(device_type, 'unknown') as device_type, COUNT(*) as cnt
    FROM site_visits
    WHERE is_bot = false
    GROUP BY device_type
  ) sub
$$;

-- Function to get visits over time (for charts)
CREATE OR REPLACE FUNCTION public.get_visits_over_time(days INT DEFAULT 7)
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_agg(json_build_object(
    'date', date,
    'visits', visits
  ) ORDER BY date)
  FROM (
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as visits
    FROM site_visits
    WHERE is_bot = false
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * days
    GROUP BY DATE(created_at)
    ORDER BY date
  ) sub
$$;