
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
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

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ updated_at helper ============
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ============ MENU ITEMS ============
CREATE TABLE public.menu_items (
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
CREATE POLICY "public read menu" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "admin write menu" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER menu_items_updated BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ GALLERY ============
CREATE TABLE public.gallery_images (
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
CREATE POLICY "public read gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "admin write gallery" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER gallery_updated BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ EVENTS ============
CREATE TABLE public.events (
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
CREATE POLICY "public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "admin write events" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ TESTIMONIALS ============
CREATE TABLE public.testimonials (
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
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "admin write testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SITE CONTENT (key/value) ============
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "admin write site content" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ THEME SETTINGS (singleton) ============
CREATE TABLE public.theme_settings (
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
CREATE POLICY "public read theme" ON public.theme_settings FOR SELECT USING (true);
CREATE POLICY "admin write theme" ON public.theme_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER theme_updated BEFORE UPDATE ON public.theme_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PAGE BLOCKS ============
CREATE TABLE public.page_blocks (
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
CREATE POLICY "public read blocks" ON public.page_blocks FOR SELECT USING (true);
CREATE POLICY "admin write blocks" ON public.page_blocks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER page_blocks_updated BEFORE UPDATE ON public.page_blocks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PERSONALITY PROFILES ============
CREATE TABLE public.personality_profiles (
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
CREATE POLICY "public read personalities" ON public.personality_profiles FOR SELECT USING (true);
CREATE POLICY "admin write personalities" ON public.personality_profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER personality_updated BEFORE UPDATE ON public.personality_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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
