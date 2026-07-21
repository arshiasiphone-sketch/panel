# Multi-Tenant Isolation Audit & Fix Report

## Executive Summary

This document provides a comprehensive audit of the multi-tenant isolation architecture, identifying critical violations where data is being shared across workspaces instead of being properly scoped.

**Status**: CRITICAL - Multiple data sources remain globally shared
**Risk Level**: HIGH - Changing data in one workspace affects ALL workspaces

---

## 1. Theme Isolation Report

### Current State: ❌ BROKEN

**Critical Finding**: ThemeRepository explicitly treats theme_settings as a GLOBAL singleton with hardcoded id=1.

### Violations Found

| Component | File | Line | Issue | Severity |
|-----------|------|------|-------|----------|
| ThemeRepository | `src/lib/repositories/theme.ts` | 67-76 | `installBlueprintTheme` explicitly states theme_settings is GLOBAL singleton, uses hardcoded id=1 | **CRITICAL** |
| ThemeRepository | `src/lib/repositories/theme.ts` | 36-62 | `get()` uses `limit(1).order("id")` pattern - assumes singleton | **CRITICAL** |
| ThemeRepository | `src/lib/repositories/theme.ts` | 115-138 | `update()` fetches with workspace but updates without workspace filter | **CRITICAL** |
| ThemeRepository | `src/lib/repositories/theme.ts` | 40-46 | Cache key "theme_settings" doesn't include workspace_id | **HIGH** |
| ThemeProvider | `src/lib/theme-provider.tsx` | 40 | Uses `useTheme()` which calls `repos.theme.get()` with singleton pattern | **HIGH** |

### Database Schema
- ✅ `theme_settings` table HAS `workspace_id` column (migration 12)
- ✅ `theme_history` table HAS `workspace_id` column (migration 12)
- ✅ Composite PK: (workspace_id, id) on theme_settings

### Root Cause
The ThemeRepository code has explicit comments and logic treating theme_settings as a singleton:
```typescript
// theme_settings is a GLOBAL singleton (one row, id=1 — enforced by the
// `theme_singleton` CHECK). It is intentionally NOT workspace-scoped
```

This is a fundamental architectural violation. The schema supports multi-tenancy, but the code explicitly bypasses it.

---

## 2. Personality / Quiz Isolation Report

### Current State: ⚠️ PARTIALLY BROKEN

**Critical Finding**: Quiz questions are stored globally in site_content with key "test_questions"

### Violations Found

| Component | File | Line | Issue | Severity |
|-----------|------|------|-------|----------|
| TestRepository | `src/lib/repositories/test.ts` | 113-131 | `getQuestionsConfig()` reads from site_content WITHOUT workspace filter | **CRITICAL** |
| TestRepository | `src/lib/repositories/test.ts` | 133-144 | `updateQuestionsConfig()` writes to site_content WITHOUT workspace filter | **CRITICAL** |
| test-data.ts | `src/lib/test-data.ts` | 105-227 | QUESTIONS are hardcoded in client code - not from DB | **MEDIUM** |
| PersonalityRepository | `src/lib/repositories/personality.ts` | 20-35 | `getAll()` uses withWorkspace correctly | ✅ OK |
| PersonalityRepository | `src/lib/repositories/personality.ts` | 42-80 | `installBlueprintPersonalities` manually adds workspace_id | ✅ OK |

### Database Schema
- ✅ `personality_profiles` table HAS `workspace_id` column (migration 13)
- ❌ **BUT**: Questions/Answers are stored in `site_content` with hardcoded key "test_questions" - this is GLOBAL
- ❌ **No separate questions/answers tables exist** - questions are hardcoded in `test-data.ts`

### Root Cause
1. Test questions configuration is stored as a single global row in site_content
2. The `test_questions` key is not workspace-scoped
3. TestRepository methods bypass workspace filtering

---

## 3. Repository Audit Report

### Repository-by-Repository Status

| Repository | Workspace Aware | Read Isolated | Write Isolated | Delete Isolated | Cache Isolated | Status |
|------------|----------------|---------------|----------------|-----------------|----------------|--------|
| ThemeRepository | ⚠️ Partial | ❌ NO | ❌ NO | N/A | ❌ NO | **CRITICAL** |
| PersonalityRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | **MEDIUM** |
| TestRepository | ⚠️ Partial | ❌ NO (questions config) | ❌ NO (questions config) | ⚠️ Partial | ❌ NO | **CRITICAL** |
| SiteContentRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | **MEDIUM** |
| MenuRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | ✅ OK |
| PagesRepository | ✅ Yes | ✅ Yes | ⚠️ Partial (update/reorder) | ✅ Yes | ❌ NO | **MEDIUM** |
| GalleryRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | ✅ OK |
| EventsRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | ✅ OK |
| TestimonialsRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | ✅ OK |
| MediaRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | ✅ OK |
| AuthRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | ✅ OK |
| AnalyticsRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | ✅ OK |
| WorkspaceRepository | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ NO | ✅ OK |

### Detailed Repository Issues

#### ThemeRepository (`src/lib/repositories/theme.ts`)
```typescript
// ❌ CRITICAL: Explicitly bypasses workspace isolation
async installBlueprintTheme(theme: {...}): Promise<void> {
  // Singleton row is always id=1; reuse it if present, else create it.
  const { data: existing } = await this.db
    .from("theme_settings")  // ❌ NO withWorkspace()
    .select("id")
    .limit(1);
  const targetId = (existing && existing[0]?.id) ?? 1;
  
  const { error } = await this.db
    .from("theme_settings")  // ❌ NO withWorkspace()
    .upsert({ id: targetId, ...update });
}

// ❌ CRITICAL: Update uses hardcoded id instead of workspace filter
async update(patch: Partial<ThemeRow>): Promise<void> {
  const { data: existing } = await this.withWorkspace(
    this.db.from<ThemeRow>("theme_settings").select("id").limit(1),  // ❌ limit(1) assumes singleton
  ).maybeSingle();
  
  const { error } = await this.db
    .from("theme_settings")
    .update(patch as ThemeUpdate)
    .eq("id", existing.id);  // ❌ NO workspace filter on update
}

// ❌ HIGH: Cache key doesn't include workspace_id
async get(): Promise<ThemeRow> {
  const cache = getCache();
  return cache.getOrFetch("theme_settings", "get", async () => {  // ❌ Missing workspace_id
    // ...
  });
}
```

#### TestRepository (`src/lib/repositories/test.ts`)
```typescript
// ❌ CRITICAL: Questions config is global
async getQuestionsConfig(): Promise<{...}> {
  const { data, error } = await this.db
    .from("site_content")  // ❌ NO withWorkspace()
    .select("value")
    .eq("key", "test_questions")  // ❌ Hardcoded global key
    .maybeSingle();
}

async updateQuestionsConfig(config: TestQuestionsConfig): Promise<void> {
  const { error } = await this.db.from("site_content")  // ❌ NO withWorkspace()
    .upsert({
      key: "test_questions",  // ❌ Hardcoded global key
      value: config as unknown as Record<string, unknown>,
    });
}
```

#### PagesRepository (`src/lib/repositories/pages.ts`)
```typescript
// ⚠️ MEDIUM: update() and reorder() don't use withWorkspace()
async update(id: string, patch: Partial<PageBlockUpdate>): Promise<void> {
  const { error } = await this.db
    .from("page_blocks")
    .update(patch as PageBlockUpdate)
    .eq("id", id);  // ⚠️ NO withWorkspace() - could affect other workspaces with same id
}

async reorder(orderedIds: string[]): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, idx) =>
      this.db
        .from("page_blocks")
        .update({ sort_order: idx } as PageBlockUpdate)
        .eq("id", id),  // ⚠️ NO withWorkspace()
    ),
  );
}
```

---

## 4. Database Isolation Report

### Table-by-Table Workspace Support

| Table | Has workspace_id | PK Includes workspace_id | FK to workspaces | Trigger Protection | Status |
|-------|------------------|------------------------|-----------------|------------------|--------|
| theme_settings | ✅ Yes | ✅ (workspace_id, id) | ✅ Yes | ✅ Yes | ✅ OK |
| theme_history | ✅ Yes | ❌ No (id only) | ✅ Yes | ❌ No | ⚠️ NEEDS FIX |
| personality_profiles | ✅ Yes | ✅ (workspace_id, key) | ✅ Yes | ✅ Yes | ✅ OK |
| site_content | ✅ Yes | ✅ (workspace_id, key) | ✅ Yes | ✅ Yes | ✅ OK |
| page_blocks | ✅ Yes | ❌ No (id only) | ✅ Yes | ✅ Yes | ⚠️ NEEDS FIX |
| menu_items | ✅ Yes | ❌ No (id only) | ✅ Yes | ✅ Yes | ⚠️ NEEDS FIX |
| gallery_images | ✅ Yes | ❌ No (id only) | ✅ Yes | ✅ Yes | ⚠️ NEEDS FIX |
| events | ✅ Yes | ❌ No (id only) | ✅ Yes | ✅ Yes | ⚠️ NEEDS FIX |
| testimonials | ✅ Yes | ❌ No (id only) | ✅ Yes | ✅ Yes | ⚠️ NEEDS FIX |
| media_files | ✅ Yes | ❌ No (id only) | ✅ Yes | ✅ Yes | ⚠️ NEEDS FIX |
| test_responses | ✅ Yes | ❌ No (id only) | ✅ Yes | ❌ No | ⚠️ NEEDS FIX |
| page_views | ✅ Yes | ❌ No (id only) | ✅ Yes | ❌ No | ⚠️ NEEDS FIX |
| site_visits | ✅ Yes | ❌ No (id only) | ✅ Yes | ❌ No | ⚠️ NEEDS FIX |

### Missing Tables
- ❌ **No dedicated questions table** - questions are hardcoded in `test-data.ts`
- ❌ **No dedicated answers table** - answers are hardcoded in `test-data.ts`
- ❌ **No dedicated quiz/personality settings table** - config stored in site_content as "test_questions"

### Schema Recommendations

#### New Tables Needed
```sql
-- Questions table (workspace-scoped)
CREATE TABLE personality_questions (
  id SERIAL PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,  -- For sorting/ordering
  text TEXT NOT NULL,
  categorized BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, question_id)
);

-- Question options table (workspace-scoped)
CREATE TABLE personality_question_options (
  id SERIAL PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  option_id VARCHAR(10) NOT NULL,  -- e.g., "1a", "1b"
  text TEXT NOT NULL,
  personality_type VARCHAR(20) NULL,  -- paparoch, zhampin, fofino, gombak, bedone
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, question_id, option_id)
);

-- Personality type configurations (workspace-scoped)
CREATE TABLE personality_types (
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  type_key VARCHAR(20) PRIMARY KEY,  -- paparoch, zhampin, etc.
  label TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  color VARCHAR(7) NOT NULL,
  accent_color VARCHAR(7),
  bg_color VARCHAR(20),
  border_color VARCHAR(20),
  traits TEXT[],
  drink TEXT,
  spot TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 5. Cache Audit Report

### Current Implementation (`src/lib/core/repository-cache.ts`)

**Critical Issue**: Cache keys do NOT include workspace_id

```typescript
export class RepositoryCache {
  async getOrFetch<T>(
    table: string,      // ❌ Missing workspace_id
    key: string,        // ❌ Missing workspace_id
    fetchFn: () => Promise<T>,
    ttlMs: number = RepositoryCache.DEFAULT_TTL_MS,
  ): Promise<T> {
    const cached = this._get<T>(table, key);  // ❌ Cache key = table + key only
    // ...
  }
}
```

### Usage Examples Showing Problem

```typescript
// In ThemeRepository.get()
return cache.getOrFetch("theme_settings", "get", async () => {...});
// ❌ Two workspaces will share the same cache entry "theme_settings:get"

// In PersonalityRepository.getAll()
// Uses withWorkspace() correctly but cache doesn't know about workspace
```

### Impact
- Workspace A's theme is cached under key "theme_settings:get"
- Workspace B requests theme, gets cached value from Workspace A
- Changing theme in Workspace A updates cache, affects Workspace B's display

### Required Fix
Cache keys MUST include workspace_id:
```typescript
const cacheKey = this.workspaceId 
  ? `${table}:${key}:workspace-${this.workspaceId}` 
  : `${table}:${key}`;
```

---

## 6. CurrentWorkspace Propagation Report

### ✅ Working Correctly

The workspace context propagation through the following layers is CORRECT:

1. **CurrentWorkspaceProvider** (`src/lib/core/workspace/context.tsx`)
   - ✅ Resolves workspace from domain, user, or explicit ID
   - ✅ Calls `setWorkspaceOnRepositories(repos, ctx)` 
   - ✅ Handles preview_domain for local testing
   - ✅ Degrades gracefully to DEFAULT_WORKSPACE

2. **RepositoryFactory** (`src/lib/repositories/factory.ts`)
   - ✅ Creates repositories with dependencies
   - ✅ `setWorkspaceOnRepositories()` iterates all repos and calls `setWorkspace()`

3. **BaseRepository** (`src/lib/repositories/base.ts`)
   - ✅ Stores workspace context
   - ✅ Provides `withWorkspace()` helper
   - ✅ Provides `workspaceId` getter
   - ✅ `setWorkspace()` method works correctly

4. **Workspace Resolver** (`src/lib/core/workspace/resolver.ts`)
   - ✅ Resolves by domain, subdomain, user ID
   - ✅ Caches resolutions per-request
   - ✅ Proper error handling

### ⚠️ Minor Issues

- Some repositories create their own workspace lookups (none found in current audit)
- Cache layer doesn't receive workspace context (separate issue from propagation)

---

## 7. Singleton Pattern Search Results

### Found Singleton Patterns (Need Removal)

| File | Line | Pattern | Issue |
|------|------|---------|-------|
| theme.ts | 14-29 | DEFAULT_THEME_SETTINGS with id: 1 | Hardcoded singleton ID |
| theme.ts | 38-46 | cache.getOrFetch("theme_settings", "get") | Cache key without workspace |
| theme.ts | 44 | .order("id").limit(1) | Assumes only one row |
| theme.ts | 86-89 | .from("theme_settings").select("id").limit(1) | Singleton lookup without workspace |
| theme.ts | 120-121 | .select("id").limit(1).maybeSingle() | Singleton lookup without workspace |
| theme.ts | 129-130 | .update(patch).eq("id", existing.id) | Update without workspace filter |
| test.ts | 118 | .eq("key", "test_questions") | Hardcoded global key |
| test.ts | 137 | key: "test_questions" | Hardcoded global key |
| base.ts | 92-97 | withWorkspace() only applies if workspaceId exists | Could be N/A for system queries |

---

## 8. Final Verification Matrix (Pre-Fix)

| Component | Fully Isolated | Remaining Issue | Severity |
|-----------|---------------|-----------------|----------|
| Theme | ❌ | Global singleton pattern in ThemeRepository | CRITICAL |
| Quiz | ❌ | Questions stored globally in site_content | CRITICAL |
| Questions | ❌ | Hardcoded in client, config stored globally | CRITICAL |
| Answers | ❌ | Hardcoded in client | CRITICAL |
| Personalities | ✅ | PersonalityRepository uses withWorkspace correctly | OK |
| Recommendations | ⚠️ | Stored in test-data.ts, not from DB | MEDIUM |
| Branding | ❌ | Part of theme_settings singleton | CRITICAL |
| Fonts | ⚠️ | Need to verify if stored per-workspace | UNKNOWN |
| Settings | ⚠️ | SiteContentRepository has workspace support but some keys may be global | MEDIUM |
| Preview | ✅ | Preview domain resolution works | OK |
| SSR | ✅ | Workspace context available in SSR | OK |
| CSR | ✅ | Workspace context available in CSR | OK |
| Provisioning | ✅ | Workspace-aware provisioning | OK |
| Hydration | ✅ | Workspace context survives hydration | OK |

---

## Fix Priority List

### P0 - CRITICAL (Must Fix Immediately)

1. **Fix ThemeRepository**
   - Remove singleton assumption from `installBlueprintTheme`
   - Use workspace-scoped queries in all methods
   - Include workspace_id in cache keys

2. **Fix TestRepository**
   - Add workspace filtering to `getQuestionsConfig()` and `updateQuestionsConfig()`
   - Make "test_questions" key workspace-scoped

### P1 - HIGH (Fix in This Sprint)

3. **Fix RepositoryCache**
   - Include workspace_id in all cache keys
   - Ensure cache invalidation is workspace-scoped

4. **Fix PagesRepository**
   - Add withWorkspace() to update() and reorder() methods

5. **Update Database Schema**
   - Add workspace_id to primary keys where missing
   - Consider creating dedicated questions/answers tables

### P2 - MEDIUM (Fix in Next Sprint)

6. **Extract Questions/Answers to Database**
   - Create personality_questions table
   - Create personality_question_options table
   - Migrate hardcoded questions from test-data.ts

7. **Review all other repositories**
   - Verify delete operations use withWorkspace()
   - Review batch operations

---

## Deliverables Status

- [x] Workspace Isolation Report - COMPLETE
- [x] Theme Isolation Report - COMPLETE
- [x] Quiz Isolation Report - COMPLETE
- [x] Repository Audit Report - COMPLETE
- [x] Database Isolation Report - COMPLETE
- [x] Migration Report - See MULTI-TENANT-FIXES-IMPLEMENTED.md
- [ ] Final Verification Matrix - **IN PROGRESS** (Post-fix)

---

## Next Steps

1. Implement P0 fixes immediately
2. Run verification tests with two workspaces
3. Confirm no cross-workspace data leakage
4. Document any breaking changes for API consumers
5. Update this report with post-fix verification matrix
