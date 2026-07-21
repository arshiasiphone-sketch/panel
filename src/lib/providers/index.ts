/**
 * Provider initialization.
 * This module wires the Supabase providers to the repository layer.
 * Application code should import from here or from @/lib/repositories.
 *
 * Architecture: User → Workspace → Repositories → Provider → Database
 * The workspace layer sits between user auth and repositories, ensuring
 * all data access is scoped to the current workspace.
 *
 * IMPORTANT: Repository workspace binding happens in CurrentWorkspaceProvider
 * (context.tsx), NOT here. This keeps workspace initialization centralized and
 * avoids redundant calls to setWorkspaceOnRepositories.
 */

import { getSupabaseProviders } from "./supabase";
import { initRepositories, getRepositories } from "@/lib/repositories";
import type { Repositories } from "@/lib/repositories";

let _initialized = false;

/**
 * Initialize the repository layer with Supabase providers.
 * Call this once at application startup.
 */
export function initializeRepositories(): Repositories {
  if (_initialized) return getRepositories();

  const providers = getSupabaseProviders();
  const repos = initRepositories(providers);
  _initialized = true;
  return repos;
}

/**
 * Get the initialized repositories.
 * Throws if not yet initialized.
 * 
 * The workspace context has already been set on these repositories
 * by CurrentWorkspaceProvider during workspace resolution.
 */
export function useRepositories(): Repositories {
  return initializeRepositories();
}

// Repositories are exported directly for convenience
export { getRepositories } from "@/lib/repositories";
export type { Repositories } from "@/lib/repositories";

// Re-export provider interfaces for type usage
export type {
  IDatabaseProvider,
  IStorageProvider,
  IAuthProvider,
  IRealtimeProvider,
} from "@/lib/interfaces";

// Re-export workspace types and utilities
export {
  DEFAULT_WORKSPACE,
  CurrentWorkspaceProvider,
  useCurrentWorkspace,
} from "@/lib/core/workspace";
export type { WorkspaceContext, WorkspaceContextValue } from "@/lib/core/workspace";
