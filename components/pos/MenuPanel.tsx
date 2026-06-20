'use client';

import { useEffect, useState } from 'react';
import {
  Beef, Pizza, Sandwich, Leaf, Coffee, UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { MenuCard } from './MenuCard';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { getMenuItems, getMenuCategories } from '@/services/menuService';
import type { MenuItem, MenuCategory } from '@/types/menu';
import type { TranslationKey } from '@/types/i18n';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Beef, Pizza, Sandwich, Leaf, Coffee,
};

interface MenuPanelProps {
  className?: string;
}

export function MenuPanel({ className }: MenuPanelProps) {
  const { t } = useTranslation();
  const { cart, addToCart } = useRestaurantStore();

  const [items,      setItems]      = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCat,  setActiveCat]  = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMenuItems(), getMenuCategories()])
      .then(([menuItems, cats]) => {
        setItems(menuItems);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCat === null
      ? items
      : items.filter((item) => item.categoryId === activeCat);

  function cartQty(itemId: number): number {
    return (
      cart.items.find((ci) => ci.menuItem.id === itemId)?.quantity ?? 0
    );
  }

  return (
    <div className={cn('flex flex-col min-h-0', className)}>
      {/* Category tabs */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide shrink-0"
        role="tablist"
        aria-label={t('pos.title')}
      >
        {/* "All" tab */}
        <button
          role="tab"
          aria-selected={activeCat === null}
          onClick={() => setActiveCat(null)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium shrink-0',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
            activeCat === null
              ? 'bg-(--brand-500) text-white'
              : 'bg-(--bg-elevated) text-(--text-secondary) hover:text-(--text-primary) border border-(--border-default)',
          )}
        >
          <UtensilsCrossed size={14} />
          {t('pos.all')}
        </button>

        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} shape="line" width="5rem" height="2rem" />
            ))
          : categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon] ?? UtensilsCrossed;
              const isActive = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCat(cat.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium shrink-0',
                    'transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
                    isActive
                      ? 'bg-(--brand-500) text-white'
                      : 'bg-(--bg-elevated) text-(--text-secondary) hover:text-(--text-primary) border border-(--border-default)',
                  )}
                >
                  <Icon size={14} />
                  {t(`menu_cat.${cat.key}` as TranslationKey)}
                </button>
              );
            })}
      </div>

      {/* Menu grid */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-xl overflow-hidden bg-(--bg-elevated) border border-(--border-default)">
                <Skeleton shape="block" height="8rem" />
                <div className="p-3 space-y-2">
                  <Skeleton shape="line" width="70%" />
                  <Skeleton shape="line" width="90%" />
                  <div className="flex justify-between pt-1">
                    <Skeleton shape="line" width="3rem" />
                    <Skeleton shape="circle" width="1.75rem" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t('common.no_data')}
            illustration="menu"
            size="sm"
          />
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3"
            role="list"
          >
            {filtered.map((item) => (
              <div key={item.id} role="listitem">
                <MenuCard
                  item={item}
                  quantity={cartQty(item.id)}
                  onAdd={addToCart}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
