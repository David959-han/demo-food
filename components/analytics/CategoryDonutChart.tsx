'use client';

import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { CategoryStat } from '@/types/analytics';
import type { TranslationKey } from '@/types/i18n';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = [
  '#F97316', // burgers — brand orange
  '#3B82F6', // pizza   — info blue
  '#10B981', // wraps   — success green
  '#FBBF24', // salads  — warning amber
  '#EF4444', // drinks  — danger red
];

interface CssVars {
  tooltipBg:     string;
  tooltipBorder: string;
  surface:       string;
}

const FALLBACK: CssVars = {
  tooltipBg:     '#1A1D26',
  tooltipBorder: '#2A2D3A',
  surface:       '#111318',
};

function readCssVars(): CssVars {
  const s = getComputedStyle(document.documentElement);
  const g = (v: string) => s.getPropertyValue(v).trim();
  return {
    tooltipBg:     g('--bg-elevated')    || FALLBACK.tooltipBg,
    tooltipBorder: g('--border-default') || FALLBACK.tooltipBorder,
    surface:       g('--bg-surface')     || FALLBACK.surface,
  };
}

interface CategoryDonutChartProps {
  categories: CategoryStat[];
  loading:    boolean;
}

export function CategoryDonutChart({ categories, loading }: CategoryDonutChartProps) {
  const { t } = useTranslation();
  const [cssVars] = useState<CssVars>(() =>
    typeof window !== 'undefined' ? readCssVars() : FALLBACK,
  );

  const chartData = useMemo(() => ({
    labels: categories.map((c) =>
      t(`menu_cat.${c.key}` as TranslationKey),
    ),
    datasets: [{
      data:            categories.map((c) => c.orders),
      backgroundColor: CATEGORY_COLORS.map((c) => c + 'CC'),
      borderColor:     CATEGORY_COLORS,
      borderWidth:     2,
      hoverBorderWidth: 3,
      hoverOffset:     6,
    }],
  }), [categories, t]);

  const options = useMemo(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              '62%',
    plugins: {
      legend: {
        display:  true,
        position: 'bottom' as const,
        labels: {
          color:     '#8B92A5',
          boxWidth:  10,
          boxHeight: 10,
          font:      { size: 11 },
          padding:   12,
        },
      },
      tooltip: {
        backgroundColor: cssVars.tooltipBg,
        borderColor:     cssVars.tooltipBorder,
        borderWidth:     1,
        padding:         12,
        callbacks: {
          label: (ctx: TooltipItem<'doughnut'>) => {
            const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const pct   = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
            return ` ${ctx.label}: ${ctx.parsed} ${t('common.orders').toLowerCase()} (${pct}%)`;
          },
        },
      },
    },
  }), [cssVars, t]);

  const total = categories.reduce((s, c) => s + c.orders, 0);

  return (
    <div className="rounded-xl bg-(--bg-surface) border border-(--border-default) p-5 flex flex-col">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-(--text-primary)">
          {t('analytics.orders_category')}
        </h2>
      </div>

      {loading ? (
        <Skeleton shape="block" height="16rem" />
      ) : categories.length === 0 ? (
        <EmptyState
          title={t('analytics.no_data')}
          illustration="generic"
          size="sm"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="relative" style={{ height: '11rem', width: '100%' }}>
            <Doughnut data={chartData} options={options} />
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-(--text-primary) tabular-nums leading-tight">
                {total.toLocaleString()}
              </span>
              <span className="text-xs text-(--text-disabled)">
                {t('common.orders')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
