"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/app/theme-provider";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { formatKM } from "@/utils/number";

// Colors
const palette = {
  delta: "hsl(var(--chart-1))",
  hiltonJumeirah: "hsl(var(--chart-2))",
  hiltonWalk: "hsl(var(--chart-3))",
  marriott: "hsl(var(--chart-4))",
  taj: "hsl(var(--chart-5))",
} as const;

type SeriesKey = keyof typeof palette;

function formatHotelName(key: string) {
  switch (key) {
    case "delta":
      return "Delta Hotels";
    case "hiltonJumeirah":
      return "Hilton Jumeirah";
    case "hiltonWalk":
      return "Hilton The Walk";
    case "marriott":
      return "Merriott Hotel & Spa";
    case "taj":
      return "Taj Exotica Resort & Spa";
    default:
      return key;
  }
}

const labelFormatter = (val: number) => `${formatKM(val)}`;

export default function PredictedRevenueChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const { kpis }: any = useSelector((state: RootState) => state.predictiveKpi);

  const data = kpis?.monthlyRevenueByHotel ?? [];

  // 1) Which series actually have non-zero data?
  const activeKeys: SeriesKey[] = useMemo(() => {
    const keys = Object.keys(palette) as SeriesKey[];
    if (!data.length) return [];
    return keys.filter((key) => data.some((row: any) => (row?.[key] ?? 0) > 0));
  }, [data]);

  // 2) Build filtered Legend payload
  const legendPayload = useMemo(
    () =>
      activeKeys.map((k) => ({
        id: k, // used for hover
        type: "circle" as const,
        value: formatHotelName(k),
        color: palette[k],
      })),
    [activeKeys]
  );

  return (
    <Card className="p-6">
      <h3 className="text-center text-base font-medium mb-4">
        Predicted Ranking by Revenue
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 25, bottom: 20 }}
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            label={{
              value: "Month",
              position: "insideBottom",
              offset: -5,
              style: { fill: isDark ? "#fff" : "#000", fontSize: 14 },
            }}
          />

          <YAxis
            tickFormatter={(v) => `${formatKM(v)}`}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            axisLine={false}
            label={{
              value: "Revenue",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              dx: -25,
              style: { fill: isDark ? "#fff" : "#000", fontSize: 14 },
            }}
          />

          <Tooltip
            formatter={(value: number, name: string) => [
              formatKM(value),
              formatHotelName(name),
            ]}
            labelFormatter={(label: string) => label}
            contentStyle={{
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              backgroundColor: isDark ? "#111827" : "#fff",
              color: isDark ? "#f3f4f6" : "#1f2937",
              borderColor: isDark ? "#374151" : "#e5e7eb",
            }}
          />

          {/* Filtered legend shows only active series */}
          <Legend
            verticalAlign="top"
            height={36}
            iconSize={10}
            wrapperStyle={{ fontSize: "0.75rem", cursor: "pointer" }}
            payload={legendPayload}
            onMouseEnter={(e: any) => setHoveredKey(e?.id ?? null)}
            onMouseLeave={() => setHoveredKey(null)}
          />

          {/* Render bars ONLY for active series */}
          {activeKeys.map((key) => {
            const color = palette[key];
            return (
              <Bar
                key={key}
                dataKey={key}
                name={formatHotelName(key)}
                fill={color}
                radius={[4, 4, 0, 0]}
                barSize={40}
                fillOpacity={hoveredKey && hoveredKey !== key ? 0.2 : 1}
              >
                <LabelList
                  dataKey={key}
                  position="top"
                  formatter={labelFormatter}
                  style={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
                />
                {data.map((_: any, idx: number) => (
                  <Cell key={`cell-${key}-${idx}`} fill={color} />
                ))}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
