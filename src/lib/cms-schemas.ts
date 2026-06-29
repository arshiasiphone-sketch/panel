import { z } from "zod";

export const menuItemSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.string().min(1, "دسته الزامی است"),
  name: z.string().min(1, "نام الزامی است"),
  description: z.string().optional().default(""),
  price: z.string().min(1, "قیمت الزامی است"),
  image_url: z.string().url("آدرس نامعتبر").optional().or(z.literal("")).default(""),
  sort_order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export type MenuItemInput = z.input<typeof menuItemSchema>;

export const galleryImageSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().default(""),
  image_url: z.string().url("آدرس تصویر نامعتبر"),
  tags: z.array(z.string()).optional().default([]),
  sort_order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export type GalleryImageInput = z.input<typeof galleryImageSchema>;

export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "عنوان الزامی است"),
  description: z.string().optional().default(""),
  date_label: z.string().optional().default(""),
  image_url: z.string().optional().default(""),
  sort_order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export type EventInput = z.input<typeof eventSchema>;

export const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "نام الزامی است"),
  type: z.string().optional().default(""),
  text: z.string().min(1, "متن الزامی است"),
  sort_order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export type TestimonialInput = z.input<typeof testimonialSchema>;

export const blockSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.string().min(1),
  data: z.record(z.any()).default({}),
  sort_order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export type BlockInput = z.input<typeof blockSchema>;

export const themeSchema = z.object({
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "رنگ نامعتبر"),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_tertiary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  border_radius: z.string(),
  glass_opacity: z.number().min(0).max(1),
});
export type ThemeInput = z.input<typeof themeSchema>;

export const heroContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  badge: z.string(),
  cta_text: z.string(),
});
export const contactContentSchema = z.object({
  address: z.string(),
  phone: z.string(),
  hours: z.string(),
});
export const socialContentSchema = z.object({
  instagram: z.string(),
  instagram_handle: z.string(),
});
export const metaContentSchema = z.object({
  title: z.string(),
  bio: z.string(),
  avatar_url: z.string().optional().default(""),
});
