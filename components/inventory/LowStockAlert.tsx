'use client';

import { AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { STATUS_VARIANT } from './inventoryUtils';
import type { InventoryItem } from '@/types';

interface LowStockAlertProps {
  items:     InventoryItem[];
  onFilter:  (status: string) => void;
}

export function LowStockAlert({ items, onFilter }: LowStockAlertProps) {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  const outCount = items.filter((i) => i.status === 'out_of_stock').length;

  return (
    <div className={cn(
      'rounded-xl border px-4 py-3.5',
      'bg-(--warning-500)/6 border-(--warning-500)/25',
      'flex items-center gap-3',
    )}>
      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-(--warning-500)/15 flex items-center justify-center text-(--warning-400) shrink-0">
        <AlertTriangle size={17} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-(--warning-400)">
          {t('inventory.alert_title')}
        </p>
        <p className="text-xs text-(--text-muted) mt-0.5">
          <span className="font-semibold text-(--text-secondary)">{items.length}</span>
          {' '}
          {t('inventory.alert_desc')}
          {outCount > 0 && (
            <span className="ml-1 text-(--danger-400) font-semibold">
              ({outCount} {t('status.out_of_stock')})
            </span>
          )}
        </p>
      </div>

      {/* Badges preview */}
      <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
        {items.slice(0, 3).map((item) => (
          <span key={item.id} className="flex items-center gap-1">
            <Badge variant={STATUS_VARIANT[item.status]}>
              {item.name}
            </Badge>
          </span>
        ))}
        {items.length > 3 && (
          <span className="text-xs text-(--text-disabled) font-semibold">
            +{items.length - 3}
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => onFilter('low_stock')}
        className={cn(
          'shrink-0 flex items-center gap-1 text-xs font-semibold',
          'text-(--warning-400) hover:text-(--warning-300) transition-colors',
          'focus-visible:outline-none',
        )}
        aria-label="Filter low stock items"
      >
        {t('common.status')}
        <ChevronRight size={13} />
      </button>
    </div>
  );
}
