"use client";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import FilterRevenueControls from "../filters/revenue-filter";
import { setRevenueAppliedFilters } from "@/store/feature/filter/revenueFilterSlice";
import RevenueController from "./RevenueController";
import { Card } from "../ui/card";
import BarChart from "../dashboard/charts/bar-chart";
import InventoryMixOptimizationCard from "./InventoryMixOptimizationCard";
import RevenueSankeyChart from "./RevenueRankingLocationChart";
import OccupancyAndAdrCart from "./OccupancyAndAdrCart";
import RoomRevenueSimpleBar from "./RoomRevenue";
import YearlyRevenue from "./YearlyRevenue";
import MultiLineChart from "./MultiLineChart";
import RevenueByDaysWaterfallChart from "./RevenueByDaysChart";
import { useTheme } from "@/app/theme-provider";
import { formatKM } from "@/utils/number";

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateRandomData() {
  return months?.map((m) => {
    const val = randInt(100, 160);
    return {
      name: m,
      delta: val,
      jumeirah: randInt(80, 160),
      walk: randInt(60, 160),
      marriott: randInt(70, 160),
      taj: randInt(50, 160),
    };
  });
}

const RevenueDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState(generateRandomData);
  const { kpis }: any = useSelector((d: RootState) => d.revenueKpi);
  const { revenueFilters } = useSelector(
    (state: RootState) => state.revenueFilter
  );
  const handleApplyFilters = useCallback(() => {
    dispatch(setRevenueAppliedFilters(revenueFilters));
  }, [dispatch, revenueFilters]);

  const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  return (
    <div className="w-full max-w-[1500px] mx-auto p-2 md:p-6">
      {/* Filters */}
      <FilterRevenueControls onApply={handleApplyFilters} />
      <div className="space-y-6">
        <RevenueController />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <BarChart
              title="Room Revenue"
              height={350}
              showLegend={true}
              yAxisFormatter={(v) => `${v}`}
              data={kpis?.roomRevenue}
              leftPadding={10}
              dataKeys={[
                {
                  key: "rooms",
                  name: "No. of Rooms",
                  color: "hsl(var(--chart-2))",
                },
                { key: "adr", name: "ADR", color: "hsl(var(--chart-3))" },
              ]}
            />
          </Card>
          <InventoryMixOptimizationCard />
        </div>
        <RevenueSankeyChart />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RoomRevenueSimpleBar />
          <OccupancyAndAdrCart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <BarChart
              title="Revenue VS Budget Amount by Hotels"
              height={350}
              yAxisFormatter={(v) => `${formatKM(v)}`}
              data={kpis?.revenueVsBudgetByHotel}
              dataKeys={[
                {
                  key: "budget",
                  name: "Budget",
                  color: "hsl(var(--chart-2))",
                },
                {
                  key: "revenue",
                  name: "Revenue",
                  color: "hsl(var(--chart-3))",
                },
              ]}
              showValueLabels={true}
            />
          </Card>
          <YearlyRevenue />
        </div>
        <RevenueByDaysWaterfallChart />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <MultiLineChart
              title="Avg Price per Room types"
              data={kpis?.avgRoomType}
              dataKeys={[
                { key: "deluxe", name: "Deluxe Room", color: "#396F7A" },
                { key: "double", name: "Double Room", color: "#D4AF37" },
                { key: "single", name: "Single Room", color: "#C0392B" },
                { key: "suite", name: "Suite", color: "#A65E00" },
              ]}
            />
          </Card>
          <Card className="p-6">
            <MultiLineChart
              title="Occupancy Rate and Profit Margin by Month"
              data={kpis?.occupancyProfitMonthly}
              dataKeys={[
                { key: "occupancy", name: "Occupancy Rate", color: "#396F7A" },
                { key: "profit", name: "Profit Margin", color: "#D4AF37" },
              ]}
            />
          </Card>
        </div>
        <Card className="p-6">
          <MultiLineChart
            title="Occupied Room by Month and Name"
            data={data ?? kpis?.occupiedRoomData}
            dataKeys={[
              {
                key: "delta",
                name: "Delta Hotels",
                color: isDark ? "#e9d5ff" : "#4B004B",
              },
              {
                key: "jumeirah",
                name: "Hilton Jumeirah",
                color: isDark ? "#D4AF37" : "#F1C40F",
              },
              {
                key: "walk",
                name: "Hilton The Walk",
                color: isDark ? "#fdba74" : "#FF5733",
              },
              {
                key: "marriott",
                name: "Merriott Hotel & Spa",
                color: isDark ? "#fca5a5" : "#C70039",
              },
              {
                key: "taj",
                name: "Taj Exotica Resort & Spa",
                color: isDark ? "#f9a8d4" : "#800040",
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default RevenueDashboard;
