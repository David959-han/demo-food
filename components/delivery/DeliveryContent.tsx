'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { getDeliveryOrders, getRiders } from '@/services/deliveryManagementService';
import { DeliveryKPI } from './DeliveryKPI';
import { RiderStrip } from './RiderStrip';
import { DeliveryBoard } from './DeliveryBoard';
import type { DeliveryStatus, Rider } from '@/types/delivery';

export function DeliveryContent() {
  const { t } = useTranslation();

  const deliveryOrders         = useRestaurantStore((s) => s.deliveryOrders);
  const setDeliveryOrders      = useRestaurantStore((s) => s.setDeliveryOrders);
  const setDeliveryOrderStatus = useRestaurantStore((s) => s.setDeliveryOrderStatus);

  const [loading, setLoading]             = useState(true);
  const [riders, setRiders]               = useState<Rider[]>([]);
  const [showCancelled, setShowCancelled] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const [orders, riderList] = await Promise.all([
        getDeliveryOrders(),
        getRiders(),
      ]);
      setDeliveryOrders(orders);
      setRiders(riderList);
      setLoading(false);
    })();
    // Seed on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdvance = (id: string, status: DeliveryStatus) => {
    setDeliveryOrderStatus(id, status);
  };

  const activeCount = deliveryOrders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.status),
  ).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Header with hero illustration */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface)">
        <div className="relative z-10 px-6 py-5">
          <h1 className="text-xl font-bold text-(--text-primary)">{t('delivery.title')}</h1>
          {!loading && (
            <p className="text-sm text-(--text-muted) mt-1">
              {activeCount} {t('delivery.active').toLowerCase()}
            </p>
          )}

          {/* Cancelled toggle */}
          <button
            onClick={() => setShowCancelled((v) => !v)}
            className={cn(
              'mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'border transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
              showCancelled
                ? 'bg-(--bg-elevated) border-(--border-strong) text-(--text-secondary)'
                : 'bg-(--bg-subtle) border-(--border-subtle) text-(--text-muted) hover:border-(--border-default)',
            )}
          >
            {showCancelled ? <EyeOff size={13} /> : <Eye size={13} />}
            {t(showCancelled ? 'delivery.hide_cancelled' : 'delivery.show_cancelled')}
          </button>
        </div>

        {/* Hero illustration */}
        <div className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/delivery-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left rounded-r-2xl opacity-90"
            priority
          />
          {/* Fade gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/40 to-transparent rounded-r-2xl" />
        </div>
      </div>

      {/* KPI cards */}
      <DeliveryKPI orders={loading ? [] : deliveryOrders} />

      {/* Riders strip */}
      {riders.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-(--text-disabled) uppercase tracking-wide mb-2">
            {t('delivery.rider')}s
          </p>
          <RiderStrip riders={riders} />
        </div>
      )}

      {/* Kanban board */}
      <DeliveryBoard
        orders={deliveryOrders}
        loading={loading}
        showCancelled={showCancelled}
        onAdvance={handleAdvance}
      />
    </div>
  );
}
