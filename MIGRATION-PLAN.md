# THEME TOKEN MIGRATION PLAN

## Files Needing Migration (hardcoded visual values found):

### CRITICAL (Landing Page Layer) - Affects user-facing landing page

1. `src/components/landing/landing-sections.tsx` - Extensive hardcoded rgba/gradients/shadows
2. `src/components/ui/orb-background.tsx` - Visual effects component

### ADMIN (Admin Panel Layer) - Affects admin panel pages

3. `src/components/admin/analytics-charts.tsx` - Chart visualization
4. `src/components/admin/phone-preview.tsx` - Phone preview component
5. `src/components/admin/image-uploader.tsx` - Image upload with styling
6. `src/components/admin/theme-live-preview.tsx` - Theme live preview
7. `src/components/admin/theme-presets-card.tsx` - Theme preset cards

### ROUTES (Route Pages)

8. `src/routes/test.$step.tsx` - Test step pages
9. `src/routes/test.info.tsx` - Test info page
10. `src/routes/test.result.tsx` - Test result page

### UTILS (Utility files with visual values)

11. `src/lib/glassmorphism-utils.ts` - Glass effect utilities
12. `src/lib/personality-store.ts` - Visual state styles
13. `src/lib/test-data.ts` - Test data
14. `src/lib/theme-presets.ts` - Theme presets

## Token Mapping Strategy:

- All rgba/hex colors → CSS variables (var(--nama-primary), var(--nama-accent), etc.)
- All glass effects → Glass token CSS variables
- All gradients → Gradient token CSS variables
- All shadows → Shadow token CSS variables
- All inline styles → CSS class references
