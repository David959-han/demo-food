import type { LoyaltyMember, LoyaltyTier, LoyaltyStatus } from '@/types';
import rawData from '@/data/management/loyalty.json';

const raw = rawData as unknown as LoyaltyMember[];

export interface LoyaltyStats {
  totalMembers:  number;
  activeMembers: number;
  totalPoints:   number;
  avgPoints:     number;
  byTier:        Record<LoyaltyTier, number>;
}

export interface LoyaltyQueryOptions {
  q?:      string;
  tier?:   LoyaltyTier | '';
  status?: LoyaltyStatus | '';
}

export async function getLoyaltyStats(): Promise<LoyaltyStats> {
  const active = raw.filter((m) => m.status === 'active');
  const total  = raw.reduce((s, m) => s + m.points, 0);
  return {
    totalMembers:  raw.length,
    activeMembers: active.length,
    totalPoints:   total,
    avgPoints:     raw.length ? Math.round(total / raw.length) : 0,
    byTier: {
      bronze:   raw.filter((m) => m.tier === 'bronze').length,
      silver:   raw.filter((m) => m.tier === 'silver').length,
      gold:     raw.filter((m) => m.tier === 'gold').length,
      platinum: raw.filter((m) => m.tier === 'platinum').length,
    },
  };
}

export async function getFilteredMembers(
  options: LoyaltyQueryOptions = {},
): Promise<LoyaltyMember[]> {
  const { q = '', tier = '', status = '' } = options;
  let items = [...raw];

  if (q) {
    const lq = q.toLowerCase();
    items = items.filter(
      (m) =>
        m.name.toLowerCase().includes(lq) ||
        m.email.toLowerCase().includes(lq) ||
        m.phone.includes(lq),
    );
  }
  if (tier)   items = items.filter((m) => m.tier   === tier);
  if (status) items = items.filter((m) => m.status === status);

  return items.sort((a, b) => b.points - a.points);
}

export async function getMemberById(id: number): Promise<LoyaltyMember | null> {
  return raw.find((m) => m.id === id) ?? null;
}
