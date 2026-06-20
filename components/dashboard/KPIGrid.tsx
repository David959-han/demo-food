'use client';

import {
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { DashboardKpi } from '@/types/dashboard';
import type { TranslationKey } from '@/types/i18n';

const KPI_ICONS: Record<string, ReactNode> = {
  total_orders:   <ShoppingCart size={18} />,
  revenue:        <DollarSign   size={18} />,
  new_customers:  <Users        size={18} />,
  pending_orders: <Clock        size={18} />,
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

interface KPIGridProps {
  kpis:    DashboardKpi[];
  loading: boolean;
}

export function KPIGrid({ kpis, loading }: KPIGridProps) {
  const { t } = useTranslation();

  if (!loading && kpis.length === 0) {
    return (
      <EmptyState
        title={t('common.no_data')}
        illustration="generic"
        size="sm"
      />
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      role="list"
      aria-label={t('kpi.total_orders')}
    >
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <StatCard key={i} title="" value="" loading />
          ))
        : kpis.map((kpi) => (
            <motion.div key={kpi.key} variants={item}>
              <StatCard
                title={t(`kpi.${kpi.key}` as TranslationKey)}
                value={kpi.value}
                delta={kpi.delta}
                trend={kpi.trend}
                variant={kpi.variant}
                icon={KPI_ICONS[kpi.key]}
              />
            </motion.div>
          ))}
    </motion.div>
  );
}
