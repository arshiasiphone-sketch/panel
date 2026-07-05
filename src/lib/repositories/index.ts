/**
 * Repository barrel exports.
 * Import repositories from this module: import { MenuRepository } from "@/lib/repositories";
 *
 * NOTE: Workspace domain types and WorkspaceRepository are NOT re-exported here
 * to avoid circular dependencies. Import them directly from @/lib/core/workspace.
 */

export { BaseRepository, DEFAULT_WORKSPACE } from "./base";
export type { RepositoryDependencies, WorkspaceContext } from "./base";

export { MenuRepository } from "./menu";
export { GalleryRepository } from "./gallery";
export { EventsRepository } from "./events";
export { TestimonialsRepository } from "./testimonials";
export { PagesRepository } from "./pages";
export { ThemeRepository, DEFAULT_THEME_SETTINGS } from "./theme";
export { SiteContentRepository } from "./site-content";
export type { SiteContentMap } from "./site-content";
export { PersonalityRepository } from "./personality";
export { MediaRepository } from "./media";
export { TestRepository } from "./test";
export type { StoredTestResponse, TestQuestionsConfig } from "./test";
export { AnalyticsRepository } from "./analytics";
export type {
  SiteVisitStats,
  TopPage,
  DeviceDistribution,
  VisitsOverTime,
  PageViewStats,
} from "./analytics";
export { AuthRepository } from "./auth";

export {
  createRepositories,
  getRepositories,
  initRepositories,
  setWorkspaceOnRepositories,
} from "./factory";
export type { Repositories } from "./factory";
