import type {
  DailyReport,
  AnalyticsData,
  AnalyticsSummary,
  DateRangePreset,
} from '@/types/analytics';
import rawData from '@/data/analytics/reports.json';

const ALL_REPORTS = rawData.dailyReports as DailyReport[];
const PRESET_DAYS: Record<DateRangePreset, number> = { '7d': 7, '14d': 14, '30d': 30 };

function sliceReports(preset: DateRangePreset): DailyReport[] {
  const n = PRESET_DAYS[preset];
  return ALL_REPORTS.slice(-n);
}

export async function getAnalyticsData(preset: DateRangePreset = '30d'): Promise<AnalyticsData> {
  return {
    dailyReports:      sliceReports(preset),
    categoryBreakdown: rawData.categoryBreakdown,
    peakHours:         rawData.peakHours,
    topDishes:         rawData.topDishes,
  };
}

export async function getAnalyticsSummary(preset: DateRangePreset = '30d'): Promise<AnalyticsSummary> {
  const reports = sliceReports(preset);
  const totalRevenue   = reports.reduce((s, r) => s + r.revenue, 0);
  const totalProfit    = reports.reduce((s, r) => s + r.profit, 0);
  const totalOrders    = reports.reduce((s, r) => s + r.orders, 0);
  const totalCustomers = reports.reduce((s, r) => s + r.customers, 0);
  return {
    totalRevenue,
    totalProfit,
    totalOrders,
    totalCustomers,
    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    profitMargin:  totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
  };
}

/** Legacy support */
export async function getReports(): Promise<DailyReport[]> {
  return ALL_REPORTS;
}

export async function getReportSummary() {
  return getAnalyticsSummary('30d');
}
