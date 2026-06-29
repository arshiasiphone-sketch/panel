import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { RotateCcw, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, PrimaryButton, GhostButton, Input, Textarea, Label } from "@/components/admin/admin-shell";
import { PERSONALITY_PROFILES, type PersonalityProfile, type PersonalityType } from "@/lib/test-data";
import {
  resolveProfile, defaultDbRow, PERSONALITY_TYPES,
} from "@/lib/personality-store";
import { usePersonalityProfiles, useUpsertPersonalityProfile } from "@/lib/cms";
import { triggerSave } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/personality-types")({ component: PersonalityTypesAdmin });

function isCustom(type: PersonalityType, rows: ReturnType<typeof usePersonalityProfiles>["data"]) {
  const row = rows?.find((r) => r.key === type);
  const base = PERSONALITY_PROFILES[type];
  if (!row) return false;
  return row.label !== base.label
    || row.tagline !== base.tagline
    || row.description !== base.description
    || row.drink !== base.drink
    || row.spot !== base.spot
    || row.color_from !== base.color
    || row.color_to !== base.accentColor
    || JSON.stringify(row.traits ?? []) !== JSON.stringify(base.traits);
}

function PersonalityTypesAdmin() {
  const { data: rows, isLoading } = usePersonalityProfiles();
  const upsert = useUpsertPersonalityProfile();
  const [active, setActive] = useState<PersonalityType>("paparoch");

  const profile = resolveProfile(active, rows);

  const savePatch = useCallback((patch: Partial<PersonalityProfile>) => {
    triggerSave();
    const current = resolveProfile(active, rows);
    const merged = { ...current, ...patch };
    upsert.mutate({
      ...defaultDbRow(active, PERSONALITY_TYPES.indexOf(active) + 1),
      label: merged.label,
      tagline: merged.tagline,
      description: merged.description,
      traits: merged.traits,
      drink: merged.drink,
      spot: merged.spot,
      color_from: merged.color,
      color_to: merged.accentColor,
    }, {
      onError: (e) => toast.error(e.message),
    });
  }, [active, rows, upsert]);

  function resetType(type: PersonalityType) {
    triggerSave();
    upsert.mutate(defaultDbRow(type, PERSONALITY_TYPES.indexOf(type) + 1), {
      onSuccess: () => toast.success("به پیش‌فرض برگشت"),
      onError: (e) => toast.error(e.message),
    });
  }

  function resetAll() {
    triggerSave();
    Promise.all(PERSONALITY_TYPES.map((t, i) =>
      upsert.mutateAsync(defaultDbRow(t, i + 1))
    ))
      .then(() => toast.success("همه به پیش‌فرض بازگشتند"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "خطا"));
  }

  if (isLoading) {
    return <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <PageHeader
        title="تیپ‌های شخصیتی"
        subtitle="ویرایش متن، رنگ، نوشیدنی و فضای پیشنهادی برای هر تیپ. تغییرات در پایگاه داده ذخیره می‌شوند."
        actions={
          <GhostButton onClick={resetAll} disabled={upsert.isPending}>
            <RotateCcw className="h-3.5 w-3.5" /> ریست همه
          </GhostButton>
        }
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {PERSONALITY_TYPES.map((t) => {
          const def = PERSONALITY_PROFILES[t];
          const p = resolveProfile(t, rows);
          return (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-3 py-2 rounded-xl text-sm font-bold border transition ${active === t ? "ring-2 ring-foreground/20" : ""}`}
              style={{ background: p.bgColor, borderColor: p.borderColor, color: p.color }}
            >
              {p.label}
              {isCustom(t, rows) && <span className="ms-2 text-[10px] opacity-70">(تغییریافته)</span>}
              {def.label !== p.label && <span className="ms-1 text-[10px] opacity-60">[{def.label}]</span>}
            </button>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>نام تیپ</Label><Input value={profile.label} onChange={(e) => savePatch({ label: e.target.value })} /></div>
            <div><Label>شعار (Tagline)</Label><Input value={profile.tagline} onChange={(e) => savePatch({ tagline: e.target.value })} /></div>
          </div>
          <div><Label>توضیحات</Label><Textarea rows={4} value={profile.description} onChange={(e) => savePatch({ description: e.target.value })} /></div>

          <div>
            <Label>ویژگی‌ها</Label>
            <TraitsEditor value={profile.traits} onChange={(traits) => savePatch({ traits })} />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>نوشیدنی پیشنهادی</Label><Input value={profile.drink} onChange={(e) => savePatch({ drink: e.target.value })} /></div>
            <div><Label>بهترین جای نشستن</Label><Input value={profile.spot} onChange={(e) => savePatch({ spot: e.target.value })} /></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>رنگ اصلی</Label>
              <div className="flex gap-2">
                <input type="color" value={profile.color} onChange={(e) => savePatch({ color: e.target.value })} className="h-9 w-12 rounded border border-border bg-background" />
                <Input dir="ltr" value={profile.color} onChange={(e) => savePatch({ color: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>رنگ ثانوی</Label>
              <div className="flex gap-2">
                <input type="color" value={profile.accentColor} onChange={(e) => savePatch({ accentColor: e.target.value })} className="h-9 w-12 rounded border border-border bg-background" />
                <Input dir="ltr" value={profile.accentColor} onChange={(e) => savePatch({ accentColor: e.target.value })} />
              </div>
            </div>
          </div>

          {isCustom(active, rows) && (
            <div>
              <GhostButton tone="danger" onClick={() => resetType(active)} disabled={upsert.isPending}>
                <RotateCcw className="h-3.5 w-3.5" /> بازگشت این تیپ به پیش‌فرض
              </GhostButton>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 mt-4">
        <h3 className="text-sm font-bold mb-3">پیش‌نمایش</h3>
        <div
          className="rounded-2xl p-5 text-center flex flex-col items-center gap-3"
          style={{ background: profile.bgColor, border: `1px solid ${profile.borderColor}` }}
        >
          <h2 className="text-3xl font-extrabold" style={{ color: profile.color }}>{profile.label}</h2>
          <p className="text-sm font-semibold" style={{ color: profile.accentColor }}>{profile.tagline}</p>
          <p className="text-sm max-w-md leading-7" style={{ color: "#9a8a78" }}>{profile.description}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {profile.traits.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: profile.bgColor, border: `1px solid ${profile.borderColor}`, color: profile.color }}>{t}</span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function TraitsEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {value.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-muted">
            {t}
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="حذف">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="ویژگی جدید..."
          onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { onChange([...value, draft.trim()]); setDraft(""); }}} />
        <PrimaryButton onClick={() => { if (draft.trim()) { onChange([...value, draft.trim()]); setDraft(""); }}}>
          <Plus className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </div>
  );
}
