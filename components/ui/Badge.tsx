'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'brand';

export type BadgeShape = 'pill' | 'square';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  shape?: BadgeShape;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-(--success-bg) text-(--success-400) border border-(--success-500)/20',
  warning: 'bg-(--warning-bg) text-(--warning-400) border border-(--warning-500)/20',
  danger:  'bg-(--danger-bg)  text-(--danger-400)  border border-(--danger-500)/20',
  info:    'bg-(--info-bg)    text-(--info-400)    border border-(--info-500)/20',
  neutral: 'bg-(--bg-elevated) text-(--text-secondary) border border-(--border-default)',
  brand:   'bg-(--brand-bg)   text-(--brand-400)   border border-(--brand-500)/20',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-(--success-400)',
  warning: 'bg-(--warning-400)',
  danger:  'bg-(--danger-400)',
  info:    'bg-(--info-400)',
  neutral: 'bg-(--text-muted)',
  brand:   'bg-(--brand-400)',
};

export function Badge({
  variant = 'neutral',
  shape = 'pill',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        shape === 'pill' ? 'rounded-full' : 'rounded',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
