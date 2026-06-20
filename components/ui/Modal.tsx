'use client';

import {
  useEffect,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title?:     ReactNode;
  children:   ReactNode;
  footer?:    ReactNode;
  size?:      ModalSize;
  closable?:  boolean;
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size     = 'md',
  closable = true,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => { prev?.focus(); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [open]);

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' && closable) onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKey}
        >
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closable ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{    opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              'relative z-10 w-full rounded-xl',
              'bg-(--bg-elevated) border border-(--border-default)',
              'shadow-2xl shadow-black/40',
              'focus:outline-none',
              sizeStyles[size],
              className,
            )}
          >
            {/* Header */}
            {(title || closable) && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-(--border-subtle)">
                {title && (
                  <h2 className="text-base font-semibold text-(--text-primary)">
                    {title}
                  </h2>
                )}
                {closable && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className={cn(
                      'ml-auto p-1.5 rounded-md',
                      'text-(--text-muted) hover:text-(--text-primary)',
                      'hover:bg-(--bg-subtle) transition-colors duration-150',
                    )}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="px-5 py-4">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-(--border-subtle)">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
