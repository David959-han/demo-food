'use client';

import { useEffect, useRef, RefObject } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { SidebarContent } from './SidebarContent';

interface MobileDrawerProps {
  open:         boolean;
  onClose:      () => void;
  triggerRef?:  RefObject<HTMLButtonElement | null>;
}

export function MobileDrawer({ open, onClose, triggerRef }: MobileDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management: open → close button; close → trigger
  useEffect(() => {
    if (open) {
      // Small tick so the element is mounted before focusing
      const id = setTimeout(() => closeButtonRef.current?.focus(), 16);
      return () => clearTimeout(id);
    } else {
      triggerRef?.current?.focus();
    }
  }, [open, triggerRef]);

  // ESC key
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-60 flex flex-col',
              'bg-(--bg-surface) border-r border-(--border-default)',
              'md:hidden',
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-(--border-subtle) shrink-0">
              <Logo size="sm" />
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close navigation"
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-md',
                  'text-(--text-disabled) hover:text-(--text-secondary) hover:bg-(--bg-subtle)',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
                )}
              >
                <X size={15} />
              </button>
            </div>

            {/* Navigation — always expanded in drawer */}
            <SidebarContent onNavClick={onClose} mounted={true} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
