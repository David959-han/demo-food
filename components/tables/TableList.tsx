'use client';

import { Users, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
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

const SECTION_LABEL_KEY: Record<TableSection, TranslationKey> = {
  main:    'tables.section_main',
  terrace: 'tables.section_terrace',
  vip:     'tables.section_vip',
};

const SKELETON_ROWS = 8;

interface TableListProps {
  tables:       Table[];
  loading:      boolean;
  onTableClick: (table: Table) => void;
}

export function TableList({ tables, loading, onTableClick }: TableListProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl bg-(--bg-surface) border border-(--border-default) overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-(--border-subtle)">
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide w-16" scope="col">
                #
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('common.category')}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('tables.capacity')}
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('common.status')}
              </th>
              <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('tables.current_order')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-subtle)">
            {loading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton shape="line" width="2rem" /></td>
                    <td className="px-4 py-3"><Skeleton shape="line" width="6rem" /></td>
                    <td className="px-4 py-3"><Skeleton shape="line" width="4rem" /></td>
                    <td className="px-4 py-3 text-center"><Skeleton shape="line" width="5rem" /></td>
                    <td className="hidden sm:table-cell px-4 py-3"><Skeleton shape="line" width="4rem" /></td>
                  </tr>
                ))
              : tables.length === 0
                ? (
                  <tr>
                    <td colSpan={5} className="py-4">
                      <EmptyState
                        title={t('tables.no_tables')}
                        description={t('tables.no_tables_desc')}
                        illustration="table"
                        size="sm"
                      />
                    </td>
                  </tr>
                )
                : tables.map((table) => (
                  <tr
                    key={table.id}
                    onClick={() => onTableClick(table)}
                    className="group hover:bg-(--bg-subtle) transition-colors duration-100 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-(--text-primary)">{table.number}</span>
                    </td>

                    <td className="px-4 py-3 text-sm text-(--text-secondary)">
                      {t(SECTION_LABEL_KEY[table.section])}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-(--text-secondary)">
                        <Users size={13} className="text-(--text-disabled)" />
                        <span>{table.capacity} {t('tables.seats')}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={STATUS_VARIANT[table.status]} shape="pill">
                        {t(`status.${table.status}` as TranslationKey)}
                      </Badge>
                    </td>

                    <td className="hidden sm:table-cell px-4 py-3">
                      {table.currentOrderId ? (
                        <div className="flex items-center gap-1.5 text-sm text-(--text-secondary)">
                          <ShoppingBag size={13} className="text-(--text-disabled)" />
                          <span className="tabular-nums">#{table.currentOrderId}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-(--text-disabled)">—</span>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
