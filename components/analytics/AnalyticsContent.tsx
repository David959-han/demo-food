'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { getAnalyticsData, getAnalyticsSummary } from '@/services/analyticsService';
import { AnalyticsKPI }          from './AnalyticsKPI';
import { AnalyticsTrendChart }   from './AnalyticsTrendChart';
import { CategoryDonutChart }    from './CategoryDonutChart';
import { PeakHoursChart }        from './PeakHoursChart';
import { AnalyticsReportsTable } from './AnalyticsReportsTable';
import { TopDishesCard }         from './TopDishesCard';
import type { AnalyticsData, AnalyticsSummary, DateRangePreset } from '@/types/analytics';
import type { TranslationKey } from '@/types/i18n';

const PRESETS: { value: DateRangePreset; labelKey: TranslationKey }[] = [
  { value: '7d',  labelKey: 'analytics.filter_7d'  },
  { value: '14d', labelKey: 'analytics.filter_14d' },
  { value: '30d', labelKey: 'analytics.filter_30d' },
];

export function AnalyticsContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();

  const preset = (searchParams.get('preset') as DateRangePreset) ?? '30d';

  const [loadedPreset,  setLoadedPreset]  = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [summary,       setSummary]       = useState<AnalyticsSummary | null>(null);

  const loading = loadedPreset !== preset;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const [data, sum] = await Promise.all([
        getAnalyticsData(preset),
        getAnalyticsSummary(preset),
      ]);
      if (!cancelled) {
        setAnalyticsData(data);
        setSummary(sum);
        setLoadedPreset(preset);
      }
    }

    void run();
    return () => { cancelled = true; };
  }, [preset]);

  function setPreset(value: DateRangePreset) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('preset', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface)">
        <div className="relative z-10 px-6 py-5">
          <h1 className="text-xl font-bold text-(--text-primary)">{t('analytics.title')}</h1>
          <p className="text-sm text-(--text-muted) mt-1">{t('analytics.subtitle')}</p>

          {/* Date preset filters */}
          <div
            role="group"
            aria-label="Date range filter"
            className="flex gap-1.5 mt-3 flex-wrap"
          >
            {PRESETS.map(({ value, labelKey }) => (
              <button
                key={value}
                onClick={() => setPreset(value)}
                aria-pressed={preset === value}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold',
                  'border transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
                  preset === value
                    ? 'bg-(--brand-500) text-white border-(--brand-500) shadow-sm'
                    : 'bg-(--bg-elevated) border-(--border-default) text-(--text-secondary) hover:border-(--border-strong)',
                )}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Hero illustration */}
        <div className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/analytics-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left rounded-r-2xl opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/40 to-transparent rounded-r-2xl" />
        </div>
      </div>

      {/* KPI cards */}
      <AnalyticsKPI summary={summary} loading={loading} />

      {/* Revenue trend + Category donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AnalyticsTrendChart
            reports={analyticsData?.dailyReports ?? []}
            loading={loading}
          />
        </div>
        <CategoryDonutChart
          categories={analyticsData?.categoryBreakdown ?? []}
          loading={loading}
        />
      </div>

      {/* Peak Hours + Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PeakHoursChart
          peakHours={analyticsData?.peakHours ?? []}
          loading={loading}
        />
        <TopDishesCard
          dishes={analyticsData?.topDishes ?? []}
          loading={loading}
        />
      </div>

      {/* Reports table */}
      <AnalyticsReportsTable
        reports={analyticsData?.dailyReports ?? []}
        loading={loading}
      />

    </div>
  );
}
