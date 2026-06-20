import type { InventoryItem } from '@/types';
import rawInventory from '@/data/management/inventory.json';

export async function getInventoryItems(): Promise<InventoryItem[]> {
  return rawInventory as unknown as InventoryItem[];
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  const items = await getInventoryItems();
  return items.filter((item) => item.status === 'low_stock' || item.status === 'out_of_stock');
}

export async function getInventoryItemById(id: number): Promise<InventoryItem | null> {
  const items = await getInventoryItems();
  return items.find((item) => item.id === id) ?? null;
}
