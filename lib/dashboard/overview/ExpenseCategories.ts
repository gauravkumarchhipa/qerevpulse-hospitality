import { ExpenseCategory } from "@/types";
// OverView
// Expense Categories

export function getExpenseCategories(): ExpenseCategory[] {
  return [
    {
      name: "Total direct expenses",
      value: 117882.50,
      color: "hsl(var(--destructive))",
      expense: [
        { name: "F&B", value: 117882.50 },
        { name: "Minor Operated Departments", value: 0 }
      ]
    },
    {
      name: "TOTAL PAYROLL & BENEFITS",
      value: 330274.05,
      color: "hsl(15, 100%, 70%)",
      expense: [
        { name: "F&B", value: 126721.96 },
        { name: "Rooms", value: 203552.09 }
      ]
    },
    {
      name: "TOTAL OTHER EXPENSES",
      value: 343604.71,
      color: "hsl(var(--chart-3))",
      expense: [
        { name: "F&B", value: 28529.88 },
        { name: "Rooms", value: 315074.83 },
        { name: "Minor Operated Departments", value: 0 }
      ]
    },
    {
      name: "TOTAL OVERHEAD EXPENSES",
      value: 692197.21,
      color: "hsl(var(--chart-2))",
      expense: [
        { name: "PROPERTY OPERATION & MAINTENANCE", value: 136094.71},
        { name: "A&G", value: 173828.06},
        { name: "Information and Technology", value: 26696.33 },
        { name: "S&M", value: 0 },
        { name: "Utilities", value: 132222.92 },
        { name: "Management Fees", value: 110570.61 },
        { name: "Marketing Fees", value: 60096.51 },
        { name: "Distribution Fees", value: 32430.94 },
        { name: "Mark-Up Fees", value: 20257.13 },
      ]
    },
    {
      name: "Incentive Fees",
      value: 27087.71,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "DEPRECIATIONS",
      value: 83035.70,
      color: "hsl(var(--chart-4))",
    },
    {
      name: "CORPORATE TAXES",
      value: 25390.78,
      color: "hsl(255, 50%, 70%)",
    },
    {
      name: "NON-OPERATING INCOME AND EXPENSES",
      value: 118261.06,
      color: "hsl(105, 50%, 50%)",
    },
  ];
}



export function getExpenseCategoriesYTD(): ExpenseCategory[] {
  return [
    {
      name: "Total direct expenses",
      value: 1027044.03,
      color: "hsl(var(--destructive))",
      expense: [
        { name: "F&B", value: 1027044.03 },
        { name: "Minor Operated Departments", value: 0 }
      ]
    },
    {
      name: "TOTAL PAYROLL & BENEFITS",
      value: 2690024.32,
      color: "hsl(15, 100%, 70%)",
      expense: [
        { name: "F&B", value: 1134575.09 },
        { name: "Rooms", value: 1555449.23 }
      ]
    },
    {
      name: "TOTAL OTHER EXPENSES",
      value: 3197260.59,
      color: "hsl(var(--chart-3))",
      expense: [
        { name: "F&B", value: 178277.46 },
        { name: "Rooms", value: 3018983.13 },
        { name: "Minor Operated Departments", value: 0 }
      ]
    },
    {
      name: "TOTAL OVERHEAD EXPENSES",
      value: 5650701.32,
      color: "hsl(var(--chart-2))",
      expense: [
        { name: "PROPERTY OPERATION & MAINTENANCE", value: 791604.64},
        { name: "A&G", value: 1566703.11},
        { name: "Information and Technology", value: 253824.40 },
        { name: "S&M", value: 6608.58 },
        { name: "Utilities", value: 820432.41 },
        { name: "Management Fees", value: 1097997.43 },
        { name: "Marketing Fees", value: 597770.46 },
        { name: "Distribution Fees", value: 328529.23 },
        { name: "Mark-Up Fees", value: 200448.22 },
      ]
    },
    {
      name: "Incentive Fees",
      value: 437683.1,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "DEPRECIATIONS",
      value: 689797.43,
      color: "hsl(var(--chart-4))",
    },
    {
      name: "CORPORATE TAXES",
      value: 484595.01,
      color: "hsl(255, 50%, 70%)",
    },
    {
      name: "NON-OPERATING INCOME AND EXPENSES",
      value: 936671.1,
      color: "hsl(105, 50%, 50%)",
    },
  ];
}