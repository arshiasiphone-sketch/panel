
-- Enable realtime broadcasting for CMS tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_blocks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.theme_settings;

-- Seed default landing page block order (only if empty)
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
