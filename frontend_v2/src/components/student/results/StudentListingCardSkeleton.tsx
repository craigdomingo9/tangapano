import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StudentListingCardSkeleton = () => {
  return (
    <Card className="overflow-hidden h-full border-slate-200 shadow-sm p-0">
      {/* Image Skeleton */}
      <div className="relative aspect-16/10 bg-slate-100">
        <Skeleton className="h-full w-full rounded-b-none" />
      </div>

      <CardContent className="p-5 pt-6 flex flex-col gap-6">
        {/* Title and Location */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-16" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-auto" />

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
};
