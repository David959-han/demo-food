import { Suspense } from 'react';
import { KitchenContent } from '@/components/kitchen/KitchenContent';
import { Skeleton } from '@/components/ui/Skeleton';

function KitchenPageFallback() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton shape="line" width="12rem" />
          <Skeleton shape="line" width="8rem" />
        </div>
        <Skeleton shape="block" width="8rem" height="2.25rem" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} shape="block" height="5rem" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} shape="block" height="20rem" />
        ))}
      </div>
    </div>
  );
}

export default function KitchenPage() {
  return (
    <Suspense fallback={<KitchenPageFallback />}>
      <KitchenContent />
    </Suspense>
  );
}
