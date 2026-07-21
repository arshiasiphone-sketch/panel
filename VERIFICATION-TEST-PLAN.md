# Multi-Tenant Isolation Verification Test Plan

## Overview

This document outlines the verification tests needed to confirm that the multi-tenant isolation fixes are working correctly. These tests should be run after all code changes are deployed.

---

## Test Environment Setup

### Prerequisites:
1. Two test workspaces created in the database
2. Supabase instance with the latest schema
3. Test user with admin access to both workspaces
4. Running application with the latest code changes

### Test Workspaces:
```
Workspace A:
- ID: workspace-a-uuid
- Domain: workspace-a.test.com
- User: test-user-a

Workspace B:
- ID: workspace-b-uuid  
- Domain: workspace-b.test.com
- User: test-user-b
```

---

## Test Suite 1: Theme Isolation

### Test 1.1: Theme settings are workspace-scoped
**Description**: Verify that changing theme in Workspace A does not affect Workspace B

**Steps**:
1. Login as user for Workspace A
2. Navigate to Admin > Theme Settings
3. Change primary_color to `#ff0000`
4. Save changes
5. Login as user for Workspace B
6. Navigate to Admin > Theme Settings
7. Verify primary_color is NOT `#ff0000` (should be default)

**Expected Result**: ✅ PASS - Workspace B theme unchanged
**Actual Result**: __________

### Test 1.2: Theme cache is workspace-isolated
**Description**: Verify that theme cache doesn't leak between workspaces

**Steps**:
1. Fetch theme for Workspace A (caches it)
2. Without clearing cache, fetch theme for Workspace B
3. Verify Workspace B gets its own theme (not cached value from A)

**Expected Result**: ✅ PASS - Each workspace gets its own cached theme
**Actual Result**: __________

### Test 1.3: installBlueprintTheme creates workspace-scoped theme
**Description**: Verify blueprint installation creates per-workspace theme

**Steps**:
1. Provision new Workspace C with a blueprint
2. Check database: theme_settings table
3. Verify there's a row with workspace_id = Workspace C's ID
4. Verify id is NOT hardcoded to 1

**Expected Result**: ✅ PASS - Theme row has correct workspace_id
**Actual Result**: __________

---

## Test Suite 2: Quiz/Personality Questions Isolation

### Test 2.1: Questions config is workspace-scoped
**Description**: Verify that questions config in Workspace A doesn't affect Workspace B

**Steps**:
1. Login as user for Workspace A
2. Navigate to Admin > Test Questions
3. Enable/disable some questions
4. Save changes
5. Login as user for Workspace B
6. Navigate to Admin > Test Questions
7. Verify questions config matches B's own config (not A's)

**Expected Result**: ✅ PASS - Workspace B questions config unchanged
**Actual Result**: __________

### Test 2.2: Questions config uses workspace-scoped key
**Description**: Verify questions config is stored with workspace-specific key

**Steps**:
1. Check database: site_content table
2. For Workspace A, find row with key like `test_questions:workspace-{id}`
3. For Workspace B, find row with key like `test_questions:workspace-{id}`
4. Verify keys are different for each workspace

**Expected Result**: ✅ PASS - Each workspace has its own config key
**Actual Result**: __________

### Test 2.3: Test responses are workspace-scoped
**Description**: Verify test responses are isolated per workspace

**Steps**:
1. As Workspace A user, submit a test response
2. As Workspace B user, submit a different test response
3. Query test_responses table with workspace_id filter
4. Verify Workspace A's response has workspace_id = A's ID
5. Verify Workspace B's response has workspace_id = B's ID

**Expected Result**: ✅ PASS - Each response belongs to its workspace
**Actual Result**: __________

---

## Test Suite 3: Personality Profiles Isolation

### Test 3.1: Personality profiles are workspace-scoped
**Description**: Verify personality profiles are isolated per workspace

**Steps**:
1. Login as user for Workspace A
2. Navigate to Admin > Personality Types
3. Add a custom personality profile
4. Login as user for Workspace B
5. Navigate to Admin > Personality Types
6. Verify custom profile from A is NOT visible

**Expected Result**: ✅ PASS - Workspace B doesn't see A's profiles
**Actual Result**: __________

### Test 3.2: Personality profiles use composite PK
**Description**: Verify personality profiles use (workspace_id, key) as PK

**Steps**:
1. Check database schema: personality_profiles table
2. Verify primary key is (workspace_id, key)
3. Insert two rows with same key but different workspace_id
4. Verify both can coexist

**Expected Result**: ✅ PASS - Composite PK allows same key in different workspaces
**Actual Result**: __________

---

## Test Suite 4: Repository Operations Isolation

### Test 4.1: All repositories use withWorkspace()
**Description**: Code review to verify all repository methods use withWorkspace()

**Files to Check**:
- [ ] `src/lib/repositories/theme.ts`
- [ ] `src/lib/repositories/test.ts`
- [ ] `src/lib/repositories/pages.ts`
- [ ] `src/lib/repositories/personality.ts`
- [ ] `src/lib/repositories/site-content.ts`
- [ ] `src/lib/repositories/menu.ts`
- [ ] `src/lib/repositories/gallery.ts`
- [ ] `src/lib/repositories/events.ts`
- [ ] `src/lib/repositories/testimonials.ts`
- [ ] `src/lib/repositories/media.ts`
- [ ] `src/lib/repositories/analytics.ts`

**Search Pattern**: Look for `this.db.from(` without `this.withWorkspace(` wrapper

**Expected Result**: ✅ PASS - All write operations use withWorkspace()
**Actual Result**: __________

---

## Test Suite 5: Cache Isolation

### Test 5.1: Cache keys include workspace_id
**Description**: Verify cache keys are workspace-aware

**Steps**:
1. Check `RepositoryCache.buildCacheKey()` implementation
2. Verify it includes workspace_id in the key
3. Check ThemeRepository uses buildCacheKey()
4. Verify cache.getOrFetch() is called with fullCacheKey

**Expected Result**: ✅ PASS - Cache keys include workspace_id
**Actual Result**: __________

### Test 5.2: Cache invalidation is workspace-scoped
**Description**: Verify cache invalidation doesn't affect other workspaces

**Steps**:
1. Cache theme for Workspace A
2. Update theme for Workspace A (triggers invalidation)
3. Fetch theme for Workspace B
4. Verify Workspace B's theme is still cached (not invalidated)

**Expected Result**: ✅ PASS - Only Workspace A's cache is invalidated
**Actual Result**: __________

---

## Test Suite 6: Provisioning Isolation

### Test 6.1: Provisioning creates isolated data
**Description**: Verify provisioning a new workspace doesn't affect existing workspaces

**Steps**:
1. Provision Workspace A with a blueprint
2. Verify Workspace A has its own theme, menus, gallery, etc.
3. Provision Workspace B with the same blueprint
4. Verify Workspace B has its own separate data
5. Verify Workspace A's data is unchanged

**Expected Result**: ✅ PASS - Each workspace gets isolated provisioned data
**Actual Result**: __________

---

## Test Suite 7: No Singleton Patterns

### Test 7.1: No hardcoded id=1
**Description**: Verify no code uses hardcoded id=1 for theme_settings

**Steps**:
1. Search codebase for `.eq("id", 1)` or `.eq('id', 1)`
2. Search for `id: 1` in theme-related files
3. Search for `limit(1)` without workspace filter

**Expected Result**: ✅ PASS - No hardcoded singleton IDs found
**Actual Result**: __________

### Test 7.2: No global "test_questions" key usage
**Description**: Verify questions config doesn't use global key

**Steps**:
1. Search codebase for `key: "test_questions"` (without workspace prefix)
2. Verify all usage is workspace-scoped

**Expected Result**: ✅ PASS - All questions config uses workspace-scoped keys
**Actual Result**: __________

---

## Test Suite 8: Database Schema Verification

### Test 8.1: All tables have workspace_id column
**Description**: Verify all tenant-scoped tables have workspace_id

**Tables to Check**:
- [x] theme_settings
- [x] theme_history
- [x] personality_profiles
- [x] site_content
- [x] page_blocks
- [x] menu_items
- [x] gallery_images
- [x] events
- [x] testimonials
- [x] media_files
- [x] test_responses
- [x] page_views
- [x] site_visits

**Expected Result**: ✅ PASS - All tables have workspace_id column
**Actual Result**: __________

### Test 8.2: Foreign keys to workspaces
**Description**: Verify workspace_id columns have proper foreign keys

**Steps**:
1. Check database schema for each table
2. Verify workspace_id has FK to workspaces(id)
3. Verify ON DELETE CASCADE is set

**Expected Result**: ✅ PASS - All workspace_id columns have proper FK
**Actual Result**: __________

---

## Test Results Summary

| Test Suite | Test | Expected | Actual | Status |
|------------|------|----------|--------|--------|
| Theme | 1.1 Theme settings workspace-scoped | PASS | | ⬜ |
| Theme | 1.2 Theme cache isolated | PASS | | ⬜ |
| Theme | 1.3 Blueprint creates workspace-scoped theme | PASS | | ⬜ |
| Quiz | 2.1 Questions config workspace-scoped | PASS | | ⬜ |
| Quiz | 2.2 Questions config uses workspace-scoped key | PASS | | ⬜ |
| Quiz | 2.3 Test responses workspace-scoped | PASS | | ⬜ |
| Personality | 3.1 Personality profiles workspace-scoped | PASS | | ⬜ |
| Personality | 3.2 Composite PK (workspace_id, key) | PASS | | ⬜ |
| Repositories | 4.1 All use withWorkspace() | PASS | | ⬜ |
| Cache | 5.1 Cache keys include workspace_id | PASS | | ⬜ |
| Cache | 5.2 Cache invalidation workspace-scoped | PASS | | ⬜ |
| Provisioning | 6.1 Provisioning creates isolated data | PASS | | ⬜ |
| Singleton | 7.1 No hardcoded id=1 | PASS | | ⬜ |
| Singleton | 7.2 No global "test_questions" key | PASS | | ⬜ |
| Schema | 8.1 All tables have workspace_id | PASS | | ⬜ |
| Schema | 8.2 Foreign keys to workspaces | PASS | | ⬜ |

**Total Tests**: 16
**Passed**: ____
**Failed**: ____
**Success Rate**: ___%

---

## Pass/Fail Criteria

- **PASS (✅)**: All critical tests (Theme, Quiz, Personality) must pass
- **PARTIAL (⚠️)**: Critical tests pass but some secondary tests fail
- **FAIL (❌)**: Any critical test fails

**Overall Status**: __________

---

## Test Execution Notes

### Date: __________
### Tester: __________
### Environment: __________

### Issues Found:
1. ________________________________________
2. ________________________________________
3. ________________________________________

### Recommendations:
1. ________________________________________
2. ________________________________________

---

## Automated Test Script

For future regression testing, consider adding automated tests:

```typescript
// Example: test/theme-isolation.test.ts
import { describe, it, expect } from "vitest";
import { ThemeRepository } from "@/lib/repositories/theme";
import { createTestWorkspace } from "@/lib/test-utils";

describe("Theme Isolation", () => {
  it("should keep theme settings isolated between workspaces", async () => {
    const workspaceA = await createTestWorkspace();
    const workspaceB = await createTestWorkspace();
    
    const repoA = new ThemeRepository(deps);
    repoA.setWorkspace({ workspaceId: workspaceA.id });
    await repoA.update({ primary_color: "#ff0000" });
    
    const repoB = new ThemeRepository(deps);
    repoB.setWorkspace({ workspaceId: workspaceB.id });
    const themeB = await repoB.get();
    
    expect(themeB.primary_color).not.toBe("#ff0000");
  });
});
```

---

## Next Steps

1. ✅ Complete all code fixes (DONE)
2. ⬜ Run verification tests
3. ⬜ Fix any failed tests
4. ⬜ Update Final Verification Matrix
5. ⬜ Deploy to production
