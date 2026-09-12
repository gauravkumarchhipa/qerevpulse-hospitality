// "use client";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   LabelList,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";
// import { useTheme } from "@/app/theme-provider";
// import { Card } from "@/components/ui/card";
// import { useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { formatKM } from "@/utils/number";

// export default function ProfitLossWaterfallChart() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [hoveredType, setHoveredType] = useState<string | null>(null);

//   const { kpis }: any = useSelector((state: RootState) => state.dailyKpi);

//   // Build waterfall data whenever API data changes
//   // Build waterfall data whenever API data changes
//   const processedData = useMemo(() => {
//     const raw = kpis?.categoryProfitRawData;
//     if (!Array.isArray(raw) || raw.length === 0) return [];

//     let cumulative = 0;
//     const rows = raw.map((d: any) => {
//       const start = cumulative;
//       const value = Number(d?.value) || 0; // the delta for this step
//       cumulative += value;

//       return {
//         ...d,
//         start,
//         value, // used by the visible bar
//         delta: value, // <-- label should use this
//         cumulative: start + value,
//       };
//     });

//     rows.push({
//       name: "Total",
//       start: 0,
//       value: cumulative,
//       delta: cumulative, // show total on the Total bar
//       cumulative,
//       type: "total",
//     });

//     return rows;
//   }, [kpis?.categoryProfitRawData]);

//   const getColor = (type: string) => {
//     const dimColor = isDark ? "#374151" : "#d1d5db";
//     if (hoveredType && hoveredType !== type) return dimColor;
//     switch (type) {
//       case "increase":
//         return "#22c55e";
//       case "decrease":
//         return "#be123c";
//       case "total":
//         return "#334155";
//       default:
//         return "#6b7280";
//     }
//   };

//   const legendItems = [
//     { label: "Increase", color: "bg-green-500", type: "increase" },
//     { label: "Decrease", color: "bg-red-700", type: "decrease" },
//     { label: "Total", color: "bg-slate-700", type: "total" },
//   ];

//   // inside your component file (above the default export is fine)
//   function CustomTooltip({
//     active,
//     payload,
//     isDark,
//     totalShowsCumulative = true, // set false if you want Total to show only the last delta
//   }: {
//     active?: boolean;
//     payload?: any[];
//     label?: string;
//     isDark: boolean;
//     totalShowsCumulative?: boolean;
//   }) {
//     if (!active || !payload || payload.length === 0) return null;

//     // We only care about the datum (ignore the 'start' bar completely)
//     const p = payload.find((d) => d?.dataKey !== "start");
//     if (!p) return null;

//     const d = p.payload; // the row we built in processedData

//     // For non-total: show the delta value
//     // For total: show either the cumulative (start + value) or just value (last delta)
//     const raw =
//       d.type === "total" && totalShowsCumulative ? d.start + d.value : d.value;

//     const fmt = (v: number) => `${formatKM(v)}`;

//     return (
//       <div
//         style={{
//           backgroundColor: isDark ? "#000000" : "#ffffff",
//           border: `1px solid ${isDark ? "#444444" : "#e2e8f0"}`,
//           borderRadius: "0.375rem",
//           padding: "8px 10px",
//           fontSize: "0.875rem",
//           color: isDark ? "#ffffff" : "#000000",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//         }}
//       >
//         <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
//         <div>{fmt(raw)}</div>
//       </div>
//     );
//   }

//   // Optional: loading / empty state
//   if (!processedData.length) {
//     return (
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-center mb-2">
//           Profit/Loss Chart
//         </h3>
//         <div className="h-72 flex items-center justify-center text-sm text-muted-foreground">
//           Loading…
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <Card className="p-6">
//       <h3 className="text-lg font-semibold text-center mb-2">
//         Profit/Loss Chart
//       </h3>

//       {/* Legend */}
//       <div className="flex justify-center gap-6 mb-4 text-sm">
//         {legendItems.map(({ label, color, type }) => (
//           <span
//             key={type}
//             className={`flex items-center gap-2 cursor-pointer transition-opacity ${
//               hoveredType && hoveredType !== type ? "opacity-50" : "opacity-100"
//             }`}
//             onMouseEnter={() => setHoveredType(type)}
//             onMouseLeave={() => setHoveredType(null)}
//           >
//             <span className={`w-3 h-3 rounded-full ${color}`} />
//             {label}
//           </span>
//         ))}
//       </div>

//       <ResponsiveContainer width="100%" height={360}>
//         <BarChart
//           data={processedData}
//           margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
//         >
//           <XAxis
//             dataKey="name"
//             tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
//             axisLine={false}
//             tickLine={false}
//           />
//           <YAxis
//             domain={["auto", "auto"]}
//             tickFormatter={(v) => `${formatKM(v)}`}
//             tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
//             axisLine={false}
//             tickLine={false}
//           />
//           <Tooltip
//             content={
//               <CustomTooltip
//                 isDark={isDark}
//                 totalShowsCumulative={true} // <- set to false if you want Total to show ONLY the last step (b), not a+b
//               />
//             }
//           />

//           {/* IMPORTANT: Offset bar FIRST */}
//           <Bar
//             dataKey="start"
//             stackId="a"
//             fill="transparent"
//             isAnimationActive={false}
//           />

//           {/* Then the visible delta bar */}
//           <Bar dataKey="value" stackId="a">
//             <LabelList
//               dataKey="delta" // <-- use delta, not the stacked value
//               position="top"
//               formatter={(val: number) =>
//                 `${val < 0 ? "-" : ""}${formatKM(val)}`
//               }
//               style={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
//             />
//             {processedData.map((entry: any, idx: number) => (
//               <Cell
//                 key={entry.name ?? idx}
//                 fill={getColor(entry.type)}
//                 style={{ transition: "fill 0.3s ease" }}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </Card>
//   );
// }

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/app/theme-provider";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { formatKM } from "@/utils/number";

/* ---------- 2-line X-axis tick with ellipsis & hover tooltip ---------- */
function TwoLineTick({
  x,
  y,
  payload,
  fill = "#000",
  lineCharLimit = 10,
}: {
  x: number;
  y: number;
  payload: { value: string };
  fill?: string;
  lineCharLimit?: number;
}) {
  const full = String(payload.value ?? "");
  const words = full.split(/\s+/);

  const lines: string[] = ["", ""];
  let line = 0;

  for (const w of words) {
    const canAdd =
      (lines[line] ? lines[line].length + 1 : 0) + w.length <= lineCharLimit;

    if (canAdd) {
      lines[line] = lines[line] ? `${lines[line]} ${w}` : w;
    } else if (line === 0) {
      line = 1;
      if (w.length > lineCharLimit) {
        lines[1] = w.slice(0, Math.max(3, lineCharLimit - 1)) + "…";
        break;
      } else {
        lines[1] = w;
      }
    } else {
      const target = lines[1] ? `${lines[1]} ${w}` : w;
      lines[1] = target.slice(0, Math.max(3, lineCharLimit - 1)) + "…";
      break;
    }
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fontSize={12} fill={fill}>
        <title>{full}</title>
        <tspan x={0} dy={14}>
          {lines[0]}
        </tspan>
        <tspan x={0} dy={14}>
          {lines[1]}
        </tspan>
      </text>
    </g>
  );
}

export default function ProfitLossWaterfallChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const { kpis }: any = useSelector((state: RootState) => state.dailyKpi);

  // --- build waterfall rows ---
  const processedData = useMemo(() => {
    const raw = kpis?.categoryProfitRawData;
    if (!Array.isArray(raw) || raw.length === 0) return [];

    let cumulative = 0;
    const rows = raw.map((d: any) => {
      const start = cumulative;
      const value = Number(d?.value) || 0;
      cumulative += value;
      return {
        ...d,
        start,
        value,
        delta: value,
        cumulative: start + value,
      };
    });

    rows.push({
      name: "Total",
      start: 0,
      value: cumulative,
      delta: cumulative,
      cumulative,
      type: "total",
    });

    return rows;
  }, [kpis?.categoryProfitRawData]);

  const getColor = (type: string) => {
    const dim = isDark ? "#374151" : "#d1d5db";
    if (hoveredType && hoveredType !== type) return dim;
    switch (type) {
      case "increase":
        return "#22c55e";
      case "decrease":
        return "#be123c";
      case "total":
        return "#334155";
      default:
        return "#6b7280";
    }
  };

  // ---------- measure container width to compute a charLimit ----------
  const wrapRef = useRef<HTMLDivElement>(null);
  const [wrapWidth, setWrapWidth] = useState<number>(0);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? 0;
      setWrapWidth(w);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // chars per line at ~12px-font (~7px/char), ensure a minimum
  const lineCharLimit = useMemo(() => {
    if (!wrapWidth || processedData.length === 0) return 10;
    const pxPerLabel = wrapWidth / processedData.length;
    return Math.max(6, Math.floor(pxPerLabel / 7));
  }, [wrapWidth, processedData.length]);

  // ---------- custom tooltip ----------
  function CustomTooltip({
    active,
    payload,
    isDark,
    totalShowsCumulative = true,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
    isDark: boolean;
    totalShowsCumulative?: boolean;
  }) {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload.find((d) => d?.dataKey !== "start");
    if (!p) return null;
    const d = p.payload;
    const raw =
      d.type === "total" && totalShowsCumulative ? d.start + d.value : d.value;

    return (
      <div
        style={{
          backgroundColor: isDark ? "#000" : "#fff",
          border: `1px solid ${isDark ? "#444" : "#e2e8f0"}`,
          borderRadius: 6,
          padding: "8px 10px",
          fontSize: 14,
          color: isDark ? "#fff" : "#000",
          boxShadow: "0 4px 12px rgba(0,0,0,.2)",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
        <div>{formatKM(raw)}</div>
      </div>
    );
  }

  if (!processedData.length) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-center mb-2">
          Profit/Loss Chart
        </h3>
        <div className="h-72 flex items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-center mb-2">
        Profit/Loss Chart
      </h3>

      <div className="flex justify-center gap-6 mb-4 text-sm">
        {[
          { label: "Increase", color: "bg-green-500", type: "increase" },
          { label: "Decrease", color: "bg-red-700", type: "decrease" },
          { label: "Total", color: "bg-slate-700", type: "total" },
        ].map(({ label, color, type }) => (
          <span
            key={type}
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${
              hoveredType && hoveredType !== type ? "opacity-50" : "opacity-100"
            }`}
            onMouseEnter={() => setHoveredType(type)}
            onMouseLeave={() => setHoveredType(null)}
          >
            <span className={`w-3 h-3 rounded-full ${color}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Measured wrapper around the chart */}
      <div ref={wrapRef} style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <XAxis
              dataKey="name"
              interval={0} // show ALL labels
              minTickGap={0}
              axisLine={false}
              tickLine={false}
              tick={(props) => (
                <TwoLineTick
                  {...props}
                  fill={isDark ? "#fff" : "#000"}
                  lineCharLimit={lineCharLimit}
                />
              )}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(v) => formatKM(v)}
              tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={
                <CustomTooltip isDark={isDark} totalShowsCumulative={true} />
              }
            />

            {/* Invisible offset bar */}
            <Bar
              dataKey="start"
              stackId="a"
              fill="transparent"
              isAnimationActive={false}
            />

            {/* Visible delta bar */}
            <Bar dataKey="value" stackId="a">
              <LabelList
                dataKey="delta"
                position="top"
                formatter={(val: number) =>
                  `${val < 0 ? "-" : ""}${formatKM(Math.abs(val))}`
                }
                style={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
              />
              {processedData.map((row: any, i: number) => (
                <Cell
                  key={row.name ?? i}
                  fill={getColor(row.type)}
                  style={{ transition: "fill 0.3s ease" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
