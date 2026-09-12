export const discountByHotelData = [
  {
    year: "2022",
    "Delta Hotels": 22.5,
    "Hilton Jumeirah": 22.3,
    "Hilton The Walk": 21.5,
    "Merriott Hotel & Spa": 23.1,
    "Taj Exotica Resort & Spa": 22.0,
  },
  {
    year: "2023",
    "Delta Hotels": 21.5,
    "Hilton Jumeirah": 21.4,
    "Hilton The Walk": 22.7,
    "Merriott Hotel & Spa": 22.8,
    "Taj Exotica Resort & Spa": 21.3,
  },
  {
    year: "2024",
    "Delta Hotels": 22.1,
    "Hilton Jumeirah": 21.9,
    "Hilton The Walk": 22.0,
    "Merriott Hotel & Spa": 22.2,
    "Taj Exotica Resort & Spa": 21.8,
  },
];

export function getRevenueByCategory() {
  return [
    { name: "Room", value: 1000000, color: "#f1c40f" }, // yellow
    { name: "Event and Banqueting", value: 1000000, color: "#1f66ff" }, // blue
    { name: "Food & Beverage", value: 560000, color: "#c2185b" }, // red-pink
    { name: "Operational Efficiency", value: 322000, color: "#455a64" }, // slate
    { name: "Spa and Wellness", value: 233000, color: "#d4a05a" }, // gold
    { name: "Ancillary Revenue", value: 180000, color: "#2ecc71" }, // green
  ];
}

export function getCategoryBreakdownData() {
  return [
    {
      name: "Merriott Hotel & Spa",
      actual: 890000,
      budget: 560000,
      lastYear: 570000,
      profit: 570000,
    },
    {
      name: "Delta Hotels",
      actual: 880000,
      budget: 560000,
      lastYear: 570000,
      profit: 570000,
    },
    {
      name: "Taj Exotica Resort & Spa",
      actual: 890000,
      budget: 560000,
      lastYear: 570000,
      profit: 570000,
    },
    {
      name: "Hilton The Walk",
      actual: 560000,
      budget: 560000,
      lastYear: 310000,
      profit: 310000,
    },
    {
      name: "Hilton Jumeirah",
      actual: 560000,
      budget: 560000,
      lastYear: 310000,
      profit: 310000,
    },
  ];
}

export const yearOverYearRevenueData = [
  {
    year: "2022",
    Expense: 5000000,
    Budget: 6000000,
    "Room Revenue": 3000000,
  },
  {
    year: "2023",
    Expense: 10000000,
    Budget: 6000000,
    "Room Revenue": 3200000,
  },
  {
    year: "2024",
    Expense: 4000000,
    Budget: 6000000,
    "Room Revenue": 3500000,
  },
  {
    year: "2025",
    Expense: 25000000,
    Budget: 30000000,
    "Room Revenue": 5000000,
  },
];

export function getActualVsBudgetData() {
  return [
    {
      name: "Merriott Hotel & Spa",
      actual: 900000,
      budget: 550000,
      lastYear: 560000,
      profit: 560000,
    },
    {
      name: "Delta Hotels",
      actual: 900000,
      budget: 550000,
      lastYear: 560000,
      profit: 560000,
    },
    {
      name: "Taj Exotica Resort & Spa",
      actual: 900000,
      budget: 550000,
      lastYear: 560000,
      profit: 560000,
    },
    {
      name: "Hilton The Walk",
      actual: 560000,
      budget: 560000,
      lastYear: 300000,
      profit: 300000,
    },
    {
      name: "Hilton Jumeirah",
      actual: 550000,
      budget: 550000,
      lastYear: 300000,
      profit: 300000,
    },
  ];
}

export function getCategoryBreakDown() {
  return [
    {
      name: "Operational Efficiency",
      actual: 550000, // Expense
      lastYear: 300000, // Revenue
      budget: 200000,
    },
    {
      name: "Room",
      actual: 300000,
      lastYear: 1100000,
      budget: 900000,
    },
    {
      name: "Event and Banqueting",
      actual: 300000,
      lastYear: 1080000,
      budget: 870000,
    },
    {
      name: "Food & Beverage",
      actual: 300000,
      lastYear: 600000,
      budget: 500000,
    },
    {
      name: "Ancillary Revenue",
      actual: 0,
      lastYear: 200000,
      budget: 100000,
    },
    {
      name: "Spa and Wellness",
      actual: 0,
      lastYear: 250000,
      budget: 170000,
    },
  ];
}

// data.ts

// export const revenueTreeData = {
//   name: "Revenue",
//   value: 3638697,
//   color: "#1E90FF",
//   children: [
//     {
//       name: "Merriott Hotel & Spa",
//       value: 858246,
//       color: "#8B0000",
//       children: [
//         {
//           name: "Banquet",
//           value: 132808,
//           color: "#8B0000",
//           children: [
//             { name: "Banquet", value: 132808, color: "#8B0000" },
//             { name: "Special Event", value: 123361, color: "#8B0000" },
//             { name: "Suite", value: 71020, color: "#8B0000" },
//           ],
//         },
//         { name: "Special Event", value: 123361, color: "#8B0000" },
//         { name: "Suite", value: 71020, color: "#8B0000" },
//       ],
//     },
//     {
//       name: "Delta Hotels",
//       value: 856690,
//       color: "#8B0000",
//       children: [
//         { name: "Banquet", value: 132808, color: "#8B0000" },
//         { name: "Special Event", value: 123361, color: "#8B0000" },
//         { name: "Suite", value: 71020, color: "#8B0000" },
//       ],
//     },
//     {
//       name: "Taj Exotica Resort & Spa",
//       value: 855383,
//       color: "#8B0000",
//       children: [
//         { name: "Banquet", value: 132808, color: "#8B0000" },
//         { name: "Special Event", value: 123361, color: "#8B0000" },
//         { name: "Suite", value: 71020, color: "#8B0000" },
//       ],
//     },
//   ],
// };

export const children = [
  {
    name: "Banquet",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Bar and Lounge",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Beverage Cost",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Body Treatments",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Deluxe",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Detox Package",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Dry Cleaning",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Energy Cost",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Executive",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Facials",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Food Cost",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Labor Cost",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Laundry",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Massage",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Minibar",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Restaurant",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Room Service Restaurant",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Special Event",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Standard",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Suite",
    value: 132808,
    color: "#8B0000",
  },
  {
    name: "Yoga Retreat",
    value: 132808,
    color: "#8B0000",
  },
];

export const childrenParent = [
  {
    name: "Ancillary Revenue",
    value: 132808,
    color: "#8B0000",
    children: children,
  },
  {
    name: "Event and Banqueting",
    value: 132808,
    color: "#8B0000",
    children: children,
  },
  {
    name: "Food & Beverage",
    value: 132808,
    color: "#8B0000",
    children: children,
  },
  {
    name: "Operational Efficiency",
    value: 132808,
    color: "#8B0000",
    children: children,
  },
  {
    name: "Room",
    value: 132808,
    color: "#8B0000",
    children: children,
  },
  {
    name: "Spa and Wellness",
    value: 132808,
    color: "#8B0000",
    children: children,
  },
];

export const revenueTreeData = {
  name: "Revenue",
  value: 3638697,
  color: "#1E90FF",
  children: [
    {
      name: "Hilton Jumeirah",
      value: 858246,
      color: "#8B0000",
      children: childrenParent,
    },
    {
      name: "Hilton The Walk",
      value: 856690,
      color: "#8B0000",
      children: childrenParent,
    },
    {
      name: "Taj Exotica Resort & Spa",
      value: 855383,
      color: "#8B0000",
      children: childrenParent,
    },
    {
      name: "Merriott Hotel & Spa",
      value: 855383,
      color: "#8B0000",
      children: childrenParent,
    },
    {
      name: "Delta Hotels",
      value: 855383,
      color: "#8B0000",
      children: childrenParent,
    },
  ],
};
