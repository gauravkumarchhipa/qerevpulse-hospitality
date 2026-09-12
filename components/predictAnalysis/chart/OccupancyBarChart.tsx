"use client";

import { useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { useTheme } from "@/app/theme-provider";
import { Card } from "@/components/ui/card";

interface BarChartData {
  name: string;
  [key: string]: string | number;
}

interface DataKeyConfig {
  key: string;
  name: string;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  title: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  yAxisFormatter?: (value: number) => string;
  filter?: string;
  setFilter?: (val: string) => void | any;
  dataKeys?: DataKeyConfig[];
  leftPadding?: number;
}

export default function OccupancyBarChart({
  data,
  title,
  height = 300,
  showGrid = false,
  showLegend = true,
  yAxisFormatter = (v) => v.toString(),
  filter,
  setFilter,
  leftPadding = 35,
  dataKeys = [
    { key: "current", name: "Current Period", color: "hsl(var(--chart-1))" },
    { key: "previous", name: "Previous Period", color: "hsl(var(--chart-4))" },
  ],
}: BarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);

  const renderWrappedTick = ({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: { value: string };
  }) => {
    const words = payload.value.split(" ");
    return (
      <text x={x} y={y} textAnchor="middle" fontSize={12} fill="#666">
        {words.map((word, index) => (
          <tspan key={index} x={x} dy={index === 0 ? "0.71em" : "1.2em"}>
            {word}
          </tspan>
        ))}
      </text>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex justify-center items-center mb-4">
        <h3 className="text-base font-medium">{title}</h3>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 5, right: 30, left: leftPadding, bottom: 40 }}
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
            tick={renderWrappedTick}
            tickLine={false}
            axisLine={{
              stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
            }}
            dy={10}
          />
          <YAxis
            tickFormatter={yAxisFormatter}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{
              stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
            }}
            label={{
                value: "Occupancy Rate and ADR",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fill: isDark ? "#fff" : "#000",
                  fontSize: 12,
                },
                offset: 0,
                dy: 0,    
              }}
          />
          <Tooltip
            formatter={(value: number) => [yAxisFormatter(value), ""]}
            contentStyle={{
              backgroundColor: isDark ? "hsl(var(--card))" : "white",
              borderColor: isDark ? "hsl(var(--border))" : "#e2e8f0",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: "0.75rem", cursor: "pointer" }}
              onMouseEnter={(o) => setHoveredLegend(o.value)}
              onMouseLeave={() => setHoveredLegend(null)}
            />
          )}
          {dataKeys.map((d) => (
            <Bar
              key={d.key}
              dataKey={d.key}
              name={d.name}
              fill={d.color}
              radius={[4, 4, 0, 0]}
              fillOpacity={
                hoveredLegend === null || hoveredLegend === d.name ? 1 : 0.3
              }
            >
              <LabelList
                dataKey={d.key}
                position="top"
                formatter={(val: number) => val.toString()}
                style={{
                  fill: isDark ? "#fff" : "#000",
                  fontSize: 12,
                }}
              />
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </Card>
  );
}
