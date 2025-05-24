import { EllipsisVerticalIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

function ViewMenuSkeleton() {
  return (
    <article className="animate-pulse">
      <Skeleton className="w-full h-[40vh] rounded-t-md" />

      <section className="flex flex-col gap-6 p-10 pl-12 flex-1">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-5 w-5 rounded-sm">
            <EllipsisVerticalIcon className="invisible" size={16} />
          </Skeleton>
        </div>

        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/4" />
        </div>

        <div className="flex-1 min-h-0">
          <div className="space-y-3 pr-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

export default ViewMenuSkeleton;
