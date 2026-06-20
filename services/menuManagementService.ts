import rawData from '@/data/management/menu.json';
import type { MenuItemWithStats, MenuItemStatus } from '@/types/menu';

const allItems = rawData as unknown as MenuItemWithStats[];

export interface MenuQueryOptions {
  page?:       number;
  limit?:      number;
  sortBy?:     'name' | 'price' | 'category' | 'status' | 'totalSold';
  sortDir?:    'asc' | 'desc';
  categoryId?: number | null;
  status?:     MenuItemStatus | null;
  q?:          string;
}

export interface PaginatedResult<T> {
  items:      T[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export async function getMenuItemsWithStats(
  options: MenuQueryOptions = {},
): Promise<PaginatedResult<MenuItemWithStats>> {
  const {
    page       = 1,
    limit      = 50,
    sortBy     = 'name',
    sortDir    = 'asc',
    categoryId = null,
    status     = null,
    q          = '',
  } = options;

  let filtered = [...allItems];

  // Filter
  if (categoryId !== null) {
    filtered = filtered.filter((i) => i.categoryId === categoryId);
  }
  if (status !== null) {
    filtered = filtered.filter((i) => i.status === status);
  }
  if (q.trim()) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(lower) ||
        i.description.toLowerCase().includes(lower),
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let av: string | number;
    let bv: string | number;

    switch (sortBy) {
      case 'price':     av = a.price;     bv = b.price;     break;
      case 'totalSold': av = a.totalSold; bv = b.totalSold; break;
      case 'category':  av = a.categoryId; bv = b.categoryId; break;
      case 'status':    av = a.status;    bv = b.status;    break;
      default:          av = a.name;      bv = b.name;
    }

    const cmp =
      typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));

    return sortDir === 'asc' ? cmp : -cmp;
  });

  const total      = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage   = Math.min(Math.max(1, page), totalPages);
  const start      = (safePage - 1) * limit;

  return {
    items:      filtered.slice(start, start + limit),
    total,
    page:       safePage,
    limit,
    totalPages,
  };
}
