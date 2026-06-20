'use client';

import { useState } from 'react';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { DailyReport } from '@/types/analytics';

type SortKey = 'date' | 'orders' | 'revenue' | 'profit' | 'customers' | 'margin';
type SortDir = 'asc' | 'desc';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: '2-digit',
  });
}

function marginVariant(m: number) {
  if (m >= 35) return 'success';
  if (m >= 28) return 'warning';
  return 'danger';
}

function exportCSV(reports: DailyReport[], headers: string[]) {
  const rows = [
    headers.join(','),
    ...reports.map((r) => {
      const margin = r.revenue > 0 ? ((r.profit / r.revenue) * 100).toFixed(1) : '0';
      return [r.date, r.orders, r.revenue.toFixed(2), r.profit.toFixed(2), r.customers, margin].join(',');
    }),
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `analytics-report-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface AnalyticsReportsTableProps {
  reports: DailyReport[];
  loading: boolean;
}

const SKELETON_ROWS = 7;

export function AnalyticsReportsTable({ reports, loading }: AnalyticsReportsTableProps) {
  const { t } = useTranslation();

  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = [...reports].sort((a, b) => {
    let diff = 0;
    if (sortKey === 'date')      diff = a.date.localeCompare(b.date);
    else if (sortKey === 'margin')
      diff = (a.profit / a.revenue) - (b.profit / b.revenue);
    else
      diff = (a[sortKey] as number) - (b[sortKey] as number);
    return sortDir === 'asc' ? diff : -diff;
  });

  const csvHeaders = [
    t('analytics.col_date'),
    t('analytics.col_orders'),
    t('analytics.col_revenue'),
    t('analytics.col_profit'),
    t('analytics.col_customers'),
    t('analytics.col_margin'),
  ];

  const columns: { key: SortKey; label: string; align: string }[] = [
    { key: 'date',      label: t('analytics.col_date'),      align: 'text-left' },
    { key: 'orders',    label: t('analytics.col_orders'),    align: 'text-right' },
    { key: 'revenue',   label: t('analytics.col_revenue'),   align: 'text-right' },
    { key: 'profit',    label: t('analytics.col_profit'),    align: 'text-right' },
    { key: 'customers', label: t('analytics.col_customers'), align: 'text-right hidden sm:table-cell' },
    { key: 'margin',    label: t('analytics.col_margin'),    align: 'text-right hidden md:table-cell' },
  ];

  return (
    <div className="rounded-xl bg-(--bg-surface) border border-(--border-default) overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-(--border-subtle)">
        <h2 className="text-sm font-semibold text-(--text-primary)">
          {t('analytics.reports_table')}
        </h2>

        <button
          onClick={() => !loading && reports.length > 0 && exportCSV(sorted, csvHeaders)}
          disabled={loading || reports.length === 0}
          aria-label={t('analytics.export_csv')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
            'border transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
            loading || reports.length === 0
              ? 'bg-(--bg-subtle) border-(--border-subtle) text-(--text-disabled) cursor-not-allowed'
              : 'bg-(--brand-500)/10 border-(--brand-500)/30 text-(--brand-400) hover:bg-(--brand-500)/20',
          )}
        >
          <Download size={13} />
          {t('analytics.export_csv')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-(--border-subtle)">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide',
                    'cursor-pointer select-none hover:text-(--text-secondary) transition-colors duration-100',
                    col.align,
                  )}
                  onClick={() => handleSort(col.key)}
                  aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === 'asc'
                        ? <TrendingUp size={11} className="text-(--brand-400)" />
                        : <TrendingDown size={11} className="text-(--brand-400)" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-(--border-subtle)">
            {loading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton shape="line" width="5rem" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton shape="line" width="2.5rem" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton shape="line" width="4rem" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton shape="line" width="3.5rem" /></td>
                    <td className="hidden sm:table-cell px-4 py-3 text-right"><Skeleton shape="line" width="2.5rem" /></td>
                    <td className="hidden md:table-cell px-4 py-3 text-right"><Skeleton shape="line" width="3rem" /></td>
                  </tr>
                ))
              : sorted.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className="py-4">
                      <EmptyState
                        title={t('analytics.no_data')}
                        description={t('analytics.no_data_desc')}
                        illustration="generic"
                        size="sm"
                      />
                    </td>
                  </tr>
                )
                : sorted.map((r) => {
                    const margin = r.revenue > 0 ? (r.profit / r.revenue) * 100 : 0;
                    return (
                      <tr
                        key={r.id}
                        className="group hover:bg-(--bg-subtle) transition-colors duration-100"
                      >
                        <td className="px-4 py-2.5 text-sm text-(--text-secondary) tabular-nums">
                          {formatDate(r.date)}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-(--text-primary) tabular-nums text-right font-medium">
                          {r.orders}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-(--text-primary) tabular-nums text-right font-medium">
                          ${r.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-(--success-400) tabular-nums text-right font-medium">
                          ${r.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="hidden sm:table-cell px-4 py-2.5 text-sm text-(--text-secondary) tabular-nums text-right">
                          {r.customers}
                        </td>
                        <td className="hidden md:table-cell px-4 py-2.5 text-right">
                          <Badge variant={marginVariant(margin)} shape="pill">
                            {margin.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
          </tbody>
        </table>
      </div>

      {!loading && sorted.length > 0 && (
        <div className="px-5 py-3 border-t border-(--border-subtle) text-xs text-(--text-disabled) text-right">
          {sorted.length} {t('common.item').toLowerCase()}s
        </div>
      )}
    </div>
  );
}
