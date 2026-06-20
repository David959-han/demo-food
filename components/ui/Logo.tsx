'use client';

import { cn } from '@/lib/utils';

export type LogoVariant = 'full' | 'mark';
export type LogoSize    = 'sm' | 'md' | 'lg';

interface LogoProps {
  variant?:   LogoVariant;
  size?:      LogoSize;
  className?: string;
}

const markSize: Record<LogoSize, number> = { sm: 28, md: 36, lg: 44 };
const textSize: Record<LogoSize, string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
};

function LogoMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="9" fill="var(--brand-500)" />
      {/* Fork — left */}
      <line x1="11" y1="9"  x2="11" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="14" y1="9"  x2="14" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 14 Q11 16 12.5 16 Q14 16 14 14" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <line x1="12.5" y1="16" x2="12.5" y2="27" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* Knife — right */}
      <line x1="23" y1="9"  x2="23" y2="27" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M23 9 Q26 11 26 14 Q26 17 23 17" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ variant = 'full', size = 'md', className }: LogoProps) {
  const px = markSize[size];

  if (variant === 'mark') {
    return (
      <span className={cn('inline-flex shrink-0', className)}>
        <LogoMark size={px} />
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-2.5 shrink-0', className)}>
      <LogoMark size={px} />
      <span
        className={cn(
          'font-bold tracking-tight text-(--text-primary) leading-none',
          textSize[size],
        )}
      >
        Food
        <span className="text-(--brand-500)">ERP</span>
      </span>
    </span>
  );
}
