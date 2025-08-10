import { Skeleton } from "@/components/ui/skeleton";

function RoomsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 justify-start mt-4">
      {Array.from({ length: 4 }).map((_, indx) => (
        <Skeleton key={indx} className="rounded-full w-32 h-9" />
      ))}
      <div>
        <div className="flex flex-col gap-2 mt-6">
          <Skeleton className="h-8 w-72 mb-2" />
        </div>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 3 }).map((_, indx) => (
          <div key={indx} className="grid space-y-2">
            <Skeleton className="h-16 w-full rounded-b-none" />
            <Skeleton className="h-28 w-full mb-4 rounded-t-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomsSkeleton;
