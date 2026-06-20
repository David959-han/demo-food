'use client';

import { useEffect } from 'react';
import { X, Package, Calendar, Building2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { STATUS_VARIANT, STATUS_LABEL_KEY, formatDate, formatCurrency } from './purchaseUtils';
import type { Purchase } from '@/types';

interface PurchaseDetailModalProps {
  purchase: Purchase | null;
  onClose:  () => void;
}

export function PurchaseDetailModal({ purchase, onClose }: PurchaseDetailModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!purchase) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [purchase, onClose]);

  return (
    <AnimatePresence>
      {purchase && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={cn(
              'fixed inset-x-4 top-[8%] bottom-[8%] z-50 mx-auto max-w-xl',
              'rounded-2xl border border-(--border-default) bg-(--bg-surface)',
              'overflow-y-auto shadow-2xl flex flex-col',
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-(--border-subtle) shrink-0">
              <div>
                <p className="text-xs font-semibold text-(--text-disabled) uppercase tracking-wider">
                  {t('purchases.modal_title')}
                </p>
                <h2 className="text-lg font-black text-(--text-primary) mt-0.5">
                  {purchase.orderNumber}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[purchase.status]}>
                  {t(STATUS_LABEL_KEY[purchase.status])}
                </Badge>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-(--bg-elevated) text-(--text-muted) hover:text-(--text-primary) flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40"
                  aria-label="Close modal"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Meta info */}
            <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-(--border-subtle) shrink-0">
              <div className="flex items-center gap-2">
                <Building2 size={13} className="text-(--text-disabled) shrink-0" />
                <div>
                  <p className="text-[10px] text-(--text-disabled)">{t('common.supplier')}</p>
                  <p className="text-sm font-semibold text-(--text-primary)">{purchase.supplier}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-(--text-disabled) shrink-0" />
                <div>
                  <p className="text-[10px] text-(--text-disabled)">{t('purchases.order_date')}</p>
                  <p className="text-sm font-semibold text-(--text-primary)">{formatDate(purchase.orderedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-(--text-disabled) shrink-0" />
                <div>
                  <p className="text-[10px] text-(--text-disabled)">{t('purchases.expected_date')}</p>
                  <p className="text-sm font-semibold text-(--text-primary)">{formatDate(purchase.expectedAt)}</p>
                </div>
              </div>
              {purchase.deliveredAt && (
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-(--success-400) shrink-0" />
                  <div>
                    <p className="text-[10px] text-(--text-disabled)">{t('purchases.delivered_date')}</p>
                    <p className="text-sm font-semibold text-(--success-400)">{formatDate(purchase.deliveredAt)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Items table */}
            <div className="flex-1 px-5 py-4 space-y-2 overflow-y-auto">
              <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider mb-3">
                {t('purchases.items_count')}
              </p>
              <div className="rounded-xl border border-(--border-default) overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-(--bg-elevated) border-b border-(--border-subtle)">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-(--text-muted)">{t('purchases.item_name')}</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-(--text-muted)">{t('purchases.quantity')}</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-(--text-muted) hidden sm:table-cell">{t('purchases.unit_price')}</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-(--text-muted)">{t('purchases.subtotal')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--border-subtle)">
                    {purchase.items.map((item, i) => (
                      <tr key={i} className="hover:bg-(--bg-elevated) transition-colors">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-(--brand-500)/10 flex items-center justify-center shrink-0">
                              <Package size={11} className="text-(--brand-400)" />
                            </div>
                            <span className="font-medium text-(--text-primary)">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right text-(--text-secondary) tabular-nums">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-3 py-2.5 text-right text-(--text-disabled) tabular-nums hidden sm:table-cell">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-(--text-primary) tabular-nums">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              {purchase.notes && (
                <div className="flex items-start gap-2 rounded-xl border border-(--warning-500)/20 bg-(--warning-500)/6 px-4 py-3 mt-3">
                  <FileText size={13} className="text-(--warning-400) shrink-0 mt-0.5" />
                  <p className="text-sm text-(--text-secondary)">{purchase.notes}</p>
                </div>
              )}
            </div>

            {/* Footer total */}
            <div className="px-5 py-4 border-t border-(--border-subtle) shrink-0 flex items-center justify-between">
              <span className="text-sm text-(--text-muted)">{t('purchases.total_amount')}</span>
              <span className="text-2xl font-black text-(--brand-400) tabular-nums">
                {formatCurrency(purchase.totalAmount)}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
