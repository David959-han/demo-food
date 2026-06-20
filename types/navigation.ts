export interface NavItem {
  key: string;
  labelKey: string;
  href: string;
  icon: string;
  badge?: number;
  requiredRoles?: string[];
}

export interface NavGroup {
  key: string;
  labelKey: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  labelKey: string;
  href?: string;
}
