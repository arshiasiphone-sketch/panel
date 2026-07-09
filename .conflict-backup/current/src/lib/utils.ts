import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID using crypto.randomUUID().
 * Falls back to a timestamp + random string for environments without crypto.
 */
export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + random segment
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
