import { Skeleton } from "@/components/ui/skeleton";

const UsersDashboardSkeleton = () => {
  return (
    <>
      <div className="flex flex-col md:grid grid-flow-col gap-4 auto-cols-fr">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
      <div className="flex flex-col md:grid grid-flow-col gap-4 auto-cols-fr">
        <Skeleton className="h-[400px] w-full row-span-2" />
        <Skeleton className="h-[400px] w-full row-span-2 col-span-2" />
      </div>
    </>
  );
};

export default UsersDashboardSkeleton;
