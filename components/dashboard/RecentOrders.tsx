'use client';

import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { RecentOrder } from '@/types/dashboard';
import type { TranslationKey } from '@/types/i18n';

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  completed:  'success',
  pending:    'warning',
  cancelled:  'danger',
  preparing:  'info',
  on_the_way: 'info',
};

interface RecentOrdersProps {
  orders:  RecentOrder[];
  loading: boolean;
}

const SKELETON_ROWS = 5;

export function RecentOrders({ orders, loading }: RecentOrdersProps) {
  const { t } = useTranslation();

  return (
    <section
      className="rounded-xl bg-(--bg-surface) border border-(--border-default) p-5"
      aria-label={t('dashboard.recent_orders')}
    >
      <h2 className="text-sm font-semibold text-(--text-primary) mb-4">
        {t('dashboard.recent_orders')}
      </h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton shape="line" width="1.5rem" />
              <Skeleton shape="line" width="2rem"  />
              <Skeleton shape="line" width="40%"   />
              <Skeleton shape="line" width="20%"   />
              <Skeleton shape="line" width="20%"   />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title={t('dashboard.no_orders')}
          illustration="orders"
          size="sm"
        />
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-(--border-subtle)">
                {(
                  [
                    ['common.id',       'w-10',  'text-left'],
                    ['order.table',     'w-12',  'text-left'],
                    ['common.customer', '',      'text-left'],
                    ['common.total',    'w-20',  'text-right'],
                    ['common.status',   'w-28',  'text-right'],
                  ] as const
                ).map(([key, w, align]) => (
                  <th
                    key={key}
                    className={`pb-2.5 text-xs font-medium text-(--text-disabled) uppercase tracking-wide ${align} ${w}`}
                    scope="col"
                  >
                    {t(key as TranslationKey)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {orders.map((order) => {
                const statusKey = `status.${order.status}` as TranslationKey;
                const variant   = STATUS_VARIANT[order.status] ?? 'neutral';

                return (
                  <tr
                    key={order.id}
                    className="group hover:bg-(--bg-subtle) transition-colors duration-100"
                  >
                    <td className="py-2.5 text-(--text-muted) tabular-nums">
                      #{order.id}
                    </td>
                    <td className="py-2.5 text-(--text-secondary) tabular-nums">
                      {order.table}
                    </td>
                    <td className="py-2.5 text-(--text-primary) font-medium">
                      {order.customer}
                    </td>
                    <td className="py-2.5 text-(--text-primary) tabular-nums text-right">
                      {order.total}
                    </td>
                    <td className="py-2.5 text-right">
                      <Badge variant={variant} shape="pill">
                        {t(statusKey)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
