// Font Optimization: Only load essential weights with font-display: swap
import "@fontsource/estedad/400.css";
import "@fontsource/estedad/700.css";
import "@fontsource/lalezar/400.css";

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, memo, useState, useEffect } from "react";
import {
  useMenuItems,
  useGalleryImages,
  useEvents,
  useTestimonials,
  useSiteContent,
  usePageBlocks,
  useTheme,
  fetchThemeSettings,
  QK,
} from "@/lib/cms";
import { useTrackVisit } from "@/lib/analytics-hooks";
import { LandingBlockRender, type LandingCtx } from "@/components/landing/landing-sections";
import { LandingThemeProvider } from "@/lib/theme-provider";
import OrbBackground from "@/components/ui/orb-background";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({ queryKey: QK.theme, queryFn: fetchThemeSettings });
  },
  head: () => ({
    meta: [
      { title: "کافه خانه — شخصیت کافه‌ای‌ات رو کشف کن" },
      {
        name: "description",
        content: "تجربه‌ای فراتر از قهوه. ۱۱ سوال کوتاه و یک نتیجه‌ی منحصربه‌فرد.",
      },
    ],
  }),
  component: LandingPage,
});

const LandingPage = memo(function LandingPage() {
  // Track if we're on the client to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);
  
  // Track page visit - called at component level (valid hook usage)
  useTrackVisit("/");
  
  // Only set isClient after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use memoized data to ensure consistency between server and client renders
  const { data: theme } = useTheme();
  const { data: menu = [] } = useMenuItems();
  const { data: gallery = [] } = useGalleryImages();
  const { data: events = [] } = useEvents();
  const { data: testimonials = [] } = useTestimonials();
  const { data: site } = useSiteContent();
  const { data: blocks = [] } = usePageBlocks();

  const ctx: LandingCtx = useMemo(
    () => ({ menu, gallery, events, testimonials, site }),
    [menu, gallery, events, testimonials, site],
  );

  const ordered = useMemo(
    () => blocks.filter((b) => b.visible).sort((a, b) => a.sort_order - b.sort_order),
    [blocks],
  );

  return (
    <LandingThemeProvider>
      {/* ✅ FIXED: <main> tag with consistent props, no hydration issues */}
      <main
        dir="rtl"
        className="landing-root relative min-h-screen overflow-hidden bg-background text-foreground"
        suppressHydrationWarning={true}
      >
        {/* Static CSS classes to ensure consistent styling */}
        <style>{`
          .landing-root { font-family: "Estedad", system-ui, sans-serif; font-weight: 700; }
          .landing-root h1, .landing-root h2, .landing-root h3,
          .landing-root h4, .landing-root h5, .landing-root h6 {
            font-family: "Lalezar", "Estedad", system-ui, sans-serif;
            font-weight: 400;
          }
        `}</style>
        
        {/* Only render OrbBackground on client to prevent hydration mismatch */}
        {isClient && (
          <OrbBackground
            primaryColor={theme?.primary_color ?? "#9f1239"}
            secondaryColor={theme?.accent_color ?? theme?.secondary_color ?? "#d4af37"}
            particleCount={70}
          />
        )}

        {ordered.map((b) => {
          const settings: Record<string, unknown> =
            b.data && typeof b.data === "object" && !Array.isArray(b.data)
              ? (b.data as Record<string, unknown>)
              : {};
          return (
            <ErrorBoundary key={b.id} fallback={null}>
              <LandingBlockRender type={b.type} settings={settings} ctx={ctx} />
            </ErrorBoundary>
          );
        })}

        <footer className="relative px-5 py-10 text-center text-muted-foreground">
          <a href="/admin" className="text-xs hover:underline">
            ورود به پنل مدیریت
          </a>
        </footer>
      </main>
    </LandingThemeProvider>
  );
});
