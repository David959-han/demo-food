import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DemoUser } from '@/types';
import type { Cart, CartItem } from '@/types/order';
import type { MenuItem } from '@/types/menu';
import type { TableStatus } from '@/types/table';
import type { KitchenOrder, KitchenOrderStatus } from '@/types/kitchen';
import type { DeliveryOrder, DeliveryStatus } from '@/types/delivery';
import type { AppNotification } from '@/types/notification';

const EMPTY_CART: Cart = {
  items:         [],
  tableId:       null,
  discount:      0,
  paymentMethod: 'cash',
};

interface RestaurantState {
  // ── Layout ────────────────────────────────────────────────────────────────
  sidebarCollapsed:    boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  theme:       'dark' | 'light';
  toggleTheme: () => void;

  // ── Auth ──────────────────────────────────────────────────────────────────
  currentUser:     DemoUser | null;
  isAuthenticated: boolean;
  setCurrentUser:  (user: DemoUser | null) => void;
  logout:          () => void;

  // ── Cart ──────────────────────────────────────────────────────────────────
  cart:            Cart;
  addToCart:       (item: MenuItem)              => void;
  removeFromCart:  (itemId: number)              => void;
  updateQuantity:  (itemId: number, qty: number) => void;
  clearCart:       ()                            => void;
  setCartTable:    (tableId: number | null)      => void;

  // ── Tables ────────────────────────────────────────────────────────────────
  tableStatuses:    Record<number, TableStatus>;
  setTableStatus:   (id: number, status: TableStatus) => void;

  // ── Kitchen ───────────────────────────────────────────────────────────────
  kitchenOrders:         KitchenOrder[];
  setKitchenOrders:      (orders: KitchenOrder[]) => void;
  setKitchenOrderStatus: (id: string, status: KitchenOrderStatus) => void;

  // ── Delivery ──────────────────────────────────────────────────────────────
  deliveryOrders:          DeliveryOrder[];
  setDeliveryOrders:       (orders: DeliveryOrder[]) => void;
  setDeliveryOrderStatus:  (id: string, status: DeliveryStatus) => void;

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications:           AppNotification[];
  setNotifications:        (n: AppNotification[]) => void;
  markNotificationRead:    (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications:      () => void;

  // Selectors (computed from current state, not persisted)
  getCartTotal:        () => number;
  getCartItemsCount:   () => number;
  getUnreadCount:      () => number;
}

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      // ── Layout ────────────────────────────────────────────────────────────
      sidebarCollapsed:    false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      theme:       'dark',
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // ── Auth ──────────────────────────────────────────────────────────────
      currentUser:     null,
      isAuthenticated: false,
      setCurrentUser:  (user) =>
        set({ currentUser: user, isAuthenticated: user !== null }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),

      // ── Cart ──────────────────────────────────────────────────────────────
      cart: { ...EMPTY_CART },

      addToCart: (item: MenuItem) =>
        set((state) => {
          const existing = state.cart.items.find(
            (ci) => ci.menuItem.id === item.id,
          );
          const items: CartItem[] = existing
            ? state.cart.items.map((ci) =>
                ci.menuItem.id === item.id
                  ? { ...ci, quantity: ci.quantity + 1 }
                  : ci,
              )
            : [...state.cart.items, { menuItem: item, quantity: 1 }];
          return { cart: { ...state.cart, items } };
        }),

      removeFromCart: (itemId: number) =>
        set((state) => ({
          cart: {
            ...state.cart,
            items: state.cart.items.filter((ci) => ci.menuItem.id !== itemId),
          },
        })),

      updateQuantity: (itemId: number, qty: number) =>
        set((state) => {
          const items =
            qty <= 0
              ? state.cart.items.filter((ci) => ci.menuItem.id !== itemId)
              : state.cart.items.map((ci) =>
                  ci.menuItem.id === itemId ? { ...ci, quantity: qty } : ci,
                );
          return { cart: { ...state.cart, items } };
        }),

      clearCart: () => set({ cart: { ...EMPTY_CART } }),

      setCartTable: (tableId) =>
        set((state) => ({ cart: { ...state.cart, tableId } })),

      // ── Tables ──────────────────────────────────────────────────────────────
      tableStatuses: {},
      setTableStatus: (id, status) =>
        set((state) => ({
          tableStatuses: { ...state.tableStatuses, [id]: status },
        })),

      // ── Kitchen ─────────────────────────────────────────────────────────────
      kitchenOrders:    [],
      setKitchenOrders: (orders) => set({ kitchenOrders: orders }),
      setKitchenOrderStatus: (id, status) =>
        set((state) => ({
          kitchenOrders: state.kitchenOrders.map((o) =>
            o.id === id ? { ...o, status } : o,
          ),
        })),

      // ── Delivery ────────────────────────────────────────────────────────────
      deliveryOrders:   [],
      setDeliveryOrders: (orders) => set({ deliveryOrders: orders }),
      setDeliveryOrderStatus: (id, status) =>
        set((state) => ({
          deliveryOrders: state.deliveryOrders.map((o) =>
            o.id === id ? { ...o, status } : o,
          ),
        })),

      // ── Notifications ───────────────────────────────────────────────────────
      notifications: [],
      setNotifications: (n) => set({ notifications: n }),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // ── Selectors ─────────────────────────────────────────────────────────
      getCartTotal: () => {
        const { cart } = get();
        const subtotal = cart.items.reduce(
          (sum, ci) => sum + ci.menuItem.price * ci.quantity,
          0,
        );
        return Math.max(0, subtotal - cart.discount);
      },

      getCartItemsCount: () => {
        const { cart } = get();
        return cart.items.reduce((sum, ci) => sum + ci.quantity, 0);
      },

      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'restaurant-store',
      partialize: (state) => ({
        currentUser:      state.currentUser,
        isAuthenticated:  state.isAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed,
        theme:            state.theme,
        cart:             state.cart,
        tableStatuses:    state.tableStatuses,
        notifications:    state.notifications,
      }),
    },
  ),
);
