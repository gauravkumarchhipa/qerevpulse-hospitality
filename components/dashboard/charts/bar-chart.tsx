// import { useState } from "react";
// import { useTheme } from "@/app/theme-provider";
// import {
//   BarChart as RechartsBarChart,
//   Bar,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   LabelList,
// } from "recharts";
// import { Button } from "@/components/ui/button";
// import { formatCompact } from "@/components/revenue/RevenueController";

// interface BarChartData {
//   name: string;
//   [key: string]: string | number;
// }

// interface DataKeyConfig {
//   key: string;
//   name: string;
//   color: string;
// }

// interface BarChartProps {
//   data: BarChartData[];
//   title: string;
//   height?: number;
//   showGrid?: boolean;
//   showLegend?: boolean;
//   yAxisFormatter?: (value: number) => string;
//   filter?: string;
//   setFilter?: (val: string) => void | any;
//   dataKeys?: DataKeyConfig[];
//   leftPadding?: number;
//   showValueLabels?: boolean; // New prop to control value label visibility
// }

// export default function BarChart({
//   data,
//   title,
//   height = 300,
//   showGrid = false,
//   showLegend = true,
//   yAxisFormatter = (v) => v.toString(),
//   filter,
//   setFilter,
//   leftPadding = 35,
//   dataKeys = [
//     { key: "current", name: "Current Period", color: "hsl(var(--chart-1))" },
//     { key: "previous", name: "Previous Period", color: "hsl(var(--chart-4))" },
//   ],
//   showValueLabels = false, // Default to false if not passed
// }: BarChartProps) {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);

//   // Helper function for word wrapping and limiting to 3 lines
//   const wrapLabelText = (text: string, maxLines = 3, maxLength = 12) => {
//     const words = text.split(" ");
//     let lines: string[] = [];
//     let currentLine = "";

//     words.forEach((word) => {
//       if (currentLine.length + word.length + 1 <= maxLength) {
//         currentLine += (currentLine ? " " : "") + word;
//       } else {
//         lines.push(currentLine);
//         currentLine = word;
//       }
//     });

//     if (currentLine) lines.push(currentLine); // Add the last line

//     // If it exceeds the max lines, trim
//     if (lines.length > maxLines) {
//       lines = lines.slice(0, maxLines);
//       lines[maxLines - 1] += "..."; // Append "..." for truncation
//     }

//     return lines;
//   };

//   const renderWrappedTick = ({
//     x,
//     y,
//     payload,
//   }: {
//     x: number;
//     y: number;
//     payload: { value: string };
//   }) => {
//     const wrappedLines = wrapLabelText(payload.value);
//     return (
//       <text x={x} y={y} textAnchor="middle" fontSize={12} fill="#666">
//         {wrappedLines.map((line, index) => (
//           <tspan key={index} x={x} dy={index === 0 ? "0.71em" : "1.2em"}>
//             {line}
//           </tspan>
//         ))}
//       </text>
//     );
//   };

//   return (
//     <div className="w-full h-full">
//       <div
//         className={`flex items-center mb-4 ${
//           !filter ? "justify-center" : "justify-between"
//         }`}
//       >
//         <h3 className="text-base font-medium">{title}</h3>
//         {filter && setFilter && (
//           <div className="overflow-x-auto md:overflow-visible max-w-full px-2">
//             <div className="flex gap-2 w-max">
//               {["Revenue", "Profit", "KPIS"].map((f) => (
//                 <Button
//                   key={f}
//                   variant={filter === f ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilter(f)}
//                   className="min-w-[80px]" // optional to ensure consistent width
//                 >
//                   {f}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <ResponsiveContainer width="100%" height={height}>
//         <RechartsBarChart
//           data={data}
//           margin={{ top: 5, right: 30, left: leftPadding, bottom: 40 }}
//         >
//           {showGrid && (
//             <CartesianGrid
//               strokeDasharray="3 3"
//               vertical={false}
//               stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
//             />
//           )}
//           <XAxis
//             dataKey="name"
//             tick={renderWrappedTick}
//             tickLine={false}
//             axisLine={{
//               stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
//             }}
//             dy={10}
//             tickFormatter={(value) => {
//               return value.length > 12 ? `${value.slice(0, 12)}...` : value;
//             }}
//           />
//           <YAxis
//             tickFormatter={yAxisFormatter}
//             tick={{ fontSize: 12 }}
//             tickLine={false}
//             axisLine={{
//               stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
//             }}
//           />
//           <Tooltip
//             content={({ active, payload, label }) => {
//               if (!active || !payload?.length) return null;

//               return (
//                 <div
//                   style={{
//                     backgroundColor: isDark ? "#000" : "#fff",
//                     borderColor: isDark ? "#333" : "#ccc",
//                     borderRadius: "0.375rem",
//                     padding: "0.5rem",
//                     fontSize: "0.875rem",
//                     color: isDark ? "#fff" : "#000",
//                     boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
//                     minWidth: "160px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontWeight: 600,
//                       marginBottom: "0.25rem",
//                     }}
//                   >
//                     {label}
//                   </div>

//                   {payload.map((item: any, index: number) => (
//                     <div key={index} style={{ color: item.color }}>
//                       {item.name}: {yAxisFormatter(item.value)}
//                     </div>
//                   ))}
//                 </div>
//               );
//             }}
//           />
//           {showLegend && (
//             <Legend
//               verticalAlign="top"
//               height={36}
//               iconSize={10}
//               iconType="circle"
//               wrapperStyle={{ fontSize: "0.75rem", cursor: "pointer" }}
//               onMouseEnter={(o) => setHoveredLegend(o.value)}
//               onMouseLeave={() => setHoveredLegend(null)}
//             />
//           )}
//           {dataKeys.map((d) => (
//             <Bar
//               key={d.key}
//               dataKey={d.key}
//               name={d.name}
//               fill={d.color}
//               radius={[4, 4, 0, 0]}
//               fillOpacity={
//                 hoveredLegend === null || hoveredLegend === d.name ? 1 : 0.3
//               }
//             >
//               {showValueLabels && (
//                 <LabelList
//                   dataKey={d.key}
//                   position="top"
//                   formatter={(val: number) => `${formatCompact(val)}`}
//                   style={{
//                     fill: isDark ? "#fff" : "#000",
//                     fontSize: 12,
//                   }}
//                 />
//               )}
//             </Bar>
//           ))}
//         </RechartsBarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { useTheme } from "@/app/theme-provider";
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
import { Button } from "@/components/ui/button";

/* ---------- helpers ---------- */

const formatCompact = (n: number) => {
  if (n == null || Number.isNaN(n)) return "—";
  const a = Math.abs(n);
  if (a >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (a >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (a >= 1_000) return (n / 1_000).toFixed(2) + "K";
  return String(n);
};

const wrapToTwoLines = (text: string, maxLineLen = 14) => {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (let i = 0; i < words.length; i++) {
    const tryLine = cur ? cur + " " + words[i] : words[i];
    if (tryLine.length <= maxLineLen) {
      cur = tryLine;
      if (i === words.length - 1) lines.push(cur);
    } else {
      if (cur) lines.push(cur);
      cur = words[i];
      if (lines.length === 2) break;
      if (i === words.length - 1) lines.push(cur);
    }
    if (lines.length === 2 && i < words.length - 1) break;
  }
  const used = lines.join(" ").split(/\s+/).filter(Boolean).length;
  const truncated = used < words.length;
  if (truncated) {
    const last = lines[lines.length - 1] ?? "";
    lines[lines.length - 1] =
      last.length + 3 <= maxLineLen
        ? last + "..."
        : last.slice(0, maxLineLen - 3) + "...";
  }
  if (lines.length === 1) lines.push("");
  return lines;
};

const wrappedTick =
  ({ color = "#666", size = 12, maxLineLen = 14 } = {}) =>
  ({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
    const lines = wrapToTwoLines(payload.value, maxLineLen);
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize={size}
        fill={color}
        dominantBaseline="hanging"
      >
        <title>{payload.value}</title>
        <tspan x={x} dy="0.35em">
          {lines[0]}
        </tspan>
        <tspan x={x} dy="1.15em">
          {lines[1]}
        </tspan>
      </text>
    );
  };

/* ---------- types ---------- */

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
  setFilter?: (val: string) => void;
  dataKeys?: DataKeyConfig[];
  leftPadding?: number;
  showValueLabels?: boolean;
}

/* ---------- component ---------- */

export default function BarChart({
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
  showValueLabels = false,
}: BarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);

  // ✅ Only keep categories (rows) where at least one series > 0
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const hasPositive = (row: BarChartData) =>
      dataKeys.some((d) => Number(row[d.key] ?? 0) > 0);
    return data.filter(hasPositive);
  }, [data, dataKeys]);

  // (Optional) If *every* category got filtered out, you can show an empty state.
  const noData = filteredData.length === 0;

  return (
    <div className="w-full h-full">
      <div
        className={`flex items-center mb-4 ${
          !filter ? "justify-center" : "justify-between"
        }`}
      >
        <h3 className="text-base font-medium">{title}</h3>
        {filter && setFilter && (
          <div className="overflow-x-auto md:overflow-visible max-w-full px-2">
            <div className="flex gap-2 w-max">
              {["Revenue", "Profit", "KPIS"].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="min-w-[80px]"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={filteredData}
          margin={{ top: 5, right: 30, left: leftPadding, bottom: 48 }}
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
            tick={wrappedTick({
              color: isDark ? "#bbb" : "#666",
              size: 12,
              maxLineLen: 14,
            })}
            tickLine={false}
            axisLine={{
              stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
            }}
          />

          <YAxis
            tickFormatter={yAxisFormatter}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{
              stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
            }}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div
                  style={{
                    backgroundColor: isDark ? "#000" : "#fff",
                    borderColor: isDark ? "#333" : "#ccc",
                    borderRadius: "0.375rem",
                    padding: "0.5rem",
                    fontSize: "0.875rem",
                    color: isDark ? "#fff" : "#000",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    minWidth: 160,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {label}
                  </div>
                  {payload.map((p: any, i: number) => (
                    <div key={i} style={{ color: p.color }}>
                      {p.name}: {yAxisFormatter(p.value)}
                    </div>
                  ))}
                </div>
              );
            }}
          />

          {showLegend && !noData && (
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
              {showValueLabels && (
                <LabelList
                  dataKey={d.key}
                  position="top"
                  formatter={(val: number) => formatCompact(val)}
                  style={{ fill: isDark ? "#fff" : "#000", fontSize: 12 }}
                />
              )}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>

      {noData && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          No categories with values &gt; 0 to display.
        </div>
      )}
    </div>
  );
}
