import { Skeleton } from "@/components/ui/skeleton";

function ListingSkeleton() {
  return (
    <div className="h-[34rem] w-[21rem]">
      <Skeleton className="w-full h-5/12 rounded-t-xl rounded-b-none" />
      <div className="px-2">
        <Skeleton className="mt-2 h-10" />
        <Skeleton className="my-1 h-5 w-20" />
        <Skeleton className="my-1 h-5 w-64" />
        <div className="flex space-x-2 space-y-2 flex-wrap">
          {Array.from([20, 32, 36, 24, 28, 12]).map((item) => (
            <Skeleton key={item} className={"h-5 w-20 rounded-full"} />
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Skeleton className="h-8 w-full rounded-none" />
        <Skeleton className="h-8 w-full rounded-none" />
        <Skeleton className="h-8 w-full rounded-none" />
        <Skeleton className="h-8 w-full rounded-none" />
        <Skeleton className="h-8 col-span-2 rounded-none rounded-b-xl" />
      </div>
    </div>
  );
}

export default ListingSkeleton;
