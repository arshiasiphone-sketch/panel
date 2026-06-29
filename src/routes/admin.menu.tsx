import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useAllMenuItems, useUpsertMenuItem, useDeleteMenuItem, type MenuItem } from "@/lib/cms";
import { menuItemSchema } from "@/lib/cms-schemas";
import { triggerSave } from "@/lib/admin-store";
import { PageHeader, Card, PrimaryButton, GhostButton, Input, Textarea, Label } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/admin/menu")({ component: MenuAdmin });

type Draft = Partial<MenuItem>;
const blank = (): Draft => ({ category: "", name: "", description: "", price: "", image_url: "", visible: true, sort_order: 0 });

function MenuAdmin() {
  const { data: items = [], isLoading } = useAllMenuItems();
  const upsert = useUpsertMenuItem();
  const remove = useDeleteMenuItem();
  const [editing, setEditing] = useState<Draft | null>(null);

  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));

  function save() {
    if (!editing) return;
    const parsed = menuItemSchema.safeParse({ ...editing, sort_order: editing.sort_order ?? items.length });
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "ورودی نامعتبر");
    triggerSave();
    upsert.mutate(parsed.data as Partial<MenuItem>, {
      onSuccess: () => { toast.success("ذخیره شد"); setEditing(null); },
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div>
      <PageHeader title="مدیریت منو" subtitle="تغییرات بلافاصله در سایت اعمال می‌شود"
        actions={<PrimaryButton onClick={() => setEditing(blank())}><Plus className="h-4 w-4" /> آیتم جدید</PrimaryButton>}
      />

      {editing && (
        <Card className="p-4 mb-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>دسته</Label>
              <Input list="menu-categories" value={editing.category ?? ""} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="نوشیدنی گرم" />
              <datalist id="menu-categories">{categories.map(c => <option key={c} value={c} />)}</datalist>
            </div>
            <div><Label>نام</Label><Input value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>توضیحات</Label><Textarea rows={2} value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
            <div><Label>قیمت</Label><Input value={editing.price ?? ""} onChange={e => setEditing({ ...editing, price: e.target.value })} placeholder="۸۵٬۰۰۰" /></div>
            <div><Label>آدرس تصویر</Label><Input dir="ltr" value={editing.image_url ?? ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <PrimaryButton onClick={save} disabled={upsert.isPending}><Save className="h-4 w-4" /> ذخیره</PrimaryButton>
            <GhostButton onClick={() => setEditing(null)}><X className="h-4 w-4" /> انصراف</GhostButton>
          </div>
        </Card>
      )}

      {isLoading ? <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(it => (
            <Card key={it.id} className="overflow-hidden flex flex-col">
              {it.image_url && <img src={it.image_url} alt={it.name} className="w-full h-32 object-cover" />}
              <div className="p-3 flex-1 flex flex-col gap-1">
                <div className="text-[11px] font-bold text-muted-foreground">{it.category}</div>
                <div className="text-sm font-bold">{it.name}</div>
                {it.description && <div className="text-xs text-muted-foreground line-clamp-2">{it.description}</div>}
                <div className="text-xs font-semibold mt-1">{it.price}</div>
                <div className="flex gap-1.5 mt-2">
                  <GhostButton onClick={() => setEditing(it)} className="text-xs py-1.5">ویرایش</GhostButton>
                  <GhostButton tone="danger" onClick={() => { triggerSave(); remove.mutate(it.id, { onSuccess: () => toast.success("حذف شد") }); }} className="text-xs py-1.5">
                    <Trash2 className="h-3.5 w-3.5" />
                  </GhostButton>
                </div>
              </div>
            </Card>
          ))}
          {items.length === 0 && (
            <Card className="p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
              هنوز آیتمی اضافه نشده.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
