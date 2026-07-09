-- ==========================================
-- MIGRATION 1: Base tables + roles + seed
-- File: 20260625102123_13e71544-b666-4171-bff6-a40312dba2f1.sql
-- ==========================================

-- ============ ROLES ============
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DO $$ BEGIN
  CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ updated_at helper ============
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ============ MENU ITEMS ============
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "public read menu" ON public.menu_items FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin write menu" ON public.menu_items FOR ALL TO authenticated
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TRIGGER menu_items_updated BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ GALLERY ============
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "public read gallery" ON public.gallery_images FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin write gallery" ON public.gallery_images FOR ALL TO authenticated
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TRIGGER gallery_updated BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ EVENTS ============
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date_label TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "public read events" ON public.events FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin write events" ON public.events FOR ALL TO authenticated
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT '',
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin write testimonials" ON public.testimonials FOR ALL TO authenticated
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TRIGGER testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ SITE CONTENT (key/value) ============
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "public read site content" ON public.site_content FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin write site content" ON public.site_content FOR ALL TO authenticated
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ THEME SETTINGS (singleton) ============
CREATE TABLE IF NOT EXISTS public.theme_settings (
  id INT PRIMARY KEY DEFAULT 1,
  primary_color TEXT NOT NULL DEFAULT '#d4af37',
  secondary_color TEXT NOT NULL DEFAULT '#0f172a',
  accent_color TEXT NOT NULL DEFAULT '#d4af37',
  background_color TEXT NOT NULL DEFAULT '#0a0a0a',
  text_color TEXT NOT NULL DEFAULT '#fafafa',
  border_radius TEXT NOT NULL DEFAULT '0.75rem',
  glass_opacity NUMERIC NOT NULL DEFAULT 0.08,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT theme_singleton CHECK (id = 1)
);
GRANT SELECT ON public.theme_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theme_settings TO authenticated;
GRANT ALL ON public.theme_settings TO service_role;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "public read theme" ON public.theme_settings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin write theme" ON public.theme_settings FOR ALL TO authenticated
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TRIGGER theme_updated BEFORE UPDATE ON public.theme_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ PAGE BLOCKS ============
CREATE TABLE IF NOT EXISTS public.page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_blocks TO authenticated;
GRANT ALL ON public.page_blocks TO service_role;
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "public read blocks" ON public.page_blocks FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin write blocks" ON public.page_blocks FOR ALL TO authenticated
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TRIGGER page_blocks_updated BEFORE UPDATE ON public.page_blocks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ PERSONALITY PROFILES ============
CREATE TABLE IF NOT EXISTS public.personality_profiles (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  traits TEXT[] DEFAULT '{}',
  drink TEXT DEFAULT '',
  spot TEXT DEFAULT '',
  color_from TEXT DEFAULT '#d4af37',
  color_to TEXT DEFAULT '#0f172a',
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.personality_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personality_profiles TO authenticated;
GRANT ALL ON public.personality_profiles TO service_role;
ALTER TABLE public.personality_profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "public read personalities" ON public.personality_profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin write personalities" ON public.personality_profiles FOR ALL TO authenticated
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TRIGGER personality_updated BEFORE UPDATE ON public.personality_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ SEED DATA ============
INSERT INTO public.theme_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

INSERT INTO public.site_content (key, value) VALUES
  ('hero', '{"title":"شخصیت کافه‌ای‌ات\nرو کشف کن","subtitle":"تجربه‌ای فراتر از قهوه. ۱۱ سوال کوتاه، یه نتیجه‌ی منحصربه‌فرد. بفهم کدوم تیپ کافه‌رو هستی.","badge":"کافه خانه · ۱۴۰۵","cta_text":"شروع تست شخصیت"}'::jsonb),
  ('contact', '{"address":"تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۳","phone":"۰۲۱-۸۸۸۸۸۸۸۸","hours":"همه‌روزه ۱۰ صبح تا ۱۲ شب"}'::jsonb),
  ('social', '{"instagram":"https://instagram.com/cafekhane","instagram_handle":"@cafekhane"}'::jsonb),
  ('meta', '{"title":"کافه خانه","bio":"خانه دوم شما، یک فنجان آرامش"}'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_items (category, name, description, price, image_url, sort_order) VALUES
  ('نوشیدنی گرم','اسپرسو','قهوه‌ی غلیظ ایتالیایی','۸۵٬۰۰۰','https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&auto=format&fit=crop&q=70',1),
  ('نوشیدنی گرم','لاته','اسپرسو با شیر بخار','۱۲۰٬۰۰۰','https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&auto=format&fit=crop&q=70',2),
  ('نوشیدنی سرد','آیس آمریکانو','تازه و خنک','۱۱۰٬۰۰۰','https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=70',3),
  ('دسر','چیزکیک','خامه‌ای و خوش‌طعم','۱۸۰٬۰۰۰','https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=70',4);

INSERT INTO public.gallery_images (title, image_url, sort_order) VALUES
  ('گوشه‌ی دنج','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=900&auto=format&fit=crop&q=70',1),
  ('بار قهوه','https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=900&auto=format&fit=crop&q=70',2),
  ('لاته آرت','https://images.unsplash.com/photo-1542990253-0b8be4ad7e26?w=900&auto=format&fit=crop&q=70',3),
  ('دسر روز','https://images.unsplash.com/photo-1551024601-bec78aea704b?w=900&auto=format&fit=crop&q=70',4),
  ('میز چوبی','https://images.unsplash.com/photo-1481833761820-0509d3217039?w=900&auto=format&fit=crop&q=70',5),
  ('صبحانه','https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?w=900&auto=format&fit=crop&q=70',6);

INSERT INTO public.events (title, description, date_label, image_url, sort_order) VALUES
  ('شب موسیقی زنده','اجرای زنده گروه آکوستیک، رزرو ضروری.','جمعه ۲۰ تیر · ساعت ۲۰','https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=70',1),
  ('کارگاه قهوه','آشنایی با روش‌های دم‌آوری دستی.','شنبه ۲۱ تیر · ساعت ۱۷','https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=900&auto=format&fit=crop&q=70',2);

INSERT INTO public.testimonials (name, type, text, sort_order) VALUES
  ('سارا م.','پاپاروچ','دقیقاً همونی که هستم! نتیجه باورنکردنی درست بود و کلی باهاش حال کردم.',1),
  ('امیر ک.','فوفینو','طراحیش فوق‌العاده‌ست و سوال‌ها واقعاً هوشمندانه طراحی شدن. لذت بردم.',2),
  ('نگار ر.','ژامپین','با دوستام تست دادیم و کلی خندیدیم. نتیجه‌ها عجیب دقیق بودن!',3);

-- ==========================================
-- MIGRATION 2: Function security
-- File: 20260625102138_80fb4260-8c99-4a2d-86fd-5c5c638ae88c.sql
-- ==========================================
ALTER FUNCTION public.set_updated_at() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

-- ==========================================
-- MIGRATION 3: Realtime + page blocks seed
-- File: 20260626090643_0d76355d-216f-4097-99b4-9bde86171a46.sql
-- ==========================================
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.page_blocks;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.theme_settings;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO public.page_blocks (type, sort_order, visible, data)
SELECT * FROM (VALUES
  ('hero',              0, true, '{"badge":"کافه خانه","title":"شخصیت کافه‌ای‌ات\nرو کشف کن","subtitle":"تجربه‌ای فراتر از قهوه. ۱۱ سوال کوتاه و یک نتیجه‌ی منحصربه‌فرد.","cta_text":"شروع تست","cta_url":"/test/info"}'::jsonb),
  ('parallax_gallery',  1, true, '{"kicker":"گالری","title":"لحظه‌های کافه خانه","subtitle":"نمایی از فضا، نوشیدنی‌ها و آدم‌های اینجا — کشیدن یا اسکرول کنید."}'::jsonb),
  ('menu_highlights',   2, true, '{"kicker":"منوی ما","title":"یه نگاه به منو","subtitle":"منتخبی از نوشیدنی‌ها و خوراکی‌های محبوب کافه خانه.","count":4}'::jsonb),
  ('how_it_works',      3, true, '{"kicker":"چطور کار می‌کنه","title":"سه قدم ساده تا نتیجه"}'::jsonb),
  ('gallery_preview',   4, true, '{"kicker":"گالری","title":"فضای کافه خانه","subtitle":"گوشه‌ای از لحظه‌ها و حال‌وهوای دنج ما.","count":6,"columns":6}'::jsonb),
  ('events_preview',    5, true, '{"kicker":"رویدادها","title":"برنامه‌های ویژه","subtitle":"همیشه یه اتفاق تازه در کافه خانه در راهه.","count":2}'::jsonb),
  ('location',          6, true, '{"kicker":"بیا پیش ما","title":"کافه خانه منتظرته"}'::jsonb),
  ('stats',             7, true, '{"items":[{"value":"۱۱","label":"سوال هوشمند"},{"value":"۴","label":"تیپ شخصیتی"},{"value":"۳","label":"دقیقه زمان"}]}'::jsonb),
  ('testimonials_section',  8, true, '{"kicker":"تجربه‌ی دیگران","title":"چی می‌گن درباره‌اش"}'::jsonb)
) AS v(type, sort_order, visible, data)
WHERE NOT EXISTS (SELECT 1 FROM public.page_blocks);

-- ==========================================
-- MIGRATION 4: Personality profiles seed
-- File: 20260626130000_seed_personality_profiles.sql
-- ==========================================
INSERT INTO public.personality_profiles (key, label, tagline, description, traits, drink, spot, color_from, color_to, sort_order)
SELECT * FROM (VALUES
  ('paparoch', 'پاپاروچ', 'روح مجلس — همه دوستت دارن',
   'تو کسی هستی که با ورودش فضا عوض میشه. پرانرژی، اجتماعی و همیشه آماده‌ی یه تجربه‌ی جدید. خونه برات یه صحنه‌ست نه یه پناهگاه.',
   ARRAY['اجتماعی','پرانرژی','خلاق','ریسک‌پذیر']::text[], 'اسپرسو دوبل', 'میز وسط که همه ببیننت', '#e11d48', '#9f1239', 1),
  ('zhampin', 'ژامپین', 'هدفمند — گرم و صمیمی',
   'برای تو خونه یه مرکز ارتباطیه. دوست داری فضا گرم باشه، آدم‌ها دور هم باشن و رابطه‌ها عمیق بشه. صمیمیت مهم‌ترین چیزه.',
   ARRAY['صمیمی','گرم','ارتباطی','معاشرتی']::text[], 'چای شیرین', 'میز دور با دوستا', '#16a34a', '#15803d', 2),
  ('fofino', 'فوفینو', 'آرام‌نفس — عمق زیر سطح',
   'تو آدمی هستی که ترجیح میدی عمیق باشی تا بلند. خونه یه فضای امن و شخصیه، جایی که میتونی خودت باشی بدون قضاوت.',
   ARRAY['عمیق','آرام','خلوت‌دوست','تحلیل‌گر']::text[], 'چای دم‌کرده', 'کنار پنجره با نور طبیعی', '#2563eb', '#1d4ed8', 3),
  ('gombak', 'گومباک', 'ماجراجو — دنیا صبرت رو داره',
   'برای تو خونه یه نقطه‌ی شروعه نه مقصد. همیشه یه ایده داری، دنبال تجربه‌های جدیدی، و خونه‌ات باید بتونه باهات نفس بکشه.',
   ARRAY['کنجکاو','ماجراجو','سریع','شهودی']::text[], 'کاپوچینو', 'هر جایی که دلت بخواد', '#d97706', '#b45309', 4),
  ('bedone', 'ترکیبی', 'منحصربه‌فرد — برچسب نمیخوری',
   'شخصیت تو از یه قالب خارجه. ترکیبی از چند تیپ هستی که بستگی به موقعیت داره. این قدرته نه ضعف.',
   ARRAY['متنوع','انعطاف‌پذیر','پیچیده','چندوجهی']::text[], 'هر چیزی که اون روز حست بخواد', 'هر جایی که فضا خوب باشه', '#d4af37', '#b8962e', 5)
) AS v(key, label, tagline, description, traits, drink, spot, color_from, color_to, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.personality_profiles);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.personality_profiles;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ==========================================
-- MIGRATION 5: Production tables (test_responses, media_files)
-- File: 20260626140000_production_tables.sql
-- ==========================================
CREATE TABLE IF NOT EXISTS public.test_responses (
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
CREATE INDEX IF NOT EXISTS test_responses_completed_at_idx ON public.test_responses (completed_at DESC);
CREATE INDEX IF NOT EXISTS test_responses_result_idx ON public.test_responses (result);

GRANT INSERT ON public.test_responses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_responses TO authenticated;
GRANT ALL ON public.test_responses TO service_role;
ALTER TABLE public.test_responses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "anyone can submit test response" ON public.test_responses FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin read test responses" ON public.test_responses FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin delete test responses" ON public.test_responses FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin update test responses" ON public.test_responses FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.test_responses;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  folder TEXT NOT NULL DEFAULT 'uploads',
  tags TEXT[] DEFAULT '{}',
  size_bytes BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS media_files_folder_idx ON public.media_files (folder);
CREATE INDEX IF NOT EXISTS media_files_created_at_idx ON public.media_files (created_at DESC);

GRANT SELECT ON public.media_files TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_files TO authenticated;
GRANT ALL ON public.media_files TO service_role;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public read media metadata" ON public.media_files FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "admin write media metadata" ON public.media_files FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.media_files;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO public.site_content (key, value) VALUES
  ('test_questions', '{"overrides":{},"orderedIds":null}'::jsonb)
ON CONFLICT DO NOTHING;

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

DO $$ BEGIN
  CREATE POLICY "public read media objects" ON storage.objects FOR SELECT
    USING (bucket_id = 'media');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin insert media objects" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin update media objects" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin delete media objects" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ==========================================
-- MIGRATION 6: Page views table
-- File: 20260627120000_page_views.sql
-- ==========================================
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

DO $$ BEGIN
  CREATE POLICY "anyone can log page view"
    ON public.page_views FOR INSERT
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin read page views"
    ON public.page_views FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ==========================================
-- MIGRATION 7: Theme text colors
-- File: 20260627140000_theme_text_colors.sql
-- ==========================================
ALTER TABLE public.theme_settings
  ADD COLUMN IF NOT EXISTS text_secondary_color TEXT NOT NULL DEFAULT '#9a8a78',
  ADD COLUMN IF NOT EXISTS text_tertiary_color TEXT NOT NULL DEFAULT '#c9b89e';

UPDATE public.theme_settings
SET
  text_color = '#f0e6d3',
  text_secondary_color = COALESCE(NULLIF(text_secondary_color, ''), '#9a8a78'),
  text_tertiary_color = COALESCE(NULLIF(text_tertiary_color, ''), '#c9b89e')
WHERE id = 1;

-- ==========================================
-- MIGRATION 8: Rate limiting
-- File: 20260628000000_rate_limiting.sql
-- ==========================================
CREATE TABLE IF NOT EXISTS public.insert_rate_limits (
  identifier TEXT NOT NULL,
  target_table TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
  ON public.insert_rate_limits (identifier, target_table, created_at DESC);

CREATE OR REPLACE FUNCTION public.prune_rate_limits()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.insert_rate_limits 
  WHERE created_at < now() - interval '5 minutes';
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  identifier TEXT,
  target_table TEXT,
  max_count INT DEFAULT 10,
  window_seconds INT DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recent_count INT;
BEGIN
  IF random() < 0.05 THEN
    PERFORM public.prune_rate_limits();
  END IF;

  SELECT COUNT(*) INTO recent_count
  FROM public.insert_rate_limits
  WHERE insert_rate_limits.identifier = check_rate_limit.identifier
    AND insert_rate_limits.target_table = check_rate_limit.target_table
    AND insert_rate_limits.created_at > now() - (window_seconds || ' seconds')::interval;

  RETURN recent_count < max_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_rate_limit_attempt(
  identifier TEXT,
  target_table TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.insert_rate_limits (identifier, target_table)
  VALUES (identifier, target_table);
END;
$$;

GRANT USAGE ON SCHEMA public TO anon;
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO anon;
GRANT EXECUTE ON FUNCTION public.record_rate_limit_attempt TO anon;
GRANT SELECT, INSERT ON public.insert_rate_limits TO anon;

DROP POLICY IF EXISTS "anyone can submit test response" ON public.test_responses;

DO $$ BEGIN
  CREATE POLICY "anyone can submit test response" 
    ON public.test_responses FOR INSERT 
    WITH CHECK (
      result IS NOT NULL AND result != '' AND
      answers IS NOT NULL AND answers != '{}'::jsonb
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ==========================================
-- MIGRATION 9: Site visits analytics
-- File: 20260628150000_site_visits.sql
-- ==========================================
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

CREATE INDEX IF NOT EXISTS site_visits_created_at_idx ON public.site_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS site_visits_page_path_idx ON public.site_visits (page_path);
CREATE INDEX IF NOT EXISTS site_visits_session_id_idx ON public.site_visits (session_id);
CREATE INDEX IF NOT EXISTS site_visits_is_bot_idx ON public.site_visits (is_bot);
CREATE INDEX IF NOT EXISTS site_visits_session_page_time_idx ON public.site_visits (session_id, page_path, created_at DESC);
CREATE INDEX IF NOT EXISTS site_visits_nonbot_created_at_idx ON public.site_visits (created_at DESC) WHERE is_bot = false;

GRANT INSERT ON public.site_visits TO anon;
GRANT SELECT ON public.site_visits TO authenticated;
GRANT ALL ON public.site_visits TO service_role;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "anyone can log site visit"
    ON public.site_visits FOR INSERT
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin read site visits"
    ON public.site_visits FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin update site visits"
    ON public.site_visits FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.hash_ip(ip TEXT) RETURNS TEXT
LANGUAGE sql IMMUTABLE AS $$
  SELECT encode(digest(ip || current_setting('app.analytics_salt', true), 'sha256'), 'hex')
$$;

CREATE OR REPLACE FUNCTION public.is_bot_user_agent(user_agent TEXT) RETURNS BOOLEAN
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN user_agent IS NULL THEN false
    WHEN user_agent ~* 'googlebot|bingbot|facebookexternalhit|twitterbot|slackbot|discordbot|headless|phantomjs|puppeteer|playwright|selenium|webdriver|bot|crawler|spider|scraper|monitoring|uptime|pingdom|statuscake|newrelic|datadog|semrush|ahrefs|majestic|moz|screaming|frog|sitebulb|botpress|dialogflow|rasa|wit\.ai|luis|lex|api\.ai|assistant|alexa|google\-cloud|amazonaws|digitalocean|vultr|linode|scaleway|hetzner|ovh|contabo|rackspace|azure|gcp' THEN true
    ELSE false
  END
$$;

CREATE OR REPLACE FUNCTION public.extract_device_type(user_agent TEXT) RETURNS TEXT
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN user_agent IS NULL THEN 'unknown'
    WHEN user_agent ~* 'mobile|android|iphone|ipod|blackberry|windows phone|opera mini|iemobile' THEN 'mobile'
    WHEN user_agent ~* 'tablet|ipad|playbook|kindle|silk' THEN 'tablet'
    ELSE 'desktop'
  END
$$;

CREATE OR REPLACE FUNCTION public.get_site_visit_stats()
RETURNS JSON
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT json_build_object(
    'total', (SELECT COUNT(*) FROM site_visits WHERE is_bot = false),
    'today', (SELECT COUNT(*) FROM site_visits WHERE is_bot = false AND created_at >= CURRENT_DATE),
    'yesterday', (SELECT COUNT(*) FROM site_visits WHERE is_bot = false AND created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE),
    'realtime', (SELECT COUNT(DISTINCT session_id) FROM site_visits WHERE is_bot = false AND created_at >= NOW() - INTERVAL '5 minutes')
  )
$$;

CREATE OR REPLACE FUNCTION public.get_top_pages(limit_count INT DEFAULT 10)
RETURNS JSON
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT json_agg(json_build_object('page_path', page_path, 'visit_count', visit_count) ORDER BY visit_count DESC)
  FROM (SELECT page_path, COUNT(*) as visit_count FROM site_visits WHERE is_bot = false GROUP BY page_path ORDER BY visit_count DESC LIMIT limit_count) sub
$$;

CREATE OR REPLACE FUNCTION public.get_device_distribution()
RETURNS JSON
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT json_agg(json_build_object('device_type', device_type, 'count', cnt) ORDER BY cnt DESC)
  FROM (SELECT COALESCE(device_type, 'unknown') as device_type, COUNT(*) as cnt FROM site_visits WHERE is_bot = false GROUP BY device_type) sub
$$;

CREATE OR REPLACE FUNCTION public.get_visits_over_time(days INT DEFAULT 7)
RETURNS JSON
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT json_agg(json_build_object('date', date, 'visits', visits) ORDER BY date)
  FROM (SELECT DATE(created_at) as date, COUNT(*) as visits FROM site_visits WHERE is_bot = false AND created_at >= CURRENT_DATE - INTERVAL '1 day' * days GROUP BY DATE(created_at) ORDER BY date) sub
$$;

-- ==========================================
-- MIGRATION 10: Theme engine tokens
-- File: 20260630000000_theme_engine_tokens.sql
-- ==========================================
ALTER TABLE public.theme_settings
  ADD COLUMN IF NOT EXISTS tokens JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS preset_id TEXT,
  ADD COLUMN IF NOT EXISTS name TEXT;

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
DO $$ BEGIN
  CREATE POLICY "theme_history readable by everyone"
    ON public.theme_history FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DROP POLICY IF EXISTS "theme_history writable by admins" ON public.theme_history;
DO $$ BEGIN
  CREATE POLICY "theme_history writable by admins"
    ON public.theme_history FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DROP POLICY IF EXISTS "theme_history deletable by admins" ON public.theme_history;
DO $$ BEGIN
  CREATE POLICY "theme_history deletable by admins"
    ON public.theme_history FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;