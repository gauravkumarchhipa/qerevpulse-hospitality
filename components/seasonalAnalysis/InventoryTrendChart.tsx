"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "@/app/theme-provider";
import { Card } from "@/components/ui/card";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

const hotelColors: Record<string, string> = {
  "Delta Hotels": "hsl(var(--chart-1))",
  "Hilton Jumeirah": "hsl(var(--chart-2))",
  "Hilton The Walk": "hsl(var(--chart-3))",
  "Merriott Hotel & Spa": "hsl(var(--chart-4))",
  "Taj Exotica Resort & Spa": "hsl(var(--chart-5))",
};

export default function SeasonalInventoryTrendChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { kpis }: any = useSelector((d: RootState) => d.seasonalKpi);
  const { seasonalAnalysisAppliedFilters } = useSelector(
    (state: RootState) => state.seasonalAnalysisFilter
  );

  const [hoveredHotel, setHoveredHotel] = useState<string | null>(null);

  // 1) Data source (safe fallback)
  const inventoryTrend: Record<string, { name: string; value: number }[]> =
    kpis?.inventoryTrend && Object.keys(kpis.inventoryTrend).length > 0
      ? kpis.inventoryTrend
      : {};

  // 2) Build an id->name map
  //    Priority: provided by API (kpis.hotelIdToName) -> local fallback from your list
  const idToName: Record<string, string> = useMemo(
    () =>
      kpis?.hotelIdToName ?? {
        I005: "Delta Hotels",
        I001: "Hilton Jumeirah",
        I002: "Hilton The Walk",
        I004: "Merriott Hotel & Spa",
        I003: "Taj Exotica Resort & Spa",
      },
    [kpis?.hotelIdToName]
  );

  // 3) All hotel display names available in the series
  const allHotelNames = useMemo(
    () => Object.keys(inventoryTrend),
    [inventoryTrend]
  );

  // 4) Normalize user-selected hotels (IDs or names) -> names present in data
  const filteredHotels: string[] = useMemo(() => {
    const selected = seasonalAnalysisAppliedFilters?.hotel ?? [];

    if (selected.length === 0) return allHotelNames;

    // Convert each selection to a name if it's an ID; keep as-is if it's already a name
    const normalized = selected
      .map((h: string) => idToName[h] || h)
      // Keep only hotels that exist in the data
      .filter((name: string) => allHotelNames.includes(name));

    // If nothing matched (e.g., mismatch), fall back to all
    return normalized.length > 0 ? normalized : allHotelNames;
  }, [seasonalAnalysisAppliedFilters?.hotel, idToName, allHotelNames]);

  // 5) Quarter filter (default: all)
  const filteredQuarters: string[] =
    seasonalAnalysisAppliedFilters?.quarter?.length > 0
      ? seasonalAnalysisAppliedFilters.quarter
      : ["qtr1", "qtr2", "qtr3", "qtr4"];

  // 6) Chart data
  const chartData = useMemo(() => {
    return filteredQuarters.map((qtr) => {
      const entry: Record<string, any> = { name: qtr };
      filteredHotels.forEach((hotel) => {
        const found = inventoryTrend[hotel]?.find((d) => d.name === qtr);
        entry[hotel] = found?.value ?? 0;
      });
      return entry;
    });
  }, [filteredQuarters, filteredHotels, inventoryTrend]);

  const getFillColor = (hotel: string) => {
    const c = hotelColors[hotel] ?? (isDark ? "#6b7280" : "#9ca3af");
    if (!hoveredHotel || hoveredHotel === hotel) return c;
    return isDark ? "#374151" : "#d1d5db";
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-center mb-4">
        Inventory Trend over Time
      </h3>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
        {filteredHotels.map((hotel) => (
          <span
            key={hotel}
            className="flex items-center gap-2 cursor-pointer transition-opacity"
            onMouseEnter={() => setHoveredHotel(hotel)}
            onMouseLeave={() => setHoveredHotel(null)}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: hotelColors[hotel] }}
            />
            <span style={{ color: isDark ? "#fff" : "#000" }}>{hotel}</span>
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          barGap={4}
          barCategoryGap="10%"
          // more room above the tallest bar+label
          margin={{ top: 36, right: 20, left: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="name"
            tickFormatter={(val) => String(val).toUpperCase()}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Let Recharts add headroom: top = dataMax + 0.06 */}
          <YAxis
            domain={[0, "dataMax + 0.06"]}
            // remove hardcoded ticks or extend if you prefer fixed ones:
            // ticks={[0.0, 0.2, 0.4, 0.6]}
            tickFormatter={(v) => Number(v).toFixed(2)}
            tick={{ fontSize: 12, fill: isDark ? "#fff" : "#000" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value: number, name: string) => [
              Number(value).toFixed(2),
              name,
            ]}
            contentStyle={{
              backgroundColor: isDark ? "#000" : "#fff",
              borderColor: isDark ? "#374151" : "#e2e8f0",
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              color: isDark ? "#fff" : "#000",
            }}
            labelStyle={{
              color: isDark ? "#fff" : "#000",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
            itemStyle={{ color: isDark ? "#fff" : "#000" }}
          />

          {filteredHotels.map((hotel) => (
            <Bar key={hotel} dataKey={hotel} radius={[4, 4, 0, 0]}>
              {chartData.map((_, idx) => (
                <Cell
                  key={`cell-${hotel}-${idx}`}
                  fill={getFillColor(hotel)}
                  style={{ transition: "fill 0.3s ease" }}
                />
              ))}
              <LabelList
                dataKey={hotel}
                position="top"
                // small positive offset keeps label inside the padded domain
                offset={6}
                formatter={(val: number) => Number(val).toFixed(2)}
                style={{ fill: isDark ? "#fff" : "#000", fontSize: 12 }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
