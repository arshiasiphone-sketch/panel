/**
 * NAMA Platform — Provision Engine Types.
 *
 * The Provision Engine generates complete customer websites from
 * Blueprint definitions. Blueprints are DATA, not React components.
 * Everything comes from Blueprint definitions — never hardcoded.
 */

import type { WorkspaceEntity, WorkspaceLimits, WorkspacePlan } from "@/lib/core/workspace/types";

// ─── Blueprint ───────────────────────────────────────────────────────────────

/**
 * A Blueprint is DATA — it defines everything needed to generate a website.
 * Blueprints are NOT React components. They are declarative data structures.
 */
export interface Blueprint {
  /** Unique identifier (e.g., "cafe-v1", "restaurant-v2"). */
  id: string;
  /** URL-friendly slug (e.g., "cafe"). */
  slug: string;
  /** Semantic version (e.g., "1.0.0"). */
  version: string;
  /** Display name (e.g., "Café", "Restaurant"). */
  name: string;
  /** Human-readable description. */
  description: string;
  /** Business category (e.g., "cafe", "restaurant", "portfolio"). */
  category: string;
  /** Page definitions — each page is a collection of block references. */
  pages: BlueprintPage[];
  /** Block definitions — the actual block content referenced by pages. */
  blocks: BlueprintBlockDefinition[];
  /** Theme configuration to apply. */
  theme: BlueprintTheme;
  /** Navigation structure. */
  navigation: BlueprintNavigationEntry[];
  /** Font configuration. */
  fonts: BlueprintFontConfig;
  /** Default SEO settings. */
  seo: BlueprintSEOConfig;
  /** Analytics defaults. */
  analytics: BlueprintAnalyticsConfig;
  /** Menu items (for restaurant/cafe business types). */
  menus: BlueprintMenuItemEntry[];
  /** Gallery defaults. */
  gallery: BlueprintGalleryEntry[];
  /** Business settings data. */
  businessSettings: Record<string, unknown>;
  /** Personality type profiles. */
  personalitySettings: BlueprintPersonalityEntry[];
  /** Media folder structure to create. */
  mediaFolderStructure: BlueprintMediaFolder[];
  /** Default permissions and roles. */
  permissions: BlueprintPermissions;
  /** Blueprint metadata. */
  metadata: BlueprintMetadata;
}

/** A page definition within a blueprint. */
export interface BlueprintPage {
  /** Unique page key (e.g., "home", "about", "menu"). */
  key: string;
  /** Display title (e.g., "خانه", "منوی کافه"). */
  title: string;
  /** URL path (e.g., "/", "/about", "/menu"). */
  path: string;
  /** Ordered block keys that make up this page. */
  blockKeys: string[];
}

/** A block definition within a blueprint. */
export interface BlueprintBlockDefinition {
  /** Unique block key referenced by pages. */
  key: string;
  /** Block type (e.g., "hero", "features", "gallery", "contact"). */
  type: string;
  /** Block data — the actual content for this block. */
  data: Record<string, unknown>;
  /** Default sort order. */
  sortOrder: number;
}

/** Theme configuration within a blueprint. */
export interface BlueprintTheme {
  /** Theme preset ID to use (e.g., "cappuccino", "emerald"). */
  presetId: string;
  /** Optional overrides to the preset. */
  overrides?: Partial<{
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    textSecondaryColor: string;
    textTertiaryColor: string;
    borderRadius: string;
    glassOpacity: number;
  }>;
}

/** A single navigation entry. */
export interface BlueprintNavigationEntry {
  /** Display label. */
  title: string;
  /** Target path. */
  path: string;
  /** Display order. */
  sortOrder: number;
}

/** Font configuration. */
export interface BlueprintFontConfig {
  /** Primary body font family. */
  body: string;
  /** Heading font family. */
  heading: string;
  /** Whether to import Google Fonts. */
  importGoogleFonts: boolean;
  /** Additional font imports. */
  imports?: string[];
}

/** SEO configuration. */
export interface BlueprintSEOConfig {
  /** Default page title. */
  title: string;
  /** Default meta description. */
  description: string;
  /** Default OG image URL. */
  ogImage?: string;
  /** Additional meta tags. */
  additionalMeta?: Record<string, string>;
}

/** Analytics configuration. */
export interface BlueprintAnalyticsConfig {
  /** Whether analytics tracking is enabled by default. */
  enabled: boolean;
  /** Analytics provider (default: "supabase"). */
  provider?: string;
}

/** A menu item entry for restaurant/cafe blueprints. */
export interface BlueprintMenuItemEntry {
  /** Category name (e.g., "قهوه", "دسر"). */
  category: string;
  /** Item name. */
  name: string;
  /** Item description. */
  description: string;
  /** Price string (e.g., "120,000 تومان"). */
  price: string;
  /** Image URL (empty for placeholder). */
  imageUrl?: string;
  /** Display order within category. */
  sortOrder: number;
}

/** A gallery entry within a blueprint. */
export interface BlueprintGalleryEntry {
  /** Image title. */
  title: string;
  /** Tags for categorization. */
  tags: string[];
  /** Display order. */
  sortOrder: number;
}

/** A personality type profile entry. */
export interface BlueprintPersonalityEntry {
  /** Unique key (e.g., "istj", "enfp"). */
  key: string;
  /** Display label (e.g., "ISTJ — مدیر"). */
  label: string;
  /** Short tagline. */
  tagline: string;
  /** Full description. */
  description: string;
  /** Personality traits. */
  traits: string[];
  /** Associated drink. */
  drink?: string;
  /** Associated spot/location. */
  spot?: string;
  /** Gradient start color. */
  colorFrom?: string;
  /** Gradient end color. */
  colorTo?: string;
}

/** A media folder to create during provisioning. */
export interface BlueprintMediaFolder {
  /** Folder path (e.g., "default/logo", "default/gallery"). */
  path: string;
  /** Description of the folder's purpose. */
  description: string;
}

/** Permission definitions for a blueprint. */
export interface BlueprintPermissions {
  /** Default admin role permissions. */
  admin: string[];
  /** Default member role permissions. */
  member: string[];
  /** Default viewer role permissions. */
  viewer: string[];
}

/** Blueprint metadata. */
export interface BlueprintMetadata {
  /** Creator identifier. */
  createdBy: string;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
  /** Categorization tags. */
  tags: string[];
  /** Whether this version is published and available. */
  isPublished: boolean;
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

/** The sequential steps in the provisioning pipeline. */
export enum ProvisionStep {
  VALIDATE_REQUEST = "validate_request",
  CREATE_WORKSPACE = "create_workspace",
  /** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
  ASSIGN_OWNER = "assign_owner",
  /** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
  ASSIGN_PLAN = "assign_plan",
  INSTALL_BLUEPRINT = "install_blueprint",
  /** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
  CREATE_PAGES = "create_pages",
  /** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
  CREATE_NAVIGATION = "create_navigation",
  /** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
  INSERT_BLOCKS = "insert_blocks",
  /** @deprecated Merged into INSTALL_BLUEPRINT. Kept for backward compatibility. */
  INSERT_CMS_DATA = "insert_cms_data",
  SEED_DATA = "seed_data",
  INSERT_THEME = "insert_theme",
  INSERT_FONTS = "insert_fonts",
  INSERT_DEFAULT_MEDIA = "insert_default_media",
  INSERT_ANALYTICS_DEFAULTS = "insert_analytics_defaults",
  RUN_HEALTH_CHECK = "run_health_check",
  WORKSPACE_READY = "workspace_ready",
}

/** Labels for each pipeline step (including deprecated values for backward compatibility). */
export const PROVISION_STEP_LABELS: Record<ProvisionStep, string> = {
  [ProvisionStep.VALIDATE_REQUEST]: "Validate Request",
  [ProvisionStep.CREATE_WORKSPACE]: "Create Workspace",
  [ProvisionStep.ASSIGN_OWNER]: "Assign Owner",
  [ProvisionStep.ASSIGN_PLAN]: "Assign Plan",
  [ProvisionStep.INSTALL_BLUEPRINT]: "Install Blueprint",
  [ProvisionStep.CREATE_PAGES]: "Create Pages",
  [ProvisionStep.CREATE_NAVIGATION]: "Create Navigation",
  [ProvisionStep.INSERT_BLOCKS]: "Insert Blocks",
  [ProvisionStep.INSERT_CMS_DATA]: "Insert CMS Data",
  [ProvisionStep.SEED_DATA]: "Seed Data",
  [ProvisionStep.INSERT_THEME]: "Insert Theme",
  [ProvisionStep.INSERT_FONTS]: "Insert Fonts",
  [ProvisionStep.INSERT_DEFAULT_MEDIA]: "Insert Default Media",
  [ProvisionStep.INSERT_ANALYTICS_DEFAULTS]: "Insert Analytics Defaults",
  [ProvisionStep.RUN_HEALTH_CHECK]: "Run Health Check",
  [ProvisionStep.WORKSPACE_READY]: "Workspace Ready",
};

/** Ordered list of pipeline steps — consolidated from the original 15 to 10 meaningful steps. */
export const PROVISION_PIPELINE: readonly ProvisionStep[] = [
  ProvisionStep.VALIDATE_REQUEST,
  ProvisionStep.CREATE_WORKSPACE,
  ProvisionStep.INSTALL_BLUEPRINT,
  ProvisionStep.SEED_DATA,
  ProvisionStep.INSERT_THEME,
  ProvisionStep.INSERT_FONTS,
  ProvisionStep.INSERT_DEFAULT_MEDIA,
  ProvisionStep.INSERT_ANALYTICS_DEFAULTS,
  ProvisionStep.RUN_HEALTH_CHECK,
  ProvisionStep.WORKSPACE_READY,
];

// ─── Transaction ─────────────────────────────────────────────────────────────

/** Status of a provision transaction. */
export type ProvisionTransactionStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "rolling_back"
  | "rolled_back";

/** A single step result within a transaction. */
export interface ProvisionStepResult {
  /** The step that was executed. */
  step: ProvisionStep;
  /** Whether the step succeeded. */
  success: boolean;
  /** ISO timestamp when the step started. */
  startedAt: string;
  /** ISO timestamp when the step completed. */
  completedAt?: string;
  /** Duration in milliseconds. */
  durationMs?: number;
  /** Error message if the step failed. */
  error?: string;
  /** Any data produced by this step (e.g., workspace ID, page count). */
  output?: Record<string, unknown>;
}

/** A complete provision transaction log. */
export interface ProvisionTransaction {
  /** Unique transaction ID. */
  id: string;
  /** Workspace ID being provisioned. */
  workspaceId: string;
  /** Blueprint ID being installed. */
  blueprintId: string;
  /** Blueprint version being installed. */
  blueprintVersion: string;
  /** Current transaction status. */
  status: ProvisionTransactionStatus;
  /** User who initiated the provision. */
  initiatedBy: string;
  /** ISO timestamp when the transaction started. */
  startedAt: string;
  /** ISO timestamp when the transaction completed. */
  completedAt?: string;
  /** Results of each step. */
  steps: ProvisionStepResult[];
  /** Current step index in the pipeline. */
  currentStepIndex: number;
  /** Number of retry attempts (if retrying). */
  retryCount: number;
  /** Max retries allowed. */
  maxRetries: number;
  /** Error message if the overall transaction failed. */
  error?: string;
}

// ─── Provision Request ───────────────────────────────────────────────────────

/** Input to start a provision. */
export interface ProvisionRequest {
  /** Blueprint slug to install (e.g., "cafe"). */
  blueprintSlug: string;
  /** Blueprint version (e.g., "1.0.0"). Defaults to latest. */
  blueprintVersion?: string;
  /** Name for the new workspace. Defaults to blueprint name. */
  workspaceName?: string;
  /** Workspace description. */
  workspaceDescription?: string;
  /** Owner user ID. */
  ownerUserId: string;
  /** Plan to assign. */
  plan?: WorkspacePlan;
  /** Locale (e.g., "fa-IR"). */
  locale?: string;
  /** Timezone (e.g., "Asia/Tehran"). */
  timezone?: string;
}

// ─── Provision Report ────────────────────────────────────────────────────────

/** A complete provision report. */
export interface ProvisionReport {
  /** Transaction ID. */
  transactionId: string;
  /** Overall success or failure. */
  success: boolean;
  /** ISO timestamp when provisioning started. */
  startedAt: string;
  /** ISO timestamp when provisioning ended. */
  completedAt: string;
  /** Total duration in milliseconds. */
  durationMs: number;

  /** Workspace info. */
  workspace: {
    id: string;
    name: string;
    status: string;
    plan: string;
  };

  /** Blueprint info. */
  blueprint: {
    id: string;
    slug: string;
    version: string;
    name: string;
    category: string;
  };

  /** Theme info. */
  theme: {
    presetId: string;
    applied: boolean;
  };

  /** Page stats. */
  pages: {
    total: number;
    created: number;
  };

  /** Block stats. */
  blocks: {
    total: number;
    inserted: number;
  };

  /** Navigation stats. */
  navigation: {
    total: number;
    created: number;
  };

  /** Errors encountered (if any). */
  errors: Array<{
    step: string;
    message: string;
    retried: boolean;
    recovered: boolean;
  }>;

  /** Warnings (non-fatal issues). */
  warnings: Array<{
    step: string;
    message: string;
  }>;

  /** Step timing breakdown. */
  stepTimings: Array<{
    step: string;
    label: string;
    durationMs: number;
    success: boolean;
  }>;
}

// ─── Health Check ────────────────────────────────────────────────────────────

export interface ProvisionHealthCheckResult {
  /** Overall healthy. */
  healthy: boolean;
  /** Human-readable summary. */
  summary: string;
  /** Individual check results. */
  checks: ProvisionHealthCheck[];
}

export interface ProvisionHealthCheck {
  /** Check name. */
  name: string;
  /** Whether the check passed. */
  passed: boolean;
  /** Detail message. */
  detail?: string;
  /** Optional diagnostic data. */
  data?: Record<string, unknown>;
}

// ─── Error types ─────────────────────────────────────────────────────────────

export class ProvisionError extends Error {
  constructor(
    message: string,
    public readonly code: string = "PROVISION_ERROR",
    public readonly step?: ProvisionStep,
    public readonly recoverable: boolean = false,
  ) {
    super(message);
    this.name = "ProvisionError";
  }
}

export class ProvisionStepError extends Error {
  constructor(
    message: string,
    public readonly step: ProvisionStep,
    public readonly retryable: boolean = false,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ProvisionStepError";
  }
}
