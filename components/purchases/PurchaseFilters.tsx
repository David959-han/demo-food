'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { PurchaseStatus } from '@/types';
import type { TranslationKey } from '@/types/i18n';

interface PurchaseFiltersProps {
  q:          string;
  status:     PurchaseStatus | '';
  supplier:   string;
  suppliers:  string[];
  onQ:        (v: string) => void;
  onStatus:   (v: PurchaseStatus | '') => void;
  onSupplier: (v: string) => void;
}

const STATUSES: Array<{ value: PurchaseStatus | ''; key: TranslationKey }> = [
  { value: '',          key: 'purchases.all_statuses' },
  { value: 'pending',   key: 'status.pending'         },
  { value: 'confirmed', key: 'status.confirmed'       },
  { value: 'delivered', key: 'status.delivered'       },
  { value: 'cancelled', key: 'status.cancelled'       },
];

export function PurchaseFilters({
  q, status, supplier, suppliers,
  onQ, onStatus, onSupplier,
}: PurchaseFiltersProps) {
  const { t } = useTranslation();

  const selectBase = cn(
    'h-9 rounded-lg border border-(--border-default) bg-(--bg-elevated)',
    'px-3 text-sm text-(--text-secondary)',
    'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40 cursor-pointer',
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <div className="relative flex-1 min-w-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-disabled) pointer-events-none" />
        <input
          type="text"
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder={t('purchases.search')}
          className={cn(
            'w-full h-9 pl-9 pr-3 rounded-lg border border-(--border-default) bg-(--bg-elevated)',
            'text-sm text-(--text-primary) placeholder:text-(--text-disabled)',
            'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40',
          )}
        />
      </div>
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value as PurchaseStatus | '')}
        className={selectBase}
        aria-label={t('purchases.all_statuses')}
      >
        {STATUSES.map(({ value, key }) => (
          <option key={value} value={value}>{t(key)}</option>
        ))}
      </select>
      <select
        value={supplier}
        onChange={(e) => onSupplier(e.target.value)}
        className={selectBase}
        aria-label={t('purchases.all_suppliers')}
      >
        <option value="">{t('purchases.all_suppliers')}</option>
        {suppliers.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
