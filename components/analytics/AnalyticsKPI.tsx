'use client';

import { DollarSign, TrendingUp, ShoppingCart, Users, BarChart2, Percent } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { StatCard } from '@/components/ui/StatCard';
import { useTranslation } from '@/hooks/useTranslation';
import type { AnalyticsSummary } from '@/types/analytics';
import type { TranslationKey } from '@/types/i18n';

interface KPIItem {
  key:     string;
  labelKey: TranslationKey;
  icon:    React.ReactNode;
  variant: 'brand' | 'success' | 'info' | 'warning';
  format:  (s: AnalyticsSummary) => string;
  trend:   (s: AnalyticsSummary) => string;
}

const KPI_ITEMS: KPIItem[] = [
  {
    key:      'revenue',
    labelKey: 'analytics.kpi_revenue',
    icon:     <DollarSign size={18} />,
    variant:  'brand',
    format:   (s) => `$${s.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    trend:    () => '+12%',
  },
  {
    key:      'profit',
    labelKey: 'analytics.kpi_profit',
    icon:     <TrendingUp size={18} />,
    variant:  'success',
    format:   (s) => `$${s.totalProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    trend:    () => '+8%',
  },
  {
    key:      'orders',
    labelKey: 'analytics.kpi_orders',
    icon:     <ShoppingCart size={18} />,
    variant:  'info',
    format:   (s) => s.totalOrders.toLocaleString(),
    trend:    () => '+15%',
  },
  {
    key:      'customers',
    labelKey: 'analytics.kpi_customers',
    icon:     <Users size={18} />,
    variant:  'warning',
    format:   (s) => s.totalCustomers.toLocaleString(),
    trend:    () => '+10%',
  },
  {
    key:      'avg_order',
    labelKey: 'analytics.kpi_avg_order',
    icon:     <BarChart2 size={18} />,
    variant:  'brand',
    format:   (s) => `$${s.avgOrderValue.toFixed(2)}`,
    trend:    () => '-3%',
  },
  {
    key:      'margin',
    labelKey: 'analytics.kpi_margin',
    icon:     <Percent size={18} />,
    variant:  'success',
    format:   (s) => `${s.profitMargin.toFixed(1)}%`,
    trend:    () => '+1%',
  },
];

const container: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardItem: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
};

interface AnalyticsKPIProps {
  summary: AnalyticsSummary | null;
  loading: boolean;
}

export function AnalyticsKPI({ summary, loading }: AnalyticsKPIProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3"
      role="list"
      aria-label={t('analytics.title')}
    >
      {loading || !summary
        ? KPI_ITEMS.map((kpiItem) => (
            <StatCard key={kpiItem.key} title="" value="" loading />
          ))
        : KPI_ITEMS.map((kpiItem) => (
            <motion.div key={kpiItem.key} variants={cardItem}>
              <StatCard
                title={t(kpiItem.labelKey)}
                value={kpiItem.format(summary)}
                delta={kpiItem.trend(summary)}
                trend={kpiItem.key === 'avg_order' ? 'down' : 'up'}
                variant={kpiItem.variant}
                icon={kpiItem.icon}
              />
            </motion.div>
          ))}
    </motion.div>
  );
}
