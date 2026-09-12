"use client";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import DailyAnalysisFilter from "../filters/DailyAnalysisFilter";
import { setDailyAnalysisAppliedFilters } from "@/store/feature/filter/dailyAnalysisSlice";
import DailyAnalysisController from "./DailyAnalysisController";
import DailyRevenueTable from "./DailyRevenueTable";
import { Card } from "../ui/card";
import MultiLineChart from "../revenue/MultiLineChart";
import PieChart from "../dashboard/charts/pie-chart";
import ProfitLossWaterfallChart from "./ProfitLossWaterfallChart";
import BarChart from "../dashboard/charts/bar-chart";
import RevenueHierarchyChart from "./RevenueHierarchyChart";
import { fetchDailyKpis } from "@/store/feature/revenue/dailyKpiSlice";
import { formatKM } from "@/utils/number";

const DailyAnalysisDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { dailyAnalysisFilters, dailyAnalysisAppliedFilters } = useSelector(
    (state: RootState) => state.dailyAnalysisFilter
  );
  const { kpis }: any = useSelector((state: RootState) => state.dailyKpi);
  const handleApplyFilters = useCallback(() => {
    dispatch(setDailyAnalysisAppliedFilters(dailyAnalysisFilters));
  }, [dispatch, dailyAnalysisFilters]);

  useEffect(() => {
    const promise = dispatch(fetchDailyKpis());
    return () => {
      // cancel in-flight request if filters change quickly or component unmounts
      promise.abort();
    };
  }, [dispatch, dailyAnalysisAppliedFilters]);

  return (
    <div className="w-full max-w-[1500px] mx-auto p-2 md:p-6">
      {/* Filters */}
      <DailyAnalysisFilter onApply={handleApplyFilters} />
      <div className="space-y-6">
        <DailyAnalysisController />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <BarChart
              title="Actual Amount vs Budget vs Last Year Revenue"
              height={350}
              showLegend={true}
              yAxisFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              data={kpis?.hotels}
              leftPadding={10}
              dataKeys={[
                {
                  key: "actual",
                  name: "Actual Amount",
                  color: "hsl(var(--chart-1))", // deep red
                },
                {
                  key: "budget",
                  name: "Budget",
                  color: "hsl(var(--chart-2))", // tomato
                },
                {
                  key: "lastYear",
                  name: "Last Year Revenue",
                  color: "hsl(var(--chart-3))", // gold
                },
                {
                  key: "profit",
                  name: "Calculated Profit",
                  color: "hsl(var(--chart-4))", // blue
                },
              ]}
            />
          </Card>

          <Card className="p-6">
            <MultiLineChart
              title="Year-over-Year Comparison for Current Date"
              height={350}
              data={kpis?.YearOverYearRevenueData}
              dataKey="year"
              yAxisAdjust={true}
              yTickStep={10000000}
              dataKeys={[
                { key: "Expense", name: "Expense", color: "#be123c" }, // deep red
                { key: "Budget", name: "Budget", color: "#facc15" }, // bright yellow
                {
                  key: "Room Revenue",
                  name: "Room Revenue",
                  color: "#3b82f6",
                }, // blue
              ]}
            />
          </Card>
        </div>
        <DailyRevenueTable />
        <Card className="p-6">
          <RevenueHierarchyChart />
        </Card>
        <Card className="p-6">
          <BarChart
            title="Category Breakdown"
            height={350}
            showLegend={true}
            yAxisFormatter={(v) => `${formatKM(v)}`}
            data={kpis?.categoryBreakDown}
            leftPadding={10}
            dataKeys={[
              {
                key: "actual",
                name: "Expense",
                color: "hsl(var(--chart-1))", // dark teal/gray
              },
              {
                key: "lastYear",
                name: "Revenue",
                color: "hsl(var(--chart-2))", // gold
              },
              {
                key: "budget",
                name: "Budget",
                color: "hsl(var(--chart-3))", // saddle brown
              },
            ]}
          />
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfitLossWaterfallChart />
          <Card className="p-6">
            <PieChart
              data={kpis?.revenueByCategory}
              title="Revenue Distribution by Category"
              height={400}
            />
          </Card>
        </div>
        <Card className="p-6">
          <MultiLineChart
            title="% of discounts given by Hotel"
            height={350}
            data={kpis?.yearlyDiscountByHotel}
            yAxisAdjust={true}
            dataKey="year"
            yTickStep={1}
            dataKeys={[
              { key: "Delta Hotels", name: "Delta Hotels", color: "#2a9d8f" },
              {
                key: "Hilton Jumeirah",
                name: "Hilton Jumeirah",
                color: "#e9c46a",
              },
              {
                key: "Hilton The Walk",
                name: "Hilton The Walk",
                color: "#b5651d",
              },
              {
                key: "Merriott Hotel & Spa",
                name: "Merriott Hotel & Spa",
                color: "#b33e3e",
              },
              {
                key: "Taj Exotica Resort & Spa",
                name: "Taj Exotica Resort & Spa",
                color: "#dda15e",
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default DailyAnalysisDashboard;
