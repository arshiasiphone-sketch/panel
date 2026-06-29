import type { ReactNode } from "react";
import OrbBackground from "@/components/ui/orb-background";
import { useTheme } from "@/lib/cms";
import { LandingThemeProvider } from "@/lib/theme-provider";

type TestPageShellProps = {
  children: ReactNode;
  className?: string;
  particleCount?: number;
  /** Override orb primary (e.g. personality color on result page). */
  orbPrimary?: string;
  orbSecondary?: string;
};

export function TestPageShell({
  children,
  className = "",
  particleCount = 50,
  orbPrimary,
  orbSecondary,
}: TestPageShellProps) {
  const { data: theme } = useTheme();
  const primary = orbPrimary ?? theme?.primary_color ?? "#9f1239";
  const secondary = orbSecondary ?? theme?.accent_color ?? theme?.secondary_color ?? "#d4af37";

  return (
    <LandingThemeProvider>
      <main
        dir="rtl"
        className={`relative min-h-screen overflow-hidden bg-background text-foreground ${className}`}
        style={{ fontFamily: "Vazirmatn, system-ui, sans-serif" }}
      >
        <OrbBackground primaryColor={primary} secondaryColor={secondary} particleCount={particleCount} />
        {children}
      </main>
    </LandingThemeProvider>
  );
}
