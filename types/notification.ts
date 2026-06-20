export type NotificationType =
  | 'new_order'
  | 'order_ready'
  | 'low_stock'
  | 'delivery_update'
  | 'new_customer'
  | 'system';

export interface AppNotification {
  id:       string;
  type:     NotificationType;
  titleKey: string;
  body:     string;
  time:     string;
  read:     boolean;
}
