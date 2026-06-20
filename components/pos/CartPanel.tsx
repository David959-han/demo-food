'use client';

import { ShoppingBag, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { EmptyState } from '@/components/ui/EmptyState';
import { CartLineItem } from './CartLineItem';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';

const TABLE_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

interface CartPanelProps {
  onCheckout: () => void;
  className?: string;
}

export function CartPanel({ onCheckout, className }: CartPanelProps) {
  const { t } = useTranslation();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCartTable,
    getCartTotal,
    getCartItemsCount,
  } = useRestaurantStore();

  const itemCount = getCartItemsCount();
  const total     = getCartTotal();

  return (
    <div
      className={cn(
        'flex flex-col bg-(--bg-surface) border border-(--border-default) rounded-xl overflow-hidden',
        className,
      )}
      aria-label={t('pos.cart')}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--border-subtle) shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} className="text-(--brand-400)" />
          <span className="text-sm font-semibold text-(--text-primary)">
            {t('pos.cart')}
          </span>
          {itemCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-(--brand-500) text-[10px] font-bold text-white tabular-nums">
              {itemCount}
            </span>
          )}
        </div>

        {itemCount > 0 && (
          <button
            onClick={clearCart}
            aria-label={t('pos.clear_cart')}
            className="flex items-center gap-1 text-xs text-(--text-disabled) hover:text-(--danger-400) transition-colors duration-150"
          >
            <Trash2 size={12} />
            {t('pos.clear_cart')}
          </button>
        )}
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto px-4">
        {cart.items.length === 0 ? (
          <div className="h-full flex items-center justify-center py-8">
            <EmptyState
              title={t('pos.empty_cart')}
              description={t('pos.empty_cart_desc')}
              illustration="orders"
              size="sm"
            />
          </div>
        ) : (
          <div className="divide-y divide-(--border-subtle)">
            {cart.items.map((ci) => (
              <CartLineItem
                key={ci.menuItem.id}
                item={ci}
                onIncrease={() =>
                  updateQuantity(ci.menuItem.id, ci.quantity + 1)
                }
                onDecrease={() =>
                  updateQuantity(ci.menuItem.id, ci.quantity - 1)
                }
                onRemove={() => removeFromCart(ci.menuItem.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer: table + total + checkout */}
      {cart.items.length > 0 && (
        <div className="px-4 py-3 border-t border-(--border-subtle) space-y-3 shrink-0">
          {/* Table select */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="cart-table-select"
              className="text-xs text-(--text-muted) shrink-0"
            >
              {t('pos.table_number')}
            </label>
            <select
              id="cart-table-select"
              value={cart.tableId ?? ''}
              onChange={(e) =>
                setCartTable(
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              className={cn(
                'flex-1 text-xs px-2 py-1.5 rounded-lg appearance-none',
                'bg-(--bg-elevated) text-(--text-primary)',
                'border border-(--border-default) hover:border-(--border-strong)',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
              )}
              aria-label={t('pos.select_table')}
            >
              <option value="">{t('pos.select_table')}</option>
              {TABLE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <Divider />

          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-(--text-muted)">{t('pos.subtotal')}</span>
            <span className="text-base font-bold text-(--text-primary) tabular-nums">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Checkout button */}
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onCheckout}
          >
            {t('pos.checkout')}
          </Button>
        </div>
      )}
    </div>
  );
}
