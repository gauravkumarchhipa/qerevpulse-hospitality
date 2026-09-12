import { DepartmentData } from "@/types";
// Department Analysis
// Department Revenue Breakdown

export function getDepartmentRevenueData(): DepartmentData[] {
  return [
    {
      name: "Rooms",
      value: 1621547.03,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "Food & Beverage",
      value: 370422.28,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Minor Operated Departments",
      value: 20372.81,
      color: "hsl(var(--chart-3))",
    },
    {
      name: "Miscellaneous",
      value: 13370.61,
      color: "hsl(var(--chart-4))",
    },
  ];
}

  
export function getDepartmentRevenueDataYTD(): DepartmentData[] {
  return [
    {
      name: "Rooms",
      value: 16426461.57,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "Food & Beverage",
      value: 3439650.33,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Minor Operated Departments",
      value: 71183.15,
      color: "hsl(var(--chart-3))",
    },
    {
      name: "Miscellaneous",
      value: 107526.01,
      color: "hsl(var(--chart-4))",
    },
  ];
}
