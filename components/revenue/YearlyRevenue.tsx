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
import { formatCompact } from "./RevenueController";

export default function YearlyRevenue() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { kpis }: any = useSelector((d: RootState) => d.revenueKpi);
  return (
    <Card className="p-6">
      <h3 className="text-base font-medium mb-4 text-center">Yearly Revenue</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={kpis?.yearlyRevenue}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          <XAxis
            dataKey="name"
            interval={0}
            tickLine={false}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
          />
          <YAxis
            domain={[0, 10000]}
            tickFormatter={(v) => (v / 1_000_000).toFixed(2) + "M"}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [
              `${formatCompact(value)}`,
              "Revenue",
            ]}
            labelStyle={{
              color: isDark ? "#f9fafb" : "#1f2937",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
            contentStyle={{
              backgroundColor: isDark ? "#000" : "#fff",
              borderColor: isDark ? "#374151" : "#e2e8f0",
              fontSize: "0.875rem",
              color: isDark ? "#f9fafb" : "#1f2937",
              borderRadius: "0.375rem",
            }}
            itemStyle={{
              color: isDark ? "#f9fafb" : "#1f2937",
            }}
          />
          <Bar
            dataKey="value"
            fill={isDark ? "#f43f5e" : "#800020"}
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="value"
              position="top"
              formatter={(val: number) => `${formatCompact(val)}`}
              style={{
                fill: isDark ? "#fff" : "#000",
                fontSize: 12,
              }}
            />
            {kpis?.yearlyRevenue.map((_: any, index: number) => (
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
