import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSiteContent, useUpsertSiteContent } from "@/lib/cms";
import { triggerSave } from "@/lib/admin-store";
import { PageHeader, Card, PrimaryButton, Input, Textarea, Label } from "@/components/admin/admin-shell";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/site-content")({ component: SiteContentAdmin });

type Hero = { title: string; subtitle: string; badge: string; cta_text: string };
type Contact = { address: string; phone: string; hours: string };
type Social = { instagram: string; instagram_handle: string };

function SiteContentAdmin() {
  const { data: site, isLoading } = useSiteContent();
  const upsert = useUpsertSiteContent();
  if (isLoading) return <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div>;

  const hero = { title: "", subtitle: "", badge: "", cta_text: "", ...(site?.hero as Partial<Hero> | undefined) };
  const contact = { address: "", phone: "", hours: "", ...(site?.contact as Partial<Contact> | undefined) };
  const social = { instagram: "", instagram_handle: "", ...(site?.social as Partial<Social> | undefined) };

  function update(key: "hero" | "contact" | "social", value: Record<string, unknown>) {
    triggerSave();
    upsert.mutate({ key, value }, { onError: (e) => toast.error(e.message) });
  }

  return (
    <div>
      <PageHeader title="محتوای سایت" subtitle="متن‌های ثابت صفحه اصلی، اطلاعات تماس و شبکه‌های اجتماعی" />

      <Card className="p-4 mb-3">
        <h3 className="text-sm font-bold mb-3">بخش هیرو (Hero)</h3>
        <div className="grid gap-3">
          <div><Label>برچسب بالا</Label><Input value={hero.badge} onChange={e => update("hero", { ...hero, badge: e.target.value })} /></div>
          <div><Label>عنوان (هر خط در سطر جدید)</Label><Textarea rows={3} value={hero.title} onChange={e => update("hero", { ...hero, title: e.target.value })} /></div>
          <div><Label>زیرعنوان</Label><Textarea rows={3} value={hero.subtitle} onChange={e => update("hero", { ...hero, subtitle: e.target.value })} /></div>
          <div><Label>متن دکمه</Label><Input value={hero.cta_text} onChange={e => update("hero", { ...hero, cta_text: e.target.value })} /></div>
        </div>
      </Card>

      <Card className="p-4 mb-3">
        <h3 className="text-sm font-bold mb-3">اطلاعات تماس</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Label>آدرس</Label><Textarea rows={2} value={contact.address} onChange={e => update("contact", { ...contact, address: e.target.value })} /></div>
          <div><Label>تلفن</Label><Input dir="ltr" value={contact.phone} onChange={e => update("contact", { ...contact, phone: e.target.value })} /></div>
          <div><Label>ساعات کاری</Label><Input value={contact.hours} onChange={e => update("contact", { ...contact, hours: e.target.value })} /></div>
        </div>
      </Card>

      <Card className="p-4 mb-3">
        <h3 className="text-sm font-bold mb-3">شبکه‌های اجتماعی</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>اینستاگرام (لینک)</Label><Input dir="ltr" value={social.instagram} onChange={e => update("social", { ...social, instagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
          <div><Label>آیدی اینستاگرام</Label><Input dir="ltr" value={social.instagram_handle} onChange={e => update("social", { ...social, instagram_handle: e.target.value })} /></div>
        </div>
      </Card>

      <PrimaryButton onClick={() => toast.info("تغییرات با ویرایش هر فیلد خودکار ذخیره می‌شوند")} disabled><Save className="h-4 w-4" /> ذخیره خودکار</PrimaryButton>
    </div>
  );
}
