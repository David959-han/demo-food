'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/ui/SearchInput';
import { useTranslation } from '@/hooks/useTranslation';
import type { MenuCategory, MenuItemStatus } from '@/types/menu';
import type { TranslationKey } from '@/types/i18n';

const STATUS_OPTIONS: { value: MenuItemStatus; labelKey: TranslationKey }[] = [
  { value: 'active',   labelKey: 'status.active'   },
  { value: 'inactive', labelKey: 'status.inactive' },
  { value: 'sold_out', labelKey: 'status.sold_out' },
];

interface MenuFiltersProps {
  categories: MenuCategory[];
  className?: string;
}

export function MenuFilters({ categories, className }: MenuFiltersProps) {
  const { t }         = useTranslation();
  const router        = useRouter();
  const pathname      = usePathname();
  const searchParams  = useSearchParams();

  const q          = searchParams.get('q')        ?? '';
  const categoryId = searchParams.get('category') ?? '';
  const status     = searchParams.get('status')   ?? '';

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const selectCls = cn(
    'h-9 px-2.5 text-xs rounded-lg appearance-none',
    'bg-(--bg-elevated) text-(--text-secondary)',
    'border border-(--border-default) hover:border-(--border-strong)',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
  );

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Search */}
      <div className="flex-1 min-w-[180px]">
        <SearchInput
          value={q}
          onChange={(v) => setParam('q', v)}
          placeholder={t('menu.search')}
          aria-label={t('menu.search')}
        />
      </div>

      {/* Category filter */}
      <select
        value={categoryId}
        onChange={(e) => setParam('category', e.target.value)}
        aria-label={t('menu.all_categories')}
        className={selectCls}
      >
        <option value="">{t('menu.all_categories')}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {t(`menu_cat.${cat.key}` as TranslationKey)}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => setParam('status', e.target.value)}
        aria-label={t('menu.all_statuses')}
        className={selectCls}
      >
        <option value="">{t('menu.all_statuses')}</option>
        {STATUS_OPTIONS.map(({ value, labelKey }) => (
          <option key={value} value={value}>
            {t(labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
}
