import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef, useCallback, memo } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Copy, Trash2, Eye, EyeOff, Plus, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import {
  usePageBlocks,
  useCreateBlock,
  useUpdateBlock,
  useDeleteBlock,
  useReorderBlocks,
  useSiteContent,
  useUpsertSiteContent,
  type PageBlock,
} from "@/lib/cms";
import { triggerSave } from "@/lib/admin-store";
<<<<<<< HEAD
import { useIsMobile } from "@/hooks/use-mobile";
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
import { PageHeader, Card } from "@/components/admin/admin-shell";
import {
  BLOCK_DEFS,
  BlockIcon,
  BlockEditor,
  getBlockDef,
  defaultBlockData,
  normalizeBlockType,
  type Block,
  type BlockType,
} from "@/components/admin/blocks";
<<<<<<< HEAD
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a

export const Route = createFileRoute("/admin/page")({ component: PageBuilder });

function toUiBlock(b: PageBlock): Block {
  return {
    id: b.id,
    type: normalizeBlockType(b.type) as BlockType,
    visible: b.visible,
    data: (b.data as Record<string, unknown>) ?? {},
  };
}

function PageBuilder() {
  const { data: rows = [], isLoading } = usePageBlocks();
  const { data: site } = useSiteContent();
  const upsertSite = useUpsertSiteContent();
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const deleteBlock = useDeleteBlock();
  const reorder = useReorderBlocks();
  const [picker, setPicker] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
<<<<<<< HEAD
  const [drawerBlock, setDrawerBlock] = useState<Block | null>(null);
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const blocks = useMemo(() => rows.map(toUiBlock), [rows]);
  const meta =
    (site?.meta as { title?: string; bio?: string; avatar_url?: string } | undefined) ?? {};

<<<<<<< HEAD
  // Listen for FAB-triggered block picker from mobile bottom nav
  useEffect(() => {
    function onOpenPicker() {
      setPicker(true);
    }
    window.addEventListener("open-block-picker", onOpenPicker);
    return () => window.removeEventListener("open-block-picker", onOpenPicker);
  }, []);

=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  function saveMeta(patch: Partial<{ title: string; bio: string; avatar_url: string }>) {
    triggerSave();
    upsertSite.mutate(
      { key: "meta", value: { ...meta, ...patch } },
      { onError: (e) => toast.error(e.message) },
    );
  }

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = blocks.map((b) => b.id);
    const next = arrayMove(ids, ids.indexOf(active.id as string), ids.indexOf(over.id as string));
    triggerSave();
    reorder.mutate(next, { onError: (e) => toast.error(e.message) });
  }

  function addBlockOfType(type: BlockType) {
    triggerSave();
    createBlock.mutate(
      { type, data: defaultBlockData(type), sort_order: blocks.length },
      {
        onSuccess: () => toast.success("بلوک افزوده شد"),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  function duplicateBlock(b: Block) {
    triggerSave();
    createBlock.mutate(
      { type: b.type, data: b.data, sort_order: blocks.length },
      { onError: (e) => toast.error(e.message) },
    );
  }

  function removeBlock(id: string) {
    triggerSave();
    deleteBlock.mutate(id, {
      onSuccess: () => toast.success("حذف شد"),
      onError: (e) => toast.error(e.message),
    });
  }

  function toggleVisibility(b: Block) {
    triggerSave();
    updateBlock.mutate(
      { id: b.id, visible: !b.visible },
      { onError: (e) => toast.error(e.message) },
    );
  }

  const commitData = useCallback(
    (id: string, fullData: Record<string, unknown>) => {
      triggerSave();
      updateBlock.mutate({ id, data: fullData }, { onError: (e) => toast.error(e.message) });
    },
    [updateBlock],
  );

  return (
    <div>
      <PageHeader
        title="سازنده صفحه"
        subtitle="بلوک‌ها را بکشید، ویرایش کنید — تغییرات بلافاصله در سایت اعمال می‌شوند"
      />

      <Card className="p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-muted grid place-items-center text-xl font-bold text-muted-foreground overflow-hidden">
            {meta.avatar_url ? (
              <img src={meta.avatar_url} className="h-full w-full object-cover" />
            ) : (
              (meta.title || "ک").slice(0, 1)
            )}
          </div>
          <div className="flex-1 grid sm:grid-cols-2 gap-2">
            <input
              value={meta.title ?? ""}
              onChange={(e) => saveMeta({ title: e.target.value })}
              placeholder="عنوان صفحه"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />
            <input
              value={meta.bio ?? ""}
              onChange={(e) => saveMeta({ bio: e.target.value })}
              placeholder="معرفی کوتاه"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {blocks.map((b) => (
                <SortableBlock
                  key={b.id}
                  block={b}
                  expanded={expanded === b.id}
                  onToggle={() => setExpanded((x) => (x === b.id ? null : b.id))}
                  onCommitData={(data) => commitData(b.id, data)}
                  onDuplicate={() => duplicateBlock(b)}
                  onRemove={() => removeBlock(b.id)}
                  onToggleVisibility={() => toggleVisibility(b)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <button
        onClick={() => setPicker(true)}
        className="mt-3 w-full rounded-2xl border-2 border-dashed border-border hover:border-foreground/30 hover:bg-muted/30 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition inline-flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> افزودن بلوک
      </button>

      {picker && (
        <BlockPicker
          onClose={() => setPicker(false)}
          onPick={(t) => {
            addBlockOfType(t);
            setPicker(false);
          }}
        />
      )}
<<<<<<< HEAD

      {/* Block editor bottom sheet (mobile) — debounced */}
      {drawerBlock && (
        <Drawer open={!!drawerBlock} onOpenChange={(open) => { if (!open) setDrawerBlock(null); }}>
          <DrawerContent className="max-h-[85vh] overflow-y-auto">
            <DrawerHeader className="text-right border-b border-border pb-3">
              <DrawerTitle>
                <div className="flex items-center gap-2">
                  <BlockIcon d={getBlockDef(drawerBlock.type).icon} />
                  <span>{getBlockDef(drawerBlock.type).label}</span>
                </div>
              </DrawerTitle>
              <DrawerDescription className="text-xs mt-1">
                ویرایش {getBlockDef(drawerBlock.type).label}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-8" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
              <DrawerBlockEditor
                block={drawerBlock}
                onUpdate={(patch) => {
                  const next = { ...drawerBlock, data: { ...drawerBlock.data, ...patch } };
                  setDrawerBlock(next);
                }}
                onCommit={(data) => commitData(drawerBlock.id, data)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
    </div>
  );
}

const SortableBlock = memo(function SortableBlock({
  block,
  expanded,
  onToggle,
  onCommitData,
  onDuplicate,
  onRemove,
  onToggleVisibility,
}: {
  block: Block;
  expanded: boolean;
  onToggle: () => void;
  onCommitData: (data: Record<string, unknown>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onToggleVisibility: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });
  const def = getBlockDef(block.type);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Local buffer for autosave (debounced + onBlur + Ctrl+S).
  const [localData, setLocalData] = useState<Record<string, unknown>>(block.data);
  const lastSavedRef = useRef<string>(JSON.stringify(block.data));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);

  // Re-sync when the remote block changes (and not currently editing).
  useEffect(() => {
    const remote = JSON.stringify(block.data);
    if (remote !== lastSavedRef.current) {
      lastSavedRef.current = remote;
      setLocalData(block.data);
    }
  }, [block.data]);

  const flush = useCallback(() => {
    if (inFlightRef.current) return;
    const next = JSON.stringify(localData);
    if (next === lastSavedRef.current) return;
    inFlightRef.current = true;
    lastSavedRef.current = next;
    onCommitData(localData);
    // Release lock shortly after; realtime will reconcile.
    setTimeout(() => {
      inFlightRef.current = false;
    }, 300);
  }, [localData, onCommitData]);

  // Debounced flush on local change.
  useEffect(() => {
    if (JSON.stringify(localData) === lastSavedRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [localData, flush]);

  // Ctrl+S inside the editor body.
  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (timerRef.current) clearTimeout(timerRef.current);
      flush();
    }
  }

  const editorBlock: Block = useMemo(() => ({ ...block, data: localData }), [block, localData]);

  const onUpdate = useCallback((patch: Record<string, unknown>) => {
    setLocalData((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-border bg-card overflow-hidden ${!block.visible ? "opacity-60" : ""}`}
    >
<<<<<<< HEAD
      <div className="flex items-center gap-2 px-2.5 py-2 min-h-[52px] md:min-h-0">
        <button
          {...attributes}
          {...listeners}
          className="h-9 w-9 md:h-7 md:w-7 grid place-items-center text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-manipulation"
=======
      <div className="flex items-center gap-2 px-2.5 py-2">
        <button
          {...attributes}
          {...listeners}
          className="h-7 w-7 grid place-items-center text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
          aria-label="جابجایی"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button onClick={onToggle} className="flex-1 flex items-center gap-2 min-w-0 text-right">
<<<<<<< HEAD
          <div className="h-9 w-9 md:h-7 md:w-7 rounded-md bg-muted grid place-items-center text-foreground/70">
=======
          <div className="h-7 w-7 rounded-md bg-muted grid place-items-center text-foreground/70">
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
            <BlockIcon d={def.icon} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{def.label}</div>
            <div className="text-[11px] text-muted-foreground truncate">
              {previewSummary(editorBlock)}
            </div>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition ms-auto ${expanded ? "rotate-180" : ""}`}
          />
        </button>
<<<<<<< HEAD
        <div className="flex items-center gap-1">
=======
        <div className="flex items-center gap-0.5">
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
          <IconBtn onClick={onToggleVisibility} title={block.visible ? "مخفی کردن" : "نمایش"}>
            {block.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </IconBtn>
          <IconBtn onClick={onDuplicate} title="کپی">
            <Copy className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={onRemove} title="حذف" danger>
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>
      {expanded && (
        <div
          className="border-t border-border bg-muted/20 p-3.5"
          onBlur={flush}
          onKeyDown={onKeyDown}
        >
          <BlockEditor block={editorBlock} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
});

<<<<<<< HEAD
/** Debounced block editor for the mobile drawer — prevents rapid mutations. */
function DrawerBlockEditor({
  block,
  onUpdate,
  onCommit,
}: {
  block: Block;
  onUpdate: (patch: Record<string, unknown>) => void;
  onCommit: (data: Record<string, unknown>) => void;
}) {
  const [localData, setLocalData] = useState<Record<string, unknown>>(block.data);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCommittedRef = useRef<string>(JSON.stringify(block.data));

  // Sync when remote changes
  useEffect(() => {
    const remote = JSON.stringify(block.data);
    if (remote !== lastCommittedRef.current) {
      lastCommittedRef.current = remote;
      setLocalData(block.data);
    }
  }, [block.data]);

  const handleUpdate = useCallback(
    (patch: Record<string, unknown>) => {
      const next = { ...localData, ...patch };
      setLocalData(next);
      onUpdate(patch);
      // Debounced commit
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const nextStr = JSON.stringify(next);
        if (nextStr !== lastCommittedRef.current) {
          lastCommittedRef.current = nextStr;
          onCommit(next);
        }
      }, 800);
    },
    [localData, onUpdate, onCommit],
  );

  return <BlockEditor block={{ ...block, data: localData }} onUpdate={handleUpdate} />;
}

=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`h-7 w-7 grid place-items-center rounded-md text-muted-foreground transition ${danger ? "hover:bg-rose-50 hover:text-rose-600" : "hover:bg-muted hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

function previewSummary(b: Block) {
  const d = b.data;
  switch (normalizeBlockType(b.type)) {
    case "header":
      return d.title;
    case "paragraph":
      return d.text;
    case "button":
      return `${d.label} → ${d.url}`;
    case "image":
      return d.url || "بدون تصویر";
    case "menu":
      return `${(d.items ?? []).length} آیتم`;
    case "social":
      return `${(d.links ?? []).length} شبکه`;
    case "faq":
      return `${(d.items ?? []).length} پرسش`;
    case "gallery":
      return `${(d.images ?? []).length} تصویر`;
    default:
      return getBlockDef(b.type).label;
  }
}

function BlockPicker({ onClose, onPick }: { onClose: () => void; onPick: (t: BlockType) => void }) {
  const groups = ["صفحه", "متن", "رسانه", "تعامل", "اطلاعات", "پیشرفته"] as const;
<<<<<<< HEAD
  const isMobile = useIsMobile();

  // Mobile: bottom sheet
  if (isMobile) {
    return (
      <Drawer open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader className="text-right border-b border-border pb-3">
            <DrawerTitle>انتخاب بلوک</DrawerTitle>
            <DrawerDescription className="text-xs">
              نوع بلوکی که می‌خواهید اضافه کنید را انتخاب کنید
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-5 pb-8" style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}>
            {groups.map((g) => (
              <div key={g}>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                  {g}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {BLOCK_DEFS.filter((b) => b.group === g).map((b) => (
                    <button
                      key={b.type}
                      onClick={() => onPick(b.type)}
                      className="rounded-xl border border-border bg-background hover:bg-muted/40 p-3.5 text-right transition active:scale-95 touch-manipulation min-h-[60px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center">
                          <BlockIcon d={b.icon} size={18} />
                        </div>
                        <div className="text-sm font-medium">{b.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: modal
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40" />
      <div
        className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-popover border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-popover/95 backdrop-blur px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="text-sm font-semibold">انتخاب بلوک</div>
          <button
            onClick={onClose}
<<<<<<< HEAD
            className="h-8 w-8 rounded-md hover:bg-muted grid place-items-center"
=======
            className="h-7 w-7 rounded-md hover:bg-muted grid place-items-center"
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 space-y-5">
          {groups.map((g) => (
            <div key={g}>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                {g}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BLOCK_DEFS.filter((b) => b.group === g).map((b) => (
                  <button
                    key={b.type}
                    onClick={() => onPick(b.type)}
                    className="rounded-xl border border-border bg-background hover:bg-muted/40 p-3 text-right transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-muted grid place-items-center group-hover:bg-foreground group-hover:text-background transition">
                        <BlockIcon d={b.icon} />
                      </div>
                      <div className="text-sm font-medium">{b.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
