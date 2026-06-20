'use client';

import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

export default function NotFound() {
  const router = useRouter();
  const { t }  = useTranslation();

  return (
    <div className="fixed inset-0 z-50 bg-(--bg-base) flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center max-w-sm"
      >
        {/* 404 graphic */}
        <div className="relative mx-auto w-40 h-40 mb-8">
          <div className="absolute inset-0 rounded-full bg-(--brand-500)/8 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-(--bg-elevated) flex items-center justify-center">
            <span
              className="text-5xl font-black text-(--brand-500) select-none"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              404
            </span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-(--text-primary) mb-2">
          {t('common.not_found_title')}
        </h1>
        <p className="text-sm text-(--text-muted) mb-8">
          {t('common.not_found_desc')}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft size={14} />}
            onClick={() => router.back()}
          >
            {t('common.go_back')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Home size={14} />}
            onClick={() => router.push('/dashboard')}
          >
            {t('nav.dashboard')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
