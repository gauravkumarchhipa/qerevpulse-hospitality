"use client";

import { useCallback, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { ChevronDown, ChevronUp, FilterIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/store/store";
import {
  defaultFilter,
  resetAppliedFilters,
  resetFilters,
  setFilters,
} from "@/store/feature/filter/filterSlice";
import CommonSelect from "@/layout/common/CommonSelect";
import DatePicker from "@/layout/common/DatePicker";
import MultiSelect from "@/layout/common/MultiSelect";
import {
  compareWithOption,
  departmentOptions,
  timeRangeOption,
} from "./fiterOptions";
import { createMultiSelectHandler } from "@/utils/createMultiSelectHandler";

interface FilterControlsProps {
  onApply: () => void;
}

export default function FilterControls({ onApply }: FilterControlsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, appliedFilters } = useSelector(
    (state: RootState) => state.filters
  );
  const [expanded, setExpanded] = useState(true);

  const updateFilter = useCallback(
    (key: keyof typeof filters, value: any) => {
      dispatch(setFilters({ ...filters, [key]: value }));
    },
    [dispatch, filters]
  );

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(resetAppliedFilters());
  };

  const isFilterDirty = useMemo(
    () => !isEqual(filters, appliedFilters),
    [filters, appliedFilters]
  );

  const resetDisable = useMemo(
    () => !isEqual(filters, defaultFilter),
    [filters]
  );

  return (
    <Card className="mb-6 border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FilterIcon size={18} />
          <span className="font-medium">Filters</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-sm"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Expand
            </>
          )}
        </Button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CommonSelect
              label="Time Range"
              placeholder="Select time range"
              value={filters.timeRange}
              onChange={(val) => updateFilter("timeRange", val)}
              options={timeRangeOption}
            />

            <MultiSelect
              label="Department"
              options={departmentOptions}
              selected={filters.departments}
              onChange={createMultiSelectHandler(
                filters.departments,
                departmentOptions,
                (updated) => updateFilter("departments", updated)
              )}
              defaultSelectAll={false}
            />

            <CommonSelect
              label="Compare With"
              placeholder="Select comparison"
              value={filters.compareWith}
              onChange={(val) => updateFilter("compareWith", val)}
              options={compareWithOption}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DatePicker
              label="From Date"
              date={filters.startDate}
              onChange={(date) => updateFilter("startDate", date)}
            />
            <DatePicker
              label="To Date"
              date={filters.endDate}
              onChange={(date) => updateFilter("endDate", date)}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">View</label>
              <div className="flex gap-2 overflow-x-auto flex-wrap sm:flex-nowrap whitespace-nowrap">
                {["month", "year"].map((view) => (
                  <Button
                    key={view}
                    variant={filters?.view === view ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("view", view)}
                  >
                    {view === "month" ? "Month To Date" : "Year To Date"}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              disabled={!resetDisable && !isFilterDirty}
            >
              Reset
            </Button>
            <Button size="sm" onClick={onApply} disabled={!isFilterDirty}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
