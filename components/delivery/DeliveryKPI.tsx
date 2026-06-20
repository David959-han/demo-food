'use client';

import { Truck, Clock, CheckCircle2, Timer } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { TranslationKey } from '@/types/i18n';
import type { DeliveryOrder } from '@/types/delivery';

interface KPIItem {
  labelKey: TranslationKey;
  value:    string | number;
  icon:     React.ReactNode;
  color:    string;
  bg:       string;
  border:   string;
}

interface DeliveryKPIProps {
  orders: DeliveryOrder[];
}

export function DeliveryKPI({ orders }: DeliveryKPIProps) {
  const { t } = useTranslation();
  const [now] = useState(() => Date.now());

  const active = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.status),
  ).length;

  const onTheWay = orders.filter(
    (o) => ['picked_up', 'on_the_way'].includes(o.status),
  ).length;

  const deliveredToday = orders.filter((o) => o.status === 'delivered').length;

  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.status),
  );
  const avgMin =
    activeOrders.length
      ? Math.round(
          activeOrders.reduce((sum, o) => {
            return sum + (now - new Date(o.createdAt).getTime()) / 60000;
          }, 0) / activeOrders.length,
        )
      : 0;

  const kpis: KPIItem[] = [
    {
      labelKey: 'delivery.active',
      value:    active,
      icon:     <Truck size={20} />,
      color:    'text-(--brand-400)',
      bg:       'bg-(--brand-500)/10',
      border:   'border-(--brand-500)/20',
    },
    {
      labelKey: 'delivery.on_the_way',
      value:    onTheWay,
      icon:     <Clock size={20} />,
      color:    'text-(--warning-400)',
      bg:       'bg-(--warning-500)/10',
      border:   'border-(--warning-500)/20',
    },
    {
      labelKey: 'delivery.delivered_today',
      value:    deliveredToday,
      icon:     <CheckCircle2 size={20} />,
      color:    'text-(--success-400)',
      bg:       'bg-(--success-500)/10',
      border:   'border-(--success-500)/20',
    },
    {
      labelKey: 'delivery.avg_time',
      value:    `${avgMin} ${t('delivery.min')}`,
      icon:     <Timer size={20} />,
      color:    avgMin >= 30 ? 'text-(--danger-400)' : avgMin >= 20 ? 'text-(--warning-400)' : 'text-(--info-400)',
      bg:       avgMin >= 30 ? 'bg-(--danger-500)/10'  : avgMin >= 20 ? 'bg-(--warning-500)/10'  : 'bg-(--info-500)/10',
      border:   avgMin >= 30 ? 'border-(--danger-500)/20' : avgMin >= 20 ? 'border-(--warning-500)/20' : 'border-(--info-500)/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map(({ labelKey, value, icon, color, bg, border }) => (
        <div
          key={labelKey}
          className={cn(
            'rounded-xl p-4 border',
            'bg-(--bg-surface)',
            'flex items-center gap-3',
            border,
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
