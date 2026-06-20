'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Star, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import type { MenuItem } from '@/types/menu';

interface MenuCardProps {
  item:       MenuItem;
  quantity:   number;
  onAdd:      (item: MenuItem) => void;
  className?: string;
}

export function MenuCard({ item, quantity, onAdd, className }: MenuCardProps) {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);

  const showImage  = Boolean(item.image) && !imgError;
  const isSoldOut  = item.status === 'sold_out';
  const isInactive = item.status === 'inactive';
  const disabled   = isSoldOut || isInactive;

  return (
    <motion.div
      whileHover={disabled ? undefined : { y: -2 }}
      transition={{ duration: 0.18 }}
      className={cn(
        'flex flex-col rounded-xl overflow-hidden',
        'bg-(--bg-elevated) border border-(--border-default)',
        'transition-colors duration-150',
        disabled
          ? 'opacity-60'
          : 'hover:border-(--border-strong)',
        className,
      )}
    >
      {/* Image / placeholder */}
      <div className="relative h-32 shrink-0 bg-(--bg-subtle) overflow-hidden">
        {showImage ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            onError={() => setImgError(true)}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed
              size={36}
              className="text-(--text-disabled)"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Popular badge */}
        {item.isPopular && !disabled && (
          <span className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-semibold text-(--brand-400)">
            <Star size={9} fill="currentColor" />
            {t('pos.popular')}
          </span>
        )}

        {/* Sold out overlay */}
        {(isSoldOut || isInactive) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="danger" shape="pill">
              {isSoldOut ? t('pos.sold_out') : t('common.status')}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <div className="flex-1">
          <p className="text-sm font-semibold text-(--text-primary) leading-snug line-clamp-1">
            {item.name}
          </p>
          <p className="text-xs text-(--text-muted) leading-relaxed mt-0.5 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Price + Add button */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="text-sm font-bold text-(--text-primary) tabular-nums">
            ${item.price.toFixed(2)}
          </span>

          <button
            onClick={() => !disabled && onAdd(item)}
            disabled={disabled}
            aria-label={`${t('pos.all')} ${item.name}`}
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-lg',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
              disabled
                ? 'bg-(--bg-subtle) text-(--text-disabled) cursor-not-allowed'
                : quantity > 0
                  ? 'bg-(--brand-500) text-white hover:bg-(--brand-600)'
                  : 'bg-(--bg-subtle) text-(--brand-400) hover:bg-(--brand-bg) hover:text-(--brand-500)',
            )}
          >
            {quantity > 0 ? (
              <span className="text-xs font-bold tabular-nums">{quantity}</span>
            ) : (
              <Plus size={15} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
