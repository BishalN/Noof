import { Skeleton } from "@/components/ui/skeleton";

export function SubSidebarSkeleton() {
  return (
    <div className="pb-12 bg-gray-100  min-h-screen flex flex-col">
      <div className=" mt-3 w-full space-y-3 py-4 px-7">
        <Skeleton className="h-6 w-[250px] bg-gray-300" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-12  w-full bg-gray-300" />
        <Skeleton className="h-12  w-full bg-gray-300" />
        <Skeleton className="h-12  w-full bg-gray-300" />
      </div>
    </div>
  );
}
