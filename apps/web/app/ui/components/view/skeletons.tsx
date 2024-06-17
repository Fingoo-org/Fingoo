import Skeleton from './atom/skeleton';

export function ListSkeleton() {
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

export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col items-center space-y-4">
      <Skeleton className="h-6 w-1/2 rounded-xl" />
      <Skeleton className="h-40 w-1/2 rounded-lg" />
      <div className="flex w-full flex-col items-center justify-between space-y-4">
        <Skeleton className="h-4 w-1/2 rounded-xl" />
        <Skeleton className="h-3 w-1/3 rounded-xl" />
        <Skeleton className="h-3 w-1/2 rounded-xl" />
      </div>
    </div>
  );
}
