//#region node_modules/.nitro/vite/services/ssr/assets/css-vars-C0sowH2S.js
var DEFAULT_KNOBS = {
	radiusBase: "0.75rem",
	glassOpacity: .08,
	glassBlur: 14,
	glassSaturation: 1.4,
	shadowOpacity: .18,
	shadowRadius: 28,
	gradientAngle: 135,
	gradientOpacity: 1,
	motionDuration: 220,
	hoverScale: 1.03,
	pressScale: .97,
	borderOpacity: .16,
	fontFamily: "\"Vazirmatn\", system-ui, sans-serif"
};
/** Default state colors when a preset omits them. */
var DEFAULT_STATE_COLORS = {
	success: "#16a34a",
	warning: "#f59e0b",
	danger: "#dc2626",
	info: "#2563eb"
};
/**
* Fallback base palette — derived from the existing DB defaults so the engine
* keeps the current look when no preset is selected and no `tokens` JSONB is
* stored yet. Coffee-house warm scheme matching `DEFAULT_THEME_SETTINGS`.
*/
var DEFAULT_BASE = {
	primary: "#9f1239",
	secondary: "#0f172a",
	accent: "#d4af37",
	background: "#0a0a0a",
	foreground: "#f0e6d3",
	textSecondary: "#9a8a78",
	textTertiary: "#c9b89e",
	success: DEFAULT_STATE_COLORS.success,
	warning: DEFAULT_STATE_COLORS.warning,
	danger: DEFAULT_STATE_COLORS.danger,
	info: DEFAULT_STATE_COLORS.info
};
function isRecord(v) {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}
/** Reads a `theme_settings` row and returns the canonical `ThemeDocument`. */
function themeRowToDocument(row) {
	const r = row ?? {};
	const baseFromColumns = {
		primary: r.primary_color ?? DEFAULT_BASE.primary,
		secondary: r.secondary_color ?? DEFAULT_BASE.secondary,
		accent: r.accent_color ?? DEFAULT_BASE.accent,
		background: r.background_color ?? DEFAULT_BASE.background,
		foreground: r.text_color ?? DEFAULT_BASE.foreground,
		textSecondary: r.text_secondary_color ?? DEFAULT_BASE.textSecondary,
		textTertiary: r.text_tertiary_color ?? DEFAULT_BASE.textTertiary
	};
	if (isRecord(r.tokens) && r.tokens.version === 1 && isRecord(r.tokens.base)) {
		const stored = r.tokens;
		return {
			version: 1,
			presetId: r.preset_id ?? stored.presetId,
			name: r.name ?? stored.name,
			base: {
				...stored.base,
				...baseFromColumns
			},
			knobs: {
				...DEFAULT_KNOBS,
				...stored.knobs
			}
		};
	}
	return {
		version: 1,
		presetId: r.preset_id ?? void 0,
		name: r.name ?? void 0,
		base: baseFromColumns,
		knobs: {
			...DEFAULT_KNOBS,
			radiusBase: r.border_radius ?? DEFAULT_KNOBS.radiusBase,
			glassOpacity: typeof r.glass_opacity === "number" ? r.glass_opacity : DEFAULT_KNOBS.glassOpacity
		}
	};
}
/** Builds the row patch (legacy columns + `tokens` JSONB) for a document. */
function applyDocumentToRow(doc) {
	return {
		primary_color: doc.base.primary,
		secondary_color: doc.base.secondary,
		accent_color: doc.base.accent,
		background_color: doc.base.background,
		text_color: doc.base.foreground,
		text_secondary_color: doc.base.textSecondary,
		text_tertiary_color: doc.base.textTertiary,
		border_radius: doc.knobs.radiusBase ?? DEFAULT_KNOBS.radiusBase,
		glass_opacity: doc.knobs.glassOpacity ?? DEFAULT_KNOBS.glassOpacity,
		tokens: doc,
		preset_id: doc.presetId ?? null,
		name: doc.name ?? null
	};
}
/** Light foreground on dark surfaces. */
var LIGHT_FG = "oklch(0.984 0.003 247.858)";
/** Dark foreground on light surfaces. */
var DARK_FG = "oklch(0.129 0.042 264.695)";
function parseHex(hex) {
	const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
	if (!m) return null;
	const int = parseInt(m[1], 16);
	return [
		int >> 16 & 255,
		int >> 8 & 255,
		int & 255
	];
}
function srgbToLinear(channel) {
	const c = channel / 255;
	return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
}
/** Converts a 6-digit hex to an `oklch(L C H)` string. */
function hexToOklch(hex) {
	const rgb = parseHex(hex);
	if (!rgb) return "oklch(0 0 0)";
	const [r, g, b] = rgb.map(srgbToLinear);
	const l = .4122214708 * r + .5363325363 * g + .0514459929 * b;
	const m = .2119034982 * r + .6806995451 * g + .1073969566 * b;
	const s = .0883024619 * r + .2817188376 * g + .6299787005 * b;
	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);
	const L = .2104542553 * l_ + .793617785 * m_ - .0040720468 * s_;
	const a = 1.9779984951 * l_ - 2.428592205 * m_ + .4505937099 * s_;
	const bOk = .0259040371 * l_ + .7827717662 * m_ - .808675766 * s_;
	const C = Math.sqrt(a * a + bOk * bOk);
	let H = Math.atan2(bOk, a) * 180 / Math.PI;
	if (H < 0) H += 360;
	if (C < 1e-4) return `oklch(${L.toFixed(4)} 0 0)`;
	return `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(3)})`;
}
/** Hex → linear RGB tuple in [0,1]. */
function hexToRgb(hex) {
	const rgb = parseHex(hex) ?? [
		0,
		0,
		0
	];
	return {
		r: rgb[0],
		g: rgb[1],
		b: rgb[2]
	};
}
/** Relative luminance (WCAG). */
function relativeLuminance(hex) {
	const rgb = parseHex(hex);
	if (!rgb) return 0;
	const [r, g, b] = rgb.map(srgbToLinear);
	return .2126 * r + .7152 * g + .0722 * b;
}
/** Picks a readable foreground oklch token for text/icons on top of `hex`. */
function contrastForeground(hex) {
	return relativeLuminance(hex) > .179 ? DARK_FG : LIGHT_FG;
}
/** Hex → `rgba(r, g, b, alpha)` for inline tints when needed. */
function hexToRgba(hex, alpha) {
	const { r, g, b } = hexToRgb(hex);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
/**
* Builds an oklch `color-mix` expression. Used everywhere derived tones are
* needed (hover/active, surface elevation, dividers, etc.) so consumers never
* hardcode lighter/darker shades.
*/
function mix(a, b, percent) {
	return `color-mix(in oklch, ${a} ${Math.max(0, Math.min(100, percent))}%, ${b})`;
}
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
function withKnobDefaults(knobs) {
	return {
		...DEFAULT_KNOBS,
		...knobs
	};
}
function deriveColors(base) {
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
		chartTooltip: mix(background, foreground, 92)
	};
}
function deriveRadius(knobs) {
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
		circle: "50%"
	};
}
function deriveSpacing() {
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
		px96: "6rem"
	};
}
function deriveShadow(base, knobs) {
	const op = knobs.shadowOpacity;
	const r = knobs.shadowRadius;
	const neutral = `rgba(0, 0, 0, ${op})`;
	const primaryShadow = hexToRgba(base.primary, Math.min(.6, op + .25));
	const accentShadow = hexToRgba(base.accent, Math.min(.6, op + .2));
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
		radius: r
	};
}
function deriveGlass(base, knobs) {
	const tintAlpha = Math.max(0, Math.min(1, knobs.glassOpacity));
	const borderAlpha = Math.max(0, Math.min(1, knobs.borderOpacity));
	return {
		blur: `${knobs.glassBlur}px`,
		saturation: `${knobs.glassSaturation}`,
		opacity: tintAlpha,
		tint: hexToRgba(base.foreground, tintAlpha),
		border: hexToRgba(base.foreground, borderAlpha),
		highlight: `rgba(255, 255, 255, ${Math.min(.2, tintAlpha + .06)})`,
		noise: "none",
		reflection: hexToRgba(base.primary, Math.min(.2, tintAlpha + .04)),
		elevation: 1,
		depth: `inset 0 1px 0 rgba(255, 255, 255, ${Math.min(.14, tintAlpha + .06)})`
	};
}
function deriveGradient(base, knobs) {
	const angle = `${knobs.gradientAngle}deg`;
	const op = knobs.gradientOpacity;
	const primary = hexToOklch(base.primary);
	const accent = hexToOklch(base.accent);
	const secondary = hexToOklch(base.secondary);
	const background = hexToOklch(base.background);
	const foreground = hexToOklch(base.foreground);
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
		opacity: op
	};
}
function deriveMotion(knobs) {
	const d = knobs.motionDuration;
	const ms = (x) => `${x}ms`;
	const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
	const easeIn = "cubic-bezier(0.4, 0, 1, 1)";
	const easeOut = "cubic-bezier(0, 0, 0.2, 1)";
	const easeInOut = "cubic-bezier(0.4, 0, 0.2, 1)";
	const spring = "cubic-bezier(0.34, 1.56, 0.64, 1)";
	return {
		durationInstant: ms(60),
		durationFast: ms(Math.round(d * .6)),
		durationBase: ms(d),
		durationSlow: ms(Math.round(d * 1.6)),
		durationSlower: ms(Math.round(d * 2.4)),
		delayShort: ms(Math.round(d * .3)),
		delayBase: ms(Math.round(d * .6)),
		easeStandard: ease,
		easeIn,
		easeOut,
		easeInOut,
		easeSpring: spring,
		hoverScale: String(knobs.hoverScale),
		hoverGlow: `0 0 ${knobs.shadowRadius * 1.6}px`,
		pressScale: String(knobs.pressScale),
		modal: `transform ${ms(d)} ${ease}, opacity ${ms(d)} ${easeOut}`,
		toast: `transform ${ms(Math.round(d * .8))} ${spring}, opacity ${ms(Math.round(d * .8))} ${easeOut}`,
		page: `opacity ${ms(d)} ${easeOut}, transform ${ms(d)} ${ease}`,
		card: `box-shadow ${ms(d)} ${easeOut}, transform ${ms(d)} ${ease}, border-color ${ms(d)} ${easeOut}`,
		button: `background-color ${ms(Math.round(d * .7))} ${easeOut}, transform ${ms(Math.round(d * .7))} ${spring}, box-shadow ${ms(d)} ${easeOut}`,
		navigation: `background-color ${ms(d)} ${easeOut}, color ${ms(d)} ${easeOut}`,
		hero: `transform ${ms(Math.round(d * 2.4))} ${ease}, opacity ${ms(Math.round(d * 2))} ${easeOut}`,
		analytics: `transform ${ms(d)} ${spring}, opacity ${ms(d)} ${easeOut}`,
		chart: `stroke-dashoffset ${ms(Math.round(d * 3))} ${easeInOut}`
	};
}
function deriveTypography(knobs) {
	return {
		fontFamily: knobs.fontFamily,
		fontFamilyMono: "\"JetBrains Mono\", ui-monospace, monospace",
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
		caseUpper: "uppercase"
	};
}
/** Derives the complete `ThemeTokens` bag from a `ThemeDocument`. */
function deriveTokens(doc) {
	const knobs = withKnobDefaults(doc.knobs);
	return {
		colors: deriveColors(doc.base),
		radius: deriveRadius(knobs),
		spacing: deriveSpacing(),
		shadow: deriveShadow(doc.base, knobs),
		glass: deriveGlass(doc.base, knobs),
		gradient: deriveGradient(doc.base, knobs),
		motion: deriveMotion(knobs),
		typography: deriveTypography(knobs)
	};
}
/** CSS scope used for the landing-page theme. Kept in sync with old constant. */
var LANDING_THEME_CLASS = "cms-theme";
function colorVars(t) {
	const c = t.colors;
	return {
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
		"--nama-chart-tooltip": c.chartTooltip
	};
}
function radiusVars(t) {
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
		"--nama-radius-circle": r.circle
	};
}
function spacingVars(t) {
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
		"--nama-space-96": s.px96
	};
}
function shadowVars(t) {
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
		"--nama-shadow-radius": `${s.radius}px`
	};
}
function glassVars(t) {
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
		"--glass-opacity": g.opacity
	};
}
function gradientVars(t) {
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
		"--nama-gradient-opacity": g.opacity
	};
}
function motionVars(t) {
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
		"--nama-transition-chart": m.chart
	};
}
function typographyVars(t) {
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
		"--nama-case-upper": ty.caseUpper
	};
}
/** Flattens `ThemeTokens` to the complete CSS custom-property map. */
function tokensToCssVars(t) {
	return {
		...colorVars(t),
		...radiusVars(t),
		...spacingVars(t),
		...shadowVars(t),
		...glassVars(t),
		...gradientVars(t),
		...motionVars(t),
		...typographyVars(t)
	};
}
/** Renders the var map as a single CSS rule under `scope`. */
function tokensToCss(t, scope = `.${LANDING_THEME_CLASS}`) {
	const vars = tokensToCssVars(t);
	return `${scope} {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`;
}
/**
* Applies vars imperatively to an element (used by the provider for instant
* propagation without recreating the `<style>` node). Pass `null` to clear.
*/
function applyTokensToElement(el, t) {
	if (!el) return;
	if (!t) return;
	const vars = tokensToCssVars(t);
	for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, String(v));
}
//#endregion
export { deriveTokens as a, applyTokensToElement as i, LANDING_THEME_CLASS as n, themeRowToDocument as o, applyDocumentToRow as r, tokensToCss as s, DEFAULT_KNOBS as t };
