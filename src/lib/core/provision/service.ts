/**
 * NAMA Platform — Provision Service.
 *
 * The main service API for provisioning operations.
 * This is the public-facing entry point that application code uses
 * to start, check, and manage provisioning.
 *
 * Uses the Command Pattern-based ProvisionEngine.
 * All dependencies are injected — no service locator, no singleton lookups.
 *
 * One Request → One Ready Website.
 */

import type { RepositoryDependencies } from "@/lib/repositories/base";
import type {
  ProvisionReport,
  ProvisionTransaction,
  Blueprint,
} from "./types";
import type { ProvisionRequestInput } from "./validation";
import { ProvisionEngine, type EngineDependencies } from "./engine";
import { createStepRegistry } from "./steps";
import { BlueprintRegistry } from "./blueprint/registry";
import { BlueprintLoader } from "./blueprint/loader";
import { BlueprintVersioning } from "./blueprint/versioning";
import { ProvisionTransactionManager } from "./transaction";
import { ProvisionValidator } from "./validator";
import { ProvisionReportGenerator } from "./report";
import type { WorkspaceRepository } from "@/lib/core/workspace/repository";
import type { BlueprintIndexEntry } from "./blueprint/registry";
import type { Repositories } from "@/lib/repositories/factory";
import { createRepositories } from "@/lib/repositories/factory";
import { getLogger } from "@/lib/logger";

export interface ProvisionServiceDependencies {
  repositoryDependencies: RepositoryDependencies;
  workspaceRepository: WorkspaceRepository;
}

export class ProvisionService {
  private readonly engine: ProvisionEngine;
  private readonly registry: BlueprintRegistry;
  private readonly loader: BlueprintLoader;
  private readonly versioning: BlueprintVersioning;
  private readonly transactionManager: ProvisionTransactionManager;

  constructor(deps: ProvisionServiceDependencies) {
    // Create shared dependencies
    this.registry = new BlueprintRegistry(deps.repositoryDependencies);
    this.loader = new BlueprintLoader({ registry: this.registry });
    this.versioning = new BlueprintVersioning({ registry: this.registry });
    this.transactionManager = new ProvisionTransactionManager(deps.repositoryDependencies);

    // Create repositories (single provider graph shared by all repositories)
    const repos: Repositories = createRepositories(deps.repositoryDependencies);

    // Create the step registry (Command Pattern — each step is independent)
    const stepRegistry = createStepRegistry();

    // Create supporting components
    const validator = new ProvisionValidator({
      ...deps.repositoryDependencies,
      blueprintLoader: this.loader,
      workspaceRepository: deps.workspaceRepository,
    });
    const reportGenerator = new ProvisionReportGenerator();

    // Create engine with all dependencies
    this.engine = new ProvisionEngine({
      loader: this.loader,
      transactionManager: this.transactionManager,
      validator,
      reportGenerator,
      workspaceRepository: deps.workspaceRepository,
      repos,
      stepRegistry,
      logger: deps.repositoryDependencies.logger ?? getLogger(),
    });
  }

  // ─── Provisioning ──────────────────────────────────────────────────────

  /**
   * Start the provisioning pipeline for a new website.
   * One Request → One Ready Website.
   */
  async provision(input: ProvisionRequestInput): Promise<ProvisionReport> {
    return this.engine.provision(input);
  }

  // ─── Blueprint Management ──────────────────────────────────────────────

  /**
   * Register a new blueprint in the registry.
   * Blueprints are DATA — they define everything about a website.
   */
  async registerBlueprint(blueprint: import("./validation").BlueprintInput): Promise<Blueprint> {
    return this.registry.register(blueprint);
  }

  /**
   * Get a blueprint by slug and version.
   */
  async getBlueprint(slug: string, version?: string): Promise<Blueprint | null> {
    return this.loader.load(slug, version);
  }

  /**
   * List all available blueprint slugs (latest versions).
   */
  async listBlueprints(): Promise<BlueprintIndexEntry[]> {
    return this.registry.listBlueprints();
  }

  /**
   * List all versions of a specific blueprint.
   */
  async listBlueprintVersions(slug: string): Promise<BlueprintIndexEntry[]> {
    return this.registry.listVersions(slug);
  }

  /**
   * Calculate the next version for a blueprint slug.
   */
  async nextBlueprintVersion(slug: string, bump: "major" | "minor" | "patch" = "patch"): Promise<string> {
    return this.versioning.nextVersion(slug, bump);
  }

  /**
   * Delete a blueprint version from the registry.
   */
  async deleteBlueprint(slug: string, version: string): Promise<void> {
    return this.registry.delete(slug, version);
  }

  // ─── Transaction Management ────────────────────────────────────────────

  /**
   * Get a provision transaction by ID.
   */
  async getTransaction(txId: string): Promise<ProvisionTransaction | null> {
    return this.transactionManager.get(txId);
  }

  /**
   * Get all provision transactions for a workspace.
   */
  async getTransactionsByWorkspace(workspaceId: string): Promise<ProvisionTransaction[]> {
    return this.transactionManager.getByWorkspace(workspaceId);
  }
}
