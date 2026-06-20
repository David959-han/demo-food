'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { getKitchenOrders } from '@/services/kitchenService';
import { KitchenKPI } from './KitchenKPI';
import { KitchenBoard } from './KitchenBoard';
import type { KitchenOrderStatus } from '@/types/kitchen';

export function KitchenContent() {
  const { t } = useTranslation();

  const kitchenOrders         = useRestaurantStore((s) => s.kitchenOrders);
  const setKitchenOrders      = useRestaurantStore((s) => s.setKitchenOrders);
  const setKitchenOrderStatus = useRestaurantStore((s) => s.setKitchenOrderStatus);

  const [loading, setLoading]         = useState(true);
  const [showServed, setShowServed]   = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const orders = await getKitchenOrders();
      setKitchenOrders(orders);
      setLoading(false);
    })();
    // Seed only once on mount — intentionally not in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdvance = (id: string, status: KitchenOrderStatus) => {
    setKitchenOrderStatus(id, status);
  };

  const activeCount = kitchenOrders.filter((o) => o.status !== 'served').length;

  return (
    <div className="flex flex-col gap-5">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface)">
        <div className="relative z-10 px-6 py-5 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-(--text-primary)">{t('kitchen.title')}</h1>
            {!loading && (
              <p className="text-sm text-(--text-muted) mt-1">
                {activeCount} {t('kitchen.active_orders').toLowerCase()}
              </p>
            )}
          </div>

          {/* Show/hide served toggle */}
          <button
            onClick={() => setShowServed((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'border transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
              showServed
                ? 'bg-(--bg-elevated) border-(--border-strong) text-(--text-secondary)'
                : 'bg-(--bg-subtle) border-(--border-subtle) text-(--text-muted) hover:border-(--border-default)',
            )}
          >
            {showServed ? <EyeOff size={13} /> : <Eye size={13} />}
            {t(showServed ? 'kitchen.hide_served' : 'kitchen.show_served')}
          </button>
        </div>

        {/* Hero illustration */}
        <div className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/kitchen-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left rounded-r-2xl opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/40 to-transparent rounded-r-2xl" />
        </div>
      </div>

      {/* KPI summary */}
      <KitchenKPI orders={loading ? [] : kitchenOrders} />

      {/* Kanban board */}
      <KitchenBoard
        orders={kitchenOrders}
        loading={loading}
        showServed={showServed}
        onAdvance={handleAdvance}
      />
    </div>
  );
}
