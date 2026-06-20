import rawOrders from '@/data/management/deliveries.json';
import rawRiders from '@/data/management/riders.json';
import type { DeliveryOrder, Rider, RawDeliveryOrder } from '@/types/delivery';

const allRiders = rawRiders as unknown as Rider[];

function resolveOrder(raw: RawDeliveryOrder): DeliveryOrder {
  const { minutesAgo, ...rest } = raw;
  return {
    ...rest,
    createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  };
}

export async function getDeliveryOrders(): Promise<DeliveryOrder[]> {
  return (rawOrders as unknown as RawDeliveryOrder[]).map(resolveOrder);
}

export async function getRiders(): Promise<Rider[]> {
  return allRiders;
}
