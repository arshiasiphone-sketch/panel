import { createFileRoute } from "@tanstack/react-router";
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, EyeOff, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card } from "@/components/admin/admin-shell";
import { triggerSave } from "@/lib/admin-store";
import { useTestQuestionsConfig, useUpdateTestQuestionsConfig } from "@/lib/test-db";
import { PERSONALITY_PROFILES, type PersonalityType } from "@/lib/test-data";
import {
  resolveQuestion,
  type TestQuestionsConfig,
  EMPTY_TEST_QUESTIONS,
  getActiveQuestionIds,
} from "@/lib/test-questions";

export const Route = createFileRoute("/admin/test-questions")({ component: TestQuestionsPage });

function TestQuestionsPage() {
  const { data: config = EMPTY_TEST_QUESTIONS, isLoading } = useTestQuestionsConfig();
  const update = useUpdateTestQuestionsConfig();
  const ids = getActiveQuestionIds(config);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function save(next: TestQuestionsConfig) {
    triggerSave();
    update.mutate(next, { onError: (e) => toast.error(e.message) });
  }

  function patch(fn: (c: TestQuestionsConfig) => TestQuestionsConfig) {
    save(fn(config));
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    patch((c) => ({
      ...c,
      orderedIds: arrayMove(getActiveQuestionIds(c), ids.indexOf(active.id as number), ids.indexOf(over.id as number)),
    }));
  }

  if (isLoading) {
    return <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <PageHeader
        title="سوالات تست شخصیت"
        subtitle="ترتیب، متن، گزینه‌ها و نگاشت تیپ‌ها — تغییرات در پایگاه داده ذخیره می‌شوند."
        actions={
          <button onClick={() => { save(EMPTY_TEST_QUESTIONS); toast.success("به حالت پیش‌فرض برگشت"); }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent">
            <RotateCcw className="h-3.5 w-3.5" /> ریست
          </button>
        }
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {ids.map((id) => {
              const q = resolveQuestion(id, config.overrides);
              if (!q) return null;
              return (
                <SortableQuestion key={id} id={id} q={q}
                  onText={(t) => patch((c) => ({ ...c, overrides: { ...c.overrides, [id]: { ...c.overrides[id], text: t } } }))}
                  onToggle={() => patch((c) => {
                    const cur = c.overrides[id] ?? {};
                    return { ...c, overrides: { ...c.overrides, [id]: { ...cur, enabled: !(cur.enabled ?? true) } } };
                  })}
                  onOptText={(oid, t) => patch((c) => {
                    const cur = c.overrides[id] ?? {};
                    const opts = { ...(cur.options ?? {}) };
                    opts[oid] = { ...opts[oid], text: t };
                    return { ...c, overrides: { ...c.overrides, [id]: { ...cur, options: opts } } };
                  })}
                  onOptType={(oid, t) => patch((c) => {
                    const cur = c.overrides[id] ?? {};
                    const opts = { ...(cur.options ?? {}) };
                    opts[oid] = { ...opts[oid], type: t };
                    return { ...c, overrides: { ...c.overrides, [id]: { ...cur, options: opts } } };
                  })}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

const TYPE_OPTIONS: { value: PersonalityType | "none"; label: string }[] = [
  { value: "none", label: "بدون مپینگ" },
  { value: "paparoch", label: "پاپاروچ" },
  { value: "zhampin", label: "ژامپین" },
  { value: "fofino", label: "فوفینو" },
  { value: "gombak", label: "گومباک" },
];

function SortableQuestion({ id, q, onText, onToggle, onOptText, onOptType }: {
  id: number;
  q: ReturnType<typeof resolveQuestion> & object;
  onText: (t: string) => void;
  onToggle: () => void;
  onOptText: (optId: string, t: string) => void;
  onOptType: (optId: string, t: PersonalityType | null) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`p-4 ${!q.enabled ? "opacity-60" : ""}`}>
        <div className="flex items-start gap-3">
          <button {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground" aria-label="جابجایی">
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold">سوال {id}</span>
                {!q.categorized && <span className="px-1.5 py-0.5 rounded-full bg-muted">بدون دسته</span>}
                {!q.enabled && <span className="px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">غیرفعال</span>}
              </div>
              <button onClick={onToggle} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent">
                {q.enabled ? <><EyeOff className="h-3.5 w-3.5" /> غیرفعال کن</> : <><Eye className="h-3.5 w-3.5" /> فعال کن</>}
              </button>
            </div>

            <textarea
              value={q.text}
              onChange={(e) => onText(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-background p-2 text-sm font-medium resize-none"
            />

            <div className="grid gap-2">
              {q.options.map((o) => (
                <div key={o.id} className="grid grid-cols-[1fr_140px] gap-2 items-center">
                  <input
                    value={o.text}
                    onChange={(e) => onOptText(o.id, e.target.value)}
                    className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                  />
                  {q.categorized ? (
                    <select
                      value={o.type ?? "none"}
                      onChange={(e) => onOptType(o.id, e.target.value === "none" ? null : (e.target.value as PersonalityType))}
                      className="rounded-md border border-border bg-background px-2 py-1.5 text-xs font-semibold"
                      style={{ color: o.type && o.type !== "bedone" ? PERSONALITY_PROFILES[o.type].color : undefined }}
                    >
                      {TYPE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  ) : (
                    <span className="text-[11px] text-muted-foreground text-center">بدون امتیاز</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
