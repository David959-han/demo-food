import { Suspense } from 'react';
import { LoyaltyContent } from '@/components/loyalty/LoyaltyContent';

function LoyaltyPageFallback() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-40 rounded-lg bg-(--bg-elevated)" />
      <div className="h-24 rounded-2xl bg-(--bg-elevated)" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-(--bg-elevated)" />
        ))}
      </div>
      <div className="h-10 rounded-lg bg-(--bg-elevated)" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-(--bg-elevated)" />
        ))}
      </div>
    </div>
  );
}

export default function LoyaltyPage() {
  return (
    <Suspense fallback={<LoyaltyPageFallback />}>
      <LoyaltyContent />
    </Suspense>
  );
}
