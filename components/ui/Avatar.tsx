'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { wrapper: string; text: string; px: number }> = {
  xs: { wrapper: 'w-6  h-6',  text: 'text-[10px]', px: 24 },
  sm: { wrapper: 'w-8  h-8',  text: 'text-xs',     px: 32 },
  md: { wrapper: 'w-9  h-9',  text: 'text-sm',     px: 36 },
  lg: { wrapper: 'w-11 h-11', text: 'text-base',   px: 44 },
  xl: { wrapper: 'w-14 h-14', text: 'text-lg',     px: 56 },
};

function getInitials(text: string): string {
  return text
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  className,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { wrapper, text, px } = sizeStyles[size];
  const showImage = src && !imgError;
  const displayInitials = initials ?? getInitials(alt);

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden shrink-0 select-none',
        'bg-(--brand-bg) border border-(--border-default)',
        wrapper,
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className={cn(
            'flex items-center justify-center w-full h-full',
            'font-semibold text-(--brand-400)',
            text,
          )}
          aria-label={alt}
        >
          {displayInitials}
        </span>
      )}
    </div>
  );
}
