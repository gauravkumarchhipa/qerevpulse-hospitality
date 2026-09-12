// const revenueData = [
//   {
//     year: 2022,
//     quarter: "Qtr 1",
//     revenue: 510303,
//     cumulativeRevenue: 510303,
//     lastYearRevenue: null,
//     variancePercent: 8.71,
//   },
//   {
//     year: 2022,
//     quarter: "Qtr 2",
//     revenue: 521980,
//     cumulativeRevenue: 1032283,
//     lastYearRevenue: null,
//     variancePercent: 8.91,
//   },
//   {
//     year: 2023,
//     quarter: "Qtr 4",
//     revenue: 525223,
//     cumulativeRevenue: 2087472,
//     lastYearRevenue: 517130,
//     variancePercent: 8.85,
//   },
//   {
//     year: 2024,
//     quarter: "Qtr 4",
//     revenue: 136115,
//     cumulativeRevenue: 1706566,
//     lastYearRevenue: 132837,
//     variancePercent: 2.25,
//   },
//   {
//     year: 2025,
//     quarter: "Qtr 4",
//     revenue: 2324923,
//     cumulativeRevenue: 7869025,
//     lastYearRevenue: 2319467,
//     variancePercent: -0.06,
//   },
// ];

// export default function RevenueVarianceTable() {
//   const { kpis }: any = useSelector((d: RootState) => d.seasonalKpi);
//   return (
//     <Card className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-base font-medium text-black dark:text-white">
//           Revenue Summary
//         </h2>
//       </div>

//       <div className="max-h-[500px] overflow-auto border rounded-md bg-white dark:bg-black relative">
//         <Table className="min-w-[1000px]">
// <TableHeader>
//   <TableRow className="sticky top-0 z-50 bg-blue-100 dark:bg-blue-900">
//     <TableHead className="text-black dark:text-white">Year</TableHead>
//     <TableHead className="text-black dark:text-white">
//       Quarter
//     </TableHead>
//     <TableHead className="text-left text-black dark:text-white">
//       Revenue
//     </TableHead>
//     <TableHead className="text-right text-black dark:text-white">
//       Cumulative Revenue
//     </TableHead>
//     <TableHead className="text-right text-black dark:text-white">
//       Last Year Revenue
//     </TableHead>
//     <TableHead className="text-right text-black dark:text-white">
//       %GT Sum of Variance
//     </TableHead>
//   </TableRow>
// </TableHeader>

//           <TableBody>
//             {kpis?.quarterlyTimeline?.map((row: any, index: number) => {
//               const isPositive = row.variancePercent >= 0;
//               return (
//                 <TableRow
//                   key={index}
//                   className={
//                     index % 2 === 0
//                       ? "bg-white dark:bg-black"
//                       : "bg-gray-100 dark:bg-blue-950"
//                   }
//                 >
//                   <TableCell>{row?.year}</TableCell>
//                   <TableCell>{row?.quarter}</TableCell>
//                   <TableCell className="text-left">
//                     {/* {row?.revenue?.toLocaleString()} */}
//                     <div className="flex justify-start items-center gap-2">
//                       <div className="h-3 w-20 bg-green-100">
//                         <div
//                           className="h-3 bg-green-400"
//                           style={{ width: 50 }}
//                         ></div>
//                       </div>
//                       <span>{row?.revenue?.toLocaleString()}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {row?.cumulativeRevenue?.toLocaleString()}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {row?.lastYearRevenue
//                       ? row?.lastYearRevenue?.toLocaleString()
//                       : "—"}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="">{row?.variancePercent?.toFixed(2)}%</div>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
//     </Card>
//   );
// }

// ************************************************************

// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card } from "@/components/ui/card";
// import { RootState } from "@/store/store";
// import { useSelector } from "react-redux";
// import { useMemo } from "react";

// export default function RevenueVarianceTable() {
//   const { kpis }: any = useSelector((d: RootState) => d.seasonalKpi);
//   const rows = kpis?.quarterlyTimeline ?? [];

//   // ---- normalize width 0..100 based on revenue across visible rows ----
//   const { minRev, maxRev } = useMemo(() => {
//     const vals = rows.map((r: any) => Number(r?.revenue) || 0);
//     const max = Math.max(1, ...vals);
//     const min = Math.min(...vals);
//     return { minRev: min, maxRev: max };
//   }, [rows]);

//   const barPct = (rev: number) => {
//     const v = Number(rev) || 0;
//     // normalize between min..max; fallback to 100% if all equal
//     const pct =
//       maxRev === minRev ? 100 : ((v - minRev) / (maxRev - minRev)) * 100;
//     // keep a tiny minimum so very small values are still visible
//     return Math.max(6, Math.min(100, pct));
//   };

//   return (
//     <Card className="p-4">
//       {/* header ... */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-base font-medium text-black dark:text-white">
//           Revenue Summary
//         </h2>
//       </div>

//       <div className="max-h-[500px] overflow-auto border rounded-md bg-white dark:bg-black relative">
//         <Table className="min-w-[1000px]">
//           <TableHeader>
//             <TableRow className="sticky top-0 z-50 bg-blue-100 dark:bg-blue-900">
//               <TableHead className="text-black dark:text-white">Year</TableHead>
//               <TableHead className="text-black dark:text-white">
//                 Quarter
//               </TableHead>
//               <TableHead className="text-left text-black dark:text-white">
//                 Revenue
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 Cumulative Revenue
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 Last Year Revenue
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 %GT Sum of Variance
//               </TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {rows.map((row: any, index: number) => (
//               <TableRow
//                 key={index}
//                 className={
//                   index % 2 === 0
//                     ? "bg-white dark:bg-black"
//                     : "bg-gray-100 dark:bg-blue-950"
//                 }
//               >
//                 <TableCell>{row?.year}</TableCell>
//                 <TableCell>{row?.quarter}</TableCell>

//                 {/* Revenue with value-sized bar */}
//                 <TableCell className="text-left">
//                   <div className="flex items-center gap-2">
//                     <div
//                       className="relative h-3 w-24 rounded bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden"
//                       aria-label="revenue bar"
//                       title={`${row?.revenue?.toLocaleString()}`}
//                     >
//                       <div
//                         className="absolute inset-y-0 left-0 rounded bg-emerald-500 dark:bg-emerald-400"
//                         style={{ width: `${barPct(row?.revenue)}%` }}
//                       />
//                     </div>
//                     <span className="tabular-nums">
//                       {row?.revenue?.toLocaleString()}
//                     </span>
//                   </div>
//                 </TableCell>

//                 <TableCell className="text-right">
//                   {row?.cumulativeRevenue?.toLocaleString()}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   {row?.lastYearRevenue
//                     ? row?.lastYearRevenue?.toLocaleString()
//                     : "—"}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <div className="flex items-center gap-2 justify-end">
//                     <div
//                       className="relative h-3 w-24 rounded bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden"
//                       aria-label="revenue bar"
//                       title={`${row.variancePercent.toFixed(2)}`}
//                     >
//                       <div
//                         className="absolute inset-y-0 left-0 rounded bg-emerald-500 dark:bg-emerald-400"
//                         style={{ width: `${barPct(row?.variancePercent)}%` }}
//                       />
//                     </div>
//                     <span className="tabular-nums">
//                       ${row.variancePercent.toFixed(2)}%
//                     </span>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </Card>
//   );
// }

"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function RevenueVarianceTable() {
  const { kpis }: any = useSelector((d: RootState) => d.seasonalKpi);
  const rows = kpis?.quarterlyTimeline ?? [];

  // --- revenue bar scaling ---
  const { minRev, maxRev } = useMemo(() => {
    const vals = rows.map((r: any) => Number(r?.revenue) || 0);
    const max = Math.max(1, ...vals);
    const min = Math.min(...vals);
    return { minRev: min, maxRev: max };
  }, [rows]);

  const barPctRevenue = (rev: number) => {
    const v = Number(rev) || 0;
    const pct =
      maxRev === minRev ? 100 : ((v - minRev) / (maxRev - minRev)) * 100;
    return Math.max(6, Math.min(100, pct));
  };

  // --- variance bar scaling ---
  const { maxAbsVar } = useMemo(() => {
    const vals = rows.map((r: any) =>
      Math.abs(Number(r?.variancePercent) || 0)
    );
    const max = Math.max(0, ...vals);
    return { maxAbsVar: max };
  }, [rows]);

  const nearZero = (v: number) => Math.abs(v || 0) < 1e-6 || Object.is(v, -0);

  const barPctVar = (v: number) => {
    if (maxAbsVar === 0) return 0;
    const pct = (Math.abs(v || 0) / maxAbsVar) * 100;
    return Math.max(6, Math.min(100, pct));
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium text-black dark:text-white">
          Revenue Summary
        </h2>
      </div>

      <div className="max-h-[500px] overflow-auto border rounded-md bg-white dark:bg-black relative">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="sticky top-0 z-50 bg-blue-100 dark:bg-blue-900">
              <TableHead className="text-black dark:text-white">Year</TableHead>
              <TableHead className="text-black dark:text-white">
                Quarter
              </TableHead>
              <TableHead className="text-left text-black dark:text-white">
                Revenue
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Cumulative Revenue
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Last Year Revenue
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                %GT Sum of Variance
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-black"
                    : "bg-gray-100 dark:bg-blue-950"
                }
              >
                <TableCell>{row?.year}</TableCell>
                <TableCell>{row?.quarter}</TableCell>

                {/* Revenue with bar */}
                <TableCell className="text-left">
                  <div className="flex items-center gap-2">
                    <div
                      className="relative h-3 w-24 rounded bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden"
                      aria-label="revenue bar"
                      title={`${row?.revenue?.toLocaleString()}`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded bg-emerald-500 dark:bg-emerald-400"
                        style={{ width: `${barPctRevenue(row?.revenue)}%` }}
                      />
                    </div>
                    <span className="tabular-nums">
                      {row?.revenue?.toLocaleString()}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  {row?.cumulativeRevenue?.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {row?.lastYearRevenue
                    ? row?.lastYearRevenue?.toLocaleString()
                    : "—"}
                </TableCell>

                {/* Variance with bar */}
                <TableCell className="text-right">
                  {
                    <div className="flex items-center gap-2 justify-end">
                      <div
                        className="relative h-3 w-24 rounded overflow-hidden bg-emerald-100 dark:bg-emerald-900/40"
                        aria-label="variance bar"
                        title={`${row.variancePercent.toFixed(2)}%`}
                      >
                        <div
                          className={`absolute inset-y-0 left-0 rounded ${
                            row.variancePercent >= 0
                              ? "bg-emerald-500 dark:bg-emerald-400"
                              : "bg-red-500 dark:bg-red-400"
                          }`}
                          style={{
                            width: `${barPctVar(row?.variancePercent)}%`,
                          }}
                        />
                      </div>
                      <span className="tabular-nums">
                        {row.variancePercent.toFixed(2)}%
                      </span>
                    </div>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
