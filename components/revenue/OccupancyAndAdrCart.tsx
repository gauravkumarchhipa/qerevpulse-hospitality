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
  ZAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Fallback demo data
const FALLBACK = [
  { name: "Delta Hotels",         occupancyRate: 0.585, revenue: 2300000, adr: 420, fill: "#3c003c" },
  { name: "Hilton Jumeirah",      occupancyRate: 0.579, revenue: 2100000, adr: 395, fill: "#f1c40f" },
  { name: "Hilton The Walk",      occupancyRate: 0.478, revenue: 1600000, adr: 330, fill: "#ff6f61" },
  { name: "Merriott Hotel & Spa", occupancyRate: 0.378, revenue: 1800000, adr: 360, fill: "#d7263d" },
  { name: "Taj Exotica Resort & Spa", occupancyRate: 0.179, revenue: 1100000, adr: 290, fill: "#663399" },
];

const formatPct   = (n: number) => `${(n * 100).toFixed(2)}%`;
const formatMoney = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(2) + "M"
: n >= 1_000     ? (n / 1_000).toFixed(2) + "K"
                 : n.toFixed(0);
const formatADR = (n: number) =>
  Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, occupancyRate, revenue, adr } = payload[0].payload;
  return (
    <div className="p-3 rounded shadow text-sm bg-white text-black dark:bg-black dark:text-white">
      <strong className="block mb-1">{name}</strong>
      <div>Occupancy: {formatPct(Number(occupancyRate) || 0)}</div>
      <div>Revenue: {formatMoney(Number(revenue) || 0)}</div>
      <div>ADR: {formatADR(Number(adr) || 0)}</div>
    </div>
  );
};

export default function OccupancyRevenueAdrChart({ showGrid = false }: { showGrid?: boolean }) {
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);
  const { kpis }: any = useSelector((d: RootState) => d.revenueKpi);

  // Prefer the API array if present; accept either key
  const apiArray =
    (Array.isArray(kpis?.occupancyAdrByHotel) && kpis.occupancyAdrByHotel) ||
    (Array.isArray(kpis?.occAdrByHotel) && kpis.occAdrByHotel) ||
    null;

  // Sort by revenue ASC so smaller bubbles render first (larger on top)
  const dataSorted = useMemo(() => {
    const base = apiArray ?? FALLBACK;
    const safe = Array.isArray(base) ? base : [];
    return [...safe]
      .filter(d => Number.isFinite(Number(d?.revenue)))
      .sort((a, b) => Number(a.revenue) - Number(b.revenue));
  }, [apiArray]);

  const legendPayload = useMemo(
    () =>
      dataSorted.map(d => ({
        value: d.name,
        type: "circle" as const,
        color: d.fill,
        id: d.name,
      })),
    [dataSorted]
  );

  // Custom shape that uses ZAxis-provided pixel size
  const shapeWithHover = (props: any) => {
    const isActive = hoveredLegend === null || hoveredLegend === props?.payload?.name;
    return (
      <g opacity={isActive ? 1 : 0.35}>
        <circle
          cx={props?.cx}
          cy={props?.cy}
          r={props?.size /* from ZAxis */}
          fill={props?.payload?.fill}
          stroke="#00000022"
        />
      </g>
    );
  };

  return (
    <Card className="p-6">
      <h3 className="text-base font-medium mb-4 text-center">Occupancy & ADR by Hotel</h3>

      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 24, left: 28 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}

          <XAxis
            type="number"
            dataKey="occupancyRate"
            name="Occupancy"
            tickFormatter={(v) => (Number(v) || 0).toFixed(3)}
            domain={[0, 1]}
            label={{ value: "Occupancy Rate", position: "insideBottom", dy: 10 }}
          />

          <YAxis
            type="number"
            dataKey="adr"
            name="ADR"
            domain={["auto", "auto"]}
            tickFormatter={(v) => formatADR(Number(v))}
            label={{ value: "ADR", angle: -90, position: "insideLeft", dx: -5 }}
          />

          {/* Bubble radius scales with revenue (px). Adjust range to taste. */}
          <ZAxis type="number" dataKey="revenue" range={[6, 22]} />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            content={() => (
              <ul className="flex flex-wrap justify-center gap-4 text-xs mt-2">
                {legendPayload.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-1 cursor-pointer"
                    onMouseEnter={() => setHoveredLegend(entry.value)}
                    onMouseLeave={() => setHoveredLegend(null)}
                  >
                    <span
                      className="inline-block rounded-full"
                      style={{ width: 10, height: 10, backgroundColor: entry.color }}
                    />
                    <span>{entry.value}</span>
                  </li>
                ))}
              </ul>
            )}
          />

          <Scatter name="Hotels" data={dataSorted} shape={shapeWithHover} />
        </ScatterChart>
      </ResponsiveContainer>

      {!dataSorted.length && (
        <div className="mt-3 text-sm text-center opacity-70">(No data)</div>
      )}
    </Card>
  );
}
