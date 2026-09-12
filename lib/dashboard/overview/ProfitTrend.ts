import { ChartData } from "@/types";
// OverView
// Profit Trend

export function getYearlyTrendData(): ChartData[] {
  return [
    { name: "Jan", current: 280000, previous: 390000 },
    { name: "Feb", current: 275000, previous: 400000 },
    { name: "Mar", current: 290000, previous: 395000 },
    { name: "Apr", current: 295000, previous: 405000 },
    { name: "May", current: 300000, previous: 415000 },
    { name: "Jun", current: 285000, previous: 408000 },
    { name: "Jul", current: 295000, previous: 412000 },
    { name: "Aug", current: 287979, previous: 406622 }, // Real data
    { name: "Sep", current: 290000, previous: 408000 },
    { name: "Oct", current: 278000, previous: 402000 },
    { name: "Nov", current: 283000, previous: 397000 },
    { name: "Dec", current: 288000, previous: 404000 },
  ];
}

export function getYearlyTrendDataYTD(): ChartData[] {
  return [
    { name: "Jan", current: 4780000, previous: 4100000 },
    { name: "Feb", current: 4850000, previous: 4180000 },
    { name: "Mar", current: 4950000, previous: 4280000 },
    { name: "Apr", current: 5050000, previous: 4320000 },
    { name: "May", current: 5100000, previous: 4350000 },
    { name: "Jun", current: 4980000, previous: 4260000 },
    { name: "Jul", current: 4870000, previous: 4200000 },
    { name: "Aug", current: 4931044.03, previous: 4230328.73 }, // Real data
    { name: "Sep", current: 4900000, previous: 4210000 },
    { name: "Oct", current: 4840000, previous: 4180000 },
    { name: "Nov", current: 4750000, previous: 4120000 },
    { name: "Dec", current: 4800000, previous: 4150000 },
  ];
}
