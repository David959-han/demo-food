export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  POS: '/pos',
  MENU: '/menu',
  TABLES: '/tables',
  KITCHEN: '/kitchen',
  DELIVERY: '/delivery',
  LOYALTY: '/loyalty',
  INVENTORY: '/inventory',
  PURCHASES: '/purchases',
  EMPLOYEES: '/employees',
  ANALYTICS: '/analytics',
  LOGIN: '/login',
} as const;

export const ANIMATION = {
  DURATION_FAST: 150,
  DURATION_DEFAULT: 200,
  DURATION_SLOW: 300,
  DURATION_PAGE: 400,
  EASE_DEFAULT: [0.4, 0, 0.2, 1] as const,
  EASE_IN: [0.4, 0, 1, 1] as const,
  EASE_OUT: [0, 0, 0.2, 1] as const,
  EASE_SPRING: { type: 'spring', stiffness: 300, damping: 30 } as const,
} as const;

export const BREAKPOINTS = {
  XS: 480,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const SIDEBAR = {
  WIDTH_EXPANDED: 256,
  WIDTH_COLLAPSED: 72,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const,
} as const;

export const TABLE_STATUS = {
  FREE: 'Free',
  OCCUPIED: 'Occupied',
  RESERVED: 'Reserved',
  CLEANING: 'Cleaning',
} as const;

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PREPARING: 'Preparing',
  READY: 'Ready',
  SERVED: 'Served',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export const DELIVERY_STATUS = {
  ASSIGNED: 'Assigned',
  ON_THE_WAY: 'On The Way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
} as const;

export const LOYALTY_TIER = {
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
} as const;

export const LOYALTY_TIER_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 500,
  GOLD: 1000,
  PLATINUM: 2500,
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  WAITER: 'waiter',
  KITCHEN: 'kitchen',
} as const;

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
} as const;
