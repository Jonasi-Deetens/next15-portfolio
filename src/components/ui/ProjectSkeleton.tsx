import { Skeleton } from "./Skeleton";
import { Card, CardContent } from "./Card";

export function ProjectSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-video bg-gray-100">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      <CardContent className="p-4">
        {/* Title and buttons skeleton */}
        <div className="flex items-start justify-between mb-2">
          <Skeleton width="60%" height="1.25rem" />
          <div className="flex gap-1">
            <Skeleton width="2rem" height="2rem" rounded />
            <Skeleton width="2rem" height="2rem" rounded />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-3">
          <Skeleton width="100%" height="0.875rem" />
          <Skeleton width="80%" height="0.875rem" />
          <Skeleton width="60%" height="0.875rem" />
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Skeleton width="3rem" height="1.25rem" rounded />
          <Skeleton width="4rem" height="1.25rem" rounded />
          <Skeleton width="3.5rem" height="1.25rem" rounded />
        </div>

        {/* Button skeleton */}
        <Skeleton width="100%" height="2rem" />
      </CardContent>
    </Card>
  );
}
