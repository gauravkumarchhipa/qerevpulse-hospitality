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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Data
const scatterData = [
  {
    name: "Delta Hotels",
    occupancyRate: 0.585,
    profitMargin: 58,
    fill: "#9b59b6",
  },
  {
    name: "Hilton Jumeirah",
    occupancyRate: 0.579,
    profitMargin: 60,
    fill: "#f1c40f",
  },
  {
    name: "Hilton The Walk",
    occupancyRate: 0.578,
    profitMargin: 42,
    fill: "#ff9a9e",
  },
  {
    name: "Merriott Hotel & Spa",
    occupancyRate: 0.578,
    profitMargin: 66,
    fill: "#ec5b84",
  },
  {
    name: "Taj Exotica Resort & Spa",
    occupancyRate: 0.579,
    profitMargin: 56,
    fill: "#bc6ff1",
  },
];

// Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, occupancyRate, profitMargin } = payload[0].payload;
  return (
    <div className="p-3 rounded shadow text-sm bg-white text-black dark:bg-black dark:text-white">
      <strong>{name}</strong>
      <div>Occupancy Rate: {(occupancyRate * 100).toFixed(2)}%</div>
      {/* <div>Profit Margin: {profitMargin.toFixed(2)}%</div> */}
      <div>Profit Margin: {Math.abs(profitMargin).toFixed(2)}%</div>
    </div>
  );
};

export default function InventoryMixOptimizationCard({
  showGrid = false,
}: any) {
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);
  const { kpis }: any = useSelector((d: RootState) => d.revenueKpi);
  const legendPayload = useMemo(
    () =>
      kpis?.inventoryMix?.map((d:any) => ({
        value: d.name,
        type: "circle" as const,
        color: d.fill,
        id: d.name,
      })),
    []
  );

  // Custom shape for scatter points
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

  return (
    <Card className="p-6">
      <h3 className="text-base font-medium mb-4 text-center">
        Inventory Mix Optimization Matrix
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            type="number"
            dataKey="occupancyRate"
            name="Occupancy Rate"
            tickFormatter={(v) => v.toFixed(3)}
            domain={["auto", "auto"]}
            label={{
              value: "Occupancy Rate",
              position: "insideBottom",
              dy: 10,
            }}
          />
          <YAxis
            type="number"
            dataKey="profitMargin"
            name="Profit Margin"
            domain={["auto", "auto"]}
            label={{
              value: "Profit Margin",
              angle: -90,
              position: "insideLeft",
              dx: -5,
            }}
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
                        display: "inline-block",
                      }}
                    ></span>
                    <span>{entry.value}</span>
                  </li>
                ))}
              </ul>
            )}
          />
          <Scatter
            name="Hotels"
            data={kpis?.inventoryMix}
            shape={renderShape}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
}
