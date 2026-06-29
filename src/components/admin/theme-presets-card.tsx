/**
 * Theme Presets — a curated palette picker that fills the existing color form
 * fields with one click. It never bypasses the parent's persistence flow;
 * `onApply` receives the same patch shape the manual pickers already use.
 *
 * Features:
 * - Loading states during save
 * - Professional toast feedback
 * - Error handling
 * - Custom theme detection
 */
import { memo, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
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
};

type PresetCardProps = {
  preset: ThemePreset;
  isActive: boolean;
  isLoading: boolean;
  onSelect: (preset: ThemePreset) => void;
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

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={isActive}
      aria-label={`${preset.name} (${preset.nameEn})`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: isLoading ? 1 : 1.03 }}
      whileTap={{ scale: isLoading ? 1 : 0.99 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={[
        "group relative flex flex-col gap-3 rounded-2xl border bg-card/60 backdrop-blur-md",
        "px-3.5 py-3 text-right cursor-pointer outline-none",
        "shadow-sm hover:shadow-md transition-[box-shadow,border-color,background-color,opacity] duration-200",
        "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isLoading ? "opacity-60 cursor-not-allowed" : "",
        isActive
          ? "border-foreground/80 bg-card shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.25)]"
          : "border-border hover:border-foreground/30",
      ].join(" ")}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
        </span>
      ) : null}

      <span
        aria-hidden="true"
        className={[
          "absolute top-2 left-2 grid h-6 w-6 place-items-center rounded-full",
          "bg-foreground text-background transition-all duration-200",
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-75",
        ].join(" ")}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>

      <div
        className="flex items-center gap-1.5 rounded-xl p-2"
        style={{ background: preset.background }}
      >
        {PRESET_SWATCH_KEYS.map((key) => (
          <span
            key={key}
            aria-hidden="true"
            className="h-5 w-5 rounded-full ring-1 ring-black/5"
            style={{ background: preset[key] }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-foreground">{preset.name}</span>
        <span className="text-[11px] font-medium text-muted-foreground" dir="ltr">
          {preset.nameEn}
        </span>
      </div>
    </motion.button>
  );
});

export const ThemePresetsCard = memo(function ThemePresetsCard({
  theme,
  onApply,
}: ThemePresetsCardProps) {
  const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const activePreset = useMemo(() => matchActivePreset(theme), [theme]);
  const isCustomTheme = useMemo(() => !activePreset, [activePreset]);

  const handleSelect = useCallback(
    async (preset: ThemePreset) => {
      // Prevent double-click
      if (loadingPresetId) return;

      setLoadingPresetId(preset.id);
      setLastError(null);

      try {
        await onApply(toThemePatch(preset));

        // Show success toast with Persian message
        toast.success(`تم "${preset.name}" با موفقیت اعمال شد.`, {
          duration: 3000,
          description: `Theme "${preset.nameEn}" applied successfully.`,
          className: "glassmorphism-toast",
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setLastError(errorMessage);

        // Show error toast
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

  return (
    <div
      className="rounded-2xl border border-border bg-card shadow-sm p-5 mb-3"
      role="region"
      aria-label="Theme Presets"
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <div>
          <h2 className="text-sm font-semibold">قالب‌های آماده تم</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            با یک کلیک یک پالت رنگ حرفه‌ای انتخاب کنید.
          </p>
        </div>
        {isCustomTheme ? (
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <span aria-hidden="true">🎨</span>
            <span>تم سفارشی</span>
          </span>
        ) : activePreset ? (
          <span className="text-[11px] text-muted-foreground">
            فعال: <span className="text-foreground font-medium">{activePreset.name}</span>
          </span>
        ) : null}
      </div>

      <div
        role="radiogroup"
        aria-label="انتخاب قالب رنگ"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
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
  );
});
