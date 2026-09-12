// Department Analysis
// Department Analysis Card
import { KpiCard } from "@/types";
export function getKpiCards(): KpiCard[] {
  return [
    {
      title: "Total Revenue",
      value: "2,025,712.73",
      previousValue: "1,811,575.69",
      change: 11.82,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "Total direct revenue for August 2024 stood at Dhs. 2.03K, reflecting an increase of Dhs. 214.14K over last year and Dhs. 94.49K above budgeted expectations.",
    },
    {
      title: "Gross Profit",
      value: "541,754.26",
      previousValue: "623,427.20",
      change: -13.1,
      changeType: "decrease",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "GOP for the month of August 2024 at Dhs. 542K, lower than budget by Dhs. 136K, and lower than last year by Dhs. 82K.",
    },
    {
      title: "Net Profit",
      value: "287,979.01",
      previousValue: "406,621.80",
      change: -29.2,
      changeType: "decrease",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "NOP for the month of AUG'2024 at Dhs.288K, lower than budget by Dhs.102K.",
    },
    {
      title: "Total Expenses",
      value: "1,483,958.47",
      previousValue: "1,088,148.49",
      change: 42.4,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "Direct expenses have increased notably by 48,166.10K compared to 2023 (up by 69.1%) and exceeded the 2024 budget by 32,537.83K (up by 38.1%), indicating overspending in operational costs.",
    },
    // {
    //   title: "Profit Margin",
    //   value: "26.74",
    //   previousValue: "34.41",
    //   change: -22.29,
    //   changeType: "decrease",
    //   prefix: "",
    //   suffix: "%",
    //   tooltip: "", // No matching remark available
    // },
  ];
}

export function getKpiCardsYTD(): KpiCard[] {
  return [
    {
      title: "Total Revenue",
      value: "20,044,821.06",
      previousValue: "15,785,119.64",
      change: 26.98,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "Total direct revenue for August 2024 stood at Dhs. 20.04K, reflecting an increase of Dhs. 4.26K over last year and Dhs. 2.56K above budgeted expectations.",
    },
    {
      title: "Gross Profit",
      value: "7,479,790.80",
      previousValue: "5,814,396.77",
      change: 28.63,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "Gross operating profit for the year 2024 is Dhs. 7,480K, which is higher than the budget by Dhs. 626K and higher than the previous year by Dhs. 1,665K.",
    },
    {
      title: "Net Profit",
      value: "4,931,044.03",
      previousValue: "4,230,328.73",
      change: 16.56,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "NOP for the month of AUG'2024 at Dhs.4,931K, higher than the previous year by Dhs.700K and higher than budget by Dhs.594K.",
    },
    {
      title: "Total Expenses",
      value: "12,565,030.26",
      previousValue: "9,970,722.87",
      change: 26.03,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "Direct expenses have increased notably by 359.46K compared to 2023 (up by 53.8%) and exceeded the 2024 budget by 209.27K (up by 25.6%), indicating overspending in operational costs.",
    },
    // {
    //   title: "Profit Margin",
    //   value: "26.74",
    //   previousValue: "34.41",
    //   change: -22.29,
    //   changeType: "decrease",
    //   prefix: "",
    //   suffix: "%",
    //   tooltip: "",
    // },
  ];
}
