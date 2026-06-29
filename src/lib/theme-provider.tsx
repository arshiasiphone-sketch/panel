import { useMemo, type ReactNode } from "react";
import { useTheme, useRealtimeCmsSync } from "@/lib/cms";
import { LANDING_THEME_CLASS, themeSettingsToCss } from "@/lib/theme-tokens";

const THEME_STYLE_ID = "cms-landing-theme";

/** Keeps CMS realtime invalidation active app-wide (admin + landing). */
export function CmsSyncProvider({ children }: { children: ReactNode }) {
  useRealtimeCmsSync();
  return <>{children}</>;
}

/**
 * Applies database-driven theme only inside the landing page wrapper.
 * Admin and other routes keep the static design-system tokens from styles.css.
 */
export function LandingThemeProvider({ children }: { children: ReactNode }) {
  const { data: theme } = useTheme();
  const css = useMemo(() => (theme ? themeSettingsToCss(theme) : null), [theme]);

  return (
    <div className={LANDING_THEME_CLASS}>
      {css ? (
        <style id={THEME_STYLE_ID} dangerouslySetInnerHTML={{ __html: css }} />
      ) : null}
      {children}
    </div>
  );
}
