'use client';

import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { Table, TableStatus } from '@/types/table';
import type { TranslationKey } from '@/types/i18n';

const STATUS_STYLES: Record<TableStatus, string> = {
  free:     'bg-(--success-500)/15 border-(--success-500)/30 hover:border-(--success-500)/60',
  occupied: 'bg-(--danger-500)/15 border-(--danger-500)/30 hover:border-(--danger-500)/60',
  reserved: 'bg-(--brand-500)/15 border-(--brand-500)/30 hover:border-(--brand-500)/60',
  cleaning: 'bg-(--warning-500)/15 border-(--warning-500)/30 hover:border-(--warning-500)/60',
};

const STATUS_DOT: Record<TableStatus, string> = {
  free:     'bg-(--success-500)',
  occupied: 'bg-(--danger-500)',
  reserved: 'bg-(--brand-500)',
  cleaning: 'bg-(--warning-500)',
};

const STATUS_TEXT: Record<TableStatus, string> = {
  free:     'text-(--success-400)',
  occupied: 'text-(--danger-400)',
  reserved: 'text-(--brand-400)',
  cleaning: 'text-(--warning-400)',
};

interface TableCardProps {
  table:    Table;
  onClick:  (table: Table) => void;
  selected?: boolean;
}

export function TableCard({ table, onClick, selected }: TableCardProps) {
  const { t } = useTranslation();

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(table)}
      aria-label={`${t('tables.table_no')} ${table.number} — ${t(`status.${table.status}` as TranslationKey)}`}
      className={cn(
        'relative w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1',
        'cursor-pointer transition-colors duration-200 text-left',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
        STATUS_STYLES[table.status],
        selected && 'ring-2 ring-(--brand-500)',
      )}
    >
      {/* Table number */}
      <span className="text-xl font-bold text-(--text-primary) leading-none">
        {table.number}
      </span>

      {/* Capacity */}
      <div className="flex items-center gap-0.5">
        <Users size={9} className="text-(--text-disabled)" />
        <span className="text-[10px] text-(--text-muted)">{table.capacity}</span>
      </div>

      {/* Status dot */}
      <div className={cn('absolute top-1.5 right-1.5 w-2 h-2 rounded-full', STATUS_DOT[table.status])} />

      {/* Order badge */}
      {table.currentOrderId && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[9px] bg-(--bg-elevated) border border-(--border-default) rounded px-1 text-(--text-disabled) tabular-nums">
            #{table.currentOrderId}
          </span>
        </div>
      )}
    </motion.button>
  );
}

export { STATUS_STYLES, STATUS_DOT, STATUS_TEXT };
