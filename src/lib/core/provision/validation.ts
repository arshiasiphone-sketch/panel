/**
 * NAMA Platform — Provision Validation.
 *
 * Zod schemas for provision operations, blueprint definitions,
 * and provision requests. Everything is DATA-driven.
 */

import { z } from "zod";
import { ProvisionStep } from "./types";
import { workspacePlanSchema } from "@/lib/core/workspace/validation";

// ─── Blueprint schemas ───────────────────────────────────────────────────────

export const blueprintPageSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  path: z.string().min(1),
  blockKeys: z.array(z.string()),
});

export const blueprintBlockDefinitionSchema = z.object({
  key: z.string().min(1),
  type: z.string().min(1),
  data: z.record(z.unknown()).default({}),
  sortOrder: z.number().int().default(0),
});

export const blueprintThemeSchema = z.object({
  presetId: z.string().min(1),
  overrides: z
    .object({
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      accentColor: z.string().optional(),
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      textSecondaryColor: z.string().optional(),
      textTertiaryColor: z.string().optional(),
      borderRadius: z.string().optional(),
      glassOpacity: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export const blueprintNavigationEntrySchema = z.object({
  title: z.string().min(1),
  path: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const blueprintFontConfigSchema = z.object({
  body: z.string().default("inherit"),
  heading: z.string().default("inherit"),
  importGoogleFonts: z.boolean().default(false),
  imports: z.array(z.string()).optional(),
});

export const blueprintSEOConfigSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  ogImage: z.string().optional(),
  additionalMeta: z.record(z.string()).optional(),
});

export const blueprintAnalyticsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  provider: z.string().optional().default("supabase"),
});

export const blueprintMenuItemEntrySchema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  price: z.string().default(""),
  imageUrl: z.string().optional().default(""),
  sortOrder: z.number().int().default(0),
});

export const blueprintGalleryEntrySchema = z.object({
  title: z.string().default(""),
  tags: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
});

export const blueprintPersonalityEntrySchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  tagline: z.string().default(""),
  description: z.string().default(""),
  traits: z.array(z.string()).default([]),
  drink: z.string().optional(),
  spot: z.string().optional(),
  colorFrom: z.string().optional(),
  colorTo: z.string().optional(),
});

export const blueprintMediaFolderSchema = z.object({
  path: z.string().min(1),
  description: z.string().default(""),
});

export const blueprintPermissionsSchema = z.object({
  admin: z.array(z.string()).default([]),
  member: z.array(z.string()).default([]),
  viewer: z.array(z.string()).default([]),
});

export const blueprintMetadataSchema = z.object({
  createdBy: z.string().default("system"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
});

export const blueprintSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  version: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  category: z.string().min(1),
  pages: z.array(blueprintPageSchema).default([]),
  blocks: z.array(blueprintBlockDefinitionSchema).default([]),
  theme: blueprintThemeSchema,
  navigation: z.array(blueprintNavigationEntrySchema).default([]),
  fonts: blueprintFontConfigSchema.default({ body: "inherit", heading: "inherit", importGoogleFonts: false }),
  seo: blueprintSEOConfigSchema.default({ title: "", description: "" }),
  analytics: blueprintAnalyticsConfigSchema.default({ enabled: true }),
  menus: z.array(blueprintMenuItemEntrySchema).default([]),
  gallery: z.array(blueprintGalleryEntrySchema).default([]),
  businessSettings: z.record(z.unknown()).default({}),
  personalitySettings: z.array(blueprintPersonalityEntrySchema).default([]),
  mediaFolderStructure: z.array(blueprintMediaFolderSchema).default([]),
  permissions: blueprintPermissionsSchema.default({ admin: [], member: [], viewer: [] }),
  metadata: blueprintMetadataSchema.default({ createdBy: "system", tags: [], isPublished: true }),
});

export type BlueprintInput = z.input<typeof blueprintSchema>;

// ─── Provision request schema ────────────────────────────────────────────────

export const provisionRequestSchema = z.object({
  blueprintSlug: z.string().min(1, "Blueprint slug is required"),
  blueprintVersion: z.string().optional(),
  workspaceName: z.string().min(1).max(200).optional(),
  workspaceDescription: z.string().max(2000).optional(),
  domain: z.string().min(1).max(253).optional(),

  // ── Public Provisioning API fields (from external systems like Convex sales panel) ──
  requestedSlug: z
    .string()
    .min(3, "نامک باید حداقل ۳ کاراکتر باشد")
    .max(30, "نامک نباید بیشتر از ۳۰ کاراکتر باشد")
    .regex(/^[a-z0-9-]+$/, "فقط حروف کوچک لاتین، عدد و خط تیره مجاز است"),
  externalOrderId: z.string().min(1, "شناسه سفارش الزامی است"),
  customerEmail: z.string().email("ایمیل نامعتبر است"),
  businessName: z.string().min(2, "نام کسب‌وکار الزامی است"),

  // ── Internal NAMA fields (optional for Public API flow) ──
  ownerUserId: z.string().min(1).optional(),
  plan: workspacePlanSchema.optional().default("free"),
  locale: z.string().min(2).max(10).optional().default("fa-IR"),
  timezone: z.string().min(1).max(50).optional().default("Asia/Tehran"),
  metadata: z.record(z.unknown()).optional(),
});

export type ProvisionRequestInput = z.input<typeof provisionRequestSchema>;

// ─── Blueprint registration schema ───────────────────────────────────────────

export const registerBlueprintSchema = blueprintSchema.pick({
  id: true,
  slug: true,
  version: true,
  name: true,
  description: true,
  category: true,
  metadata: true,
});

export type RegisterBlueprintInput = z.input<typeof registerBlueprintSchema>;

// ─── Pipeline step schema ────────────────────────────────────────────────────

const provisionStepValues = [
  "validate_request",
  "create_workspace",
  "install_blueprint",
  "seed_data",
  "insert_theme",
  "insert_fonts",
  "insert_default_media",
  "insert_analytics_defaults",
  "run_health_check",
  "workspace_ready",
] as const;

export const provisionStepSchema = z.enum(provisionStepValues);

export const provisionStepResultSchema = z.object({
  step: provisionStepSchema,
  success: z.boolean(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  durationMs: z.number().int().optional(),
  error: z.string().optional(),
  output: z.record(z.unknown()).optional(),
});

export const provisionTransactionSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  blueprintId: z.string().min(1),
  blueprintVersion: z.string().min(1),
  status: z.enum(["pending", "in_progress", "completed", "failed", "rolling_back", "rolled_back"]),
   initiatedBy: z.string().min(1).nullable().optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  steps: z.array(provisionStepResultSchema).default([]),
  currentStepIndex: z.number().int().min(0).default(0),
  retryCount: z.number().int().min(0).default(0),
  maxRetries: z.number().int().min(0).default(3),
  error: z.string().optional(),
});

export type ProvisionTransactionInput = z.input<typeof provisionTransactionSchema>;

// ─── Provision report schema ─────────────────────────────────────────────────

export const provisionReportSchema = z.object({
  transactionId: z.string().min(1),
  success: z.boolean(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  durationMs: z.number().int(),
  workspace: z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
    plan: z.string(),
  }),
  blueprint: z.object({
    id: z.string(),
    slug: z.string(),
    version: z.string(),
    name: z.string(),
    category: z.string(),
  }),
  theme: z.object({
    presetId: z.string(),
    applied: z.boolean(),
  }),
  pages: z.object({
    total: z.number().int(),
    created: z.number().int(),
  }),
  blocks: z.object({
    total: z.number().int(),
    inserted: z.number().int(),
  }),
  navigation: z.object({
    total: z.number().int(),
    created: z.number().int(),
  }),
  errors: z.array(
    z.object({
      step: z.string(),
      message: z.string(),
      retried: z.boolean(),
      recovered: z.boolean(),
    }),
  ),
  warnings: z.array(
    z.object({
      step: z.string(),
      message: z.string(),
    }),
  ),
  stepTimings: z.array(
    z.object({
      step: z.string(),
      label: z.string(),
      durationMs: z.number().int(),
      success: z.boolean(),
    }),
  ),
});
