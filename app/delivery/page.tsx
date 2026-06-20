import { Suspense } from 'react';
import { DeliveryContent } from '@/components/delivery/DeliveryContent';
import { Skeleton } from '@/components/ui/Skeleton';

function DeliveryPageFallback() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton shape="block" height="7rem" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} shape="block" height="5rem" />
        ))}
      </div>
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} shape="block" width="10rem" height="4rem" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} shape="block" height="22rem" />
        ))}
      </div>
    </div>
  );
}

export default function DeliveryPage() {
  return (
    <Suspense fallback={<DeliveryPageFallback />}>
      <DeliveryContent />
    </Suspense>
  );
}
