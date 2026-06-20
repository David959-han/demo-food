import rawData from '@/data/dashboardData.json';
import type {
  DashboardData,
  DashboardKpi,
  RevenueChartData,
  RecentOrder,
  PopularMenuItem,
} from '@/types/dashboard';

const data = rawData as unknown as DashboardData;

export async function getDashboardData(): Promise<DashboardData> {
  return data;
}

export async function getKpis(): Promise<DashboardKpi[]> {
  return data.kpis;
}

export async function getRevenueChartData(): Promise<RevenueChartData> {
  return data.revenueChart;
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  return data.recentOrders;
}

export async function getPopularItems(): Promise<PopularMenuItem[]> {
  return data.popularMenu;
}
