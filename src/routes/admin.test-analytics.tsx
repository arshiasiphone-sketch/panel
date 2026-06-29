import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/admin/admin-shell";
import { useTestResponses } from "@/lib/test-db";
import { type PersonalityType } from "@/lib/test-data";
import { useResolvedProfiles } from "@/lib/personality-store";
import { Brain, TrendingUp, CheckCircle2, Users } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/test-analytics")({ component: TestAnalyticsPage });

function TestAnalyticsPage() {
  const { data: responses = [], isLoading, isError, error } = useTestResponses();
  const profiles = useResolvedProfiles();

  const stats = useMemo(() => {
    const total = responses.length;
    const dist: Record<string, number> = { paparoch: 0, zhampin: 0, fofino: 0, gombak: 0, bedone: 0 };
    for (const r of responses) dist[r.result] = (dist[r.result] ?? 0) + 1;
    const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
    const mostCommon = total > 0 ? (sorted[0][0] as PersonalityType) : null;
    const recent = responses.slice(0, 6);
    const completionRate = total > 0 ? 100 : 0;
    return { total, dist, mostCommon, recent, completionRate };
  }, [responses]);

  const max = Math.max(1, ...Object.values(stats.dist));

  if (isLoading) {
    return <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div>;
  }
  if (isError) {
    return <div className="text-center text-sm text-destructive py-10">{error instanceof Error ? error.message : "خطا"}</div>;
  }

  return (
    <div>
      <PageHeader title="آمار تست شخصیت" subtitle="مرور نتایج ذخیره‌شده در پایگاه داده" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Stat icon={<Users className="h-4 w-4" />} label="کل پاسخ‌ها" value={stats.total.toLocaleString("fa-IR")} />
        <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="نرخ تکمیل" value={`${stats.completionRate}٪`} />
        <Stat
          icon={<Brain className="h-4 w-4" />}
          label="پرتکرارترین تیپ"
          value={stats.mostCommon ? profiles[stats.mostCommon].label : "—"}
        />
        <Stat icon={<TrendingUp className="h-4 w-4" />} label="هفت روز گذشته" value={responses.filter(r => Date.now() - new Date(r.completedAt).getTime() < 7 * 86400000).length.toLocaleString("fa-IR")} />
      </div>

      <Card className="mb-4">
        <h3 className="text-sm font-semibold mb-3">توزیع تیپ‌های شخصیتی</h3>
        <div className="flex flex-col gap-2.5">
          {(["paparoch", "zhampin", "fofino", "gombak", "bedone"] as PersonalityType[]).map((t) => {
            const p = profiles[t];
            const v = stats.dist[t] ?? 0;
            const pct = Math.round((v / max) * 100);
            return (
              <div key={t} className="flex items-center gap-3 text-xs">
                <span className="w-20 font-semibold" style={{ color: p.color }}>{p.label}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: p.color }} />
                </div>
                <span className="w-12 text-left text-muted-foreground">{v}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold mb-3">نتایج اخیر</h3>
        {stats.recent.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-10">هنوز پاسخی ثبت نشده.</div>
        ) : (
          <ul className="divide-y divide-border">
            {stats.recent.map((r) => {
              const p = profiles[r.result];
              return (
                <li key={r.id} className="py-2.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="font-medium">{r.userInfo?.fullName ?? "ناشناس"}</span>
                    <span className="text-xs text-muted-foreground">— {p.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(r.completedAt).toLocaleDateString("fa-IR")}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">{icon}{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
