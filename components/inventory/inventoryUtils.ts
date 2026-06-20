import type { InventoryCategory, StockStatus } from '@/types';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TranslationKey } from '@/types/i18n';

export const STATUS_VARIANT: Record<StockStatus, BadgeVariant> = {
  in_stock:    'success',
  low_stock:   'warning',
  out_of_stock:'danger',
};

export const STATUS_LABEL_KEY: Record<StockStatus, TranslationKey> = {
  in_stock:    'status.in_stock',
  low_stock:   'status.low_stock',
  out_of_stock:'status.out_of_stock',
};

export const CATEGORY_LABEL_KEY: Record<InventoryCategory, TranslationKey> = {
  proteins:   'inventory.cat_proteins',
  vegetables: 'inventory.cat_vegetables',
  dairy:      'inventory.cat_dairy',
  grains:     'inventory.cat_grains',
  beverages:  'inventory.cat_beverages',
  sauces:     'inventory.cat_sauces',
  dry_goods:  'inventory.cat_dry_goods',
  packaging:  'inventory.cat_packaging',
};

export const CATEGORY_COLOR: Record<InventoryCategory, string> = {
  proteins:   'bg-(--danger-500)/12  text-(--danger-400)',
  vegetables: 'bg-(--success-500)/12 text-(--success-400)',
  dairy:      'bg-(--info-500)/12    text-(--info-400)',
  grains:     'bg-(--warning-500)/12 text-(--warning-400)',
  beverages:  'bg-(--brand-500)/12   text-(--brand-400)',
  sauces:     'bg-(--danger-500)/10  text-(--danger-300)',
  dry_goods:  'bg-(--text-muted)/10  text-(--text-muted)',
  packaging:  'bg-(--text-muted)/8   text-(--text-disabled)',
};

export function stockPercent(quantity: number, reorderLevel: number): number {
  if (reorderLevel === 0) return 100;
  const full = reorderLevel * 3;
  return Math.min(100, Math.round((quantity / full) * 100));
}

export function stockBarColor(status: StockStatus): string {
  if (status === 'in_stock')    return 'bg-(--success-500)';
  if (status === 'low_stock')   return 'bg-(--warning-500)';
  return 'bg-(--danger-500)';
}

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
