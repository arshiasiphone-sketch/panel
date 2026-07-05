/**
 * NAMA Theme Engine — derivation.
 *
 * Pure function: `ThemeDocument → ThemeTokens`. Used by:
 *   - `LandingThemeProvider` to emit CSS variables at runtime.
 *   - Admin preview cards to render a swatch without mutating global CSS.
 *   - Import/export to round-trip a fully expanded theme.
 *
 * Everything derived. Lighter / darker / hover / active states are produced via
 * `color-mix(in oklch, ...)` so the browser keeps them perceptually uniform.
 */
import { contrastForeground, hexToOklch, hexToRgba, mix } from "./color";
import { DEFAULT_KNOBS, DEFAULT_STATE_COLORS } from "./defaults";
import type {
  ColorTokens,
  GlassTokens,
  GradientTokens,
  MotionTokens,
  RadiusTokens,
  ShadowTokens,
  SpacingTokens,
  ThemeBase,
  ThemeDocument,
  ThemeKnobs,
  ThemeTokens,
  TypographyTokens,
} from "./types";

function withKnobDefaults(knobs: ThemeKnobs): Required<ThemeKnobs> {
  return { ...DEFAULT_KNOBS, ...knobs };
}

function deriveColors(base: ThemeBase): ColorTokens {
  const primary = hexToOklch(base.primary);
  const secondary = hexToOklch(base.secondary);
  const accent = hexToOklch(base.accent);
  const background = hexToOklch(base.background);
  const foreground = hexToOklch(base.foreground);
  const textSecondary = hexToOklch(base.textSecondary);
  const textTertiary = hexToOklch(base.textTertiary);

  const success = hexToOklch(base.success ?? DEFAULT_STATE_COLORS.success);
  const warning = hexToOklch(base.warning ?? DEFAULT_STATE_COLORS.warning);
  const danger = hexToOklch(base.danger ?? DEFAULT_STATE_COLORS.danger);
  const info = hexToOklch(base.info ?? DEFAULT_STATE_COLORS.info);

  const primaryFg = contrastForeground(base.primary);
  const secondaryFg = contrastForeground(base.secondary);
  const accentFg = contrastForeground(base.accent);

  return {
    primary,
    primaryHover: mix(primary, foreground, 88),
    primaryActive: mix(primary, foreground, 78),
    primaryForeground: primaryFg,

    secondary,
    secondaryHover: mix(secondary, foreground, 90),
    secondaryForeground: secondaryFg,

    accent,
    accentHover: mix(accent, foreground, 88),
    accentForeground: accentFg,

    background,
    surface: mix(background, foreground, 96),
    surfaceElevated: mix(background, foreground, 90),
    foreground,
    muted: mix(secondary, background, 35),
    mutedForeground: textSecondary,
    textSecondary,
    textTertiary,
    border: mix(foreground, background, 14),
    divider: mix(foreground, background, 8),
    overlay: mix(background, foreground, 70),
    selection: mix(primary, background, 28),
    ring: mix(primary, foreground, 60),
    input: mix(foreground, background, 16),

    success,
    warning,
    danger,
    info,

    card: mix(background, foreground, 94),
    cardForeground: foreground,
    popover: mix(background, foreground, 98),
    popoverForeground: foreground,

    sidebar: mix(secondary, background, 22),
    sidebarForeground: foreground,
    sidebarPrimary: primary,
    sidebarPrimaryForeground: primaryFg,
    sidebarAccent: mix(secondary, background, 40),
    sidebarAccentForeground: foreground,
    sidebarBorder: mix(foreground, background, 12),
    sidebarRing: mix(primary, foreground, 55),

    chart1: primary,
    chart2: accent,
    chart3: mix(primary, accent, 50),
    chart4: mix(secondary, accent, 50),
    chart5: mix(primary, background, 60),
    chartGrid: mix(foreground, background, 10),
    chartAxis: mix(foreground, background, 35),
    chartTooltip: mix(background, foreground, 92),
  };
}

function deriveRadius(knobs: Required<ThemeKnobs>): RadiusTokens {
  const base = knobs.radiusBase;
  return {
    base,
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.5rem",
    lg: base,
    xl: `calc(${base} + 0.25rem)`,
    xl2: `calc(${base} + 0.5rem)`,
    xl3: `calc(${base} + 0.75rem)`,
    xl4: `calc(${base} + 1rem)`,
    full: "9999px",
    circle: "50%",
  };
}

function deriveSpacing(): SpacingTokens {
  return {
    px2: "0.125rem",
    px4: "0.25rem",
    px6: "0.375rem",
    px8: "0.5rem",
    px12: "0.75rem",
    px16: "1rem",
    px20: "1.25rem",
    px24: "1.5rem",
    px32: "2rem",
    px40: "2.5rem",
    px48: "3rem",
    px64: "4rem",
    px80: "5rem",
    px96: "6rem",
  };
}

function deriveShadow(base: ThemeBase, knobs: Required<ThemeKnobs>): ShadowTokens {
  const op = knobs.shadowOpacity;
  const r = knobs.shadowRadius;
  // Generic neutral shadow (works on any background) + brand-colored variants.
  const neutral = `rgba(0, 0, 0, ${op})`;
  const primaryShadow = hexToRgba(base.primary, Math.min(0.6, op + 0.25));
  const accentShadow = hexToRgba(base.accent, Math.min(0.6, op + 0.2));

  return {
    xs: `0 1px 2px ${neutral}`,
    sm: `0 2px 6px ${neutral}`,
    md: `0 4px 12px ${neutral}`,
    lg: `0 8px ${r}px ${neutral}`,
    xl: `0 12px ${r * 1.4}px ${neutral}`,
    xl2: `0 18px ${r * 1.8}px ${neutral}`,
    floating: `0 18px ${r * 1.6}px ${neutral}, 0 4px 12px ${neutral}`,
    modal: `0 24px ${r * 2}px ${neutral}, 0 8px 24px ${neutral}`,
    dropdown: `0 8px 24px ${neutral}, 0 2px 6px ${neutral}`,
    hero: `0 25px 60px -25px ${neutral}`,
    glow: `0 0 ${r * 1.6}px ${primaryShadow}`,
    glowAccent: `0 0 ${r * 1.6}px ${accentShadow}`,
    opacity: op,
    radius: r,
  };
}

function deriveGlass(base: ThemeBase, knobs: Required<ThemeKnobs>): GlassTokens {
  const tintAlpha = Math.max(0, Math.min(1, knobs.glassOpacity));
  const borderAlpha = Math.max(0, Math.min(1, knobs.borderOpacity));
  return {
    blur: `${knobs.glassBlur}px`,
    saturation: `${knobs.glassSaturation}`,
    opacity: tintAlpha,
    tint: hexToRgba(base.foreground, tintAlpha),
    border: hexToRgba(base.foreground, borderAlpha),
    highlight: `rgba(255, 255, 255, ${Math.min(0.2, tintAlpha + 0.06)})`,
    noise: "none",
    reflection: hexToRgba(base.primary, Math.min(0.2, tintAlpha + 0.04)),
    elevation: 1,
    depth: `inset 0 1px 0 rgba(255, 255, 255, ${Math.min(0.14, tintAlpha + 0.06)})`,
  };
}

function deriveGradient(base: ThemeBase, knobs: Required<ThemeKnobs>): GradientTokens {
  const angle = `${knobs.gradientAngle}deg`;
  const op = knobs.gradientOpacity;
  const primary = hexToOklch(base.primary);
  const accent = hexToOklch(base.accent);
  const secondary = hexToOklch(base.secondary);
  const background = hexToOklch(base.background);
  const foreground = hexToOklch(base.foreground);

  // All gradients use derived oklch + color-mix so they follow base palette.
  return {
    hero: `linear-gradient(${angle}, ${primary} 0%, ${mix(primary, accent, 55)} 55%, ${accent} 100%)`,
    cta: `linear-gradient(${angle}, ${primary} 0%, ${mix(primary, accent, 50)} 100%)`,
    section: `linear-gradient(180deg, ${background} 0%, ${mix(background, secondary, 88)} 100%)`,
    button: `linear-gradient(${angle}, ${primary} 0%, ${accent} 100%)`,
    card: `linear-gradient(${angle}, ${mix(background, foreground, 96)} 0%, ${mix(background, foreground, 92)} 100%)`,
    navbar: `linear-gradient(180deg, ${mix(background, foreground, 96)} 0%, ${background} 100%)`,
    footer: `linear-gradient(0deg, ${mix(background, secondary, 80)} 0%, ${background} 100%)`,
    overlay: `linear-gradient(180deg, transparent 0%, ${mix(background, foreground, 70)} 100%)`,
    angle: knobs.gradientAngle,
    opacity: op,
  };
}

function deriveMotion(knobs: Required<ThemeKnobs>): MotionTokens {
  const d = knobs.motionDuration;
  const ms = (x: number) => `${x}ms`;
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const easeIn = "cubic-bezier(0.4, 0, 1, 1)";
  const easeOut = "cubic-bezier(0, 0, 0.2, 1)";
  const easeInOut = "cubic-bezier(0.4, 0, 0.2, 1)";
  const spring = "cubic-bezier(0.34, 1.56, 0.64, 1)";

  return {
    durationInstant: ms(60),
    durationFast: ms(Math.round(d * 0.6)),
    durationBase: ms(d),
    durationSlow: ms(Math.round(d * 1.6)),
    durationSlower: ms(Math.round(d * 2.4)),
    delayShort: ms(Math.round(d * 0.3)),
    delayBase: ms(Math.round(d * 0.6)),
    easeStandard: ease,
    easeIn,
    easeOut,
    easeInOut,
    easeSpring: spring,
    hoverScale: String(knobs.hoverScale),
    hoverGlow: `0 0 ${knobs.shadowRadius * 1.6}px`,
    pressScale: String(knobs.pressScale),
    modal: `transform ${ms(d)} ${ease}, opacity ${ms(d)} ${easeOut}`,
    toast: `transform ${ms(Math.round(d * 0.8))} ${spring}, opacity ${ms(Math.round(d * 0.8))} ${easeOut}`,
    page: `opacity ${ms(d)} ${easeOut}, transform ${ms(d)} ${ease}`,
    card: `box-shadow ${ms(d)} ${easeOut}, transform ${ms(d)} ${ease}, border-color ${ms(d)} ${easeOut}`,
    button: `background-color ${ms(Math.round(d * 0.7))} ${easeOut}, transform ${ms(Math.round(d * 0.7))} ${spring}, box-shadow ${ms(d)} ${easeOut}`,
    navigation: `background-color ${ms(d)} ${easeOut}, color ${ms(d)} ${easeOut}`,
    hero: `transform ${ms(Math.round(d * 2.4))} ${ease}, opacity ${ms(Math.round(d * 2))} ${easeOut}`,
    analytics: `transform ${ms(d)} ${spring}, opacity ${ms(d)} ${easeOut}`,
    chart: `stroke-dashoffset ${ms(Math.round(d * 3))} ${easeInOut}`,
  };
}

function deriveTypography(knobs: Required<ThemeKnobs>): TypographyTokens {
  return {
    fontFamily: knobs.fontFamily,
    fontFamilyMono: '"JetBrains Mono", ui-monospace, monospace',
    display: "clamp(2.5rem, 5vw, 3.5rem)",
    h1: "clamp(2rem, 4vw, 2.75rem)",
    h2: "clamp(1.5rem, 3vw, 2rem)",
    h3: "1.25rem",
    h4: "1.125rem",
    bodyLarge: "1.0625rem",
    body: "0.9375rem",
    caption: "0.8125rem",
    small: "0.75rem",
    button: "0.875rem",
    label: "0.75rem",
    weightRegular: "400",
    weightMedium: "500",
    weightSemibold: "600",
    weightBold: "700",
    weightExtrabold: "800",
    lineHeightTight: "1.1",
    lineHeightSnug: "1.3",
    lineHeightNormal: "1.6",
    lineHeightRelaxed: "1.9",
    trackingTight: "-0.01em",
    trackingNormal: "0em",
    trackingWide: "0.06em",
    trackingWider: "0.18em",
    caseNormal: "none",
    caseUpper: "uppercase",
  };
}

/** Derives the complete `ThemeTokens` bag from a `ThemeDocument`. */
export function deriveTokens(doc: ThemeDocument): ThemeTokens {
  const knobs = withKnobDefaults(doc.knobs);
  return {
    colors: deriveColors(doc.base),
    radius: deriveRadius(knobs),
    spacing: deriveSpacing(),
    shadow: deriveShadow(doc.base, knobs),
    glass: deriveGlass(doc.base, knobs),
    gradient: deriveGradient(doc.base, knobs),
    motion: deriveMotion(knobs),
    typography: deriveTypography(knobs),
  };
}
