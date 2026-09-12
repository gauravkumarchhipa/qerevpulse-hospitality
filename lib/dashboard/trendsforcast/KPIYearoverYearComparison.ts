import { ChartData } from "@/types";
// Trends & Forcast
// KPI Year-over-Year Comparison
export function getKPIYearOverYearComparison(): ChartData[] {
  return [
    { name: "Jan", current: 190000, previous: 173000 },
    { name: "Feb", current: 200000, previous: 181000 },
    { name: "Mar", current: 210000, previous: 191000 },
    { name: "Apr", current: 215000, previous: 195000 },
    { name: "May", current: 220000, previous: 200000 },
    { name: "Jun", current: 225000, previous: 205000 },
    { name: "Jul", current: 230000, previous: 210000 },
    { name: "Aug", current: 287979, previous: 406622 },
    { name: "Sep", current: 240000, previous: 220000 },
    { name: "Oct", current: 205000, previous: 190000 },
    { name: "Nov", current: 210000, previous: 195000 },
    { name: "Dec", current: 240000, previous: 220000 },
  ];
}



export function getKPIYearOverYearComparisonYTD(): ChartData[] {
  return [
    { name: "Jan", current: 190000, previous: 173000 },
    { name: "Feb", current: 200000, previous: 181000 },
    { name: "Mar", current: 210000, previous: 191000 },
    { name: "Apr", current: 215000, previous: 195000 },
    { name: "May", current: 220000, previous: 200000 },
    { name: "Jun", current: 225000, previous: 205000 },
    { name: "Jul", current: 230000, previous: 210000 },
    { name: "Aug", current: 4931044.03, previous: 4230328.73 },
    { name: "Sep", current: 240000, previous: 220000 },
    { name: "Oct", current: 205000, previous: 190000 },
    { name: "Nov", current: 210000, previous: 195000 },
    { name: "Dec", current: 240000, previous: 220000 },
  ];
}
