'use client';

import Image from 'next/image';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import {
  ROLE_VARIANT, ROLE_LABEL_KEY,
  SHIFT_LABEL_KEY, SHIFT_COLOR,
  tenureMonths,
} from './employeeUtils';
import type { Employee } from '@/types/employee';

/** Thin progress bar */
function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-(--bg-elevated) overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-700', color)}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

interface EmployeeCardProps {
  employee: Employee;
  onClick:  (employee: Employee) => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const { t } = useTranslation();
  const months  = tenureMonths(employee.hiredAt);
  const ratingColor =
    employee.avgRating >= 4.7 ? 'text-(--success-400)'
    : employee.avgRating >= 4.0 ? 'text-(--warning-400)'
    : 'text-(--danger-400)';

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(employee)}
      className={cn(
        'w-full text-left rounded-2xl border bg-(--bg-surface)',
        'flex flex-col overflow-hidden',
        'transition-shadow duration-200',
        'hover:shadow-lg hover:border-(--border-strong)',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
        employee.status !== 'active' && 'opacity-75',
      )}
    >
      {/* Top color strip */}
      <div className={cn(
        'h-1.5 w-full',
        employee.status === 'active'   ? 'bg-(--success-500)'  :
        employee.status === 'on_leave' ? 'bg-(--warning-500)'  :
                                         'bg-(--text-disabled)',
      )} />

      {/* Avatar + badges */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        <div className="relative shrink-0">
          <div className={cn(
            'w-14 h-14 rounded-xl overflow-hidden ring-2',
            employee.status === 'active'   ? 'ring-(--success-500)/30'  :
            employee.status === 'on_leave' ? 'ring-(--warning-500)/30'  :
                                             'ring-(--border-subtle)',
          )}>
            <Image
              src={employee.avatar}
              alt={employee.name}
              width={56}
              height={56}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Online status dot */}
          <span className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-(--bg-surface)',
            employee.status === 'active' ? 'bg-(--success-500)' : 'bg-(--text-disabled)',
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-(--text-primary) truncate">{employee.name}</p>
          <div className="mt-0.5">
            <Badge variant={ROLE_VARIANT[employee.role]} shape="pill">
              {t(ROLE_LABEL_KEY[employee.role])}
            </Badge>
          </div>
          <p className="text-xs text-(--text-muted) mt-1 truncate">{employee.department}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 pb-3 flex items-center gap-3">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star size={11} className="text-(--brand-400)" fill="currentColor" />
          <span className={cn('text-xs font-bold tabular-nums', ratingColor)}>
            {employee.avgRating.toFixed(1)}
          </span>
        </div>
        <span className="text-(--border-subtle) text-xs">·</span>
        {/* Shift */}
        <div className="flex items-center gap-1">
          <Clock size={11} className={SHIFT_COLOR[employee.shift.type]} />
          <span className={cn('text-xs font-medium', SHIFT_COLOR[employee.shift.type])}>
            {t(SHIFT_LABEL_KEY[employee.shift.type])}
          </span>
        </div>
        <span className="text-(--border-subtle) text-xs">·</span>
        {/* Tenure */}
        <span className="text-xs text-(--text-disabled)">{months}mo</span>
      </div>

      {/* Performance bar */}
      <div className="px-4 pb-4 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-(--text-disabled)">
          <span>{t('employees.completion')}</span>
          <span className="font-semibold text-(--text-muted)">{employee.completionRate}%</span>
        </div>
        <MiniBar
          value={employee.completionRate}
          color={
            employee.completionRate >= 95 ? 'bg-(--success-500)' :
            employee.completionRate >= 85 ? 'bg-(--warning-500)' :
            'bg-(--danger-500)'
          }
        />
      </div>
    </motion.button>
  );
}
