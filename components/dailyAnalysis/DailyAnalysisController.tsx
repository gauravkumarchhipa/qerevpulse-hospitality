import React from "react";
import RevenueCard from "../revenue/RevenueCard";
import CashPayIcon from "@/icons/CashPayIcon";
import {
  BarChartIcon,
  ChartNoAxesCombined,
  TrendingDown,
  TrendingUp,
  User,
  Banknote,
  ArrowUpNarrowWide,
  HandCoins,
  ChartPie,
  ArrowDownNarrowWide,
} from "lucide-react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { formatKM } from "@/utils/number";

const DailyAnalysisController = () => {
  const { kpis }: any = useSelector((state: RootState) => state.dailyKpi);

  const kpiData = [
    {
      label: "Revenue",
      value: formatKM(kpis?.kpis?.Revenue),
      color: "text-blue-700",
      icon: <CashPayIcon color={"#f6ad55"} className="h-5 w-5" />,
    },
    {
      label: "ADR",
      value: formatKM(kpis?.kpis?.ADR),
      color: "text-orange-600",
      icon: <BarChartIcon className="h-5 w-5 text-green-500" />,
    },
    {
      label: "RevPOR",
      value: formatKM(kpis?.kpis?.RevPOR),
      color: "text-pink-600",
      icon: <ChartNoAxesCombined className="h-5 w-5 text-green-500" />,
    },
    {
      label: "RevPAR",
      value: formatKM(kpis?.kpis?.RevPAR),
      color: "text-sky-600",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Occupancy Rate",
      value: `${formatKM(kpis?.kpis?.OccupancyRatePct)}%`,
      color: "text-red-600",
      icon: <User className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "Expense",
      value: formatKM(kpis?.kpis?.Expense),
      color: "text-emerald-700",
      icon: <Banknote className="h-5 w-5 text-red-500" />,
    },
    {
      label: "Budget",
      value: formatKM(kpis?.kpis?.Budget),
      color: "text-yellow-900",
      icon: <HandCoins className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "Profit",
      value: formatKM(kpis?.kpis?.Profit),
      color: "text-cyan-800",
      icon:
        kpis?.kpis?.Profit < 0 ? (
          <ArrowDownNarrowWide className="h-5 w-5 text-red-500" /> 
        ) : (
          <ArrowUpNarrowWide className="h-5 w-5 text-green-500" />
        ),
    },
    {
      label: "Avg LOS",
      value: "1",
      color: "text-rose-600",
      icon: <TrendingDown className="h-5 w-5 text-red-500" />,
    },
    {
      label: "Profit Margin",
      value: `${formatKM(kpis?.kpis?.ProfitMargin / 100)}%`,
      color: "text-yellow-500",
      icon: <ChartPie className="h-5 w-5 text-green-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpiData.map((item, index) => (
        <RevenueCard
          key={index}
          value={item.value}
          label={item.label}
          color={item.color}
          icon={item?.icon}
        />
      ))}
    </div>
  );
};

export default DailyAnalysisController;
