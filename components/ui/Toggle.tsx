'use client';

import { type ChangeEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ToggleSize = 'sm' | 'md';

interface ToggleProps {
  checked:    boolean;
  onChange:   (checked: boolean) => void;
  label?:     ReactNode;
  size?:      ToggleSize;
  disabled?:  boolean;
  className?: string;
}

const trackSize: Record<ToggleSize, string> = {
  sm: 'w-8  h-4',
  md: 'w-10 h-5',
};

const thumbSize: Record<ToggleSize, { base: string; offset: string }> = {
  sm: { base: 'w-3   h-3',   offset: 'translate-x-4.5' },
  md: { base: 'w-3.5 h-3.5', offset: 'translate-x-5.5' },
};

export function Toggle({
  checked,
  onChange,
  label,
  size     = 'md',
  disabled = false,
  className,
}: ToggleProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked);
  }

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          aria-checked={checked}
          className="sr-only"
        />

        {/* Track */}
        <div
          className={cn(
            'rounded-full transition-colors duration-200',
            trackSize[size],
            checked
              ? 'bg-(--brand-500)'
              : 'bg-(--bg-subtle) border border-(--border-strong)',
          )}
        />

        {/* Thumb */}
        <motion.span
          aria-hidden
          animate={{ x: checked ? (size === 'sm' ? 18 : 22) : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full',
            'bg-white shadow-sm pointer-events-none',
            thumbSize[size].base,
          )}
          style={{ left: 0 }}
        />
      </div>

      {label && (
        <span className="text-sm text-(--text-primary)">{label}</span>
      )}
    </label>
  );
}
