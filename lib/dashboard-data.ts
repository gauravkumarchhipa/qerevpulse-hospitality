// // Sample data for the dashboard
// import {
//   KpiCard,
//   ChartData,
//   DepartmentData,
//   BarChartData,
//   ExpenseCategory,
//   WaterfallItem,
// } from "@/types";

// // Department Analysis
// // Department Analysis Card
// export function getKpiCards(): KpiCard[] {
//   return [
//     {
//       title: "Total Revenue",
//       value: "$2025712.73",
//       previousValue: "$1811575.69",
//       change: 11.82,
//       changeType: "increase",
//       prefix: "",
//       suffix: "",
//     },
//     {
//       title: "Gross Profit",
//       value: "$541,754.26",
//       previousValue: "$623,427.20",
//       change: -13.1,
//       changeType: "decrease",
//       prefix: "",
//       suffix: "",
//     },
//     {
//       title: "Net Profit",
//       value: "$287,979.01",
//       previousValue: "$406,621.80",
//       change: -29.2,
//       changeType: "decrease",
//       prefix: "",
//       suffix: "",
//     },
//     {
//       title: "Total Expenses",
//       value: "$10,48,590.29 ",
//       previousValue: "$9,30,972.46",
//       change: 12.63,
//       changeType: "increase",
//       prefix: "",
//       suffix: "",
//     },
//     {
//       title: "Profit Margin",
//       value: "26.74%",
//       previousValue: "34.41%",
//       change: -22.29,
//       changeType: "decrease",
//       prefix: "",
//       suffix: "%",
//     },
//   ];
// }

// // OverView
// // OverView Cards
// export function getKpiCards2(): KpiCard[] {
//   return [
//     {
//       title: "Occupancy %",
//       value: "74.88",
//       previousValue: "81.14",
//       change: -7.71,
//       changeType: "decrease",
//       prefix: "",
//       suffix: "%",
//     },
//     {
//       title: "ADR",
//       value: "219.66",
//       previousValue: "192.12",
//       change: 14.34,
//       changeType: "increase",
//       prefix: "$",
//       suffix: "",
//     },
//     {
//       title: "RevPAR",
//       value: "164.49",
//       previousValue: "155.89",
//       change: 5.52,
//       changeType: "increase",
//       prefix: "$",
//       suffix: "",
//     },
//     {
//       title: "Total Revenue",
//       value: "$2025712.73",
//       previousValue: "$1811575.69",
//       change: 11.82,
//       changeType: "increase",
//       prefix: "$",
//       suffix: "",
//     },
//     {
//       title: "F&B Revenue",
//       value: "370,422.28",
//       previousValue: "258,452.91",
//       change: 43.33,
//       changeType: "increase",
//       prefix: "$",
//       suffix: "",
//     },
//     {
//       title: "GOP",
//       value: "541,754.26",
//       previousValue: "623,427.20",
//       change: -13.1,
//       changeType: "decrease",
//       prefix: "$",
//       suffix: "",
//     },
//     {
//       title: "Payroll & Benefits",
//       value: "330,274.05",
//       previousValue: "268,555.55",
//       change: 22.98,
//       changeType: "increase",
//       prefix: "$",
//       suffix: "",
//     },
//     {
//       title: "NOP",
//       value: "287,979.01",
//       previousValue: "406,621.80",
//       change: -29.2,
//       changeType: "decrease",
//       prefix: "$",
//       suffix: "",
//     },
//   ];
// }

// // OverView
// // Profit Trend
// export function getYearlyTrendData(): ChartData[] {
//   return [
//     { name: "Jan", current: 190000, previous: 173000 },
//     { name: "Feb", current: 200000, previous: 181000 },
//     { name: "Mar", current: 210000, previous: 191000 },
//     { name: "Apr", current: 215000, previous: 195000 },
//     { name: "May", current: 220000, previous: 200000 },
//     { name: "Jun", current: 225000, previous: 205000 },
//     { name: "Jul", current: 230000, previous: 210000 },
//     { name: "Aug", current: 287979, previous: 406622 },
//     { name: "Sep", current: 240000, previous: 220000 },
//     { name: "Oct", current: 205000, previous: 190000 },
//     { name: "Nov", current: 210000, previous: 195000 },
//     { name: "Dec", current: 240000, previous: 220000 },
//   ];
// }

// // Department Analysis
// // Department Revenue Breakdown
// export function getDepartmentRevenueData(): DepartmentData[] {
//   return [
//     {
//       name: "Rooms",
//       value: 1621547.03,
//       color: "hsl(var(--chart-1))",
//     },
//     {
//       name: "Food & Beverage",
//       value: 370422.28,
//       color: "hsl(var(--chart-2))",
//     },
//     {
//       name: "Minor Operated Departments",
//       value: 20372.81,
//       color: "hsl(var(--chart-3))",
//     },
//     {
//       name: "Miscellaneous",
//       value: 13370.61,
//       color: "hsl(var(--chart-4))",
//     },
//   ];
// }

// // Department Analysis
// // KPI Department Comparison
// export function getDepartmentComparisonData(): BarChartData[] {
//   return [
//     { name: "Rooms", current: 1621547.03, previous: 1536753.11 },
//     { name: "Food & Beverage", current: 370422.28, previous: 258452.91 },
//     { name: "Minor Operated Departments", current: 20372.81, previous: 1698.2 },
//     { name: "Miscellaneous", current: 13370.6, previous: 14671.47 },
//   ];
// }

// // Department Analysis
// // KPI Year-over-Year Comparison
// export function getDepartmentComparisonData2(): BarChartData[] {
//   return [
//     { name: "Rooms", current: 1621547.03, previous: 1536753.11 },
//     { name: "Food & Beverage", current: 370422.28, previous: 258452.91 },
//     { name: "Minor Operated Departments", current: 20372.81, previous: 1698.2 },
//     { name: "Miscellaneous", current: 13370.6, previous: 14671.47 },
//   ];
// }

// // OverView
// // Expense Categories

// export function getExpenseCategories(): ExpenseCategory[] {
//   return [
//     {
//       name: "Total direct expenses",
//       value: 117882.5,
//       color: "hsl(var(--destructive))",
//       expense: [
//         { name: "F&B", value: 117882.5 },
//         { name: "Minor Operated Departments", value: 0 },
//       ],
//     },
//     {
//       name: "TOTAL PAYROLL & BENEFITS",
//       value: 330274.05,
//       color: "hsl(15, 100%, 70%)",
//       expense: [
//         { name: "F&B", value: 126721.96 },
//         { name: "Rooms", value: 203552.09 },
//       ],
//     },
//     {
//       name: "TOTAL OTHER EXPENSES",
//       value: 343604.71,
//       color: "hsl(var(--chart-3))",
//       expense: [
//         { name: "F&B", value: 28529.88 },
//         { name: "Rooms", value: 315074.83 },
//         { name: "Minor Operated Departments", value: 0 },
//       ],
//     },
//     {
//       name: "TOTAL OVERHEAD EXPENSES",
//       value: 692197.21,
//       color: "hsl(var(--chart-2))",
//       expense: [
//         { name: "PROPERTY OPERATION & MAINTENANCE", value: 136094.71 },
//         { name: "A&G", value: 173828.06 },
//         { name: "Information and Technology", value: 26696.33 },
//         { name: "S&M", value: 0 },
//         { name: "Utilities", value: 132222.92 },
//         { name: "Management Fees", value: 110570.61 },
//         { name: "Marketing Fees", value: 60096.51 },
//         { name: "Distribution Fees", value: 32430.94 },
//         { name: "Mark-Up Fees", value: 20257.13 },
//       ],
//     },
//     {
//       name: "Incentive Fees",
//       value: 27087.71,
//       color: "hsl(var(--chart-2))",
//     },
//     {
//       name: "DEPRECIATIONS",
//       value: 83035.7,
//       color: "hsl(var(--chart-2))",
//     },
//     {
//       name: "CORPORATE TAXES",
//       value: 625390.78,
//       color: "hsl(var(--chart-2))",
//     },
//     {
//       name: "NON-OPERATING INCOME AND EXPENSES",
//       value: 118261.06,
//       color: "hsl(var(--chart-2))",
//     },
//   ];
// }

// // export function getExpenseCategories(): ExpenseCategory[] {
// //   return [
// //     {
// //       name: "Total direct expenses",
// //       value: 117882.5,
// //       color: "hsl(var(--destructive))",
// //     },
// //     {
// //       name: "TOTAL PAYROLL & BENEFITS",
// //       value: 330274.05,
// //       color: "hsl(15, 100%, 70%)",
// //     },
// //     {
// //       name: "TOTAL OTHER EXPENSES",
// //       value: 343604.71,
// //       color: "hsl(var(--chart-3))",
// //     },
// //     {
// //       name: "TOTAL OVERHEAD EXPENSES",
// //       value: 692197.21,
// //       color: "hsl(var(--chart-2))",
// //     },
// //   ];
// // }

// // OverView
// // Profit and Loss Waterfall
// // Detailed
// export function getWaterfallDataDetailed(): WaterfallItem[] {
//   return [
//     { name: "Total Revenue", value: 2420000, isTotal: true },
//     { name: "Food Cost", value: -210000, isNegative: true },
//     { name: "Labor", value: -690000, isNegative: true },
//     { name: "Utilities", value: -130000, isNegative: true },
//     { name: "Maintenance", value: -85000, isNegative: true },
//     { name: "Marketing", value: -90000, isNegative: true },
//     { name: "Admin", value: -125000, isNegative: true },
//     { name: "Other", value: -79000, isNegative: true },
//     { name: "GOP", value: 1410000 },
//     { name: "Fixed Charges", value: -690000, isNegative: true },
//     { name: "Net Profit", value: 720000, isProfit: true },
//   ];
// }

// // OverView
// // Profit and Loss Waterfall
// // Simplified
// export function getWaterfallDataSimplified(): WaterfallItem[] {
//   return [
//     // { name: "Total Revenue", value: 2420000, isTotal: true },
//     // { name: "COGS", value: -210000, isNegative: true },
//     // { name: "Payroll", value: -690000, isNegative: true },
//     // { name: "Other Expenses", value: -610000, isNegative: true },
//     // { name: "GOP", value: 1410000 },
//     // { name: "Fixed Charges", value: -690000, isNegative: true },
//     // { name: "Net Profit", value: 720000, isProfit: true },
//     { name: "Total Revenue", value: 2025712.73, isTotal: true },
//     { name: "TOTAL DIRECT EXPENSES", value: 117882.5, isNegative: true },
//     { name: "Total Payroll & Benefits", value: 330274.05, isNegative: true },
//     { name: "TOTAL OTHER EXPENSES", value: 343604.71, isNegative: true },
//     { name: "TOTAL OVERHEAD EXPENSES", value: 692197.21 },
//     { name: "GOP", value: 541754.26, isNegative: true },
//     { name: "NOP", value: 287979.01, isProfit: true },
//   ];
// }

// // OverView
// // Profit Trend
// // table one
// export const profitTrendData = [
//   {
//     channel: "Booking.com",
//     roomNights: 3100,
//     adr: 215,
//     revenue: 666500,
//     occ: "85%",
//   },
//   {
//     channel: "Expedia",
//     roomNights: 1600,
//     adr: 210,
//     revenue: 336000,
//     occ: "80%",
//   },
//   { channel: "Agoda", roomNights: 900, adr: 195, revenue: 175500, occ: "70%" },
//   {
//     channel: "Corporate",
//     roomNights: 1100,
//     adr: 190,
//     revenue: 209000,
//     occ: "75%",
//   },
//   {
//     channel: "OTA Others",
//     roomNights: 700,
//     adr: 185,
//     revenue: 129500,
//     occ: "60%",
//   },
//   { channel: "Direct", roomNights: 700, adr: 265, revenue: 185500, occ: "85%" },
// ];

// // OverView
// // Expense Categories
// // table Two
// export const expenseCategoriesData = [
//   {
//     metric: "TOTAL DIRECT EXPENSES",
//     value: "$117882.5",
//     budget: "$85344.67",
//     lyValue: "$69716.39",
//     variance: "+$48K",
//     positive: false,
//   },
//   {
//     metric: "TOTAL PAYROLL & BENEFITS",
//     value: "$330274.05",
//     budget: "$322470.30",
//     lyValue: "$268555.55",
//     variance: "+$61K",
//     positive: false,
//   },
//   {
//     metric: "TOTAL OTHER EXPENSES",
//     value: "$343604.71",
//     budget: "$252622.76",
//     lyValue: "$250803.29",
//     variance: "+$92K",
//     positive: false,
//   },
//   {
//     metric: "TOTAL OVERHEAD EXPENSES",
//     value: "$692197.21",
//     budget: "$593330.32",
//     lyValue: "$599073.26",
//     variance: "+$93K",
//     positive: false,
//   },
// ];

// // OverView
// // AI-Generated Insights
// export const aiInsights = [
//   {
//     text: "Total revenue grew by 8.5% year-over-year, reaching $2.42M, primarily driven by a strong performance in Rooms and Food & Beverage.",
//   },
//   {
//     text: "Net profit increased to $720K, a 11.6% gain over the previous period, indicating effective cost control and higher operational efficiency.",
//   },
//   {
//     text: "Labor expenses held steady at $690K, representing 28.5% of total revenue — a marginal improvement over last year's 29.0% ratio.",
//   },
//   {
//     text: "Food & Beverage contributed $705K in revenue with a more controlled food cost of $210K, improving departmental profit margins.",
//   },
//   {
//     text: "Rooms department contributed over 70% of total revenue, showing consistent occupancy (81%) and stable ADR ($210), reinforcing its role as the primary growth engine.",
//   },
//   {
//     text: "Marketing and administrative spend remained within planned thresholds, supporting topline growth without overspending.",
//   },
//   {
//     text: "Month-over-month revenue trend shows consistent acceleration from Q1 to Q3, peaking in Aug–Sep before a planned taper in Q4.",
//   },
//   {
//     text: "All departments showed positive year-over-year growth, with Spa and Retail posting double-digit percentage gains from a small base.",
//   },
//   {
//     text: "Total expenses were well managed at $1.01M, allowing the gross operating profit to reach $1.41M, translating to a 58% GOP margin.",
//   },
//   {
//     text: "Maintain current pacing while monitoring Spa and Events for upsell opportunities, and evaluate Retail for margin expansion.",
//   },
// ];

// // OverView
// // Revenue vs Expenses (monthly)

// export const revenueVsExpensesMonthly = [
//   { name: "Jan", Revenue: 190000, Expenses: 81000, Profit: 109000 },
//   { name: "Feb", Revenue: 200000, Expenses: 87000, Profit: 113000 },
//   { name: "Mar", Revenue: 210000, Expenses: 92000, Profit: 118000 },
//   { name: "Apr", Revenue: 215000, Expenses: 98000, Profit: 117000 },
//   { name: "May", Revenue: 220000, Expenses: 99000, Profit: 121000 },
//   { name: "Jun", Revenue: 225000, Expenses: 102000, Profit: 123000 },
//   { name: "Jul", Revenue: 230000, Expenses: 104000, Profit: 126000 },
//   { name: "Aug", Revenue: 2025712.73, Expenses: 1048590.29, Profit: 287979.01 },
//   { name: "Sep", Revenue: 240000, Expenses: 109000, Profit: 131000 },
//   { name: "Oct", Revenue: 205000, Expenses: 88000, Profit: 117000 },
//   { name: "Nov", Revenue: 210000, Expenses: 90000, Profit: 120000 },
//   { name: "Dec", Revenue: 240000, Expenses: 102000, Profit: 138000 },
// ];

// // OverView
// // Revenue vs Expenses (quarterly)

// export const revenueVsExpensesQuarterly = [
//   { name: "Q1", Revenue: 600000, Expenses: 260000, Profit: 340000 },
//   { name: "Q2", Revenue: 660000, Expenses: 299000, Profit: 361000 },
//   { name: "Q3", Revenue: 705000, Expenses: 319000, Profit: 386000 },
//   { name: "Q4", Revenue: 455000, Expenses: 132000, Profit: 323000 },
// ];

// // OverView
// // Performance Variance
// // Vs Budget

// export const varianceDataBudget = [
//   { name: "OCC%", current: 74.88, target: 83.04, variance: -9.81 },
//   { name: "ADR", current: 219.66, target: 180, variance: 22.03 },
//   { name: "RevPAR", current: 164.49, target: 149, variance: 10.3 },
//   { name: "Revenue", current: 2025712.73, target: 1931219.11, variance: 4.89 },
//   { name: "GOP", current: 541754.26, target: 677451.06, variance: -20.03 },
//   { name: "NOP", current: 287979.01, target: 389930.08, variance: -26.14 },
// ];

// // OverView
// // Performance Variance
// // Last year

// export const varianceDataLastYear = [
//   { name: "OCC%", current: 74.88, target: 81.14, variance: -7.71 },
//   { name: "ADR", current: 219.66, target: 192.12, variance: 14.33 },
//   { name: "RevPAR", current: 164.49, target: 155.89, variance: 5.51 },
//   { name: "Revenue", current: 2025712.73, target: 1811575.69, variance: 11.8 },
//   { name: "GOP", current: 541754.26, target: 623427.2, variance: -13.1 },
//   { name: "NOP", current: 287979.01, target: 406621.8, variance: -29.17 },
// ];
