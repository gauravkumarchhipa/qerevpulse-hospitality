// Types for the dashboard application

export interface FilterState {
  timeRange: string;
  startDate: Date | null;
  endDate: Date | null;
  departments: string[];
  compareWith: string;
  view : string;
  tooltip ? :string
}

export interface KpiCard {
  title: string;
  value: string | number;
  previousValue?: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon?: string;
  prefix?: string;
  suffix?: string;
  tooltip ? :string
  isAfter? : number
}

export interface ChartData {
  name: string;
  current: number;
  previous: number;
}

export interface DepartmentData {
  name: string;
  value: number;
  color: string;
}

export interface BarChartData {
  name: string;
  current: number;
  previous: number;
}

export interface InsightItem {
  text: string;
  type: 'info' | 'success' | 'warning';
}

export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  expense? :any
}

export interface WaterfallItem {
  name: string;
  value: number;
  isTotal?: boolean;
  isNegative?: boolean;
  isProfit?: boolean;
  children?: WaterfallItem[];
}