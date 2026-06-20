'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { PopularMenuItem } from '@/types/dashboard';

const RANK_COLORS = [
  'bg-(--brand-bg)    text-(--brand-400)',
  'bg-(--info-bg)     text-(--info-400)',
  'bg-(--success-bg)  text-(--success-400)',
  'bg-(--bg-subtle)   text-(--text-secondary)',
  'bg-(--bg-subtle)   text-(--text-secondary)',
];

interface PopularMenuProps {
  items:   PopularMenuItem[];
  loading: boolean;
}

const SKELETON_ROWS = 5;

export function PopularMenu({ items, loading }: PopularMenuProps) {
  const { t } = useTranslation();

  return (
    <section
      className="rounded-xl bg-(--bg-surface) border border-(--border-default) p-5"
      aria-label={t('dashboard.popular_menu')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-(--text-primary)">
          {t('dashboard.popular_menu')}
        </h2>
        <div className="hidden sm:grid grid-cols-2 gap-x-8 text-xs font-medium text-(--text-disabled) uppercase tracking-wide">
          <span className="text-right">{t('common.orders')}</span>
          <span className="text-right">{t('common.revenue')}</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton shape="circle" width="2rem" />
              <Skeleton shape="line" width="50%" />
              <div className="ml-auto flex gap-4">
                <Skeleton shape="line" width="2.5rem" />
                <Skeleton shape="line" width="3.5rem" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={t('dashboard.no_menu')}
          illustration="menu"
          size="sm"
        />
      ) : (
        <ol className="space-y-1" aria-label={t('dashboard.popular_menu')}>
          {items.map((item, idx) => (
            <li
              key={item.rank}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-(--bg-subtle) transition-colors duration-100"
            >
              {/* Rank badge */}
              <span
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-full',
                  'text-xs font-bold tabular-nums shrink-0',
                  RANK_COLORS[idx] ?? RANK_COLORS[RANK_COLORS.length - 1],
                )}
                aria-label={`${t('common.rank')} ${item.rank}`}
              >
                {item.rank}
              </span>

              {/* Dish name */}
              <span className="flex-1 text-sm font-medium text-(--text-primary) truncate">
                {item.name}
              </span>

              {/* Metrics */}
              <div className="hidden sm:grid grid-cols-2 gap-x-8 shrink-0">
                <span className="text-sm text-(--text-secondary) tabular-nums text-right">
                  {item.orders}
                </span>
                <span className="text-sm text-(--text-secondary) tabular-nums text-right">
                  {item.revenue}
                </span>
              </div>
              {/* Mobile: orders only */}
              <span className="sm:hidden text-xs text-(--text-muted) tabular-nums shrink-0">
                {item.orders} {t('common.orders').toLowerCase()}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
