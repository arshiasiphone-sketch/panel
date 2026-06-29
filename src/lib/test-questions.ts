import { QUESTIONS, type PersonalityType, type Option } from "./test-data";

export interface OptionOverride { text?: string; type?: PersonalityType | null }
export interface QuestionOverride {
  text?: string;
  enabled?: boolean;
  order?: number;
  options?: Record<string, OptionOverride>;
}
export interface TestQuestionsConfig {
  overrides: Record<number, QuestionOverride>;
  orderedIds: number[] | null;
}

export const EMPTY_TEST_QUESTIONS: TestQuestionsConfig = { overrides: {}, orderedIds: null };

/** Resolve a single question merged with overrides */
export function resolveQuestion(id: number, overrides: Record<number, QuestionOverride>) {
  const base = QUESTIONS.find((q) => q.id === id);
  if (!base) return null;
  const ovr = overrides[id] ?? {};
  return {
    ...base,
    text: ovr.text ?? base.text,
    enabled: ovr.enabled ?? true,
    options: base.options.map((o): Option => {
      const opt = ovr.options?.[o.id];
      return { ...o, text: opt?.text ?? o.text, type: opt?.type !== undefined ? opt.type : o.type };
    }),
  };
}

export function getActiveQuestionIds(config: TestQuestionsConfig): number[] {
  const baseIds = QUESTIONS.map((q) => q.id);
  return config.orderedIds && config.orderedIds.length === baseIds.length ? config.orderedIds : baseIds;
}
