'use client';

import { cn } from '@/lib/utils';

export type SpinnerSize    = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'brand' | 'white' | 'muted';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-3.5 h-3.5 border-[1.5px]',
  md: 'w-5   h-5   border-2',
  lg: 'w-7   h-7   border-2',
};

const variantStyles: Record<SpinnerVariant, string> = {
  brand: 'border-(--brand-500)/30 border-t-(--brand-500)',
  white: 'border-white/30 border-t-white',
  muted: 'border-(--border-strong) border-t-(--text-secondary)',
};

export function Spinner({
  size = 'md',
  variant = 'brand',
  className,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'block rounded-full animate-spin shrink-0',
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
    />
  );
}
