'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { Rider } from '@/types/delivery';

interface RiderStripProps {
  riders: Rider[];
}

export function RiderStrip({ riders }: RiderStripProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
      {riders.map((rider) => (
        <div
          key={rider.id}
          className={cn(
            'flex items-center gap-3 shrink-0',
            'px-3 py-2.5 rounded-xl border',
            'bg-(--bg-surface) transition-colors duration-200',
            rider.isOnline
              ? 'border-(--border-default) hover:border-(--border-strong)'
              : 'border-(--border-subtle) opacity-60',
          )}
        >
          {/* Avatar */}
          <div className="relative w-9 h-9 shrink-0">
            <Image
              src="/images/illustrations/rider-avatar.svg"
              alt={rider.name}
              width={36}
              height={36}
              unoptimized
              className="w-9 h-9 rounded-full"
            />
            {/* Online dot */}
            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-(--bg-surface)',
                rider.isOnline ? 'bg-(--success-500)' : 'bg-(--text-disabled)',
              )}
              aria-label={rider.isOnline ? t('delivery.online') : t('delivery.offline')}
            />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-(--text-primary) truncate max-w-[90px]">
              {rider.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star size={10} className="text-(--brand-400)" fill="currentColor" />
              <span className="text-xs text-(--text-muted) tabular-nums">{rider.rating.toFixed(1)}</span>
              <span className="text-xs text-(--text-disabled)">·</span>
              <span className="text-xs text-(--text-muted) tabular-nums">{rider.deliveriesToday}</span>
            </div>
          </div>

          {/* Active badge */}
          {rider.activeOrderId && (
            <div className="w-1.5 h-1.5 rounded-full bg-(--brand-500) shrink-0 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
}
