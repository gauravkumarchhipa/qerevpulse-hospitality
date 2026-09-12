import { WaterfallItem } from "@/types";

// OverView
// Profit and Loss Waterfall
export function getWaterfallDataDetailed(): WaterfallItem[] {
  return [
    {
      name: "Total Revenue",
      value: 2025712.73,
      isTotal: true,
      children: [
        { name: "Rooms", value: 1621547.03 },
        { name: "F&B", value: 370422.28 },
        { name: "Minor Operated Departments", value: 20372.81 },
        { name: "Miscellaneous Income", value: 13370.61 }
      ],
    },
    {
      name: "TOTAL DIRECT EXPENSES",
      value: 117882.50,
      isNegative: false,
      children: [
        { name: "F&B", value: 117882.50 },
        { name: "Minor Operated Departments", value: 0 }
      ],
    },
    {
      name: "TOTAL PAYROLL & BENEFITS",
      value: 330274.05,
      isNegative: false,
      children: [
        { name: "F&B", value: 126721.96 },
        { name: "Rooms", value: 203552.09 },
        
      ],
    },
    { name: "TOTAL OTHER EXPENSES", value: 343604.71, isNegative: false,
      children: [
        { name: "F&B", value: 315074.83},
        { name: "Rooms", value: 28529.88 },
        { name: "Minor Operated Departments", value: 0 }
      ],},
    { name: "TOTAL OVERHEAD EXPENSES", value: 692197.21, isNegative: false,
        children: [
            { name: "PROPERTY OPERATION & MAINTENANCE", value: 136094.71 },
            { name: "A&G", value: 173828.06 },
            { name: "INFORMATION & TECHNOLOGY", value: 26696.33 },
            { name: "S&M", value: 0 },
            { name: "UTILITIES", value: 132222.92 },
            { name: "MANAGEMENT FEES", value: 110570.61 },
            { name: "MARKETING FEES", value: 60096.51 },
            { name: "DISTRIBUTION FEES", value: 32430.94 },
            { name: "MARK-UP FEES", value: 20257.13 }
        ], },
    { name: "GOP", value: 541754.26 },
    { name: "NOP", value: 287979.01, isProfit: true },
  ];
}

export function getWaterfallDataDetailedYTD(): WaterfallItem[] {
  return [
    {
      name: "Total Revenue",
      value: 20044821.06,
      isTotal: true,
      children: [
        { name: "Rooms", value: 16426461.57 },
        { name: "F&B", value: 3439650.33 },
        { name: "Minor Operated Departments", value: 71183.15 },
        { name: "Miscellaneous Income", value: 107526.01 }
      ],
    },
    {
      name: "TOTAL DIRECT EXPENSES",
      value: 1027044.03,
      isNegative: false,
      children: [
        { name: "F&B", value: 1027044.03 },
        { name: "Minor Operated Departments", value: 0 }
      ],
    },
    {
      name: "TOTAL PAYROLL & BENEFITS",
      value: 2690024.32,
      isNegative: false,
      children: [
        { name: "F&B", value: 1134575.09 },
        { name: "Rooms", value: 3018983.13 },
        
      ],
    },
    { name: "TOTAL OTHER EXPENSES", value: 3197260.59, isNegative: false,
      children: [
        { name: "F&B", value: 178277.46 },
        { name: "Rooms", value: 1555449.23 },
        { name: "Minor Operated Departments", value: 0 }
      ],},
    { name: "TOTAL OVERHEAD EXPENSES", value: 5650701.32, isNegative: false,
        children: [
            { name: "PROPERTY OPERATION & MAINTENANCE", value: 791604.64 },
            { name: "A&G", value: 1566703.11 },
            { name: "INFORMATION & TECHNOLOGY", value: 253824.40 },
            { name: "S&M", value: 6608.58 },
            { name: "UTILITIES", value: 820432.41 },
            { name: "MANAGEMENT FEES", value: 1097997.43 },
            { name: "MARKETING FEES", value: 597770.46 },
            { name: "DISTRIBUTION FEES", value: 328529.23 },
            { name: "MARK-UP FEES", value: 200448.22 }
        ], },
    { name: "GOP", value: 7479790.80 },
    { name: "NOP", value: 4931044.03, isProfit: true },
  ];
}
