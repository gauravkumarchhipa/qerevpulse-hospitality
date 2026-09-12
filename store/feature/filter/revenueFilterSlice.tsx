type FilterState = {
  location: string[];
  startDate: Date | null;
  endDate: Date | null;
  hotel: string[];
  revenueStream: string[];
  ratings: string[];
};

type FilterSliceState = {
  revenueFilters: FilterState;
  revenueAppliedFilters: FilterState;
};

export const defaultRevenueFilter: FilterState = {
  location: [],
  startDate: null,
  endDate: null,
  hotel: [],
  revenueStream: [],
  ratings: [],
};

const initialState: FilterSliceState = {
  revenueFilters: defaultRevenueFilter,
  revenueAppliedFilters: defaultRevenueFilter,
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const revenueFilterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // for updating the live filter UI
    setRevenueFilters: (state, action: PayloadAction<FilterState>) => {
      state.revenueFilters = action.payload;
    },
    resetRevenueFilters: (state) => {
      state.revenueFilters = defaultRevenueFilter;
    },

    // for applying filters (e.g., clicking "Apply")
    setRevenueAppliedFilters: (state, action: PayloadAction<FilterState>) => {
      state.revenueAppliedFilters = action.payload;
    },
    resetRevenueAppliedFilters: (state) => {
      state.revenueAppliedFilters = defaultRevenueFilter;
    },
  },
});

export const {
  setRevenueFilters,
  resetRevenueFilters,
  setRevenueAppliedFilters,
  resetRevenueAppliedFilters,
} = revenueFilterSlice.actions;

export default revenueFilterSlice.reducer;
