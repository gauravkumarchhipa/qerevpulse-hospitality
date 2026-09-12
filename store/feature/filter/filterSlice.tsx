type FilterState = {
  timeRange: string;
  startDate: Date | null;
  endDate: Date | null;
  departments: string[];
  compareWith: string;
  view: string;
};

type FilterSliceState = {
  filters: FilterState;
  appliedFilters: FilterState;
};

export const defaultFilter: FilterState = {
  timeRange: "monthly",
  startDate: null,
  endDate: null,
  departments: [],
  compareWith: "previousPeriod",
  view: "month",
};

const initialState: FilterSliceState = {
  filters: defaultFilter,
  appliedFilters: defaultFilter,
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // for updating the live filter UI
    setFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
    },
    resetFilters: (state) => {
      state.filters = defaultFilter;
    },

    // for applying filters (e.g., clicking "Apply")
    setAppliedFilters: (state, action: PayloadAction<FilterState>) => {
      state.appliedFilters = action.payload;
    },
    resetAppliedFilters: (state) => {
      state.appliedFilters = defaultFilter;
    },
  },
});

export const {
  setFilters,
  resetFilters,
  setAppliedFilters,
  resetAppliedFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
