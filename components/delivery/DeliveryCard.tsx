'use client';

import { MapPin, ChevronRight, User, Package, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import {
  useElapsedSeconds,
  formatElapsed,
  timerColorClass,
} from '@/components/kitchen/useKitchenTimer';
import type { DeliveryOrder, DeliveryStatus } from '@/types/delivery';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TranslationKey } from '@/types/i18n';

const STATUS_VARIANT: Record<DeliveryStatus, BadgeVariant> = {
  pending:    'neutral',
  assigned:   'info',
  picked_up:  'warning',
  on_the_way: 'brand',
  delivered:  'success',
  cancelled:  'danger',
};

const NEXT_STATUS: Partial<Record<DeliveryStatus, DeliveryStatus>> = {
  pending:    'assigned',
  assigned:   'picked_up',
  picked_up:  'on_the_way',
  on_the_way: 'delivered',
};

const ADVANCE_COLOR: Partial<Record<DeliveryStatus, string>> = {
  pending:    'bg-(--info-500)/10 text-(--info-400) border-(--info-500)/20 hover:bg-(--info-500)/20',
  assigned:   'bg-(--warning-500)/10 text-(--warning-400) border-(--warning-500)/20 hover:bg-(--warning-500)/20',
  picked_up:  'bg-(--brand-500)/10 text-(--brand-400) border-(--brand-500)/20 hover:bg-(--brand-500)/20',
  on_the_way: 'bg-(--success-500)/10 text-(--success-400) border-(--success-500)/20 hover:bg-(--success-500)/20',
};

interface DeliveryCardProps {
  order:     DeliveryOrder;
  onAdvance: (id: string, status: DeliveryStatus) => void;
}

export function DeliveryCard({ order, onAdvance }: DeliveryCardProps) {
  const { t } = useTranslation();
  const elapsed    = useElapsedSeconds(order.createdAt);
  const colorCls   = timerColorClass(elapsed);
  const nextStatus = NEXT_STATUS[order.status];

  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={cn(
        'rounded-xl border bg-(--bg-surface)',
        'flex flex-col overflow-hidden',
        order.status === 'cancelled'
          ? 'border-(--danger-500)/20 opacity-60'
          : 'border-(--border-default) hover:border-(--border-strong)',
        'transition-colors duration-200',
      )}
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-mono font-semibold text-(--text-disabled)">{order.id}</p>
          <p className="text-sm font-semibold text-(--text-primary) mt-0.5">{order.customerName}</p>
        </div>
        <Badge variant={STATUS_VARIANT[order.status]} shape="pill">
          {t(`status.${order.status}` as TranslationKey)}
        </Badge>
      </div>

      {/* Address */}
      <div className="px-3 py-1">
        <div className="flex items-start gap-1.5">
          <MapPin size={12} className="text-(--brand-400) mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-(--text-secondary) leading-snug">{order.address}</p>
            <p className="text-[10px] text-(--text-disabled)">{order.district}</p>
          </div>
        </div>
      </div>

      {/* Items summary */}
      <div className="px-3 py-1.5">
        <div className="flex items-center gap-1.5 text-xs text-(--text-muted)">
          <Package size={11} />
          <span>{order.items.length} {t('kitchen.items')} · {totalItems} {t('kitchen.qty')} · <span className="font-semibold text-(--text-secondary)">${order.totalAmount.toFixed(2)}</span></span>
        </div>
      </div>

      {/* Rider row */}
      <div className="px-3 py-1 flex items-center gap-1.5">
        <User size={11} className="text-(--text-disabled)" />
        {order.riderName ? (
          <span className="text-xs text-(--text-secondary) font-medium">{order.riderName}</span>
        ) : (
          <span className="text-xs text-(--text-disabled) italic">{t('delivery.unassigned')}</span>
        )}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-(--text-disabled)">
            <MapPin size={9} className="text-(--brand-400)" />
            {order.distanceKm} {t('delivery.km')}
            <span className="mx-1">·</span>
            {order.estimatedMinutes} {t('delivery.min')}
          </span>
        )}
      </div>

      {/* Footer: timer + advance */}
      <div className="px-3 pb-3 pt-1 border-t border-(--border-subtle) mt-1 flex items-center justify-between gap-2">
        {/* Elapsed timer */}
        <span className={cn('text-xs font-mono font-semibold tabular-nums', colorCls)}>
          {formatElapsed(elapsed)}
        </span>

        {/* Phone */}
        <a
          href={`tel:${order.customerPhone}`}
          className="p-1 rounded text-(--text-disabled) hover:text-(--brand-400) transition-colors"
          title={order.customerPhone}
        >
          <Phone size={12} />
        </a>

        {/* Advance button */}
        {nextStatus && (
          <button
            onClick={() => onAdvance(order.id, nextStatus)}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold',
              'border transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
              ADVANCE_COLOR[order.status],
            )}
          >
            {t('delivery.advance')}
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-(--warning-400) bg-(--warning-500)/5 rounded px-2 py-1">
            {order.notes}
          </p>
        </div>
      )}
    </motion.div>
  );
}
