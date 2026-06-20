'use client';

import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { PeakHour } from '@/types/analytics';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface CssVars {
  brand:         string;
  brandMuted:    string;
  grid:          string;
  ticks:         string;
  tooltipBg:     string;
  tooltipBorder: string;
}

const FALLBACK: CssVars = {
  brand:         '#F97316',
  brandMuted:    '#F9731630',
  grid:          '#2A2D3A',
  ticks:         '#555B6E',
  tooltipBg:     '#1A1D26',
  tooltipBorder: '#2A2D3A',
};

function readCssVars(): CssVars {
  const s = getComputedStyle(document.documentElement);
  const g = (v: string) => s.getPropertyValue(v).trim();
  const brand = g('--brand-500') || FALLBACK.brand;
  return {
    brand,
    brandMuted:    brand + '40',
    grid:          g('--border-default') || FALLBACK.grid,
    ticks:         g('--text-muted')     || FALLBACK.ticks,
    tooltipBg:     g('--bg-elevated')    || FALLBACK.tooltipBg,
    tooltipBorder: g('--border-default') || FALLBACK.tooltipBorder,
  };
}

function formatHour(hour: number): string {
  if (hour === 0)  return '12am';
  if (hour < 12)   return `${hour}am`;
  if (hour === 12) return '12pm';
  return `${hour - 12}pm`;
}

interface PeakHoursChartProps {
  peakHours: PeakHour[];
  loading:   boolean;
}

export function PeakHoursChart({ peakHours, loading }: PeakHoursChartProps) {
  const { t } = useTranslation();
  const [cssVars] = useState<CssVars>(() =>
    typeof window !== 'undefined' ? readCssVars() : FALLBACK,
  );

  const maxOrders = Math.max(...peakHours.map((h) => h.orders), 1);

  const chartData = useMemo(() => ({
    labels: peakHours.map((h) => formatHour(h.hour)),
    datasets: [{
      data:            peakHours.map((h) => h.orders),
      backgroundColor: peakHours.map((h) =>
        h.orders >= maxOrders * 0.75
          ? cssVars.brand
          : h.orders >= maxOrders * 0.4
            ? cssVars.brand + 'AA'
            : cssVars.brand + '40',
      ),
      borderColor:     'transparent',
      borderRadius:    4,
      borderWidth:     0,
    }],
  }), [peakHours, cssVars, maxOrders]);

  const options = useMemo(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      legend:  { display: false },
      tooltip: {
        backgroundColor: cssVars.tooltipBg,
        borderColor:     cssVars.tooltipBorder,
        borderWidth:     1,
        padding:         10,
        callbacks: {
          title: (items: TooltipItem<'bar'>[]) => items[0]?.label ?? '',
          label: (ctx: TooltipItem<'bar'>) =>
            ` ${ctx.parsed.y} ${t('common.orders').toLowerCase()}`,
        },
      },
    },
    scales: {
      x: {
        grid:   { display: false },
        ticks:  { color: cssVars.ticks, font: { size: 10 }, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        grid:   { color: cssVars.grid + '40' },
        ticks:  { color: cssVars.ticks, font: { size: 11 } },
        border: { display: false },
        min:    0,
      },
    },
  }), [cssVars, t]);

  const peakHour = peakHours.reduce(
    (best, h) => h.orders > best.orders ? h : best,
    peakHours[0] ?? { hour: 0, orders: 0 },
  );

  return (
    <div className="rounded-xl bg-(--bg-surface) border border-(--border-default) p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-(--text-primary)">
            {t('analytics.peak_hours')}
          </h2>
          <p className="text-xs text-(--text-muted) mt-0.5">
            {t('analytics.peak_hours_desc')}
          </p>
        </div>
        {!loading && peakHours.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-(--brand-500)/10 border border-(--brand-500)/20">
            <span className="text-xs font-semibold text-(--brand-400)">
              {formatHour(peakHour.hour)} — {peakHour.orders} {t('common.orders').toLowerCase()}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <Skeleton shape="block" height="12rem" />
      ) : peakHours.length === 0 ? (
        <EmptyState
          title={t('analytics.no_data')}
          illustration="generic"
          size="sm"
        />
      ) : (
        <div style={{ height: '12rem' }}>
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
