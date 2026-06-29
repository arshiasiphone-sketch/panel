import { QUESTIONS, type Question, type PersonalityType, type ScoreBreakdown } from "./test-data";
import { resolveQuestion, getActiveQuestionIds } from "@/lib/test-questions";
import { useTestQuestionsConfig } from "@/lib/test-db";

/** Hook returning enabled, ordered, override-merged questions for the live test */
export function useActiveQuestions(): Question[] {
  const { data: config } = useTestQuestionsConfig();
  const overrides = config?.overrides ?? {};
  const ids = getActiveQuestionIds(config ?? { overrides: {}, orderedIds: null });
  return ids
    .map((id) => resolveQuestion(id, overrides))
    .filter((q): q is NonNullable<ReturnType<typeof resolveQuestion>> => !!q && q.enabled !== false) as Question[];
}

/** Non-hook variant used for scoring stored answers (snapshot at submission time) */
export function getActiveQuestionsSnapshot(config: { overrides: Record<number, import("./test-questions").QuestionOverride>; orderedIds: number[] | null }): Question[] {
  const ids = getActiveQuestionIds(config);
  return ids
    .map((id) => resolveQuestion(id, config.overrides))
    .filter((q): q is NonNullable<ReturnType<typeof resolveQuestion>> => !!q && q.enabled !== false) as Question[];
}

export function calculateScoresFor(answers: Record<number, string>, questions: Question[]): ScoreBreakdown {
  const counts: ScoreBreakdown = { paparoch: 0, zhampin: 0, fofino: 0, gombak: 0 };
  for (const [qIdStr, optId] of Object.entries(answers)) {
    const q = questions.find((x) => x.id === Number(qIdStr));
    if (!q || !q.categorized) continue;
    const opt = q.options.find((o) => o.id === optId);
    if (opt?.type && opt.type !== "bedone" && opt.type in counts) {
      counts[opt.type as keyof ScoreBreakdown]++;
    }
  }
  return counts;
}

export interface DetailedResult {
  primary: PersonalityType;
  tied: PersonalityType[];
  scores: ScoreBreakdown;
}

export function calculateDetailedResultFor(answers: Record<number, string>, questions: Question[]): DetailedResult {
  const scores = calculateScoresFor(answers, questions);
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted[0][1];
  if (top === 0) return { primary: "bedone", tied: ["bedone"], scores };
  const tied = sorted.filter(([, v]) => v === top).map(([k]) => k as PersonalityType);
  return { primary: tied.length > 1 ? "bedone" : tied[0], tied, scores };
}
