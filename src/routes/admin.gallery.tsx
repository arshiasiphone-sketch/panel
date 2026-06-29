import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAllGalleryImages, useUpsertGalleryImage, useDeleteGalleryImage, type GalleryImage } from "@/lib/cms";
import { galleryImageSchema } from "@/lib/cms-schemas";
import { triggerSave } from "@/lib/admin-store";
import { PageHeader, Card, PrimaryButton, GhostButton, Input, Label } from "@/components/admin/admin-shell";

export const Route = createFileRoute("/admin/gallery")({ component: GalleryAdmin });

function GalleryAdmin() {
  const { data: images = [], isLoading } = useAllGalleryImages();
  const upsert = useUpsertGalleryImage();
  const remove = useDeleteGalleryImage();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  function add() {
    const parsed = galleryImageSchema.safeParse({ image_url: url.trim(), title: title.trim(), sort_order: images.length });
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "ورودی نامعتبر");
    triggerSave();
    upsert.mutate(parsed.data as Partial<GalleryImage>, {
      onSuccess: () => { setUrl(""); setTitle(""); toast.success("اضافه شد"); },
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div>
      <PageHeader title="گالری" subtitle="افزودن تصاویر برای نمایش در گالری صفحه اصلی" />

      <Card className="p-4 mb-4">
        <div className="grid sm:grid-cols-[1fr_180px_auto] gap-2 items-end">
          <div><Label>آدرس تصویر</Label><Input dir="ltr" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." /></div>
          <div><Label>عنوان (اختیاری)</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
          <PrimaryButton onClick={add} disabled={upsert.isPending}><Plus className="h-4 w-4" /> افزودن</PrimaryButton>
        </div>
      </Card>

      {isLoading ? <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map(img => (
            <Card key={img.id} className="overflow-hidden">
              <img src={img.image_url} alt={img.title ?? ""} className="w-full aspect-square object-cover" />
              <div className="p-2 flex items-center justify-between gap-2">
                <span className="text-xs truncate flex-1">{img.title || "—"}</span>
                <GhostButton tone="danger" onClick={() => { triggerSave(); remove.mutate(img.id, { onSuccess: () => toast.success("حذف شد") }); }} className="text-xs py-1 px-2">
                  <Trash2 className="h-3.5 w-3.5" />
                </GhostButton>
              </div>
            </Card>
          ))}
          {images.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground col-span-full">هیچ تصویری ثبت نشده.</Card>}
        </div>
      )}
    </div>
  );
}
