'use client';

import { cn } from '@/lib/utils';

export type StatusDotVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'brand';

export type StatusDotSize = 'xs' | 'sm' | 'md';

interface StatusDotProps {
  variant?:   StatusDotVariant;
  size?:      StatusDotSize;
  pulse?:     boolean;
  label?:     string;
  className?: string;
}

const dotColor: Record<StatusDotVariant, string> = {
  success: 'bg-(--success-400)',
  warning: 'bg-(--warning-400)',
  danger:  'bg-(--danger-400)',
  info:    'bg-(--info-400)',
  neutral: 'bg-(--text-muted)',
  brand:   'bg-(--brand-400)',
};

const pingColor: Record<StatusDotVariant, string> = {
  success: 'bg-(--success-400)',
  warning: 'bg-(--warning-400)',
  danger:  'bg-(--danger-400)',
  info:    'bg-(--info-400)',
  neutral: 'bg-(--text-muted)',
  brand:   'bg-(--brand-400)',
};

const dotSize: Record<StatusDotSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2   h-2',
  md: 'w-2.5 h-2.5',
};

export function StatusDot({
  variant   = 'neutral',
  size      = 'sm',
  pulse     = false,
  label,
  className,
}: StatusDotProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      aria-label={label}
    >
      <span className={cn('relative inline-flex shrink-0', dotSize[size])}>
        {pulse && (
          <span
            aria-hidden
            className={cn(
              'absolute inset-0 rounded-full animate-ping opacity-75',
              pingColor[variant],
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full w-full h-full',
            dotColor[variant],
          )}
        />
      </span>

      {label && (
        <span className="text-xs text-(--text-secondary) leading-none">
          {label}
        </span>
      )}
    </span>
  );
}
