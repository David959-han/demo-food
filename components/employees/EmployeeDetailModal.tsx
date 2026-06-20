'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import {
  X, Mail, Phone, Calendar, Star,
  TrendingUp, ShoppingBag, Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import {
  ROLE_VARIANT, ROLE_LABEL_KEY,
  STATUS_VARIANT, STATUS_LABEL_KEY,
  SHIFT_LABEL_KEY, SHIFT_COLOR,
  formatHireDate, tenureMonths,
} from './employeeUtils';
import type { Employee } from '@/types/employee';

function StatCard({
  icon, label, value, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-(--border-default) bg-(--bg-elevated) p-4 flex items-center gap-3">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', color)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-(--text-disabled) leading-tight">{label}</p>
        <p className="text-lg font-black tabular-nums text-(--text-primary) leading-tight">{value}</p>
      </div>
    </div>
  );
}

function PerformanceBar({
  label, value, color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-(--text-secondary)">{label}</span>
        <span className="font-semibold text-(--text-primary) tabular-nums">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-(--bg-base) overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose:  () => void;
}

export function EmployeeDetailModal({ employee, onClose }: EmployeeDetailModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!employee) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [employee, onClose]);

  return (
    <AnimatePresence>
      {employee && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed inset-x-4 top-[5%] bottom-[5%] z-50 mx-auto max-w-2xl',
              'rounded-2xl border border-(--border-default) bg-(--bg-surface)',
              'overflow-y-auto shadow-2xl',
            )}
          >
            {/* Header */}
            <div className={cn(
              'relative h-32 shrink-0 rounded-t-2xl overflow-hidden',
              'bg-linear-to-br from-(--brand-500)/20 via-(--brand-400)/10 to-(--info-500)/10',
            )}>
              {/* Decorative shapes */}
              <div className="absolute top-4 right-10 w-24 h-24 rounded-full bg-(--brand-400)/10 blur-xl" />
              <div className="absolute -bottom-4 left-20 w-32 h-32 rounded-full bg-(--info-400)/8 blur-2xl" />

              {/* Close button */}
              <button
                onClick={onClose}
                className={cn(
                  'absolute top-4 right-4 w-8 h-8 rounded-lg',
                  'bg-(--bg-surface)/80 text-(--text-muted) hover:text-(--text-primary)',
                  'flex items-center justify-center',
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
                )}
              >
                <X size={16} />
              </button>
            </div>

            {/* Avatar overlapping header */}
            <div className="px-6 -mt-14 mb-4">
              <div className="flex items-end gap-4">
                <div className={cn(
                  'w-24 h-24 rounded-2xl overflow-hidden border-4 shrink-0',
                  'border-(--bg-surface) shadow-xl',
                  employee.status === 'active'   ? 'ring-2 ring-(--success-500)/40' :
                  employee.status === 'on_leave' ? 'ring-2 ring-(--warning-500)/40' :
                                                   'ring-2 ring-(--border-subtle)',
                )}>
                  <Image
                    src={employee.avatar}
                    alt={employee.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-top"
                    priority
                  />
                </div>

                <div className="pb-1 flex-1 min-w-0">
                  <h2 className="text-xl font-black text-(--text-primary) truncate">
                    {employee.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant={ROLE_VARIANT[employee.role]} shape="pill">
                      {t(ROLE_LABEL_KEY[employee.role])}
                    </Badge>
                    <Badge variant={STATUS_VARIANT[employee.status]}>
                      {t(STATUS_LABEL_KEY[employee.status])}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-sm text-(--text-secondary)">
                  <Mail size={14} className="text-(--text-disabled) shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-(--text-secondary)">
                  <Phone size={14} className="text-(--text-disabled) shrink-0" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-(--text-secondary)">
                  <Calendar size={14} className="text-(--text-disabled) shrink-0" />
                  <span>
                    {t('employees.hire_date')}: {formatHireDate(employee.hiredAt)}
                    {' '}
                    <span className="text-(--text-disabled)">({tenureMonths(employee.hiredAt)} months)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock size={14} className={cn('shrink-0', SHIFT_COLOR[employee.shift.type])} />
                  <span className={SHIFT_COLOR[employee.shift.type]}>
                    {t(SHIFT_LABEL_KEY[employee.shift.type])}
                    {' '}
                    <span className="text-(--text-disabled) font-normal">
                      {employee.shift.startTime}–{employee.shift.endTime}
                    </span>
                  </span>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-3 gap-3">
                <StatCard
                  icon={<Star size={16} fill="currentColor" />}
                  label={t('employees.avg_rating')}
                  value={employee.avgRating.toFixed(1)}
                  color="bg-(--brand-500)/12 text-(--brand-400)"
                />
                <StatCard
                  icon={<ShoppingBag size={16} />}
                  label={t('employees.total_orders')}
                  value={employee.totalOrders.toLocaleString()}
                  color="bg-(--info-500)/12 text-(--info-400)"
                />
                <StatCard
                  icon={<TrendingUp size={16} />}
                  label={t('employees.completion')}
                  value={`${employee.completionRate}%`}
                  color="bg-(--success-500)/12 text-(--success-400)"
                />
              </div>

              {/* Performance bars */}
              <div className="rounded-xl border border-(--border-default) bg-(--bg-elevated) p-4 space-y-4">
                <h3 className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                  {t('employees.performance')}
                </h3>
                <PerformanceBar
                  label={t('employees.completion')}
                  value={employee.completionRate}
                  color={
                    employee.completionRate >= 95 ? 'bg-(--success-500)' :
                    employee.completionRate >= 85 ? 'bg-(--warning-500)' :
                    'bg-(--danger-500)'
                  }
                />
                <PerformanceBar
                  label={t('employees.avg_rating')}
                  value={Math.round((employee.avgRating / 5) * 100)}
                  color="bg-(--brand-500)"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
