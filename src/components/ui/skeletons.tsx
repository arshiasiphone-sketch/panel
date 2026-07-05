/**
 * Skeleton loading components for lazy-loaded content
 * Improves perceived performance by showing placeholders while content loads
 */
import { type HTMLAttributes } from "react";

/** Base Skeleton component with pulse animation */
export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Text skeleton - for headings, paragraphs, etc. */
export function TextSkeleton({
  lines = 1,
  width = "100%",
  className = "",
}: {
  lines?: number;
  width?: string | number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === 0 ? width : Math.max(50, Math.random() * 100) + "%" }}
        />
      ))}
    </div>
  );
}

/** Card skeleton */
export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 ${className}`} aria-hidden="true">
      <Skeleton className="h-4 w-3/4 mb-3" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
}

/** Image skeleton with aspect ratio */
export function ImageSkeleton({
  aspectRatio = "16/9",
  className = "",
}: {
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-muted ${className}`}
      style={{ aspectRatio }}
      aria-hidden="true"
    >
      <Skeleton className="absolute inset-0" />
    </div>
  );
}

/** Gallery grid skeleton */
export function GallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <ImageSkeleton key={i} aspectRatio="1/1" />
      ))}
    </div>
  );
}

/** Chart skeleton */
export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 min-h-[300px] ${className}`}
      aria-hidden="true"
    >
      <Skeleton className="h-6 w-1/2 mb-6" />
      <div className="flex items-end justify-between h-[200px] gap-2">
        <Skeleton className="w-8 h-16" />
        <Skeleton className="w-8 h-24" />
        <Skeleton className="w-8 h-20" />
        <Skeleton className="w-8 h-32" />
        <Skeleton className="w-8 h-18" />
        <Skeleton className="w-8 h-28" />
        <Skeleton className="w-8 h-22" />
        <Skeleton className="w-8 h-26" />
      </div>
      <Skeleton className="h-3 w-full mt-4" />
    </div>
  );
}

/** Table skeleton */
export function TableSkeleton({ rows = 5, columns = 3 }: { rows?: number; columns?: number }) {
  return (
    <div
      className="w-full overflow-hidden rounded-xl border border-border bg-card"
      aria-hidden="true"
    >
      {/* Table header */}
      <div className="flex border-b border-border p-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 mx-1" />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex border-b border-border/50 p-3 last:border-0">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-3 flex-1 mx-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Admin shell skeleton for dashboard */
export function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} className="min-h-[100px]" />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Content row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CardSkeleton className="lg:col-span-2" />
        <CardSkeleton />
      </div>

      {/* List */}
      <CardSkeleton />
    </div>
  );
}

/** Form skeleton */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-1/3" />
    </div>
  );
}

/** Hero section skeleton */
export function HeroSkeleton() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4" aria-hidden="true">
      <div className="w-[80px] h-[80px] rounded-[22px] bg-muted mb-6" />
      <Skeleton className="h-4 w-32 mb-2" />
      <TextSkeleton lines={2} className="max-w-md mx-auto mb-4" />
      <div className="space-y-3 max-w-sm w-full">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-10 w-2/3 mx-auto" />
      </div>
    </div>
  );
}

/** Section skeleton */
export function SectionSkeleton({ title = true }: { title?: boolean }) {
  return (
    <div className="py-12" aria-hidden="true">
      {title && (
        <>
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-3 w-64 mx-auto mb-8" />
        </>
      )}
      <GallerySkeleton count={4} />
    </div>
  );
}

/** Admin page skeleton */
export function AdminPageSkeleton() {
  return (
    <div className="p-4 md:p-6" aria-hidden="true">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <DashboardSkeleton />
    </div>
  );
}
