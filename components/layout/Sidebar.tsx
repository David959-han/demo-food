'use client';

import { useEffect, useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { SidebarContent } from './SidebarContent';

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useRestaurantStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { Promise.resolve(true).then(setMounted); }, []);

  // Use server-safe default (expanded) until client hydration completes
  const collapsed = mounted && sidebarCollapsed;

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen shrink-0',
        'bg-(--bg-surface) border-r border-(--border-default)',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center h-14 px-3 border-b border-(--border-subtle) shrink-0',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && <Logo size="sm" />}
        {collapsed  && <Logo variant="mark" size="sm" />}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex items-center justify-center w-7 h-7 rounded-md',
            'text-(--text-disabled) hover:text-(--text-secondary) hover:bg-(--bg-subtle)',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
          )}
        >
          {collapsed
            ? <ChevronsRight size={14} />
            : <ChevronsLeft  size={14} />
          }
        </button>
      </div>

      {/* Navigation */}
      <SidebarContent collapsed={collapsed} mounted={mounted} />
    </aside>
  );
}
