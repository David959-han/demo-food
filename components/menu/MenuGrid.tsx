'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Eye, Pencil, Copy, Archive, Star, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { MenuItemWithStats, MenuCategory, MenuItemStatus } from '@/types/menu';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TranslationKey } from '@/types/i18n';

const STATUS_VARIANT: Record<MenuItemStatus, BadgeVariant> = {
  active:   'success',
  inactive: 'neutral',
  sold_out: 'warning',
};

const SKELETON_COUNT = 8;

interface MenuGridProps {
  items:      MenuItemWithStats[];
  categories: MenuCategory[];
  loading:    boolean;
}

export function MenuGrid({ items, categories, loading }: MenuGridProps) {
  const { t } = useTranslation();

  const getCategoryName = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? t(`menu_cat.${cat.key}` as TranslationKey) : '—';
  };

  if (!loading && items.length === 0) {
    return (
      <EmptyState
        title={t('menu.no_items')}
        description={t('menu.no_items_desc')}
        illustration="menu"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
      {loading
        ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-(--bg-surface) border border-(--border-default) p-3">
              <Skeleton shape="block" height="6rem" />
              <div className="mt-3 space-y-2">
                <Skeleton shape="line" width="80%" />
                <Skeleton shape="line" width="60%" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton shape="line" width="3rem" />
                  <Skeleton shape="line" width="4rem" />
                </div>
              </div>
            </div>
          ))
        : items.map((item) => (
            <MenuGridCard
              key={item.id}
              item={item}
              getCategoryName={getCategoryName}
              t={t}
            />
          ))}
    </div>
  );
}

function MenuGridCard({
  item,
  getCategoryName,
  t,
}: {
  item: MenuItemWithStats;
  getCategoryName: (id: number) => string;
  t: (key: TranslationKey) => string;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(item.image) && !imgError;

  return (
            <div
              className={cn(
                'group relative rounded-xl overflow-hidden',
                'bg-(--bg-surface) border border-(--border-default)',
                'hover:border-(--border-strong) hover:shadow-md transition-all duration-200',
                item.status !== 'active' && 'opacity-70',
              )}
            >
              {/* Image area */}
              <div className="relative w-full h-28 bg-(--bg-elevated) flex items-center justify-center">
                {showImage ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    onError={() => setImgError(true)}
                    className="object-cover"
                  />
                ) : (
                  <UtensilsCrossed size={28} className="text-(--text-disabled)" />
                )}

                {/* Status badge overlay */}
                <div className="absolute top-2 left-2">
                  <Badge variant={STATUS_VARIANT[item.status]} shape="pill">
                    {t(`status.${item.status}` as TranslationKey)}
                  </Badge>
                </div>

                {item.isPopular && (
                  <div className="absolute top-2 right-2">
                    <Star size={12} className="text-(--brand-400)" fill="currentColor" />
                  </div>
                )}

                {/* Action overlay on hover */}
                <div className={cn(
                  'absolute inset-0 bg-(--bg-base)/80 backdrop-blur-sm',
                  'flex items-center justify-center gap-1',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                )}>
                  <IconButton icon={<Eye size={14} />}     size="xs" variant="default" aria-label={t('menu.action_view')} />
                  <IconButton icon={<Pencil size={14} />}  size="xs" variant="default" aria-label={t('menu.action_edit')} />
                  <IconButton icon={<Copy size={14} />}    size="xs" variant="default" aria-label={t('menu.action_duplicate')} />
                  <IconButton icon={<Archive size={14} />} size="xs" variant="default" aria-label={t('menu.action_archive')} />
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-semibold text-(--text-primary) truncate leading-tight">
                  {item.name}
                </p>
                <p className="text-xs text-(--text-muted) mt-0.5 truncate">
                  {getCategoryName(item.categoryId)}
                </p>

                {/* Price + Margin */}
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-(--text-primary) tabular-nums">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className={cn(
                    'text-xs tabular-nums font-medium',
                    item.profitMargin >= 60 ? 'text-(--success-400)' : 'text-(--text-muted)',
                  )}>
                    {item.profitMargin.toFixed(1)}%
                  </span>
                </div>

                {/* Sold count + rating */}
                <div className="mt-1.5 flex items-center justify-between text-xs text-(--text-disabled)">
                  <span>{t('menu.sold')}: {item.totalSold}</span>
                  <span className="flex items-center gap-0.5">
                    <Star size={10} className="text-(--brand-400)" fill="currentColor" />
                    {item.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
  );
}
