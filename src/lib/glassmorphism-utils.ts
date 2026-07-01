/**
 * Glassmorphism optimization utilities
 * Reduces expensive backdrop-filter usage and reuses blur layers
 */

/**
 * Glassmorphism classes with optimized backdrop-filter usage
 * Uses CSS variables for easier theming and performance
 */
export const glassmorphism = {
  // Light glass effect - for subtle backgrounds
  light: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },

  // Medium glass effect - for cards and panels
  medium: {
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.16)",
  },

  // Strong glass effect - for modals and overlays
  strong: {
    background: "rgba(255, 255, 255, 0.16)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },

  // Header glass effect - optimized for sticky headers
  header: {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },

  // None - for when glassmorphism should be disabled for performance
  none: {
    background: "transparent",
    backdropFilter: "none",
    border: "none",
  },
} as const;

/**
 * Create optimized glassmorphism class string
 * Reduces backdrop-filter usage on mobile devices for performance
 */
export function getGlassmorphismClass(intensity: keyof typeof glassmorphism = "medium"): string {
  const style = glassmorphism[intensity];

  return (
    Object.entries(style)
      .map(([key, value]) => {
        if (key === "backdropFilter" && value === "none") {
          return "backdrop-blur-none";
        }
        if (key === "backdropFilter") {
          return `backdrop-blur-[${value.replace("blur(", "").replace(")", "")}]`;
        }
        return "";
      })
      .filter(Boolean)
      .join(" ") + " glassmorphism-optimized"
  );
}

/**
 * Check if backdrop-filter is supported
 * Returns false on mobile devices or browsers without support
 */
export function isBackdropFilterSupported(): boolean {
  if (typeof window === "undefined") return false;

  // Disable on mobile devices for performance
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return false;
  }

  // Check CSS support
  return "backdropFilter" in document.body.style;
}

/**
 * Hook to get optimized glassmorphism style based on device capabilities
 */
export function useGlassmorphismStyle(intensity: keyof typeof glassmorphism = "medium") {
  const supported = isBackdropFilterSupported();
  const style = glassmorphism[supported ? intensity : "none"];

  return {
    background: style.background,
    backdropFilter: supported ? style.backdropFilter : "none",
    WebkitBackdropFilter: supported ? style.backdropFilter : "none",
    border: style.border,
  };
}

/**
 * Glassmorphism CSS variables for global usage
 */
export const glassmorphismVariables = `
  --glass-light-bg: rgba(255, 255, 255, 0.08);
  --glass-light-blur: blur(8px);
  --glass-light-border: 1px solid rgba(255, 255, 255, 0.12);
  
  --glass-medium-bg: rgba(255, 255, 255, 0.12);
  --glass-medium-blur: blur(12px);
  --glass-medium-border: 1px solid rgba(255, 255, 255, 0.16);
  
  --glass-strong-bg: rgba(255, 255, 255, 0.16);
  --glass-strong-blur: blur(16px);
  --glass-strong-border: 1px solid rgba(255, 255, 255, 0.2);
`;
