import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
<<<<<<< HEAD

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
=======
>>>>>>> acabcc222a0b62f2804abdaf20ce2cd7be8a560a
