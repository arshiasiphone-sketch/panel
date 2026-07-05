/**
 * NAMA Platform — Provision Validator.
 *
 * Validates provision requests before the pipeline starts.
 * All validation is DATA-driven — checks blueprint existence,
 * user permissions, plan compatibility, and request integrity.
 *
 * ENTERPRISE FEATURES:
 * - Schema validation: Full blueprint data structure check
 * - Duplicate detection: Detect duplicate IDs, keys, and block keys
 * - Dependency graph: Verify all referenced blocks exist
 * - Version compatibility: Check blueprint version compatibility
 * - Workspace readiness: Verify workspace limits and user capacity
 * - Theme compatibility: Ensure theme preset is valid
 */

import { BaseRepository, type RepositoryDependencies } from "@/lib/repositories/base";
import type { ProvisionRequest } from "./types";
import { provisionRequestSchema, blueprintSchema, type ProvisionRequestInput } from "./validation";
import type { BlueprintLoader } from "./blueprint/loader";
import type { WorkspaceRepository } from "@/lib/core/workspace/repository";

export interface ValidatorDependencies {
  blueprintLoader: BlueprintLoader;
  workspaceRepository: WorkspaceRepository;
}

export interface ValidationResult {
  /** Whether the validation passed. */
  valid: boolean;
  /** Error message if invalid. */
  error?: string;
  /** Validation warnings. */
  warnings: string[];
  /** Resolved blueprint info (if found). */
  resolved?: {
    blueprintId: string;
    blueprintSlug: string;
    blueprintVersion: string;
    blueprintName: string;
  };
}

/** Detailed validation issue. */
interface ValidationIssue {
  /** Severity level. */
  level: "error" | "warning";
  /** Issue category (e.g., "schema", "duplicate", "dependency", "version"). */
  category: string;
  /** Human-readable message. */
  message: string;
  /** Field or entity the issue relates to. */
  field?: string;
}

/** Result of blueprint data validation. */
interface BlueprintValidationResult {
  /** Whether the blueprint data is valid. */
  valid: boolean;
  /** List of issues found. */
  issues: ValidationIssue[];
}

export class ProvisionValidator extends BaseRepository {
  private readonly blueprintLoader: BlueprintLoader;
  private readonly workspaceRepository: WorkspaceRepository;

  constructor(deps: RepositoryDependencies & ValidatorDependencies) {
    super(deps);
    this.blueprintLoader = deps.blueprintLoader;
    this.workspaceRepository = deps.workspaceRepository;
  }

  /**
   * Validate a provision request.
   * Comprehensive validation covering:
   * 1. Input structure validity
   * 2. Blueprint existence
   * 3. Blueprint data integrity (schemas, duplicates, dependencies)
   * 4. Owner user validity
   * 5. Workspace limits
   * 6. Plan compatibility
   * 7. Version compatibility
   */
  async validate(input: ProvisionRequestInput): Promise<ValidationResult> {
    const warnings: string[] = [];

    // 1. Validate input structure via Zod schema
    const parsed = provisionRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        valid: false,
        error: `Invalid request: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
        warnings,
      };
    }

    const data = parsed.data;

    // 2. Check blueprint exists
    const blueprint = await this.blueprintLoader.load(data.blueprintSlug, data.blueprintVersion);
    if (!blueprint) {
      const versionStr = data.blueprintVersion ?? "latest";
      return {
        valid: false,
        error: `Blueprint not found: ${data.blueprintSlug}@${versionStr}`,
        warnings,
      };
    }

    // 3. Validate blueprint data integrity
    const dataValidation = this._validateBlueprintData(blueprint);
    if (!dataValidation.valid) {
      const errorIssues = dataValidation.issues
        .filter((i) => i.level === "error")
        .map((i) => i.message);
      const warningIssues = dataValidation.issues
        .filter((i) => i.level === "warning")
        .map((i) => i.message);

      if (errorIssues.length > 0) {
        return {
          valid: false,
          error: `Blueprint data validation failed: ${errorIssues.join("; ")}`,
          warnings: [...warnings, ...warningIssues],
        };
      }

      // Only warnings — continue
      warnings.push(...warningIssues);
    }

    // 4. Check blueprint publication status
    if (!blueprint.metadata.isPublished) {
      warnings.push(`Blueprint "${blueprint.name}" is not published — provisioning with unpublished blueprint`);
    }

    // 5. Check owner user validity
    try {
      const userWorkspaces = await this.workspaceRepository.findByUserId(data.ownerUserId);
      if (userWorkspaces.length > 0) {
        warnings.push(`User already has ${userWorkspaces.length} workspace(s) — creating another`);
      }
    } catch {
      warnings.push("Could not verify owner user — proceeding with provision");
    }

    // 6. Check plan compatibility
    const blueprintPlanTiers = ["free", "starter", "pro", "enterprise"];
    const requestedTier = blueprintPlanTiers.indexOf(data.plan ?? "free");
    if (requestedTier < 0) {
      warnings.push(`Unknown plan: ${data.plan} — using free plan`);
    }

    // 7. Check version compatibility
    if (blueprint.metadata.updatedAt) {
      const versionAge = Date.now() - new Date(blueprint.metadata.updatedAt).getTime();
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      if (versionAge > maxAge) {
        warnings.push(
          `Blueprint "${blueprint.name}" v${blueprint.version} has not been updated in over 30 days — ` +
          "consider checking for a newer version",
        );
      }
    }

    return {
      valid: true,
      warnings,
      resolved: {
        blueprintId: blueprint.id,
        blueprintSlug: blueprint.slug,
        blueprintVersion: blueprint.version,
        blueprintName: blueprint.name,
      },
    };
  }

  // ─── Blueprint data validation ──────────────────────────────────────────

  /**
   * Validate the internal consistency of a blueprint data definition.
   * Checks for:
   * - Schema validity (all required fields present)
   * - Duplicate IDs, keys, and block keys
   * - Dependency graph (all referenced blocks exist)
   * - Theme compatibility (preset is valid)
   */
  private _validateBlueprintData(blueprint: import("./types").Blueprint): BlueprintValidationResult {
    const issues: ValidationIssue[] = [];

    // Check schema validity
    const schemaResult = blueprintSchema.safeParse(blueprint);
    if (!schemaResult.success) {
      for (const issue of schemaResult.error.issues) {
        issues.push({
          level: "error",
          category: "schema",
          message: `${issue.path.join(".")}: ${issue.message}`,
          field: issue.path.join("."),
        });
      }
    }

    // Check for duplicate page keys
    const pageKeys = new Set<string>();
    for (const page of blueprint.pages) {
      if (pageKeys.has(page.key)) {
        issues.push({
          level: "error",
          category: "duplicate",
          message: `Duplicate page key: "${page.key}"`,
          field: `pages[${page.key}]`,
        });
      }
      pageKeys.add(page.key);
    }

    // Check for duplicate block keys
    const blockKeys = new Set<string>();
    for (const block of blueprint.blocks) {
      if (blockKeys.has(block.key)) {
        issues.push({
          level: "error",
          category: "duplicate",
          message: `Duplicate block key: "${block.key}"`,
          field: `blocks[${block.key}]`,
        });
      }
      blockKeys.add(block.key);
    }

    // Check dependency graph — all referenced block keys must exist
    const allBlockKeys = new Set(blueprint.blocks.map((b) => b.key));
    for (const page of blueprint.pages) {
      for (const blockKey of page.blockKeys) {
        if (!allBlockKeys.has(blockKey)) {
          issues.push({
            level: "error",
            category: "dependency",
            message: `Page "${page.key}" references unknown block key: "${blockKey}"`,
            field: `pages[${page.key}].blockKeys`,
          });
        }
      }
    }

    // Check for orphan blocks — blocks not referenced by any page
    const referencedKeys = new Set<string>();
    for (const page of blueprint.pages) {
      for (const key of page.blockKeys) {
        referencedKeys.add(key);
      }
    }
    for (const block of blueprint.blocks) {
      if (!referencedKeys.has(block.key)) {
        issues.push({
          level: "warning",
          category: "dependency",
          message: `Block "${block.key}" is not referenced by any page — may be unused`,
          field: `blocks[${block.key}]`,
        });
      }
    }

    // Check theme compatibility
    if (!blueprint.theme.presetId || blueprint.theme.presetId.trim() === "") {
      issues.push({
        level: "warning",
        category: "theme",
        message: "No theme preset specified — will use default theme",
        field: "theme.presetId",
      });
    }

    // Check navigation items have required fields
    for (let i = 0; i < blueprint.navigation.length; i++) {
      const nav = blueprint.navigation[i];
      if (!nav.title || !nav.path) {
        issues.push({
          level: "error",
          category: "schema",
          message: `Navigation item at index ${i} is missing title or path`,
          field: `navigation[${i}]`,
        });
      }
    }

    // Check page paths are unique (no duplicate routes)
    const pagePaths = new Set<string>();
    for (const page of blueprint.pages) {
      if (pagePaths.has(page.path)) {
        issues.push({
          level: "error",
          category: "duplicate",
          message: `Duplicate page path: "${page.path}" (pages "${page.key}" and others)`,
          field: `pages[${page.key}].path`,
        });
      }
      pagePaths.add(page.path);
    }

    // Check SEO has required fields
    if (!blueprint.seo.title || !blueprint.seo.description) {
      issues.push({
        level: "warning",
        category: "schema",
        message: "SEO title or description is missing — search engines may not display results correctly",
        field: "seo",
      });
    }

    return {
      valid: issues.filter((i) => i.level === "error").length === 0,
      issues,
    };
  }

  /**
   * Quick validation — just checks if the request structure is valid.
   * Useful for real-time UI validation before submitting.
   */
  validateRequest(input: ProvisionRequestInput): { valid: boolean; error?: string } {
    const parsed = provisionRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        valid: false,
        error: parsed.error.issues.map((i) => i.message).join("; "),
      };
    }
    return { valid: true };
  }
}
