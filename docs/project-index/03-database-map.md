# Database Map — NAMA Website Builder

## Schema Overview

All tables live in the Supabase `public` schema. The platform uses **PostgreSQL** via Supabase.

---

## Tables

### `site_content`
| Purpose | Key-value store for workspace entities, blueprint definitions, and all dynamic content |
|---------|----------------------------------------------------------------------------------------|
| **Key Columns** | `key` (text, primary), `value` (jsonb), `updated_at` (timestamptz) |
| **Used By** | `WorkspaceRepository`, `SiteContentRepository`, `BlueprintRegistry`, `ProvisionTransactionManager`, all provision/rollback components |
| **Key Patterns** | `workspace:{id}:entity`, `blueprint:{slug}:{version}`, `blueprint:index`, `provision:tx:{txId}`, `provision:log:{wsId}:{slug}:{ver}`, `media_folder:{path}`, `navigation`, `business_settings`, `seo_settings`, `seo_defaults`, `analytics_config`, `fonts_config`, `test_questions` |
| **Workspace Ready** | ❌ No `workspace_id` column |
| **Migration** | Multiple (part of initial schema) |

### `page_blocks`
| Purpose | Stores landing page blocks (hero, features, gallery, contact, etc.) |
|---------|--------------------------------------------------------------------|
| **Key Columns** | `id` (uuid), `type` (text), `data` (jsonb), `sort_order` (int), `visible` (bool), `created_at`, `updated_at` |
| **Used By** | `PagesRepository`, `BlueprintInstaller`, `ProvisionRollback` |
| **Workspace Ready** | ❌ No `workspace_id` column |
| **Migration** | `20260625102123_13e71544-b666-4171-bff6-a40312dba2f1.sql` |

### `menu_items`
| Purpose | Menu items for restaurant/cafe business types |
|---------|------------------------------------------------|
| **Key Columns** | `id` (uuid), `category` (text), `name` (text), `description` (text), `price` (text), `image_url` (text), `sort_order` (int), `visible` (bool) |
| **Used By** | `MenuRepository`, `BlueprintInstaller` |
| **Workspace Ready** | ❌ No `workspace_id` column |
| **Migration** | Same as page_blocks |

### `gallery_images`
| Purpose | Gallery images for portfolio/location showcases |
|---------|--------------------------------------------------|
| **Key Columns** | `id` (uuid), `title` (text), `image_url` (text), `tags` (text[]), `sort_order` (int), `visible` (bool) |
| **Used By** | `GalleryRepository`, `BlueprintInstaller` |
| **Workspace Ready** | ❌ No `workspace_id` column |
| **Migration** | Same as page_blocks |

### `events`
| Purpose | Events/calendar entries |
|---------|--------------------------|
| **Key Columns** | `id` (uuid), `title` (text), `description` (text), `date_label` (text), `image_url` (text), `sort_order` (int), `visible` (bool) |
| **Used By** | `EventsRepository` |
| **Workspace Ready** | ❌ No `workspace_id` column |
| **Migration** | Same as page_blocks |

### `testimonials`
| Purpose | Customer testimonials/reviews |
|---------|-------------------------------|
| **Key Columns** | `id` (uuid), `name` (text), `type` (text), `text` (text), `sort_order` (int), `visible` (bool) |
| **Used By** | `TestimonialsRepository` |
| **Workspace Ready** | ❌ No `workspace_id` column |
| **Migration** | Same as page_blocks |

### `theme_settings`
| Purpose | Theme configuration (single row, hardcoded ID 1) |
|---------|---------------------------------------------------|
| **Key Columns** | `id` (int4, primary), `preset_id` (text), `primary_color`, `secondary_color`, `accent_color`, `background_color`, `text_color`, `text_secondary_color`, `text_tertiary_color`, `border_radius` (text), `glass_opacity` (float4), `tokens` (jsonb), `name` (text), `updated_at` (timestamptz) |
| **Used By** | `ThemeRepository`, `BlueprintInstaller`, `ProvisionEngine`, `ProvisionRollback`, `ProvisionHealthChecker` |
| **Workspace Ready** | ❌ Single row pattern (id=1) — NOT multi-tenant compatible |
| **Migration** | `20260630000000_theme_engine_tokens.sql`, `20260627140000_theme_text_colors.sql` |

### `media_files`
| Purpose | Media file metadata (actual files in Supabase Storage) |
|---------|--------------------------------------------------------|
| **Key Columns** | `id` (uuid), `name` (text), `storage_path` (text), `folder` (text), `tags` (text[]), `size_bytes` (int8), `mime_type` (text), `created_at` (timestamptz) |
| **Used By** | `MediaRepository` |
| **Workspace Ready** | ❌ No `workspace_id` column |

### `personality_profiles`
| Purpose | Personality type definitions for the test engine |
|---------|---------------------------------------------------|
| **Key Columns** | `key` (text, primary), `label`, `tagline`, `description` (text), `traits` (text[]), `drink` (text), `spot` (text), `color_from`, `color_to` (text), `sort_order` (int) |
| **Used By** | `PersonalityRepository`, `BlueprintInstaller` |
| **Workspace Ready** | ❌ No `workspace_id` column |
| **Migration** | `20260626130000_seed_personality_profiles.sql` |

### `test_responses`
| Purpose | Stored personality test responses |
|---------|------------------------------------|
| **Key Columns** | `id` (uuid), `answers` (jsonb), `result` (text), `tied` (text[]), `completed_at` (timestamptz), `user_full_name`, `user_phone`, `user_age` (int), `user_gender` |
| **Used By** | `TestRepository` |
| **Workspace Ready** | ❌ No `workspace_id` column |

### `user_roles`
| Purpose | User-role assignments (app-level roles, separate from workspace roles) |
|---------|------------------------------------------------------------------------|
| **Key Columns** | `user_id` (uuid), `role` (app_role enum) |
| **Used By** | `AuthRepository` |
| **Workspace Ready** | ❌ No `workspace_id` column |

### `site_visits` (analytics)
| Purpose | Site visit tracking (session-based) |
|---------|--------------------------------------|
| **Key Columns** | `session_id` (text), `page_path` (text), `device_type` (text), `is_bot` (bool), `created_at` (timestamptz) |
| **Used By** | `AnalyticsRepository` |
| **Workspace Ready** | ❌ No `workspace_id` column |
| **Migration** | `20260628150000_site_visits.sql` |

### `page_views` (analytics)
| Purpose | Page view tracking |
|---------|--------------------|
| **Key Columns** | `id` (uuid), `path` (text), `referrer` (text), `user_agent` (text), `visited_at` (timestamptz) |
| **Used By** | `AnalyticsRepository` |
| **Workspace Ready** | ❌ No `workspace_id` column |
| **Migration** | `20260627120000_page_views.sql` |

### `rate_limits` (not yet used)
| Purpose | Rate limiting configuration |
|---------|----------------------------|
| **Migration** | `20260628000000_rate_limiting.sql` (created but not connected to code) |

---

## Key-Value Pattern Reference (site_content)

| Key Pattern | Purpose | Set By |
|-------------|---------|--------|
| `workspace:{id}:entity` | Workspace entity storage | `WorkspaceRepository` |
| `blueprint:{slug}:{version}` | Blueprint definition | `BlueprintRegistry` |
| `blueprint:index` | Blueprint catalog index | `BlueprintRegistry` |
| `provision:tx:{txId}` | Provision transaction log | `ProvisionTransactionManager` |
| `provision:log:{wsId}:{slug}:{ver}` | Provision idempotency log | `BlueprintInstaller` |
| `media_folder:{path}` | Media folder metadata | `ProvisionSeeder` |
| `navigation` | Navigation menu items | `BlueprintInstaller` |
| `business_settings` | Business info | `BlueprintInstaller` |
| `seo_settings` | SEO configuration | `BlueprintInstaller` |
| `seo_defaults` | SEO default values | `BlueprintInstaller` |
| `analytics_config` | Analytics configuration | `BlueprintInstaller` |
| `fonts_config` | Font configuration | `ProvisionEngine`, `ProvisionSeeder` |
| `test_questions` | Test questions config | `TestRepository` |

---

## Workspace Readiness Summary

| Table | Has `workspace_id`? | Isolation Strategy |
|-------|---------------------|-------------------|
| `site_content` | ❌ | Key prefix (`workspace:{id}:`) |
| `page_blocks` | ❌ | None — rollback deletes ALL |
| `menu_items` | ❌ | None |
| `gallery_images` | ❌ | None |
| `events` | ❌ | None |
| `testimonials` | ❌ | None |
| `theme_settings` | ❌ | Single-row pattern (NOT compatible) |
| `media_files` | ❌ | None |
| `personality_profiles` | ❌ | None |
| `test_responses` | ❌ | None |
| `user_roles` | ❌ | None |
| `site_visits` | ❌ | None |
| `page_views` | ❌ | None |

**All tables need `workspace_id` columns for true multi-tenant isolation.** The workspace system is architecture-ready but inert without schema changes.

---

## Known Issues

1. `theme_settings` uses single-row pattern (id=1) — NOT multi-tenant compatible
2. `BlueprintInstaller._installPages` and `_installBlocks` directly insert into `page_blocks` without workspace filtering
3. `ProvisionRollback._revertCreatePages` deletes ALL `page_blocks` regardless of workspace
4. `ProvisionRollback._revertInsertMedia` deletes ALL `media_files` regardless of workspace
5. `WorkspaceRepository.listAll()` has no pagination
6. No foreign key constraints between tables for workspace relationships
