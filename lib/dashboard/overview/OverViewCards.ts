import { KpiCard } from "@/types";
// OverView
// OverView Cards
export function getKpiCards2(): KpiCard[] {
  return [
    {
      title: "Occupancy %",
      value: "74.88",
      previousValue: "81.14",
      change: -7.71,
      changeType: "decrease",
      prefix: "",
      suffix: "%",
      tooltip: "Occupancy lower than 2023 by 6.26% and below budget by 8.15%",
    },
    {
      title: "ADR",
      value: "219.66",
      previousValue: "192.12",
      change: 14.34,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip: "ADR and RevPAR higher than year 2023 and budget.",
    },
    {
      title: "RevPAR",
      value: "164.49",
      previousValue: "155.89",
      change: 5.52,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip: "ADR and RevPAR higher than year 2023 and budget.",
    },
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
      title: "F&B Revenue",
      value: "370,422.28",
      previousValue: "258,452.91",
      change: 43.33,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip: "", // No tooltip was given for F&B Revenue in your mapping.
    },
    {
      title: "GOP",
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
      title: "Payroll & Benefits",
      value: "330,274.05",
      previousValue: "268,555.55",
      change: 22.98,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "There has been a noticeable rise in PAYROLL & BENEFITS F&B AND RMS expenses, with 2024 expenses surpassing last year by 61.7K. While the increase over 2023 reflects expanding operations or compensation adjustments, the overage against budget (7.8K) suggests a need to reassess future workforce planning and cost controls.",
    },
    {
      title: "NOP",
      value: "287,979.01",
      previousValue: "406,621.80",
      change: -29.20,
      changeType: "decrease",
      prefix: "AED ",
      suffix: "",
      tooltip: "NOP for the month of AUG'2024 at Dhs.288K, lower than budget by Dhs.102K.",
      isAfter : 1
    },
       {
      title: "NOP",
      value: "313,369.79",
      previousValue: "406,621.80",
      change: -22.94,
      changeType: "decrease",
      prefix: "AED ",
      suffix: "",
      tooltip: "NOP for the month of AUG'2024 at Dhs.288K, lower than budget by Dhs.102K.",
      isAfter : 0
    },
  ];
}

export function getKpiCards2YTD(): KpiCard[] {
  return [
    {
      title: "Occupancy %",
      value: "79.96",
      previousValue: "78.12",
      change: 2.36,
      changeType: "increase",
      prefix: "",
      suffix: "%",
      tooltip: "Occupancy higher than 2023 by 1.84% and below budget by 0.95%",
    },
    {
      title: "ADR",
      value: "264.78",
      previousValue: "218.10",
      change: 14.34,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip: "ADR and RevPAR higher than year 2023 and budget.",
    },
    {
      title: "RevPAR",
      value: "211.7",
      previousValue: "170.39",
      change: 24.25,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip: "ADR and RevPAR higher than year 2023 and budget.",
    },
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
      title: "F&B Revenue",
      value: "3,439,650.33",
      previousValue: "2,471,398.13",
      change: 39.17,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip: "", // No direct remark for F&B Revenue
    },
    {
      title: "GOP",
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
      title: "Payroll & Benefits",
      value: "2,690,024.32",
      previousValue: "2,329,660.99",
      change: 15.47,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip:
        "There has been a noticeable rise in payroll and benefits for F&B and RMS, with 2024 expenses surpassing last year by ?360.4K. While the increase over 2023 reflects expanding operations or compensation adjustments, the overage against budget (?35.0K) suggests a need to reassess future workforce planning and cost controls.",
    },
    {
      title: "NOP",
      value: "4,931,044.0",
      previousValue: "4,230,328.73",
      change: 16.56,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip: "NOP for the month of AUG'2024 at Dhs.4,931K, higher than the previous year by Dhs.700K and higher than budget by Dhs.594K.",
      isAfter : 1
    },
    {
      title: "NOP",
      value: "5,415,639.04",
      previousValue: "4,230,328.73",
      change: 28.01,
      changeType: "increase",
      prefix: "AED ",
      suffix: "",
      tooltip: "NOP for the month of AUG'2024 at Dhs.4,931K, higher than the previous year by Dhs.700K and higher than budget by Dhs.594K.",
      isAfter : 0
    },
  ];
}
