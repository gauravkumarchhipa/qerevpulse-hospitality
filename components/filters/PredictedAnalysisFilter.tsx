// FilterRevenueControls.tsx
import React, { useCallback, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MultiSelect from "@/layout/common/MultiSelect";
import DatePicker from "@/layout/common/DatePicker";
import {
  hotelOptionsId,
  locationOptionsId,
  revenueSystemOptions,
} from "./revenueFilterOption";

import { AppDispatch, RootState } from "@/store/store";
import { createMultiSelectHandler } from "@/utils/createMultiSelectHandler";
import { ChevronDown, ChevronUp, FilterIcon } from "lucide-react";
import {
  defaultPredictedAnalysisFilter,
  resetPredictedAnalysisAppliedFilters,
  resetPredictedAnalysisFilters,
  setPredictedAnalysisFilters,
} from "@/store/feature/filter/predictedAnalysisFilterSlice";

export default function PredictedAnalysisFilter({
  onApply,
}: {
  onApply: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { predictedFilters, predictedAppliedFilters } = useSelector(
    (s: RootState) => s.predictedFilter,
  );
  const [expanded, setExpanded] = useState(true);

  // 1) Generic updater
  const updateFilter = useCallback(
    (key: keyof typeof predictedFilters, value: any) => {
      dispatch(
        setPredictedAnalysisFilters({ ...predictedFilters, [key]: value }),
      );
    },
    [dispatch, predictedFilters],
  );

  const handleResetFilters = () => {
    dispatch(resetPredictedAnalysisAppliedFilters());
    dispatch(resetPredictedAnalysisFilters());
  };

  const isDirty = useMemo(
    () => !isEqual(predictedFilters, predictedAppliedFilters),
    [predictedFilters, predictedAppliedFilters],
  );
  const canReset = useMemo(
    () => !isEqual(predictedFilters, defaultPredictedAnalysisFilter),
    [predictedFilters],
  );

  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

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
              label="Location"
              options={locationOptionsId}
              selected={predictedFilters.location}
              onChange={createMultiSelectHandler(
                predictedFilters.location,
                locationOptionsId,
                (updated) => updateFilter("location", updated),
              )}
              defaultSelectAll={false}
            />
            <MultiSelect
              label="Hotel"
              options={hotelOptionsId}
              selected={predictedFilters.hotel}
              onChange={createMultiSelectHandler(
                predictedFilters.hotel,
                hotelOptionsId,
                (updated) => updateFilter("hotel", updated),
              )}
              defaultSelectAll={false}
            />
            <MultiSelect
              label="Revenue Stream"
              options={revenueSystemOptions}
              selected={predictedFilters.revenueStream}
              onChange={createMultiSelectHandler(
                predictedFilters.revenueStream,
                revenueSystemOptions,
                (updated) => updateFilter("revenueStream", updated),
              )}
              defaultSelectAll={false}
            />
          </div>

          {/* row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DatePicker
              label="From Date"
              date={predictedFilters.startDate}
              onChange={(d) => updateFilter("startDate", d)}
              disabled={(day) => {
                const today = startOfDay(new Date());
                const maxCap = startOfDay(new Date(2026, 11, 31)); // Dec=11
                const end = predictedFilters.endDate
                  ? startOfDay(predictedFilters.endDate)
                  : null;

                const d0 = startOfDay(day);
                const isBeforeToday = d0 < today;
                const isAfterCap = d0 > maxCap;
                const isAfterEnd = end ? d0 > end : false;
                return isBeforeToday || isAfterCap || isAfterEnd;
              }}
            />
            <DatePicker
              label="To Date"
              date={predictedFilters.endDate}
              onChange={(d) => updateFilter("endDate", d)}
              disabled={(day) => {
                const today = startOfDay(new Date());
                const maxCap = startOfDay(new Date(2026, 11, 31));
                const min = predictedFilters.startDate
                  ? startOfDay(predictedFilters.startDate)
                  : today;

                const d0 = startOfDay(day);
                const isBeforeMin = d0 < min;
                const isAfterCap = d0 > maxCap;
                return isBeforeMin || isAfterCap;
              }}
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
