import { Card } from "@/components/ui/card";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import PieChart from "../charts/pie-chart";
import BarChart from "../charts/bar-chart";
import KpiCard from "../kpi-card";
import {
  getKpiCards,
  getKpiCardsYTD,
} from "@/lib/dashboard/departmentanalysis/DepartmentAnalysisCard";
import {
  getDepartmentRevenueData,
  getDepartmentRevenueDataYTD,
} from "@/lib/dashboard/departmentanalysis/DepartmentRevenueBreakdown";
import {
  getDepartmentComparisonData,
  getDepartmentComparisonDataYTD,
} from "@/lib/dashboard/departmentanalysis/KPIDepartmentComparison";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CashPayIcon from "@/icons/CashPayIcon";

const DepartmentAnalysis = () => {
  const [filter, setFilter] = useState<"Revenue" | "Profit" | "KPIS" | any>(
    "Revenue"
  );
  const view = useSelector(
    (state: RootState) => state.filters.appliedFilters?.view,
    shallowEqual
  );

  const [kpiCards, departmentRevenueData] = useMemo(() => {
    const isMonth = view === "month";
    return [
      isMonth ? getKpiCards() : getKpiCardsYTD(),
      isMonth ? getDepartmentRevenueData() : getDepartmentRevenueDataYTD(),
    ];
  }, [view]);

  const [departmentComparisonData]:any = useMemo(() => {
    const isMonth = view === "month";
    return [
      filter === "Revenue"
        ? isMonth
          ? getDepartmentComparisonData()
          : getDepartmentComparisonDataYTD()
        : filter === "Profit"
        ? isMonth
          ? getDepartmentComparisonData()
          : getDepartmentComparisonDataYTD()
        : isMonth
        ? getDepartmentComparisonData()
        : getDepartmentComparisonDataYTD(),
    ];
  }, [view, filter]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards?.map((card, index) => (
          <KpiCard
            key={index}
            data={card}
            icon={
              index === 0 ? (
                <CashPayIcon color={"#f6ad55"} className="h-5 w-5"/>
              ) : index === 1 ? (
                <BarChartIcon className="h-5 w-5 text-green-500" />
              ) : index === 2 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : index === 3 ? (
                <CashPayIcon color={"#F44336"} className="h-5 w-5"/>
              ) : (
                <PieChartIcon className="h-5 w-5 text-amber-500" />
              )
            }
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <PieChart
            data={departmentRevenueData}
            title="Department Revenue Breakdown"
            height={300}
          />
        </Card>
        <Card className="p-6">
          <BarChart
            data={departmentComparisonData}
            title="KPI Department Comparison"
            height={300}
            filter={filter}
            setFilter={setFilter}
          />
        </Card>
      </div>
    </div>
  );
};

export default DepartmentAnalysis;
