import { create } from "zustand";
import type { PersonalityType } from "./test-data";
import type { StoredTestResponse } from "./test-db";

export interface UserInfo {
  fullName: string;
  phone: string;
  age: number;
  gender: string;
}

/** In-memory session state for the active test run only (not persisted). */
interface TestStore {
  testStarted: boolean;
  userInfo: UserInfo | null;
  answers: Record<number, string>;
  lastResult: PersonalityType | null;
  lastResponse: StoredTestResponse | null;

  setUserInfo: (info: UserInfo) => void;
  startTest: () => void;
  setAnswer: (questionId: number, optionId: string) => void;
  setCompletedResponse: (response: StoredTestResponse) => void;
  resetTest: () => void;
}

export const useTestStore = create<TestStore>()((set) => ({
  testStarted: false,
  userInfo: null,
  answers: {},
  lastResult: null,
  lastResponse: null,

  setUserInfo: (info) => set({ userInfo: info }),
  startTest: () => set({ testStarted: true, answers: {}, lastResult: null, lastResponse: null }),
  setAnswer: (questionId, optionId) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: optionId } })),
  setCompletedResponse: (response) =>
    set({ lastResult: response.result, lastResponse: response }),
  resetTest: () =>
    set({ testStarted: false, answers: {}, lastResult: null, lastResponse: null, userInfo: null }),
}));

/** Session store is synchronous — always ready. */
export function useHasHydrated() {
  return true;
}
