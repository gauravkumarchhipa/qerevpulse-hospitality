import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "@/app/theme-provider";
import { useState, useMemo } from "react";
import { formatKM } from "@/utils/number";

interface Props {
  data: any[];
  dataKeys: { key: string; name: string; color: string }[];
  title: string;
  height?: number;
  showGrid?: boolean;
  yAxisAdjust?: boolean; // new flag
  dataKey?: string;
  yTickStep?: number;
}

export default function MultiLineChart({
  data,
  dataKeys,
  title,
  height = 300,
  showGrid = false,
  yAxisAdjust = false,
  dataKey = "name",
  yTickStep = 5,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hovered, setHovered] = useState<string | null>(null);

  // ⚙️ Dynamic Y-axis min/max logic (only if yAxisAdjust is true)
  const yAxisProps = useMemo(() => {
    if (!yAxisAdjust || !data?.length) return {};

    const allValues = data.flatMap((entry) =>
      dataKeys?.map((d) => entry[d.key]).filter((val) => typeof val === "number")
    );

    const yMin = Math.min(...allValues);
    const yMax = Math.max(...allValues);

    const adjustedMin = Math.floor((yMin - yTickStep) / yTickStep) * yTickStep;
    const adjustedMax = Math.ceil((yMax + yTickStep) / yTickStep) * yTickStep;

    const ticks: number[] = [];
    for (let i = adjustedMin; i <= adjustedMax; i += yTickStep) {
      ticks.push(i);
    }

    return {
      domain: [adjustedMin, adjustedMax],
      ticks,
    };
  }, [data, dataKeys, yAxisAdjust]);

  return (
    <div className="w-full h-full">
      <h3 className="text-base font-medium mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={dataKey}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            axisLine={{ stroke: isDark ? "#444" : "#ccc" }}
            tickLine={false}
          />

          <YAxis
            {...yAxisProps}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            axisLine={{ stroke: isDark ? "#444" : "#ccc" }}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length || !label) return null;

              return (
                <div
                  style={{
                    backgroundColor: isDark ? "#000" : "#fff",
                    borderColor: isDark ? "#333" : "#ddd",
                    fontSize: "0.875rem",
                    borderRadius: "0.375rem",
                    padding: "0.5rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    color: isDark ? "#fff" : "#000",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                    {label}
                  </div>
                  {payload.map((item: any, idx: number) => (
                    <div key={idx} style={{ color: item.color }}>
                      {item.name}: {formatKM(item.value)}
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <Legend
            verticalAlign="top"
            align="center"
            iconSize={10}
            iconType="circle"
            wrapperStyle={{ fontSize: "0.75rem", cursor: "pointer" }}
            onMouseEnter={(e) => setHovered(e.value)}
            onMouseLeave={() => setHovered(null)}
          />
          {dataKeys.map((d) => (
            <Line
              key={d.key}
              type="monotone"
              dataKey={d.key}
              name={d.name}
              stroke={d.color}
              strokeWidth={hovered === null || hovered === d.name ? 2 : 1}
              strokeOpacity={hovered === null || hovered === d.name ? 1 : 0.3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
