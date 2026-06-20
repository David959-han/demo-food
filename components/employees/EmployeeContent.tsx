'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { getEmployees } from '@/services/employeeService';
import { EmployeeKPI }        from './EmployeeKPI';
import { EmployeeFilters }    from './EmployeeFilters';
import { EmployeeCard }       from './EmployeeCard';
import { EmployeeTable }      from './EmployeeTable';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import type { Employee, EmployeeRole, EmployeeStatus } from '@/types/employee';

type ViewMode = 'grid' | 'list';

export function EmployeeContent() {
  const { t } = useTranslation();
  const router   = useRouter();
  const pathname = usePathname();
  const sp       = useSearchParams();

  const [employees,       setEmployees]       = useState<Employee[]>([]);
  const [selected,        setSelected]        = useState<Employee | null>(null);
  const [view,            setView]            = useState<ViewMode>('grid');

  const q      = sp.get('q')      ?? '';
  const role   = (sp.get('role')   ?? '') as EmployeeRole | '';
  const status = (sp.get('status') ?? '') as EmployeeStatus | '';

  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else        params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (q      && !e.name.toLowerCase().includes(q.toLowerCase()) &&
                    !e.email.toLowerCase().includes(q.toLowerCase())) return false;
      if (role   && e.role !== role)     return false;
      if (status && e.status !== status) return false;
      return true;
    });
  }, [employees, q, role, status]);

  const isEmpty = filtered.length === 0;

  const activeCount = employees.filter((e) => e.status === 'active').length;

  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface)">
        <div className="relative z-10 px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck size={16} className="text-(--success-400)" />
            <span className="text-xs font-semibold text-(--success-400) uppercase tracking-wide">
              {activeCount} {t('status.active').toLowerCase()}
            </span>
          </div>
          <h1 className="text-xl font-bold text-(--text-primary)">{t('employees.title')}</h1>
          <p className="text-sm text-(--text-muted) mt-1">
            {employees.length} {t('employees.all_staff').toLowerCase()}
          </p>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/employee-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left rounded-r-2xl opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/40 to-transparent rounded-r-2xl" />
        </div>
      </div>

      {/* KPI */}
      <EmployeeKPI employees={employees} />

      {/* Filters */}
      <EmployeeFilters
        q={q}
        role={role}
        status={status}
        view={view}
        onQ={(v)      => updateParam('q', v)}
        onRole={(v)   => updateParam('role', v)}
        onStatus={(v) => updateParam('status', v)}
        onView={setView}
      />

      {/* Content */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-32 h-32">
            <Image
              src="/images/illustrations/employee-empty.svg"
              alt=""
              width={128}
              height={128}
              unoptimized
            />
          </div>
          <p className="text-base font-semibold text-(--text-secondary)">
            {t('employees.no_employees')}
          </p>
          <p className="text-sm text-(--text-disabled)">
            {t('employees.no_employees_desc')}
          </p>
        </div>
      ) : view === 'grid' ? (
        <AnimatePresence mode="popLayout">
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((emp, i) => (
              <motion.div
                key={emp.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                <EmployeeCard employee={emp} onClick={setSelected} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <EmployeeTable employees={filtered} onRowClick={setSelected} />
        </motion.div>
      )}

      {/* Detail Modal */}
      <EmployeeDetailModal
        employee={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
