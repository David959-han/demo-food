'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { ROLE_VARIANT } from '@/types/auth';
import type { DemoUser } from '@/types/auth';
import type { TranslationKey } from '@/types/i18n';

interface RoleCardProps {
  user:      DemoUser;
  active?:   boolean;
  onLogin:   (user: DemoUser) => Promise<void>;
  className?: string;
}

export function RoleCard({ user, active = false, onLogin, className }: RoleCardProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const roleKey = `roles.${user.role}` as TranslationKey;

  async function handleLogin() {
    setLoading(true);
    try {
      await onLogin(user);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col gap-4 p-5 rounded-xl',
        'bg-(--bg-elevated) border transition-colors duration-200',
        active
          ? 'border-(--brand-500)/60 ring-1 ring-(--brand-500)/20'
          : 'border-(--border-default) hover:border-(--brand-500)/30',
        className,
      )}
    >
      {/* Avatar + identity */}
      <div className="flex items-center gap-3">
        <Avatar
          alt={user.name}
          size="lg"
        />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-(--text-primary) leading-none truncate">
            {user.name}
          </span>
          <Badge
            variant={ROLE_VARIANT[user.role]}
            shape="pill"
          >
            {t(roleKey)}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-(--text-muted) leading-relaxed">
        {user.title}
      </p>

      {/* Login button */}
      <Button
        variant={active ? 'secondary' : 'primary'}
        size="sm"
        fullWidth
        loading={loading}
        onClick={handleLogin}
      >
        {t('auth.login_as')}
      </Button>
    </motion.div>
  );
}
