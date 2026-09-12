"use client";

import { useState } from "react";
import { useTheme } from "@/app/theme-provider";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { DepartmentData } from "@/types";

interface PieChartProps {
  data: DepartmentData[];
  title: string;
  height?: number;
  showLegend?: boolean;
  percentage?: boolean;
}

export default function PieChart({
  data,
  title,
  height = 300,
  showLegend = true,
  percentage = true,
}: PieChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Skip very small slices

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12px"
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(percentage ? 0 : 2)}%`}
      </text>
    );
  };

  const handleLegendMouseEnter = (o: any) => {
    setHoveredLegend(o.value);
  };
  const handleLegendMouseLeave = () => {
    setHoveredLegend(null);
  };

  const legendPayload: any = data?.map((entry) => ({
    value: entry.name,
    type: "circle",
    color: entry.color,
  }));

  return (
    <div className="w-full h-full">
      <h3 className="text-base font-medium mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data?.map((entry, index) => {
              const isHighlighted =
                !hoveredLegend || hoveredLegend === entry.name;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  fillOpacity={isHighlighted ? 1 : 0.3}
                />
              );
            })}
          </Pie>

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;

              const style = {
                backgroundColor: isDark ? "#000000" : "#ffffff",
                color: isDark ? "#ffffff" : "#000000",
                border: `1px solid ${isDark ? "#333333" : "#e2e8f0"}`,
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                padding: "0.5rem 0.75rem",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              };

              const main = payload[0]; // Main slice
              const expenseList = main?.payload?.expense || [];

              return (
                <div style={style}>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                    {main?.name}: AED {main?.value?.toLocaleString()}
                  </div>

                  {/* Conditionally render nested expense list */}
                  {expenseList?.length > 0 && (
                    <div>
                      {expenseList?.map((item: any, idx: number) => (
                        <div key={idx}>
                          <span>{item.name}:</span>{" "}
                          <span>AED {item.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }}
          />

          {/* {showLegend && (
            <Legend
              payload={legendPayload}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ fontSize: "0.75rem", cursor: "pointer" }}
              onMouseEnter={handleLegendMouseEnter}
              onMouseLeave={handleLegendMouseLeave}
            />
          )} */}
          {showLegend && (
            <Legend
              payload={legendPayload}
              layout="horizontal"
              verticalAlign="top"
              align="center"
              iconSize={10}
              iconType="circle"
              wrapperStyle={{
                fontSize: "0.75rem",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
              onMouseEnter={handleLegendMouseEnter}
              onMouseLeave={handleLegendMouseLeave}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
