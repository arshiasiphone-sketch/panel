import { usePageBlocks, useSiteContent, type PageBlock } from "@/lib/cms";
import { BlockRender } from "./blocks";

export function PhonePreview() {
  const { data: blocks } = usePageBlocks();
  const { data: site } = useSiteContent();
  const meta = (site?.meta as { title?: string; bio?: string; avatar_url?: string } | undefined) ?? {};
  const visible = (blocks ?? []).filter((b: PageBlock) => b.visible);

  return (
    <div className="sticky top-6">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">پیش‌نمایش زنده</div>
      <div className="mx-auto w-[300px] rounded-[2.4rem] border-[10px] border-foreground bg-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="relative h-5 bg-foreground">
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-3 w-20 bg-foreground rounded-b-2xl" />
        </div>
        <div className="h-[560px] overflow-y-auto bg-background" dir="rtl">
          <div className="px-4 pt-5 pb-3 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted grid place-items-center overflow-hidden">
              {meta.avatar_url ? <img src={meta.avatar_url} className="h-full w-full object-cover" /> : <span className="text-lg font-bold text-muted-foreground">{(meta.title || "K").slice(0,1)}</span>}
            </div>
            <div className="mt-2 text-sm font-bold text-foreground">{meta.title || "کافه خانه"}</div>
            {meta.bio && <div className="text-[11px] text-muted-foreground mt-0.5">{meta.bio}</div>}
          </div>
          <div className="pb-6">
            {visible.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground py-10">هیچ بلوکی فعال نیست</div>
            ) : visible.map((b: PageBlock) => (
              <BlockRender key={b.id} block={{ id: b.id, type: b.type as never, visible: b.visible, data: (b.data as Record<string, unknown>) ?? {} }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
