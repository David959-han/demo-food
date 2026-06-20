import type { StatCardTrend, StatCardVariant } from '@/components/ui/StatCard';

export interface DashboardKpi {
  key:     string;
  value:   number | string;
  delta:   string;
  trend:   StatCardTrend;
  variant: StatCardVariant;
}

export interface RevenueChartData {
  labels: string[];
  data:   number[];
}

export interface RecentOrder {
  id:       number;
  table:    number;
  customer: string;
  total:    string;
  status:   string;
}

export interface PopularMenuItem {
  rank:    number;
  name:    string;
  orders:  number;
  revenue: string;
}

export interface DashboardData {
  kpis:         DashboardKpi[];
  revenueChart: RevenueChartData;
  recentOrders: RecentOrder[];
  popularMenu:  PopularMenuItem[];
}
