export interface MenuCategory {
  id:        number;
  key:       string;
  icon:      string;
  sortOrder: number;
}

export type MenuItemStatus = 'active' | 'inactive' | 'sold_out';

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  status: MenuItemStatus;
  preparationTime: number;
  isPopular: boolean;
}

export interface MenuItemWithStats extends MenuItem {
  costPrice:    number;
  profitMargin: number;
  totalSold:    number;
  rating:       number;
}
