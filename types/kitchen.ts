export type KitchenOrderStatus = 'new' | 'preparing' | 'ready' | 'served';
export type KitchenPriority    = 'normal' | 'urgent' | 'vip';

export interface KitchenItem {
  name:     string;
  quantity: number;
}

export interface KitchenOrder {
  id:          string;
  tableNumber: number;
  items:       KitchenItem[];
  status:      KitchenOrderStatus;
  priority:    KitchenPriority;
  createdAt:   string;
  notes?:      string;
}

/** Shape stored in JSON — `minutesAgo` replaces `createdAt` */
export interface RawKitchenOrder extends Omit<KitchenOrder, 'createdAt'> {
  minutesAgo: number;
}
