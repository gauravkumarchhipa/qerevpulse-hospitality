"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import {
  varianceDataBudget,
  varianceDataBudgetYTD,
  varianceDataLastYear,
  varianceDataLastYearYTD,
} from "@/lib/dashboard/overview/PerformanceVariance";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const { current, target, variance } = payload[0].payload;
  return (
    <div className="p-3 rounded shadow text-sm bg-white text-black dark:bg-black dark:text-white">
      <strong>{label}</strong>
      <div>Current: AED {current.toLocaleString()}</div>
      <div>Target: AED {target.toLocaleString()}</div>
      <div>Variance: {variance.toFixed(2)}%</div>
    </div>
  );
};

export default function PerformanceVarianceCard() {
  const [filter, setFilter] = useState<"budget" | "lastYear">("budget");

  // Use absolute value for display, but preserve original data for tooltip
  const view = useSelector(
    (state: RootState) => state.filters.appliedFilters?.view,
    shallowEqual
  );

  const [rawData] = useMemo(() => {
    const isMonth = view === "month";
    return [
      filter === "budget"
        ? isMonth
          ? varianceDataBudget
          : varianceDataBudgetYTD
        : isMonth
        ? varianceDataLastYear
        : varianceDataLastYearYTD,
    ];
  }, [view, filter]);

  const chartData = rawData?.map((item: any) => ({
    ...item,
    displayVariance: Math.abs(item.variance),
  }));

  return (
    <Card className="p-[30px]">
      <div className="flex justify-between mb-4 gap-3">
        <h3 className="text-base font-medium">Performance Variance</h3>
        <div className="overflow-x-auto max-w-full md:overflow-visible">
          <div className="flex gap-2 w-max">
            <Button
              variant={filter === "budget" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("budget")}
            >
              VS BUDGET
            </Button>
            <Button
              variant={filter === "lastYear" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("lastYear")}
            >
              VS LAST YEAR
            </Button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          {!true && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            type="number"
            tickFormatter={(val) => `${val.toFixed(1)}%`}
            domain={[0, "dataMax + 2"]}
          />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="displayVariance" radius={[0, 5, 5, 0]}>
            {rawData.map((entry: any, index: any) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.variance < 0 ? "#ef4444" : "#22c55e"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
