'use client';

import { cn } from '@/lib/utils';
import { TableCard } from './TableCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import type { Table, TableSection } from '@/types/table';
import type { TranslationKey } from '@/types/i18n';

const SECTIONS: { key: TableSection; labelKey: TranslationKey }[] = [
  { key: 'main',    labelKey: 'tables.section_main'    },
  { key: 'terrace', labelKey: 'tables.section_terrace' },
  { key: 'vip',     labelKey: 'tables.section_vip'     },
];

const SECTION_ACCENT: Record<TableSection, string> = {
  main:    'border-(--border-default)',
  terrace: 'border-(--success-500)/20',
  vip:     'border-(--brand-500)/20',
};

const SECTION_LABEL: Record<TableSection, string> = {
  main:    'text-(--text-secondary)',
  terrace: 'text-(--success-400)',
  vip:     'text-(--brand-400)',
};

interface TableFloorPlanProps {
  tables:          Table[];
  loading:         boolean;
  selectedId?:     number | null;
  onTableClick:    (table: Table) => void;
  activeSections?: TableSection[];
}

export function TableFloorPlan({
  tables,
  loading,
  selectedId,
  onTableClick,
  activeSections,
}: TableFloorPlanProps) {
  const { t } = useTranslation();

  if (!loading && tables.length === 0) {
    return (
      <EmptyState
        title={t('tables.no_tables')}
        description={t('tables.no_tables_desc')}
        illustration="table"
      />
    );
  }

  const sectionsToShow = activeSections?.length
    ? SECTIONS.filter((s) => activeSections.includes(s.key))
    : SECTIONS;

  return (
    <div className="flex flex-col gap-4">
      {sectionsToShow.map(({ key, labelKey }) => {
        const sectionTables = tables.filter((t) => t.section === key);
        if (!loading && sectionTables.length === 0) return null;

        return (
          <div
            key={key}
            className={cn(
              'rounded-xl border p-4',
              'bg-(--bg-surface)',
              SECTION_ACCENT[key],
            )}
          >
            {/* Section label */}
            <p className={cn('text-xs font-semibold uppercase tracking-widest mb-4', SECTION_LABEL[key])}>
              {t(labelKey)}
            </p>

            {/* Tables grid */}
            <div className="flex flex-wrap gap-5 pb-2">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} shape="block" width="5rem" height="5rem" />
                  ))
                : sectionTables.map((table) => (
                    <TableCard
                      key={table.id}
                      table={table}
                      onClick={onTableClick}
                      selected={table.id === selectedId}
                    />
                  ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
