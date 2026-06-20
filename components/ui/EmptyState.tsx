'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type EmptyStateIllustration =
  | 'orders'
  | 'menu'
  | 'table'
  | 'search'
  | 'staff'
  | 'generic';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

interface EmptyStateProps {
  title:          string;
  description?:   string;
  illustration?:  EmptyStateIllustration;
  icon?:          ReactNode;
  action?:        ReactNode;
  size?:          EmptyStateSize;
  className?:     string;
}

const sizeStyles: Record<EmptyStateSize, { wrap: string; svg: number; title: string; desc: string }> = {
  sm: { wrap: 'py-8',  svg: 48,  title: 'text-sm font-semibold',  desc: 'text-xs' },
  md: { wrap: 'py-12', svg: 64,  title: 'text-base font-semibold', desc: 'text-sm' },
  lg: { wrap: 'py-16', svg: 80,  title: 'text-lg font-semibold',   desc: 'text-sm' },
};

/* ── Inline SVG illustrations ── */

function IllustrationOrders({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="10" y="14" width="44" height="36" rx="4" stroke="var(--border-strong)" strokeWidth="2" />
      <line x1="18" y1="26" x2="46" y2="26" stroke="var(--border-strong)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="33" x2="38" y2="33" stroke="var(--border-strong)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="40" x2="30" y2="40" stroke="var(--border-strong)" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="18" y="18" width="8" height="5" rx="1" fill="var(--brand-bg)" stroke="var(--brand-500)" strokeWidth="1.5" />
    </svg>
  );
}

function IllustrationMenu({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="18" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M24 32 Q24 22 32 22 Q40 22 40 32" stroke="var(--border-strong)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="32" y1="22" x2="32" y2="42" stroke="var(--border-strong)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="22" y1="32" x2="42" y2="32" stroke="var(--border-strong)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IllustrationTable({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="14" y="20" width="36" height="22" rx="3" stroke="var(--border-strong)" strokeWidth="2" />
      <line x1="14" y1="31" x2="50" y2="31" stroke="var(--border-strong)" strokeWidth="1.5" />
      <line x1="32" y1="20" x2="32" y2="42" stroke="var(--border-strong)" strokeWidth="1.5" />
      <line x1="14" y1="42" x2="18" y2="50" stroke="var(--border-strong)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="50" y1="42" x2="46" y2="50" stroke="var(--border-strong)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IllustrationSearch({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="28" cy="28" r="14" stroke="var(--border-strong)" strokeWidth="2" />
      <line x1="38" y1="38" x2="50" y2="50" stroke="var(--border-strong)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="23" y1="28" x2="33" y2="28" stroke="var(--brand-500)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="28" y1="23" x2="28" y2="33" stroke="var(--brand-500)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IllustrationStaff({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="22" r="8" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M16 50 Q16 38 32 38 Q48 38 48 50" stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="26" r="5" stroke="var(--border-strong)" strokeWidth="1.5" />
      <path d="M8 46 Q8 38 18 38" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="46" cy="26" r="5" stroke="var(--border-strong)" strokeWidth="1.5" />
      <path d="M56 46 Q56 38 46 38" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IllustrationGeneric({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="12" y="12" width="40" height="40" rx="6" stroke="var(--border-strong)" strokeWidth="2" strokeDasharray="5 3" />
      <line x1="32" y1="24" x2="32" y2="40" stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="44" r="1.5" fill="var(--border-strong)" />
    </svg>
  );
}

const illustrations: Record<EmptyStateIllustration, typeof IllustrationGeneric> = {
  orders:  IllustrationOrders,
  menu:    IllustrationMenu,
  table:   IllustrationTable,
  search:  IllustrationSearch,
  staff:   IllustrationStaff,
  generic: IllustrationGeneric,
};

export function EmptyState({
  title,
  description,
  illustration = 'generic',
  icon,
  action,
  size        = 'md',
  className,
}: EmptyStateProps) {
  const s = sizeStyles[size];
  const Illustration = illustrations[illustration];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center gap-4',
        s.wrap,
        className,
      )}
    >
      {/* Illustration or custom icon */}
      <div className="opacity-60">
        {icon ?? <Illustration size={s.svg} />}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5 max-w-xs">
        <p className={cn(s.title, 'text-(--text-secondary)')}>
          {title}
        </p>
        {description && (
          <p className={cn(s.desc, 'text-(--text-muted) leading-relaxed')}>
            {description}
          </p>
        )}
      </div>

      {/* CTA */}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
