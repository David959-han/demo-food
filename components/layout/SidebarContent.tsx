'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { filterNavGroups, NAV_GROUPS, isRouteActive } from '@/lib/navigation';
import { useRestaurantStore } from '@/store/useRestaurantStore';

interface SidebarContentProps {
  collapsed?:  boolean;
  onNavClick?: () => void;
  mounted?:    boolean;
}

export function SidebarContent({ collapsed = false, onNavClick, mounted = true }: SidebarContentProps) {
  const pathname    = usePathname();
  const { t }       = useTranslation();
  const currentUser = useRestaurantStore((s) => s.currentUser);

  // Before client hydration or when no user: show all groups so SSR matches
  const groups = (mounted && currentUser)
    ? filterNavGroups(currentUser.role)
    : NAV_GROUPS;

  return (
    <nav className="flex-1 overflow-y-auto py-3 space-y-5">
      {groups.map((group) => (
        <div key={group.key}>
          {!collapsed && (
            <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-(--text-disabled)">
              {t(group.labelKey)}
            </p>
          )}

          <ul className="space-y-0.5 px-2">
            {group.items.map(({ key, labelKey, href, Icon }) => {
              const active = isRouteActive(pathname, href);

              return (
                <li key={key}>
                  <Link
                    href={href}
                    onClick={onNavClick}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm',
                      'transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
                      active
                        ? 'bg-(--brand-bg) text-(--brand-400)'
                        : 'text-(--text-secondary) hover:bg-(--bg-subtle) hover:text-(--text-primary)',
                      collapsed && 'justify-center',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon
                      size={17}
                      strokeWidth={active ? 2.5 : 1.8}
                      className="shrink-0"
                    />
                    {!collapsed && (
                      <span className="truncate">{t(labelKey)}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
