import React from "react";
import RevenueCard from "../revenue/RevenueCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatKM } from "@/utils/number";
import CashPayIcon from "@/icons/CashPayIcon";
import {
  BarChartIcon,
  ChartNoAxesCombined,
  TrendingUp,
  User,
} from "lucide-react";

const SeasonalAnalysisController = () => {
  const { kpis }: any = useSelector((d: RootState) => d.seasonalKpi);
  const kpiData = [
    {
      label: "Revenue",
      value: `AED ${formatKM(kpis?.kpis?.Revenue)}`,
      color: "text-blue-600",
      icon: <CashPayIcon color={"#f6ad55"} className="h-5 w-5" />,
    },
    {
      label: "ADR",
      value: formatKM(kpis?.kpis?.ADR),
      color: "text-orange-500",
      icon: <BarChartIcon className="h-5 w-5 text-green-500" />,
    },
    {
      label: "RevPOR",
      value: formatKM(kpis?.kpis?.RevPOR),
      color: "text-blue-600",
      icon: <ChartNoAxesCombined className="h-5 w-5 text-green-500" />,
    },
    {
      label: "RevPAR",
      value: formatKM(kpis?.kpis?.RevPAR),
      color: "text-green-600",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Occupancy Rate",
      value: formatKM(kpis?.kpis?.OccupancyRatePct),
      color: "text-red-600",
      icon: <User className="h-5 w-5 text-blue-500" />,
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

export default SeasonalAnalysisController;
