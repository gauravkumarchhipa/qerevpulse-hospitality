import React from "react";
import RevenueCard from "../revenue/RevenueCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatKM } from "@/utils/number";

const PredictedAnalysisController = () => {
  const { kpis }: any = useSelector((state: RootState) => state.predictiveKpi);
  const kpiData = [
    {
      label: "Predicted Revenue",
      value: formatKM(kpis?.kpis?.Revenue),
      color: "text-blue-600",
    },
    {
      label: "Predicted Cancellation Rate(%)",
      value: "75.3",
      color: "text-red-600",
    },
    {
      label: "Predicted Occupancy Rate",
      value: "11.6%",
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {kpiData.map((item, index) => (
        <RevenueCard
          key={index}
          value={item.value}
          label={item.label}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default PredictedAnalysisController;
