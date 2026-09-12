import { BarChartData } from "@/types";
// Department Analysis
// KPI Year-over-Year Comparison
export function getDepartmentComparisonData2(): BarChartData[] {
  return [
    { name: "Rooms", current: 1621547.03, previous: 1536753.11 },
    { name: "Food & Beverage", current: 370422.28, previous: 258452.91 },
    { name: "Minor Operated Departments", current: 20372.81, previous: 1698.2 },
    { name: "Miscellaneous", current: 13370.6, previous: 14671.47 },
  ];
}
export function getDepartmentComparisonDataYTD2(): BarChartData[] {
  return [
    { name: "Rooms", current: 16426461.57, previous: 13166670.81 },
    { name: "Food & Beverage", current: 3439650.33, previous: 2471398.13 },
    { name: "Minor Operated Departments", current: 71183.15, previous: 14927.49 },
    { name: "Miscellaneous", current: 107526.01, previous: 132123.21 },
  ];
}
