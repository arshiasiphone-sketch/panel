import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Card, GhostButton } from "@/components/admin/admin-shell";
import { useMediaFiles, useUploadMedia, useDeleteMedia, getMediaPublicUrl } from "@/lib/media";
import { Upload, Folder, Search, Trash2, Tag, ChevronDown, Image } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/admin/media")({ component: MediaPage });

function MediaPage() {
  const { data: media = [], isLoading, isError, error } = useMediaFiles();
  const upload = useUploadMedia();
  const remove = useDeleteMedia();
  const isMobile = useIsMobile();
  const [folder, setFolder] = useState("همه");
  const [q, setQ] = useState("");
  const [showFolders, setShowFolders] = useState(false);

  const folders = useMemo(
    () => ["همه", ...Array.from(new Set(media.map((m) => m.folder)))],
    [media],
  );
  const filtered = useMemo(
    () =>
      media.filter(
        (m) =>
          (folder === "همه" || m.folder === folder) &&
          (!q || m.name.includes(q) || (m.tags ?? []).some((t) => t.includes(q))),
      ),
    [media, folder, q],
  );

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    for (const file of files) {
      try {
        await upload.mutateAsync({ file, folder: "uploads" });
        toast.success(`${file.name} آپلود شد`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "آپلود ناموفق");
      }
    }
  }

  if (isLoading) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div>
    );
  }
  if (isError) {
    return (
      <div className="text-center text-sm text-destructive py-10">
        {error instanceof Error ? error.message : "خطا"}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="کتابخانه رسانه"
        subtitle="آپلود و مدیریت تصاویر در Supabase Storage"
        actions={
          <label
            className={`inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-3.5 py-2 text-sm font-medium hover:bg-foreground/90 cursor-pointer ${upload.isPending ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Upload className="h-4 w-4" /> {upload.isPending ? "در حال آپلود..." : "آپلود"}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onUpload}
              disabled={upload.isPending}
            />
          </label>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
        {/* Mobile folder selector - collapsible chip */}
        {isMobile ? (
          <div className="-mb-2">
            <button
              onClick={() => setShowFolders(!showFolders)}
              className="w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3.5 py-3 text-sm min-h-[44px] touch-manipulation"
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{folder}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${showFolders ? "rotate-180" : ""}`} />
            </button>
            {showFolders && (
              <Card className="mt-1 p-2 overflow-hidden">
                {folders.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFolder(f);
                      setShowFolders(false);
                    }}
                    className={`w-full text-right flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition min-h-[44px] ${folder === f ? "bg-foreground/[0.06] font-medium" : "hover:bg-muted text-muted-foreground"}`}
                  >
                    <Folder className="h-4 w-4" />
                    {f}
                  </button>
                ))}
              </Card>
            )}
          </div>
        ) : (
          <Card className="p-3 h-fit">
            <div className="text-xs text-muted-foreground mb-2">پوشه‌ها</div>
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setFolder(f)}
                className={`w-full text-right flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition ${folder === f ? "bg-foreground/[0.06] font-medium" : "hover:bg-muted text-muted-foreground"}`}
              >
                <Folder className="h-3.5 w-3.5" />
                {f}
              </button>
            ))}
          </Card>
        )}

        <div>
          <Card className="mb-3 p-3 flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجو نام یا تگ..."
                className="w-full rounded-lg border border-border bg-background pr-8 pl-3 py-1.5 text-sm outline-none focus:border-foreground/40"
              />
            </div>
          </Card>

          {filtered.length === 0 ? (
            <Card className="p-12 text-center text-sm text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              هیچ فایلی یافت نشد. آپلود کنید.
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((m) => (
                <Card key={m.id} className="overflow-hidden group">
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={getMediaPublicUrl(m.storage_path)}
                      alt={m.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      disabled={remove.isPending}
                      onClick={() =>
                        remove.mutate(m, {
                          onSuccess: () => toast.success("حذف شد"),
                          onError: (e) => toast.error(e.message),
                        })
                      }
                      className="absolute top-2 left-2 h-9 w-9 md:h-7 md:w-7 grid place-items-center rounded-full bg-background/90 text-rose-600 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition disabled:opacity-50 touch-manipulation"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4 md:h-3.5 md:w-3.5" />
                    </button>
                  </div>
                  <div className="p-2">
                    <div className="text-xs font-medium truncate">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {(Number(m.size_bytes) / 1024).toFixed(0)} KB
                    </div>
                    <GhostButton
                      className="text-[10px] py-2 px-2 mt-1 w-full min-h-[36px]"
                      onClick={() => {
                        navigator.clipboard.writeText(getMediaPublicUrl(m.storage_path));
                        toast.success("آدرس کپی شد");
                      }}
                    >
                      کپی URL
                    </GhostButton>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
