'use client';

import { ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from './purchaseUtils';
import type { PurchaseStats } from '@/services/purchaseManagementService';

interface PurchaseKPIProps {
  stats: PurchaseStats;
}

export function PurchaseKPI({ stats }: PurchaseKPIProps) {
  const { t } = useTranslation();

  const cards = [
    {
      label:  t('purchases.total_orders'),
      value:  stats.totalOrders,
      icon:   <ShoppingCart size={18} />,
      color:  'text-(--brand-400)',
      bg:     'bg-(--brand-500)/10',
      border: 'border-(--brand-500)/20',
    },
    {
      label:  t('purchases.total_spent'),
      value:  formatCurrency(stats.totalSpent),
      icon:   <DollarSign size={18} />,
      color:  'text-(--success-400)',
      bg:     'bg-(--success-500)/10',
      border: 'border-(--success-500)/20',
    },
    {
      label:  t('purchases.pending'),
      value:  stats.pending + stats.confirmed,
      icon:   <Clock size={18} />,
      color:  'text-(--warning-400)',
      bg:     'bg-(--warning-500)/10',
      border: 'border-(--warning-500)/20',
    },
    {
      label:  t('purchases.this_month'),
      value:  formatCurrency(stats.thisMonthSpent),
      icon:   <CheckCircle size={18} />,
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
