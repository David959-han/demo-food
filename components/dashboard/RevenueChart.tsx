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
} from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { RevenueChartData } from '@/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

interface CssVars {
  brand:     string;
  brandFill: string;
  grid:      string;
  ticks:     string;
  tooltipBg: string;
  tooltipBorder: string;
}

const FALLBACK: CssVars = {
  brand:        '#F97316',
  brandFill:    '#F9731618',
  grid:         '#2A2D3A',
  ticks:        '#555B6E',
  tooltipBg:    '#1A1D26',
  tooltipBorder:'#2A2D3A',
};

function readCssVars(): CssVars {
  const s = getComputedStyle(document.documentElement);
  const g = (v: string) => s.getPropertyValue(v).trim();
  return {
    brand:        g('--brand-500')        || FALLBACK.brand,
    brandFill:    (g('--brand-500') || '#F97316') + '18',
    grid:         g('--border-default')   || FALLBACK.grid,
    ticks:        g('--text-muted')       || FALLBACK.ticks,
    tooltipBg:    g('--bg-elevated')      || FALLBACK.tooltipBg,
    tooltipBorder:g('--border-default')   || FALLBACK.tooltipBorder,
  };
}

interface RevenueChartProps {
  data:    RevenueChartData | null;
  loading: boolean;
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  const { t } = useTranslation();
  const [cssVars] = useState<CssVars>(() =>
    typeof window !== 'undefined' ? readCssVars() : FALLBACK,
  );

  const chartData = useMemo(() => {
    if (!data) return null;
    return {
      labels: data.labels,
      datasets: [
        {
          data:            data.data,
          fill:            true,
          borderColor:     cssVars.brand,
          backgroundColor: cssVars.brandFill,
          tension:         0.4,
          borderWidth:     2,
          pointRadius:     4,
          pointHoverRadius:6,
          pointBackgroundColor: cssVars.brand,
          pointBorderColor:     cssVars.brand,
        },
      ],
    };
  }, [data, cssVars]);

  const options = useMemo(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: cssVars.tooltipBg,
        borderColor:     cssVars.tooltipBorder,
        borderWidth:     1,
        padding:         12,
        callbacks: {
          label: (ctx: TooltipItem<'line'>) => {
            const y = ctx.parsed.y;
            return y != null ? ` $${y.toLocaleString()}` : '';
          },
        },
      },
    },
    scales: {
      x: {
        grid:  { color: cssVars.grid + '40' },
        ticks: { color: cssVars.ticks, font: { size: 12 } },
        border:{ display: false },
      },
      y: {
        grid:  { color: cssVars.grid + '40' },
        ticks: {
          color: cssVars.ticks,
          font:  { size: 12 },
          callback: (value: string | number) =>
            typeof value === 'number' ? `$${value.toLocaleString()}` : value,
        },
        border: { display: false },
        min: 0,
      },
    },
  }), [cssVars]);

  return (
    <div className="rounded-xl bg-(--bg-surface) border border-(--border-default) p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-(--text-primary)">
            {t('dashboard.revenue_trend')}
          </h2>
          <p className="text-xs text-(--text-muted) mt-0.5">
            {t('dashboard.this_week')}
          </p>
        </div>
      </div>

      {/* Chart area */}
      {loading ? (
        <Skeleton shape="block" height="14rem" />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title={t('common.no_data')}
          illustration="generic"
          size="sm"
        />
      ) : (
        <div style={{ height: '14rem' }}>
          {chartData && <Line data={chartData} options={options} />}
        </div>
      )}
    </div>
  );
}
