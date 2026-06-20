'use client';

import {
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  Truck,
  UserPlus,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { AppNotification, NotificationType } from '@/types/notification';
import type { TranslationKey } from '@/types/i18n';

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string; text: string }
> = {
  new_order:       { icon: <ShoppingCart size={14} />, bg: 'bg-(--brand-bg)',   text: 'text-(--brand-400)'   },
  order_ready:     { icon: <CheckCircle2 size={14} />, bg: 'bg-(--success-bg)', text: 'text-(--success-400)' },
  low_stock:       { icon: <AlertTriangle size={14}/>, bg: 'bg-(--danger-bg)',  text: 'text-(--danger-400)'  },
  delivery_update: { icon: <Truck size={14} />,        bg: 'bg-(--info-bg)',    text: 'text-(--info-400)'    },
  new_customer:    { icon: <UserPlus size={14} />,     bg: 'bg-(--warning-bg)', text: 'text-(--warning-400)' },
  system:          { icon: <Settings size={14} />,     bg: 'bg-(--bg-subtle)',  text: 'text-(--text-muted)'  },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface NotificationItemProps {
  notification: AppNotification;
  onRead:       (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const { t } = useTranslation();
  const cfg = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;

  return (
    <button
      onClick={() => onRead(notification.id)}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 text-left',
        'transition-colors duration-100',
        'focus-visible:outline-none focus-visible:bg-(--bg-subtle)',
        notification.read
          ? 'hover:bg-(--bg-subtle)/60'
          : 'bg-(--bg-elevated) hover:bg-(--bg-subtle)',
      )}
    >
      {/* Icon badge */}
      <span
        className={cn(
          'flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5',
          cfg.bg, cfg.text,
        )}
        aria-hidden="true"
      >
        {cfg.icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-xs leading-tight',
          notification.read ? 'font-medium text-(--text-secondary)' : 'font-semibold text-(--text-primary)',
        )}>
          {t(notification.titleKey as TranslationKey)}
        </p>
        <p className="text-xs text-(--text-muted) mt-0.5 leading-snug line-clamp-2">
          {notification.body}
        </p>
        <p className="text-[10px] text-(--text-disabled) mt-1 tabular-nums">
          {timeAgo(notification.time)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <span
          className="w-2 h-2 rounded-full bg-(--brand-500) shrink-0 mt-1.5"
          aria-label="Unread"
        />
      )}
    </button>
  );
}
