'use client';

import { useState } from 'react';
import { ShoppingBag, CircleCheck, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MenuPanel } from '@/components/pos/MenuPanel';
import { CartPanel } from '@/components/pos/CartPanel';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { cn } from '@/lib/utils';

export default function POSPage() {
  const { t } = useTranslation();
  const { clearCart, getCartItemsCount, getCartTotal } = useRestaurantStore();

  const [successOpen,     setSuccessOpen]     = useState(false);
  const [mobileCartOpen,  setMobileCartOpen]  = useState(false);

  const itemCount = getCartItemsCount();
  const total     = getCartTotal();

  function handleCheckout() {
    clearCart();
    setSuccessOpen(true);
    setMobileCartOpen(false);
  }

  return (
    <div className="flex flex-col h-full -m-5 lg:-m-6">
      {/* Page header */}
      <div className="px-5 pt-5 lg:px-6 lg:pt-6 shrink-0">
        <PageHeader title={t('pos.title')} border={false} className="pb-3" />
      </div>

      {/* Content: menu + cart */}
      <div className="flex flex-1 min-h-0 gap-5 px-5 pb-5 lg:gap-6 lg:px-6 lg:pb-6">
        {/* Menu panel */}
        <MenuPanel className="flex-1 min-w-0" />

        {/* Desktop cart */}
        <CartPanel
          onCheckout={handleCheckout}
          className="hidden lg:flex flex-col w-80 xl:w-96 flex-shrink-0"
        />
      </div>

      {/* Mobile: floating cart button */}
      <AnimatePresence>
        {itemCount > 0 && !mobileCartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: 16  }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 inset-x-4 z-30 lg:hidden"
          >
            <button
              onClick={() => setMobileCartOpen(true)}
              aria-label={t('pos.view_cart')}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-xl',
                'bg-(--brand-500) text-white shadow-xl shadow-black/30',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
              )}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <span className="text-sm font-semibold">
                  {t('pos.view_cart')}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-xs font-bold tabular-nums">
                  {itemCount}
                </span>
              </div>
              <span className="text-sm font-bold tabular-nums">
                ${total.toFixed(2)}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile cart drawer (slide up from bottom) */}
      <AnimatePresence>
        {mobileCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileCartOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className={cn(
                'fixed inset-x-0 bottom-0 z-50 lg:hidden',
                'flex flex-col max-h-[85dvh] rounded-t-2xl overflow-hidden',
              )}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2 pb-1 bg-(--bg-surface)">
                <div className="w-10 h-1 rounded-full bg-(--border-strong)" />
              </div>

              {/* Close button */}
              <div className="flex items-center justify-between px-4 py-2 bg-(--bg-surface) border-b border-(--border-subtle)">
                <span className="text-sm font-semibold text-(--text-primary)">
                  {t('pos.cart')}
                </span>
                <button
                  onClick={() => setMobileCartOpen(false)}
                  aria-label="Close cart"
                  className="flex items-center justify-center w-7 h-7 rounded-md text-(--text-muted) hover:bg-(--bg-subtle) transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <CartPanel
                onCheckout={handleCheckout}
                className="flex flex-col flex-1 min-h-0 rounded-none border-0 border-t-0"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success modal */}
      <Modal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={t('pos.order_success')}
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <CircleCheck size={56} className="text-(--success-400)" />
          <p className="text-sm text-(--text-secondary) text-center">
            {t('pos.order_success_desc')}
          </p>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => setSuccessOpen(false)}
          >
            {t('pos.all')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
