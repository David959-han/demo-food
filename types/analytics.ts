export type DateRangePreset = '7d' | '14d' | '30d';

export interface DailyReport {
  id:        number;
  date:      string;
  orders:    number;
  revenue:   number;
  profit:    number;
  customers: number;
}

export interface CategoryStat {
  key:     string;
  orders:  number;
  revenue: number;
}

export interface PeakHour {
  hour:   number;
  orders: number;
}

export interface TopDish {
  rank:    number;
  name:    string;
  orders:  number;
  revenue: number;
}

export interface AnalyticsData {
  dailyReports:      DailyReport[];
  categoryBreakdown: CategoryStat[];
  peakHours:         PeakHour[];
  topDishes:         TopDish[];
}

export interface AnalyticsSummary {
  totalRevenue:  number;
  totalProfit:   number;
  totalOrders:   number;
  totalCustomers: number;
  avgOrderValue: number;
  profitMargin:  number;
}

/** Legacy — kept for backward compatibility */
export interface DateRange {
  from:   string;
  to:     string;
  preset: DateRangePreset;
}

/** Legacy */
export interface Report {
  id:       number;
  date:     string;
  orders:   number;
  revenue:  number;
  profit:   number;
  customers?: number;
}
