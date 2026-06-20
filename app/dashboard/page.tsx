'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { KPIGrid }       from '@/components/dashboard/KPIGrid';
import { RevenueChart }  from '@/components/dashboard/RevenueChart';
import { RecentOrders }  from '@/components/dashboard/RecentOrders';
import { PopularMenu }   from '@/components/dashboard/PopularMenu';
import { useTranslation } from '@/hooks/useTranslation';
import {
  getKpis,
  getRevenueChartData,
  getRecentOrders,
  getPopularItems,
} from '@/services/dashboardService';
import type { DashboardKpi, RevenueChartData, RecentOrder, PopularMenuItem } from '@/types/dashboard';

export default function DashboardPage() {
  const { t } = useTranslation();

  const [kpis,      setKpis]      = useState<DashboardKpi[]>([]);
  const [chartData, setChartData] = useState<RevenueChartData | null>(null);
  const [orders,    setOrders]    = useState<RecentOrder[]>([]);
  const [popular,   setPopular]   = useState<PopularMenuItem[]>([]);

  const [loadingKpis,    setLoadingKpis]    = useState(true);
  const [loadingChart,   setLoadingChart]   = useState(true);
  const [loadingOrders,  setLoadingOrders]  = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    getKpis().then(setKpis).finally(() => setLoadingKpis(false));
    getRevenueChartData().then(setChartData).finally(() => setLoadingChart(false));
    getRecentOrders().then(setOrders).finally(() => setLoadingOrders(false));
    getPopularItems().then(setPopular).finally(() => setLoadingPopular(false));
  }, []);

  return (
    <div className="space-y-5">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface)">
        <div className="relative z-10 px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-(--success-bg) border border-(--success-500)/20 text-[10px] font-bold text-(--success-400) uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-(--success-400) animate-pulse" />
              Live
            </span>
          </div>
          <h1 className="text-xl font-bold text-(--text-primary)">{t('nav.dashboard')}</h1>
          <p className="text-sm text-(--text-muted) mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/dashboard-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left rounded-r-2xl opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/40 to-transparent rounded-r-2xl" />
        </div>
      </div>

      <KPIGrid kpis={kpis} loading={loadingKpis} />

      <RevenueChart data={chartData} loading={loadingChart} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentOrders  orders={orders}  loading={loadingOrders}  />
        <PopularMenu   items={popular}  loading={loadingPopular} />
      </div>

    </div>
  );
}
