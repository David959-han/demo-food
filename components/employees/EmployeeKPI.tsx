'use client';

import { Users, CheckCircle, Plane, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { Employee } from '@/types/employee';

interface EmployeeKPIProps {
  employees: Employee[];
}

export function EmployeeKPI({ employees }: EmployeeKPIProps) {
  const { t } = useTranslation();

  const total    = employees.length;
  const onDuty   = employees.filter((e) => e.status === 'active').length;
  const onLeave  = employees.filter((e) => e.status === 'on_leave').length;
  const avgRating = total
    ? +(employees.reduce((s, e) => s + e.avgRating, 0) / total).toFixed(1)
    : 0;

  const kpis = [
    {
      label:  t('employees.all_staff'),
      value:  total,
      icon:   <Users size={18} />,
      color:  'text-(--brand-400)',
      bg:     'bg-(--brand-500)/10',
      border: 'border-(--brand-500)/20',
    },
    {
      label:  t('employees.on_duty'),
      value:  onDuty,
      icon:   <CheckCircle size={18} />,
      color:  'text-(--success-400)',
      bg:     'bg-(--success-500)/10',
      border: 'border-(--success-500)/20',
    },
    {
      label:  t('employees.on_leave'),
      value:  onLeave,
      icon:   <Plane size={18} />,
      color:  'text-(--warning-400)',
      bg:     'bg-(--warning-500)/10',
      border: 'border-(--warning-500)/20',
    },
    {
      label:  t('employees.avg_rating'),
      value:  avgRating.toFixed(1),
      icon:   <Star size={18} />,
      color:  'text-(--info-400)',
      bg:     'bg-(--info-500)/10',
      border: 'border-(--info-500)/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map(({ label, value, icon, color, bg, border }) => (
        <div
          key={label}
          className={cn(
            'rounded-xl p-4 border bg-(--bg-surface)',
            'flex items-center gap-3',
            border,
          )}
        >
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', bg, color)}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-(--text-muted) truncate">{label}</p>
            <p className={cn('text-2xl font-black tabular-nums leading-tight', color)}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
