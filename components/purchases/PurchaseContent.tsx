'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  getFilteredPurchases,
  getPurchaseStats,
  getUniqueSuppliers,
} from '@/services/purchaseManagementService';
import { PurchaseKPI }         from './PurchaseKPI';
import { PurchaseFilters }     from './PurchaseFilters';
import { PurchaseTable }       from './PurchaseTable';
import { PurchaseDetailModal } from './PurchaseDetailModal';
import type { Purchase, PurchaseStatus } from '@/types';
import type { PurchaseStats } from '@/services/purchaseManagementService';

export function PurchaseContent() {
  const { t } = useTranslation();
  const router   = useRouter();
  const pathname = usePathname();
  const sp       = useSearchParams();

  const q        = sp.get('q')        ?? '';
  const status   = (sp.get('status')   ?? '') as PurchaseStatus | '';
  const supplier = sp.get('supplier') ?? '';

  const [purchases,  setPurchases]  = useState<Purchase[]>([]);
  const [stats,      setStats]      = useState<PurchaseStats | null>(null);
  const [suppliers,  setSuppliers]  = useState<string[]>([]);
  const [selected,   setSelected]   = useState<Purchase | null>(null);

  useEffect(() => {
    Promise.all([
      getFilteredPurchases({ q, status: status || undefined, supplier: supplier || undefined }),
      getPurchaseStats(),
      getUniqueSuppliers(),
    ]).then(([filtered, st, supp]) => {
      setPurchases(filtered);
      setStats(st);
      setSuppliers(supp);
    });
  }, [q, status, supplier]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else        params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const isEmpty = purchases.length === 0;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-(--brand-500)/12 flex items-center justify-center text-(--brand-400) shrink-0">
          <ShoppingCart size={18} />
        </div>
        <h1 className="text-xl font-black text-(--text-primary)">
          {t('purchases.title')}
        </h1>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface) min-h-[100px]">
        <div className="relative z-10 px-6 py-5 max-w-[52%]">
          <p className="text-xs font-semibold text-(--brand-400) uppercase tracking-widest mb-1">
            {t('purchases.title')}
          </p>
          <p className="text-xl font-black text-(--text-primary) leading-tight">
            {stats ? `${stats.totalOrders} ${t('purchases.total_orders')}` : '—'}
          </p>
          <p className="text-sm text-(--text-muted) mt-1">
            {stats
              ? `${t('purchases.total_spent')}: $${stats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
              : ''}
          </p>
        </div>
        {/* Illustration */}
        <div className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/purchases-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/30 to-transparent" />
        </div>
      </div>

      {/* KPI */}
      {stats && <PurchaseKPI stats={stats} />}

      {/* Filters */}
      <PurchaseFilters
        q={q}
        status={status}
        supplier={supplier}
        suppliers={suppliers}
        onQ={(v)       => updateParam('q', v)}
        onStatus={(v)  => updateParam('status', v)}
        onSupplier={(v)=> updateParam('supplier', v)}
      />

      {/* Table or empty */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-36 h-36">
            <Image
              src="/images/illustrations/purchases-empty.svg"
              alt=""
              width={144}
              height={144}
              unoptimized
            />
          </div>
          <p className="text-base font-semibold text-(--text-secondary)">
            {t('purchases.no_orders')}
          </p>
          <p className="text-sm text-(--text-disabled)">
            {t('purchases.no_orders_desc')}
          </p>
        </div>
      ) : (
        <PurchaseTable purchases={purchases} onRowClick={setSelected} />
      )}

      {/* Detail modal */}
      <PurchaseDetailModal purchase={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
