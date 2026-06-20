import type { EmployeeRole, EmployeeStatus, ShiftType } from '@/types/employee';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TranslationKey } from '@/types/i18n';

export const ROLE_VARIANT: Record<EmployeeRole, BadgeVariant> = {
  admin:     'brand',
  manager:   'info',
  chef:      'warning',
  sous_chef: 'warning',
  cashier:   'success',
  waiter:    'neutral',
  kitchen:   'neutral',
  delivery:  'info',
  cleaner:   'neutral',
};

export const ROLE_LABEL_KEY: Record<EmployeeRole, TranslationKey> = {
  admin:     'employees.role_admin',
  manager:   'employees.role_manager',
  chef:      'employees.role_chef',
  sous_chef: 'employees.role_sous_chef',
  cashier:   'employees.role_cashier',
  waiter:    'employees.role_waiter',
  kitchen:   'employees.role_kitchen',
  delivery:  'employees.role_delivery',
  cleaner:   'employees.role_cleaner',
};

export const STATUS_VARIANT: Record<EmployeeStatus, BadgeVariant> = {
  active:   'success',
  on_leave: 'warning',
  inactive: 'neutral',
};

export const STATUS_LABEL_KEY: Record<EmployeeStatus, TranslationKey> = {
  active:   'status.active',
  on_leave: 'status.on_leave',
  inactive: 'status.inactive',
};

export const SHIFT_LABEL_KEY: Record<ShiftType, TranslationKey> = {
  morning:   'employees.shift_morning',
  afternoon: 'employees.shift_afternoon',
  night:     'employees.shift_night',
  full_day:  'employees.shift_full_day',
};

export const SHIFT_COLOR: Record<ShiftType, string> = {
  morning:   'text-(--warning-400)',
  afternoon: 'text-(--brand-400)',
  night:     'text-(--info-400)',
  full_day:  'text-(--success-400)',
};

export function formatHireDate(dateStr: string, locale?: string): string {
  return new Date(dateStr).toLocaleDateString(locale ?? 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function tenureMonths(hiredAt: string): number {
  const start = new Date(hiredAt);
  const now   = new Date();
  return (now.getFullYear() - start.getFullYear()) * 12 +
         (now.getMonth() - start.getMonth());
}
