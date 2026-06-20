import { Suspense } from 'react';
import { MenuContent } from '@/components/menu/MenuContent';
import { Skeleton } from '@/components/ui/Skeleton';

function MenuPageFallback() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton shape="line" width="12rem" />
          <Skeleton shape="line" width="5rem" />
        </div>
        <Skeleton shape="block" width="7rem" height="2.25rem" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton shape="block" width="14rem" height="2.25rem" />
        <Skeleton shape="block" width="10rem" height="2.25rem" />
        <Skeleton shape="block" width="10rem" height="2.25rem" />
      </div>
      <Skeleton shape="block" height="28rem" />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<MenuPageFallback />}>
      <MenuContent />
    </Suspense>
  );
}
