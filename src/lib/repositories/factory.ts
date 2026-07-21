/**
 * Repository factory — creates all repositories with dependency injection.
 * This is the single entry point for creating the repository layer.
 */

import type { IRealtimeProvider } from "@/lib/interfaces/realtime";
import type { RepositoryDependencies, WorkspaceContext } from "./base";
import { MenuRepository } from "./menu";
import { GalleryRepository } from "./gallery";
import { EventsRepository } from "./events";
import { TestimonialsRepository } from "./testimonials";
import { PagesRepository } from "./pages";
import { ThemeRepository } from "./theme";
import { SiteContentRepository } from "./site-content";
import { PersonalityRepository } from "./personality";
import { MediaRepository } from "./media";
import { TestRepository } from "./test";
import { AnalyticsRepository } from "./analytics";
import { AuthRepository } from "./auth";
// Import directly from the file (not the barrel) to avoid a circular dependency:
//   factory.ts -> barrel -> context.tsx -> factory.ts
import { WorkspaceRepository } from "@/lib/core/workspace/repository";

export interface Repositories {
  menu: MenuRepository;
  gallery: GalleryRepository;
  events: EventsRepository;
  testimonials: TestimonialsRepository;
  pages: PagesRepository;
  theme: ThemeRepository;
  siteContent: SiteContentRepository;
  personality: PersonalityRepository;
  media: MediaRepository;
  test: TestRepository;
  analytics: AnalyticsRepository;
  auth: AuthRepository;
  workspace: WorkspaceRepository;
  realtime: IRealtimeProvider;
}

/**
 * Create all repositories from the given dependencies.
 */
export function createRepositories(
  deps: RepositoryDependencies,
): Repositories {
  return {
    menu: new MenuRepository(deps),
    gallery: new GalleryRepository(deps),
    events: new EventsRepository(deps),
    testimonials: new TestimonialsRepository(deps),
    pages: new PagesRepository(deps),
    theme: new ThemeRepository(deps),
    siteContent: new SiteContentRepository(deps),
    personality: new PersonalityRepository(deps),
    media: new MediaRepository(deps),
    test: new TestRepository(deps),
    analytics: new AnalyticsRepository(deps),
    auth: new AuthRepository(deps),
    workspace: new WorkspaceRepository(deps),
    realtime: deps.realtime,
  };
}

// Singleton repositories for client-side use
let _repositories: Repositories | null = null;

/**
 * Get or create the singleton repositories instance (client-side).
 */
export function getRepositories(deps?: RepositoryDependencies): Repositories {
  if (!_repositories && deps) {
    _repositories = createRepositories(deps);
  }
  if (!_repositories) {
    throw new Error(
      "Repositories not initialized. Call getRepositories with dependencies first, " +
        "or import from '@/lib/providers/supabase' to create providers.",
    );
  }
  return _repositories;
}

/**
 * Initialize repositories with the given dependencies.
 */
export function initRepositories(deps: RepositoryDependencies): Repositories {
  _repositories = createRepositories(deps);
  return _repositories;
}

/**
 * Set workspace context on all repositories.
 */
export function setWorkspaceOnRepositories(
  repos: Repositories,
  workspace: WorkspaceContext,
): void {
  for (const repo of Object.values(repos)) {
    if (typeof (repo as Record<string, unknown>).setWorkspace === "function") {
      (repo as { setWorkspace: (ws: WorkspaceContext) => void }).setWorkspace(workspace);
    }
  }
}

// Cache-bust marker to force Vite to generate fresh asset hash
// (CDN stale serving index-Dqppe4YF.js from build 7c5d9b1)
const __BUILD_TS__ = "2026-07-20T22:15:00Z";
export { __BUILD_TS__ };
