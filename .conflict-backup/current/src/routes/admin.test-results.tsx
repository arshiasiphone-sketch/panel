import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/admin/admin-shell";
import { useTestResponses, useDeleteTestResponse, useClearTestResponses } from "@/lib/test-db";
import { type PersonalityType } from "@/lib/test-data";
import { useResolvedProfiles } from "@/lib/personality-store";
import { useMemo, useState } from "react";
import { Download, Search, Trash2, ChevronLeft, ChevronRight, User } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/admin/test-results")({ component: TestResultsPage });

const PAGE_SIZE = 10;

function TestResultsPage() {
  const { data: responses = [], isLoading, isError, error } = useTestResponses();
  const deleteOne = useDeleteTestResponse();
  const clearAll = useClearTestResponses();
  const profiles = useResolvedProfiles();
  const isMobile = useIsMobile();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PersonalityType | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return responses.filter((r) => {
      if (filter !== "all" && r.result !== filter) return false;
      if (!q) return true;
      const name = (r.userInfo?.fullName ?? "").toLowerCase();
      const phone = (r.userInfo?.phone ?? "").toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [responses, query, filter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function exportCsv() {
    const header = ["نام", "تلفن", "سن", "جنسیت", "نتیجه", "تاریخ"];
    const rows = filtered.map((r) => [
      r.userInfo?.fullName ?? "",
      r.userInfo?.phone ?? "",
      r.userInfo?.age?.toString() ?? "",
      r.userInfo?.gender ?? "",
      profiles[r.result].label,
      new Date(r.completedAt).toLocaleString("fa-IR"),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("خروجی CSV آماده شد");
  }

  if (isLoading) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div>
    );
  }
  if (isError) {
    return (
      <div className="text-center text-sm text-destructive py-10">
        {error instanceof Error ? error.message : "خطا در بارگذاری"}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="پاسخ‌های تست شخصیت"
        subtitle="جستجو، فیلتر، خروجی"
        actions={
          <div className="flex gap-2">
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 md:px-2.5 md:py-1.5 text-xs font-medium hover:bg-accent min-h-[44px]"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
            {responses.length > 0 && (
              <button
                disabled={clearAll.isPending}
                onClick={() => {
                  if (!confirm("حذف همه پاسخ‌ها؟")) return;
                  clearAll.mutate(undefined, {
                    onSuccess: () => toast.success("همه پاسخ‌ها پاک شد"),
                    onError: (e) => toast.error(e.message),
                  });
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 md:px-2.5 md:py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 min-h-[44px]"
              >
                <Trash2 className="h-3.5 w-3.5" /> پاکسازی
              </button>
            )}
          </div>
        }
      />

      {/* Search & Filter */}
      <Card className="mb-3 p-3">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="جستجو بر اساس نام یا تلفن..."
              className="w-full rounded-lg border border-border bg-background pr-9 pl-3 py-3 text-sm min-h-[44px]"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as PersonalityType | "all");
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background px-3 py-3 text-sm min-h-[44px]"
          >
            <option value="all">همه تیپ‌ها</option>
            {(["paparoch", "zhampin", "fofino", "gombak", "bedone"] as PersonalityType[]).map(
              (t) => (
                <option key={t} value={t}>
                  {profiles[t].label}
                </option>
              ),
            )}
          </select>
        </div>
      </Card>

      {/* Results: Cards on mobile, Table on desktop */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">
          پاسخی یافت نشد.
        </Card>
      ) : isMobile ? (
        <div className="flex flex-col gap-3">
          {slice.map((r) => {
            const p = profiles[r.result];
            return (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: p.color }}
                    >
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">
                        {r.userInfo?.fullName ?? "ناشناس"}
                      </div>
                      <div className="text-xs text-muted-foreground" dir="ltr">
                        {r.userInfo?.phone ?? "—"}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {new Date(r.completedAt).toLocaleString("fa-IR")}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background: p.bgColor,
                        color: p.color,
                        border: `1px solid ${p.borderColor}`,
                      }}
                    >
                      {p.label}
                    </span>
                    <div className="flex gap-1.5 text-muted-foreground text-xs">
                      <span>{r.userInfo?.age ?? "—"} سال</span>
                      <span>/</span>
                      <span>{r.userInfo?.gender ?? "—"}</span>
                    </div>
                    <button
                      disabled={deleteOne.isPending}
                      onClick={() =>
                        deleteOne.mutate(r.id, { onError: (e) => toast.error(e.message) })
                      }
                      className="text-destructive/70 hover:text-destructive p-2 disabled:opacity-50 min-h-[36px] min-w-[36px]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-right py-2.5 px-2 font-medium">نام</th>
                  <th className="text-right py-2.5 px-2 font-medium">تلفن</th>
                  <th className="text-right py-2.5 px-2 font-medium">سن</th>
                  <th className="text-right py-2.5 px-2 font-medium">جنسیت</th>
                  <th className="text-right py-2.5 px-2 font-medium">نتیجه</th>
                  <th className="text-right py-2.5 px-2 font-medium">تاریخ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {slice.map((r) => {
                  const p = profiles[r.result];
                  return (
                    <tr key={r.id} className="border-b border-border/40 hover:bg-accent/30">
                      <td className="py-2 px-2 font-medium">{r.userInfo?.fullName ?? "—"}</td>
                      <td className="py-2 px-2 text-muted-foreground" dir="ltr">
                        {r.userInfo?.phone ?? "—"}
                      </td>
                      <td className="py-2 px-2 text-muted-foreground">{r.userInfo?.age ?? "—"}</td>
                      <td className="py-2 px-2 text-muted-foreground">
                        {r.userInfo?.gender ?? "—"}
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold"
                          style={{
                            background: p.bgColor,
                            color: p.color,
                            border: `1px solid ${p.borderColor}`,
                          }}
                        >
                          {p.label}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">
                        {new Date(r.completedAt).toLocaleString("fa-IR")}
                      </td>
                      <td className="py-2 px-2 text-left">
                        <button
                          disabled={deleteOne.isPending}
                          onClick={() =>
                            deleteOne.mutate(r.id, { onError: (e) => toast.error(e.message) })
                          }
                          className="text-destructive/70 hover:text-destructive p-2 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
          <span>
            صفحه {safePage} از {pages} — {filtered.length} نتیجه
          </span>
          <div className="flex gap-2">
            <button
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}
              className="rounded-lg border border-border px-3 py-2 min-h-[44px] font-medium hover:bg-accent disabled:opacity-40 inline-flex items-center gap-1"
            >
              <ChevronRight className="h-3.5 w-3.5" /> قبلی
            </button>
            <button
              disabled={safePage === pages}
              onClick={() => setPage(safePage + 1)}
              className="rounded-lg border border-border px-3 py-2 min-h-[44px] font-medium hover:bg-accent disabled:opacity-40 inline-flex items-center gap-1"
            >
              بعدی <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
