"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Cell,
} from "recharts";
import { useTheme } from "@/app/theme-provider";
import { WaterfallItem } from "@/types";
import { Button } from "@/components/ui/button";

interface Props {
  data: WaterfallItem[];
  height?: number;
  showGrid?: boolean;
}

export default function WaterfallChart({
  data,
  height = 350,
  showGrid,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [viewData, setViewData] = useState(data);
  const [breadcrumbs, setBreadcrumbs] = useState<WaterfallItem[]>([]);

  const visualData = viewData.map((item) => ({
    ...item,
    renderValue: item.value,
  }));
  useEffect(() => {
    setViewData(data);
    setBreadcrumbs([]);
  }, [data]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-center w-full">
          Profit and Loss Waterfall
        </h3>
        {breadcrumbs?.length > 0 && (
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => {
              const newTrail = [...breadcrumbs];
              newTrail.pop();
              setBreadcrumbs(newTrail);
              setViewData(
                newTrail.length ? newTrail[newTrail.length - 1].children! : data
              );
            }}
          >
            Back
          </Button>
        )}
      </div>
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={visualData}
            margin={{ top: 20, right: 30, left: 40, bottom: 90 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              />
            )}
            <XAxis
              dataKey="name"
              interval={0}
              tickLine={false}
              tick={({ x, y, payload }) => {
                const words = payload.value.split(" ");
                const line1 = words
                  .slice(0, Math.ceil(words.length / 2))
                  .join(" ");
                const line2 = words
                  .slice(Math.ceil(words.length / 2))
                  .join(" ");
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fontSize={12}
                    transform={`rotate(-90, ${x + 25}, ${y + 35})`} // ✅ Push down by +20
                    fill={isDark ? "#fff" : "#000"}
                  >
                    <tspan x={x} dy="1em">
                      {line1}
                    </tspan>
                    <tspan x={x} dy="1.2em">
                      {line2}
                    </tspan>
                  </text>
                );
              }}
              axisLine={{
                stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
              }}
            />

            <YAxis
              tickFormatter={(v) => `AED${v.toLocaleString()}`}
              tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
              tickLine={false}
              axisLine={{
                stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
              }}
            />
            <Tooltip
              formatter={(value: number) => [
                `AED ${value.toLocaleString()}`,
                "Value",
              ]}
              contentStyle={{
                backgroundColor: isDark ? "#000" : "#fff",
                borderColor: isDark ? "#374151" : "#e2e8f0",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                color: isDark ? "#f9fafb" : "#1f2937",
              }}
              labelStyle={{
                color: isDark ? "#f9fafb" : "#1f2937",
                fontSize: "0.875rem",
                fontWeight: 700,
              }}
              itemStyle={{
                color: isDark ? "#f9fafb" : "#1f2937",
              }}
              cursor={{ fill: "transparent" }}
            />
            <ReferenceLine y={0} stroke="#666" />
            <Bar
              dataKey="renderValue"
              radius={[4, 4, 0, 0]}
              onClick={(_, index) => {
                const clicked = viewData[index];
                if (clicked.children) {
                  setBreadcrumbs((prev) => [...prev, clicked]);
                  setViewData(clicked.children);
                }
              }}
            >
              {visualData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isTotal
                      ? "hsl(var(--chart-1))"
                      : entry.value < 0
                      ? "hsl(var(--destructive))"
                      : entry.isProfit
                      ? "hsl(var(--chart-3))"
                      : "hsl(var(--chart-2))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
