'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import {
  STATUS_VARIANT, STATUS_LABEL_KEY,
  CATEGORY_LABEL_KEY, CATEGORY_COLOR,
  stockPercent, stockBarColor, formatCurrency,
} from './inventoryUtils';
import type { InventoryItem } from '@/types';

interface StockBarProps {
  item: InventoryItem;
}

function StockBar({ item }: StockBarProps) {
  const pct = stockPercent(item.quantity, item.reorderLevel);
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-(--bg-base) overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', stockBarColor(item.status))}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs tabular-nums text-(--text-disabled) w-14 text-right shrink-0">
        {item.quantity} / {item.reorderLevel * 3}
      </span>
    </div>
  );
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-(--border-default) bg-(--bg-surface) overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-(--border-subtle) bg-(--bg-elevated)">
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                {t('common.item')}
              </th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden sm:table-cell">
                {t('common.category')}
              </th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                {t('common.status')}
              </th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden lg:table-cell">
                {t('inventory.stock_level')}
              </th>
              <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden md:table-cell">
                {t('inventory.cost_per_unit')}
              </th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden xl:table-cell">
                {t('common.supplier')}
              </th>
              <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden md:table-cell">
                {t('inventory.last_restocked')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-subtle)">
            {items.map((item, idx) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.025, duration: 0.2 }}
                className={cn(
                  'group hover:bg-(--bg-elevated) transition-colors',
                  item.status === 'out_of_stock' && 'opacity-60',
                )}
              >
                {/* Item name + unit */}
                <td className="px-4 py-3">
                  <p className="font-semibold text-(--text-primary) group-hover:text-(--brand-400) transition-colors truncate max-w-[180px]">
                    {item.name}
                  </p>
                  <p className="text-xs text-(--text-disabled) mt-0.5">
                    {item.unit}
                  </p>
                </td>

                {/* Category */}
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
                    CATEGORY_COLOR[item.category],
                  )}>
                    {t(CATEGORY_LABEL_KEY[item.category])}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[item.status]}>
                    {t(STATUS_LABEL_KEY[item.status])}
                  </Badge>
                </td>

                {/* Stock bar */}
                <td className="px-4 py-3 hidden lg:table-cell">
                  <StockBar item={item} />
                </td>

                {/* Cost per unit */}
                <td className="px-4 py-3 text-right text-(--text-secondary) tabular-nums font-medium hidden md:table-cell">
                  {formatCurrency(item.costPerUnit)}
                  <span className="text-xs text-(--text-disabled) font-normal ml-0.5">/{item.unit}</span>
                </td>

                {/* Supplier */}
                <td className="px-4 py-3 text-(--text-disabled) hidden xl:table-cell truncate max-w-[160px]">
                  {item.supplier}
                </td>

                {/* Last restocked */}
                <td className="px-4 py-3 text-right text-(--text-disabled) tabular-nums hidden md:table-cell text-xs">
                  {new Date(item.lastRestocked).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric',
                  })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
