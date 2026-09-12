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
// import { useMemo, useRef, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/store/store";

// const CHUNK = 300; // how many new rows to add per step
// const MAX_RENDER = 100000; // safety cap so nothing can crash the tab

// const formatPct = (n: number) => `${(n * 100).toFixed(2)}%`;
// const formatInt = (n: number | null | undefined) =>
//   n == null ? "—" : n.toLocaleString();
// const formatMoney = (n: number) =>
//   n.toLocaleString(undefined, { minimumFractionDigits: 2 });

// export default function DailyRevenueTable() {
//   const { kpis }: any = useSelector((s: RootState) => s.dailyKpi);

//   // dataset
//   const rows: any[] = useMemo(
//     () => kpis?.revenueEventRows ?? [],
//     [kpis?.revenueEventRows]
//   );

//   const [visible, setVisible] = useState(Math.min(CHUNK, rows.length));
//   const sentinelRef = useRef<HTMLDivElement | null>(null);

//   // reset visible when data size changes
//   useEffect(() => {
//     setVisible(Math.min(CHUNK, rows.length));
//   }, [rows.length]);

//   // infinite scroll
//   useEffect(() => {
//     const el = sentinelRef.current;
//     if (!el) return;

//     const io = new IntersectionObserver(
//       (entries) => {
//         if (!entries.some((e) => e.isIntersecting)) return;
//         setVisible((v) => Math.min(v + CHUNK, rows.length, MAX_RENDER));
//       },
//       {
//         root: document.querySelector("#rev-scroll-root") as Element | null,
//         rootMargin: "1200px",
//       }
//     );

//     io.observe(el);
//     return () => io.disconnect();
//   }, [rows.length]);

//   const hasMore = visible < Math.min(rows.length, MAX_RENDER);

//   // ✅ compute the max actual amount (you can switch to visible rows if preferred)
//   const maxActual = useMemo(() => {
//     if (!rows.length) return 1; // avoids division by zero
//     let m = 0;
//     for (const r of rows) {
//       const v = Number(r?.actualAmount) || 0;
//       if (v > m) m = v;
//     }
//     return Math.max(1, m);
//   }, [rows]);

//   return (
//     <Card className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-base font-medium text-black dark:text-white">
//           Revenue Summary Table
//         </h2>
//         <div className="text-xs text-muted-foreground">
//           Showing {visible.toLocaleString()} of{" "}
//           {Math.min(rows.length, MAX_RENDER).toLocaleString()}
//         </div>
//       </div>

//       {/* scroll container (id used by IntersectionObserver root) */}
//       <div
//         id="rev-scroll-root"
//         className="max-h-[500px] overflow-auto border rounded-md bg-white dark:bg-black relative"
//       >
//         <Table className="min-w-[1200px]">
//           <TableHeader>
//             <TableRow className="sticky top-0 z-50 bg-blue-100 dark:bg-blue-900">
//               <TableHead className="text-black dark:text-white">Date</TableHead>
//               <TableHead className="text-black dark:text-white">
//                 Revenue Stream
//               </TableHead>
//               <TableHead className="text-black dark:text-white">
//                 Event Type
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 Actual Amount
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 Cumulative Revenue
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 Last Year Revenue
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 Budget
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 Variance %
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 Expense
//               </TableHead>
//               <TableHead className="text-right text-black dark:text-white">
//                 Calculated Profit/Loss
//               </TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {rows.slice(0, visible).map((row: any, index) => {
//               const isLoss = (row.profitLoss ?? 0) < 0;

//               // existing variance% bar width
//               const varianceBarWidth = `${Math.min(
//                 Math.abs(row.variancePercent ?? 0) * 100,
//                 100
//               )}%`;

//               // ✅ proportional width for Actual Amount bar
//               const actual = Number(row?.actualAmount) || 0;
//               const actualPct = Math.min(100, (actual / maxActual) * 100);
//               const actualWidth = actual > 0 ? Math.max(actualPct, 4) : 0; // optional 4% min

//               return (
//                 <TableRow
//                   key={row.id ?? `${row.date}-${row.eventType}-${index}`}
//                   className={
//                     index % 2 === 0
//                       ? "bg-white dark:bg-black"
//                       : "bg-gray-100 dark:bg-blue-950"
//                   }
//                 >
//                   <TableCell>{row.date}</TableCell>
//                   <TableCell>{row.revenueStream}</TableCell>
//                   <TableCell>{row.eventType}</TableCell>

//                   {/* 👇 Actual Amount with proportional bar */}
//                   <TableCell className="text-right">
//                     <div className="flex justify-end items-center gap-2">
//                       <div
//                         className="h-3 w-20 bg-green-100 rounded"
//                         title="Actual amount (relative)"
//                       >
//                         <div
//                           className="h-3 bg-green-500 rounded"
//                           style={{ width: `${actualWidth}%` }}
//                           title={formatInt(actual)}
//                         />
//                       </div>
//                       <span>{formatInt(row.actualAmount)}</span>
//                     </div>
//                   </TableCell>

//                   <TableCell className="text-right">
//                     {formatInt(row.cumulativeRevenue)}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {formatInt(row.lastYearRevenue)}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {formatInt(row.budget)}
//                   </TableCell>

//                   {/* Variance % (kept as your original percent bar) */}
//                   <TableCell className="text-right">
//                     <div className="flex justify-end items-center gap-2">
//                       <div
//                         className="h-3 w-20 bg-green-100 rounded"
//                         title="Variance %"
//                       >
//                         <div
//                           className="h-3 bg-green-400 rounded"
//                           style={{ width: varianceBarWidth }}
//                         />
//                       </div>
//                       <span>{formatPct(row.variancePercent ?? 0)}</span>
//                     </div>
//                   </TableCell>

//                   <TableCell className="text-right">
//                     {formatMoney(row.expense ?? 0)}
//                   </TableCell>

//                   <TableCell
//                     className={`text-right font-medium ${
//                       isLoss ? "text-red-600" : "text-green-600"
//                     }`}
//                   >
//                     <span className="inline-flex items-center gap-1">
//                       <span className="mr-1">{isLoss ? "▼" : "▲"}</span>
//                       {formatMoney(row.profitLoss ?? 0)}
//                     </span>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>

//         {/* sentinel for infinite loading */}
//         {hasMore && (
//           <div
//             ref={sentinelRef}
//             className="py-4 text-center text-xs text-muted-foreground"
//           >
//             Loading more…
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// }




"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

/* ----------------------------- constants ----------------------------- */
const CHUNK = 300; // how many new rows to add per step
const MAX_RENDER = 100000; // safety cap so nothing can crash the tab

/* ------------------------------- formatters ------------------------------- */
const formatPct = (n: number) => `${(n * 100).toFixed(2)}%`;
const formatInt = (n: number | null | undefined) =>
  n == null ? "—" : n.toLocaleString();
const formatMoney = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2 });

/* --------------------------- Memoized row component --------------------------- */
type RevenueRowProps = {
  row: any;
  index: number;
  maxActual: number;
};

const RevenueRow = React.memo(function RevenueRow({
  row,
  index,
  maxActual,
}: RevenueRowProps) {
  const isLoss = (row?.profitLoss ?? 0) < 0;

  // variance % bar width (kept from your original)
  const varianceBarWidth = `${Math.min(
    Math.abs(row?.variancePercent ?? 0) * 100,
    100
  )}%`;

  // proportional bar for actual amount (relative to maxActual)
  const actual = Number(row?.actualAmount) || 0;
  const actualPct = Math.min(100, (actual / Math.max(1, maxActual)) * 100);
  const actualWidth = actual > 0 ? Math.max(actualPct, 4) : 0; // min 4% so tiny values are still visible

  return (
    <TableRow
      className={
        index % 2 === 0
          ? "bg-white dark:bg-black"
          : "bg-gray-100 dark:bg-blue-950"
      }
    >
      <TableCell>{row?.date}</TableCell>
      <TableCell>{row?.revenueStream}</TableCell>
      <TableCell>{row?.eventType}</TableCell>

      {/* Actual Amount (relative bar + value) */}
      <TableCell className="text-right">
        <div className="flex justify-end items-center gap-2">
          <div
            className="h-3 w-20 bg-green-100 rounded"
            title="Actual amount (relative)"
          >
            <div
              className="h-3 bg-green-500 rounded"
              style={{ width: `${actualWidth}%` }}
              title={formatInt(actual)}
            />
          </div>
          <span>{formatInt(row?.actualAmount)}</span>
        </div>
      </TableCell>

      <TableCell className="text-right">
        {formatInt(row?.cumulativeRevenue)}
      </TableCell>
      <TableCell className="text-right">
        {formatInt(row?.lastYearRevenue)}
      </TableCell>
      <TableCell className="text-right">{formatInt(row?.budget)}</TableCell>

      {/* Variance % (percent bar + label) */}
      <TableCell className="text-right">
        <div className="flex justify-end items-center gap-2">
          <div className="h-3 w-20 bg-green-100 rounded" title="Variance %">
            <div
              className="h-3 bg-green-400 rounded"
              style={{ width: varianceBarWidth }}
            />
          </div>
          <span>{formatPct(row?.variancePercent ?? 0)}</span>
        </div>
      </TableCell>

      <TableCell className="text-right">
        {formatMoney(row?.expense ?? 0)}
      </TableCell>

      <TableCell
        className={`text-right font-medium ${
          isLoss ? "text-red-600" : "text-green-600"
        }`}
      >
        <span className="inline-flex items-center gap-1">
          <span className="mr-1">{isLoss ? "▼" : "▲"}</span>
          {formatMoney(row?.profitLoss ?? 0)}
        </span>
      </TableCell>
    </TableRow>
  );
});

/* --------------------------- Main (memoized) table --------------------------- */
const DailyRevenueTableInner: React.FC = () => {
  const { kpis }: any = useSelector((s: RootState) => s.dailyKpi);

  // dataset (memoized)
  const rows: any[] = useMemo(
    () => kpis?.revenueEventRows ?? [],
    [kpis?.revenueEventRows]
  );

  const [visible, setVisible] = useState(Math.min(CHUNK, rows.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // reset visible when data size changes
  useEffect(() => {
    setVisible(Math.min(CHUNK, rows.length));
  }, [rows.length]);

  // infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setVisible((v) => Math.min(v + CHUNK, rows.length, MAX_RENDER));
      },
      {
        root: document.querySelector("#rev-scroll-root") as Element | null,
        rootMargin: "1200px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rows.length]);

  const hasMore = visible < Math.min(rows.length, MAX_RENDER);

  // max actual amount across current dataset (memoized)
  const maxActual = useMemo(() => {
    if (!rows.length) return 1; // avoids division by zero
    let m = 0;
    for (const r of rows) {
      const v = Number(r?.actualAmount) || 0;
      if (v > m) m = v;
    }
    return Math.max(1, m);
  }, [rows]);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium text-black dark:text-white">
          Revenue Summary Table
        </h2>
        <div className="text-xs text-muted-foreground">
          Showing {visible.toLocaleString()} of{" "}
          {Math.min(rows.length, MAX_RENDER).toLocaleString()}
        </div>
      </div>

      {/* scroll container (id used by IntersectionObserver root) */}
      <div
        id="rev-scroll-root"
        className="max-h-[500px] overflow-auto border rounded-md bg-white dark:bg-black relative"
      >
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="sticky top-0 z-50 bg-blue-100 dark:bg-blue-900">
              <TableHead className="text-black dark:text-white">Date</TableHead>
              <TableHead className="text-black dark:text-white">
                Revenue Stream
              </TableHead>
              <TableHead className="text-black dark:text-white">
                Event Type
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Actual Amount
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Cumulative Revenue
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Last Year Revenue
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Budget
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Variance %
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Expense
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Calculated Profit/Loss
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.slice(0, visible).map((row, index) => (
              <RevenueRow
                key={row?.id ?? `${row?.date}-${row?.eventType}-${index}`}
                row={row}
                index={index}
                maxActual={maxActual}
              />
            ))}
          </TableBody>
        </Table>

        {/* sentinel for infinite loading */}
        {hasMore && (
          <div
            ref={sentinelRef}
            className="py-4 text-center text-xs text-muted-foreground"
          >
            Loading more…
          </div>
        )}
      </div>
    </Card>
  );
};

export default React.memo(DailyRevenueTableInner);
