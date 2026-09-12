"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  Cell,
} from "recharts";
import { useMemo } from "react";
import { useTheme } from "@/app/theme-provider";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const lightBarColor = "hsl(var(--chart-3))";
const darkBarColor = "hsl(var(--chart-2))";

export function formatCompact(num: number): string {
  if (num == null || isNaN(num)) return "—";
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (abs >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (abs >= 1_000) return (num / 1_000).toFixed(2) + "K";
  return num.toString();
}

function CustomTooltip({
  active,
  payload,
  label,
  isDark,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  isDark: boolean;
}) {
  if (!active || !payload?.length) return null;
  const { value, adr } = payload[0].payload;
  return (
    <div
      style={{
        background: isDark ? "#000" : "#fff",
        border: `1px solid ${isDark ? "#374151" : "#e2e8f0"}`,
        padding: "8px 10px",
        borderRadius: "6px",
        color: isDark ? "#f9fafb" : "#1f2937",
        fontSize: "0.875rem",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div>Revenue: {formatCompact(Number(value))}</div>
      <div>ADR: {Number(adr || 0).toFixed(2)}</div>
    </div>
  );
}

export default function RoomRevenueSimpleBar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const barColor = isDark ? darkBarColor : lightBarColor;

  const { kpis }: any = useSelector((d: RootState) => d.revenueKpi);

  // 🔎 remove months where both value and adr are 0 (or missing)
  const data = useMemo(() => {
    const src = kpis?.roomRevenueMonthly ?? [];
    return src.filter((row: any) => {
      const v = Number(row?.value) || 0;
      const a = Number(row?.adr) || 0;
      return v !== 0 || a !== 0;
    });
  }, [kpis?.roomRevenueMonthly]);

  if (!data.length) {
    return (
      <Card className="p-6">
        <h3 className="text-base font-medium mb-4 text-center">Room Revenue</h3>
        <div className="text-sm text-center text-muted-foreground">
          No months to display (all months have value & ADR = 0).
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-base font-medium mb-4 text-center">Room Revenue</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
        >
          <XAxis
            dataKey="name"
            interval={0}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
          />
          <YAxis
            tickFormatter={(v) => (v / 1_000_000).toFixed(2) + "M"}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(val: number) => formatCompact(Number(val) || 0)}
              style={{ fill: isDark ? "#fff" : "#000", fontSize: 12 }}
            />
            {data.map((_:any, i:number) => (
              <Cell key={`cell-${i}`} fill={barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
