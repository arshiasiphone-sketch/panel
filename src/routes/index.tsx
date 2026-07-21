import { createFileRoute } from "@tanstack/react-router";
import { useMemo, lazy, Suspense, useEffect, useRef } from "react";
// deploy-marker: force fresh asset hash for CDN cache flush (2026-07-20)
import { fetchThemeSettings, QK } from "@/lib/cms";
import {
  getPublicWorkspaceContent,
  type PublicWorkspaceContent,
} from "@/lib/public-content.functions";
import { PLATFORM_DOMAIN } from "@/lib/constants";
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

/**
 * Build the admin entry URL that is scoped to the *current* tenant/preview
 * rather than always pointing at the root platform admin.
 *
 * - `?preview_domain=<domain>` → carry it so /admin opens that workspace.
 * - Tenant subdomain (e.g. khane.nama.app) → relative `/admin` is already
 *   scoped to this host.
 * - Root platform domain with a resolved tenant domain → pass it as
 *   `preview_domain` so the right workspace loads.
 */
function buildAdminHref(resolvedDomain?: string | null): string {
  if (typeof window === "undefined") return "/admin";
  const preview = new URLSearchParams(window.location.search).get("preview_domain");
  if (preview) return `/admin?preview_domain=${encodeURIComponent(preview)}`;

  const host = window.location.hostname;
  const isTenantSubdomain = host.endsWith(PLATFORM_DOMAIN) && host.split(".").length >= 3;
  if (isTenantSubdomain) return "/admin";

  if (resolvedDomain) return `/admin?preview_domain=${encodeURIComponent(resolvedDomain)}`;
  return "/admin";
}

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
      { title: "کافه خانه — شخصیت کافه‌ای‌ات رو کشف کن [deploy:a5c8d24]" },
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
  const adminLinkRef = useRef<HTMLAnchorElement>(null);

  // Update admin link href dynamically after hydration to ensure
  // preview_domain parameter is correctly applied from URL
  useEffect(() => {
    if (adminLinkRef.current) {
      const href = buildAdminHref(content.domain);
      adminLinkRef.current.href = href;
    }
  }, [content.domain]);

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
          <a
            ref={adminLinkRef}
            href={buildAdminHref(content.domain)}
            className="text-xs hover:underline"
          >
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
      (
        content.blocks as Array<{
          id: string;
          type: string;
          data: Record<string, unknown>;
          visible: boolean;
          sort_order: number;
        }>
      )
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

// deploy marker: force Vercel rebuild after 500 fix (9e58b38)
