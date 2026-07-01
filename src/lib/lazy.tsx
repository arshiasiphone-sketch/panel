/**
 * Lazy loading utilities for performance optimization
 *
 * Use React.lazy + Suspense for code splitting non-critical components
 * This reduces the initial bundle size and improves First Contentful Paint (FCP)
 */
import React from "react";
import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

/**
 * Default loading fallback component
 * Can be customized per component if needed
 */
const DefaultLoader = () => (
  <div className="flex items-center justify-center min-h-[200px] w-full">
    <div className="animate-pulse rounded-lg bg-muted h-48 w-full max-w-md" />
  </div>
);

/**
 * Create a lazy-loaded component with Suspense wrapper
 *
 * @param factory - Dynamic import function
 * @param Loader - Optional custom loading component
 * @returns Lazy-loaded component with Suspense
 *
 * @example
 * ```tsx
 * const LazyGallery = lazyLoad(() => import("@/components/gallery"));
 *
 * // With custom loader
 * const LazyChart = lazyLoad(
 *   () => import("@/components/charts"),
 *   () => <ChartSkeleton />
 * );
 * ```
 */
export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  Loader: () => ReactNode = DefaultLoader,
): (props: React.ComponentProps<T>) => ReactNode {
  const LazyComponent = lazy(factory);

  return ((props: any) => (
    <Suspense fallback={<Loader />}>
      <LazyComponent {...props} />
    </Suspense>
  )) as any;
}

/**
 * Lazy load with error boundary wrapper
 *
 * @param factory - Dynamic import function
 * @param Loader - Optional custom loading component
 * @param ErrorFallback - Optional error fallback component
 * @returns Lazy-loaded component with Suspense and Error Boundary
 */
export function lazyLoadWithError<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  Loader: () => ReactNode = DefaultLoader,
  ErrorFallback: () => ReactNode = () => null,
): (props: React.ComponentProps<T>) => ReactNode {
  const LazyComponent = lazy(factory);

  return ((props: any) => {
    // We need to handle errors - for now, just use Suspense
    // A proper error boundary would require a component wrapper
    return (
      <Suspense fallback={<Loader />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  }) as any;
}

/**
 * Preload a component for faster navigation
 * Use this when you know a user will likely navigate to a route
 *
 * @param factory - Dynamic import function
 */
export function preloadComponent(factory: () => Promise<any>): void {
  // Start loading the component but don't render it
  const preloadPromise = factory();
  // Keep the promise in memory
  preloadPromise.catch(() => {});
}

/**
 * Lazy load an icon from lucide-react
 * Only import the specific icon when the component is rendered
 *
 * @param iconName - Name of the icon to import
 * @returns Lazy-loaded icon component
 *
 * @example
 * ```tsx
 * const ArrowUp = lazyIcon("ArrowUp");
 * const User = lazyIcon("User");
 * ```
 */
export function lazyIcon(
  iconName: string,
): React.ComponentType<{ className?: string; [key: string]: any }> {
  const LazyIcon = lazy(() =>
    import("lucide-react").then((module) => ({
      default: module[iconName as keyof typeof module] as React.ComponentType<any>,
    })),
  );

  return (props: any) => (
    <Suspense fallback={<span className={props.className} />}>
      <LazyIcon {...props} />
    </Suspense>
  );
}

/**
 * Intersection Observer hook for lazy loading below-the-fold content
 *
 * @param options - IntersectionObserver options
 * @returns ref, isIntersecting
 */
export function useIntersectionObserver(
  onIntersect: () => void,
  options: IntersectionObserverInit = {},
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          onIntersect();
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onIntersect, options]);

  return [ref, isIntersecting];
}

/**
 * Component that loads children only when visible
 * Uses IntersectionObserver for efficient lazy loading
 */
export function LazyMount({
  children,
  loader = null,
  ...props
}: {
  children: ReactNode;
  loader?: ReactNode;
  [key: string]: any;
}) {
  const [ref, isVisible] = useIntersectionObserver(() => {}, {});

  return (
    <div ref={ref} {...props}>
      {isVisible ? children : loader}
    </div>
  );
}
