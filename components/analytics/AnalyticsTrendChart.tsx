'use client';

import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { DailyReport } from '@/types/analytics';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

interface CssVars {
  brand:    string;
  success:  string;
  grid:     string;
  ticks:    string;
  tooltipBg: string;
  tooltipBorder: string;
}

const FALLBACK: CssVars = {
  brand:         '#F97316',
  success:       '#10B981',
  grid:          '#2A2D3A',
  ticks:         '#555B6E',
  tooltipBg:     '#1A1D26',
  tooltipBorder: '#2A2D3A',
};

function readCssVars(): CssVars {
  const s = getComputedStyle(document.documentElement);
  const g = (v: string) => s.getPropertyValue(v).trim();
  return {
    brand:         g('--brand-500')       || FALLBACK.brand,
    success:       g('--success-500')     || FALLBACK.success,
    grid:          g('--border-default')  || FALLBACK.grid,
    ticks:         g('--text-muted')      || FALLBACK.ticks,
    tooltipBg:     g('--bg-elevated')     || FALLBACK.tooltipBg,
    tooltipBorder: g('--border-default')  || FALLBACK.tooltipBorder,
  };
}

function formatLabel(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface AnalyticsTrendChartProps {
  reports: DailyReport[];
  loading: boolean;
}

export function AnalyticsTrendChart({ reports, loading }: AnalyticsTrendChartProps) {
  const { t } = useTranslation();
  const [cssVars] = useState<CssVars>(() =>
    typeof window !== 'undefined' ? readCssVars() : FALLBACK,
  );

  const chartData = useMemo(() => ({
    labels: reports.map((r) => formatLabel(r.date)),
    datasets: [
      {
        label:                t('analytics.revenue_line'),
        data:                 reports.map((r) => r.revenue),
        fill:                 true,
        borderColor:          cssVars.brand,
        backgroundColor:      cssVars.brand + '18',
        tension:              0.4,
        borderWidth:          2.5,
        pointRadius:          reports.length <= 14 ? 4 : 2,
        pointHoverRadius:     6,
        pointBackgroundColor: cssVars.brand,
        pointBorderColor:     cssVars.brand,
      },
      {
        label:                t('analytics.profit_line'),
        data:                 reports.map((r) => r.profit),
        fill:                 true,
        borderColor:          cssVars.success,
        backgroundColor:      cssVars.success + '12',
        tension:              0.4,
        borderWidth:          2,
        pointRadius:          reports.length <= 14 ? 3 : 1.5,
        pointHoverRadius:     5,
        pointBackgroundColor: cssVars.success,
        pointBorderColor:     cssVars.success,
        borderDash:           [],
      },
    ],
  }), [reports, cssVars, t]);

  const options = useMemo(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    interaction:         { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        display:  true,
        position: 'top' as const,
        align:    'end' as const,
        labels: {
          color:     cssVars.ticks,
          boxWidth:  10,
          boxHeight: 10,
          font:      { size: 11 },
          padding:   16,
        },
      },
      tooltip: {
        backgroundColor: cssVars.tooltipBg,
        borderColor:     cssVars.tooltipBorder,
        borderWidth:     1,
        padding:         12,
        callbacks: {
          label: (ctx: TooltipItem<'line'>) => {
            const y = ctx.parsed.y;
            return y != null ? ` ${ctx.dataset.label}: $${y.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '';
          },
        },
      },
    },
    scales: {
      x: {
        grid:   { color: cssVars.grid + '40' },
        ticks:  { color: cssVars.ticks, font: { size: 11 }, maxTicksLimit: 10 },
        border: { display: false },
      },
      y: {
        grid:   { color: cssVars.grid + '40' },
        ticks:  {
          color:    cssVars.ticks,
          font:     { size: 11 },
          callback: (value: string | number) =>
            typeof value === 'number' ? `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : value,
        },
        border: { display: false },
        min:    0,
      },
    },
  }), [cssVars]);

  return (
    <div className="rounded-xl bg-(--bg-surface) border border-(--border-default) p-5 flex flex-col">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-(--text-primary)">
          {t('analytics.revenue_trend')}
        </h2>
      </div>

      {loading ? (
        <Skeleton shape="block" height="16rem" />
      ) : reports.length === 0 ? (
        <EmptyState
          title={t('analytics.no_data')}
          illustration="generic"
          size="sm"
        />
      ) : (
        <div style={{ height: '16rem' }}>
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
