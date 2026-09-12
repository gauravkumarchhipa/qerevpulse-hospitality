// "use client";

// import dynamic from "next/dynamic";
// import { useMemo } from "react";
// import { Card } from "../ui/card";
// import { useTheme } from "@/app/theme-provider";

// const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// const RevenueRankingSankey = () => {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const sankeyConfig: any = useMemo(
//     () => ({
//       years: ["2022", "2023", "2024"],
//       locations: [
//         { name: "Abu Dhabi", color: "#FFD700" },
//         { name: "Ajman", color: "#FF7333" },
//         { name: "Fujairah", color: "#C70039" },
//         { name: "Ras Al Khaimah", color: "#900C3F" },
//         { name: "Umm Al Quwain", color: "#581845" },
//       ],
//       // Customize Y-positions per year
//       yearWiseYMap: {
//         "2022": [0.9, 0.7, 0.5, 0.3, 0.1],
//         "2023": [0.7, 0.6, 0.4, 0.4, 0.1],
//         "2024": [0.1, 0.3, 0.6, 0.5, 0.15],
//       },
//       xPositions: [
//         0,
//         0,
//         0,
//         0,
//         0, // 2022
//         0.5,
//         0.5,
//         0.5,
//         0.5,
//         0.5, // 2023
//         0.9,
//         0.9,
//         0.9,
//         0.9,
//         0.9, // 2024
//       ],
//       linkData: {
//         source: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//         target: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
//         value: [1292, 1286, 2083, 2090, 2076, 1309, 1669, 2087, 2084, 2090],
//         label: [
//           "1292K",
//           "1286K",
//           "2083K",
//           "2090K",
//           "2076K",
//           "1309K",
//           "1669K",
//           "2087K",
//           "2084K",
//           "2090K",
//         ],
//         color: [
//           "#FFD700",
//           "#FF7333",
//           "#C70039",
//           "#900C3F",
//           "#581845",
//           "#FFD700",
//           "#FF7333",
//           "#C70039",
//           "#900C3F",
//           "#581845",
//         ],
//       },
//     }),
//     []
//   );

//   const { years, locations, yearWiseYMap, xPositions, linkData } = sankeyConfig;
//   console.log(sankeyConfig)

//   const labels: string[] = [];
//   const nodeColors: string[] = [];
//   const x: number[] = [];
//   const y: number[] = [];

//   years.forEach((year: any) => {
//     const yForYear = yearWiseYMap[year];
//     locations.forEach((loc: any, locIdx: any) => {
//       const nodeIndex = labels.length;
//       labels.push(`${loc.name} ${year}`);
//       nodeColors.push(loc.color);
//       x.push(xPositions[nodeIndex]);
//       y.push(yForYear[locIdx]);
//     });
//   });

//   const sankeyData: any = {
//     type: "sankey",
//     orientation: "h",
//     arrangement: "snap",
//     node: {
//       pad: 15,
//       thickness: 20,
//       line: { color: "black", width: 0.5 },
//       label: labels,
//       color: nodeColors,
//       x: x,
//       y: y,
//     },
//     link: linkData,
//   };
//   return (
//     <Card className="p-6">
//       <Plot
//         data={[sankeyData]}
//         layout={{
//           title: {
//             text: "Revenue Ranking by Location",
//             font: { size: 24, color: isDark ? "#ffffff" : "#000000" },
//           },
//           paper_bgcolor: isDark ? "#0A0A0A" : "#ffffff",
//           plot_bgcolor: isDark ? "#0A0A0A" : "#ffffff",
//           font: {
//             size: 14,
//             color: isDark ? "#ffffff" : "#000000",
//           },
//           height: 500,
//         }}
//         config={{
//           responsive: true,
//           modeBarButtonsToRemove: [
//             "zoom2d",
//             "pan2d",
//             "select2d",
//             "lasso2d",
//             "zoomIn2d",
//             "zoomOut2d",
//             "autoScale2d",
//             "resetScale2d",
//             "hoverClosestCartesian",
//             "hoverCompareCartesian",
//             "toggleSpikelines",
//             "sendDataToCloud",
//           ],
//           displaylogo: false,
//         }}
//         style={{ width: "100%" }}
//         useResizeHandler={true}
//       />
//     </Card>
//   );
// };

// export default RevenueRankingSankey;

"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTheme } from "@/app/theme-provider";
import { useMemo } from "react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
const EQUAL_WIDTH = true;

/** ---- A tiny mock so the chart always renders if API is empty ---- */
const MOCK_SANKEY = {
  years: ["2024", "2025"],
  locations: ["Abu Dhabi", "Ajman", "Fujairah"],
  node: {
    label: [
      "Abu Dhabi 2024",
      "Ajman 2024",
      "Fujairah 2024",
      "Abu Dhabi 2025",
      "Ajman 2025",
      "Fujairah 2025",
    ],
    color: ["#FFA500", "#B80F57", "#5B1849", "#FFA500", "#B80F57", "#5B1849"],
    x: [0, 0, 0, 1, 1, 1],
    y: [0.8, 0.6, 0.4, 0.8, 0.6, 0.4],
    rank: [1, 2, 3, 1, 3, 2],
    total: [2_100_000, 1_600_000, 1_200_000, 2_300_000, 1_100_000, 1_800_000],
  },
  link: {
    source: [0, 1, 2],
    target: [3, 4, 5],
    value: [2_300_000, 1_100_000, 1_800_000],
    label: ["2.30M", "1.10M", "1.80M"],
    color: ["#FFA500", "#B80F57", "#5B1849"],
    year: ["2025", "2025", "2025"], // target year per ribbon
    location: ["Abu Dhabi", "Ajman", "Fujairah"],
    rank: [1, 3, 2], // rank in target year
  },
};

/** Quick validator/normalizer so Plotly doesn’t crash on bad shapes. */
function normalizeSankey(raw: any) {
  if (!raw || !raw.node || !raw.link) return null;
  const nl = raw.node.label ?? [];
  const nx = raw.node.x ?? [];
  const ny = raw.node.y ?? [];
  const nc = raw.node.color ?? [];

  const N = Math.min(nl.length, nx.length, ny.length, nc.length);
  if (!N) return null;

  const node = {
    label: nl.slice(0, N).map(String),
    x: nx.slice(0, N).map(Number),
    y: ny.slice(0, N).map((v: any) => {
      const n = Number(v);
      // inset so labels don’t clip at canvas edges
      return Math.max(0.06, Math.min(0.94, Number.isFinite(n) ? n : 0.5));
    }),
    color: nc.slice(0, N).map(String),
    rank: (raw.node.rank ?? []).slice(0, N).map((v: any) => Number(v)),
    total: (raw.node.total ?? []).slice(0, N).map((v: any) => Number(v)),
  };

  const s = (raw.link.source ?? []).map(Number);
  const t = (raw.link.target ?? []).map(Number);
  const v = (raw.link.value ?? []).map(Number);

  const L = Math.min(s.length, t.length, v.length);
  if (!L) return null;

  for (let i = 0; i < L; i++) {
    if (s[i] < 0 || s[i] >= N || t[i] < 0 || t[i] >= N) return null;
  }

  const link = {
    source: s.slice(0, L),
    target: t.slice(0, L),
    value: v.slice(0, L),
    label: (raw.link.label ?? []).slice(0, L).map(String),
    color: (raw.link.color ?? []).slice(0, L).map(String),
    year: (raw.link.year ?? []).slice(0, L).map(String),
    location: (raw.link.location ?? []).slice(0, L).map(String),
    rank: (raw.link.rank ?? []).slice(0, L).map((x: any) => Number(x)),
  };

  return { node, link };
}

export default function RevenueRankingSankey() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { kpis }: any = useSelector((s: RootState) => s.revenueKpi);

  // use API data if valid, else fall back to mock so it always renders
  const sankeyRaw =
    kpis?.locationYearSankey && kpis.locationYearSankey.node
      ? kpis.locationYearSankey
      : MOCK_SANKEY;

  const safe = useMemo(() => normalizeSankey(sankeyRaw), [sankeyRaw]);

  const plotData: any = useMemo(() => {
    if (!safe) return [];

    // Node hover customdata: [year, location, rank, total]
    const nodeCustom = safe.node.label.map((lbl: string, i: number) => {
      const m = lbl.match(/^(.*)\s(\d{4})$/);
      const loc = (m?.[1] ?? lbl).trim();
      const yr = (m?.[2] ?? "").trim();
      return [
        yr,
        loc,
        safe.node.rank?.[i] ?? null,
        safe.node.total?.[i] ?? null,
      ];
    });

    // Link hover customdata: [year, location, revenue, rank]
    const linkCustom = safe.link.value.map((val: number, i: number) => [
      safe.link.year?.[i] ?? "",
      safe.link.location?.[i] ?? "",
      val,
      safe.link.rank?.[i] ?? null,
    ]);

    return [
      {
        type: "sankey" as const,
        orientation: "h",
        arrangement: "snap",
        domain: { x: [0, 1], y: [0.04, 0.96] },
        node: {
          pad: 15,
          thickness: 20,
          line: { color: isDark ? "#222" : "#ccc", width: 0.5 },
          label: safe.node.label,
          color: safe.node.color,
          x: safe.node.x,
          y: safe.node.y,
          customdata: nodeCustom,
          hovertemplate:
            "Year: %{customdata[0]}<br>" +
            "Location: %{customdata[1]}<br>" +
            "Rank: %{customdata[2]}<br>" +
            "Revenue: %{customdata[3]:,.2f}<extra></extra>",
        },
        link: {
          source: safe.link.source,
          target: safe.link.target,
          value: EQUAL_WIDTH
            ? Array(safe.link.value.length).fill(1)
            : safe.link.value,
          color: safe.link.color,
          label: safe.link.label,
          customdata: linkCustom,
          hovertemplate:
            "Year: %{customdata[0]}<br>" +
            "Location: %{customdata[1]}<br>" +
            "Revenue: %{customdata[2]:,.2f}<br>" +
            "Rank (that year): %{customdata[3]}<extra></extra>",
        },
      },
    ];
  }, [safe, isDark]);

  return (
    <Card className="p-6">
      <Plot
        data={plotData}
        layout={{
          title: {
            text: "Revenue Ranking by Location",
            font: { size: 16, color: isDark ? "#fff" : "#000" },
          },
          paper_bgcolor: isDark ? "#0A0A0A" : "#fff",
          plot_bgcolor: isDark ? "#0A0A0A" : "#fff",
          font: { size: 14, color: isDark ? "#fff" : "#000" },
          height: 536,
          margin: { t: 70, r: 40, b: 110, l: 40 },
        }}
        config={{
          responsive: true,
          modeBarButtonsToRemove: [
            "zoom2d",
            "pan2d",
            "select2d",
            "lasso2d",
            "zoomIn2d",
            "zoomOut2d",
            "autoScale2d",
            "resetScale2d",
            "hoverClosestCartesian",
            "hoverCompareCartesian",
            "toggleSpikelines",
            "sendDataToCloud",
          ],
          displaylogo: false,
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
      />
      {!plotData.length && (
        <div className="mt-3 text-sm text-center opacity-70">
          (No Sankey data or it failed validation)
        </div>
      )}
    </Card>
  );
}
