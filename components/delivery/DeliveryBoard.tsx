'use client';

import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DeliveryCard } from './DeliveryCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import type { DeliveryOrder, DeliveryStatus } from '@/types/delivery';
import type { TranslationKey } from '@/types/i18n';

interface Column {
  id:          string;
  labelKey:    TranslationKey;
  statuses:    DeliveryStatus[];
  headerBg:   string;
  dot:        string;
  countBg:    string;
}

const COLUMNS: Column[] = [
  {
    id:       'queue',
    labelKey: 'delivery.col_queue',
    statuses: ['pending', 'assigned'],
    headerBg: 'bg-(--info-500)/8',
    dot:      'bg-(--info-400)',
    countBg:  'bg-(--info-500)/15 text-(--info-400)',
  },
  {
    id:       'progress',
    labelKey: 'delivery.col_in_progress',
    statuses: ['picked_up', 'on_the_way'],
    headerBg: 'bg-(--brand-500)/8',
    dot:      'bg-(--brand-400)',
    countBg:  'bg-(--brand-500)/15 text-(--brand-400)',
  },
  {
    id:       'delivered',
    labelKey: 'delivery.col_delivered',
    statuses: ['delivered'],
    headerBg: 'bg-(--success-500)/8',
    dot:      'bg-(--success-400)',
    countBg:  'bg-(--success-500)/15 text-(--success-400)',
  },
  {
    id:       'cancelled',
    labelKey: 'delivery.col_cancelled',
    statuses: ['cancelled'],
    headerBg: 'bg-(--danger-500)/8',
    dot:      'bg-(--danger-400)',
    countBg:  'bg-(--danger-500)/15 text-(--danger-400)',
  },
];

interface DeliveryBoardProps {
  orders:          DeliveryOrder[];
  loading:         boolean;
  showCancelled:   boolean;
  onAdvance:       (id: string, status: DeliveryStatus) => void;
}

export function DeliveryBoard({
  orders,
  loading,
  showCancelled,
  onAdvance,
}: DeliveryBoardProps) {
  const { t } = useTranslation();

  const visibleCols = showCancelled ? COLUMNS : COLUMNS.filter((c) => c.id !== 'cancelled');

  return (
    <div
      className={cn(
        'grid gap-3',
        showCancelled
          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-3',
      )}
    >
      {visibleCols.map((col) => {
        const colOrders = orders.filter((o) => col.statuses.includes(o.status));
        const isEmpty   = !loading && colOrders.length === 0;

        return (
          <div key={col.id} className="flex flex-col gap-2 min-w-0">
            {/* Column header */}
            <div className={cn('flex items-center justify-between px-3 py-2 rounded-lg', col.headerBg)}>
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', col.dot)} />
                <span className="text-xs font-bold text-(--text-secondary) uppercase tracking-wider">
                  {t(col.labelKey)}
                </span>
              </div>
              <span className={cn('text-xs font-bold tabular-nums px-2 py-0.5 rounded-full', col.countBg)}>
                {loading ? '–' : colOrders.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-(--border-default) p-3 space-y-2">
                    <div className="flex justify-between"><Skeleton shape="line" width="4rem" /><Skeleton shape="line" width="4rem" /></div>
                    <Skeleton shape="line" width="7rem" />
                    <Skeleton shape="block" height="2.5rem" />
                    <Skeleton shape="line" width="100%" />
                  </div>
                ))
              ) : isEmpty ? (
                <div className="rounded-xl border border-(--border-subtle) border-dashed py-8 flex flex-col items-center gap-3">
                  {col.id === 'delivered' ? (
                    <Image
                      src="/images/illustrations/delivery-empty.svg"
                      alt=""
                      width={72}
                      height={72}
                      unoptimized
                      className="opacity-70"
                    />
                  ) : null}
                  <p className="text-xs text-(--text-disabled) text-center px-4">
                    {t('delivery.no_deliveries')}
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {colOrders.map((order) => (
                    <DeliveryCard
                      key={order.id}
                      order={order}
                      onAdvance={onAdvance}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
