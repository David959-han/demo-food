'use client';

import { ShieldOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { getDefaultHref } from '@/lib/navigation';

export function AccessDenied() {
  const { t }       = useTranslation();
  const router      = useRouter();
  const currentUser = useRestaurantStore((s) => s.currentUser);

  function goHome() {
    const href = currentUser ? getDefaultHref(currentUser.role) : '/login';
    router.replace(href);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full min-h-64 gap-4 text-center px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-(--danger-bg) flex items-center justify-center">
        <ShieldOff size={28} className="text-(--danger-400)" />
      </div>
      <div>
        <h2 className="text-base font-bold text-(--text-primary) mb-1">
          {t('common.access_denied_title')}
        </h2>
        <p className="text-sm text-(--text-muted)">
          {t('common.access_denied_desc')}
        </p>
      </div>
      <Button variant="secondary" size="sm" onClick={goHome}>
        {t('common.go_back')}
      </Button>
    </motion.div>
  );
}
