import type { InventoryItem, InventoryCategory, StockStatus } from '@/types';
import rawInventory from '@/data/management/inventory.json';

const raw = rawInventory as unknown as InventoryItem[];

export interface InventoryQueryOptions {
  q?:        string;
  category?: InventoryCategory | '';
  status?:   StockStatus | '';
  sortBy?:   'name' | 'quantity' | 'costPerUnit' | 'lastRestocked';
  sortDir?:  'asc' | 'desc';
}

export interface InventoryStats {
  totalItems:    number;
  inStockCount:  number;
  lowStockCount: number;
  outOfStock:    number;
  totalValue:    number;
}

export async function getInventoryStats(): Promise<InventoryStats> {
  return {
    totalItems:    raw.length,
    inStockCount:  raw.filter((i) => i.status === 'in_stock').length,
    lowStockCount: raw.filter((i) => i.status === 'low_stock').length,
    outOfStock:    raw.filter((i) => i.status === 'out_of_stock').length,
    totalValue:    raw.reduce((sum, i) => sum + i.quantity * i.costPerUnit, 0),
  };
}

export async function getFilteredInventory(
  options: InventoryQueryOptions = {},
): Promise<InventoryItem[]> {
  const { q = '', category = '', status = '', sortBy = 'name', sortDir = 'asc' } = options;

  let items = [...raw];

  if (q) {
    const lq = q.toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(lq) ||
        i.supplier.toLowerCase().includes(lq),
    );
  }

  if (category) items = items.filter((i) => i.category === category);
  if (status)   items = items.filter((i) => i.status === status);

  items.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name')          cmp = a.name.localeCompare(b.name);
    else if (sortBy === 'quantity') cmp = a.quantity - b.quantity;
    else if (sortBy === 'costPerUnit') cmp = a.costPerUnit - b.costPerUnit;
    else if (sortBy === 'lastRestocked')
      cmp = new Date(a.lastRestocked).getTime() - new Date(b.lastRestocked).getTime();
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return items;
}

export async function getAlertItems(): Promise<InventoryItem[]> {
  return raw.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock');
}
