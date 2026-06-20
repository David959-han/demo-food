'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { RoleCard } from '@/components/auth/RoleCard';
import { useTranslation } from '@/hooks/useTranslation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { getDemoUsers, loginAs } from '@/services/authService';
import type { DemoUser } from '@/types/auth';
import type { Language } from '@/types/i18n';

export default function LoginPage() {
  const { t, language, setLanguage } = useTranslation();
  const router = useRouter();
  const { setCurrentUser, currentUser } = useRestaurantStore();

  const [users, setUsers] = useState<DemoUser[]>([]);

  useEffect(() => {
    getDemoUsers().then(setUsers);
  }, []);

  async function handleLogin(user: DemoUser) {
    const loggedIn = await loginAs(user);
    setCurrentUser(loggedIn);
    router.push('/');
  }

  return (
    // Full-screen overlay — covers the existing Sidebar + Navbar layout
    <div className="fixed inset-0 z-50 bg-(--bg-base) overflow-auto">
      {/* Top-right language selector */}
      <div className="absolute top-4 right-4 z-10">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          aria-label="Language"
          className="text-xs px-2.5 py-1.5 rounded-lg appearance-none cursor-pointer bg-(--bg-elevated) text-(--text-secondary) border border-(--border-default) hover:border-(--border-strong) transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40"
        >
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="uz">UZ</option>
        </select>
      </div>

      <div className="min-h-full flex flex-col items-center justify-center px-4 py-12">

        {/* Logo + Demo badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex flex-col items-center gap-3"
        >
          <Logo size="lg" />
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-(--brand-500)/30 bg-(--brand-bg) text-(--brand-400)">
            <span className="w-1.5 h-1.5 rounded-full bg-(--brand-500) animate-pulse" />
            Demo Mode — No password required
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-(--text-primary) tracking-tight">
            {t('auth.title')}
          </h1>
          <p className="mt-2 text-sm text-(--text-muted)">
            {t('auth.subtitle')}
          </p>
        </motion.div>

        {/* Role cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
            >
              <RoleCard
                user={user}
                active={currentUser?.id === user.id}
                onLogin={handleLogin}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-3 text-xs text-(--text-disabled)">
            <span>Next.js 16</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>Tailwind v4</span>
            <span>•</span>
            <span>Zustand v5</span>
          </div>
          <p className="text-xs text-(--text-disabled)">FoodERP Demo — Portfolio Project</p>
        </motion.div>

      </div>
    </div>
  );
}
