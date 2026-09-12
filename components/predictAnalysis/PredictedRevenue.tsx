"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  Cell,
} from "recharts";
import { useTheme } from "@/app/theme-provider";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatKM } from "@/utils/number";

const data = [
  { name: "June", value: 2218 },
  { name: "July", value: 2558 },
  { name: "August", value: 2617 },
  { name: "September", value: 2561 },
  { name: "October", value: 2665 },
  { name: "November", value: 2626 },
  { name: "December", value: 2713 },
];

export default function PredictedRevenue() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { kpis }: any = useSelector((state: RootState) => state.predictiveKpi);
  return (
    <Card className="p-6">
      <h3 className="text-base font-medium mb-4 text-center">
        Predicted Revenue
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={kpis?.monthlyRevenueSeries}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${formatKM(v)}`}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [`${formatKM(value)}`, "Revenue"]}
            labelStyle={{
              color: isDark ? "#f9fafb" : "#1f2937",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
            contentStyle={{
              backgroundColor: isDark ? "#000" : "#fff",
              borderColor: isDark ? "#374151" : "#e2e8f0",
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              color: isDark ? "#f9fafb" : "#1f2937",
            }}
            itemStyle={{
              color: isDark ? "#f9fafb" : "#1f2937",
            }}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            fill={isDark ? "#F87171" : "#800020"} // dynamic color
          >
            <LabelList
              dataKey="value"
              position="top"
              formatter={(val: number) => `${formatKM(val)}`}
              style={{
                fill: isDark ? "#fff" : "#000",
                fontSize: 12,
              }}
            />
            {kpis?.monthlyRevenueSeries?.map((_: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={isDark ? "hsl(var(--chart-2))" : "hsl(var(--chart-2))"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
