"use client";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import FilterControls from "@/components/filters/filter-controls";
import { StyledTabs } from "@/components/ui/tabs-styled";

import OverView from "./tab/OverView";
import DepartmentAnalysis from "./tab/DepartmentAnalysis";
import TrendForecast from "./tab/TrendForecast";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setAppliedFilters } from "@/store/feature/filter/filterSlice";
const Dashboard = () => {
  const [activeView, setActiveView] = useState("OVERVIEW");
  const dispatch = useDispatch<AppDispatch>();
  const { filters } = useSelector((state: RootState) => state.filters);

  const handleApplyFilters = useCallback(() => {
    dispatch(setAppliedFilters(filters));
  }, [dispatch, filters]);

  const views = useMemo(
    () => ["OVERVIEW", "DEPARTMENT ANALYSIS", "TRENDS & FORECASTS"],
    []
  );

  const renderActiveTab = useMemo(() => {
    switch (activeView) {
      case "OVERVIEW":
        return <OverView />;
      case "DEPARTMENT ANALYSIS":
        return <DepartmentAnalysis />;
      case "TRENDS & FORECASTS":
        return <TrendForecast />;
      default:
        return null;
    }
  }, [activeView]);

  return (
    <div className="w-full max-w-[1500px] mx-auto p-2 md:p-6">
      {/* Filters */}
      <FilterControls onApply={handleApplyFilters} />

      {/* Tabs */}
      <StyledTabs
        tabs={views}
        activeTab={activeView}
        onChange={setActiveView}
        className="mb-6"
      />

      {renderActiveTab}
    </div>
  );
};

export default Dashboard;
