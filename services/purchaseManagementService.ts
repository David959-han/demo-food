import type { Purchase, PurchaseStatus } from '@/types';
import rawPurchases from '@/data/management/purchases.json';

const raw = rawPurchases as unknown as Purchase[];

export interface PurchaseStats {
  totalOrders:    number;
  totalSpent:     number;
  pending:        number;
  confirmed:      number;
  delivered:      number;
  cancelled:      number;
  thisMonthSpent: number;
}

export interface PurchaseQueryOptions {
  q?:        string;
  status?:   PurchaseStatus | '';
  supplier?: string;
}

export async function getPurchaseStats(): Promise<PurchaseStats> {
  const now      = new Date();
  const thisMonth = raw.filter((p) => {
    const d = new Date(p.orderedAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return {
    totalOrders:    raw.length,
    totalSpent:     raw.filter((p) => p.status === 'delivered').reduce((s, p) => s + p.totalAmount, 0),
    pending:        raw.filter((p) => p.status === 'pending').length,
    confirmed:      raw.filter((p) => p.status === 'confirmed').length,
    delivered:      raw.filter((p) => p.status === 'delivered').length,
    cancelled:      raw.filter((p) => p.status === 'cancelled').length,
    thisMonthSpent: thisMonth.reduce((s, p) => s + p.totalAmount, 0),
  };
}

export async function getFilteredPurchases(
  options: PurchaseQueryOptions = {},
): Promise<Purchase[]> {
  const { q = '', status = '', supplier = '' } = options;
  let items = [...raw];

  if (q) {
    const lq = q.toLowerCase();
    items = items.filter(
      (p) =>
        p.orderNumber.toLowerCase().includes(lq) ||
        p.supplier.toLowerCase().includes(lq) ||
        p.items.some((i) => i.name.toLowerCase().includes(lq)),
    );
  }
  if (status)   items = items.filter((p) => p.status === status);
  if (supplier) items = items.filter((p) => p.supplier === supplier);

  return items.sort(
    (a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime(),
  );
}

export async function getUniqueSuppliers(): Promise<string[]> {
  return [...new Set(raw.map((p) => p.supplier))].sort();
}

export async function getPurchaseById(id: number): Promise<Purchase | null> {
  return raw.find((p) => p.id === id) ?? null;
}
