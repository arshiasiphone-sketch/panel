import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import { Card } from "@/components/admin/admin-shell";

const CHART_COLORS = {
  primary: "#d4af37",
  primaryLight: "rgba(212, 175, 55, 0.15)",
  secondary: "#0f172a",
  grid: "rgba(255,255,255,0.05)",
  text: "#c9b89e",
  tooltipBg: "rgba(15, 23, 42, 0.95)",
  tooltipBorder: "rgba(212, 175, 55, 0.3)",
  bars: ["#d4af37", "#e8c56d", "#f0d59e", "#f8e8cf", "#9a8a78", "#c9b89e", "#7d705a"],
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div
        className="rounded-lg border"
        style={{
          backgroundColor: CHART_COLORS.tooltipBg,
          borderColor: CHART_COLORS.tooltipBorder,
          padding: "8px 12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <p className="text-xs text-muted-foreground">{label}</p>
        {payload?.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toLocaleString("fa-IR")}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function CurrencyLabel({ value }: { value: number }) {
  return <span className="text-xs text-muted-foreground">{value.toLocaleString("fa-IR")}</span>;
}

export function VisitsChart({
  data,
  title,
  className = "",
}: {
  data: Array<{ date: string; visits: number }>;
  title: string;
  className?: string;
}) {
  const chartData = useMemo(() => {
    if (!data?.length) return [];
    return data.map((d) => ({
      date: new Date(d.date).toLocaleDateString("fa-IR", { month: "short", day: "numeric" }),
      visits: d.visits,
    }));
  }, [data]);

  if (!chartData?.length) {
    return (
      <Card className={`${className} p-6 min-h-[280px]`}>
        <div className="text-sm font-semibold mb-4">{title}</div>
        <div className="flex items-center justify-center h-[220px] text-muted-foreground">
          هیچ داده‌ای موجود نیست
        </div>
      </Card>
    );
  }

  const maxVisits = Math.max(...(chartData?.map((d) => d.visits) ?? [1]), 1);
  const tickCount = Math.min(chartData.length, 7);

  return (
    <Card className={`${className} p-4 min-h-[320px]`}>
      <div className="text-sm font-semibold mb-4">{title}</div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="visits-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: CHART_COLORS.text, fontSize: 11, fontFamily: "Vazirmatn" }}
              axisLine={{ stroke: CHART_COLORS.grid }}
              tickCount={tickCount}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: CHART_COLORS.text, fontSize: 11, fontFamily: "Vazirmatn" }}
              axisLine={false}
              tickFormatter={(v) => v.toLocaleString("fa-IR")}
              tickCount={4}
              domain={[0, Math.max(maxVisits * 1.2, 5)]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="visits"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#visits-gradient)"
              dot={false}
              activeDot={{ r: 5, fill: CHART_COLORS.primary, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function TopPagesChart({
  data,
  className = "",
}: {
  data: Array<{ page_path: string; visit_count: number }>;
  className?: string;
}) {
  const chartData = useMemo(() => {
    if (!data?.length) return [];
    return data
      .slice(0, 8)
      .map((d, i) => ({
        name:
          d.page_path === "/"
            ? "صفحه اصلی"
            : d.page_path.length > 20
              ? d.page_path.slice(0, 20) + "…"
              : d.page_path,
        fullName: d.page_path,
        visits: d.visit_count,
        color: CHART_COLORS.bars[i % CHART_COLORS.bars.length],
      }))
      .reverse();
  }, [data]);

  if (!chartData?.length) {
    return (
      <Card className={`${className} p-6 min-h-[280px]`}>
        <div className="text-sm font-semibold mb-4">پر بازدیدترین صفحات</div>
        <div className="flex items-center justify-center h-[220px] text-muted-foreground">
          هیچ داده‌ای موجود نیست
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${className} p-4 min-h-[320px]`}>
      <div className="text-sm font-semibold mb-4">پر بازدیدترین صفحات</div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: CHART_COLORS.text, fontSize: 11, fontFamily: "Vazirmatn" }}
              axisLine={false}
              tickFormatter={(v) => v.toLocaleString("fa-IR")}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fill: CHART_COLORS.text, fontSize: 11, fontFamily: "Vazirmatn" }}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="visits" radius={[0, 4, 4, 0]}>
              {chartData?.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function DeviceDistributionChart({
  data,
  className = "",
}: {
  data: Array<{ device_type: string; count: number }>;
  className?: string;
}) {
  const chartData = useMemo(() => {
    if (!data?.length) return [];
    const total = data.reduce((sum, d) => sum + d.count, 0);
    return data.map((d) => ({
      name: d.device_type === "mobile" ? "موبایل" : d.device_type === "tablet" ? "تبلت" : "دسکتاپ",
      value: d.count,
      percentage: ((d.count / total) * 100).toFixed(1),
    }));
  }, [data]);

  if (!chartData?.length) {
    return (
      <Card className={`${className} p-6 min-h-[280px]`}>
        <div className="text-sm font-semibold mb-4">توزیع دستگاه‌ها</div>
        <div className="flex items-center justify-center h-[220px] text-muted-foreground">
          هیچ داده‌ای موجود نیست
        </div>
      </Card>
    );
  }

  const COLORS = ["#d4af37", "#9a8a78", "#c9b89e"];

  return (
    <Card className={`${className} p-4 min-h-[320px]`}>
      <div className="text-sm font-semibold mb-4">توزیع دستگاه‌ها</div>
      <div className="h-[240px] flex items-center justify-center">
        <ResponsiveContainer width="200" height="200">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percentage }) => `${name} ${percentage}%`}
              labelLine={false}
              stroke={CHART_COLORS.secondary}
              strokeWidth={2}
            >
              {chartData?.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-muted-foreground">
        {chartData?.map((d, i) => (
          <div key={d?.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span>
              {d?.name} {d?.percentage}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string; positive?: boolean };
  loading?: boolean;
}

export function AnimatedStatCard({ label, value, hint, icon, trend, loading }: StatCardProps) {
  const displayValue = loading ? (
    <div className="text-2xl font-bold animate-pulse bg-muted h-8 w-24 rounded" />
  ) : typeof value === "number" ? (
    value != null && <CountUp value={value} />
  ) : (
    <span className="text-2xl font-bold">{value ?? "—"}</span>
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-border/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground truncate">{label}</div>
          <div className="mt-1">{displayValue}</div>
          {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
          {trend && (
            <div
              className="mt-2 flex items-center gap-1.5 text-xs"
              style={{ color: trend.positive ? "#22c55e" : "#ef4444" }}
            >
              <span className="font-medium">
                {trend.value >= 0 ? "+" : ""}
                {trend.value.toLocaleString("fa-IR")}
              </span>
              <span>{trend.label}</span>
            </div>
          )}
        </div>
        {icon && <div className="text-muted-foreground/50 shrink-0">{icon}</div>}
      </div>
    </div>
  );
}

function CountUp({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    if (value === prevValueRef.current) return;
    prevValueRef.current = value;

    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * eased);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration, displayValue]);

  return (
    <span className="text-2xl font-bold tabular-nums">{displayValue.toLocaleString("fa-IR")}</span>
  );
}
