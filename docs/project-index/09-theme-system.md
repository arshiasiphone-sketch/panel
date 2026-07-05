# Theme System — NAMA Website Builder

## Architecture

The theme engine generates CSS variables from theme settings (presets + overrides). Components reference `--nama-*` CSS variables, never hardcoded colors.

```
Theme Settings (DB: theme_settings)
    ↓
Theme Engine (src/lib/theme/)
    ├── types.ts — Token type definitions
    ├── defaults.ts — Default knob values
    ├── color.ts — Color derivation (lighter, darker, contrast, etc.)
    ├── derive.ts — Full token derivation from knobs
    ├── css-vars.ts — CSS variable emitter → --nama-*
    ├── bridge.ts — CMS integration (settings → derive → emit)
    ├── import-export.ts — JSON import/export
    └── index.ts — Public API
    ↓
CSS Variables (--nama-primary, --nama-background, --nama-glass-*, etc.)
    ↓
Components (reference CSS variables, never hardcode colors)
```

---

## Theme Tokens

### Semantic Variables (direct references in components)

| Variable | Source | Usage |
|----------|--------|-------|
| `--nama-primary` | Theme engine | Primary button backgrounds, links |
| `--nama-primary-hover` | Derived | Button hover states |
| `--nama-primary-active` | Derived | Button active/pressed states |
| `--nama-primary-fg` | Derived | Text on primary backgrounds |
| `--nama-secondary` | Theme engine | Secondary surfaces |
| `--nama-secondary-hover` | Derived | Secondary hover |
| `--nama-secondary-fg` | Derived | Text on secondary |
| `--nama-accent` | Theme engine | Accent elements |
| `--nama-accent-hover` | Derived | Accent hover |
| `--nama-accent-fg` | Derived | Text on accent |
| `--nama-background` | Theme engine | Page background |
| `--nama-foreground` | Derived | Primary text |
| `--nama-muted` | Derived | Muted backgrounds |
| `--nama-muted-fg` | Derived | Muted text |
| `--nama-border` | Derived | Borders |
| `--nama-card` | Derived | Card backgrounds |
| `--nama-card-fg` | Derived | Card text |
| `--nama-ring` | Derived | Focus rings |
| `--nama-surface` | Derived | Surface backgrounds |
| `--nama-text-secondary` | Derived | Secondary text |
| `--nama-text-tertiary` | Derived | Tertiary text |
| `--nama-radius-sm` | Theme engine | Small border radius |
| `--nama-radius-md` | Theme engine | Medium border radius |
| `--nama-radius-lg` | Theme engine | Large border radius |
| `--nama-shadow-sm` | Derived | Small shadow |
| `--nama-shadow-md` | Derived | Medium shadow |
| `--nama-shadow-lg` | Derived | Large shadow |
| `--nama-glass-blur` | Theme engine | Glass blur amount |
| `--nama-glass-border` | Derived | Glass border color |
| `--nama-glass-highlight` | Derived | Glass highlight |
| `--nama-glass-tint` | Derived | Glass tint |
| `--nama-motion-fast` | Theme engine | Fast animation duration |
| `--nama-motion-normal` | Theme engine | Normal animation duration |

---

## Theme Presets

8 canonical presets in `src/lib/theme-presets.ts`:

| Preset | Style | Primary | Background |
|--------|-------|---------|------------|
| Cappuccino | Warm café | `#d4af37` | `#0a0a0a` |
| Emerald | Clean green | `#10b981` | `#0a0a0a` |
| Sapphire | Blue modern | `#3b82f6` | `#0a0a0a` |
| Ruby | Bold red | `#ef4444` | `#0a0a0a` |
| Amethyst | Purple creative | `#8b5cf6` | `#0a0a0a` |
| Coral | Warm orange | `#f97316` | `#0a0a0a` |
| Slate | Gray modern | `#64748b` | `#0a0a0a` |
| Midnight | Dark premium | `#6366f1` | `#0a0a0a` |

---

## Theme Bridge (`src/lib/theme/bridge.ts`)

The bridge connects CMS theme settings to the theme engine:
1. Loads theme settings from DB (via `ThemeRepository.get()`)
2. Determines preset or custom mode
3. Calls `deriveTokens()` to generate all derived tokens
4. Calls `emitCSSVariables()` to produce `--nama-*` strings
5. Returns style object for injection into DOM

---

## Legacy Compatibility

`src/lib/theme-tokens.ts` and `src/lib/theme-presets.ts` delegate to the new theme engine. The migration plan (`MIGRATION-PLAN.md`) lists 14 files needing migration from hardcoded colors to CSS variable references.

---

## Known Limitations

1. **Single-row theme** — `theme_settings` uses `id=1` hardcoded, NOT multi-tenant compatible
2. **No workspace isolation** — All workspaces share the same theme (until EPIC 5)
3. **Preset ID dependency** — Blueprints reference preset IDs that must exist in code
4. **No runtime token generation** — Tokens are derived server-side, not at CSS paint time
5. **CSS variable support required** — Older browsers may not support `--nama-*` variables
