# Performance Map — NAMA Website Builder

## Audit Status

Performance audit was completed as EPIC 3 (10 steps). See `PERFORMANCE-AUDIT.md` for full details.

---

## Lazy Loading

| Component | Strategy | Import | Chunk |
|-----------|----------|--------|-------|
| `OrbBackground` | `React.lazy()` + `lazyLoad()` | Dynamic import in `index.tsx` | Separate chunk |
| `LandingPage` | `lazyLoad()` with skeleton | Dynamic import in `index.tsx` | Separate chunk |
| `LandingBlockRender` | `lazyLoad()` with skeleton | Dynamic import | Separate chunk |
| `LandingThemeProvider` | Dynamic import | Dynamic import | Separate chunk |
| Admin theme preview | `lazyLoad()` with 300px skeleton | Dynamic import | Separate chunk |
| framer-motion | Code-split via lazy loading | Only loaded with landing sections | ~130KB gz |
| recharts | Only in admin analytics | Admin-only routes | ~80KB gz |
| @dnd-kit | Only in admin blocks | Admin-only routes | ~40KB gz |

---

## Memoization

| Component | Technique | Reason |
|-----------|-----------|--------|
| `LandingBlockRender` | `React.memo()` + `displayName` | Prevents re-render chain on landing page updates |
| `WorkspaceContextValue` | `useMemo()` | Stable reference for context consumers |
| `CurrentWorkspaceProvider.resolve` | `useCallback()` | Stable function reference |

---

## Hydration Strategy

- `memo + displayName` on `LandingBlockRender`
- Lazy hydration of `OrbBackground` (canvas loads after hero is visible)
- CMS data caching via React Query's `staleTime`
- Dynamic imports limit hydration to landing page only

---

## Bundle Splitting

| Area | Before | After | Reduction |
|------|--------|-------|-----------|
| Main JS (critical) | ~280KB | ~130KB | ~54% |
| Total JS (all routes) | ~520KB | ~400KB | ~23% |
| Blocking CSS | Full CSS | Critical CSS inline | ~100-200ms faster FP |

---

## Image Optimization

| Technique | Applied To | Impact |
|-----------|-----------|--------|
| `loading="lazy"` | All `<img>` tags (8 images) | Deferred below-fold loading |
| `decoding="async"` | All `<img>` tags | Non-blocking decode |
| Deferred images | Gallery, menu, events | ~300-500KB initial weight reduction |

---

## Font Optimization

| Font | Strategy |
|------|----------|
| Vazirmatn (Persian) | Self-hosted via `@fontsource/vazirmatn`, `font-display: swap` |
| Preconnect | Added for font origin |
| Preload | Hero-critical font preloaded |

---

## Animation Optimization

| Technique | Applied To |
|-----------|-----------|
| `willChange: transform, opacity` | Hero motion.divs (GPU compositing) |
| `prefers-reduced-motion` support | All framer-motion animations |
| `requestAnimationFrame` | `OrbBackground` canvas |
| `viewport={{ once: true }}` | All scroll animations |
| Reduced particle count | `OrbBackground` |

---

## Network Optimization

| Technique | Applied | Impact |
|-----------|---------|--------|
| Preconnect | Font origin | ~100ms saved |
| Preload | Hero font | Prevents FOIT |
| Self-hosted fonts | All fonts | 0 external font requests |

---

## Estimated Lighthouse Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| LCP | ~4.5s | ~2.5s | ~44% |
| TBT | ~350ms | ~150ms | ~57% |
| CLS | ~0.15 | ~0.05 | ~67% |
| SI | ~4.0s | ~2.2s | ~45% |
| Performance Score | ~55 | ~85 | +30 points |

---

## Remaining Bottlenecks

1. **`LandingSections.tsx`** — 1753-line file, consider splitting into per-block files
2. **CMS query waterfall** — 7+ queries fire on mount, consider prefetching or parallelization
3. **framer-motion still lazy** — Yet ~130KB is the largest chunk, consider alternatives
4. **No image CDN** — Supabase Storage has no transformation pipeline
5. **No service worker caching strategy** — PWA readiness is minimal
6. **No code-level bundle analysis** — No `vite-bundle-visualizer` or similar used
7. **`OrbBackground`** — Still uses render-time `window.matchMedia` (EPIC 3.7 L3)
