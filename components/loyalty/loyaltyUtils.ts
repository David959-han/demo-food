import type { LoyaltyTier, LoyaltyStatus, PointsTransactionType } from '@/types';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TranslationKey } from '@/types/i18n';

// ── Tier thresholds ─────────────────────────────────────────────────────────
export const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  bronze:   0,
  silver:   500,
  gold:     1000,
  platinum: 2500,
};

export const TIER_NEXT: Record<LoyaltyTier, LoyaltyTier | null> = {
  bronze:   'silver',
  silver:   'gold',
  gold:     'platinum',
  platinum: null,
};

// ── Tier styles ──────────────────────────────────────────────────────────────
export interface TierStyle {
  variant:     BadgeVariant;
  textColor:   string;
  bgColor:     string;
  borderColor: string;
  ringColor:   string;
  barColor:    string;
  gradFrom:    string;
  gradTo:      string;
  labelKey:    TranslationKey;
  badgeSrc:    string;
}

export const TIER_STYLE: Record<LoyaltyTier, TierStyle> = {
  bronze: {
    variant:     'warning',
    textColor:   'text-(--warning-400)',
    bgColor:     'bg-(--warning-500)/10',
    borderColor: 'border-(--warning-500)/25',
    ringColor:   'ring-(--warning-500)/30',
    barColor:    'bg-(--warning-500)',
    gradFrom:    'from-(--warning-500)/18',
    gradTo:      'to-(--warning-500)/4',
    labelKey:    'loyalty.tier_bronze',
    badgeSrc:    '/images/tiers/bronze.svg',
  },
  silver: {
    variant:     'neutral',
    textColor:   'text-(--text-secondary)',
    bgColor:     'bg-(--bg-elevated)',
    borderColor: 'border-(--border-default)',
    ringColor:   'ring-(--border-strong)',
    barColor:    'bg-(--text-muted)',
    gradFrom:    'from-(--bg-elevated)',
    gradTo:      'to-(--bg-subtle)',
    labelKey:    'loyalty.tier_silver',
    badgeSrc:    '/images/tiers/silver.svg',
  },
  gold: {
    variant:     'brand',
    textColor:   'text-(--brand-400)',
    bgColor:     'bg-(--brand-500)/10',
    borderColor: 'border-(--brand-500)/25',
    ringColor:   'ring-(--brand-500)/30',
    barColor:    'bg-(--brand-500)',
    gradFrom:    'from-(--brand-500)/18',
    gradTo:      'to-(--brand-500)/4',
    labelKey:    'loyalty.tier_gold',
    badgeSrc:    '/images/tiers/gold.svg',
  },
  platinum: {
    variant:     'info',
    textColor:   'text-(--info-400)',
    bgColor:     'bg-(--info-500)/10',
    borderColor: 'border-(--info-500)/25',
    ringColor:   'ring-(--info-500)/30',
    barColor:    'bg-(--info-500)',
    gradFrom:    'from-(--info-500)/18',
    gradTo:      'to-(--info-500)/4',
    labelKey:    'loyalty.tier_platinum',
    badgeSrc:    '/images/tiers/platinum.svg',
  },
};

// ── Status ───────────────────────────────────────────────────────────────────
export const STATUS_VARIANT: Record<LoyaltyStatus, BadgeVariant> = {
  active:   'success',
  inactive: 'neutral',
};

export const STATUS_LABEL_KEY: Record<LoyaltyStatus, TranslationKey> = {
  active:   'status.active',
  inactive: 'status.inactive',
};

// ── Transaction ──────────────────────────────────────────────────────────────
export const TXN_COLOR: Record<PointsTransactionType, string> = {
  earned:   'text-(--success-400)',
  bonus:    'text-(--brand-400)',
  redeemed: 'text-(--warning-400)',
  expired:  'text-(--danger-400)',
};

export const TXN_BG: Record<PointsTransactionType, string> = {
  earned:   'bg-(--success-500)/12',
  bonus:    'bg-(--brand-500)/12',
  redeemed: 'bg-(--warning-500)/12',
  expired:  'bg-(--danger-500)/12',
};

export const TXN_LABEL_KEY: Record<PointsTransactionType, TranslationKey> = {
  earned:   'loyalty.txn_earned',
  bonus:    'loyalty.txn_bonus',
  redeemed: 'loyalty.txn_redeemed',
  expired:  'loyalty.txn_expired',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
export function pointsToNextTier(points: number, tier: LoyaltyTier): number {
  const next = TIER_NEXT[tier];
  if (!next) return 0;
  return Math.max(0, TIER_THRESHOLDS[next] - points);
}

export function tierProgressPercent(points: number, tier: LoyaltyTier): number {
  const next = TIER_NEXT[tier];
  if (!next) return 100;
  const from = TIER_THRESHOLDS[tier];
  const to   = TIER_THRESHOLDS[next];
  return Math.min(100, Math.round(((points - from) / (to - from)) * 100));
}

export function formatPoints(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}
