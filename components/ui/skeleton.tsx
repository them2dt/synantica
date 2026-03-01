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
 */
function Skeleton({
  className,
  animate = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-slate-100",
        animate && "animate-pulse",
        "rounded-none", // Design choice for this project
        className
      )}
      {...props}
    />
  );
}

/**
 * Event card skeleton component
 */
function EventCardSkeleton() {
  return (
    <div className="border border-slate-200 bg-slate-50 text-slate-950 overflow-hidden">
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-20" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}



/**
 * Event grid skeleton component
 */
function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Dashboard skeleton component
 */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1">
        <div className="mx-auto w-full max-w-[1100px] px-6 py-10">
          <div className="space-y-6 mb-8">
            <Skeleton className="h-10 w-full" />
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Skeleton className="h-10 w-48" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-36" />
                </div>
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <EventGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}

