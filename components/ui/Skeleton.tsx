'use client';

import { type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export type SkeletonShape = 'line' | 'circle' | 'block';

interface SkeletonProps {
  shape?:    SkeletonShape;
  width?:    string | number;
  height?:   string | number;
  className?: string;
  lines?:    number;
  gap?:      string;
}

interface SkeletonBaseProps {
  className?: string;
  style?:     CSSProperties;
}

function SkeletonBase({ className, style }: SkeletonBaseProps) {
  return (
    <div
      style={style}
      className={cn(
        'relative overflow-hidden rounded',
        'bg-(--bg-elevated)',
        'before:absolute before:inset-0',
        'before:bg-linear-to-r',
        'before:from-transparent before:via-white/6 before:to-transparent',
        'before:animate-[shimmer_1.6s_infinite]',
        className,
      )}
    />
  );
}

export function Skeleton({
  shape  = 'line',
  width,
  height,
  className,
  lines = 1,
  gap   = '0.5rem',
}: SkeletonProps) {
  if (shape === 'circle') {
    const size = width ?? height ?? '2.5rem';
    return (
      <SkeletonBase
        className={cn('rounded-full shrink-0', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  if (shape === 'block') {
    return (
      <SkeletonBase
        className={cn('rounded-lg', className)}
        style={{ width: width ?? '100%', height: height ?? '8rem' }}
      />
    );
  }

  if (lines > 1) {
    return (
      <div className="flex flex-col" style={{ gap }}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBase
            key={i}
            style={{ width: i === lines - 1 ? '75%' : (width ?? '100%') }}
            className={cn('h-4', className)}
          />
        ))}
      </div>
    );
  }

  return (
    <SkeletonBase
      className={cn('h-4', className)}
      style={{ width: width ?? '100%', height }}
    />
  );
}
