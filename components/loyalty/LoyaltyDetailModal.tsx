'use client';

import Image from 'next/image';
import { X, Star, ShoppingBag, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import {
  TIER_STYLE, STATUS_VARIANT, STATUS_LABEL_KEY,
  TXN_COLOR, TXN_BG, TIER_NEXT, TIER_THRESHOLDS,
  formatPoints, formatDate, tierProgressPercent, pointsToNextTier,
} from './loyaltyUtils';
import { Badge } from '@/components/ui/Badge';
import type { LoyaltyMember, LoyaltyTier } from '@/types';
import type { TranslationKey } from '@/types/i18n';

const BENEFITS: Record<LoyaltyTier, string[]> = {
  bronze:   ['benefit_b1','benefit_b2','benefit_b3'],
  silver:   ['benefit_s1','benefit_s2','benefit_s3','benefit_s4'],
  gold:     ['benefit_g1','benefit_g2','benefit_g3','benefit_g4','benefit_g5'],
  platinum: ['benefit_p1','benefit_p2','benefit_p3','benefit_p4','benefit_p5','benefit_p6'],
};

interface LoyaltyDetailModalProps {
  member: LoyaltyMember | null;
  onClose: () => void;
}

export function LoyaltyDetailModal({ member, onClose }: LoyaltyDetailModalProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence mode="popLayout">
      {member && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 48, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className={cn(
              'fixed top-4 right-4 bottom-4 z-50 w-full max-w-md',
              'bg-(--bg-surface) rounded-2xl border overflow-hidden flex flex-col shadow-2xl',
              TIER_STYLE[member.tier].borderColor,
            )}
          >
            {/* Header gradient strip */}
            <div className={cn(
              'px-5 pt-5 pb-6 bg-linear-to-br',
              TIER_STYLE[member.tier].gradFrom,
              TIER_STYLE[member.tier].gradTo,
            )}>
              {/* Close */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-(--text-secondary)">
                  {t('loyalty.modal_title')}
                </p>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-elevated) transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Avatar + identity */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className={cn(
                    'w-16 h-16 rounded-xl overflow-hidden ring-2',
                    TIER_STYLE[member.tier].ringColor,
                  )}>
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className={cn(
                    'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-(--bg-surface)',
                    member.status === 'active' ? 'bg-(--success-500)' : 'bg-(--text-disabled)',
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-black text-(--text-primary) truncate">{member.name}</h2>
                  <p className="text-xs text-(--text-muted) truncate">{member.email}</p>
                  <p className="text-xs text-(--text-muted)">{member.phone}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <div className={cn(
                      'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border',
                      TIER_STYLE[member.tier].bgColor,
                      TIER_STYLE[member.tier].textColor,
                      TIER_STYLE[member.tier].borderColor,
                    )}>
                      <Image src={TIER_STYLE[member.tier].badgeSrc} alt="" width={11} height={11} unoptimized />
                      {t(TIER_STYLE[member.tier].labelKey)}
                    </div>
                    <Badge variant={STATUS_VARIANT[member.status]}>
                      {t(STATUS_LABEL_KEY[member.status])}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Points hero */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-(--text-disabled)">{t('loyalty.points')}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star size={16} className={TIER_STYLE[member.tier].textColor} fill="currentColor" />
                    <span className={cn('text-3xl font-black tabular-nums', TIER_STYLE[member.tier].textColor)}>
                      {formatPoints(member.points)}
                    </span>
                  </div>
                </div>
                <Image
                  src={TIER_STYLE[member.tier].badgeSrc}
                  alt="" width={44} height={44} unoptimized className="opacity-70"
                />
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-5">

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t('loyalty.total_orders'), value: member.totalOrders, icon: <ShoppingBag size={13} />, color: 'text-(--brand-400)' },
                  { label: t('loyalty.total_spent'),  value: `$${member.totalSpent.toFixed(0)}`, icon: <DollarSign size={13} />, color: 'text-(--success-400)' },
                  { label: t('loyalty.last_visit'),   value: formatDate(member.lastVisit), icon: <Calendar size={13} />, color: 'text-(--info-400)' },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} className="rounded-xl bg-(--bg-elevated) border border-(--border-subtle) p-3">
                    <div className={cn('mb-1', color)}>{icon}</div>
                    <p className="text-xs text-(--text-disabled) leading-tight">{label}</p>
                    <p className="text-sm font-bold text-(--text-primary) leading-tight mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Tier progress */}
              <div>
                <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mb-2">
                  {t('loyalty.tier_progress')}
                </p>
                <div className="rounded-xl bg-(--bg-elevated) border border-(--border-subtle) p-3">
                  {TIER_NEXT[member.tier] ? (
                    <>
                      <div className="flex items-center justify-between text-xs text-(--text-muted) mb-1.5">
                        <span className={TIER_STYLE[member.tier].textColor}>
                          {t(TIER_STYLE[member.tier].labelKey)}: {formatPoints(member.points)} pts
                        </span>
                        <span className={TIER_STYLE[TIER_NEXT[member.tier]!].textColor}>
                          {t(TIER_STYLE[TIER_NEXT[member.tier]!].labelKey)}: {formatPoints(TIER_THRESHOLDS[TIER_NEXT[member.tier]!])} pts
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-(--bg-base) overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full', TIER_STYLE[member.tier].barColor)}
                          initial={{ width: 0 }}
                          animate={{ width: `${tierProgressPercent(member.points, member.tier)}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-xs text-(--text-disabled) mt-1.5 text-right">
                        {formatPoints(pointsToNextTier(member.points, member.tier))} {t('loyalty.pts_to_next')} {t(TIER_STYLE[TIER_NEXT[member.tier]!].labelKey)}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Star size={14} className={TIER_STYLE[member.tier].textColor} fill="currentColor" />
                      <span className={cn('text-sm font-bold', TIER_STYLE[member.tier].textColor)}>
                        {t('loyalty.max_tier')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mb-2">
                  {t('loyalty.benefits')}
                </p>
                <div className="rounded-xl bg-(--bg-elevated) border border-(--border-subtle) divide-y divide-(--border-subtle)">
                  {BENEFITS[member.tier].map((key) => (
                    <div key={key} className="flex items-center gap-2.5 px-3 py-2.5">
                      <CheckCircle2 size={13} className={TIER_STYLE[member.tier].textColor} />
                      <p className="text-sm text-(--text-primary)">{t(`loyalty.${key}` as TranslationKey)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction history */}
              <div>
                <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mb-2">
                  {t('loyalty.points_history')}
                </p>
                <div className="space-y-2">
                  {member.history.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center gap-3 rounded-xl bg-(--bg-elevated) border border-(--border-subtle) px-3 py-2.5"
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                        TXN_BG[txn.type],
                      )}>
                        <Star size={13} className={TXN_COLOR[txn.type]} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-(--text-primary) truncate">{txn.description}</p>
                        <p className="text-[10px] text-(--text-disabled)">{formatDate(txn.date)}</p>
                      </div>
                      <span className={cn('text-sm font-bold tabular-nums shrink-0', TXN_COLOR[txn.type])}>
                        {txn.points > 0 ? '+' : ''}{txn.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Joined */}
              <div className="text-center text-[10px] text-(--text-disabled) pb-1">
                {t('loyalty.member_since')} {formatDate(member.joinedAt)}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
