import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CmsSyncProvider } from "../lib/theme-provider";
import { setupOfflineAnalyticsSync } from "../lib/analytics";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "کافه خانه — شخصیت کافه‌ای‌ات رو کشف کن" },
      { name: "description", content: "تجربه‌ای فراتر از قهوه. ۱۱ سوال کوتاه و یک نتیجه‌ی منحصربه‌فرد. خانه دوم شما، یک فنجان آرامش." },
      // OpenGraph / Social
      { property: "og:type", content: "website" },
      { property: "og:title", content: "کافه خانه — شخصیت کافه‌ای‌ات رو کشف کن" },
      { property: "og:description", content: "تجربه‌ای فراتر از قهوه. ۱۱ سوال کوتاه و یک نتیجه‌ی منحصربه‌فرد. خانه دوم شما، یک فنجان آرامش." },
      { property: "og:locale", content: "fa_IR" },
      { property: "og:site_name", content: "کافه خانه" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "کافه خانه — شخصیت کافه‌ای‌ات رو کشف کن" },
      { name: "twitter:description", content: "تجربه‌ای فراتر از قهوه. ۱۱ سوال کوتاه و یک نتیجه‌ی منحصربه‌فرد." },
      // Theme color
      { name: "theme-color", content: "#9f1239" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      // Robots
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
    ],
    links: [
      // Preconnect to critical third-parties
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Preconnect to Supabase
      { rel: "preconnect", href: "https://api.supabase.com" },
      { rel: "preconnect", href: "https://*.supabase.co" },
      // Preload primary font (Estedad - used for main content)
      { rel: "preload", href: "https://fonts.googleapis.com/css2?family=Estedad:wght@400;700&display=swap", as: "style" },
      // Preload Lalezar font for headings
      { rel: "preload", href: "https://fonts.googleapis.com/css2?family=Lalezar:wght@400&display=swap", as: "style" },
      // Load main CSS (preload + normal load for better prioritization)
      { rel: "preload", href: appCss, as: "style" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const cleanup = setupOfflineAnalyticsSync();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CmsSyncProvider>
        <Outlet />
        <Toaster richColors position="top-center" />
      </CmsSyncProvider>
    </QueryClientProvider>
  );
}
