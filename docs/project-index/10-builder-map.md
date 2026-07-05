# Builder Map — NAMA Website Builder

## Landing Builder Architecture

The landing page builder generates public-facing websites from blueprint data. It is NOT a visual drag-and-drop builder in the traditional sense — it renders blocks defined by blueprint data using React components.

---

## Components

| Component | File | Purpose |
|-----------|------|---------|
| `LandingPage` | `src/routes/index.tsx` | Landing page shell (lazy loaded) |
| `LandingSections` | `src/components/landing/landing-sections.tsx` | Block renderer selector (1753 lines) |
| `LandingBlockRender` | `src/components/landing/landing-sections.tsx` | Individual block renderer (memo'd) |
| `Blocks` (admin) | `src/components/admin/blocks.tsx` | Admin block editor with drag-and-drop |

---

## Block Renderer System

`LandingSections` maps block types to render functions:

| Block Type | Renderer | Description |
|------------|----------|-------------|
| `hero` | Hero section | Full-width hero with CTA |
| `features` | Features grid | Feature showcase |
| `gallery` | Gallery grid | Image gallery |
| `contact` | Contact form | Contact information + form |
| `about` | About section | About/bio section |
| `menu` | Menu display | Restaurant menu |
| `testimonials` | Testimonial carousel | Customer reviews |
| `events` | Events list | Upcoming events |
| `cta` | Call-to-action | Simple CTA banner |
| `header` | Header section | Page header |
| `stats` | Statistics | Number stats display |
| `team` | Team grid | Team member cards |
| `faq` | FAQ accordion | Questions + answers |
| `pricing` | Pricing table | Plan comparison |
| `footer` | Footer | Site footer |

---

## Editor (`Components/admin/blocks.tsx`)

The admin page block editor features:
- Drag-and-drop reordering (via @dnd-kit)
- Block type selection dropdown
- Inline edit mode
- Add/remove blocks
- Phone preview (side panel)

---

## Rendering Flow

```
Blueprint (DATA) → PagesRepository (DB: page_blocks)
    ↓
usePageBlocks() (TanStack Query hook)
    ↓
LandingSections
    ↓
[Block Type] → Block Renderer Component
```

---

## Serialization

Blocks are serialized as JSON in `page_blocks.data`:
```ts
{
  type: "hero",
  data: {
    title: "Welcome",
    subtitle: "Best café in town",
    image: "url...",
    pageKey: "home",
    pageTitle: "Home",
    [key: string]: unknown  // Block-type-specific data
  },
  sort_order: 0,
  visible: true
}
```

---

## Versioning

There is currently NO versioning for page blocks or blueprints at the rendering level. The Provision Engine supports blueprint versioning, but once a workspace is provisioned, block updates are live immediately with no version history or rollback capability.

---

## Missing Features

| Feature | Status | Priority |
|---------|--------|----------|
| Block version history | ❌ Missing | Low |
| Draft/publish workflow | ❌ Missing | Medium |
| A/B testing | ❌ Missing | Low |
| Visual page builder (WYSIWYG) | ❌ Missing | Low |
| Block templates | ❌ Missing | Medium |
| Reusable block groups | ❌ Missing | Low |
