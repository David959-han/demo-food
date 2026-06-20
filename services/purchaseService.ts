import type { Purchase } from '@/types';
import rawPurchases from '@/data/management/purchases.json';

export async function getPurchases(): Promise<Purchase[]> {
  return rawPurchases as unknown as Purchase[];
}

export async function getPurchaseById(id: number): Promise<Purchase | null> {
  const purchases = await getPurchases();
  return purchases.find((p) => p.id === id) ?? null;
}
