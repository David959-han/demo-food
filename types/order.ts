import type { MenuItem } from './menu';

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'qr';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export interface Cart {
  items: CartItem[];
  tableId: number | null;
  discount: number;
  paymentMethod: PaymentMethod;
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface Order {
  id: number;
  tableId: number;
  tableNumber: number;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod | null;
  createdAt: string;
  updatedAt: string;
}
