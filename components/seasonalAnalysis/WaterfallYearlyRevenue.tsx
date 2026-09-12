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
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { formatKM } from "@/utils/number";

/** X-axis tick: wrap to 2 lines; if overflow, show … on line 2. */
function AxisTick({
  x,
  y,
  payload,
  fill = "#000",
  lineCharLimit = 10, // chars per line (we'll pass what you compute)
}: {
  x: number;
  y: number;
  payload: { value: string };
  fill?: string;
  lineCharLimit?: number;
}) {
  const full = String(payload.value ?? "");

  // --- simple word-wrapping into two lines ---
  const words = full.split(/\s+/);
  const lines: string[] = ["", ""]; // line 0 and line 1
  let line = 0;

  for (const w of words) {
    const canAdd =
      (lines[line] ? lines[line].length + 1 : 0) + w.length <= lineCharLimit;

    if (canAdd) {
      lines[line] = lines[line] ? `${lines[line]} ${w}` : w;
    } else if (line === 0) {
      // move to second line
      line = 1;
      if (w.length > lineCharLimit) {
        lines[1] = w.slice(0, Math.max(3, lineCharLimit - 1)) + "…";
        // overflow; stop
        break;
      } else {
        lines[1] = w;
      }
    } else {
      // line 2 would overflow → ellipsize second line
      lines[1] =
        lines[1].length > lineCharLimit
          ? lines[1].slice(0, Math.max(3, lineCharLimit - 1)) + "…"
          : (lines[1] + " " + w).slice(0, Math.max(3, lineCharLimit - 1)) + "…";
      break;
    }
  }

  // Trim empty second line if not used
  const [l1, l2] = [lines[0], lines[1] || ""];

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fontSize={12} fill={fill}>
        {/* Native tooltip with the full label */}
        <title>{full}</title>
        {/* first line */}
        <tspan x={0} dy={14}>
          {l1}
        </tspan>
        {/* second line (always allocate space for consistent height);
            if empty we render empty string */}
        <tspan x={0} dy={14}>
          {l2}
        </tspan>
      </text>
    </g>
  );
}

export default function WaterfallYearlyRevenue() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { kpis }: any = useSelector((d: RootState) => d.seasonalKpi);

  // ----- measure container width so we can choose a smart charLimit -----
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
  // ----------------------------------------------------------------------

  const data = kpis?.yearlyRevenue ?? [];

  // Compute ~how many characters fit per label
  const charLimit = useMemo(() => {
    if (!wrapWidth || !data.length) return 10; // fallback
    const pxPerLabel = wrapWidth / data.length; // space per category
    return Math.max(5, Math.floor(pxPerLabel / 7)); // ~7px per char at 12px font
  }, [wrapWidth, data.length]);

  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const getColor = (type: string) => {
    const dim = isDark ? "#374151" : "#d1d5db";
    if (hoveredType && hoveredType !== type) return dim;
    switch (type) {
      case "increase":
        return "#22c55e";
      case "decrease":
        return "#ef4444";
      case "total":
        return "#0e7490";
      default:
        return "#6b7280";
    }
  };

  const legendItems = [
    { label: "Increase", color: "bg-green-500", type: "increase" },
    { label: "Decrease", color: "bg-red-500", type: "decrease" },
    { label: "Total", color: "bg-cyan-700", type: "total" },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-center mb-2">Yearly Revenue</h3>

      <div className="flex justify-center gap-6 mb-4 text-sm">
        {legendItems.map(({ label, color, type }) => (
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

      {/* The container we measure */}
      <div ref={wrapRef} style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              minTickGap={0}
              axisLine={false}
              tickLine={false}
              // ✅ Pass a function so Recharts injects x, y, payload
              tick={(props) => (
                <AxisTick
                  {...props} // x, y, payload from Recharts
                  fill={isDark ? "#fff" : "#000"}
                  lineCharLimit={charLimit} // your computed per-line limit
                />
              )}
            />

            <YAxis
              tickFormatter={(v) => formatKM(Number(v))}
              tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [formatKM(value), "Revenue"]}
              contentStyle={{
                backgroundColor: isDark ? "#000" : "#fff",
                borderColor: isDark ? "#374151" : "#e2e8f0",
                color: isDark ? "#fff" : "#000",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
              }}
              labelStyle={{
                color: isDark ? "#fff" : "#000",
                fontSize: "0.875rem",
                fontWeight: 700,
              }}
              itemStyle={{ color: isDark ? "#fff" : "#000" }}
            />

            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                formatter={(val: number) => formatKM(val)}
                style={{ fill: isDark ? "#fff" : "#000", fontSize: 12 }}
              />
              {data.map((d: any, i: number) => (
                <Cell
                  key={i}
                  fill={getColor(d.type)}
                  style={{ transition: "fill .3s ease" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
