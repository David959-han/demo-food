'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  getFilteredInventory,
  getInventoryStats,
  getAlertItems,
} from '@/services/inventoryManagementService';
import { InventoryKPI }     from './InventoryKPI';
import { LowStockAlert }    from './LowStockAlert';
import { InventoryFilters } from './InventoryFilters';
import { InventoryTable }   from './InventoryTable';
import type { InventoryItem, InventoryCategory, StockStatus } from '@/types';
import type { InventoryStats } from '@/services/inventoryManagementService';

export function InventoryContent() {
  const { t } = useTranslation();
  const router   = useRouter();
  const pathname = usePathname();
  const sp       = useSearchParams();

  const q        = sp.get('q')        ?? '';
  const category = (sp.get('category') ?? '') as InventoryCategory | '';
  const status   = (sp.get('status')   ?? '') as StockStatus | '';

  const [items,      setItems]      = useState<InventoryItem[]>([]);
  const [stats,      setStats]      = useState<InventoryStats | null>(null);
  const [alertItems, setAlertItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    Promise.all([
      getFilteredInventory({ q, category: category || undefined, status: status || undefined }),
      getInventoryStats(),
      getAlertItems(),
    ]).then(([filtered, st, alerts]) => {
      setItems(filtered);
      setStats(st);
      setAlertItems(alerts);
    });
  }, [q, category, status]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else        params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const isEmpty = items.length === 0;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-(--brand-500)/12 flex items-center justify-center text-(--brand-400) shrink-0">
          <Package size={18} />
        </div>
        <h1 className="text-xl font-black text-(--text-primary)">
          {t('inventory.title')}
        </h1>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface) min-h-[96px]">
        <div className="relative z-10 px-6 py-5 max-w-[50%]">
          <p className="text-xs font-semibold text-(--brand-400) uppercase tracking-widest mb-1">
            {t('inventory.title')}
          </p>
          <p className="text-xl font-black text-(--text-primary) leading-tight">
            {stats ? `${stats.totalItems} ${t('inventory.total_items')}` : '—'}
          </p>
          {stats && stats.lowStockCount > 0 && (
            <p className="text-sm text-(--warning-400) mt-1 font-semibold">
              {stats.lowStockCount} {t('inventory.low_stock_count')}
            </p>
          )}
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-[58%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/inventory-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/25 to-transparent" />
        </div>
      </div>

      {/* KPI */}
      {stats && <InventoryKPI stats={stats} />}

      {/* Low stock alert */}
      <LowStockAlert
        items={alertItems}
        onFilter={(s) => updateParam('status', s)}
      />

      {/* Filters */}
      <InventoryFilters
        q={q}
        category={category}
        status={status}
        onQ={(v)      => updateParam('q', v)}
        onCat={(v)    => updateParam('category', v)}
        onStatus={(v) => updateParam('status', v)}
      />

      {/* Table or empty */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-36 h-36">
            <Image
              src="/images/illustrations/inventory-empty.svg"
              alt=""
              width={144}
              height={144}
              unoptimized
            />
          </div>
          <p className="text-base font-semibold text-(--text-secondary)">
            {t('inventory.no_items')}
          </p>
          <p className="text-sm text-(--text-disabled)">
            {t('inventory.no_items_desc')}
          </p>
        </div>
      ) : (
        <InventoryTable items={items} />
      )}
    </div>
  );
}
