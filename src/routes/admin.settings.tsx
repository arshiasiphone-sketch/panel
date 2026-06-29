import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTheme, useUpdateTheme, useSiteContent, useUpsertSiteContent, DEFAULT_THEME_SETTINGS } from "@/lib/cms";
import { themeSchema } from "@/lib/cms-schemas";
import { triggerSave } from "@/lib/admin-store";
import { PageHeader, Card, PrimaryButton, Label, Input, Textarea } from "@/components/admin/admin-shell";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const { data: theme, isLoading } = useTheme();
  const updateTheme = useUpdateTheme();
  const { data: site } = useSiteContent();
  const upsertSite = useUpsertSiteContent();
  const meta = { title: "", bio: "", avatar_url: "", ...(site?.meta as { title?: string; bio?: string; avatar_url?: string } | undefined) };

  function setMeta(patch: Partial<typeof meta>) {
    triggerSave();
    upsertSite.mutate(
      { key: "meta", value: { ...meta, ...patch } },
      { onError: (e) => toast.error(e.message) },
    );
  }

  function setTheme(patch: Partial<NonNullable<typeof theme>>) {
    triggerSave();
    const next = { ...theme!, ...patch };
    const parsed = themeSchema.safeParse(next);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "مقدار نامعتبر");
    updateTheme.mutate(patch, { onError: (e) => toast.error(e.message) });
  }

  if (isLoading || !theme) return <div className="text-center text-sm text-muted-foreground py-10">در حال بارگذاری...</div>;

  return (
    <div>
      <PageHeader title="تنظیمات و تم" subtitle="پروفایل صفحه و تم بصری سایت" />

      <Card className="p-5 mb-3">
        <h2 className="text-sm font-semibold mb-3">پروفایل صفحه</h2>
        <div className="grid gap-3 max-w-lg">
          <div><Label>عنوان</Label><Input value={meta.title} onChange={e => setMeta({ title: e.target.value })} /></div>
          <div><Label>معرفی</Label><Textarea rows={2} value={meta.bio} onChange={e => setMeta({ bio: e.target.value })} /></div>
          <div><Label>آدرس آواتار</Label><Input dir="ltr" value={meta.avatar_url} onChange={e => setMeta({ avatar_url: e.target.value })} placeholder="https://..." /></div>
        </div>
      </Card>

      <Card className="p-5 mb-3">
        <h2 className="text-sm font-semibold mb-3">تم رنگ‌ها (فقط لندینگ و تست — پنل ادمین ثابت می‌ماند)</h2>
        <p className="text-xs text-muted-foreground mb-3">رنگ‌های برند و پس‌زمینه</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
          <ColorField label="رنگ اصلی (برند)" value={theme.primary_color} onChange={v => setTheme({ primary_color: v })} />
          <ColorField label="رنگ ثانویه (برند)" value={theme.secondary_color} onChange={v => setTheme({ secondary_color: v })} />
          <ColorField label="رنگ تاکیدی (برند)" value={theme.accent_color} onChange={v => setTheme({ accent_color: v })} />
          <ColorField label="رنگ پس‌زمینه" value={theme.background_color} onChange={v => setTheme({ background_color: v })} />
        </div>
        <p className="text-xs text-muted-foreground mt-4 mb-3">رنگ‌های متن</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
          <ColorField label="متن اصلی" value={theme.text_color} onChange={v => setTheme({ text_color: v })} />
          <ColorField label="متن ثانویه" value={theme.text_secondary_color} onChange={v => setTheme({ text_secondary_color: v })} />
          <ColorField label="متن سوم (کمرنگ‌تر)" value={theme.text_tertiary_color} onChange={v => setTheme({ text_tertiary_color: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-md mt-4">
          <div>
            <Label>گردی گوشه‌ها</Label>
            <Input value={theme.border_radius} onChange={e => setTheme({ border_radius: e.target.value })} placeholder="0.75rem" />
          </div>
          <div>
            <Label>شفافیت گلس ({theme.glass_opacity})</Label>
            <input type="range" min={0} max={1} step={0.01} value={theme.glass_opacity}
              onChange={e => setTheme({ glass_opacity: parseFloat(e.target.value) })}
              className="w-full" />
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <Save className="h-3 w-3 inline" /> تغییرات در پایگاه داده ذخیره می‌شوند و در همه دستگاه‌ها نمایش داده می‌شوند.
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold mb-3">بازنشانی تم</h2>
        <p className="text-xs text-muted-foreground mb-3">تم را به مقادیر پیش‌فرض برگردانید.</p>
        <PrimaryButton onClick={() => updateTheme.mutate({
          primary_color: DEFAULT_THEME_SETTINGS.primary_color,
          secondary_color: DEFAULT_THEME_SETTINGS.secondary_color,
          accent_color: DEFAULT_THEME_SETTINGS.accent_color,
          background_color: DEFAULT_THEME_SETTINGS.background_color,
          text_color: DEFAULT_THEME_SETTINGS.text_color,
          text_secondary_color: DEFAULT_THEME_SETTINGS.text_secondary_color,
          text_tertiary_color: DEFAULT_THEME_SETTINGS.text_tertiary_color,
          border_radius: DEFAULT_THEME_SETTINGS.border_radius,
          glass_opacity: DEFAULT_THEME_SETTINGS.glass_opacity,
        }, {
          onSuccess: () => toast.success("بازنشانی شد"),
          onError: (e) => toast.error(e.message),
        })}>بازنشانی تم</PrimaryButton>
      </Card>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-10 w-12 rounded border border-border shrink-0" />
        <Input dir="ltr" value={value} onChange={e => onChange(e.target.value)} className="font-mono text-xs" />
      </div>
    </div>
  );
}
