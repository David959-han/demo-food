'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { getMenuItemsWithStats } from '@/services/menuManagementService';
import { getMenuCategories } from '@/services/menuService';
import { MenuFilters } from './MenuFilters';
import { MenuViewToggle, type MenuView } from './MenuViewToggle';
import { MenuTable } from './MenuTable';
import { MenuGrid } from './MenuGrid';
import type { MenuItemWithStats, MenuCategory, MenuItemStatus } from '@/types/menu';

export function MenuContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const [view, setView]             = useState<MenuView>('table');
  const [items, setItems]           = useState<MenuItemWithStats[]>([]);
  const [total, setTotal]           = useState(0);
  const [categories, setCategories] = useState<MenuCategory[]>([]);

  const q          = searchParams.get('q')        ?? '';
  const categoryId = searchParams.get('category') ?? '';
  const status     = searchParams.get('status')   ?? '';

  // Derive loading: true when the filter key hasn't been resolved yet
  const filterKey = `${q}|${categoryId}|${status}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loading = loadedKey !== filterKey;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const [result, cats] = await Promise.all([
        getMenuItemsWithStats({
          q,
          categoryId: categoryId ? Number(categoryId) : null,
          status:     status ? (status as MenuItemStatus) : null,
        }),
        getMenuCategories(),
      ]);
      if (!cancelled) {
        setItems(result.items);
        setTotal(result.total);
        setCategories(cats);
        setLoadedKey(filterKey);
      }
    }

    void run();
    return () => { cancelled = true; };
  }, [q, categoryId, status, filterKey]);

  return (
    <div className="flex flex-col gap-4">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface)">
        <div className="relative z-10 px-6 py-5 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-(--text-primary)">{t('menu.title')}</h1>
            {!loading && (
              <p className="text-sm text-(--text-muted) mt-1">
                {total} {t('common.item').toLowerCase()}{total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <MenuViewToggle view={view} onChange={setView} />
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/menu-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left rounded-r-2xl opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/40 to-transparent rounded-r-2xl" />
        </div>
      </div>

      {/* Filters */}
      <MenuFilters categories={categories} />

      {/* Content */}
      {view === 'table' ? (
        <MenuTable items={items} categories={categories} loading={loading} />
      ) : (
        <MenuGrid items={items} categories={categories} loading={loading} />
      )}
    </div>
  );
}
