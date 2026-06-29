/**
 * Ephemeral UI state for the admin panel save indicator only.
 * All CMS and production data lives in Supabase — see src/lib/cms.ts.
 */
import { create } from "zustand";
import { touchLocalCmsEdit } from "@/lib/cms-sync";

interface AdminState {
  saveStatus: "idle" | "saving" | "saved";
  setSaveStatus: (s: AdminState["saveStatus"]) => void;
}

export const useAdmin = create<AdminState>()((set) => ({
  saveStatus: "idle",
  setSaveStatus: (saveStatus) => set({ saveStatus }),
}));

let saveTimer: ReturnType<typeof setTimeout> | undefined;
let idleTimer: ReturnType<typeof setTimeout> | undefined;
export function triggerSave() {
  const s = useAdmin.getState();
  s.setSaveStatus("saving");
  if (saveTimer) clearTimeout(saveTimer);
  if (idleTimer) clearTimeout(idleTimer);
  saveTimer = setTimeout(() => {
    s.setSaveStatus("saved");
    idleTimer = setTimeout(() => s.setSaveStatus("idle"), 1500);
  }, 600);
  touchLocalCmsEdit();
}
