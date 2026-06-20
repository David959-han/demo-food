export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type InventoryCategory =
  | 'proteins'
  | 'vegetables'
  | 'dairy'
  | 'grains'
  | 'beverages'
  | 'sauces'
  | 'dry_goods'
  | 'packaging';

export type InventoryUnit = 'kg' | 'g' | 'l' | 'ml' | 'pcs' | 'box' | 'pack';

export interface InventoryItem {
  id:            number;
  name:          string;
  category:      InventoryCategory;
  unit:          InventoryUnit;
  quantity:      number;
  reorderLevel:  number;
  costPerUnit:   number;
  supplier:      string;
  status:        StockStatus;
  lastRestocked: string;
}
