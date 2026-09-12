"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { useTheme } from "@/app/theme-provider";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function PriceElasticityChart({ showGrid = false }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { kpis }: any = useSelector((d: RootState) => d.seasonalKpi);
  const colorPalette = isDark
    ? ["#38bdf8", "#facc15", "#fb7185", "#34d399", "#c084fc", "#f97316"]
    : ["#0f766e", "#ca8a04", "#b91c1c", "#2563eb", "#7c3aed", "#ea580c"];

  const coloredData = kpis?.categoryElasticity?.map(
    (item: any, index: number) => ({
      ...item,
      fill: colorPalette[index % colorPalette.length],
    })
  );

  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);

  const legendPayload = useMemo(
    () =>
      coloredData?.map((d: any) => ({
        value: d?.name,
        type: "circle" as const,
        color: d.fill,
        id: d.name,
      })),
    [coloredData]
  );

  const renderShape = (props: any) => {
    const isActive =
      hoveredLegend === null || hoveredLegend === props.payload.name;
    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        r={isActive ? 8 : 6}
        fill={props.payload.fill}
        fillOpacity={isActive ? 1 : 0.3}
      />
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const { name, occupancyRate, elasticity } = payload[0].payload;
    return (
      <div className="p-3 rounded shadow text-sm bg-white text-black dark:bg-black dark:text-white">
        <strong>{name}</strong>
        <div>Occupancy Rate: {occupancyRate.toFixed(2)}</div>
        <div>Profit Margin: {elasticity}</div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <h3 className="text-base font-medium mb-4 text-center">
        Price Elasticity
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 20 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            type="category"
            dataKey="name"
            name="Category"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis
            type="number"
            dataKey="occupancyRate"
            domain={[0, (dataMax: number) => dataMax * 1.5]}
            tickCount={6}
            tickFormatter={(v) => v.toFixed(2)}
            label={{
              value: "Occupancy Rate",
              angle: -90,
              position: "insideLeft",
              dx: -5,
              dy: 40,
            }}
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            content={() => (
              <ul className="flex flex-wrap justify-center gap-4 text-xs mt-2">
                {legendPayload?.map((entry: any) => (
                  <li
                    key={entry.value}
                    className="flex items-center gap-1 cursor-pointer"
                    onMouseEnter={() => setHoveredLegend(entry.value)}
                    onMouseLeave={() => setHoveredLegend(null)}
                  >
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: entry.color,
                      }}
                    ></span>
                    <span>{entry.value}</span>
                  </li>
                ))}
              </ul>
            )}
          />
          <Scatter name="Departments" data={coloredData} shape={renderShape} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
}
