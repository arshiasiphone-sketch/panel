/**
 * Animation utilities optimized for performance
 * Uses GPU-accelerated properties and respects prefers-reduced-motion
 */
import React from "react";
import { useEffect, useState } from "react";
import { type HTMLMotionProps, motion } from "framer-motion";

/**
 * Check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Animation props that respect prefers-reduced-motion
 * Returns empty props when user prefers reduced motion
 */
export function getMotionProps(
  props: HTMLMotionProps<"div">,
  prefersReducedMotion: boolean
): HTMLMotionProps<"div"> {
  if (prefersReducedMotion) {
    return {
      ...props,
      initial: undefined,
      animate: undefined,
      transition: undefined,
      whileHover: undefined,
      whileTap: undefined,
      whileInView: undefined,
    };
  }
  return props;
}

/**
 * Optimized fade-up animation using GPU-accelerated properties
 * Uses transform and opacity for better performance
 */
export const fadeUp = {
  hidden: { 
    opacity: 0, 
    y: 28,
    // Use will-change for GPU acceleration hint
  },
  show: { 
    opacity: 1, 
    y: 0,
  },
} as const;

/**
 * Optimized fade animation
 */
export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
} as const;

/**
 * Optimized scale animation
 */
export const scale = {
  hidden: { opacity: 0, scale: 0.75 },
  show: { opacity: 1, scale: 1 },
} as const;

/**
 * Motion div with built-in prefers-reduced-motion support
 * Automatically disables animations when user prefers reduced motion
 */
export function OptimizedMotion({
  children,
  prefersReducedMotion: externalPrefersReducedMotion,
  ...props
}: {
  children: React.ReactNode;
  prefersReducedMotion?: boolean;
} & HTMLMotionProps<"div">) {
  const internalPrefersReducedMotion = usePrefersReducedMotion();
  const shouldReduceMotion = externalPrefersReducedMotion ?? internalPrefersReducedMotion;

  const safeProps = shouldReduceMotion ? {
    ...props,
    initial: undefined,
    animate: undefined,
    transition: undefined,
    whileHover: undefined,
    whileTap: undefined,
    whileInView: undefined,
  } : props;

  return <motion.div {...safeProps}>{children}</motion.div>;
}

/**
 * Viewport configuration for better performance
 * Uses margin to trigger animations earlier for smoother experience
 */
export const viewportConfig = {
  once: true, // Only animate once
  margin: "-100px", // Trigger 100px before entering viewport
} as const;

/**
 * Transition configuration optimized for performance
 * Uses spring for natural motion, cubic-bezier for predictable timing
 */
export const transitionConfig = {
  type: "spring" as const,
  damping: 25,
  stiffness: 300,
  duration: 0.65,
} as const;

/**
 * Easing presets for consistent animations
 */
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1] as const,
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeIn: [0.43, 0, 0.53, 0.96] as const,
} as const;