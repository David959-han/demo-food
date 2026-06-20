// ── Core types ─────────────────────────────────────────────────────────────

export type UserRole =
  | 'admin'
  | 'manager'
  | 'cashier'
  | 'waiter'
  | 'kitchen';

export type PermissionKey =
  | 'view:dashboard'
  | 'view:pos'
  | 'view:tables'
  | 'view:kitchen'
  | 'view:delivery'
  | 'view:menu'
  | 'view:inventory'
  | 'view:purchases'
  | 'view:employees'
  | 'view:loyalty'
  | 'view:analytics'
  | 'edit:orders'
  | 'edit:menu'
  | 'edit:tables'
  | 'edit:kitchen'
  | 'edit:inventory'
  | 'edit:employees'
  | 'edit:purchases'
  | 'edit:loyalty';

export type Permission = PermissionKey | '*';

export interface DemoUser {
  id:     number;
  name:   string;
  role:   UserRole;
  title:  string;
  avatar: string;
  email:  string;
}

export interface AuthState {
  user:            DemoUser | null;
  isAuthenticated: boolean;
}

// ── Permission map ─────────────────────────────────────────────────────────
// Structure is defined here; enforcement is handled at the feature level.

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['*'],
  manager: [
    'view:dashboard', 'view:pos', 'view:tables', 'view:kitchen',
    'view:delivery', 'view:menu', 'view:inventory', 'view:purchases',
    'view:employees', 'view:loyalty', 'view:analytics',
    'edit:orders', 'edit:menu', 'edit:tables', 'edit:inventory',
    'edit:purchases', 'edit:loyalty',
  ],
  cashier: [
    'view:dashboard', 'view:pos', 'view:tables',
    'edit:orders',
  ],
  waiter: [
    'view:pos', 'view:tables', 'view:kitchen',
    'edit:orders', 'edit:tables',
  ],
  kitchen: [
    'view:kitchen',
    'edit:kitchen',
  ],
};

// ── Role display metadata ──────────────────────────────────────────────────
// Badge color variant per role — mirrors BadgeVariant without importing the
// component type directly at the module level.

export const ROLE_VARIANT: Record<UserRole, 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand'> = {
  admin:   'brand',
  manager: 'info',
  cashier: 'success',
  waiter:  'warning',
  kitchen: 'neutral',
};
