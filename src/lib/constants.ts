/**
 * NAMA Platform — Global constants.
 */

/**
 * DEFAULT_WORKSPACE_ID: The workspace ID for the existing single-tenant site.
 * This was the original kafekhane before multi-tenant support.
 * Used as the workspace_id for all existing data rows during migration.
 *
 * This is a valid UUID generated once and hardcoded for consistency.
 * DO NOT change this after the migration has been applied.
 */
export const DEFAULT_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

/**
 * The domain of the main platform site.
 * For the original single-tenant workspace, this is the current production domain.
 */
export const PLATFORM_DOMAIN = "nama.app";

/**
 * Workspace resolution cache TTL in milliseconds.
 */
export const WORKSPACE_RESOLVER_CACHE_TTL = 10_000;/* redeploy-trigger 1784592440 */
