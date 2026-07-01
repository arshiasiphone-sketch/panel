/**
 * NAMA Theme Engine — token type system.
 *
 * Every visual property in the design system maps to one of the token groups
 * declared here. The engine guarantees that:
 *   - A `ThemeTokens` object can be derived from any base palette (no manual
 *     duplication of lighter/darker shades).
 *   - A `ThemeTokens` object can be serialized to JSON for persistence
 *     (Supabase `theme_settings.tokens` column).
 *   - A `ThemeTokens` object can be flattened to a CSS variable map and
 *     injected under any scope (live preview, no reflow).
 *
 * NO raw hex strings, NO rgba strings, NO inline styles are allowed in any
 * consumer. Components only ever reference the CSS variables emitted by
 * `tokensToCssVars()`.
 */

/** A 6-digit hex color, lowercase preferred. */
export type HexColor = string;

/** A CSS color string (oklch / rgb / hex / `color-mix(...)`). */
export type CssColor = string;

/* ────────────── Color tokens ────────────── */

export type ColorTokens = {
  /** Brand */
  primary: CssColor;
  primaryHover: CssColor;
  primaryActive: CssColor;
  primaryForeground: CssColor;

  secondary: CssColor;
  secondaryHover: CssColor;
  secondaryForeground: CssColor;

  accent: CssColor;
  accentHover: CssColor;
  accentForeground: CssColor;

  /** Neutrals / surfaces */
  background: CssColor;
  surface: CssColor;
  surfaceElevated: CssColor;
  foreground: CssColor;
  muted: CssColor;
  mutedForeground: CssColor;
  textSecondary: CssColor;
  textTertiary: CssColor;
  border: CssColor;
  divider: CssColor;
  overlay: CssColor;
  selection: CssColor;
  ring: CssColor;
  input: CssColor;

  /** State */
  success: CssColor;
  warning: CssColor;
  danger: CssColor;
  info: CssColor;

  /** Card / popover */
  card: CssColor;
  cardForeground: CssColor;
  popover: CssColor;
  popoverForeground: CssColor;

  /** Sidebar (admin parity tokens — emitted under .cms-theme too) */
  sidebar: CssColor;
  sidebarForeground: CssColor;
  sidebarPrimary: CssColor;
  sidebarPrimaryForeground: CssColor;
  sidebarAccent: CssColor;
  sidebarAccentForeground: CssColor;
  sidebarBorder: CssColor;
  sidebarRing: CssColor;

  /** Charts */
  chart1: CssColor;
  chart2: CssColor;
  chart3: CssColor;
  chart4: CssColor;
  chart5: CssColor;
  chartGrid: CssColor;
  chartAxis: CssColor;
  chartTooltip: CssColor;
};

/* ────────────── Radius ────────────── */

export type RadiusTokens = {
  /** Base radius (drives derived steps). */
  base: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xl2: string;
  xl3: string;
  xl4: string;
  full: string;
  circle: string;
};

/* ────────────── Spacing ────────────── */

export type SpacingTokens = {
  px2: string;
  px4: string;
  px6: string;
  px8: string;
  px12: string;
  px16: string;
  px20: string;
  px24: string;
  px32: string;
  px40: string;
  px48: string;
  px64: string;
  px80: string;
  px96: string;
};

/* ────────────── Shadow / Elevation ────────────── */

export type ShadowTokens = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xl2: string;
  floating: string;
  modal: string;
  dropdown: string;
  hero: string;
  /** Brand-colored glow. */
  glow: string;
  glowAccent: string;
  /** Internal opacity / radius knobs used by derive(). */
  opacity: number;
  radius: number;
};

/* ────────────── Blur / Glass ────────────── */

export type GlassTokens = {
  blur: string;
  saturation: string;
  opacity: number;
  /** Color tint for the glass surface (typically `background`). */
  tint: CssColor;
  /** Border color sitting on top of the blur. */
  border: CssColor;
  /** Inner highlight line. */
  highlight: CssColor;
  /** Subtle noise overlay (data URI or `none`). */
  noise: string;
  /** Soft inner reflection used on hero glass surfaces. */
  reflection: CssColor;
  /** Z-elevation multiplier (1.0 baseline). */
  elevation: number;
  /** Glass depth (combined shadow + highlight). */
  depth: string;
};

/* ────────────── Gradient ────────────── */

export type GradientTokens = {
  hero: string;
  cta: string;
  section: string;
  button: string;
  card: string;
  navbar: string;
  footer: string;
  overlay: string;
  /** Direction angle in degrees applied to derived gradients. */
  angle: number;
  /** Opacity applied to soft overlay gradients (0..1). */
  opacity: number;
};

/* ────────────── Motion ────────────── */

export type MotionTokens = {
  durationInstant: string;
  durationFast: string;
  durationBase: string;
  durationSlow: string;
  durationSlower: string;
  delayShort: string;
  delayBase: string;
  easeStandard: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  easeSpring: string;
  /** Hover transform tokens consumed by components. */
  hoverScale: string;
  hoverGlow: string;
  pressScale: string;
  /** Named transitions used by sections. */
  modal: string;
  toast: string;
  page: string;
  card: string;
  button: string;
  navigation: string;
  hero: string;
  analytics: string;
  chart: string;
};

/* ────────────── Typography ────────────── */

export type TypographyTokens = {
  fontFamily: string;
  fontFamilyMono: string;
  /** Sizes (line-height applied via the matching `lineHeight*` token). */
  display: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  bodyLarge: string;
  body: string;
  caption: string;
  small: string;
  button: string;
  label: string;
  /** Weights */
  weightRegular: string;
  weightMedium: string;
  weightSemibold: string;
  weightBold: string;
  weightExtrabold: string;
  /** Line-heights */
  lineHeightTight: string;
  lineHeightSnug: string;
  lineHeightNormal: string;
  lineHeightRelaxed: string;
  /** Letter-spacing */
  trackingTight: string;
  trackingNormal: string;
  trackingWide: string;
  trackingWider: string;
  /** Text transforms */
  caseNormal: string;
  caseUpper: string;
};

/* ────────────── The full token bag ────────────── */

export type ThemeTokens = {
  colors: ColorTokens;
  radius: RadiusTokens;
  spacing: SpacingTokens;
  shadow: ShadowTokens;
  glass: GlassTokens;
  gradient: GradientTokens;
  motion: MotionTokens;
  typography: TypographyTokens;
};

/** Subset that drives derivation — everything else is computed from this. */
export type ThemeBase = {
  primary: HexColor;
  secondary: HexColor;
  accent: HexColor;
  background: HexColor;
  foreground: HexColor;
  textSecondary: HexColor;
  textTertiary: HexColor;
  /** Optional state colors; defaults exist if omitted. */
  success?: HexColor;
  warning?: HexColor;
  danger?: HexColor;
  info?: HexColor;
};

/** Optional preset knobs that tweak derived tokens beyond colors. */
export type ThemeKnobs = {
  radiusBase?: string;
  glassOpacity?: number;
  glassBlur?: number;
  glassSaturation?: number;
  shadowOpacity?: number;
  shadowRadius?: number;
  gradientAngle?: number;
  gradientOpacity?: number;
  motionDuration?: number;
  hoverScale?: number;
  pressScale?: number;
  borderOpacity?: number;
  fontFamily?: string;
};

/** Public theme document — the JSONB payload persisted in `theme_settings.tokens`. */
export type ThemeDocument = {
  version: 1;
  presetId?: string;
  name?: string;
  base: ThemeBase;
  knobs: ThemeKnobs;
};
