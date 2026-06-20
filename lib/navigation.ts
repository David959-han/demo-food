import {
  Home,
  ShoppingCart,
  Grid2x2,
  ChefHat,
  Truck,
  UtensilsCrossed,
  Package,
  ShoppingBag,
  Users,
  Heart,
  BarChart2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TranslationKey } from '@/types/i18n';
import type { PermissionKey, UserRole } from '@/types/auth';
import { ROLE_PERMISSIONS } from '@/types/auth';

export interface NavItem {
  key:        string;
  labelKey:   TranslationKey;
  href:       string;
  Icon:       LucideIcon;
  permission: PermissionKey;
}

export interface NavGroup {
  key:      string;
  labelKey: TranslationKey;
  items:    NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key:      'operations',
    labelKey: 'nav.groups.operations',
    items: [
      { key: 'dashboard', labelKey: 'nav.dashboard', href: '/',         Icon: Home,            permission: 'view:dashboard' },
      { key: 'pos',       labelKey: 'nav.pos',       href: '/pos',      Icon: ShoppingCart,    permission: 'view:pos'       },
      { key: 'tables',    labelKey: 'nav.tables',    href: '/tables',   Icon: Grid2x2,         permission: 'view:tables'    },
      { key: 'kitchen',   labelKey: 'nav.kitchen',   href: '/kitchen',  Icon: ChefHat,         permission: 'view:kitchen'   },
      { key: 'delivery',  labelKey: 'nav.delivery',  href: '/delivery', Icon: Truck,           permission: 'view:delivery'  },
    ],
  },
  {
    key:      'management',
    labelKey: 'nav.groups.management',
    items: [
      { key: 'menu',      labelKey: 'nav.menu',      href: '/menu',      Icon: UtensilsCrossed, permission: 'view:menu'      },
      { key: 'inventory', labelKey: 'nav.inventory', href: '/inventory', Icon: Package,         permission: 'view:inventory' },
      { key: 'purchases', labelKey: 'nav.purchases', href: '/purchases', Icon: ShoppingBag,     permission: 'view:purchases' },
      { key: 'employees', labelKey: 'nav.employees', href: '/employees', Icon: Users,           permission: 'view:employees' },
      { key: 'loyalty',   labelKey: 'nav.loyalty',   href: '/loyalty',   Icon: Heart,           permission: 'view:loyalty'   },
    ],
  },
  {
    key:      'analytics',
    labelKey: 'nav.groups.analytics',
    items: [
      { key: 'analytics', labelKey: 'nav.reports', href: '/analytics', Icon: BarChart2, permission: 'view:analytics' },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export function isRouteActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes('*') || perms.includes(permission);
}

export function filterNavGroups(role: UserRole): NavGroup[] {
  return NAV_GROUPS
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(role, item.permission)),
    }))
    .filter((group) => group.items.length > 0);
}

/** First allowed page href for a given role */
export function getDefaultHref(role: UserRole): string {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (hasPermission(role, item.permission)) return item.href;
    }
  }
  return '/login';
}
