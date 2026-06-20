import type { LoyaltyMember } from '@/types';
import rawLoyalty from '@/data/management/loyalty.json';

export async function getLoyaltyMembers(): Promise<LoyaltyMember[]> {
  return rawLoyalty as unknown as LoyaltyMember[];
}

export async function getLoyaltyMemberById(
  id: number,
): Promise<LoyaltyMember | null> {
  const members = await getLoyaltyMembers();
  return members.find((m) => m.id === id) ?? null;
}
