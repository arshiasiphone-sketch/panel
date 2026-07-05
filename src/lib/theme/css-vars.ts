/**
 * NAMA Theme Engine — CSS variable emitter.
 *
 * Flattens a `ThemeTokens` bag into the CSS variables consumed by:
 *   - Tailwind v4's `@theme inline` mapping in `styles.css` (color-*, radius-*).
 *   - Direct `var(--nama-*)` references in components/utilities.
 *
 * Every variable is namespaced under `--nama-...` to avoid collision with
 * existing shadcn variables (`--primary`, `--background`, ...) which we
 * continue to keep as aliases so legacy components are unaffected.
 *
 * Output is a single CSS rule string — apply under any scope, hot-swap freely.
 */
import type { ThemeTokens } from "./types";

/** CSS scope used for the landing-page theme. Kept in sync with old constant. */
export const LANDING_THEME_CLASS = "cms-theme";

type VarMap = Record<string, string | number>;

function colorVars(t: ThemeTokens): VarMap {
  const c = t.colors;
  return {
    // Legacy shadcn variables (preserved so existing components keep working).
    "--primary": c.primary,
    "--primary-foreground": c.primaryForeground,
    "--secondary": c.secondary,
    "--secondary-foreground": c.secondaryForeground,
    "--accent": c.accent,
    "--accent-foreground": c.accentForeground,
    "--background": c.background,
    "--foreground": c.foreground,
    "--card": c.card,
    "--card-foreground": c.cardForeground,
    "--popover": c.popover,
    "--popover-foreground": c.popoverForeground,
    "--muted": c.muted,
    "--muted-foreground": c.mutedForeground,
    "--text-secondary": c.textSecondary,
    "--text-tertiary": c.textTertiary,
    "--destructive": c.danger,
    "--destructive-foreground": c.primaryForeground,
    "--border": c.border,
    "--input": c.input,
    "--ring": c.ring,
    "--sidebar": c.sidebar,
    "--sidebar-foreground": c.sidebarForeground,
    "--sidebar-primary": c.sidebarPrimary,
    "--sidebar-primary-foreground": c.sidebarPrimaryForeground,
    "--sidebar-accent": c.sidebarAccent,
    "--sidebar-accent-foreground": c.sidebarAccentForeground,
    "--sidebar-border": c.sidebarBorder,
    "--sidebar-ring": c.sidebarRing,
    "--chart-1": c.chart1,
    "--chart-2": c.chart2,
    "--chart-3": c.chart3,
    "--chart-4": c.chart4,
    "--chart-5": c.chart5,
    // NAMA semantic variables (new — components reference these directly).
    "--nama-primary": c.primary,
    "--nama-primary-hover": c.primaryHover,
    "--nama-primary-active": c.primaryActive,
    "--nama-primary-fg": c.primaryForeground,
    "--nama-secondary": c.secondary,
    "--nama-secondary-hover": c.secondaryHover,
    "--nama-secondary-fg": c.secondaryForeground,
    "--nama-accent": c.accent,
    "--nama-accent-hover": c.accentHover,
    "--nama-accent-fg": c.accentForeground,
    "--nama-background": c.background,
    "--nama-surface": c.surface,
    "--nama-surface-elevated": c.surfaceElevated,
    "--nama-foreground": c.foreground,
    "--nama-muted": c.muted,
    "--nama-muted-fg": c.mutedForeground,
    "--nama-text-secondary": c.textSecondary,
    "--nama-text-tertiary": c.textTertiary,
    "--nama-border": c.border,
    "--nama-divider": c.divider,
    "--nama-overlay": c.overlay,
    "--nama-selection": c.selection,
    "--nama-ring": c.ring,
    "--nama-input": c.input,
    "--nama-success": c.success,
    "--nama-warning": c.warning,
    "--nama-danger": c.danger,
    "--nama-info": c.info,
    "--nama-card": c.card,
    "--nama-card-fg": c.cardForeground,
    "--nama-popover": c.popover,
    "--nama-popover-fg": c.popoverForeground,
    "--nama-chart-1": c.chart1,
    "--nama-chart-2": c.chart2,
    "--nama-chart-3": c.chart3,
    "--nama-chart-4": c.chart4,
    "--nama-chart-5": c.chart5,
    "--nama-chart-grid": c.chartGrid,
    "--nama-chart-axis": c.chartAxis,
    "--nama-chart-tooltip": c.chartTooltip,
  };
}

function radiusVars(t: ThemeTokens): VarMap {
  const r = t.radius;
  return {
    "--radius": r.base,
    "--nama-radius-xs": r.xs,
    "--nama-radius-sm": r.sm,
    "--nama-radius-md": r.md,
    "--nama-radius-lg": r.lg,
    "--nama-radius-xl": r.xl,
    "--nama-radius-2xl": r.xl2,
    "--nama-radius-3xl": r.xl3,
    "--nama-radius-4xl": r.xl4,
    "--nama-radius-full": r.full,
    "--nama-radius-circle": r.circle,
  };
}

function spacingVars(t: ThemeTokens): VarMap {
  const s = t.spacing;
  return {
    "--nama-space-2": s.px2,
    "--nama-space-4": s.px4,
    "--nama-space-6": s.px6,
    "--nama-space-8": s.px8,
    "--nama-space-12": s.px12,
    "--nama-space-16": s.px16,
    "--nama-space-20": s.px20,
    "--nama-space-24": s.px24,
    "--nama-space-32": s.px32,
    "--nama-space-40": s.px40,
    "--nama-space-48": s.px48,
    "--nama-space-64": s.px64,
    "--nama-space-80": s.px80,
    "--nama-space-96": s.px96,
  };
}

function shadowVars(t: ThemeTokens): VarMap {
  const s = t.shadow;
  return {
    "--nama-shadow-xs": s.xs,
    "--nama-shadow-sm": s.sm,
    "--nama-shadow-md": s.md,
    "--nama-shadow-lg": s.lg,
    "--nama-shadow-xl": s.xl,
    "--nama-shadow-2xl": s.xl2,
    "--nama-shadow-floating": s.floating,
    "--nama-shadow-modal": s.modal,
    "--nama-shadow-dropdown": s.dropdown,
    "--nama-shadow-hero": s.hero,
    "--nama-shadow-glow": s.glow,
    "--nama-shadow-glow-accent": s.glowAccent,
    "--nama-shadow-opacity": s.opacity,
    "--nama-shadow-radius": `${s.radius}px`,
  };
}

function glassVars(t: ThemeTokens): VarMap {
  const g = t.glass;
  return {
    "--nama-glass-blur": g.blur,
    "--nama-glass-saturation": g.saturation,
    "--nama-glass-opacity": g.opacity,
    "--nama-glass-tint": g.tint,
    "--nama-glass-border": g.border,
    "--nama-glass-highlight": g.highlight,
    "--nama-glass-noise": g.noise,
    "--nama-glass-reflection": g.reflection,
    "--nama-glass-elevation": g.elevation,
    "--nama-glass-depth": g.depth,
    // Legacy bridge — the existing CMS code reads `--glass-opacity`.
    "--glass-opacity": g.opacity,
  };
}

function gradientVars(t: ThemeTokens): VarMap {
  const g = t.gradient;
  return {
    "--nama-gradient-hero": g.hero,
    "--nama-gradient-cta": g.cta,
    "--nama-gradient-section": g.section,
    "--nama-gradient-button": g.button,
    "--nama-gradient-card": g.card,
    "--nama-gradient-navbar": g.navbar,
    "--nama-gradient-footer": g.footer,
    "--nama-gradient-overlay": g.overlay,
    "--nama-gradient-angle": `${g.angle}deg`,
    "--nama-gradient-opacity": g.opacity,
  };
}

function motionVars(t: ThemeTokens): VarMap {
  const m = t.motion;
  return {
    "--nama-motion-instant": m.durationInstant,
    "--nama-motion-fast": m.durationFast,
    "--nama-motion-base": m.durationBase,
    "--nama-motion-slow": m.durationSlow,
    "--nama-motion-slower": m.durationSlower,
    "--nama-motion-delay-short": m.delayShort,
    "--nama-motion-delay-base": m.delayBase,
    "--nama-ease-standard": m.easeStandard,
    "--nama-ease-in": m.easeIn,
    "--nama-ease-out": m.easeOut,
    "--nama-ease-in-out": m.easeInOut,
    "--nama-ease-spring": m.easeSpring,
    "--nama-hover-scale": m.hoverScale,
    "--nama-hover-glow": m.hoverGlow,
    "--nama-press-scale": m.pressScale,
    "--nama-transition-modal": m.modal,
    "--nama-transition-toast": m.toast,
    "--nama-transition-page": m.page,
    "--nama-transition-card": m.card,
    "--nama-transition-button": m.button,
    "--nama-transition-nav": m.navigation,
    "--nama-transition-hero": m.hero,
    "--nama-transition-analytics": m.analytics,
    "--nama-transition-chart": m.chart,
  };
}

function typographyVars(t: ThemeTokens): VarMap {
  const ty = t.typography;
  return {
    "--nama-font-family": ty.fontFamily,
    "--nama-font-mono": ty.fontFamilyMono,
    "--nama-font-display": ty.display,
    "--nama-font-h1": ty.h1,
    "--nama-font-h2": ty.h2,
    "--nama-font-h3": ty.h3,
    "--nama-font-h4": ty.h4,
    "--nama-font-body-lg": ty.bodyLarge,
    "--nama-font-body": ty.body,
    "--nama-font-caption": ty.caption,
    "--nama-font-small": ty.small,
    "--nama-font-button": ty.button,
    "--nama-font-label": ty.label,
    "--nama-weight-regular": ty.weightRegular,
    "--nama-weight-medium": ty.weightMedium,
    "--nama-weight-semibold": ty.weightSemibold,
    "--nama-weight-bold": ty.weightBold,
    "--nama-weight-extrabold": ty.weightExtrabold,
    "--nama-leading-tight": ty.lineHeightTight,
    "--nama-leading-snug": ty.lineHeightSnug,
    "--nama-leading-normal": ty.lineHeightNormal,
    "--nama-leading-relaxed": ty.lineHeightRelaxed,
    "--nama-tracking-tight": ty.trackingTight,
    "--nama-tracking-normal": ty.trackingNormal,
    "--nama-tracking-wide": ty.trackingWide,
    "--nama-tracking-wider": ty.trackingWider,
    "--nama-case-normal": ty.caseNormal,
    "--nama-case-upper": ty.caseUpper,
  };
}

/** Flattens `ThemeTokens` to the complete CSS custom-property map. */
export function tokensToCssVars(t: ThemeTokens): VarMap {
  return {
    ...colorVars(t),
    ...radiusVars(t),
    ...spacingVars(t),
    ...shadowVars(t),
    ...glassVars(t),
    ...gradientVars(t),
    ...motionVars(t),
    ...typographyVars(t),
  };
}

/** Renders the var map as a single CSS rule under `scope`. */
export function tokensToCss(t: ThemeTokens, scope = `.${LANDING_THEME_CLASS}`): string {
  const vars = tokensToCssVars(t);
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return `${scope} {\n${lines.join("\n")}\n}`;
}

/**
 * Applies vars imperatively to an element (used by the provider for instant
 * propagation without recreating the `<style>` node). Pass `null` to clear.
 */
export function applyTokensToElement(el: HTMLElement | null, t: ThemeTokens | null): void {
  if (!el) return;
  if (!t) return;
  const vars = tokensToCssVars(t);
  for (const [k, v] of Object.entries(vars)) {
    el.style.setProperty(k, String(v));
  }
}
