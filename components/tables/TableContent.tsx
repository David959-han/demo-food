'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { getTables } from '@/services/tableService';
import { TableFloorPlan } from './TableFloorPlan';
import { TableList } from './TableList';
import { TableStatusModal } from './TableStatusModal';
import type { Table, TableStatus, TableSection } from '@/types/table';
import type { TranslationKey } from '@/types/i18n';

type TableView = 'floor' | 'list';

const SECTIONS: { key: TableSection; labelKey: TranslationKey }[] = [
  { key: 'main',    labelKey: 'tables.section_main'    },
  { key: 'terrace', labelKey: 'tables.section_terrace' },
  { key: 'vip',     labelKey: 'tables.section_vip'     },
];

const STATUS_OPTIONS: { value: TableStatus; labelKey: TranslationKey }[] = [
  { value: 'free',     labelKey: 'status.free'     },
  { value: 'occupied', labelKey: 'status.occupied' },
  { value: 'reserved', labelKey: 'status.reserved' },
  { value: 'cleaning', labelKey: 'status.cleaning' },
];

const STATUS_COUNT_COLORS: Record<TableStatus, string> = {
  free:     'text-(--success-400)',
  occupied: 'text-(--danger-400)',
  reserved: 'text-(--brand-400)',
  cleaning: 'text-(--warning-400)',
};

export function TableContent() {
  const { t } = useTranslation();
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const pathname      = usePathname();
  const tableStatuses = useRestaurantStore((s) => s.tableStatuses);
  const setTableStatus = useRestaurantStore((s) => s.setTableStatus);

  const [view, setView]           = useState<TableView>('floor');
  const [loading, setLoading]     = useState(true);
  const [rawTables, setRawTables] = useState<Table[]>([]);
  const [selected, setSelected]   = useState<Table | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const sectionParam = searchParams.get('section') as TableSection | null;
  const statusParam  = searchParams.get('status')  as TableStatus  | null;

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) params.delete(key);
      else params.set(key, value);
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Load base tables
  useEffect(() => {
    void (async () => {
      setLoading(true);
      const data = await getTables();
      setRawTables(data);
      setLoading(false);
    })();
  }, []);

  // Merge status overrides
  const tables: Table[] = rawTables.map((t) => ({
    ...t,
    status: tableStatuses[t.id] ?? t.status,
    currentOrderId: (tableStatuses[t.id] === 'free' || tableStatuses[t.id] === 'cleaning' || tableStatuses[t.id] === 'reserved')
      ? null
      : t.currentOrderId,
  }));

  // Filter
  const filtered = tables.filter((t) => {
    if (sectionParam && t.section !== sectionParam) return false;
    if (statusParam  && t.status  !== statusParam)  return false;
    return true;
  });

  // Status counts
  const counts: Record<TableStatus, number> = {
    free:     tables.filter((t) => t.status === 'free').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
    cleaning: tables.filter((t) => t.status === 'cleaning').length,
  };

  const handleTableClick = (table: Table) => {
    setSelected(table);
    setModalOpen(true);
  };

  const handleStatusChange = (id: number, status: TableStatus) => {
    setTableStatus(id, status);
  };

  // Selected table with latest status
  const selectedWithLatest = selected
    ? tables.find((t) => t.id === selected.id) ?? selected
    : null;

  const viewBtnCls = (active: boolean) =>
    cn(
      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium',
      'transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
      active
        ? 'bg-(--bg-surface) text-(--text-primary) shadow-sm'
        : 'text-(--text-muted) hover:text-(--text-secondary)',
    );

  const selectCls = cn(
    'h-9 px-2.5 text-xs rounded-lg appearance-none',
    'bg-(--bg-elevated) text-(--text-secondary)',
    'border border-(--border-default) hover:border-(--border-strong)',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface)">
        <div className="relative z-10 px-6 py-5 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-(--text-primary)">{t('tables.title')}</h1>
            <p className="text-sm text-(--text-muted) mt-1">
              {tables.length} {t('common.item').toLowerCase()}s
            </p>
          </div>

          {/* View toggle */}
          <div
            role="group"
            aria-label="View toggle"
            className="flex items-center gap-0.5 p-0.5 rounded-lg bg-(--bg-elevated) border border-(--border-default)"
          >
          <button onClick={() => setView('floor')} className={viewBtnCls(view === 'floor')} aria-label={t('tables.floor_plan')}>
            <LayoutGrid size={14} />
            <span className="hidden sm:inline">{t('tables.floor_plan')}</span>
          </button>
          <button onClick={() => setView('list')} className={viewBtnCls(view === 'list')} aria-label={t('tables.list_view')}>
            <List size={14} />
            <span className="hidden sm:inline">{t('tables.list_view')}</span>
          </button>
          </div>
        </div>

        {/* Hero illustration */}
        <div className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/tables-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left rounded-r-2xl opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/40 to-transparent rounded-r-2xl" />
        </div>
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(({ value, labelKey }) => (
          <button
            key={value}
            onClick={() => setParam('status', statusParam === value ? '' : value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              'border transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
              statusParam === value
                ? 'bg-(--bg-elevated) border-(--border-strong) text-(--text-primary)'
                : 'bg-(--bg-subtle) border-(--border-subtle) text-(--text-muted) hover:border-(--border-default)',
            )}
          >
            <span className={STATUS_COUNT_COLORS[value]}>●</span>
            {t(labelKey)}
            <span className={cn('tabular-nums font-bold', STATUS_COUNT_COLORS[value])}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {/* Section filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={sectionParam ?? ''}
          onChange={(e) => setParam('section', e.target.value)}
          aria-label={t('tables.all_sections')}
          className={selectCls}
        >
          <option value="">{t('tables.all_sections')}</option>
          {SECTIONS.map(({ key, labelKey }) => (
            <option key={key} value={key}>{t(labelKey)}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {view === 'floor' ? (
        <TableFloorPlan
          tables={filtered}
          loading={loading}
          selectedId={selected?.id}
          onTableClick={handleTableClick}
          activeSections={sectionParam ? [sectionParam] : undefined}
        />
      ) : (
        <TableList
          tables={filtered}
          loading={loading}
          onTableClick={handleTableClick}
        />
      )}

      {/* Status modal */}
      <TableStatusModal
        table={selectedWithLatest}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
