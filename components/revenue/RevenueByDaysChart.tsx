// "use client";

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Rectangle,
//   RectangleProps,
// } from "recharts";
// import { useTheme } from "@/app/theme-provider";
// import { Card } from "@/components/ui/card";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// // Step 1: Raw revenue data
// const rawRevenue = [
//   { name: "Friday", value: 3687676 },
//   { name: "Sunday", value: 3693367 },
//   { name: "Monday", value: 3696148 },
//   { name: "Tuesday", value: 3696899 },
//   { name: "Wednesday", value: 3715362 },
//   { name: "Saturday", value: 3721241 },
//   { name: "Thursday", value: 3732203 },
// ];

// // Step 4: Chart component
// export default function RevenueByDaysWaterfallChart() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const { kpis } = useSelector((d: RootState) => d?.revenueKpi);
//   console.log(kpis?.RevenueByDay);

//   // Step 2: Convert to cumulative data
//   const revenueWaterfallData: any = kpis?.RevenueByDay?.reduce(
//     (acc: any, curr, idx) => {
//       const prevEnd = idx === 0 ? 0 : acc[idx - 1]?.end;
//       return [
//         ...acc,
//         {
//           ...curr,
//           start: prevEnd,
//           end: prevEnd + curr?.value,
//         },
//       ];
//     },
//     []
//   );

//   // Step 3: Custom bar shape with label above each bar
//   const CustomBarShape: any = (
//     props: RectangleProps & { payload: any; isDark: boolean }
//   ) => {
//     const { x = 0, width = 0, payload, isDark } = props;

//     const chartHeight = 300;
//     const maxY = revenueWaterfallData[revenueWaterfallData?.length - 1]?.end;
//     const yStart = ((maxY - payload?.start) / maxY) * chartHeight;
//     const yEnd = ((maxY - payload?.end) / maxY) * chartHeight;
//     const barHeight = yStart - yEnd;
//     const labelY = yEnd + barHeight / 2;

//     const fillColor = isDark ? "#f43f5e" : "#9b002d"; // Dark pink vs maroon

//     return (
//       <>
//         <Rectangle
//           x={x}
//           y={yEnd}
//           width={width}
//           height={barHeight}
//           fill={fillColor}
//           radius={[4, 4, 0, 0]}
//         />
//         <text
//           x={x + width / 2}
//           y={labelY}
//           fill="#fff"
//           fontSize={12}
//           textAnchor="middle"
//           dominantBaseline="middle"
//         >
//           {payload?.value?.toLocaleString()}
//         </text>
//       </>
//     );
//   };

//   const maxY = revenueWaterfallData[revenueWaterfallData?.length - 1].end;
//   const paddedMaxY = maxY + 2_000_000;
//   const roundedMaxY = Math?.ceil(paddedMaxY / 5_000_000) * 5_000_000;

//   return (
//     <Card className="p-6">
//       <h3 className="text-base font-medium mb-4 text-center">
//         Revenue by Days
//       </h3>
//       <ResponsiveContainer width="100%" height={350}>
//         <BarChart
//           data={revenueWaterfallData}
//           margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
//         >
//           <XAxis
//             dataKey="name"
//             tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
//             axisLine={{ stroke: isDark ? "#555" : "#ccc" }}
//           />
//           <YAxis
//             domain={[0, roundedMaxY]}
//             ticks={Array?.from(
//               { length: roundedMaxY / 5_000_000 + 1 },
//               (_, i) => i * 5_000_000
//             )}
//             tickFormatter={(v) => `${v / 1_000_000}M`}
//             tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
//             axisLine={{ stroke: isDark ? "#555" : "#ccc" }}
//           />
//           <Tooltip
//             formatter={(value: number) => [
//               `${value?.toLocaleString()}`,
//               "Revenue",
//             ]}
//             contentStyle={{
//               backgroundColor: isDark ? "#000" : "#fff",
//               borderColor: isDark ? "#333" : "#ddd",
//               fontSize: "0.875rem",
//               color: isDark ? "#fff" : "#000",
//             }}
//           />
//           <Bar
//             dataKey="value"
//             shape={(props: any) => (
//               <CustomBarShape {...props} isDark={isDark} />
//             )}
//             isAnimationActive={false}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </Card>
//   );
// }

"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Rectangle,
  RectangleProps,
} from "recharts";
import { useTheme } from "@/app/theme-provider";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMemo } from "react";

type Point = { name: string; value: number; start?: number; end?: number };

export default function RevenueByDaysWaterfallChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { kpis }: any = useSelector((d: RootState) => d.revenueKpi);
  // 1) Always have an array to work with
  const revenueByDay: { name: string; value: number }[] =
    kpis?.kpis?.RevenueByDay ?? [];

  const sortedRevenueByDay = [...revenueByDay].sort(
    (a, b) => a.value - b.value
  );

  // 2) Compute cumulative (waterfall) data safely
  const revenueWaterfallData: Point[] = useMemo(() => {
    if (!sortedRevenueByDay.length) return [];
    const out: Point[] = [];
    let prevEnd = 0;
    for (const curr of sortedRevenueByDay) {
      const end = prevEnd + (Number(curr?.value) || 0);
      out.push({
        name: curr?.name ?? "",
        value: Number(curr?.value) || 0,
        start: prevEnd,
        end,
      });
      prevEnd = end;
    }
    return out;
  }, [sortedRevenueByDay]);

  // 3) Axis domain/ticks with fallbacks
  const maxY = revenueWaterfallData.at(-1)?.end ?? 0;
  const paddedMaxY = maxY > 0 ? maxY + 2_000_000 : 1; // avoid 0/NaN
  const roundedMaxY =
    Math.ceil(paddedMaxY / 5_000_000) * 5_000_000 || 5_000_000;

  const ticks = useMemo(() => {
    if (roundedMaxY <= 0 || !Number.isFinite(roundedMaxY)) return [0, 1];
    const steps = Math.max(1, Math.floor(roundedMaxY / 5_000_000));
    return Array.from({ length: steps + 1 }, (_, i) => i * 5_000_000);
  }, [roundedMaxY]);

  // 4) Custom bar (guard against empty data)
  const CustomBarShape = (
    props: RectangleProps & { payload: any; isDark: boolean }
  ) => {
    const { x = 0, width = 0, payload, isDark } = props;

    const chartHeight = 300;
    const max = revenueWaterfallData.at(-1)?.end ?? 1; // avoid divide-by-zero
    const start = Number(payload?.start) || 0;
    const end = Number(payload?.end) || 0;

    const yStart = ((max - start) / max) * chartHeight;
    const yEnd = ((max - end) / max) * chartHeight;
    const barHeight = Math.max(0, yStart - yEnd);
    const labelY = yEnd + barHeight / 2;

    const fillColor = isDark ? "hsl(var(--chart-1))" : "hsl(var(--chart-3))";
    return (
      <>
        <Rectangle
          x={x}
          y={yEnd}
          width={width}
          height={barHeight}
          fill={fillColor}
          radius={[4, 4, 0, 0]}
        />
        <text
          x={x + width / 2}
          y={labelY}
          fill="#fff"
          fontSize={12}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {(Number(payload?.value) || 0).toLocaleString()}
        </text>
      </>
    );
  };

  const hasData = revenueWaterfallData.length > 0;

  // add above the component
  function TooltipContent({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) {
    if (!active || !payload?.length) return null;
    const v = Number(payload[0]?.payload?.value) || 0;

    return (
      <div
        style={{
          background: isDark ? "#000" : "#fff",
          color: isDark ? "#fff" : "#000",
          padding: "8px 10px",
          borderRadius: 6,
          border: isDark ? "1px solid #333" : "1px solid #fff",
          fontSize: "0.875rem",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
        <div>Revenue: {v.toLocaleString()}</div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-base font-medium mb-4 text-center">
        Revenue by Days
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={revenueWaterfallData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            axisLine={{ stroke: isDark ? "#555" : "#ccc" }}
          />
          <YAxis
            domain={[0, roundedMaxY]}
            ticks={ticks}
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            axisLine={{ stroke: isDark ? "#555" : "#ccc" }}
            allowDecimals={false}
          />
          <Tooltip content={<TooltipContent />} />
          <Bar
            dataKey="value"
            shape={(props: any) => (
              <CustomBarShape {...props} isDark={isDark} />
            )}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>

      {!hasData && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          No data yet.
        </div>
      )}
    </Card>
  );
}
