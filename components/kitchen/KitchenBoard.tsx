'use client';

import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { KitchenCard } from './KitchenCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import type { KitchenOrder, KitchenOrderStatus } from '@/types/kitchen';
import type { TranslationKey } from '@/types/i18n';

interface Column {
  status:    KitchenOrderStatus;
  labelKey:  TranslationKey;
  headerBg:  string;
  headerDot: string;
  countBg:   string;
}

const COLUMNS: Column[] = [
  {
    status:    'new',
    labelKey:  'kitchen.col_new',
    headerBg:  'bg-(--info-500)/8',
    headerDot: 'bg-(--info-400)',
    countBg:   'bg-(--info-500)/15 text-(--info-400)',
  },
  {
    status:    'preparing',
    labelKey:  'kitchen.col_preparing',
    headerBg:  'bg-(--warning-500)/8',
    headerDot: 'bg-(--warning-400)',
    countBg:   'bg-(--warning-500)/15 text-(--warning-400)',
  },
  {
    status:    'ready',
    labelKey:  'kitchen.col_ready',
    headerBg:  'bg-(--success-500)/8',
    headerDot: 'bg-(--success-400)',
    countBg:   'bg-(--success-500)/15 text-(--success-400)',
  },
  {
    status:    'served',
    labelKey:  'kitchen.col_served',
    headerBg:  'bg-(--bg-elevated)',
    headerDot: 'bg-(--text-disabled)',
    countBg:   'bg-(--bg-elevated) text-(--text-disabled)',
  },
];

const SKELETON_COUNT = 2;

interface KitchenBoardProps {
  orders:        KitchenOrder[];
  loading:       boolean;
  showServed:    boolean;
  onAdvance:     (id: string, status: KitchenOrderStatus) => void;
}

export function KitchenBoard({ orders, loading, showServed, onAdvance }: KitchenBoardProps) {
  const { t } = useTranslation();

  const visibleColumns = showServed ? COLUMNS : COLUMNS.filter((c) => c.status !== 'served');

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
    <div
      className={cn(
        'grid gap-3',
        showServed
          ? 'min-w-160 sm:min-w-0 grid-cols-4 xl:grid-cols-4'
          : 'min-w-120 sm:min-w-0 grid-cols-3',
      )}
    >
      {visibleColumns.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.status);

        return (
          <div key={col.status} className="flex flex-col gap-2 min-w-0">
            {/* Column header */}
            <div className={cn(
              'flex items-center justify-between px-3 py-2 rounded-lg',
              col.headerBg,
            )}>
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', col.headerDot)} />
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
                Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-(--border-default) p-3 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton shape="line" width="5rem" />
                      <Skeleton shape="line" width="3.5rem" />
                    </div>
                    <Skeleton shape="line" width="3rem" />
                    <Skeleton shape="block" height="3.5rem" />
                    <Skeleton shape="line" width="100%" />
                  </div>
                ))
              ) : colOrders.length === 0 ? (
                <div className="rounded-xl border border-(--border-subtle) border-dashed py-6 flex items-center justify-center">
                  <p className="text-xs text-(--text-disabled)">{t('kitchen.no_orders')}</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {colOrders.map((order) => (
                    <KitchenCard
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
    </div>
  );
}
