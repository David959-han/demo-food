'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CartItem } from '@/types/order';

interface CartLineItemProps {
  item:       CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove:   () => void;
}

export function CartLineItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartLineItemProps) {
  const { menuItem, quantity } = item;
  const lineTotal = (menuItem.price * quantity).toFixed(2);

  return (
    <div className="flex items-start gap-3 py-3">
      {/* Name + price */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-(--text-primary) truncate">
          {menuItem.name}
        </p>
        <p className="text-xs text-(--text-muted) tabular-nums mt-0.5">
          ${menuItem.price.toFixed(2)} × {quantity} = ${lineTotal}
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={quantity === 1 ? onRemove : onDecrease}
          aria-label={quantity === 1 ? 'Remove' : 'Decrease quantity'}
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded-md',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
            quantity === 1
              ? 'text-(--danger-400) hover:bg-(--danger-bg)'
              : 'text-(--text-secondary) hover:bg-(--bg-subtle) hover:text-(--text-primary)',
          )}
        >
          {quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
        </button>

        <span
          className="w-5 text-center text-sm font-semibold text-(--text-primary) tabular-nums"
          aria-label={`Quantity: ${quantity}`}
        >
          {quantity}
        </span>

        <button
          onClick={onIncrease}
          aria-label="Increase quantity"
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded-md',
            'text-(--text-secondary) hover:bg-(--bg-subtle) hover:text-(--text-primary)',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
          )}
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}
