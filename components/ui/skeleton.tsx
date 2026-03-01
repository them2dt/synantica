import { cn } from "@/lib/utils";

/**
 * Props for the Skeleton component
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the skeleton should animate
   * @default true
   */
  animate?: boolean;
  /**
   * The variant of the skeleton
   * @default "default"
   */
  variant?: "default" | "circular" | "rectangular";
}

/**
 * Skeleton component for loading states
 * Provides a shimmering placeholder while content loads
 * 
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-[250px]" />
 * <Skeleton className="h-4 w-[200px]" />
 * ```
 * 
 * @example
 * ```tsx
 * <Skeleton variant="circular" className="h-12 w-12" />
 * ```
 */
export function Skeleton({
  className,
  animate = true,
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-muted",
        {
          "animate-pulse": animate,
          "rounded-none": variant === "default",
          "rounded-none": variant === "circular",
          "rounded-none": variant === "rectangular",
        },
        className
      )}
      {...props}
    />
  );
}

/**
 * Event card skeleton component
 * Pre-built skeleton for event cards
 */
function EventCardSkeleton() {
  return (
    <div className="border border-border bg-card text-card-foreground overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Category badge skeleton */}
        <Skeleton className="h-6 w-20" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Date and time skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Location skeleton */}
        <Skeleton className="h-4 w-32" />

        {/* Tags skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

/**
 * Event grid skeleton component
 * Pre-built skeleton for event grids
 */
function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Event list skeleton component
 * Pre-built skeleton for event lists
 */
function EventListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border border-border bg-card text-card-foreground overflow-hidden">
          <div className="flex p-4 space-x-4">
            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              {/* Category and title */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Date, time, location */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Tags */}
              <div className="flex gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-10" />
              </div>
            </div>

            {/* Button skeleton */}
            <div className="flex items-end">
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Dashboard skeleton component
 * Pre-built skeleton for dashboard layout
 */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="mx-auto w-full max-w-[1100px] px-6 py-10">
          {/* Filters skeleton */}
          <div className="space-y-6 mb-8">
            {/* Search bar skeleton */}
            <Skeleton className="h-10 w-full" />

            {/* Filter controls skeleton */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Skeleton className="h-10 w-48" />
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          {/* Events grid skeleton */}
          <EventGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}

/**
 * Table skeleton component
 * Pre-built skeleton for data tables
 */
function TableSkeleton({
  rows = 5,
  columns = 4
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="w-full">
      {/* Table header skeleton */}
      <div className="flex space-x-4 mb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>

      {/* Table rows skeleton */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
