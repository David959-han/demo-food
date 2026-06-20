'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import {
  ROLE_VARIANT, ROLE_LABEL_KEY,
  STATUS_VARIANT, STATUS_LABEL_KEY,
  SHIFT_LABEL_KEY, SHIFT_COLOR,
  formatHireDate,
} from './employeeUtils';
import type { Employee } from '@/types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  onRowClick: (employee: Employee) => void;
}

export function EmployeeTable({ employees, onRowClick }: EmployeeTableProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-(--border-default) bg-(--bg-surface) overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--border-subtle) bg-(--bg-elevated)">
            <th className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
              {t('employees.all_staff')}
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden sm:table-cell">
              {t('employees.department')}
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden md:table-cell">
              {t('employees.shift')}
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
              {t('common.status')}
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden lg:table-cell">
              {t('employees.performance')}
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-(--text-muted) uppercase tracking-wider hidden md:table-cell">
              {t('employees.hire_date')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border-subtle)">
          {employees.map((emp) => (
            <tr
              key={emp.id}
              onClick={() => onRowClick(emp)}
              className="hover:bg-(--bg-elevated) cursor-pointer transition-colors group"
            >
              {/* Name + avatar */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-lg overflow-hidden">
                      <Image
                        src={emp.avatar}
                        alt={emp.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-(--bg-surface)',
                      emp.status === 'active' ? 'bg-(--success-500)' : 'bg-(--text-disabled)',
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-(--text-primary) truncate group-hover:text-(--brand-400) transition-colors">
                      {emp.name}
                    </p>
                    <div className="mt-0.5">
                      <Badge variant={ROLE_VARIANT[emp.role]} shape="pill">
                        {t(ROLE_LABEL_KEY[emp.role])}
                      </Badge>
                    </div>
                  </div>
                </div>
              </td>

              {/* Department */}
              <td className="px-4 py-3 text-(--text-secondary) hidden sm:table-cell">
                {emp.department}
              </td>

              {/* Shift */}
              <td className="px-4 py-3 hidden md:table-cell">
                <span className={cn('font-medium', SHIFT_COLOR[emp.shift.type])}>
                  {t(SHIFT_LABEL_KEY[emp.shift.type])}
                </span>
                <span className="ml-1 text-xs text-(--text-disabled)">
                  {emp.shift.startTime}–{emp.shift.endTime}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANT[emp.status]}>
                  {t(STATUS_LABEL_KEY[emp.status])}
                </Badge>
              </td>

              {/* Rating + completion */}
              <td className="px-4 py-3 text-right hidden lg:table-cell">
                <div className="flex items-center justify-end gap-2">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-(--brand-400)" fill="currentColor" />
                    <span className="font-semibold text-(--text-secondary) tabular-nums">
                      {emp.avgRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-(--text-disabled)">·</span>
                  <span className={cn(
                    'font-semibold tabular-nums',
                    emp.completionRate >= 95 ? 'text-(--success-400)' :
                    emp.completionRate >= 85 ? 'text-(--warning-400)' :
                    'text-(--danger-400)',
                  )}>
                    {emp.completionRate}%
                  </span>
                </div>
              </td>

              {/* Hire date */}
              <td className="px-4 py-3 text-right text-(--text-disabled) hidden md:table-cell tabular-nums">
                {formatHireDate(emp.hiredAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
