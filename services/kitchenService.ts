import rawData from '@/data/management/kitchen-orders.json';
import type { KitchenOrder, RawKitchenOrder } from '@/types/kitchen';

function resolveOrder(raw: RawKitchenOrder): KitchenOrder {
  const { minutesAgo, ...rest } = raw;
  return {
    ...rest,
    createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  };
}

export async function getKitchenOrders(): Promise<KitchenOrder[]> {
  return (rawData as unknown as RawKitchenOrder[]).map(resolveOrder);
}
