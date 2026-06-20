'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { TIER_STYLE } from './loyaltyUtils';
import type { LoyaltyTier, LoyaltyStatus } from '@/types';
import type { TranslationKey } from '@/types/i18n';

const TIERS: Array<LoyaltyTier> = ['bronze', 'silver', 'gold', 'platinum'];

const STATUSES: Array<{ value: LoyaltyStatus | ''; key: TranslationKey }> = [
  { value: '',         key: 'loyalty.all_statuses' },
  { value: 'active',   key: 'status.active'        },
  { value: 'inactive', key: 'status.inactive'      },
];

interface LoyaltyFiltersProps {
  q:        string;
  tier:     LoyaltyTier | '';
  status:   LoyaltyStatus | '';
  onQ:      (v: string)            => void;
  onTier:   (v: LoyaltyTier | '') => void;
  onStatus: (v: LoyaltyStatus | '') => void;
}

export function LoyaltyFilters({ q, tier, status, onQ, onTier, onStatus }: LoyaltyFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-disabled) pointer-events-none" />
        <input
          type="text"
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder={t('loyalty.search')}
          className={cn(
            'w-full h-9 pl-9 pr-3 rounded-lg border border-(--border-default) bg-(--bg-elevated)',
            'text-sm text-(--text-primary) placeholder:text-(--text-disabled)',
            'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40',
          )}
        />
      </div>

      {/* Tier pill buttons */}
      <div className="flex items-center gap-1.5 rounded-lg border border-(--border-default) bg-(--bg-elevated) p-1 overflow-x-auto">
        <button
          onClick={() => onTier('')}
          className={cn(
            'px-3 h-7 rounded-md text-xs font-semibold whitespace-nowrap transition-all',
            tier === ''
              ? 'bg-(--brand-500) text-white shadow-sm'
              : 'text-(--text-muted) hover:text-(--text-secondary)',
          )}
        >
          {t('loyalty.all_tiers')}
        </button>
        {TIERS.map((t_) => {
          const style = TIER_STYLE[t_];
          const active = tier === t_;
          return (
            <button
              key={t_}
              onClick={() => onTier(active ? '' : t_)}
              className={cn(
                'px-3 h-7 rounded-md text-xs font-semibold whitespace-nowrap transition-all',
                active
                  ? `${style.bgColor} ${style.textColor} shadow-sm`
                  : 'text-(--text-muted) hover:text-(--text-secondary)',
              )}
            >
              {t(style.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value as LoyaltyStatus | '')}
        className={cn(
          'h-9 rounded-lg border border-(--border-default) bg-(--bg-elevated)',
          'px-3 text-sm text-(--text-secondary)',
          'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40 cursor-pointer',
        )}
        aria-label={t('loyalty.all_statuses')}
      >
        {STATUSES.map(({ value, key }) => (
          <option key={value} value={value}>{t(key)}</option>
        ))}
      </select>
    </div>
  );
}
