import type { PurchaseStatus } from '@/types';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TranslationKey } from '@/types/i18n';

export const STATUS_VARIANT: Record<PurchaseStatus, BadgeVariant> = {
  pending:   'warning',
  confirmed: 'info',
  delivered: 'success',
  cancelled: 'danger',
};

export const STATUS_LABEL_KEY: Record<PurchaseStatus, TranslationKey> = {
  pending:   'status.pending',
  confirmed: 'status.confirmed',
  delivered: 'status.delivered',
  cancelled: 'status.cancelled',
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;
}
