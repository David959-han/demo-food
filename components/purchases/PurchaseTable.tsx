'use client';

import { ChevronRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { STATUS_VARIANT, STATUS_LABEL_KEY, formatDate, formatCurrency } from './purchaseUtils';
import type { Purchase } from '@/types';

interface PurchaseTableProps {
  purchases:  Purchase[];
  onRowClick: (purchase: Purchase) => void;
}

export function PurchaseTable({ purchases, onRowClick }: PurchaseTableProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-(--border-default) bg-(--bg-surface) overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-(--border-subtle) bg-(--bg-elevated)">
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                {t('purchases.order_number')}
              </th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden sm:table-cell">
                {t('common.supplier')}
              </th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                {t('common.status')}
              </th>
              <th scope="col" className="text-center px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden md:table-cell">
                {t('purchases.items_count')}
              </th>
              <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden md:table-cell">
                {t('purchases.order_date')}
              </th>
              <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                {t('purchases.total_amount')}
              </th>
              <th scope="col" className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-subtle)">
            {purchases.map((po, idx) => (
              <motion.tr
                key={po.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.2 }}
                onClick={() => onRowClick(po)}
                className="group cursor-pointer hover:bg-(--bg-elevated) transition-colors"
              >
                {/* Order # + item preview */}
                <td className="px-4 py-3">
                  <p className="font-bold text-(--text-primary) group-hover:text-(--brand-400) transition-colors">
                    {po.orderNumber}
                  </p>
                  <p className="text-xs text-(--text-disabled) truncate max-w-[160px] mt-0.5">
                    {po.items.map((i) => i.name).join(', ')}
                  </p>
                </td>

                {/* Supplier */}
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-(--brand-500)/10 flex items-center justify-center shrink-0">
                      <Package size={12} className="text-(--brand-400)" />
                    </div>
                    <span className="text-(--text-secondary) font-medium truncate max-w-[140px]">
                      {po.supplier}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[po.status]}>
                    {t(STATUS_LABEL_KEY[po.status])}
                  </Badge>
                </td>

                {/* Items count */}
                <td className="px-4 py-3 text-center text-(--text-secondary) tabular-nums hidden md:table-cell">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-(--bg-elevated) text-xs font-bold">
                    {po.items.length}
                  </span>
                </td>

                {/* Order date */}
                <td className="px-4 py-3 text-right text-(--text-disabled) tabular-nums text-xs hidden md:table-cell">
                  {formatDate(po.orderedAt)}
                </td>

                {/* Total */}
                <td className="px-4 py-3 text-right">
                  <span className="font-black text-(--text-primary) tabular-nums">
                    {formatCurrency(po.totalAmount)}
                  </span>
                </td>

                {/* Chevron */}
                <td className="px-4 py-3">
                  <ChevronRight
                    size={14}
                    className="text-(--text-disabled) group-hover:text-(--brand-400) transition-colors ml-auto"
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
