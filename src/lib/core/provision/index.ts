/**
 * NAMA Platform — Provision Engine.
 *
 * The Provision Engine generates complete customer websites from
 * Blueprint definitions. Blueprints are DATA, not React components.
 *
 * Architecture:
 *   ProvisionService ← ProvisionEngine ← Pipeline Components
 *                                         ├─ ProvisionValidator
 *                                         ├─ BlueprintInstaller
 *                                         ├─ ProvisionSeeder
 *                                         ├─ ProvisionHealthChecker
 *                                         ├─ ProvisionTransactionManager
 *                                         ├─ ProvisionRollback
 *                                         └─ ProvisionReportGenerator
 *                                       
 *   BlueprintRegistry ← BlueprintLoader ← BlueprintVersioning
 *
 * One Request → One Ready Website. Everything happens automatically.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type {
  Blueprint,
  BlueprintPage,
  BlueprintBlockDefinition,
  BlueprintTheme,
  BlueprintNavigationEntry,
  BlueprintFontConfig,
  BlueprintSEOConfig,
  BlueprintAnalyticsConfig,
  BlueprintMenuItemEntry,
  BlueprintGalleryEntry,
  BlueprintPersonalityEntry,
  BlueprintMediaFolder,
  BlueprintPermissions,
  BlueprintMetadata,
  ProvisionRequest,
  ProvisionReport,
  ProvisionTransaction,
  ProvisionTransactionStatus,
  ProvisionStepResult,
  ProvisionHealthCheckResult,
  ProvisionHealthCheck,
} from "./types";

export {
  ProvisionStep,
  PROVISION_STEP_LABELS,
  PROVISION_PIPELINE,
  ProvisionError,
  ProvisionStepError,
} from "./types";

// ─── Validation ──────────────────────────────────────────────────────────────

export {
  blueprintSchema,
  blueprintPageSchema,
  blueprintBlockDefinitionSchema,
  blueprintThemeSchema,
  blueprintNavigationEntrySchema,
  blueprintFontConfigSchema,
  blueprintSEOConfigSchema,
  blueprintAnalyticsConfigSchema,
  blueprintMenuItemEntrySchema,
  blueprintGalleryEntrySchema,
  blueprintPersonalityEntrySchema,
  blueprintMediaFolderSchema,
  blueprintPermissionsSchema,
  blueprintMetadataSchema,
  provisionRequestSchema,
  provisionStepSchema,
  provisionTransactionSchema,
  provisionReportSchema,
  registerBlueprintSchema,
} from "./validation";

export type {
  BlueprintInput,
  ProvisionRequestInput,
  RegisterBlueprintInput,
  ProvisionTransactionInput,
} from "./validation";

// ─── Blueprint Layer ─────────────────────────────────────────────────────────

export { BlueprintRegistry } from "./blueprint/registry";
export type { BlueprintIndexEntry, BlueprintIndex } from "./blueprint/registry";

export { BlueprintLoader } from "./blueprint/loader";
export type { LoaderDependencies } from "./blueprint/loader";

export { BlueprintVersioning } from "./blueprint/versioning";
export type { VersioningDependencies, VersionBump } from "./blueprint/versioning";

export { BlueprintInstaller } from "./blueprint/installer";

// ─── Provision Components ────────────────────────────────────────────────────

export { ProvisionTransactionManager } from "./transaction";
export { ProvisionRollback } from "./rollback";
export type { RollbackDependencies } from "./rollback";

export {
  isStepRetryable,
  isTransientError,
  getRetryDelay,
  shouldRetry,
  RETRYABLE_STEPS,
  NON_RETRYABLE_STEPS,
  DEFAULT_RETRY_CONFIG,
} from "./retry";
export type { RetryConfig } from "./retry";

export { ProvisionValidator } from "./validator";
export type { ValidatorDependencies, ValidationResult } from "./validator";

export { ProvisionSeeder } from "./seeder";
export type { SeedResults } from "./seeder";

export { ProvisionHealthChecker } from "./health-checker";

export { ProvisionReportGenerator } from "./report";

// ─── Engine & Service ────────────────────────────────────────────────────────

export { ProvisionEngine } from "./engine";
export type { EngineDependencies } from "./engine";

export { ProvisionService } from "./service";
export type { ProvisionServiceDependencies } from "./service";
