'use client';

import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

export type StatCardTrend   = 'up' | 'down' | 'neutral';
export type StatCardVariant = 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'neutral';

interface StatCardProps {
  title:       string;
  value:       string | number;
  delta?:      string | number;
  deltaLabel?: string;
  trend?:      StatCardTrend;
  icon?:       ReactNode;
  variant?:    StatCardVariant;
  loading?:    boolean;
  className?:  string;
}

const iconBg: Record<StatCardVariant, string> = {
  success: 'bg-(--success-bg) text-(--success-400)',
  warning: 'bg-(--warning-bg) text-(--warning-400)',
  danger:  'bg-(--danger-bg)  text-(--danger-400)',
  info:    'bg-(--info-bg)    text-(--info-400)',
  brand:   'bg-(--brand-bg)   text-(--brand-400)',
  neutral: 'bg-(--bg-subtle)  text-(--text-secondary)',
};

const trendColor: Record<StatCardTrend, string> = {
  up:      'text-(--success-400)',
  down:    'text-(--danger-400)',
  neutral: 'text-(--text-muted)',
};

const TrendIcon = ({ trend }: { trend: StatCardTrend }) => {
  if (trend === 'up')      return <TrendingUp  size={13} />;
  if (trend === 'down')    return <TrendingDown size={13} />;
  return <Minus size={13} />;
};

export function StatCard({
  title,
  value,
  delta,
  deltaLabel,
  trend     = 'neutral',
  icon,
  variant   = 'brand',
  loading   = false,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'rounded-xl p-4 bg-(--bg-surface) border border-(--border-default)',
          'flex flex-col gap-3',
          className,
        )}
      >
        <div className="flex items-start justify-between">
          <Skeleton shape="line" width="40%" />
          <Skeleton shape="circle" width="2.5rem" />
        </div>
        <Skeleton shape="line" width="55%" height="2rem" />
        <Skeleton shape="line" width="30%" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl p-4',
        'bg-(--bg-surface) border border-(--border-default)',
        'flex flex-col gap-3',
        'cursor-default',
        className,
      )}
    >
      {/* Top row: title + icon */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-(--text-muted) uppercase tracking-wide leading-none pt-0.5">
          {title}
        </span>
        {icon && (
          <span
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
              '[&_svg]:w-4.5 [&_svg]:h-4.5',
              iconBg[variant],
            )}
          >
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-(--text-primary) leading-none tabular-nums">
        {value}
      </p>

      {/* Delta / trend */}
      {(delta !== undefined || deltaLabel) && (
        <div className="flex items-center gap-1.5">
          {delta !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-semibold',
                trendColor[trend],
              )}
            >
              <TrendIcon trend={trend} />
              {delta}
            </span>
          )}
          {deltaLabel && (
            <span className="text-xs text-(--text-disabled)">
              {deltaLabel}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
