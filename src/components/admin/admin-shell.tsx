import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import { Search, LayoutDashboard, FileText, Image as ImageIcon, Settings, Plus, Brain, ListChecks, Sparkles, LogOut, UtensilsCrossed, CalendarDays, Type, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { PhonePreview } from "./phone-preview";
import { SaveIndicator } from "./save-indicator";
import { CommandPalette } from "./command-palette";
import { useSiteContent } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";

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

export function AdminIcon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {d.split("|").map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card shadow-sm ${className}`}>{children}</div>;
}
export function PrimaryButton({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button {...p} className={`inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-3.5 py-2 text-sm font-medium hover:bg-foreground/90 transition disabled:opacity-50 ${p.className ?? ""}`}>{children}</button>;
}
export function GhostButton({ children, tone, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; tone?: string }) {
  const toneClass = tone === "danger" ? "text-rose-600 border-rose-200 hover:bg-rose-50" : tone === "success" ? "text-emerald-700 border-emerald-200 hover:bg-emerald-50" : "";
  return <button {...p} className={`inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium hover:bg-muted transition disabled:opacity-50 ${toneClass} ${p.className ?? ""}`}>{children}</button>;
}
export function Input(p: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 ${p.className ?? ""}`} />;
}
export function Textarea(p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 ${p.className ?? ""}`} />;
}
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <label className={`text-xs font-medium text-muted-foreground mb-1.5 block ${className}`}>{children}</label>;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { data: site } = useSiteContent();
  const title = ((site?.meta as { title?: string } | undefined)?.title) || "کافه خانه";

  if (!mounted) return <div dir="rtl" className="min-h-screen bg-muted/30" />;

  const hidePreview = ["/admin/media", "/admin/settings"].some(p => pathname.startsWith(p));
  const isActive = (to: string, exact?: boolean) => exact ? pathname === to : pathname.startsWith(to);

  async function signOut() {
    await supabase.auth.signOut();
    location.reload();
  }

  return (
    <div dir="rtl" className="min-h-screen bg-muted/30 text-foreground font-sans" style={{ fontFamily: '"Vazirmatn", system-ui, sans-serif' }}>
      <CommandPalette />
      <header className="sticky top-0 z-30 h-14 bg-background/85 backdrop-blur border-b border-border flex items-center px-4 gap-3">
        <button onClick={() => setMobileNav(true)} className="md:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-muted" aria-label="منو">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <Link to="/admin" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-foreground text-background grid place-items-center text-[11px] font-bold">ک</div>
          <span className="text-sm font-bold hidden sm:inline">{title}</span>
        </Link>
        <button onClick={() => { const e = new KeyboardEvent("keydown", { key: "k", ctrlKey: true }); document.dispatchEvent(e); }}
          className="flex-1 max-w-md mx-2 flex items-center gap-2 rounded-lg border border-border bg-muted/50 hover:bg-muted px-3 py-1.5 text-xs text-muted-foreground transition">
          <Search className="h-3.5 w-3.5" />
          <span>جستجو یا اجرای دستور...</span>
          <kbd className="ms-auto text-[10px] rounded border border-border bg-background px-1.5 py-0.5">Ctrl K</kbd>
        </button>
        <SaveIndicator />
        <button onClick={signOut} title="خروج" className="h-8 w-8 rounded-md grid place-items-center hover:bg-muted text-muted-foreground">
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      {mobileNav && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileNav(false)}>
          <div className="absolute inset-0 bg-foreground/40" />
          <aside className="absolute top-0 right-0 h-full w-72 bg-background border-l border-border p-3 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <NavList isActive={isActive} onPick={() => setMobileNav(false)} />
          </aside>
        </div>
      )}

      <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)_360px] gap-4 px-4 py-4">
        <aside className="hidden md:block">
          <nav className="sticky top-[72px] rounded-2xl border border-border bg-card p-2 space-y-0.5 max-h-[calc(100vh-88px)] overflow-y-auto">
            <NavList isActive={isActive} />
            <div className="mt-3 pt-3 border-t border-border">
              <button onClick={() => navigate({ to: "/admin/page" })} className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-2 text-xs font-semibold hover:bg-foreground/90">
                <Plus className="h-3.5 w-3.5" /> افزودن بلوک
              </button>
            </div>
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
        {!hidePreview && <aside className="hidden lg:block"><PhonePreview /></aside>}
      </div>
    </div>
  );
}

function NavList({ isActive, onPick }: { isActive: (to: string, exact?: boolean) => boolean; onPick?: () => void }) {
  return (
    <>
      {ADMIN_NAV.map(item => {
        const active = isActive(item.to, item.exact);
        return (
          <Link key={item.to} to={item.to} onClick={onPick}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${active ? "bg-foreground/[0.06] text-foreground font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <item.Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}
