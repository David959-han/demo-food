'use client';

import { Users, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import type { Table, TableStatus, TableSection } from '@/types/table';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TranslationKey } from '@/types/i18n';

const STATUS_VARIANT: Record<TableStatus, BadgeVariant> = {
  free:     'success',
  occupied: 'danger',
  reserved: 'brand',
  cleaning: 'warning',
};

const STATUS_ACTIONS: {
  status:   TableStatus;
  labelKey: TranslationKey;
  variant:  string;
}[] = [
  { status: 'free',     labelKey: 'tables.mark_free',       variant: 'success' },
  { status: 'occupied', labelKey: 'tables.mark_occupied',   variant: 'danger'  },
  { status: 'reserved', labelKey: 'tables.mark_reserved',   variant: 'brand'   },
  { status: 'cleaning', labelKey: 'tables.mark_cleaning',   variant: 'warning' },
];

const SECTION_LABEL_KEY: Record<TableSection, TranslationKey> = {
  main:    'tables.section_main',
  terrace: 'tables.section_terrace',
  vip:     'tables.section_vip',
};

const BTN_VARIANT: Record<string, string> = {
  success: 'bg-(--success-500)/10 text-(--success-400) border-(--success-500)/30 hover:bg-(--success-500)/20',
  danger:  'bg-(--danger-500)/10 text-(--danger-400)  border-(--danger-500)/30  hover:bg-(--danger-500)/20',
  brand:   'bg-(--brand-500)/10 text-(--brand-400)    border-(--brand-500)/30   hover:bg-(--brand-500)/20',
  warning: 'bg-(--warning-500)/10 text-(--warning-400) border-(--warning-500)/30 hover:bg-(--warning-500)/20',
};

interface TableStatusModalProps {
  table:            Table | null;
  open:             boolean;
  onClose:          () => void;
  onStatusChange:   (id: number, status: TableStatus) => void;
}

export function TableStatusModal({
  table,
  open,
  onClose,
  onStatusChange,
}: TableStatusModalProps) {
  const { t } = useTranslation();

  if (!table) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${t('tables.table_no')} ${table.number}`}
      size="sm"
    >
      <div className="flex flex-col gap-4">
        {/* Table info */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-(--bg-elevated)">
          <div className="flex items-center gap-1.5 text-sm text-(--text-secondary)">
            <Users size={14} className="text-(--text-disabled)" />
            <span>{table.capacity} {t('tables.seats')}</span>
          </div>
          <div className="text-sm text-(--text-secondary)">
            {t(SECTION_LABEL_KEY[table.section])}
          </div>
          <div className="ml-auto">
            <Badge variant={STATUS_VARIANT[table.status]} shape="pill">
              {t(`status.${table.status}` as TranslationKey)}
            </Badge>
          </div>
        </div>

        {/* Current order */}
        {table.currentOrderId && (
          <div className="flex items-center gap-2 text-sm text-(--text-secondary) px-1">
            <ShoppingBag size={14} className="text-(--text-disabled)" />
            <span>{t('tables.current_order')}:</span>
            <span className="font-semibold text-(--text-primary) tabular-nums">
              #{table.currentOrderId}
            </span>
          </div>
        )}

        {/* Status actions */}
        <div>
          <p className="text-xs font-semibold text-(--text-disabled) uppercase tracking-wide mb-2">
            {t('tables.status_change')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_ACTIONS.map(({ status, labelKey, variant }) => (
              <button
                key={status}
                disabled={table.status === status}
                onClick={() => {
                  onStatusChange(table.id, status);
                  onClose();
                }}
                className={cn(
                  'px-3 py-2 rounded-lg border text-sm font-medium',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  BTN_VARIANT[variant],
                )}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
