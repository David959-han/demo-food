'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { getDemoUsers } from '@/services/authService';
import { ROLE_VARIANT } from '@/types/auth';
import type { DemoUser } from '@/types/auth';
import type { TranslationKey } from '@/types/i18n';

export function UserSwitcher() {
  const { t } = useTranslation();
  const { currentUser, setCurrentUser, logout } = useRestaurantStore();

  const [open, setOpen]       = useState(false);
  const [users, setUsers]     = useState<DemoUser[]>([]);
  const [mounted, setMounted] = useState(false);
  const containerRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.resolve(true).then(setMounted);
    getDemoUsers().then(setUsers);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleSwitch(user: DemoUser) {
    setCurrentUser(user);
    setOpen(false);
  }

  function handleLogout() {
    logout();
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg',
          'transition-colors duration-150',
          'hover:bg-(--bg-subtle)',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
        )}
      >
        {mounted && currentUser ? (
          <>
            <Avatar alt={currentUser.name} size="sm" />
            <span className="hidden sm:flex flex-col items-start leading-none gap-0.5">
              <span className="text-xs font-medium text-(--text-primary)">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-(--text-muted)">
                {t(`roles.${currentUser.role}` as TranslationKey)}
              </span>
            </span>
          </>
        ) : (
          <span className="text-xs text-(--text-muted)">{t('auth.select_role')}</span>
        )}
        <ChevronDown
          size={13}
          className={cn(
            'text-(--text-muted) transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{    opacity: 0, y: -6, scale: 0.97  }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'w-56 rounded-xl overflow-hidden',
              'bg-(--bg-elevated) border border-(--border-default)',
              'shadow-xl shadow-black/30',
            )}
          >
            {/* Header */}
            <div className="px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-(--text-disabled)">
                {t('auth.switch_role')}
              </p>
            </div>

            <Divider />

            {/* User list */}
            <div className="py-1">
              {users.map((user) => {
                const isActive = currentUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSwitch(user)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2',
                      'transition-colors duration-100',
                      isActive
                        ? 'bg-(--brand-bg) text-(--text-primary)'
                        : 'hover:bg-(--bg-subtle) text-(--text-secondary)',
                    )}
                  >
                    <Avatar alt={user.name} size="xs" />
                    <span className="flex flex-col items-start leading-none gap-1 min-w-0">
                      <span className="text-xs font-medium truncate w-full">
                        {user.name}
                      </span>
                      <Badge
                        variant={ROLE_VARIANT[user.role]}
                        shape="pill"
                      >
                        {t(`roles.${user.role}` as TranslationKey)}
                      </Badge>
                    </span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-(--brand-500) shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            {mounted && currentUser && (
              <>
                <Divider />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    leftIcon={<LogOut size={13} />}
                    onClick={handleLogout}
                    className="justify-start text-(--danger-400) hover:text-(--danger-400) hover:bg-(--danger-bg)"
                  >
                    {t('auth.logout')}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
