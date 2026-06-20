'use client';

import { ShoppingBag, Flame, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { TranslationKey } from '@/types/i18n';
import type { KitchenOrder } from '@/types/kitchen';

interface KPIItem {
  labelKey: TranslationKey;
  value:    string | number;
  icon:     React.ReactNode;
  color:    string;
  bg:       string;
}

interface KitchenKPIProps {
  orders: KitchenOrder[];
}

export function KitchenKPI({ orders }: KitchenKPIProps) {
  const { t } = useTranslation();
  const [now] = useState(() => Date.now());

  const active    = orders.filter((o) => o.status !== 'served').length;
  const preparing = orders.filter((o) => o.status === 'preparing').length;
  const ready     = orders.filter((o) => o.status === 'ready').length;

  const activeOrders = orders.filter((o) => o.status !== 'served');
  const avgMin = activeOrders.length
    ? Math.round(
        activeOrders.reduce((sum, o) => {
          const elapsed = (now - new Date(o.createdAt).getTime()) / 60000;
          return sum + elapsed;
        }, 0) / activeOrders.length,
      )
    : 0;

  const kpis: KPIItem[] = [
    {
      labelKey: 'kitchen.active_orders',
      value:    active,
      icon:     <ShoppingBag size={18} />,
      color:    'text-(--info-400)',
      bg:       'bg-(--info-500)/10',
    },
    {
      labelKey: 'kitchen.col_preparing',
      value:    preparing,
      icon:     <Flame size={18} />,
      color:    'text-(--warning-400)',
      bg:       'bg-(--warning-500)/10',
    },
    {
      labelKey: 'kitchen.col_ready',
      value:    ready,
      icon:     <CheckCircle size={18} />,
      color:    'text-(--success-400)',
      bg:       'bg-(--success-500)/10',
    },
    {
      labelKey: 'kitchen.avg_time',
      value:    `${avgMin} ${t('kitchen.min')}`,
      icon:     <Clock size={18} />,
      color:    avgMin >= 20 ? 'text-(--danger-400)' : avgMin >= 10 ? 'text-(--warning-400)' : 'text-(--success-400)',
      bg:       avgMin >= 20 ? 'bg-(--danger-500)/10' : avgMin >= 10 ? 'bg-(--warning-500)/10' : 'bg-(--success-500)/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {kpis.map(({ labelKey, value, icon, color, bg }) => (
        <div
          key={labelKey}
          className={cn(
            'rounded-xl p-4 border border-(--border-default)',
            'bg-(--bg-surface)',
            'flex items-center gap-3',
          )}
        >
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', bg, color)}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-(--text-muted) truncate">{t(labelKey)}</p>
            <p className={cn('text-2xl font-black tabular-nums leading-tight', color)}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
