import { Suspense } from 'react';
import { TableContent } from '@/components/tables/TableContent';
import { Skeleton } from '@/components/ui/Skeleton';

function TablePageFallback() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton shape="line" width="14rem" />
          <Skeleton shape="line" width="5rem" />
        </div>
        <Skeleton shape="block" width="8rem" height="2.25rem" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} shape="block" width="6rem" height="2rem" />
        ))}
      </div>
      <Skeleton shape="block" height="24rem" />
    </div>
  );
}

export default function TablesPage() {
  return (
    <Suspense fallback={<TablePageFallback />}>
      <TableContent />
    </Suspense>
  );
}
