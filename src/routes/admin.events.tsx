import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useAllEvents, useUpsertEvent, useDeleteEvent, type EventItem } from "@/lib/cms";
import { eventSchema } from "@/lib/cms-schemas";
import { triggerSave } from "@/lib/admin-store";
import { PageHeader, Card, PrimaryButton, GhostButton, Input, Textarea, Label } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/admin/events")({ component: EventsAdmin });

type Draft = Partial<EventItem>;
const blank = (): Draft => ({ title: "", description: "", date_label: "", image_url: "", visible: true, sort_order: 0 });

function EventsAdmin() {
  const { data: items = [], isLoading } = useAllEvents();
  const upsert = useUpsertEvent();
  const remove = useDeleteEvent();
  const [editing, setEditing] = useState<Draft | null>(null);

  function save() {
    if (!editing) return;
    const parsed = eventSchema.safeParse({ ...editing, sort_order: editing.sort_order ?? items.length });
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "ورودی نامعتبر");
    triggerSave();
    upsert.mutate(parsed.data as Partial<EventItem>, {
      onSuccess: () => { toast.success("ذخیره شد"); setEditing(null); },
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div>
      <PageHeader title="رویدادها" subtitle="رویدادهای کافه را اضافه و ویرایش کنید"
        actions={<PrimaryButton onClick={() => setEditing(blank())}><Plus className="h-4 w-4" /> رویداد جدید</PrimaryButton>} />

      {editing && (
        <Card className="p-4 mb-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>عنوان</Label><Input value={editing.title ?? ""} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><Label>تاریخ (متن)</Label><Input value={editing.date_label ?? ""} onChange={e => setEditing({ ...editing, date_label: e.target.value })} placeholder="جمعه ۲۰ تیر · ساعت ۲۰" /></div>
            <div className="sm:col-span-2"><Label>توضیحات</Label><Textarea rows={3} value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>آدرس تصویر</Label><Input dir="ltr" value={editing.image_url ?? ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <PrimaryButton onClick={save} disabled={upsert.isPending}><Save className="h-4 w-4" /> ذخیره</PrimaryButton>
            <GhostButton onClick={() => setEditing(null)}><X className="h-4 w-4" /> انصراف</GhostButton>
          </div>
        </Card>
      )}

      {isLoading ? <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div> : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map(ev => (
            <Card key={ev.id} className="overflow-hidden">
              {ev.image_url && <img src={ev.image_url} alt={ev.title} className="w-full h-36 object-cover" />}
              <div className="p-3 flex flex-col gap-1">
                {ev.date_label && <div className="text-[11px] font-bold text-muted-foreground">{ev.date_label}</div>}
                <div className="text-sm font-bold">{ev.title}</div>
                {ev.description && <div className="text-xs text-muted-foreground line-clamp-2">{ev.description}</div>}
                <div className="flex gap-1.5 mt-2">
                  <GhostButton onClick={() => setEditing(ev)} className="text-xs py-1.5">ویرایش</GhostButton>
                  <GhostButton tone="danger" onClick={() => { triggerSave(); remove.mutate(ev.id, { onSuccess: () => toast.success("حذف شد") }); }} className="text-xs py-1.5">
                    <Trash2 className="h-3.5 w-3.5" />
                  </GhostButton>
                </div>
              </div>
            </Card>
          ))}
          {items.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground sm:col-span-2">هنوز رویدادی نیست.</Card>}
        </div>
      )}
    </div>
  );
}
