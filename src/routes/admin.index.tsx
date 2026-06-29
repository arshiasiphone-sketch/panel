import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/admin/admin-shell";
import { useAllMenuItems, usePageBlocks, useAllEvents, useAllGalleryImages } from "@/lib/cms";
import { useTestResponses } from "@/lib/test-db";
import { useAnalytics, getAverageDailyVisits, getTopPageDisplay } from "@/lib/analytics-hooks";
import {
  AnimatedStatCard,
  VisitsChart,
  TopPagesChart,
  DeviceDistributionChart,
} from "@/components/admin/analytics-charts";
import {
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Clock,
  Globe,
  BarChart3,
  Smartphone,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { data: menu = [] } = useAllMenuItems();
  const { data: blocks = [] } = usePageBlocks();
  const { data: events = [] } = useAllEvents();
  const { data: gallery = [] } = useAllGalleryImages();
  const { data: testResponses = [] } = useTestResponses();

  const { stats, topPages, deviceDistribution, visits7, visits30 } = useAnalytics();
  const recentTests = testResponses.slice(0, 5);

  const statsData = stats.data;
  const topPagesData = topPages.data;
  const deviceDistData = deviceDistribution.data;
  const visits7Data = visits7.data;
  const visits30Data = visits30.data;

  const total = statsData?.total ?? 0;
  const today = statsData?.today ?? 0;
  const yesterday = statsData?.yesterday ?? 0;
  const realtime = statsData?.realtime ?? 0;
  const topPage = getTopPageDisplay(topPagesData);
  const avgDaily = getAverageDailyVisits(total, 30);

  return (
    <div>
      <PageHeader title="داشبورد" subtitle="نمای کلی از محتوای سایت و تست شخصیت" />

      {/* Analytics Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <AnimatedStatCard
          label="کل بازدیدها"
          value={total}
          hint="از ابتدای ردیابی"
          icon={<TrendingUp className="h-5 w-5" />}
          loading={stats.isLoading}
        />
        <AnimatedStatCard
          label="بازدیدهای امروز"
          value={today}
          hint="۲۴ ساعت اخیر"
          icon={<Clock className="h-5 w-5" />}
          loading={stats.isLoading}
          trend={{ value: today - yesterday, label: "نسبت به دیروز", positive: today >= yesterday }}
        />
        <AnimatedStatCard
          label="بازدیدهای دیروز"
          value={yesterday}
          hint="تاریخ گذشته"
          icon={<BarChart3 className="h-5 w-5" />}
          loading={stats.isLoading}
        />
        <AnimatedStatCard
          label="بازدیدکنندگان فعال"
          value={realtime}
          hint="۵ دقیقه اخیر"
          icon={<Globe className="h-5 w-5" />}
          loading={stats.isLoading}
        />
        <AnimatedStatCard
          label="پر بازدیدترین"
          value={topPage}
          hint="صفحه"
          icon={<Smartphone className="h-5 w-5" />}
          loading={topPages.isLoading}
        />
        <AnimatedStatCard
          label="میانگین روزانه"
          value={avgDaily}
          hint="۳۰ روز اخیر"
          icon={<TrendingUp className="h-5 w-5" />}
          loading={stats.isLoading}
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <VisitsChart
          data={visits7Data ?? []}
          title="بازدیدهای ۷ روز اخیر"
          className="xl:col-span-2"
        />
        <VisitsChart
          data={visits30Data ?? []}
          title="بازدیدهای ۳۰ روز اخیر"
          className="xl:col-span-2"
        />
        <TopPagesChart data={topPagesData ?? []} className="xl:col-span-2" />
        <DeviceDistributionChart data={deviceDistData ?? []} className="xl:col-span-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-sm font-semibold">محتوای منتشرشده</div>
              <div className="text-xs text-muted-foreground">داده‌های واقعی از پایگاه داده</div>
            </div>
            <Link
              to="/admin/page"
              className="text-xs text-foreground/70 hover:text-foreground inline-flex items-center gap-1"
            >
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
            <QuickLink to="/admin/analytics" label="آمار بازدیدها" />
          </ul>
        </Card>
      </div>

      <Card className="p-4 mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">پاسخ‌های اخیر تست</div>
          <Link
            to="/admin/test-results"
            className="text-xs text-foreground/70 hover:text-foreground"
          >
            همه
          </Link>
        </div>
        {recentTests.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">هنوز پاسخی ثبت نشده.</div>
        ) : (
          <ul className="space-y-2">
            {recentTests.map((r) => (
              <li key={r.id} className="flex items-start gap-2.5 text-xs">
                <div className="h-7 w-7 rounded-full bg-muted grid place-items-center shrink-0">
                  <Sparkles className="h-3 w-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground">
                    {r.userInfo?.fullName ?? "ناشناس"}
                  </div>
                  <div className="text-muted-foreground text-[10px]" dir="ltr">
                    {new Date(r.completedAt).toLocaleString()}
                  </div>
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
    <Link
      to={to}
      className="rounded-xl border border-border bg-muted/30 p-3 hover:bg-muted/50 transition"
    >
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-xl font-bold mt-1">{value.toLocaleString("fa-IR")}</div>
    </Link>
  );
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link to={to} className="text-foreground/80 hover:text-foreground hover:underline">
        {label}
      </Link>
    </li>
  );
}
