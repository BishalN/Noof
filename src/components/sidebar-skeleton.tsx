import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <div className="pb-12 min-h-screen flex flex-col justify-between">
      <div className="h-full mt-3 w-full space-y-3 py-4 px-7">
        <Skeleton className=" h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <div className="space-y-2 mt-2 pl-6">
          <Skeleton className="h-4 w-[226px]" />
          <Skeleton className="h-4 w-[226px]" />
          <Skeleton className="h-4 w-[226px]" />
          <Skeleton className="h-4 w-[226px]" />
          <Skeleton className="h-4 w-[226px]" />
        </div>

        <Skeleton className="h-4 w-[250px]" />
        <div className="space-y-1 pl-6 ">
          <Skeleton className="h-4 w-[226px]" />
          <Skeleton className="h-4 w-[226px]" />
          <Skeleton className="h-4 w-[226px]" />
          <Skeleton className="h-4 w-[226px]" />
        </div>
      </div>
    </div>
  );
}
