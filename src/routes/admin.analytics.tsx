import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/admin/admin-shell";
import { useAnalytics, getAverageDailyVisits, getTopPageDisplay } from "@/lib/analytics-hooks";
import {
  AnimatedStatCard,
  VisitsChart,
  TopPagesChart,
  DeviceDistributionChart,
} from "@/components/admin/analytics-charts";
import {
  TrendingUp,
  Clock,
  Globe,
  BarChart3,
  Smartphone,
  CalendarDays,
  Users,
  FileText,
  Laptop,
  Tablet,
} from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const { stats, topPages, deviceDistribution, visits7, visits30 } = useAnalytics();

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

  const todayTrend = useMemo(
    () => ({
      value: today - yesterday,
      label: "نسبت به دیروز",
      positive: today >= yesterday,
    }),
    [today, yesterday],
  );

  const deviceCounts = useMemo(() => {
    const result: Record<string, number> = {};
    deviceDistData?.forEach((d) => {
      result[d.device_type] = d.count;
    });
    return result;
  }, [deviceDistData]);

  const topPagesList = useMemo(() => topPagesData?.slice(0, 10) ?? [], [topPagesData]);

  return (
    <div>
      <PageHeader title="آمار بازدیدها" subtitle="تحلیل ترافیک سایت و رفتار کاربران" />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
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
          trend={todayTrend}
        />
        <AnimatedStatCard
          label="بازدیدهای دیروز"
          value={yesterday}
          hint="تاریخ گذشته"
          icon={<CalendarDays className="h-5 w-5" />}
          loading={stats.isLoading}
        />
        <AnimatedStatCard
          label="بازدیدکنندگان فعال"
          value={realtime}
          hint="۵ دقیقه اخیر"
          icon={<Users className="h-5 w-5" />}
          loading={stats.isLoading}
        />
        <AnimatedStatCard
          label="پر بازدیدترین"
          value={topPage}
          hint="صفحه"
          icon={<FileText className="h-5 w-5" />}
          loading={topPages.isLoading}
        />
        <AnimatedStatCard
          label="میانگین روزانه"
          value={avgDaily}
          hint="۳۰ روز اخیر"
          icon={<BarChart3 className="h-5 w-5" />}
          loading={stats.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <VisitsChart data={visits7Data ?? []} title="بازدیدهای ۷ روز اخیر" />
        <VisitsChart data={visits30Data ?? []} title="بازدیدهای ۳۰ روز اخیر" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <TopPagesChart data={topPagesData ?? []} />
        <DeviceDistributionChart data={deviceDistData ?? []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">پر بازدیدترین صفحات</h3>
          </div>
          {topPagesList.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              هنوز داده‌ای ثبت نشده.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
                    <th className="text-right pb-2 pr-2">ردیف</th>
                    <th className="text-right pb-2 pr-2">صفحه</th>
                    <th className="text-left pb-2 pr-2">بازدیدها</th>
                  </tr>
                </thead>
                <tbody>
                  {topPagesList.map((page, index) => (
                    <tr key={page.page_path} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-2 text-muted-foreground">{index + 1}</td>
                      <td className="py-2 pr-2 font-medium">
                        {page.page_path === "/" ? "صفحه اصلی" : page.page_path}
                      </td>
                      <td className="py-2 pr-2 text-left">
                        {page.visit_count.toLocaleString("fa-IR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">توزیع دستگاه‌ها</h3>
          </div>
          {deviceDistData && deviceDistData.length > 0 ? (
            <div className="space-y-3">
              <DeviceRow
                icon={<Laptop className="h-4 w-4" />}
                label="دسکتاپ"
                count={deviceCounts["desktop"] ?? 0}
                total={total}
              />
              <DeviceRow
                icon={<Smartphone className="h-4 w-4" />}
                label="موبایل"
                count={deviceCounts["mobile"] ?? 0}
                total={total}
              />
              <DeviceRow
                icon={<Tablet className="h-4 w-4" />}
                label="تبلت"
                count={deviceCounts["tablet"] ?? 0}
                total={total}
              />
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-8">
              هنوز داده‌ای ثبت نشده.
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-4">آمار کلی</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-muted/30">
              <div className="text-xs text-muted-foreground">نسبت بازدید امروز به دیروز</div>
              <div
                className="font-bold mt-1"
                style={{ color: todayTrend.positive ? "#22c55e" : "#ef4444" }}
              >
                {todayTrend.positive ? "+" : ""}
                {todayTrend.value.toLocaleString("fa-IR")} (
                {Math.abs((todayTrend.value / (yesterday || 1)) * 100).toFixed(1)}%)
              </div>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <div className="text-xs text-muted-foreground">سهم موبایل</div>
              <div className="font-bold mt-1">
                {deviceCounts["mobile"] ? ((deviceCounts["mobile"] / total) * 100).toFixed(1) : "0"}
                %
              </div>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <div className="text-xs text-muted-foreground">سهم دسکتاپ</div>
              <div className="font-bold mt-1">
                {deviceCounts["desktop"]
                  ? ((deviceCounts["desktop"] / total) * 100).toFixed(1)
                  : "0"}
                %
              </div>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <div className="text-xs text-muted-foreground">کل صفحه‌های ردیابی شده</div>
              <div className="font-bold mt-1">{topPagesList.length.toLocaleString("fa-IR")}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DeviceRow({
  icon,
  label,
  count,
  total,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground/50">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-xs">{percentage.toFixed(1)}%</span>
        <span className="font-bold">{count.toLocaleString("fa-IR")}</span>
      </div>
    </div>
  );
}
