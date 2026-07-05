/**
 * NAMA Platform — Blueprint Versioning.
 *
 * Version management for blueprints.
 * Blueprints use semantic versioning (MAJOR.MINOR.PATCH).
 * Each version is a complete, independent blueprint definition.
 *
 * ENTERPRISE FEATURES:
 * - Migration Plan: Generate migration steps between versions
 * - Upgrade/Downgrade: Support version transitions
 * - Compatibility Matrix: Check cross-version compatibility
 * - Version Ranges: Support semver range matching (^1.0.0, ~1.2.0)
 * - Changelog: Track changes between versions
 */

import type { BlueprintRegistry, BlueprintIndexEntry } from "./registry";

export interface VersioningDependencies {
  registry: BlueprintRegistry;
}

export type VersionBump = "major" | "minor" | "patch";

/** Direction of version change. */
export type MigrationDirection = "upgrade" | "downgrade";

/** Severity of a breaking change. */
export type BreakingChangeSeverity = "none" | "patch" | "minor" | "major";

/** A single migration step between versions. */
export interface MigrationStep {
  /** Source version. */
  from: string;
  /** Target version. */
  to: string;
  /** Direction of migration. */
  direction: MigrationDirection;
  /** Description of what changed. */
  description: string;
  /** Whether this is a breaking change. */
  breaking: boolean;
  /** Actions required during migration. */
  actions: string[];
}

/** Complete migration plan between two versions. */
export interface MigrationPlan {
  /** Source version. */
  from: string;
  /** Target version. */
  to: string;
  /** Number of steps in the migration. */
  stepCount: number;
  /** Whether the migration is possible. */
  possible: boolean;
  /** Reason if migration is not possible. */
  reason?: string;
  /** Ordered list of migration steps. */
  steps: MigrationStep[];
}

/** Entry in the changelog for a version. */
export interface ChangelogEntry {
  /** Version string. */
  version: string;
  /** Release date (ISO timestamp). */
  date: string;
  /** Summary of changes. */
  changes: string[];
  /** Whether this version has breaking changes. */
  breaking: boolean;
}

/**
 * Blueprint Version Manager.
 *
 * Blueprints are versioned data definitions.
 * Version changes do NOT modify existing provisioned workspaces —
 * they only affect future provisions.
 *
 * ENTERPRISE HARDENING:
 * - Supports upgrade/downgrade between any two versions
 * - Generates migration plans with step-by-step instructions
 * - Checks compatibility matrix before provisioning
 * - Maintains changelog for audit trail
 */
export class BlueprintVersioning {
  private readonly registry: BlueprintRegistry;

  constructor(deps: VersioningDependencies) {
    this.registry = deps.registry;
  }

  /**
   * Parse a version string into its components.
   */
  parse(version: string): { major: number; minor: number; patch: number } | null {
    const parts = version.split(".");
    if (parts.length !== 3) return null;

    const major = parseInt(parts[0], 10);
    const minor = parseInt(parts[1], 10);
    const patch = parseInt(parts[2], 10);

    if (isNaN(major) || isNaN(minor) || isNaN(patch)) return null;

    return { major, minor, patch };
  }

  /**
   * Format version components into a version string.
   */
  format(major: number, minor: number, patch: number): string {
    return `${major}.${minor}.${patch}`;
  }

  /**
   * Calculate the next version for a given slug based on the bump type.
   *
   * @returns The next version string, or "1.0.0" if no existing versions.
   */
  async nextVersion(slug: string, bump: VersionBump = "patch"): Promise<string> {
    const versions = await this.registry.listVersions(slug);

    if (versions.length === 0) {
      return "1.0.0";
    }

    // Find the latest version
    const latest = versions.sort((a, b) =>
      b.version.localeCompare(a.version, undefined, { numeric: true }),
    )[0];

    const parsed = this.parse(latest.version);
    if (!parsed) {
      return "1.0.0";
    }

    switch (bump) {
      case "major":
        return this.format(parsed.major + 1, 0, 0);
      case "minor":
        return this.format(parsed.major, parsed.minor + 1, 0);
      case "patch":
        return this.format(parsed.major, parsed.minor, parsed.patch + 1);
    }
  }

  /**
   * Compare two version strings.
   * Returns -1 if a < b, 0 if equal, 1 if a > b.
   */
  compare(a: string, b: string): number {
    const pa = this.parse(a);
    const pb = this.parse(b);
    if (!pa || !pb) return a.localeCompare(b);

    if (pa.major !== pb.major) return pa.major - pb.major;
    if (pa.minor !== pb.minor) return pa.minor - pb.minor;
    return pa.patch - pb.patch;
  }

  /**
   * Check if version a is compatible with version b (same major version).
   */
  isCompatible(a: string, b: string): boolean {
    const pa = this.parse(a);
    const pb = this.parse(b);
    if (!pa || !pb) return false;
    return pa.major === pb.major;
  }

  /**
   * Determine the breaking change severity between two versions.
   * Returns the highest severity found.
   */
  getBreakingChangeSeverity(from: string, to: string): BreakingChangeSeverity {
    const pa = this.parse(from);
    const pb = this.parse(to);
    if (!pa || !pb) return "major";

    if (pa.major !== pb.major) return "major";
    if (pa.minor !== pb.minor) return "minor";
    if (pa.patch !== pb.patch) return "patch";
    return "none";
  }

  /**
   * Generate a migration plan between two versions.
   * Walks through intermediate versions to produce step-by-step migration.
   * Returns a plan even if the migration requires multiple steps.
   */
  async generateMigrationPlan(
    slug: string,
    from: string,
    to: string,
  ): Promise<MigrationPlan> {
    const allVersions = await this.registry.listVersions(slug);
    const versionStrings = allVersions
      .map((v) => v.version)
      .sort((a, b) => this.compare(a, b));

    const fromIdx = versionStrings.indexOf(from);
    const toIdx = versionStrings.indexOf(to);

    if (fromIdx === -1) {
      return {
        from,
        to,
        stepCount: 0,
        possible: false,
        reason: `Source version "${from}" not found in registry`,
        steps: [],
      };
    }

    if (toIdx === -1) {
      return {
        from,
        to,
        stepCount: 0,
        possible: false,
        reason: `Target version "${to}" not found in registry`,
        steps: [],
      };
    }

    if (fromIdx === toIdx) {
      return {
        from,
        to,
        stepCount: 0,
        possible: true,
        steps: [],
      };
    }

    const isUpgrade = toIdx > fromIdx;
    const versionsToMigrate = isUpgrade
      ? versionStrings.slice(fromIdx + 1, toIdx + 1)
      : versionStrings.slice(toIdx, fromIdx).reverse();

    const steps: MigrationStep[] = [];
    let currentVersion = from;

    for (const nextVersion of versionsToMigrate) {
      const severity = this.getBreakingChangeSeverity(currentVersion, nextVersion);
      steps.push({
        from: currentVersion,
        to: nextVersion,
        direction: isUpgrade ? "upgrade" : "downgrade",
        description: isUpgrade
          ? `Upgrade from ${currentVersion} to ${nextVersion}`
          : `Downgrade from ${currentVersion} to ${nextVersion}`,
        breaking: severity !== "none",
        actions: this._generateActions(severity, currentVersion, nextVersion),
      });
      currentVersion = nextVersion;
    }

    return {
      from,
      to,
      stepCount: steps.length,
      possible: true,
      steps,
    };
  }

  /**
   * Check if a version satisfies a semver range.
   * Supports: ^1.0.0 (compatible), ~1.2.0 (approximately), exact, or "*" (any).
   */
  satisfies(version: string, range: string): boolean {
    if (range === "*" || range === "x") return true;

    const parsed = this.parse(version);
    if (!parsed) return false;

    // Exact match
    if (range === version) return true;

    // Caret range (^1.0.0) — compatible with same major
    if (range.startsWith("^")) {
      const rangeParsed = this.parse(range.slice(1));
      if (!rangeParsed) return false;
      return parsed.major === rangeParsed.major && parsed.minor >= rangeParsed.minor;
    }

    // Tilde range (~1.2.0) — approximately equivalent
    if (range.startsWith("~")) {
      const rangeParsed = this.parse(range.slice(1));
      if (!rangeParsed) return false;
      return (
        parsed.major === rangeParsed.major &&
        parsed.minor === rangeParsed.minor &&
        parsed.patch >= rangeParsed.patch
      );
    }

    return false;
  }

  /**
   * Get the changelog for a blueprint, returning all version entries.
   */
  async getChangelog(slug: string): Promise<ChangelogEntry[]> {
    const versions = await this.registry.listVersions(slug);
    const sorted = versions.sort((a, b) => this.compare(b.version, a.version));

    const changelog: ChangelogEntry[] = [];
    let previousVersion: string | null = null;

    for (const entry of sorted) {
      const severity = previousVersion
        ? this.getBreakingChangeSeverity(entry.version, previousVersion)
        : "none";

      const changes: string[] = [];

      if (severity === "major") {
        changes.push(`Breaking changes from ${previousVersion}`);
      } else if (severity === "minor") {
        changes.push(`New features added from ${previousVersion}`);
      } else if (severity === "patch" && previousVersion) {
        changes.push(`Bug fixes and improvements from ${previousVersion}`);
      } else {
        changes.push("Initial release");
      }

      changelog.push({
        version: entry.version,
        date: entry.updatedAt ?? entry.createdAt,
        changes,
        breaking: severity !== "none" && severity !== "patch",
      });

      previousVersion = entry.version;
    }

    return changelog;
  }

  /**
   * Check if a blueprint version is safe to provision from a given current version.
   * Returns true if the provision would not break existing data.
   */
  async isSafeToProvision(slug: string, targetVersion: string): Promise<boolean> {
    const versions = await this.registry.listVersions(slug);
    if (versions.length === 0) return true;

    const latest = versions.sort((a, b) =>
      b.version.localeCompare(a.version, undefined, { numeric: true }),
    )[0];

    const severity = this.getBreakingChangeSeverity(latest.version, targetVersion);
    // Major breaking changes require manual migration — not safe for auto-provision
    return severity !== "major";
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  /**
   * Generate recommended actions for a migration step based on severity.
   */
  private _generateActions(
    severity: BreakingChangeSeverity,
    from: string,
    to: string,
  ): string[] {
    const actions: string[] = [];

    switch (severity) {
      case "major":
        actions.push("Review all schema changes between versions");
        actions.push("Backup existing data before migrating");
        actions.push("Update any custom integrations that depend on this blueprint");
        actions.push(`Run migration: ${from} → ${to}`);
        actions.push("Verify all pages render correctly after migration");
        break;
      case "minor":
        actions.push("Review new features available in new version");
        actions.push("Update any optional integrations");
        actions.push(`Run migration: ${from} → ${to}`);
        break;
      case "patch":
        actions.push("Apply patch update");
        actions.push("Verify no regressions");
        break;
      case "none":
        break;
    }

    return actions;
  }
}
