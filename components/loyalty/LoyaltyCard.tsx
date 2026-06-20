'use client';

import Image from 'next/image';
import { Star, Calendar, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import {
  TIER_STYLE,
  STATUS_VARIANT,
  formatPoints, formatDate,
  tierProgressPercent, pointsToNextTier,
  TIER_NEXT,
} from './loyaltyUtils';
import { Badge } from '@/components/ui/Badge';
import type { LoyaltyMember } from '@/types';

interface LoyaltyCardProps {
  member:  LoyaltyMember;
  onClick: (member: LoyaltyMember) => void;
}

export function LoyaltyCard({ member, onClick }: LoyaltyCardProps) {
  const { t }  = useTranslation();
  const style  = TIER_STYLE[member.tier];
  const pct    = tierProgressPercent(member.points, member.tier);
  const toNext = pointsToNextTier(member.points, member.tier);
  const next   = TIER_NEXT[member.tier];

  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(member)}
      className={cn(
        'w-full text-left rounded-2xl border bg-(--bg-surface)',
        'flex flex-col overflow-hidden group',
        'hover:shadow-xl transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-500)/40',
        style.borderColor,
        member.status !== 'active' && 'opacity-65',
      )}
    >
      {/* Tier gradient header */}
      <div className={cn('px-4 pt-4 pb-5 bg-linear-to-br', style.gradFrom, style.gradTo)}>
        <div className="flex items-start justify-between gap-2">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className={cn(
              'w-14 h-14 rounded-xl overflow-hidden ring-2',
              style.ringColor,
            )}>
              <Image
                src={member.avatar}
                alt={member.name}
                width={56}
                height={56}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className={cn(
              'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-(--bg-surface)',
              member.status === 'active' ? 'bg-(--success-500)' : 'bg-(--text-disabled)',
            )} />
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-bold text-(--text-primary) truncate',
              'group-hover:' + style.textColor.replace('text-', '') + ' transition-colors',
            )}>
              {member.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {/* Tier badge with icon */}
              <div className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border',
                style.bgColor, style.textColor, style.borderColor,
              )}>
                <Image
                  src={style.badgeSrc}
                  alt=""
                  width={12}
                  height={12}
                  unoptimized
                  className="shrink-0"
                />
                {t(style.labelKey)}
              </div>
              <Badge variant={STATUS_VARIANT[member.status]}>
                {t(member.status === 'active' ? 'status.active' : 'status.inactive')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Points display */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-(--text-disabled)">{t('loyalty.points')}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star size={14} className={cn(style.textColor, 'shrink-0')} fill="currentColor" />
              <span className={cn('text-2xl font-black tabular-nums', style.textColor)}>
                {formatPoints(member.points)}
              </span>
            </div>
          </div>
          {/* Tier badge image (decorative, large) */}
          <Image
            src={style.badgeSrc}
            alt=""
            width={36}
            height={36}
            unoptimized
            className="opacity-60"
          />
        </div>
      </div>

      {/* Progress to next tier */}
      <div className="px-4 py-3 border-t border-(--border-subtle)">
        <div className="flex items-center justify-between text-[10px] text-(--text-disabled) mb-1.5">
          {next ? (
            <>
              <span>{formatPoints(toNext)} {t('loyalty.pts_to_next')} {t(TIER_STYLE[next].labelKey)}</span>
              <span>{pct}%</span>
            </>
          ) : (
            <span className={cn('font-semibold', style.textColor)}>
              {t('loyalty.max_tier')} ✦
            </span>
          )}
        </div>
        <div className="h-1.5 w-full rounded-full bg-(--bg-base) overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', style.barColor)}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Footer: orders + last visit */}
      <div className="px-4 pb-4 flex items-center gap-3 text-xs text-(--text-disabled)">
        <div className="flex items-center gap-1">
          <ShoppingBag size={11} />
          <span>{member.totalOrders}</span>
        </div>
        <span>·</span>
        <div className="flex items-center gap-1">
          <Calendar size={11} />
          <span>{formatDate(member.lastVisit)}</span>
        </div>
      </div>
    </motion.button>
  );
}
