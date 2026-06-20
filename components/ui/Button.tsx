'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  leftIcon?:  ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?:  ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-(--brand-500) text-white hover:bg-(--brand-400) ' +
    'border border-transparent shadow-sm',
  secondary:
    'bg-(--bg-elevated) text-(--text-primary) ' +
    'border border-(--border-default) hover:bg-(--bg-subtle)',
  ghost:
    'bg-transparent text-(--text-secondary) border border-transparent ' +
    'hover:bg-(--bg-subtle) hover:text-(--text-primary)',
  danger:
    'bg-(--danger-bg) text-(--danger-400) ' +
    'border border-(--danger-500)/30 hover:bg-(--danger-500) hover:text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-7  px-3 text-xs   gap-1.5 rounded-md',
  md: 'h-9  px-4 text-sm   gap-2   rounded-md',
  lg: 'h-11 px-6 text-base gap-2   rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = 'primary',
      size      = 'md',
      loading   = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      type      = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={isDisabled ? {} : { y: -1 }}
        whileTap={isDisabled   ? {} : { scale: 0.97 }}
        transition={{ duration: 0.15 }}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          'transition-colors duration-150 cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-(--brand-500) focus-visible:ring-offset-2',
          'focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner
            size={size === 'lg' ? 'md' : 'sm'}
            variant={variant === 'primary' ? 'white' : 'brand'}
          />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
