'use client';

import { Package, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from './inventoryUtils';
import type { InventoryStats } from '@/services/inventoryManagementService';

interface InventoryKPIProps {
  stats: InventoryStats;
}

export function InventoryKPI({ stats }: InventoryKPIProps) {
  const { t } = useTranslation();

  const cards = [
    {
      label:  t('inventory.total_items'),
      value:  stats.totalItems,
      icon:   <Package size={18} />,
      color:  'text-(--brand-400)',
      bg:     'bg-(--brand-500)/10',
      border: 'border-(--brand-500)/20',
    },
    {
      label:  t('inventory.in_stock'),
      value:  stats.inStockCount,
      icon:   <CheckCircle size={18} />,
      color:  'text-(--success-400)',
      bg:     'bg-(--success-500)/10',
      border: 'border-(--success-500)/20',
    },
    {
      label:  t('inventory.low_stock_count'),
      value:  stats.lowStockCount,
      icon:   <AlertTriangle size={18} />,
      color:  'text-(--warning-400)',
      bg:     'bg-(--warning-500)/10',
      border: 'border-(--warning-500)/20',
    },
    {
      label:  t('inventory.total_value'),
      value:  formatCurrency(stats.totalValue),
      icon:   <DollarSign size={18} />,
      color:  'text-(--info-400)',
      bg:     'bg-(--info-500)/10',
      border: 'border-(--info-500)/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon, color, bg, border }) => (
        <div
          key={label}
          className={cn(
            'rounded-xl p-4 border bg-(--bg-surface) flex items-center gap-3',
            border,
          )}
        >
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', bg, color)}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-(--text-muted) truncate">{label}</p>
            <p className={cn('text-2xl font-black tabular-nums leading-tight', color)}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
