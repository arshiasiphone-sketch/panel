import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import {
  Search,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Settings,
  Plus,
  Brain,
  ListChecks,
  Sparkles,
  LogOut,
  UtensilsCrossed,
  CalendarDays,
  Type,
  BarChart3,
  GripHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PhonePreview } from "./phone-preview";
import { SaveIndicator } from "./save-indicator";
import { CommandPalette } from "./command-palette";
import { useSiteContent } from "@/lib/cms";
import { useRepositories } from "@/lib/providers";


export const ADMIN_NAV = [
  { to: "/admin", label: "داشبورد", Icon: LayoutDashboard, exact: true },
  { to: "/admin/page", label: "سازنده صفحه", Icon: FileText },
  { to: "/admin/site-content", label: "محتوای سایت", Icon: Type },
  { to: "/admin/menu", label: "منو", Icon: UtensilsCrossed },
  { to: "/admin/gallery", label: "گالری", Icon: ImageIcon },
  { to: "/admin/events", label: "رویدادها", Icon: CalendarDays },
  { to: "/admin/media", label: "کتابخانه رسانه", Icon: ImageIcon },
  { to: "/admin/test-analytics", label: "آمار تست شخصیت", Icon: Brain },
  { to: "/admin/test-results", label: "پاسخ‌های تست", Icon: BarChart3 },
  { to: "/admin/test-questions", label: "سوالات تست", Icon: ListChecks },
  { to: "/admin/personality-types", label: "تیپ‌های شخصیتی", Icon: Sparkles },
  { to: "/admin/analytics", label: "آمار محتوا", Icon: BarChart3 },
  { to: "/admin/settings", label: "تنظیمات و تم", Icon: Settings },
];

/** Primary nav items shown in the bottom bar on mobile (top 5) */
const MOBILE_PRIMARY_NAV = ADMIN_NAV.slice(0, 5);

export function AdminIcon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d.split("|").map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-4 md:mb-5 flex items-end justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <h1 className="text-lg md:text-xl font-bold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...p}
      className={`inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 md:px-3.5 md:py-2 text-sm font-medium hover:bg-foreground/90 transition disabled:opacity-50 min-h-[44px] ${p.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  tone,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; tone?: string }) {
  const toneClass =
    tone === "danger"
      ? "text-rose-600 border-rose-200 hover:bg-rose-50"
      : tone === "success"
        ? "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
        : "";
  return (
    <button
      {...p}
      className={`inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 md:px-3.5 md:py-2 text-sm font-medium hover:bg-muted transition disabled:opacity-50 min-h-[44px] ${toneClass} ${p.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Input(p: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...p}
      className={`w-full rounded-lg border border-border bg-background px-3.5 py-3 md:px-3 md:py-2 text-sm outline-none focus:border-foreground/40 transition min-h-[44px] ${p.className ?? ""}`}
    />
  );
}

export function Textarea(p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...p}
      className={`w-full rounded-lg border border-border bg-background px-3.5 py-3 md:px-3 md:py-2 text-sm outline-none focus:border-foreground/40 transition ${p.className ?? ""}`}
    />
  );
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <label className={`text-xs font-medium text-muted-foreground mb-1.5 block ${className}`}>
      {children}
    </label>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Carry the active ?preview_domain across every admin section so multi-tenant
  // previews stay scoped to the same workspace while navigating the CMS.
  const previewDomain = useRouterState({
    select: (s) => new URLSearchParams(s.location.search).get("preview_domain") ?? undefined,
  });
  const previewSearch = previewDomain ? { preview_domain: previewDomain } : undefined;
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { data: site } = useSiteContent();
  const title = (site?.meta as { title?: string } | undefined)?.title || "کافه خانه";

  if (!mounted) return <div dir="rtl" className="min-h-screen bg-muted/30" />;

  const hidePreview = ["/admin/media", "/admin/settings"].some((p) => pathname.startsWith(p));
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  const repos = useRepositories();

  async function signOut() {
    await repos.auth.signOut();
    location.reload();
  }

  const showMobilePrimary = pathname.startsWith("/admin");

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-muted/30 text-foreground font-sans pb-16 md:pb-0"
      style={{
        fontFamily: '"Vazirmatn", system-ui, sans-serif',
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <CommandPalette />

      {/* ─── Sticky Top Header ─── */}
      <header className="sticky top-0 z-30 h-12 md:h-14 bg-background/85 backdrop-blur border-b border-border flex items-center px-3 md:px-4 gap-2 md:gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileNav(true)}
          className="md:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-muted active:bg-muted/70 touch-manipulation"
          aria-label="منوی اصلی"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <Link to="/admin" search={previewSearch} className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 md:h-7 md:w-7 rounded-lg bg-foreground text-background grid place-items-center text-xs md:text-[11px] font-bold">
            ک
          </div>
          <span className="text-sm font-bold hidden sm:inline">{title}</span>
        </Link>

        {/* Search trigger */}
        <button
          onClick={() => {
            const e = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
            document.dispatchEvent(e);
          }}
          className="flex-1 max-w-xs md:max-w-md mx-1 md:mx-2 flex items-center gap-2 rounded-lg border border-border bg-muted/50 hover:bg-muted px-3 py-2 md:py-1.5 text-xs text-muted-foreground transition min-h-[36px]"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden md:inline">جستجو یا اجرای دستور...</span>
          <span className="md:hidden">جستجو...</span>
          <kbd className="ms-auto hidden md:inline text-[10px] rounded border border-border bg-background px-1.5 py-0.5">
            Ctrl K
          </kbd>
        </button>

        <SaveIndicator />

        <button
          onClick={signOut}
          title="خروج"
          className="h-10 w-10 md:h-8 md:w-8 rounded-md grid place-items-center hover:bg-muted text-muted-foreground active:bg-muted/70 touch-manipulation"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      {/* ─── Mobile Navigation Drawer (Bottom Sheet) ─── */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileNav(false)}>
          <div className="absolute inset-0 bg-foreground/40" />
          <aside
            className="absolute bottom-0 right-0 left-0 max-h-[85vh] rounded-t-2xl bg-background border-t border-border overflow-y-auto pb-4"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="sticky top-0 bg-background pt-3 pb-1 flex justify-center">
              <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="px-3 pt-2">
              <NavList isActive={isActive} previewSearch={previewSearch} onPick={() => setMobileNav(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* ─── Main Grid ─── */}
      <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)_360px] gap-4 px-3 md:px-4 py-3 md:py-4">
        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <nav className="sticky top-[68px] rounded-2xl border border-border bg-card p-2 space-y-0.5 max-h-[calc(100vh-80px)] overflow-y-auto">
            <NavList isActive={isActive} previewSearch={previewSearch} />
            <div className="mt-3 pt-3 border-t border-border">
              <button
                onClick={() => navigate({ to: "/admin/page", search: previewSearch })}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-2.5 text-xs font-semibold hover:bg-foreground/90 min-h-[44px]"
              >
                <Plus className="h-3.5 w-3.5" /> افزودن بلوک
              </button>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 pb-2">{children}</main>

        {!hidePreview && (
          <aside className="hidden lg:block">
            <PhonePreview />
          </aside>
        )}
      </div>

      {/* ─── Mobile Bottom Navigation ─── */}
      {showMobilePrimary && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-background/90 backdrop-blur-lg border-t border-border flex items-center justify-around px-1"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {MOBILE_PRIMARY_NAV.map((item) => {
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                search={previewSearch}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-0 flex-1 rounded-lg transition ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground/70 hover:text-muted-foreground"
                }`}
              >
                <item.Icon
                  className={`h-5 w-5 ${active ? "drop-shadow-sm" : ""}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span
                  className={`text-[10px] leading-tight truncate max-w-full ${
                    active ? "font-semibold" : ""
                  }`}
                >
                  {item.label.slice(0, 8)}
                </span>
                {active && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-foreground" />
                )}
              </Link>
            );
          })}

          {/* More button - opens side drawer */}
          <button
            onClick={() => setMobileNav(true)}
            className="flex flex-col items-center gap-0.5 py-1.5 px-2 text-muted-foreground/70 hover:text-muted-foreground transition"
            aria-label="بیشتر"
          >
            <GripHorizontal className="h-5 w-5" />
            <span className="text-[10px] leading-tight">بیشتر</span>
          </button>
        </nav>
      )}

      {/* ─── FAB for page builder ─── */}
      {pathname === "/admin/page" && (
        <Link
          to="/admin/page"
          search={previewSearch}
          onClick={() => {
            // Dispatch custom event to open block picker
            window.dispatchEvent(new CustomEvent("open-block-picker"));
          }}
          className="fixed bottom-20 right-4 md:hidden z-20 h-14 w-14 rounded-full bg-foreground text-background shadow-lg grid place-items-center hover:bg-foreground/90 active:scale-95 transition touch-manipulation"
          style={{ bottom: "calc(4rem + env(safe-area-inset-bottom, 0px))" }}
          aria-label="افزودن بلوک جدید"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}

function NavList({
  isActive,
  previewSearch,
  onPick,
}: {
  isActive: (to: string, exact?: boolean) => boolean;
  previewSearch?: { preview_domain?: string };
  onPick?: () => void;
}) {
  return (
    <>
      {ADMIN_NAV.map((item) => {
        const active = isActive(item.to, item.exact);
        return (
          <Link
            key={item.to}
            to={item.to}
            search={previewSearch}
            onClick={onPick}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 md:py-2 text-sm transition min-h-[44px] ${
              active
                ? "bg-foreground/[0.06] text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl md:text-2xl font-bold mt-1">{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}
