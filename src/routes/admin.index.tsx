import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Stat, Card } from "@/components/admin/admin-shell";
import { useAllMenuItems, usePageBlocks, useAllEvents, useAllGalleryImages, usePageViewStats } from "@/lib/cms";
import { useTestResponses } from "@/lib/test-db";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { data: menu = [] } = useAllMenuItems();
  const { data: blocks = [] } = usePageBlocks();
  const { data: events = [] } = useAllEvents();
  const { data: gallery = [] } = useAllGalleryImages();
  const { data: testResponses = [] } = useTestResponses();
  const { data: views, isLoading: viewsLoading, isError: viewsError } = usePageViewStats();
  const recentTests = testResponses.slice(0, 5);

  const totalVisits = viewsLoading ? "…" : viewsError ? "—" : (views?.total ?? 0).toLocaleString("fa-IR");
  const todayVisits = viewsLoading ? "…" : viewsError ? "—" : (views?.today ?? 0).toLocaleString("fa-IR");
  const viewsHint = viewsError ? "خطا در بارگذاری" : undefined;

  return (
    <div>
      <PageHeader title="داشبورد" subtitle="نمای کلی از محتوای سایت و تست شخصیت" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="بلوک‌های صفحه" value={blocks.length} hint={`${blocks.filter((b) => b.visible).length} فعال`} />
        <Stat label="آیتم منو" value={menu.length} hint={`${menu.filter((m) => m.visible).length} نمایش داده می‌شود`} />
        <Stat label="رویدادها" value={events.length} />
        <Stat label="پاسخ تست" value={testResponses.length} hint="پایگاه داده" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Stat label="کل بازدیدهای سایت" value={totalVisits} hint={viewsHint} />
        <Stat label="بازدیدهای امروز" value={todayVisits} hint={viewsHint} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-sm font-semibold">محتوای منتشرشده</div>
              <div className="text-xs text-muted-foreground">داده‌های واقعی از پایگاه داده</div>
            </div>
            <Link to="/admin/page" className="text-xs text-foreground/70 hover:text-foreground inline-flex items-center gap-1">
              سازنده صفحه <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <MiniStat label="گالری" value={gallery.length} to="/admin/gallery" />
            <MiniStat label="منو" value={menu.length} to="/admin/menu" />
            <MiniStat label="رویداد" value={events.length} to="/admin/events" />
            <MiniStat label="بلوک" value={blocks.length} to="/admin/page" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-semibold mb-3">دسترسی سریع</div>
          <ul className="space-y-2 text-sm">
            <QuickLink to="/admin/page" label="ویرایش صفحه اصلی" />
            <QuickLink to="/admin/site-content" label="محتوای سایت" />
            <QuickLink to="/admin/personality-types" label="تیپ‌های شخصیتی" />
            <QuickLink to="/admin/settings" label="تنظیمات و تم" />
          </ul>
        </Card>
      </div>

      <Card className="p-4 mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">پاسخ‌های اخیر تست</div>
          <Link to="/admin/test-results" className="text-xs text-foreground/70 hover:text-foreground">همه</Link>
        </div>
        {recentTests.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">هنوز پاسخی ثبت نشده.</div>
        ) : (
          <ul className="space-y-2">
            {recentTests.map((r) => (
              <li key={r.id} className="flex items-start gap-2.5 text-xs">
                <div className="h-7 w-7 rounded-full bg-muted grid place-items-center shrink-0"><Sparkles className="h-3 w-3" /></div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground">{r.userInfo?.fullName ?? "ناشناس"}</div>
                  <div className="text-muted-foreground text-[10px]" dir="ltr">{new Date(r.completedAt).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function MiniStat({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to} className="rounded-xl border border-border bg-muted/30 p-3 hover:bg-muted/50 transition">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-xl font-bold mt-1">{value.toLocaleString("fa-IR")}</div>
    </Link>
  );
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link to={to} className="text-foreground/80 hover:text-foreground hover:underline">{label}</Link>
    </li>
  );
}
