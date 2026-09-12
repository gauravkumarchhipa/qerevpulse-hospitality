// FilterRevenueControls.tsx
import React, { useCallback, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MultiSelect from "@/layout/common/MultiSelect";
import { hotelOptionsId, quarterOptions } from "./revenueFilterOption";
import { AppDispatch, RootState } from "@/store/store";
import { createMultiSelectHandler } from "@/utils/createMultiSelectHandler";
import { ChevronDown, ChevronUp, FilterIcon } from "lucide-react";
import {
  defaultSeasonalAnalysisFilter,
  resetSeasonalAnalysisAppliedFilters,
  resetSeasonalAnalysisFilters,
  setSeasonalAnalysisFilters,
} from "@/store/feature/filter/seasonalAnalysisSlice";

export default function SeasonalAnalysisFilter({
  onApply,
}: {
  onApply: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { seasonalAnalysisFilters, seasonalAnalysisAppliedFilters } =
    useSelector((state: RootState) => state.seasonalAnalysisFilter);
  const [expanded, setExpanded] = useState(true);

  // 1) Generic updater
  const updateFilter = useCallback(
    (key: keyof typeof seasonalAnalysisFilters, value: any) => {
      dispatch(
        setSeasonalAnalysisFilters({ ...seasonalAnalysisFilters, [key]: value })
      );
    },
    [dispatch, seasonalAnalysisFilters]
  );

  const handleResetFilters = () => {
    dispatch(resetSeasonalAnalysisAppliedFilters());
    dispatch(resetSeasonalAnalysisFilters());
  };

  const isDirty = useMemo(
    () => !isEqual(seasonalAnalysisFilters, seasonalAnalysisAppliedFilters),
    [seasonalAnalysisFilters, seasonalAnalysisAppliedFilters]
  );
  const canReset = useMemo(
    () => !isEqual(seasonalAnalysisFilters, defaultSeasonalAnalysisFilter),
    [seasonalAnalysisFilters]
  );

  return (
    <Card className="mb-6 p-4 border-border">
      {/* header + expand/collapse omitted for brevity */}
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
        <div className="space-y-4">
          {/* row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MultiSelect
              label="Quarter"
              options={quarterOptions}
              selected={seasonalAnalysisFilters.quarter}
              onChange={createMultiSelectHandler(
                seasonalAnalysisFilters.quarter,
                quarterOptions,
                (updated) => updateFilter("quarter", updated)
              )}
              defaultSelectAll={false}
            />
            <MultiSelect
              label="Hotel"
              options={hotelOptionsId}
              selected={seasonalAnalysisFilters.hotel}
              onChange={createMultiSelectHandler(
                seasonalAnalysisFilters.hotel,
                hotelOptionsId,
                (updated) => updateFilter("hotel", updated)
              )}
              defaultSelectAll={false}
            />
          </div>

          {/* actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              disabled={!canReset && !isDirty}
            >
              Reset
            </Button>
            <Button size="sm" onClick={onApply} disabled={!isDirty}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
