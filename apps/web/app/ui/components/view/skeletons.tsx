import Skeleton from './atom/skeleton';

export default function ListSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex w-full">
        <Skeleton className="mr-3 h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-full rounded-xl" />
      </div>
      <Skeleton className="h-6 w-4/5 rounded-xl" />
      <Skeleton className="h-6 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/5 rounded-xl" />
      <Skeleton className="h-6 w-4/5 rounded-xl" />
    </div>
  );
}
