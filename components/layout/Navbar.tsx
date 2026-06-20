'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { getNotifications } from '@/services/notificationService';
import { UserSwitcher } from '../auth/UserSwitcher';
import { Breadcrumb } from './Breadcrumb';
import { NotificationPanel } from '../notifications/NotificationPanel';
import type { Language } from '../../types/i18n';

interface NavbarProps {
  onMenuClick:    () => void;
  menuTriggerRef: RefObject<HTMLButtonElement | null>;
}

export default function Navbar({ onMenuClick, menuTriggerRef }: NavbarProps) {
  const { language, setLanguage } = useTranslation();

  const notifications    = useRestaurantStore((s) => s.notifications);
  const setNotifications = useRestaurantStore((s) => s.setNotifications);
  const getUnreadCount   = useRestaurantStore((s) => s.getUnreadCount);
  const theme            = useRestaurantStore((s) => s.theme);
  const toggleTheme      = useRestaurantStore((s) => s.toggleTheme);

  const unreadCount = getUnreadCount();

  const bellRef                   = useRef<HTMLButtonElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => {
    Promise.resolve(true).then(setMounted);
    if (notifications.length === 0) {
      getNotifications().then(setNotifications);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={cn(
        'relative flex items-center justify-between h-14 px-4 shrink-0',
        'bg-(--bg-surface) border-b border-(--border-default)',
      )}
    >
      {/* Left: hamburger (mobile only) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          ref={menuTriggerRef}
          onClick={onMenuClick}
          aria-label="Open navigation"
          className={cn(
            'flex md:hidden items-center justify-center w-8 h-8 rounded-lg',
            'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-subtle)',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
          )}
        >
          <Menu size={18} />
        </button>

        <Breadcrumb />
      </div>

      {/* Right: language + notifications + user */}
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          aria-label="Language"
          className={cn(
            'text-xs px-2.5 py-1.5 rounded-lg appearance-none cursor-pointer',
            'bg-(--bg-elevated) text-(--text-secondary)',
            'border border-(--border-default) hover:border-(--border-strong)',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
          )}
        >
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="uz">UZ</option>
        </select>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg',
            'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-subtle)',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
          )}
        >
          {!mounted || theme === 'dark'
            ? <Sun size={16} />
            : <Moon size={16} />}
        </button>

        {/* Bell button */}
        <div className="relative">
          <button
            ref={bellRef}
            onClick={() => setPanelOpen((o) => !o)}
            aria-label="Notifications"
            aria-expanded={panelOpen}
            className={cn(
              'relative flex items-center justify-center w-8 h-8 rounded-lg',
              'text-(--text-secondary) transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
              panelOpen
                ? 'bg-(--bg-subtle) text-(--text-primary)'
                : 'hover:bg-(--bg-subtle) hover:text-(--text-primary)',
            )}
          >
            <Bell size={17} />
            {mounted && unreadCount > 0 && (
              <span
                aria-label={`${unreadCount} unread`}
                className={cn(
                  'absolute -top-0.5 -right-0.5',
                  'flex items-center justify-center',
                  'min-w-[1rem] h-4 px-0.5 rounded-full',
                  'bg-(--brand-500) text-[9px] font-bold text-white tabular-nums',
                )}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            anchor={bellRef}
          />
        </div>

        <UserSwitcher />
      </div>
    </header>
  );
}
