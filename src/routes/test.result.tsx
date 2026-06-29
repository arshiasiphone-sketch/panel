import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { TestPageShell } from "@/components/test/test-page-shell";
import { useTheme, fetchThemeSettings, QK } from "@/lib/cms";
import { useTestStore, useHasHydrated } from "@/lib/test-store";
import { PERSONALITY_PROFILES, calculateScores, type PersonalityType } from "@/lib/test-data";
import { useResolvedProfiles } from "@/lib/personality-store";

export const Route = createFileRoute("/test/result")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({ queryKey: QK.theme, queryFn: fetchThemeSettings });
  },
  head: () => ({ meta: [{ title: "نتیجه‌ی تست شخصیت — کافه خانه" }] }),
  component: ResultPage,
});

const ALL_TYPES: PersonalityType[] = ["paparoch", "zhampin", "fofino", "gombak"];

function fireConfetti(color: string, accent: string, foreground: string) {
  const end = Date.now() + 2000;
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 58, origin: { x: 0 }, colors: [color, accent, foreground], zIndex: 9999 });
    confetti({ particleCount: 4, angle: 120, spread: 58, origin: { x: 1 }, colors: [color, accent, foreground], zIndex: 9999 });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

function SteamParticle({ delay, x }: { delay: number; x: string }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute rounded-full pointer-events-none"
      style={{ width: 6, height: 6, background: "rgba(255,255,255,0.18)", left: x, bottom: "105%", filter: "blur(2px)" }}
      animate={{ y: [0, -36, -68], x: [0, 5, -4], opacity: [0, 0.5, 0], scale: [0.6, 1.2, 0.3] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

function ScoreBar({ label, score, maxScore, color, revealed, index }: {
  label: string; score: number; maxScore: number; color: string; revealed: boolean; index: number;
}) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: revealed ? 1 : 0, x: revealed ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color }}>{label}</span>
        <span className="text-xs font-semibold text-text-tertiary/70">{score} امتیاز</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: revealed ? `${pct}%` : "0%" }}
          transition={{ duration: 0.8, delay: 1.5 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(90deg, ${color}66, ${color})`, boxShadow: `0 0 8px ${color}44` }}
        />
      </div>
    </motion.div>
  );
}

function ShareCard({ label, color, borderColor, bgColor, scores, maxScore, userName, pageBackground, accentColor, textSecondaryColor, textTertiaryColor }: {
  label: string; color: string; borderColor: string; bgColor: string;
  scores: Record<string, number>; maxScore: number; userName?: string;
  pageBackground: string;
  accentColor: string;
  textSecondaryColor: string;
  textTertiaryColor: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const el = document.getElementById("share-card-source");
      if (!el) return;
      const canvas = await html2canvas(el, { backgroundColor: pageBackground, scale: 2, logging: false, useCORS: true });
      setDataUrl(canvas.toDataURL("image/png"));
    } catch { /* ignore */ }
    finally { setGenerating(false); }
  }, [pageBackground]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `kafekhaneh-result.png`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        id="share-card-source"
        style={{
          position: "absolute", left: "-9999px", top: 0,
          width: 380, padding: 32, background: pageBackground,
          fontFamily: "Tahoma, sans-serif", direction: "rtl",
          borderRadius: 20, border: `1px solid ${borderColor}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: accentColor, fontSize: 10, letterSpacing: "0.22em", fontWeight: 700 }}>کافه خانه · ۱۴۰۵</span>
            {userName && <span style={{ color: textSecondaryColor, fontSize: 10 }}>{userName}</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color, fontSize: 32, fontWeight: 900 }}>{label}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {ALL_TYPES.map((t) => {
              const p = PERSONALITY_PROFILES[t];
              const sc = scores[t] ?? 0;
              const pct = maxScore > 0 ? Math.round((sc / maxScore) * 100) : 0;
              return (
                <div key={t} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: p.color, fontSize: 11, fontWeight: 700 }}>{p.label}</span>
                    <span style={{ color: textTertiaryColor, fontSize: 10, opacity: 0.7 }}>{sc}</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", height: 5, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: p.color, borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <span style={{ color: textTertiaryColor, fontSize: 9, textAlign: "center", opacity: 0.6 }}>kafekhaneh.ir</span>
        </div>
      </div>

      {dataUrl ? (
        <div className="flex flex-col gap-2">
          <img src={dataUrl} alt="کارت اشتراک‌گذاری" className="w-full rounded-2xl border" style={{ borderColor }} />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={download}
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: bgColor, border: `1px solid ${borderColor}`, color }}
          >دانلود تصویر</motion.button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={generate} disabled={generating}
          className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-text-tertiary"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
        >{generating ? "در حال ساخت..." : "ساخت کارت اشتراک‌گذاری"}</motion.button>
      )}
    </div>
  );
}

function ResultPage() {
  const navigate = useNavigate();
  const hasHydrated = useHasHydrated();
  const { data: theme } = useTheme();
  const pageBackground = theme?.background_color ?? "#0d0a0e";
  const accentColor = theme?.accent_color ?? "#d4af37";
  const foregroundColor = theme?.text_color ?? "#f0e6d3";
  const { lastResult, lastResponse, resetTest } = useTestStore();
  const profiles = useResolvedProfiles();
  const [revealed, setRevealed] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const confettiFired = useRef(false);

  const tied = lastResponse?.tied ?? (lastResult ? [lastResult] : []);
  const isHybrid = tied.length > 1;
  const visualProfile = isHybrid ? profiles["bedone"] : (lastResult ? profiles[lastResult] : null);
  const displayLabel = isHybrid ? tied.map((t) => profiles[t].label).join(" + ") : visualProfile?.label ?? "";
  const displayTagline = isHybrid ? "ترکیبی از چند تیپ — قدرت تو در تنوعه" : visualProfile?.tagline ?? "";
  const displayDescription = isHybrid
    ? `شخصیت تو ترکیبی از ${tied.map((t) => profiles[t].label).join(" و ")} است. بسته به موقعیت، یکی از این وجه‌ها در تو پررنگ‌تره.`
    : visualProfile?.description ?? "";
  const displayTraits = isHybrid
    ? Array.from(new Set(tied.flatMap((t) => profiles[t].traits))).slice(0, 6)
    : visualProfile?.traits ?? [];
  const displayDrink = isHybrid ? tied.map((t) => profiles[t].drink).join(" یا ") : visualProfile?.drink ?? "";
  const displaySpot = isHybrid ? tied.map((t) => profiles[t].spot).join(" / ") : visualProfile?.spot ?? "";

  const scores = lastResponse?.answers
    ? calculateScores(lastResponse.answers as Record<number, string>)
    : null;
  const maxScore = scores ? Math.max(...Object.values(scores), 1) : 1;

  useEffect(() => {
    if (!hasHydrated) return;
    if (!lastResult) { navigate({ to: "/", replace: true }); return; }
    const t = setTimeout(() => {
      setRevealed(true);
      if (!confettiFired.current && visualProfile) {
        confettiFired.current = true;
        fireConfetti(visualProfile.color, accentColor, foregroundColor);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [hasHydrated, lastResult, navigate, visualProfile, accentColor, foregroundColor]);

  function handleRetake() { resetTest(); navigate({ to: "/test/info" }); }

  if (!hasHydrated) {
    return (
      <TestPageShell className="flex items-center justify-center">
        <motion.div
          className="relative z-10 w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
      </TestPageShell>
    );
  }

  if (!visualProfile) return null;
  const profile = visualProfile;

  return (
    <TestPageShell
      className="flex flex-col items-center justify-center px-4 py-12"
      orbPrimary={profile.color}
    >
      <div className="w-full max-w-md flex flex-col gap-6 relative z-10">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
          نتیجه‌ی تست شخصیت کافه‌ای
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 28 }}
          animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.9, y: revealed ? 0 : 28 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl p-7 flex flex-col items-center gap-5 text-center relative overflow-hidden"
          style={{ background: profile.bgColor, border: `1px solid ${profile.borderColor}`, backdropFilter: "blur(24px)", boxShadow: `0 0 80px ${profile.color}1a` }}
        >
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${profile.color}14, transparent)` }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: revealed ? 1 : 0, rotate: revealed ? 0 : -20 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200, damping: 18 }}
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: profile.bgColor, border: `2px solid ${profile.borderColor}`, boxShadow: `0 0 48px ${profile.color}44` }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={profile.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
            </svg>
            {revealed && (
              <>
                <SteamParticle delay={0} x="22%" />
                <SteamParticle delay={0.8} x="50%" />
                <SteamParticle delay={1.5} x="74%" />
              </>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16 }} transition={{ duration: 0.6, delay: 0.55 }} className="flex flex-col gap-1.5 relative z-10">
            <h1 className="text-4xl font-extrabold" style={{ color: profile.color }}>{displayLabel}</h1>
            <p className="text-sm font-semibold text-accent">{displayTagline}</p>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: revealed ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.85 }} className="text-sm leading-[1.85] relative z-10 text-text-tertiary">
            {displayDescription}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="rounded-2xl p-5 flex flex-col gap-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">تفکیک امتیاز</p>
          </div>
          <div className="flex flex-col gap-3">
            {ALL_TYPES.map((t, i) => {
              const p = PERSONALITY_PROFILES[t];
              return (
                <ScoreBar
                  key={t} label={p.label}
                  score={scores ? scores[t] ?? 0 : 0}
                  maxScore={maxScore} color={p.color}
                  revealed={revealed} index={i}
                />
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col gap-3"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ویژگی‌های شخصیتی</p>
          <div className="flex flex-wrap gap-2">
            {displayTraits.map((trait, i) => (
              <motion.span
                key={trait}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.75 }}
                transition={{ delay: 1.05 + i * 0.08, duration: 0.32 }}
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: profile.bgColor, border: `1px solid ${profile.borderColor}`, color: profile.color }}
              >{trait}</motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16 }}
          transition={{ duration: 0.6, delay: 1.35 }}
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">توی کافه خانه</p>
          <div className="flex flex-col gap-3">
            {[{ label: "نوشیدنی پیشنهادی", value: displayDrink }, { label: "بهترین جای نشستن", value: displaySpot }].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="flex flex-col gap-2"
        >
          <button
            onClick={() => setShowShare((s) => !s)}
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-sm font-semibold cursor-pointer text-text-tertiary"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span>اشتراک‌گذاری نتیجه</span>
            <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" animate={{ rotate: showShare ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </button>
          <AnimatePresence>
            {showShare && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                <ShareCard
                  label={displayLabel}
                  color={profile.color}
                  bgColor={profile.bgColor}
                  borderColor={profile.borderColor}
                  scores={scores ?? { paparoch: 0, zhampin: 0, fofino: 0, gombak: 0 }}
                  maxScore={maxScore}
                  userName={lastResponse?.userInfo?.fullName}
                  pageBackground={pageBackground}
                  accentColor={accentColor}
                  textSecondaryColor={theme?.text_secondary_color ?? "#9a8a78"}
                  textTertiaryColor={theme?.text_tertiary_color ?? "#c9b89e"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16 }}
          transition={{ duration: 0.6, delay: 1.75 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            onClick={handleRetake}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl text-base font-bold cursor-pointer text-foreground"
            style={{ background: "linear-gradient(135deg, #9f1239 0%, #be123c 100%)", boxShadow: "0 0 32px rgba(159,18,57,0.32)", letterSpacing: "0.02em" }}
          >دوباره تست بده</motion.button>
          <Link to="/" className="w-full">
            <button className="w-full py-3 rounded-2xl text-sm font-medium cursor-pointer text-muted-foreground" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              برگشت به خانه
            </button>
          </Link>
        </motion.div>
      </div>
    </TestPageShell>
  );
}
