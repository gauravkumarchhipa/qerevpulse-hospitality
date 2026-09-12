// FilterRevenueControls.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MultiSelect from "@/layout/common/MultiSelect";
import DatePicker from "@/layout/common/DatePicker";
import {
  hotelOptionsId,
  locationOptionsId,
  ratingOptions,
  revenueSystemOptions,
} from "./revenueFilterOption";
import {
  defaultRevenueFilter,
  resetRevenueAppliedFilters,
  resetRevenueFilters,
  setRevenueFilters,
} from "@/store/feature/filter/revenueFilterSlice";
import { AppDispatch, RootState } from "@/store/store";
import { createMultiSelectHandler } from "@/utils/createMultiSelectHandler";
import { ChevronDown, ChevronUp, FilterIcon } from "lucide-react";

type FilterKey = "location" | "hotel" | "revenueStream" | "ratings";

export default function FilterRevenueControls({
  onApply,
}: {
  onApply: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { revenueFilters, revenueAppliedFilters } = useSelector(
    (state: RootState) => state.revenueFilter
  );
  const [expanded, setExpanded] = useState(true);

  // 1) Generic updater
  const updateFilter = useCallback(
    (key: keyof typeof revenueFilters, value: any) => {
      dispatch(setRevenueFilters({ ...revenueFilters, [key]: value }));
    },
    [dispatch, revenueFilters]
  );

  const handleResetFilters = () => {
    dispatch(resetRevenueAppliedFilters());
    dispatch(resetRevenueFilters());
  };

  const isDirty = useMemo(
    () => !isEqual(revenueFilters, revenueAppliedFilters),
    [revenueFilters, revenueAppliedFilters]
  );
  const canReset = useMemo(
    () => !isEqual(revenueFilters, defaultRevenueFilter),
    [revenueFilters]
  );

  const filteredHotelOptions = useMemo(() => {
    const selectedLocIds = revenueFilters.location || [];
    if (!selectedLocIds.length) return hotelOptionsId; // no location -> show all hotels
    return hotelOptionsId.filter((h) => selectedLocIds.includes(h.value));
  }, [revenueFilters.location]);

  // If user changes location, drop any hotel selections that no longer exist
  useEffect(() => {
    const currentHotels = revenueFilters.hotel || [];
    if (!currentHotels.length) return;

    const validIds = new Set(filteredHotelOptions.map((o) => o.value));
    const stillValid = currentHotels.filter((id) => validIds.has(id));

    if (stillValid.length !== currentHotels.length) {
      updateFilter("hotel", stillValid);
    }
  }, [filteredHotelOptions, revenueFilters.hotel, updateFilter]);

  const atMidnight = (d: Date | null | undefined) => {
    if (!d) return null;
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const disableStart = useCallback(
    (day: Date) => {
      const d = atMidnight(day)!;
      const end = atMidnight(revenueFilters.endDate);
      return end ? d > end : false; // disable From-Date after To-Date
    },
    [revenueFilters.endDate]
  );

  const disableEnd = useCallback(
    (day: Date) => {
      const d = atMidnight(day)!;
      const start = atMidnight(revenueFilters.startDate);
      return start ? d < start : false; // disable To-Date before From-Date
    },
    [revenueFilters.startDate]
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
              selected={revenueFilters.location}
              onChange={createMultiSelectHandler(
                revenueFilters.location,
                locationOptionsId,
                (updated) => updateFilter("location", updated)
              )}
              defaultSelectAll={false}
            />
            <MultiSelect
              label="Hotel"
              options={filteredHotelOptions}
              selected={revenueFilters.hotel}
              onChange={createMultiSelectHandler(
                revenueFilters.hotel,
                hotelOptionsId,
                (updated) => updateFilter("hotel", updated)
              )}
              defaultSelectAll={false}
            />
            <MultiSelect
              label="Revenue Stream"
              options={revenueSystemOptions}
              selected={revenueFilters.revenueStream}
              onChange={createMultiSelectHandler(
                revenueFilters.revenueStream,
                revenueSystemOptions,
                (updated) => updateFilter("revenueStream", updated)
              )}
              defaultSelectAll={false}
            />
          </div>

          {/* row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MultiSelect
              label="Ratings"
              options={ratingOptions}
              selected={revenueFilters.ratings}
              onChange={createMultiSelectHandler(
                revenueFilters.ratings,
                ratingOptions,
                (updated) => updateFilter("ratings", updated)
              )}
              defaultSelectAll={false}
            />
            <DatePicker
              label="From Date"
              date={revenueFilters.startDate}
              onChange={(d) => updateFilter("startDate", d)}
              disabled={disableStart}
            />
            <DatePicker
              label="To Date"
              date={revenueFilters.endDate}
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
