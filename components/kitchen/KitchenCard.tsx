'use client';

import { ChevronRight, Crown, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import {
  useElapsedSeconds,
  formatElapsed,
  timerColorClass,
  timerBgClass,
} from './useKitchenTimer';
import type { KitchenOrder, KitchenOrderStatus, KitchenPriority } from '@/types/kitchen';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TranslationKey } from '@/types/i18n';

const PRIORITY_VARIANT: Record<KitchenPriority, BadgeVariant> = {
  normal: 'neutral',
  urgent: 'warning',
  vip:    'brand',
};

const PRIORITY_ICON: Record<KitchenPriority, React.ReactNode> = {
  normal: null,
  urgent: <Zap size={11} />,
  vip:    <Crown size={11} />,
};

const NEXT_STATUS: Record<KitchenOrderStatus, KitchenOrderStatus | null> = {
  new:       'preparing',
  preparing: 'ready',
  ready:     'served',
  served:    null,
};

const ADVANCE_COLOR: Record<KitchenOrderStatus, string> = {
  new:       'bg-(--info-500)/10 text-(--info-400) hover:bg-(--info-500)/20 border-(--info-500)/20',
  preparing: 'bg-(--warning-500)/10 text-(--warning-400) hover:bg-(--warning-500)/20 border-(--warning-500)/20',
  ready:     'bg-(--success-500)/10 text-(--success-400) hover:bg-(--success-500)/20 border-(--success-500)/20',
  served:    '',
};

const CARD_BORDER: Record<KitchenPriority, string> = {
  normal: 'border-(--border-default)',
  urgent: 'border-(--warning-500)/40',
  vip:    'border-(--brand-500)/40',
};

const CARD_BG: Record<KitchenPriority, string> = {
  normal: 'bg-(--bg-surface)',
  urgent: 'bg-(--warning-500)/[0.04]',
  vip:    'bg-(--brand-500)/[0.04]',
};

interface KitchenCardProps {
  order:    KitchenOrder;
  onAdvance: (id: string, status: KitchenOrderStatus) => void;
}

export function KitchenCard({ order, onAdvance }: KitchenCardProps) {
  const { t } = useTranslation();
  const elapsed    = useElapsedSeconds(order.createdAt);
  const colorCls   = timerColorClass(elapsed);
  const ringCls    = timerBgClass(elapsed);
  const nextStatus = NEXT_STATUS[order.status];

  const itemCount = order.items.length;
  const totalQty  = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'rounded-xl border overflow-hidden',
        'flex flex-col',
        CARD_BG[order.priority],
        CARD_BORDER[order.priority],
        ringCls,
      )}
    >
      {/* Card header */}
      <div className="px-3 pt-3 pb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-semibold text-(--text-disabled)">{order.id}</span>
        </div>
        <Badge
          variant={PRIORITY_VARIANT[order.priority]}
          shape="pill"
        >
          <span className="flex items-center gap-1">
            {PRIORITY_ICON[order.priority]}
            {order.priority !== 'normal' && t(`kitchen.priority_${order.priority}` as TranslationKey)}
          </span>
        </Badge>
      </div>

      {/* Table number — hero element */}
      <div className="px-3 py-1 flex items-center justify-between">
        <div>
          <p className="text-xs text-(--text-disabled) uppercase tracking-wide">{t('tables.table_no')}</p>
          <p className="text-3xl font-black text-(--text-primary) leading-tight tabular-nums">
            {order.tableNumber}
          </p>
        </div>
        {/* Elapsed timer */}
        <div className="text-right">
          <p className="text-xs text-(--text-disabled) uppercase tracking-wide">{t('kitchen.elapsed')}</p>
          <p className={cn('text-2xl font-bold tabular-nums font-mono leading-tight', colorCls)}>
            {formatElapsed(elapsed)}
          </p>
        </div>
      </div>

      {/* Items list */}
      <div className="px-3 py-2 flex-1">
        <ul className="space-y-0.5">
          {order.items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-(--text-secondary) truncate">{item.name}</span>
              <span className="ml-2 shrink-0 text-xs font-semibold text-(--text-primary) tabular-nums bg-(--bg-elevated) px-1.5 py-0.5 rounded">
                ×{item.quantity}
              </span>
            </li>
          ))}
        </ul>

        {/* Note */}
        {order.notes && (
          <div className="mt-2 flex items-start gap-1.5 text-xs text-(--warning-400)">
            <AlertCircle size={12} className="mt-0.5 shrink-0" />
            <span>{order.notes}</span>
          </div>
        )}
      </div>

      {/* Footer: stats + advance */}
      <div className="px-3 pb-3 pt-1 flex items-center justify-between gap-2 border-t border-(--border-subtle) mt-1">
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-(--text-disabled)">
          <span><span className="font-semibold text-(--text-muted)">{itemCount}</span> {t('kitchen.items')}</span>
          <span><span className="font-semibold text-(--text-muted)">{totalQty}</span> {t('kitchen.qty')}</span>
        </div>

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
            {t('kitchen.advance')}
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
