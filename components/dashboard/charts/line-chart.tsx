"use client";

import { useState } from "react";
import { useTheme } from "@/app/theme-provider";
import { ChartData } from "@/types";
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceArea,
} from "recharts";

interface LineChartProps {
  data: ChartData[];
  title: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  ReferenceAreaShow?: boolean;
  yAxisFormatter?: (value: number) => string;
}

export default function LineChart({
  data,
  title,
  height = 300,
  showGrid = false,
  showLegend = true,
  ReferenceAreaShow = false,
  yAxisFormatter = (value) => `AED${value.toLocaleString()}`,
}: LineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);

  // Color tokens
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const axisColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
  const tooltipBg = isDark ? "hsl(var(--card))" : "white";
  const tooltipBorder = isDark ? "hsl(var(--border))" : "#e2e8f0";
  const futureColor = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";

  const legendPayload = [
    {
      value: "Current Year Profit",
      type: "circle" as const,
      color: "hsl(var(--chart-2))",
    },
    {
      value: "Previous Year Profit",
      type: "circle" as const,
      color: "hsl(var(--chart-3))",
    },
  ];

  const allValues = data?.flatMap((item) => [item.current, item.previous]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const domain: [number, number] = [
    Math.floor(minValue * 0.9),
    Math.ceil(maxValue * 1.1),
  ];

  return (
    <div className="w-full h-full">
      <h3 className="text-base font-medium text-center w-full">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 30, bottom: 25 }}
        >
          {/* Optional Grid */}
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={gridColor}
            />
          )}

          {/* ✅ Highlight August (x1="Jul", x2="Sep") */}
          {ReferenceAreaShow && (
            <ReferenceArea
              x1="Sep"
              x2="Dec"
              strokeOpacity={0}
              fill={futureColor}
              fillOpacity={0.4}
            />
          )}
          {/* Axes */}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: axisColor }}
            dy={10}
          />
          <YAxis
            tickFormatter={yAxisFormatter}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: axisColor }}
            domain={domain}
          />

          {/* Tooltip */}
          <Tooltip
            formatter={(value: number) => [`${yAxisFormatter(value)}`, ""]}
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          />

          {/* Legend */}
          {showLegend && (
            <Legend
              payload={legendPayload}
              verticalAlign="top"
              height={36}
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: "0.75rem", cursor: "pointer" }}
              onMouseEnter={(o) => setHoveredLegend(o.value)}
              onMouseLeave={() => setHoveredLegend(null)}
            />
          )}

          {/* Gradient fill for current line */}
          <defs>
            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0.2}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {/* Lines */}
          <Line
            type="monotone"
            dataKey="current"
            name="Current Year Profit"
            stroke="hsl(var(--chart-2))"
            strokeWidth={
              hoveredLegend === null || hoveredLegend === "Current Year Profit"
                ? 2
                : 1
            }
            strokeOpacity={
              hoveredLegend === null || hoveredLegend === "Current Year Profit"
                ? 1
                : 0.3
            }
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            fill="url(#currentGradient)"
          />

          <Line
            type="monotone"
            dataKey="previous"
            name="Previous Year Profit"
            stroke="hsl(var(--chart-3))"
            strokeWidth={
              hoveredLegend === null || hoveredLegend === "Previous Year Profit"
                ? 2
                : 1
            }
            strokeOpacity={
              hoveredLegend === null || hoveredLegend === "Previous Year Profit"
                ? 1
                : 0.3
            }
            strokeDasharray="4 4"
            dot={{ r: 4, strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
