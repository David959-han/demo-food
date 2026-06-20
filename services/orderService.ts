import type { Order, Cart } from '@/types';

const MOCK_ORDERS: Order[] = [];

export async function getOrders(): Promise<Order[]> {
  return MOCK_ORDERS;
}

export async function getOrderById(id: number): Promise<Order | null> {
  return MOCK_ORDERS.find((o) => o.id === id) ?? null;
}

export async function createOrder(cart: Cart): Promise<Order> {
  const now = new Date().toISOString();
  const newOrder: Order = {
    id: Date.now(),
    tableId: cart.tableId ?? 0,
    tableNumber: cart.tableId ?? 0,
    customerName: '',
    items: cart.items.map((ci) => ({
      menuItemId: ci.menuItem.id,
      name: ci.menuItem.name,
      quantity: ci.quantity,
      unitPrice: ci.menuItem.price,
      note: ci.note,
    })),
    status: 'pending',
    subtotal: cart.items.reduce(
      (sum, ci) => sum + ci.menuItem.price * ci.quantity,
      0,
    ),
    discount: cart.discount,
    total:
      cart.items.reduce(
        (sum, ci) => sum + ci.menuItem.price * ci.quantity,
        0,
      ) - cart.discount,
    paymentMethod: cart.paymentMethod,
    createdAt: now,
    updatedAt: now,
  };
  MOCK_ORDERS.push(newOrder);
  return newOrder;
}

export async function updateOrderStatus(
  id: number,
  status: Order['status'],
): Promise<Order | null> {
  const order = MOCK_ORDERS.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}
