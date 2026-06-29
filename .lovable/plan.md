## Goal
Make the admin panel a real CMS for the existing landing page: full CRUD for menu / gallery / events / site content, a working "افزودن بلوک" block builder with drag-and-drop, dynamic personality-type editor, and a landing page that renders blocks from the store. Keep the current dark burgundy/gold design and the `/test/*` flow untouched.

## Scope check (please confirm before I build)
1. **Persistence layer.** Today everything in `useAdmin` and the test store is `zustand + persist` (localStorage). Two options:
   - **A. Stay on Zustand only** (fast, no backend changes) — admin edits live in the browser; multi-device sync isn't there yet.
   - **B. Enable Lovable Cloud** and back the same store with Supabase tables (`page_blocks`, `personality_profiles`, `menu_items`, `gallery_images`, `events`, `site_content`), with RLS + an `admin` role. This is what your message asks for, but it's a much bigger change and needs Cloud turned on.
   I'll proceed with **B** unless you say otherwise.
2. **Auth.** For B, admin routes need a real auth gate (`_authenticated/` + `has_role(uid,'admin')`). OK to add a Supabase login at `/auth` and move `admin.*` under `_authenticated/admin.*`?

## Work plan

### 1. Backend (only if B)
- Enable Lovable Cloud.
- Migration: `app_role` enum + `user_roles` + `has_role()` (per project rules).
- Tables (all with GRANTs + RLS):
  - `page_blocks(id, type, order, visible, props jsonb)` — anon SELECT where visible, admin write.
  - `personality_profiles(key, label, tagline, description, traits jsonb, drink, spot, color_from, color_to, "order")` — anon SELECT, admin write.
  - `menu_items`, `gallery_images`, `events`, `site_content(key, value jsonb)` — same pattern.
- Storage bucket `media` for gallery/menu images.
- Server fns in `src/lib/cms.functions.ts` for reads (public, publishable key) and writes (`requireSupabaseAuth` + admin check).

### 2. Admin store refactor (`src/lib/admin-store.ts`)
- Replace persist middleware with a thin loader that hydrates from server fns and pushes mutations back.
- Keep current selector API so existing admin pages don't change shape.
- Add slices: `blocks`, `personalities`, `menu`, `gallery`, `events`, `siteContent`.

### 3. Block builder (`src/routes/admin.page.tsx` + `src/components/admin/blocks.tsx`)
- Finish the "افزودن بلوک" modal: register block types (`hero`, `personality-cards`, `menu`, `gallery`, `events`, `testimonials`, `location`, `custom-text`).
- Each type ships with a `defaultProps`, an `Editor` (admin form) and a `Renderer` (landing component).
- DnD reordering via `@dnd-kit` (already installed), per-block visibility toggle, duplicate, delete — persisted via store.

### 4. Test admin upgrades
- `admin.test-questions.tsx`: add option text editing, type-mapping editing, add/remove options, DnD reorder, enable/disable — written through to `test-store`/Supabase (questions table or `site_content.test_questions` JSON; I'll use a JSON blob to avoid breaking scoring).
- New `admin.personality-types.tsx`: edit the 4 main + bedone profiles (label, tagline, description, traits[], drink, spot, gradient colors). Test result page reads from store.

### 5. Dynamic landing (`src/routes/index.tsx`)
- Replace the hard-coded section order with `blocks.map(b => <BlockRenderer block={b} />)`.
- Each existing section becomes a `Renderer` consuming props from the block + content from store. Visual markup, classes, animations stay identical.
- Test CTA still routes to `/test/info`.

### 6. Guardrails
- `/test/*` routes and `test-store` untouched except for reading personality copy from the new profiles slice (with fallback to current `test-data.ts` defaults so nothing breaks if Cloud is off).
- No design changes: same fonts, gradients, `OrbBackground`, spacing.

## Deliverables per file (high level)
- New: migration SQL, `src/lib/cms.functions.ts`, `src/lib/cms.server.ts`, `src/components/admin/block-registry.tsx`, `src/routes/admin.personality-types.tsx`, `src/routes/_authenticated/admin.*` (moved).
- Updated: `admin-store.ts`, `admin.page.tsx`, `blocks.tsx`, `admin.test-questions.tsx`, `index.tsx`, `admin-shell.tsx` (nav entry).

## Questions before I start
1. Go with **option B (Supabase-backed)** and enable Lovable Cloud now? (Required to truly match kioar.com-level reliability.)
2. OK to add a `/auth` login page and gate admin routes behind admin role?
3. Any block types you want beyond the list above (hero, personality-cards, menu, gallery, events, testimonials, location, custom-text)?