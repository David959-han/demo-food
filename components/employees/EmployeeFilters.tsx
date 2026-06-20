'use client';

import { Search, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { EmployeeRole, EmployeeStatus } from '@/types/employee';
import type { TranslationKey } from '@/types/i18n';

type ViewMode = 'grid' | 'list';

interface EmployeeFiltersProps {
  q:           string;
  role:        EmployeeRole | '';
  status:      EmployeeStatus | '';
  view:        ViewMode;
  onQ:         (v: string) => void;
  onRole:      (v: EmployeeRole | '') => void;
  onStatus:    (v: EmployeeStatus | '') => void;
  onView:      (v: ViewMode) => void;
}

const ROLES: Array<{ value: EmployeeRole | ''; key: TranslationKey }> = [
  { value: '',          key: 'employees.all_roles'  },
  { value: 'admin',     key: 'employees.role_admin'    },
  { value: 'manager',   key: 'employees.role_manager'  },
  { value: 'chef',      key: 'employees.role_chef'     },
  { value: 'sous_chef', key: 'employees.role_sous_chef'},
  { value: 'cashier',   key: 'employees.role_cashier'  },
  { value: 'waiter',    key: 'employees.role_waiter'   },
  { value: 'kitchen',   key: 'employees.role_kitchen'  },
  { value: 'delivery',  key: 'employees.role_delivery' },
];

const STATUSES: Array<{ value: EmployeeStatus | ''; key: TranslationKey }> = [
  { value: '',         key: 'employees.all_statuses' },
  { value: 'active',   key: 'status.active'          },
  { value: 'on_leave', key: 'status.on_leave'        },
  { value: 'inactive', key: 'status.inactive'        },
];

export function EmployeeFilters({
  q, role, status, view,
  onQ, onRole, onStatus, onView,
}: EmployeeFiltersProps) {
  const { t } = useTranslation();

  const selectBase = cn(
    'h-9 rounded-lg border border-(--border-default) bg-(--bg-elevated)',
    'px-3 text-sm text-(--text-secondary)',
    'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40',
    'cursor-pointer',
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-disabled) pointer-events-none"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder={t('employees.search')}
          className={cn(
            'w-full h-9 pl-9 pr-3 rounded-lg border border-(--border-default) bg-(--bg-elevated)',
            'text-sm text-(--text-primary) placeholder:text-(--text-disabled)',
            'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40',
          )}
        />
      </div>

      {/* Role filter */}
      <select
        value={role}
        onChange={(e) => onRole(e.target.value as EmployeeRole | '')}
        className={selectBase}
      >
        {ROLES.map(({ value, key }) => (
          <option key={value} value={value}>{t(key)}</option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value as EmployeeStatus | '')}
        className={selectBase}
      >
        {STATUSES.map(({ value, key }) => (
          <option key={value} value={value}>{t(key)}</option>
        ))}
      </select>

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-(--border-default) bg-(--bg-elevated) p-0.5 shrink-0">
        {(['grid', 'list'] as const).map((v) => (
          <button
            key={v}
            onClick={() => onView(v)}
            aria-label={v === 'grid' ? t('employees.view_grid') : t('employees.view_list')}
            className={cn(
              'w-8 h-8 rounded-md flex items-center justify-center transition-colors',
              view === v
                ? 'bg-(--brand-500) text-white'
                : 'text-(--text-muted) hover:text-(--text-primary)',
            )}
          >
            {v === 'grid' ? <LayoutGrid size={15} /> : <List size={15} />}
          </button>
        ))}
      </div>
    </div>
  );
}
