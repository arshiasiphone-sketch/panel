/**
 * Theme Presets — a curated palette picker that fills the existing color form
 * fields with one click. It never bypasses the parent's persistence flow;
 * `onApply` receives the same patch shape the manual pickers already use.
 *
 * Features:
 * - Loading states during save
 * - Professional toast feedback
 * - Error handling
 * - Custom theme detection with base preset hint
 * - Collapsible advanced customization section
 * - 4-column desktop grid, 2-column tablet, horizontal scroll mobile
 */
import { memo, useCallback, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Sparkles, Palette, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  PRESET_SWATCH_KEYS,
  THEME_PRESETS,
  matchActivePreset,
  toThemePatch,
  type PresetWritableTheme,
  type ThemePreset,
} from "@/lib/theme-presets";

export type ThemePresetsCardProps = {
  /** Current theme (only the preset-writable subset matters for active match). */
  theme: PresetWritableTheme;
  /** Called with the preset patch. The caller persists it (same path as manual edits). */
  onApply: (patch: PresetWritableTheme) => Promise<void> | void;
  /** Optional: Called to check if a custom theme is active */
  isCustomTheme?: boolean;
  /** Optional: Base preset ID for custom theme display */
  basePresetId?: string | null;
  /** Optional: Callback when advanced section toggle changes */
  onAdvancedToggle?: (open: boolean) => void;
  /** Children rendered inside the advanced customization section (color pickers). */
  children?: ReactNode;
};

type PresetCardProps = {
  preset: ThemePreset;
  isActive: boolean;
  isLoading: boolean;
  onSelect: (preset: ThemePreset) => void;
};

const PRESET_ICONS: Record<string, string> = {
  "golden-hour": "☀️",
  "midnight-ocean": "🌊",
  "forest-mist": "🌲",
  "royal-velvet": "👑",
  "desert-sand": "🏜️",
  "arctic-dawn": "❄️",
  "sunset-coral": "🌅",
  "emerald-garden": "💚",
};

const PRESET_PERSONALITY: Record<string, string> = {
  "golden-hour": "گرم، میهمان‌نواز، کلاسیک",
  "midnight-ocean": "عمیق، حرفه‌ای، مطمئن",
  "forest-mist": "طبیعی، آرام‌بخش، آلی",
  "royal-velvet": "فاخر، جریء، درخشان",
  "desert-sand": "خنثی، مدرن، مینیمال",
  "arctic-dawn": "تمیز، پیشرو، سپید",
  "sunset-coral": "energic، دوستانه، زنده",
  "emerald-garden": "تازه، رشد، تعادل",
};

const PresetCard = memo(function PresetCard({
  preset,
  isActive,
  isLoading,
  onSelect,
}: PresetCardProps) {
  const handleClick = useCallback(() => {
    if (!isLoading) onSelect(preset);
  }, [preset, onSelect, isLoading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isLoading) onSelect(preset);
      }
    },
    [preset, onSelect, isLoading],
  );

  const icon = PRESET_ICONS[preset.id] || "🎨";
  const personality = PRESET_PERSONALITY[preset.id] || "شخصیت منحصر به فرد";

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={isActive}
      aria-label={`${preset.name} (${preset.nameEn}) - ${personality}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={[
        "group relative flex flex-col gap-2.5 rounded-2xl border bg-card/60 backdrop-blur-md",
        "p-3.5 text-right cursor-pointer outline-none",
        "transition-[box-shadow,border-color,background-color,opacity] duration-200",
        "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isLoading ? "opacity-60 cursor-not-allowed" : "",
        isActive
          ? "border-primary/60 bg-primary/5 shadow-[0_0_0_1px_var(--nama-primary),0_8px_32px_-12px_var(--nama-primary)] ring-1 ring-primary/20"
          : "border-border hover:border-foreground/20 hover:shadow-lg",
      ].join(" ")}
      disabled={isLoading}
      style={{
        boxShadow: isActive
          ? "0 0 0 1px var(--nama-primary), 0 8px 32px -12px var(--nama-primary), 0 0 20px -4px var(--nama-primary)"
          : undefined,
      }}
    >
      {isLoading ? (
        <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-card/80">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </span>
      ) : null}

      {/* Active indicator badge */}
      {isActive && (
        <span
          className="absolute -top-2 -left-2 z-10 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          aria-label="فعال"
        >
          <Check className="h-3 w-3" strokeWidth={3.5} />
          <span>فعال</span>
        </span>
      )}

      {/* Checkmark overlay */}
      <span
        aria-hidden="true"
        className={[
          "absolute top-2 left-2 grid h-6 w-6 place-items-center rounded-full",
          "bg-primary text-primary-foreground transition-all duration-200",
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none",
        ].join(" ")}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>

      {/* Header: Icon + Personality */}
      <div className="flex items-start gap-2.5">
        <span className="text-2xl leading-none shrink-0" aria-hidden="true" role="img">
          {icon}
        </span>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[10px] text-muted-foreground font-medium tracking-wide">
            {personality}
          </p>
          <h3 className="text-sm font-bold text-foreground truncate mt-0.5">{preset.name}</h3>
          <p className="text-[11px] font-medium text-muted-foreground" dir="ltr">
            {preset.nameEn}
          </p>
        </div>
      </div>

      {/* Labeled swatches */}
      <div className="space-y-1.5">
        {(
          [
            ["primary", "برند", true],
            ["secondary", "ثانویه", false],
            ["accent", "تاکید", false],
            ["background", "پس‌زمینه", false],
            ["surface", "سایه", false],
          ] as const
        ).map(([key, label, isPrimary]) => {
          const color = (preset as unknown as Record<string, string>)[key];
          if (!color) return null;
          return (
            <div
              key={key}
              className="flex items-center gap-2 text-[11px]"
              title={`${label}: ${color}`}
            >
              <span
                className={`h-4 w-4 rounded-full ring-1 ring-black/5 shrink-0 ${
                  isPrimary ? "ring-2 ring-primary/50" : ""
                }`}
                style={{ background: color }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground font-medium w-16 shrink-0">{label}</span>
              <span className="font-mono text-muted-foreground/70 truncate" dir="ltr">
                {color}
              </span>
            </div>
          );
        })}
      </div>

      {/* Subtle gradient top border for active */}
      {isActive && (
        <span
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, var(--nama-primary) 0%, var(--nama-accent) 100%)",
            opacity: 0.08,
            mask: "linear-gradient(to bottom, black 2px, transparent 2px, transparent calc(100% - 2px), black calc(100% - 2px))",
            WebkitMask:
              "linear-gradient(to bottom, black 2px, transparent 2px, transparent calc(100% - 2px), black calc(100% - 2px))",
          }}
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
});

export const ThemePresetsCard = memo(function ThemePresetsCard({
  theme,
  onApply,
  basePresetId,
  onAdvancedToggle,
  children,
}: ThemePresetsCardProps) {
  const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const activePreset = useMemo(() => matchActivePreset(theme), [theme]);
  const isCustomTheme = useMemo(() => !activePreset, [activePreset]);

  const handleSelect = useCallback(
    async (preset: ThemePreset) => {
      if (loadingPresetId) return;

      setLoadingPresetId(preset.id);
      setLastError(null);

      try {
        await onApply(toThemePatch(preset) as unknown as PresetWritableTheme);

        toast.success(`تم "${preset.name}" با موفقیت اعمال شد.`, {
          duration: 3000,
          description: `Theme "${preset.nameEn}" applied successfully.`,
          className: "glassmorphism-toast",
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setLastError(errorMessage);

        toast.error("اعمال تم انجام نشد. لطفاً دوباره تلاش کنید.", {
          duration: 3000,
          description: "Unable to apply theme. Please try again.",
          action: {
            label: "Retry",
            onClick: () => handleSelect(preset),
          },
          className: "glassmorphism-toast",
        });
      } finally {
        setLoadingPresetId(null);
      }
    },
    [onApply, loadingPresetId],
  );

  const basePreset = useMemo(() => {
    if (!basePresetId) return null;
    return THEME_PRESETS.find((p) => p.id === basePresetId) || null;
  }, [basePresetId]);

  const handleAdvancedToggle = useCallback(
    (open: boolean) => {
      setAdvancedOpen(open);
      onAdvancedToggle?.(open);
    },
    [onAdvancedToggle],
  );

  return (
    <div
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-3"
      role="region"
      aria-label="Theme Presets"
    >
      {/* Header */}
      <div className="p-5 border-b border-border/50 bg-gradient-to-b from-card to-card/50">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Palette className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-sm font-semibold">قالب‌های آماده تم</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              با یک کلیک یک پالت رنگ حرفه‌ای انتخاب کنید.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isCustomTheme ? (
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[11px] font-medium border border-primary/20">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                <span>تم سفارشی</span>
                {basePreset && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-primary/20 text-[10px] font-mono">
                    بر پایه {basePreset.name}
                  </span>
                )}
              </span>
            ) : activePreset ? (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald/10 text-emerald px-2.5 py-1 text-[11px] font-medium border border-emerald/20">
                <Check className="h-3 w-3" aria-hidden="true" strokeWidth={3} />
                <span>فعال: </span>
                <span className="font-semibold">{activePreset.name}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Preset Grid */}
      <div className="p-5">
        <div
          role="radiogroup"
          aria-label="انتخاب قالب رنگ"
          className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
        >
          {THEME_PRESETS.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isActive={activePreset?.id === preset.id}
              isLoading={loadingPresetId === preset.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Advanced Customization - Collapsible */}
      <details
        className="group border-t border-border/50 bg-muted/20"
        open={advancedOpen}
        onToggle={(e) => {
          const open = (e.target as HTMLDetailsElement).open;
          handleAdvancedToggle(open);
        }}
      >
        <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">شخصی‌سازی پیشرفته</span>
            <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-background border border-border">
              ویرایش دستی توکن‌ها
            </span>
          </div>
          <ChevronDown
            className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180 shrink-0"
            aria-hidden="true"
          />
        </summary>
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-xs text-muted-foreground mb-3 text-right">
            تغییرات اینجا مستقیماً روی تم اعمال می‌شوند. برای بازگشت، یکی از قالب‌های بالا را انتخاب
            کنید.
          </p>
          <div id="advanced-color-pickers" className="space-y-4">
            {children}
          </div>
        </div>
      </details>
    </div>
  );
});
