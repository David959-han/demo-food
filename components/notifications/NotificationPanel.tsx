'use client';

import { useEffect, useRef } from 'react';
import { X, CheckCheck, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { NotificationItem } from './NotificationItem';

interface NotificationPanelProps {
  open:    boolean;
  onClose: () => void;
  anchor:  React.RefObject<HTMLButtonElement | null>;
}

export function NotificationPanel({ open, onClose, anchor }: NotificationPanelProps) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);

  const notifications           = useRestaurantStore((s) => s.notifications);
  const markNotificationRead    = useRestaurantStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useRestaurantStore((s) => s.markAllNotificationsRead);
  const clearNotifications      = useRestaurantStore((s) => s.clearNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        anchor.current   && !anchor.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose, anchor]);

  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-label={t('notifications.title')}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={cn(
            'absolute right-0 top-full mt-2 z-50',
            'w-80 sm:w-96',
            'rounded-2xl bg-(--bg-surface) border border-(--border-default)',
            'shadow-xl shadow-black/30',
            'flex flex-col overflow-hidden',
          )}
          style={{ maxHeight: 'min(28rem, 90dvh)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-(--border-subtle) shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-(--text-primary)">
                {t('notifications.title')}
              </h2>
              {unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-(--brand-500) text-[10px] font-bold text-white tabular-nums">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  aria-label={t('notifications.mark_all_read')}
                  title={t('notifications.mark_all_read')}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-elevated) transition-colors"
                >
                  <CheckCheck size={15} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  aria-label={t('notifications.clear_all')}
                  title={t('notifications.clear_all')}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-(--text-muted) hover:text-(--danger-400) hover:bg-(--danger-bg) transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex items-center justify-center w-7 h-7 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-elevated) transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 divide-y divide-(--border-subtle)">
            {notifications.length === 0 ? (
              <div className="py-6">
                <EmptyState
                  title={t('notifications.no_notifications')}
                  description={t('notifications.no_notifications_desc')}
                  illustration="generic"
                  size="sm"
                />
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <NotificationItem
                      notification={n}
                      onRead={markNotificationRead}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
