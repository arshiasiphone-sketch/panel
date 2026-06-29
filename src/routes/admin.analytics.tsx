import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, Stat } from "@/components/admin/admin-shell";
import { UnavailableFeature } from "@/components/admin/session-only-banner";
import { useAllMenuItems, usePageBlocks, useEvents, useAllGalleryImages, useTestimonials } from "@/lib/cms";
import { useTestResponses } from "@/lib/test-db";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const { data: menu = [] } = useAllMenuItems();
  const { data: blocks = [] } = usePageBlocks();
  const { data: events = [] } = useEvents();
  const { data: gallery = [] } = useAllGalleryImages();
  const { data: testimonials = [] } = useTestimonials();
  const { data: testResponses = [] } = useTestResponses();

  return (
    <div>
      <PageHeader title="آمار" subtitle="معیارهای محتوا و تست شخصیت" />

      <UnavailableFeature
        title="آمار ترافیک در دسترس نیست"
        detail="ردیابی بازدیدکنندگان، کلیک‌ها و منابع ترافیک به سرویس آنالیتیکس خارجی نیاز دارد و هنوز پیکربندی نشده است."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 mb-4">
        <Stat label="بلوک‌های صفحه" value={blocks.length} />
        <Stat label="آیتم منو" value={menu.length} />
        <Stat label="تصاویر گالری" value={gallery.length} />
        <Stat label="پاسخ تست" value={testResponses.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="text-sm font-semibold mb-3">محتوای سایت</div>
          <ul className="space-y-2 text-sm">
            <Row label="بلوک‌های فعال" value={blocks.filter((b) => b.visible).length} />
            <Row label="رویدادهای فعال" value={events.filter((e) => e.visible).length} />
            <Row label="نظرات فعال" value={testimonials.length} />
            <Row label="آیتم‌های منوی فعال" value={menu.filter((m) => m.visible).length} />
          </ul>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-semibold mb-3">تست شخصیت</div>
          {testResponses.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">هنوز پاسخی ثبت نشده.</div>
          ) : (
            <ul className="space-y-2 text-sm">
              <Row label="کل پاسخ‌ها" value={testResponses.length} />
              <Row
                label="۷ روز اخیر"
                value={testResponses.filter((r) => Date.now() - new Date(r.completedAt).getTime() < 7 * 86400000).length}
              />
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center justify-between py-1 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value.toLocaleString("fa-IR")}</span>
    </li>
  );
}
