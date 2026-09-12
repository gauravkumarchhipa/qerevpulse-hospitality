// FilterRevenueControls.tsx
import React, { useCallback, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MultiSelect from "@/layout/common/MultiSelect";
import DatePicker from "@/layout/common/DatePicker";
import {
  eventTypeOptions,
  hotelOptionsId,
  locationOptionsId,
  revenueSystemOptions,
} from "./revenueFilterOption";
import { AppDispatch, RootState } from "@/store/store";
import { createMultiSelectHandler } from "@/utils/createMultiSelectHandler";
import { ChevronDown, ChevronUp, FilterIcon } from "lucide-react";
import {
  defaultDailyAnalysisFilter,
  resetDailyAnalysisAppliedFilters,
  resetDailyAnalysisFilters,
  setDailyAnalysisFilters,
} from "@/store/feature/filter/dailyAnalysisSlice";

export default function DailyAnalysisFilter({
  onApply,
}: {
  onApply: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { dailyAnalysisFilters, dailyAnalysisAppliedFilters } = useSelector(
    (state: RootState) => state.dailyAnalysisFilter
  );

  const [expanded, setExpanded] = useState(true);

  // 1) Generic updater
  const updateFilter = useCallback(
    (key: keyof typeof dailyAnalysisFilters, value: any) => {
      dispatch(
        setDailyAnalysisFilters({ ...dailyAnalysisFilters, [key]: value })
      );
    },
    [dispatch, dailyAnalysisFilters]
  );

  const handleResetFilters = () => {
    dispatch(resetDailyAnalysisAppliedFilters());
    dispatch(resetDailyAnalysisFilters());
  };

  const isDirty = useMemo(
    () => !isEqual(dailyAnalysisFilters, dailyAnalysisAppliedFilters),
    [dailyAnalysisFilters, dailyAnalysisAppliedFilters]
  );
  const canReset = useMemo(
    () => !isEqual(dailyAnalysisFilters, defaultDailyAnalysisFilter),
    [dailyAnalysisFilters]
  );

  const filteredHotelOptions = useMemo(() => {
    const selectedLocIds = dailyAnalysisFilters.location || [];
    if (!selectedLocIds.length) return hotelOptionsId; // no location -> show all hotels
    return hotelOptionsId.filter((h) => selectedLocIds.includes(h.value));
  }, [dailyAnalysisFilters.location]);

  const atMidnight = (d: Date | null | undefined) => {
    if (!d) return null;
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const disableStart = useCallback(
    (day: Date) => {
      const d = atMidnight(day)!;
      const end = atMidnight(dailyAnalysisFilters.endDate);
      return end ? d > end : false; // disable From-Date after To-Date
    },
    [dailyAnalysisFilters.endDate]
  );

  const disableEnd = useCallback(
    (day: Date) => {
      const d = atMidnight(day)!;
      const start = atMidnight(dailyAnalysisFilters.startDate);
      return start ? d < start : false; // disable To-Date before From-Date
    },
    [dailyAnalysisFilters.startDate]
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
              label="Location"
              options={locationOptionsId}
              selected={dailyAnalysisFilters.location}
              onChange={createMultiSelectHandler(
                dailyAnalysisFilters.location,
                locationOptionsId,
                (updated) => updateFilter("location", updated)
              )}
              defaultSelectAll={false}
            />
            <MultiSelect
              label="Hotel"
              options={filteredHotelOptions}
              selected={dailyAnalysisFilters.hotel}
              onChange={createMultiSelectHandler(
                dailyAnalysisFilters.hotel,
                hotelOptionsId,
                (updated) => updateFilter("hotel", updated)
              )}
              defaultSelectAll={false}
            />
            <MultiSelect
              label="Revenue Stream"
              options={revenueSystemOptions}
              selected={dailyAnalysisFilters.revenueStream}
              onChange={createMultiSelectHandler(
                dailyAnalysisFilters.revenueStream,
                revenueSystemOptions,
                (updated) => updateFilter("revenueStream", updated)
              )}
              defaultSelectAll={false}
            />
          </div>

          {/* row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MultiSelect
              label="Event Type"
              options={eventTypeOptions}
              selected={dailyAnalysisFilters.event}
              onChange={createMultiSelectHandler(
                dailyAnalysisFilters.event,
                eventTypeOptions,
                (updated) => updateFilter("event", updated)
              )}
              defaultSelectAll={false}
            />
            <DatePicker
              label="From Date"
              date={dailyAnalysisFilters.startDate}
              onChange={(d) => updateFilter("startDate", d)}
              disabled={disableStart}
            />
            <DatePicker
              label="To Date"
              date={dailyAnalysisFilters.endDate}
              onChange={(d) => updateFilter("endDate", d)}
              disabled={disableEnd}
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
