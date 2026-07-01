import { createFileRoute } from "@tanstack/react-router";
import { useMemo, lazy, Suspense } from "react";
import {
  useMenuItems,
  useGalleryImages,
  useEvents,
  useTestimonials,
  useSiteContent,
  usePageBlocks,
  useRecordPageView,
  useTheme,
  fetchThemeSettings,
  QK,
} from "@/lib/cms";
import type { LandingCtx } from "@/components/landing/landing-sections";
import { LandingThemeProvider } from "@/lib/theme-provider";

const OrbBackground = lazy(() => import("@/components/ui/orb-background"));
const LandingBlockRender = lazy(() =>
  import("@/components/landing/landing-sections").then((m) => ({ default: m.LandingBlockRender })),
);

const OrbFallback = () => (
  <div className="absolute inset-0 -z-10 bg-background" aria-hidden="true" />
);

const BlockFallback = () => (
  <div className="w-full h-48 animate-pulse rounded-lg bg-muted/20" />
);

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

function LandingPage() {
  useRecordPageView();
  const { data: theme } = useTheme();

  return (
    <LandingThemeProvider>
      <main
        dir="rtl"
        className="relative min-h-screen overflow-hidden bg-background text-foreground"
        style={{ fontFamily: "Vazirmatn, system-ui, sans-serif" }}
      >
        <Suspense fallback={<OrbFallback />}>
          <OrbBackground
            primaryColor={theme?.primary_color ?? "#9f1239"}
            secondaryColor={theme?.accent_color ?? theme?.secondary_color ?? "#d4af37"}
            particleCount={70}
          />
        </Suspense>

        <Suspense fallback={<BlockFallback />}>
          <LazyPageSections />
        </Suspense>

        <footer className="relative px-5 py-10 text-center text-muted-foreground">
          <a href="/admin" className="text-xs hover:underline">
            ورود به پنل مدیریت
          </a>
        </footer>
      </main>
    </LandingThemeProvider>
  );
}

function LazyPageSections() {
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
    <>
      {ordered.map((b) => (
        <LandingBlockRender
          key={b.id}
          type={b.type}
          settings={(b.data as Record<string, unknown>) ?? {}}
          ctx={ctx}
        />
      ))}
    </>
  );
}
