import { Suspense } from 'react';
import { AnalyticsContent } from '@/components/analytics/AnalyticsContent';

function AnalyticsPageFallback() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-28 rounded-2xl bg-(--bg-elevated)" />
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-(--bg-elevated)" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-72 rounded-xl bg-(--bg-elevated)" />
        <div className="h-72 rounded-xl bg-(--bg-elevated)" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-56 rounded-xl bg-(--bg-elevated)" />
        <div className="h-56 rounded-xl bg-(--bg-elevated)" />
      </div>
      <div className="rounded-xl bg-(--bg-elevated) overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-12 border-b border-(--border-subtle)" />
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsPageFallback />}>
      <AnalyticsContent />
    </Suspense>
  );
}
