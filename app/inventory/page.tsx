import { Suspense } from 'react';
import { InventoryContent } from '@/components/inventory/InventoryContent';

function InventoryPageFallback() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-32 rounded-lg bg-(--bg-elevated)" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-(--bg-elevated)" />
        ))}
      </div>
      <div className="h-14 rounded-xl bg-(--bg-elevated)" />
      <div className="h-10 rounded-lg bg-(--bg-elevated)" />
      <div className="rounded-xl bg-(--bg-elevated) overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 border-b border-(--border-subtle)" />
        ))}
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<InventoryPageFallback />}>
      <InventoryContent />
    </Suspense>
  );
}
