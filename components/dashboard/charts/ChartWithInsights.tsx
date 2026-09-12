"use client";

import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  BarController,
  LineController, // ✅ Required Controllers
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/app/theme-provider";
import Insights from "../insights";
import {
  revenueVsExpensesMonthly,
  revenueVsExpensesMonthlyYTD,
  revenueVsExpensesQuarterly,
  revenueVsExpensesQuarterlyYTD,
} from "@/lib/dashboard/overview/RevenuevsExpenses";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/store/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  BarController,
  LineController
);

export default function ChartWithInsights() {
  const [viewType, setViewType] = useState<"monthly" | "quarterly">("monthly");
  const { theme } = useTheme();

  const view = useSelector(
    (state: RootState) => state.filters.appliedFilters?.view,
    shallowEqual
  );

  const [chartDataRaw] = useMemo(() => {
    const isMonth = view === "month";
    return [
      viewType === "monthly"
        ? isMonth
          ? revenueVsExpensesMonthly
          : revenueVsExpensesMonthlyYTD
        : isMonth
        ? revenueVsExpensesQuarterly
        : revenueVsExpensesQuarterlyYTD,
    ];
  }, [view, viewType]);

  const labels = chartDataRaw.map((item) => item.name);

  const data: any = useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: "bar",
          label: "Revenue",
          data: chartDataRaw.map((d) => d.Revenue),
          backgroundColor: "rgba(43, 108, 176, 0.8)",
          borderRadius: { topLeft: 4, topRight: 4 },
          order: 1, // 👇 Put lower than the line
          yAxisID: "y",
        },
        {
          type: "bar",
          label: "Expenses",
          data: chartDataRaw.map((d) => d.Expenses),
          backgroundColor: "rgba(245, 101, 101, 0.8)",
          borderRadius: { topLeft: 4, topRight: 4 },
          order: 1,
          yAxisID: "y",
        },
        {
          type: "bar",
          label: "Budget",
          data: chartDataRaw.map((d: any) => d.Budget ?? null),
          backgroundColor: "rgba(255, 120, 64, 0.8)",
          borderRadius: { topLeft: 4, topRight: 4 },
          order: 1,
          yAxisID: "y",
        },
        {
          type: "line",
          label: "Profit",
          data: chartDataRaw.map((d) => d.Profit),
          borderColor: "#38a169",
          backgroundColor: "#38a169",
          borderWidth: 3,
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 5,
          order: 10,
          yAxisID: "y",
          clip: false, // optional
          z: 100,
        },
      ],
    }),
    [chartDataRaw]
  );

  const options: any = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: theme === "dark" ? "#ccc" : "#000",
          },
        },
        y: {
          beginAtZero: true,
          grid: { display: false },
          ticks: {
            callback: (val: number) => `AED ${val.toLocaleString()}`,
            color: theme === "dark" ? "#ccc" : "#000",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            color: theme === "dark" ? "#fff" : "#000",
            boxWidth: 10,
            padding: 10,
            font: {
              size: 10,
            },
          },
        },
        tooltip: {
          backgroundColor: theme === "dark" ? "#000" : "#fff", // ✅ Invert color by theme
          titleColor: theme === "dark" ? "#fff" : "#000", // ✅ Title text contrast
          bodyColor: theme === "dark" ? "#fff" : "#000", // ✅ Body text contrast
          borderColor: "#ccc",
          borderWidth: 1,
          cornerRadius: 6,
          callbacks: {
            label: (ctx: any) => {
              const val = ctx.raw;
              const label = ctx.dataset.label ?? "";
              return isNaN(val)
                ? `${label}: AED 0`
                : `${label}: AED ${val.toLocaleString()}`;
            },
          },
        },
      },
    }),
    [theme]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
      {/* Chart */}
      <div className="lg:col-span-3 flex flex-col">
        <Card className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium">
              Revenue vs Expenses ({viewType})
            </h3>
            <div className="overflow-x-auto max-w-full md:overflow-visible">
              <div className="flex gap-2 w-max">
                <Button
                  size="sm"
                  variant={viewType === "monthly" ? "default" : "outline"}
                  onClick={() => setViewType("monthly")}
                >
                  MONTHLY
                </Button>
                <Button
                  size="sm"
                  variant={viewType === "quarterly" ? "default" : "outline"}
                  onClick={() => setViewType("quarterly")}
                >
                  QUARTERLY
                </Button>
              </div>
            </div>
          </div>

          {/* Chart Display */}
          <div className="flex-grow relative">
            <Chart type="bar" data={data} options={options} />
          </div>
        </Card>
      </div>

      {/* Insights Panel */}
      <div className="lg:col-span-2 flex flex-col">
        <Insights />
      </div>
    </div>
  );
}
