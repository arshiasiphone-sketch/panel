/**
 * ThemeLivePreview — real-time preview of the NAMA theme engine output.
 *
 * Takes the current theme row, derives all tokens via the engine, and renders
 * a self-contained preview card with sample UI elements that reflect every
 * token category (colors, radius, shadows, glass, gradients, typography).
 *
 * The preview updates automatically whenever `useTheme()` returns fresh data
 * (after any preset apply or manual color field edit).
 */
import { memo, useEffect, useMemo, useRef } from "react";
import { Monitor, Moon, Sun, Type, Square, Circle } from "lucide-react";
import { useTheme } from "@/lib/cms";
import { themeRowToDocument } from "@/lib/theme/bridge";
import { deriveTokens } from "@/lib/theme/derive";
import { applyTokensToElement, LANDING_THEME_CLASS, tokensToCssVars } from "@/lib/theme/css-vars";
import type {
  ThemeTokens,
  ColorTokens,
  RadiusTokens,
  ShadowTokens,
  GlassTokens,
} from "@/lib/theme/types";

/* ───────── Tailwind-style utility classes (static, unaffected by theme) ───────── */

const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");

const labelCls = "text-[11px] text-muted-foreground font-medium mb-2 block";
const sectionCls = "rounded-xl border border-border/50 p-3";
const sectionTitleCls =
  "text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mb-2.5";

/* ───────── Swatch atom ───────── */

function Swatch({ label, cssVar, color }: { label: string; cssVar: string; color: string }) {
  return (
    <div className="flex items-center gap-2" title={`${cssVar}: ${color}`}>
      <span
        className="h-5 w-5 rounded-md shrink-0 ring-1 ring-black/5"
        style={{ background: color }}
      />
      <span className="text-[11px] text-muted-foreground truncate font-mono">{label}</span>
    </div>
  );
}

function SwatchGrid({ title, colorEntries }: { title: string; colorEntries: [string, string][] }) {
  return (
    <div>
      <h4 className={sectionTitleCls}>{title}</h4>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {colorEntries.map(([label, color]) => (
          <Swatch key={label} label={label} cssVar={`--nama-${label}`} color={color} />
        ))}
      </div>
    </div>
  );
}

/* ───────── Sample UI components (theme-affected) ───────── */

function SampleButton({ variant = "primary" }: { variant: "primary" | "secondary" | "accent" }) {
  const map = {
    primary: "bg-[var(--nama-primary)] text-[var(--nama-primary-fg)]",
    secondary: "bg-[var(--nama-secondary)] text-[var(--nama-secondary-fg)]",
    accent: "bg-[var(--nama-accent)] text-[var(--nama-accent-fg)]",
  };
  return (
    <button
      className={cx(
        "rounded-[var(--nama-radius-md)] px-3.5 py-1.5 text-xs font-semibold",
        "shadow-[var(--nama-shadow-sm)] hover:shadow-[var(--nama-shadow-md)]",
        "transition-all duration-[var(--nama-motion-fast)]",
        map[variant],
      )}
    >
      {variant === "primary" ? "دکمه اصلی" : variant === "secondary" ? "دکمه ثانویه" : "دکمه تاکید"}
    </button>
  );
}

function SampleCard() {
  return (
    <div
      className="rounded-[var(--nama-radius-lg)] p-3 shadow-[var(--nama-shadow-sm)]"
      style={{
        background: "var(--nama-card)",
        color: "var(--nama-card-fg)",
        border: "1px solid var(--nama-border)",
      }}
    >
      <div
        className="h-2 w-16 rounded-[var(--nama-radius-sm)] mb-2"
        style={{ background: "var(--nama-muted)" }}
      />
      <div
        className="h-2 w-24 rounded-[var(--nama-radius-sm)] mb-1"
        style={{ background: "var(--nama-muted)" }}
      />
      <div
        className="h-2 w-20 rounded-[var(--nama-radius-sm)]"
        style={{ background: "var(--nama-muted)" }}
      />
    </div>
  );
}

function SampleGlass() {
  return (
    <div
      className="rounded-[var(--nama-radius-lg)] p-3"
      style={{
        background: "var(--nama-glass-tint)",
        backdropFilter: `blur(var(--nama-glass-blur)) saturate(var(--nama-glass-saturation))`,
        WebkitBackdropFilter: `blur(var(--nama-glass-blur)) saturate(var(--nama-glass-saturation))`,
        border: "1px solid var(--nama-glass-border)",
        boxShadow: "var(--nama-glass-depth)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-full" style={{ background: "var(--nama-primary)" }} />
        <div className="flex-1">
          <div
            className="h-2 w-14 rounded-[var(--nama-radius-sm)]"
            style={{ background: "var(--nama-foreground)" }}
          />
          <div
            className="h-1.5 w-20 rounded-[var(--nama-radius-sm)] mt-1"
            style={{ background: "var(--nama-muted)" }}
          />
        </div>
      </div>
    </div>
  );
}

function SampleGradient() {
  return (
    <div
      className="rounded-[var(--nama-radius-lg)] h-12 flex items-center justify-center"
      style={{ background: "var(--nama-gradient-button)" }}
    >
      <span className="text-[11px] font-bold" style={{ color: "var(--nama-accent-fg)" }}>
        گرادینت برند
      </span>
    </div>
  );
}

/* ───────── Collapsible token group ───────── */

function TokenSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="cursor-pointer text-[11px] font-semibold text-foreground/70 hover:text-foreground py-1.5 select-none">
        {title}
        <span className="mr-1 text-muted-foreground/40 group-open:rotate-90 inline-block transition-transform">
          ▶
        </span>
      </summary>
      <div className="pt-1.5 space-y-3">{children}</div>
    </details>
  );
}

/* ───────── Main component ───────── */

export const ThemeLivePreview = memo(function ThemeLivePreview() {
  const { data: theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const tokens = useMemo(() => {
    if (!theme) return null;
    const doc = themeRowToDocument(theme);
    return deriveTokens(doc);
  }, [theme]);

  // Apply derived CSS vars to the wrapper element so children can reference them.
  useEffect(() => {
    if (!tokens) return;
    const raf = requestAnimationFrame(() => {
      applyTokensToElement(wrapperRef.current, tokens);
    });
    return () => cancelAnimationFrame(raf);
  }, [tokens]);

  if (!theme || !tokens) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 mb-3">
        <p className="text-sm text-muted-foreground">در حال بارگذاری پیش‌نمایش...</p>
      </div>
    );
  }

  const c = tokens.colors;
  const r = tokens.radius;
  const colorEntries: [string, string][] = [
    ["primary", c.primary],
    ["primary-hover", c.primaryHover],
    ["primary-fg", c.primaryForeground],
    ["secondary", c.secondary],
    ["accent", c.accent],
    ["background", c.background],
    ["surface", c.surface],
    ["foreground", c.foreground],
    ["muted", c.muted],
    ["muted-fg", c.mutedForeground],
    ["text-secondary", c.textSecondary],
    ["text-tertiary", c.textTertiary],
    ["border", c.border],
    ["card", c.card],
    ["card-fg", c.cardForeground],
    ["success", c.success],
    ["warning", c.warning],
    ["danger", c.danger],
    ["info", c.info],
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-3">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div>
          <h2 className="text-sm font-semibold">پیش‌نمایش زنده تم</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            تمام توکن‌های مشتق شده از تنظیمات فعلی
          </p>
        </div>
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/50">
          NAMA Engine v1
        </span>
      </div>

      {/* Scoped preview */}
      <div ref={wrapperRef} className={LANDING_THEME_CLASS}>
        <div
          className="mx-5 mb-4 rounded-2xl overflow-hidden border border-border/60"
          style={{ background: "var(--nama-background)", color: "var(--nama-foreground)" }}
        >
          {/* Phone-style mockup */}
          <div className="relative">
            {/* Status bar */}
            <div
              className="flex items-center justify-between px-4 py-2 text-[10px]"
              style={{ color: "var(--nama-text-secondary)" }}
            >
              <span>۱۲:۳۰</span>
              <div className="flex items-center gap-1">
                <Monitor className="h-3 w-3" />
                <Moon className="h-3 w-3" />
                <Sun className="h-3 w-3" />
              </div>
            </div>

            {/* Hero area */}
            <div className="px-4 pb-3">
              {/* Avatar */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "var(--nama-primary)", color: "var(--nama-primary-fg)" }}
                >
                  ک
                </span>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--nama-foreground)" }}>
                    کافه خانه
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--nama-text-secondary)" }}>
                    طعم‌های بی‌نهایت
                  </div>
                </div>
              </div>

              {/* Gradient CTA */}
              <div
                className="rounded-[var(--nama-radius-lg)] p-3 text-center mb-3"
                style={{ background: "var(--nama-gradient-cta)" }}
              >
                <span className="text-sm font-bold" style={{ color: "var(--nama-primary-fg)" }}>
                  منوی امروز
                </span>
              </div>

              {/* Sample blocks */}
              <div className="space-y-2">
                <div
                  className="rounded-[var(--nama-radius-md)] p-2.5 flex items-center justify-between"
                  style={{
                    background: "var(--nama-surface)",
                    border: "1px solid var(--nama-border)",
                  }}
                >
                  <span className="text-xs" style={{ color: "var(--nama-foreground)" }}>
                    اسپرسو
                  </span>
                  <span className="text-xs font-bold" style={{ color: "var(--nama-primary)" }}>
                    ۸۵۰۰۰
                  </span>
                </div>
                <div
                  className="rounded-[var(--nama-radius-md)] p-2.5 flex items-center justify-between"
                  style={{
                    background: "var(--nama-surface)",
                    border: "1px solid var(--nama-border)",
                  }}
                >
                  <span className="text-xs" style={{ color: "var(--nama-foreground)" }}>
                    کاپوچینو
                  </span>
                  <span className="text-xs font-bold" style={{ color: "var(--nama-primary)" }}>
                    ۱۲۰۰۰۰
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color swatches */}
        <div className="px-5 pb-4 space-y-3">
          <TokenSection title="🔵  رنگ‌ها (Colors)" defaultOpen>
            <SwatchGrid title="Brand" colorEntries={colorEntries.slice(0, 3)} />
            <SwatchGrid title="Surfaces" colorEntries={colorEntries.slice(3, 10)} />
            <SwatchGrid title="Text" colorEntries={colorEntries.slice(10, 13)} />
            <SwatchGrid title="Borders & States" colorEntries={colorEntries.slice(13)} />
          </TokenSection>

          <TokenSection title="🎨  نمونه اجزاء (Sample UI)">
            <div className="space-y-3">
              <div>
                <h4 className={sectionTitleCls}>Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  <SampleButton variant="primary" />
                  <SampleButton variant="secondary" />
                  <SampleButton variant="accent" />
                </div>
              </div>
              <div>
                <h4 className={sectionTitleCls}>Card</h4>
                <SampleCard />
              </div>
              <div>
                <h4 className={sectionTitleCls}>Glass</h4>
                <SampleGlass />
              </div>
              <div>
                <h4 className={sectionTitleCls}>Gradient</h4>
                <SampleGradient />
              </div>
            </div>
          </TokenSection>

          <TokenSection title="📐  ابعاد (Radius)">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["xs", r.xs],
                  ["sm", r.sm],
                  ["md", r.md],
                  ["lg", r.lg],
                  ["xl", r.xl],
                  ["full", r.full],
                ] as const
              ).map(([label, val]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span
                    className="h-6 w-6 border border-border/50"
                    style={{ borderRadius: val as string }}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </TokenSection>

          <TokenSection title="✨  Glass & Shadow">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className={sectionTitleCls}>Glass</h4>
                <div className="space-y-1 text-[10px] font-mono text-muted-foreground">
                  <div>blur: {tokens.glass.blur}</div>
                  <div>opacity: {tokens.glass.opacity}</div>
                  <div>saturation: {tokens.glass.saturation}</div>
                </div>
              </div>
              <div>
                <h4 className={sectionTitleCls}>Shadow</h4>
                <div className="space-y-1 text-[10px] font-mono text-muted-foreground">
                  <div>opacity: {tokens.shadow.opacity}</div>
                  <div>radius: {tokens.shadow.radius}px</div>
                </div>
              </div>
            </div>
          </TokenSection>
        </div>
      </div>
    </div>
  );
});
