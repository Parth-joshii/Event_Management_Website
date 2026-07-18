import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  readonly count?: number;
}

/** Renders reusable skeleton cards for showcase loading states. */
export function SkeletonLoader({ count = 6 }: SkeletonLoaderProps): React.ReactElement {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div className="rounded-lg border border-white/70 bg-white/70 p-4" key={index}>
          <Skeleton className="h-56 w-full" />
          <Skeleton className="mt-5 h-5 w-3/4" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
