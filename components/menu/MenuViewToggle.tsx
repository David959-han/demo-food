'use client';

import { LayoutList, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

export type MenuView = 'table' | 'grid';

interface MenuViewToggleProps {
  view:      MenuView;
  onChange:  (view: MenuView) => void;
  className?: string;
}

export function MenuViewToggle({ view, onChange, className }: MenuViewToggleProps) {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label="View toggle"
      className={cn(
        'flex items-center gap-0.5 p-0.5 rounded-lg',
        'bg-(--bg-elevated) border border-(--border-default)',
        className,
      )}
    >
      {(
        [
          { value: 'table', Icon: LayoutList, label: 'menu.view_table' },
          { value: 'grid',  Icon: LayoutGrid, label: 'menu.view_grid'  },
        ] as const
      ).map(({ value, Icon, label }) => (
        <button
          key={value}
          role="radio"
          aria-checked={view === value}
          onClick={() => onChange(value)}
          aria-label={t(label)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
            view === value
              ? 'bg-(--bg-surface) text-(--text-primary) shadow-sm'
              : 'text-(--text-muted) hover:text-(--text-secondary)',
          )}
        >
          <Icon size={14} />
          <span className="hidden sm:inline">{t(label)}</span>
        </button>
      ))}
    </div>
  );
}
