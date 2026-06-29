import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TestPageShell } from "@/components/test/test-page-shell";
import { useTestStore, useHasHydrated } from "@/lib/test-store";
import { useActiveQuestions, calculateDetailedResultFor, getActiveQuestionsSnapshot } from "@/lib/test-resolved";
import { useSubmitTestResponse, useTestQuestionsConfig } from "@/lib/test-db";
import { EMPTY_TEST_QUESTIONS } from "@/lib/test-questions";
import { fetchThemeSettings, QK } from "@/lib/cms";

export const Route = createFileRoute("/test/$step")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({ queryKey: QK.theme, queryFn: fetchThemeSettings });
  },
  component: QuestionPage,
});

function QuestionPage() {
  const navigate = useNavigate();
  const { step } = useParams({ from: "/test/$step" });
  const stepNum = Number(step);

  const hasHydrated = useHasHydrated();
  const { answers, setAnswer, testStarted, setCompletedResponse, userInfo } = useTestStore();
  const { data: config } = useTestQuestionsConfig();
  const submitResponse = useSubmitTestResponse();
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const activeQuestions = useActiveQuestions();
  const TOTAL = activeQuestions.length;
  const question = activeQuestions[stepNum - 1];
  const selected = question ? answers[question.id] ?? null : null;

  useEffect(() => {
    if (!hasHydrated) return;
    if (!userInfo) {
      navigate({ to: "/test/info", replace: true });
    } else if (!testStarted) {
      navigate({ to: "/", replace: true });
    }
  }, [hasHydrated, testStarted, userInfo, navigate]);

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

  if (!question) return null;

  function handleSelect(optionId: string) {
    setAnswer(question.id, optionId);
  }

  async function handleNext() {
    if (!selected || submitting) return;

    if (stepNum === TOTAL) {
      setSubmitting(true);
      const detailed = calculateDetailedResultFor(answers, getActiveQuestionsSnapshot(config ?? EMPTY_TEST_QUESTIONS));
      try {
        const saved = await submitResponse.mutateAsync({
          answers,
          result: detailed.primary,
          tied: detailed.tied,
          userInfo: userInfo ?? undefined,
        });
        setCompletedResponse(saved);
        navigate({ to: "/test/result" });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "ذخیره نتیجه ناموفق بود. دوباره تلاش کنید.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setDirection(1);
      navigate({ to: "/test/$step", params: { step: String(stepNum + 1) } });
    }
  }

  function handleBack() {
    if (stepNum === 1) { navigate({ to: "/test/info" }); return; }
    setDirection(-1);
    navigate({ to: "/test/$step", params: { step: String(stepNum - 1) } });
  }

  const progress = (stepNum / TOTAL) * 100;

  return (
    <TestPageShell className="flex flex-col items-center justify-center px-4 py-12" particleCount={60}>
      <div className="w-full max-w-lg relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>سوال {stepNum} از {TOTAL}</span>
            <span>{Math.round(progress)}٪</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #9f1239, #d4af37)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepNum}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <h2
              id={`question-${question.id}-label`}
              className="text-xl sm:text-2xl font-extrabold leading-relaxed text-balance text-foreground"
            >
              {question.text}
            </h2>

            <div
              role="radiogroup"
              aria-labelledby={`question-${question.id}-label`}
              className="flex flex-col gap-3"
            >
              {question.options.map((opt) => {
                const isSelected = selected === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelect(opt.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-right px-5 py-4 rounded-2xl text-sm font-semibold transition cursor-pointer ${isSelected ? "text-foreground" : "text-text-tertiary"}`}
                    style={{
                      background: isSelected ? "rgba(159,18,57,0.18)" : "rgba(255,255,255,0.04)",
                      border: isSelected ? "1px solid rgba(159,18,57,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isSelected ? "0 0 24px rgba(159,18,57,0.2)" : "none",
                    }}
                  >
                    {opt.text}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          <button
            onClick={handleBack}
            disabled={submitting}
            className="flex-1 py-3.5 rounded-2xl text-sm font-semibold cursor-pointer disabled:opacity-50 text-muted-foreground"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            قبلی
          </button>
          <button
            onClick={handleNext}
            disabled={!selected || submitting}
            className="flex-[2] py-3.5 rounded-2xl text-sm font-bold cursor-pointer disabled:opacity-40 text-foreground"
            style={{
              background: "linear-gradient(135deg, #9f1239 0%, #be123c 100%)",
              boxShadow: "0 0 32px rgba(159,18,57,0.32)",
            }}
          >
            {submitting ? "در حال ذخیره..." : stepNum === TOTAL ? "مشاهده نتیجه" : "بعدی"}
          </button>
        </div>
      </div>
    </TestPageShell>
  );
}
