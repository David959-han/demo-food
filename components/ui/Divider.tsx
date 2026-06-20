'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: ReactNode;
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  label,
  className,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          'self-stretch w-px bg-(--border-default) shrink-0',
          className,
        )}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={cn('flex items-center gap-3', className)}
      >
        <div className="flex-1 h-px bg-(--border-default)" />
        <span className="text-xs text-(--text-muted) font-medium uppercase tracking-wide shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-(--border-default)" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={cn(
        'border-none h-px bg-(--border-default)',
        className,
      )}
    />
  );
}
