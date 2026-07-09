/**
 * Default blueprint for cafés — creates 5 pages, theme settings, hero section, and sample menu items.
 *
 * This blueprint is used when a user selects "Café Starter Kit" on the provisioning form.
 *
 * The structure follows the BlueprintInput schema from validation.ts:
 *   - pages (blueprintPageSchema)
 *   - blocks (blueprintBlockDefinitionSchema)
 *   - theme (blueprintThemeSchema)
 *   - navigation (blueprintNavigationEntrySchema)
 *   - menus (blueprintMenuItemEntrySchema)
 *   - gallery (blueprintGalleryEntrySchema)
 *   - personalitySettings (blueprintPersonalityEntrySchema)
 */

import type { BlueprintInput } from '../validation';

export const cafeteriaBlueprint: BlueprintInput = {
  id: 'blueprint-cafeteria-default',
  slug: 'cafeteria',
  version: '1.0.0',
  name: 'Café Starter Kit',
  description:
    'A complete starter kit for cafés, including menu, gallery, personality quiz, testimonials, and events pages.',
  category: 'restaurant',

  // Pages — the user-facing routes of the workspace
  pages: [
    {
      key: 'home',
      title: 'Home',
      path: '/',
      blockKeys: ['hero-home', 'about-home', 'features-home'],
    },
    {
      key: 'menu-page',
      title: 'Menu',
      path: '/menu',
      blockKeys: ['gallery-menu'],
    },
    {
      key: 'quiz',
      title: 'شخصیت کافه‌ای تو',
      path: '/quiz',
      blockKeys: ['personality-quiz-section'],
    },
    {
      key: 'testimonials',
      title: 'نظرات مشتریان',
      path: '/testimonials',
      blockKeys: ['testimonials-list'],
    },
    {
      key: 'events',
      title: 'رویدادها',
      path: '/events',
      blockKeys: ['events-list'],
    },
  ],

  // Blocks — reusable content blocks rendered by the CMS renderer
  blocks: [
    {
      key: 'hero-home',
      type: 'hero',
      data: {
        title: 'کافه خانه',
        subtitle: 'جایی که هر فنجان قهوه یک داستان جدید را آغاز می‌کند.',
        backgroundImage: '',
        buttonText: 'مشاهده منو',
        buttonLink: '/menu',
      },
      sortOrder: 1,
    },
    {
      key: 'about-home',
      type: 'text',
      data: {
        title: 'درباره ما',
        content:
          'کافه خانه با فضایی گرم و دوستانه، مکانی ایده‌آل برای لذت بردن از بهترین قهوه‌ها، گفتگوهای صمیمی و لحظات بی‌نظیر است. ما از دانه‌های عربیکا و روبوستای مرغوب استفاده می‌کنیم.',
      },
      sortOrder: 2,
    },
    {
      key: 'features-home',
      type: 'feature-grid',
      data: {
        columns: 3,
        features: [
          { title: 'قهوه تازه رُست‌شده', description: '۱۰۰٪ عربیکا و روبوستا' },
          { title: 'فضای دنج', description: 'مکانی آرام برای کار و گفتگو' },
          { title: 'رویدادهای هفتگی', description: 'موسیقی زنده، کتاب‌گردانی و بیشتر' },
        ],
      },
      sortOrder: 3,
    },
    {
      key: 'gallery-menu',
      type: 'media-gallery',
      data: {
        columns: 3,
        showLightbox: true,
        images: [
          { title: 'لاته‌آرت زیبا', tags: ['coffee', 'latte-art'], sortOrder: 1 },
          { title: 'فضای نشیمن دنج کافه', tags: ['interior', 'cozy'], sortOrder: 2 },
          { title: 'شیرینی‌های تازه', tags: ['pastry', 'dessert'], sortOrder: 3 },
        ],
      },
      sortOrder: 4,
    },
    {
      key: 'personality-quiz-section',
      type: 'personality-quiz',
      data: {
        title: 'شخصیت کافه‌ای تو چیه؟',
        description: '۱۱ سوال کوتاه — ببین کدام نوشیدنی با شخصیتت سازگارتر است.',
        totalQuestions: 11,
      },
      sortOrder: 5,
    },
    {
      key: 'testimonials-list',
      type: 'testimonial-slider',
      data: {
        items: [
          { name: 'سارا م.', text: 'قهوه‌شون واقعاً عالیه!', rating: 5 },
          { name: 'امین ر.', text: 'مکان خوب برای کار کردن.', rating: 4 },
          { name: 'لیلا ک.', text: 'لاته کاراملشون بهترین لاته‌ای بود که تا به حال خوردم!', rating: 5 },
        ],
      },
      sortOrder: 6,
    },
    {
      key: 'events-list',
      type: 'event-list',
      data: {
        events: [
          { title: 'موسیقی زنده — شنبه شب', description: 'اجرای زنده پیانو و گیتار.', location: 'سالن اصلی' },
          { title: 'کتاب‌گردانی شبانه', description: 'جلسه هفتگی مطالعه و نقد کتاب.', location: 'آی‌بِک کافه' },
        ],
      },
      sortOrder: 7,
    },
  ],

  // Theme — matches blueprintThemeSchema
  theme: {
    presetId: 'café-rose-gold',
    overrides: {
      primaryColor: '#9f1239', // Rose
      accentColor: '#d4af37', // Gold
    },
  },

  // Navigation entries
  navigation: [
    { title: 'خانه', path: '/', sortOrder: 1 },
    { title: 'منو', path: '/menu', sortOrder: 2 },
    { title: 'کوییز', path: '/quiz', sortOrder: 3 },
    { title: 'نظرات', path: '/testimonials', sortOrder: 4 },
    { title: 'رویدادها', path: '/events', sortOrder: 5 },
  ],

  // Font config
  fonts: { body: 'inherit', heading: 'inherit', importGoogleFonts: false, imports: [] },

  // SEO config
  seo: { title: 'کافه خانه — شخصیت کافه‌ای‌ات رو کشف کن', description: 'تجربه‌ای فراتر از قهوه.' },

  // Analytics config
  analytics: { enabled: true, provider: 'supabase' },

  // Menu items — matches blueprintMenuItemEntrySchema
  menus: [
    { name: 'اسپرسو', description: '۱۰۰٪ عربیکا، رُست مدیوم', price: '35000', category: 'قهوه گرم', sortOrder: 1 },
    { name: 'کاپوچینو', description: 'اسپرسو + شیر بخار داده شده', price: '45000', category: 'قهوه گرم', sortOrder: 2 },
    { name: 'لاته کارامل', description: 'اسپرسو + شیر + سس کارامل', price: '50000', category: 'قهوه ویژه', sortOrder: 3 },
    { name: 'چای ماسالا', description: 'چای سیاه + دارچین + زنجبیل', price: '30000', category: 'نوشیدنی گرم', sortOrder: 4 },
    { name: 'موهیتو کلاسیک', description: 'نعنای تازه + لیمو + سودا', price: '40000', category: 'نوشیدنی سرد', sortOrder: 5 },
    {
      name: 'چیزکیک نیویورکی',
      description: 'دست‌ساز، با پنیر خامه‌ای و سس توت‌فرنگی',
      price: '60000',
      category: 'شیرینی',
      sortOrder: 6,
    },
  ],

  // Gallery entries — matches blueprintGalleryEntrySchema
  gallery: [
    { title: 'لاته‌آرت زیبا', tags: ['coffee', 'latte-art'], sortOrder: 1 },
    { title: 'فضای نشیمن دنج کافه', tags: ['interior', 'cozy'], sortOrder: 2 },
    { title: 'شیرینی‌های تازه', tags: ['pastry', 'dessert'], sortOrder: 3 },
  ],

  // Personality quiz results — matches blueprintPersonalityEntrySchema
  personalitySettings: [
    {
      key: 'espresso',
      label: 'اسپرسو',
      tagline: 'تند و قدرتمند',
      description: 'شخصیتی قوی، تصمیم‌گیرنده سریع',
      traits: ['قوی', 'سریع', 'مستقیم'],
      drink: 'Espresso',
      colorFrom: '#1a0f00',
      colorTo: '#5d3a1a',
    },
    {
      key: 'latte',
      label: 'لاته',
      tagline: 'نرم و دوستانه',
      description: 'شخصیتی آرام، گوش‌دهنده خوب',
      traits: ['آرام', 'مهربان', 'صبور'],
      drink: 'Café Latte',
      colorFrom: '#d4a574',
      colorTo: '#f5e6d3',
    },
    {
      key: 'mocha',
      label: 'موکا',
      tagline: 'شیرین و خلاق',
      description: 'تخیل قوی، عاشق هنر',
      traits: ['خلاق', 'شیرین', 'هیجانی'],
      drink: 'Mocha',
      colorFrom: '#3e1f00',
      colorTo: '#8b4513',
    },
  ],

  // Media folder structure
  mediaFolderStructure: [
    { path: '/images/coffee', description: 'تصاویر قهوه' },
    { path: '/images/interior', description: 'فضای داخلی کافه' },
    { path: '/images/pastries', description: 'شیرینی‌ها و غذاها' },
  ],

  // Permissions
  permissions: { admin: ['*'], member: ['pages.read', 'gallery.read'], viewer: ['pages.read'] },

  // Metadata
  metadata: { createdBy: 'system', tags: ['cafe', 'restaurant', 'starter'], isPublished: true },
};

/**
 * Returns a deep-copied blueprint so the provision engine can mutate it
 * without affecting the shared original.
 */
export function getCafeteriaBlueprint(): BlueprintInput {
  return JSON.parse(JSON.stringify(cafeteriaBlueprint));
}
