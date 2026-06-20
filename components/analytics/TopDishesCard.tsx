'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { TopDish } from '@/types/analytics';

const RANK_COLORS = [
  'bg-(--brand-bg)    text-(--brand-400)',
  'bg-(--info-bg)     text-(--info-400)',
  'bg-(--success-bg)  text-(--success-400)',
  'bg-(--bg-subtle)   text-(--text-secondary)',
  'bg-(--bg-subtle)   text-(--text-secondary)',
];

interface TopDishesCardProps {
  dishes:  TopDish[];
  loading: boolean;
}

export function TopDishesCard({ dishes, loading }: TopDishesCardProps) {
  const { t } = useTranslation();

  const maxOrders = Math.max(...dishes.map((d) => d.orders), 1);

  return (
    <div className="rounded-xl bg-(--bg-surface) border border-(--border-default) p-5">
      <h2 className="text-sm font-semibold text-(--text-primary) mb-4">
        {t('analytics.top_dishes')}
      </h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton shape="circle" width="2rem" />
              <Skeleton shape="line" width="50%" />
              <div className="ml-auto flex gap-3">
                <Skeleton shape="line" width="3rem" />
                <Skeleton shape="line" width="4rem" />
              </div>
            </div>
          ))}
        </div>
      ) : dishes.length === 0 ? (
        <EmptyState title={t('analytics.no_data')} illustration="generic" size="sm" />
      ) : (
        <ol className="space-y-3">
          {dishes.map((dish, idx) => {
            const pct = Math.round((dish.orders / maxOrders) * 100);
            return (
              <li key={dish.rank} className="flex items-center gap-3 group">
                {/* Rank badge */}
                <span
                  className={cn(
                    'flex items-center justify-center w-7 h-7 rounded-full shrink-0',
                    'text-xs font-bold tabular-nums',
                    RANK_COLORS[idx] ?? RANK_COLORS[RANK_COLORS.length - 1],
                  )}
                >
                  {dish.rank}
                </span>

                {/* Name + progress bar */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-(--text-primary) truncate leading-tight">
                    {dish.name}
                  </p>
                  <div className="mt-1 h-1.5 rounded-full bg-(--bg-elevated) overflow-hidden">
                    <div
                      className="h-full rounded-full bg-(--brand-500) transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-(--text-primary) tabular-nums">
                    {dish.orders}
                  </p>
                  <p className="text-xs text-(--text-muted) tabular-nums">
                    ${dish.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
