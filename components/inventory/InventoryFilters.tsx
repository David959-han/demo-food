'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { CATEGORY_LABEL_KEY } from './inventoryUtils';
import type { InventoryCategory, StockStatus } from '@/types';
import type { TranslationKey } from '@/types/i18n';

interface InventoryFiltersProps {
  q:        string;
  category: InventoryCategory | '';
  status:   StockStatus | '';
  onQ:      (v: string) => void;
  onCat:    (v: InventoryCategory | '') => void;
  onStatus: (v: StockStatus | '') => void;
}

const STATUSES: Array<{ value: StockStatus | ''; key: TranslationKey }> = [
  { value: '',             key: 'inventory.all_statuses'   },
  { value: 'in_stock',    key: 'status.in_stock'           },
  { value: 'low_stock',   key: 'status.low_stock'          },
  { value: 'out_of_stock',key: 'status.out_of_stock'       },
];

const CATEGORIES: Array<InventoryCategory> = [
  'proteins', 'vegetables', 'dairy', 'grains',
  'beverages', 'sauces', 'dry_goods', 'packaging',
];

export function InventoryFilters({
  q, category, status,
  onQ, onCat, onStatus,
}: InventoryFiltersProps) {
  const { t } = useTranslation();

  const selectBase = cn(
    'h-9 rounded-lg border border-(--border-default) bg-(--bg-elevated)',
    'px-3 text-sm text-(--text-secondary)',
    'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40',
    'cursor-pointer',
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-disabled) pointer-events-none"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder={t('inventory.search')}
          className={cn(
            'w-full h-9 pl-9 pr-3 rounded-lg border border-(--border-default) bg-(--bg-elevated)',
            'text-sm text-(--text-primary) placeholder:text-(--text-disabled)',
            'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40',
          )}
        />
      </div>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => onCat(e.target.value as InventoryCategory | '')}
        className={selectBase}
        aria-label={t('inventory.all_categories')}
      >
        <option value="">{t('inventory.all_categories')}</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{t(CATEGORY_LABEL_KEY[cat])}</option>
        ))}
      </select>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value as StockStatus | '')}
        className={selectBase}
        aria-label={t('inventory.all_statuses')}
      >
        {STATUSES.map(({ value, key }) => (
          <option key={value} value={value}>{t(key)}</option>
        ))}
      </select>
    </div>
  );
}
