'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, type TooltipPosition } from './Tooltip';

export type IconButtonVariant = 'default' | 'ghost' | 'brand' | 'danger';
export type IconButtonSize    = 'xs' | 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon:        ReactNode;
  tooltip?:    string;
  tooltipPos?: TooltipPosition;
  variant?:    IconButtonVariant;
  size?:       IconButtonSize;
  active?:     boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: cn(
    'text-(--text-secondary) bg-(--bg-elevated)',
    'border border-(--border-default)',
    'hover:bg-(--bg-subtle) hover:text-(--text-primary)',
  ),
  ghost: cn(
    'text-(--text-muted) bg-transparent border border-transparent',
    'hover:bg-(--bg-subtle) hover:text-(--text-secondary)',
  ),
  brand: cn(
    'text-(--brand-400) bg-(--brand-bg)',
    'border border-(--brand-500)/20',
    'hover:bg-(--brand-500)/20 hover:text-white',
  ),
  danger: cn(
    'text-(--danger-400) bg-(--danger-bg)',
    'border border-(--danger-500)/20',
    'hover:bg-(--danger-500)/20 hover:text-white',
  ),
};

const sizeStyles: Record<IconButtonSize, string> = {
  xs: 'w-6  h-6  rounded    [&_svg]:w-3   [&_svg]:h-3',
  sm: 'w-7  h-7  rounded-md [&_svg]:w-3.5 [&_svg]:h-3.5',
  md: 'w-9  h-9  rounded-md [&_svg]:w-4   [&_svg]:h-4',
  lg: 'w-10 h-10 rounded-md [&_svg]:w-5   [&_svg]:h-5',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      tooltip,
      tooltipPos = 'top',
      variant    = 'ghost',
      size       = 'md',
      active     = false,
      disabled,
      className,
      type       = 'button',
      ...props
    },
    ref,
  ) => {
    const btn = (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled   ? {} : { scale: 0.92 }}
        transition={{ duration: 0.12 }}
        aria-label={tooltip}
        className={cn(
          'inline-flex items-center justify-center shrink-0',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-(--brand-500)/40',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          active && 'text-(--brand-400) bg-(--brand-bg) border-(--brand-500)/30',
          className,
        )}
        {...props}
      >
        {icon}
      </motion.button>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} position={tooltipPos}>
          {btn}
        </Tooltip>
      );
    }

    return btn;
  },
);

IconButton.displayName = 'IconButton';
