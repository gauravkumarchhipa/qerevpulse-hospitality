import { Card } from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import LineChart from "../charts/line-chart";
import BarChart from "../charts/bar-chart";
import Insights from "../insights";
import {
  getDepartmentComparisonData2,
  getDepartmentComparisonDataYTD2,
} from "@/lib/dashboard/departmentanalysis/KPIYear-over-YearComparison";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  getKPIYearOverYearComparison,
  getKPIYearOverYearComparisonYTD,
} from "@/lib/dashboard/trendsforcast/KPIYearoverYearComparison";

const TrendForecast = () => {
  const [filter, setFilter] = useState<"Revenue" | "Profit" | "KPIS" | any>(
    "Revenue"
  );
  const view = useSelector(
    (state: RootState) => state.filters.appliedFilters?.view,
    shallowEqual
  );

  const [yearlyTrendData] = useMemo(() => {
    const isMonth = view === "month";
    return [
      isMonth
        ? getKPIYearOverYearComparison()
        : getKPIYearOverYearComparisonYTD(),
    ];
  }, [view]);

  const [departmentComparisonData]: any = useMemo(() => {
    const isMonth = view === "month";
    return [
      filter === "Revenue"
        ? isMonth
          ? getDepartmentComparisonData2()
          : getDepartmentComparisonDataYTD2()
        : filter === "Profit"
        ? isMonth
          ? getDepartmentComparisonData2()
          : getDepartmentComparisonDataYTD2()
        : isMonth
        ? getDepartmentComparisonData2()
        : getDepartmentComparisonDataYTD2(),
    ];
  }, [view, filter]);
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <LineChart
          data={yearlyTrendData}
          title="Year-over-Year Trend Analysis"
          height={350}
          ReferenceAreaShow={true}
        />
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <BarChart
            data={departmentComparisonData}
            title="KPI Year-over-Year Comparison"
            height={350}
            filter={filter}
            setFilter={setFilter}
          />
        </Card>
        <Insights />
      </div>
    </div>
  );
};

export default TrendForecast;
