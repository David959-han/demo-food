'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { CreditCard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import {
  getFilteredMembers,
  getLoyaltyStats,
} from '@/services/loyaltyManagementService';
import { LoyaltyKPI }         from './LoyaltyKPI';
import { LoyaltyFilters }     from './LoyaltyFilters';
import { LoyaltyCard }        from './LoyaltyCard';
import { LoyaltyDetailModal } from './LoyaltyDetailModal';
import type { LoyaltyMember, LoyaltyTier, LoyaltyStatus } from '@/types';
import type { LoyaltyStats }  from '@/services/loyaltyManagementService';

export function LoyaltyContent() {
  const { t }  = useTranslation();
  const router   = useRouter();
  const pathname = usePathname();
  const sp       = useSearchParams();

  const q      = sp.get('q')      ?? '';
  const tier   = (sp.get('tier')   ?? '') as LoyaltyTier | '';
  const status = (sp.get('status') ?? '') as LoyaltyStatus | '';

  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [stats,   setStats]   = useState<LoyaltyStats | null>(null);
  const [selected, setSelected] = useState<LoyaltyMember | null>(null);

  useEffect(() => {
    Promise.all([
      getFilteredMembers({ q, tier: tier || undefined, status: status || undefined }),
      getLoyaltyStats(),
    ]).then(([ms, st]) => {
      setMembers(ms);
      setStats(st);
    });
  }, [q, tier, status]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else        params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const isEmpty = members.length === 0;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-(--brand-500)/12 flex items-center justify-center text-(--brand-400) shrink-0">
          <CreditCard size={18} />
        </div>
        <h1 className="text-xl font-black text-(--text-primary)">
          {t('loyalty.title')}
        </h1>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-surface) min-h-[96px]">
        <div className="relative z-10 px-6 py-5 max-w-[50%]">
          <p className="text-xs font-semibold text-(--brand-400) uppercase tracking-widest mb-1">
            {t('loyalty.title')}
          </p>
          <p className="text-xl font-black text-(--text-primary) leading-tight">
            {stats ? `${stats.totalMembers} ${t('loyalty.total_members')}` : '—'}
          </p>
          <p className="text-sm text-(--text-muted) mt-0.5">
            {t('loyalty.subtitle')}
          </p>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-[58%] pointer-events-none select-none">
          <Image
            src="/images/illustrations/loyalty-hero.svg"
            alt=""
            fill
            unoptimized
            className="object-cover object-left"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-(--bg-surface)/25 to-transparent" />
        </div>
      </div>

      {/* KPI */}
      {stats && <LoyaltyKPI stats={stats} />}

      {/* Filters */}
      <LoyaltyFilters
        q={q}
        tier={tier}
        status={status}
        onQ={(v)      => updateParam('q', v)}
        onTier={(v)   => updateParam('tier', v)}
        onStatus={(v) => updateParam('status', v)}
      />

      {/* Cards grid or empty state */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-36 h-36">
            <Image
              src="/images/illustrations/loyalty-empty.svg"
              alt=""
              width={144}
              height={144}
              unoptimized
            />
          </div>
          <p className="text-base font-semibold text-(--text-secondary)">
            {t('loyalty.no_members')}
          </p>
          <p className="text-sm text-(--text-disabled)">
            {t('loyalty.no_members_desc')}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {members.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.2 }}
              >
                <LoyaltyCard
                  member={member}
                  onClick={setSelected}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Detail slide-over */}
      <LoyaltyDetailModal
        member={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
