'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leadingIcon,
      trailingIcon,
      fullWidth = false,
      className,
      id: externalId,
      disabled,
      ...props
    },
    ref,
  ) => {
    const autoId  = useId();
    const inputId = externalId ?? autoId;
    const hasError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-medium uppercase tracking-wide text-(--text-secondary)"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="absolute left-3 flex items-center text-(--text-muted) pointer-events-none">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              'w-full bg-(--bg-elevated) text-(--text-primary)',
              'border border-(--border-default) rounded-md',
              'px-3 py-2 text-sm transition-all duration-150',
              'placeholder:text-(--text-muted)',
              'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40',
              'focus:border-(--brand-500)',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              hasError && 'border-(--danger-500) focus:ring-(--danger-500)/30 focus:border-(--danger-500)',
              leadingIcon  && 'pl-9',
              trailingIcon && 'pr-9',
              className,
            )}
            {...props}
          />

          {trailingIcon && (
            <span className="absolute right-3 flex items-center text-(--text-muted) pointer-events-none">
              {trailingIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-(--danger-400)">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-(--text-muted)">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
