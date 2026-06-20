'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  asMotion?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-(--bg-surface) border border-(--border-default)',
  elevated:
    'bg-(--bg-elevated) border border-(--border-default) ' +
    'shadow-lg shadow-black/20',
  bordered:
    'bg-(--bg-surface) border border-(--border-strong)',
  interactive:
    'bg-(--bg-surface) border border-(--border-default) ' +
    'cursor-pointer hover:border-(--brand-500)/50 ' +
    'hover:bg-(--bg-elevated) transition-colors duration-150',
};

const paddingStyles = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-5',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      asMotion = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClass = cn(
      'rounded-lg',
      variantStyles[variant],
      paddingStyles[padding],
      className,
    );

    if (asMotion) {
      return (
        <motion.div
          ref={ref}
          whileHover={variant === 'interactive' ? { y: -2 } : undefined}
          transition={{ duration: 0.15 }}
          className={baseClass}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseClass} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
