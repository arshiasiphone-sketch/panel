import { createFileRoute } from "@tanstack/react-router";
import { useMemo, lazy, Suspense } from "react";
import {
  fetchThemeSettings,
  QK,
} from "@/lib/cms";
import { getPublicWorkspaceContent, type PublicWorkspaceContent } from "@/lib/public-content.functions";
import type { LandingCtx as LandingCtxType } from "@/components/landing/landing-sections";
import { LandingThemeProvider } from "@/lib/theme-provider";

const OrbBackground = lazy(() => import("@/components/ui/orb-background"));
const LandingBlockRender = lazy(() =>
  import("@/components/landing/landing-sections").then((m) => ({ default: m.LandingBlockRender })),
);

const OrbFallback = () => (
  <div className="absolute inset-0 -z-10 bg-background" aria-hidden="true" />
);

const BlockFallback = () => <div className="w-full h-48 animate-pulse rounded-lg bg-muted/20" />;

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    // Theme is a global singleton — keep its existing loader (anon-readable).
    const theme = await queryClient.ensureQueryData({
      queryKey: QK.theme,
      queryFn: fetchThemeSettings,
    });

    // Tenant content is resolved + read on the server (service_role) so we can
    // later revoke anon SELECT. The bundle is dehydrated into the route and
    // rehydrated on the client — no anon client reads on the landing page.
    const content = (await getPublicWorkspaceContent({
      data: { workspaceId: undefined, domain: undefined },
    })) as PublicWorkspaceContent;

    return { theme, content };
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
  const { theme, content } = Route.useLoaderData();

  return (
    <LandingThemeProvider loaderTheme={theme}>
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
          <LazyPageSections content={content} />
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

function LazyPageSections({ content }: { content: PublicWorkspaceContent }) {
  const menu = content.menu as LandingCtxType["menu"];
  const gallery = content.gallery as LandingCtxType["gallery"];
  const events = content.events as LandingCtxType["events"];
  const testimonials = content.testimonials as LandingCtxType["testimonials"];
  const site = content.site;

  const ctx: LandingCtxType = useMemo(
    () => ({ menu, gallery, events, testimonials, site }),
    [menu, gallery, events, testimonials, site],
  );

  const ordered = useMemo(
    () =>
      (content.blocks as Array<{ id: string; type: string; data: Record<string, unknown>; visible: boolean; sort_order: number }>)
        .filter((b) => b.visible)
        .sort((a, b) => a.sort_order - b.sort_order),
    [content.blocks],
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
