import { memo, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useTheme, useRealtimeCmsSync } from "@/lib/cms";
import { themeRowToDocument } from "@/lib/theme/bridge";
import { deriveTokens } from "@/lib/theme/derive";
import { LANDING_THEME_CLASS, applyTokensToElement, tokensToCss } from "@/lib/theme/css-vars";

const THEME_STYLE_ID = "cms-landing-theme";

/** Keeps CMS realtime invalidation active app-wide (admin + landing). */
export const CmsSyncProvider = memo(function CmsSyncProvider({
  children,
}: {
  children: ReactNode;
}) {
  useRealtimeCmsSync();
  return <>{children}</>;
});

/**
 * Applies the NAMA Theme Engine output inside the landing wrapper.
 *
 * Two paths run in parallel:
 *   1. The `<style>` tag carries the canonical CSS rule (works during SSR /
 *      initial render before React hydration).
 *   2. After hydration, the same vars are also set imperatively on the wrapper
 *      element. This makes preset / token changes propagate WITHOUT recreating
 *      the `<style>` node — eliminating any flicker on live preview.
 *
 * Admin routes intentionally keep the static design-system tokens from
 * `styles.css` — this provider only wraps the landing route.
 */
export const LandingThemeProvider = memo(function LandingThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: row } = useTheme();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const tokens = useMemo(() => {
    if (!row) return null;
    const doc = themeRowToDocument(row);
    return deriveTokens(doc);
  }, [row]);

  const css = useMemo(() => (tokens ? tokensToCss(tokens) : null), [tokens]);

  // Imperative apply — runs in animation frame to coalesce with paint.
  useEffect(() => {
    if (!tokens) return;
    let raf = 0;
    raf = requestAnimationFrame(() => {
      applyTokensToElement(wrapperRef.current, tokens);
    });
    return () => cancelAnimationFrame(raf);
  }, [tokens]);

  return (
    <div ref={wrapperRef} className={LANDING_THEME_CLASS}>
      {css ? <style id={THEME_STYLE_ID} dangerouslySetInnerHTML={{ __html: css }} /> : null}
      {children}
    </div>
  );
});
