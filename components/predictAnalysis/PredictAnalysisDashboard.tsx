"use client";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import PredictedAnalysisController from "./PredictedAnalysisController";
import PredictedAnalysisFilter from "../filters/PredictedAnalysisFilter";
import { setPredictedAnalysisAppliedFilters } from "@/store/feature/filter/predictedAnalysisFilterSlice";
import PredictedRevenue from "./PredictedRevenue";
import PredictedRevenueChart from "./chart/PredictedRevenueChart";
import EventsInsights from "./UpcommingEvents";
import ForCastEvents from "./ForCastEvents";
import HotelRoomPricingTable from "./HotelRoomPricingTable";
import { useTheme } from "@/app/theme-provider";
import { fetchPredictiveKpis } from "@/store/feature/revenue/predictiveSlice";
import BarChart from "../dashboard/charts/bar-chart";
import { Card } from "../ui/card";

const PredictAnalysisDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { predictedFilters, predictedAppliedFilters } = useSelector(
    (state: RootState) => state.predictedFilter,
  );
  const { kpis }: any = useSelector((state: RootState) => state.predictiveKpi);
  const handleApplyFilters = useCallback(() => {
    dispatch(setPredictedAnalysisAppliedFilters(predictedFilters));
  }, [dispatch, predictedFilters]);

  useEffect(() => {
    const promise = dispatch(fetchPredictiveKpis());
    return () => {
      // cancel in-flight request if filters change quickly or component unmounts
      promise.abort();
    };
  }, [dispatch, predictedAppliedFilters]);

  return (
    <div className="w-full max-w-[1500px] mx-auto p-2 md:p-6">
      {/* Filters */}
      <PredictedAnalysisFilter onApply={handleApplyFilters} />
      <div className="space-y-6">
        <PredictedAnalysisController />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PredictedRevenue />
          <Card className="pt-6">
            <BarChart
              title="Occupancy & ADR by Hotel"
              height={350}
              showLegend={true}
              yAxisFormatter={(v) => `${v}`}
              leftPadding={10}
              data={kpis?.adrAndOccupancyByHotel}
              dataKeys={[
                {
                  key: "occupancy_rate",
                  name: "Occupancy Rate",
                  color: isDark ? "hsl(var(--chart-7))" : "hsl(var(--chart-3))",
                },
                {
                  key: "adr",
                  name: "ADR",
                  color: "hsl(var(--chart-2))",
                },
              ]}
              showValueLabels={true}
            />
          </Card>
        </div>
        <PredictedRevenueChart />
        <EventsInsights />
        <HotelRoomPricingTable />
        <ForCastEvents />
      </div>
    </div>
  );
};

export default PredictAnalysisDashboard;
