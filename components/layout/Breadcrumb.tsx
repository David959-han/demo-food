'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { NAV_ITEMS, isRouteActive } from '@/lib/navigation';

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const { t }    = useTranslation();

  const isHome  = pathname === '/';
  const current = NAV_ITEMS.find(
    (item) => !isHome && isRouteActive(pathname, item.href),
  );

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1', className)}>
      {isHome ? (
        <span className="text-sm font-medium text-(--text-primary)">
          {t('nav.dashboard')}
        </span>
      ) : (
        <>
          <Link
            href="/"
            className="text-sm text-(--text-muted) hover:text-(--text-secondary) transition-colors duration-150"
          >
            {t('nav.dashboard')}
          </Link>
          <ChevronRight size={13} className="text-(--text-disabled)" aria-hidden="true" />
          <span className="text-sm font-medium text-(--text-primary)">
            {current ? t(current.labelKey) : pathname.replace('/', '')}
          </span>
        </>
      )}
    </nav>
  );
}
