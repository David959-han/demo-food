import type { MenuItem, MenuCategory } from '@/types';
import rawMenu       from '@/data/customer/menu.json';
import rawCategories from '@/data/customer/categories.json';

export async function getMenuItems(): Promise<MenuItem[]> {
  return rawMenu as unknown as MenuItem[];
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const sorted = [...(rawCategories as unknown as MenuCategory[])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  return sorted;
}

export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  const items = await getMenuItems();
  return items.find((item) => item.id === id) ?? null;
}
