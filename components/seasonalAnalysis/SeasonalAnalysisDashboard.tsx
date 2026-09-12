"use client";
import React, { useCallback, useEffect } from "react";
import SeasonalAnalysisController from "./SeasonalAnalysisController";
import SeasonalAnalysisFilter from "../filters/SeasonalAnalysisFilter";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setSeasonalAnalysisAppliedFilters } from "@/store/feature/filter/seasonalAnalysisSlice";
import WaterfallYearlyRevenue from "./WaterfallYearlyRevenue";
import InventoryTrendChart from "./InventoryTrendChart";
import RevenueVarianceTable from "./RevenueVarianceTable";
import { Card } from "../ui/card";
import PieChart from "../dashboard/charts/pie-chart";
import MultiLineChart from "../revenue/MultiLineChart";
import PriceElasticityChart from "./PriceElasticityChart";
import { fetchSeasonalKpis } from "@/store/feature/revenue/seasonalKpiSlice";

const SeasonalAnalysisDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { seasonalAnalysisFilters, seasonalAnalysisAppliedFilters } =
    useSelector((state: RootState) => state.seasonalAnalysisFilter);
  const handleApplyFilters = useCallback(() => {
    dispatch(setSeasonalAnalysisAppliedFilters(seasonalAnalysisFilters));
  }, [dispatch, seasonalAnalysisFilters]);

  useEffect(() => {
    const promise = dispatch(fetchSeasonalKpis());
    return () => {
      // cancel in-flight request if filters change quickly or component unmounts
      promise.abort();
    };
  }, [dispatch, seasonalAnalysisAppliedFilters]);

  const { kpis }: any = useSelector((d: any) => d.seasonalKpi);
  return (
    <div className="w-full max-w-[1500px] mx-auto p-2 md:p-6">
      <SeasonalAnalysisFilter onApply={handleApplyFilters} />
      <div className="space-y-6">
        <SeasonalAnalysisController />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WaterfallYearlyRevenue />
          <InventoryTrendChart />
        </div>
        <RevenueVarianceTable />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <PieChart
              data={kpis?.quarterlyRevenue}
              title="Quarterly Revenue"
              height={350}
              percentage={false}
            />
          </Card>
          <Card className="p-6">
            <MultiLineChart
              height={350}
              title="Quarterly Revenue vs Last Year"
              data={kpis?.yearlyRevenueVsLastYear}
              dataKeys={[
                {
                  key: "revenue",
                  name: "Revenue",
                  color: "#800020", // maroon
                },
                {
                  key: "lastYearRevenue",
                  name: "Last Year Revenue",
                  color: "#D4AF37", // amber
                },
              ]}
            />
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <MultiLineChart
              title="Bookings and Cancellations over the period"
              height={350}
              data={kpis?.bookingCancelAverage}
              dataKeys={[
                {
                  key: "bookings",
                  name: "Bookings",
                  color: "#264653", // teal
                },
                {
                  key: "cancellations",
                  name: "Cancelled Rooms",
                  color: "#e9c46a", // yellow
                },
              ]}
            />
          </Card>
          <PriceElasticityChart />
        </div>
      </div>
    </div>
  );
};

export default SeasonalAnalysisDashboard;
