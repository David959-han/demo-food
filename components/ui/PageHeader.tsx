'use client';

import { type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label:  string;
  href?:  string;
}

interface PageHeaderProps {
  title:        string;
  description?: string;
  breadcrumb?:  BreadcrumbItem[];
  actions?:     ReactNode;
  border?:      boolean;
  className?:   string;
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  border    = true,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 pb-5',
        border && 'border-b border-(--border-default) mb-6',
        className,
      )}
    >
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1">
            {breadcrumb.map((item, i) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight
                      size={12}
                      className="text-(--text-disabled) shrink-0"
                      aria-hidden
                    />
                  )}
                  {item.href && !isLast ? (
                    <a
                      href={item.href}
                      className={cn(
                        'text-xs text-(--text-muted)',
                        'hover:text-(--text-secondary) transition-colors duration-150',
                      )}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className={cn(
                        'text-xs',
                        isLast
                          ? 'text-(--text-secondary) font-medium'
                          : 'text-(--text-muted)',
                      )}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h1
            className={cn(
              'text-2xl font-bold tracking-tight text-(--text-primary)',
              'leading-none truncate',
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="text-sm text-(--text-muted) leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
