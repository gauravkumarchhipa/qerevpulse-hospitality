// import React, { useState } from "react";
// import RevenueCard from "./RevenueCard";
// import { kpiCardData } from "@/data/revenue/kpiCardData";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";

// const RevenueController = () => {
//   // const [data,setData] = useState(revenuedata)
//   const { revenueAppliedFilters } = useSelector(
//     (state: RootState) => state.revenueFilter
//   );
//   console.log(revenueAppliedFilters);
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//       {kpiCardData?.map((item, index) => (
//         <RevenueCard
//           key={index}
//           value={item?.value}
//           label={item?.label}
//           color={item?.color}
//         />
//       ))}
//     </div>
//   );
// };

// export default RevenueController;

"use client";
import React, { useEffect, useState } from "react";
import RevenueCard from "./RevenueCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchKpis } from "@/store/feature/revenue/revenueKpiSlice";
import { Ban, BarChartIcon, BedDouble, Icon, Star, User } from "lucide-react";
import CashPayIcon from "@/icons/CashPayIcon";

type Kpis = {
  Revenue: number;
  ADR: number;
  AvgReviewScore: number;
  TotalCapacity: number;
  CancellationRatePct: number;
  OccupancyRatePct: number;
  Expense: number;
  Profit: number;
};

function fmt(n: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(undefined, opts).format(n || 0);
}
export function formatCompact(num: number): string {
  if (num == null || isNaN(num)) return "—";
  const abs = Math.abs(num);

  if (abs >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (abs >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (abs >= 1_000) return (num / 1_000).toFixed(2) + "K";

  return num.toString();
}
const RevenueController = () => {
  const { revenueAppliedFilters } = useSelector(
    (s: RootState) => s.revenueFilter
  );
  const dispatch = useDispatch<AppDispatch>();
  const { kpis }: any = useSelector((d: RootState) => d.revenueKpi);

  useEffect(() => {
    const promise = dispatch(fetchKpis());
    return () => {
      // cancel in-flight request if filters change quickly or component unmounts
      promise.abort();
    };
  }, [dispatch, revenueAppliedFilters]);
  const cards = [
    {
      label: "Revenue",
      value: kpis?.kpis ? "AED " + formatCompact(kpis?.kpis.Revenue) : "AED 0.00",
      color: "text-blue-600",
      icon: <CashPayIcon color={"#f6ad55"} className="h-5 w-5" />,
    },

    {
      label: "ADR",
      value: kpis?.kpis ? fmt(kpis?.kpis.ADR) : "0.00",
      color: "text-orange-500",
      icon: <BarChartIcon className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Avg Review Score",
      value: kpis?.kpis
        ? fmt(kpis?.kpis.AvgReviewScore, { maximumFractionDigits: 2 })
        : "0.00",
      color: "text-blue-600",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
    },
    {
      label: "Total Capacity",
      value: kpis?.kpis ? fmt(kpis?.kpis.TotalCapacity) : "0",
      color: "text-green-600",
      icon: <BedDouble className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Cancellation Rate",
      value: kpis?.kpis
        ? fmt(kpis?.kpis.CancellationRatePct, { maximumFractionDigits: 2 }) +
          "%"
        : "0.00%",
      color: "text-yellow-500",
      icon: <Ban className="h-5 w-5 text-red-500" />,
    },
    {
      label: "Occupancy Rate",
      value: kpis?.kpis
        ? fmt(kpis?.kpis.OccupancyRatePct, { maximumFractionDigits: 2 }) + "%"
        : "0.00%",
      color: "text-red-600",
      icon: <User className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  2xl:grid-cols-6 gap-4">
      {cards.map((item, i) => (
        <RevenueCard
          key={i}
          value={kpis?.loading ? "…" : item.value}
          label={item?.label}
          color={item?.color}
          icon={item?.icon}
        />
      ))}
    </div>
  );
};

export default RevenueController;
