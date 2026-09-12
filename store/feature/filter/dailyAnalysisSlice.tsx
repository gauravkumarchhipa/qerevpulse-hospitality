type FilterState = {
  location: string[];
  startDate: Date | null;
  endDate: Date | null;
  hotel: string[];
  revenueStream: string[];
  event: string[];
};

type FilterSliceState = {
  dailyAnalysisFilters: FilterState;
  dailyAnalysisAppliedFilters: FilterState;
};

export const defaultDailyAnalysisFilter: FilterState = {
  location: [],
  startDate: null,
  endDate: null,
  hotel: [],
  revenueStream: [],
  event: [],
};

const initialState: FilterSliceState = {
  dailyAnalysisFilters: defaultDailyAnalysisFilter,
  dailyAnalysisAppliedFilters: defaultDailyAnalysisFilter,
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const dailyAnalysisFilterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // for updating the live filter UI
    setDailyAnalysisFilters: (state, action: PayloadAction<FilterState>) => {
      state.dailyAnalysisFilters = action.payload;
    },
    resetDailyAnalysisFilters: (state) => {
      state.dailyAnalysisFilters = defaultDailyAnalysisFilter;
    },

    // for applying filters (e.g., clicking "Apply")
    setDailyAnalysisAppliedFilters: (
      state,
      action: PayloadAction<FilterState>
    ) => {
      state.dailyAnalysisAppliedFilters = action.payload;
    },
    resetDailyAnalysisAppliedFilters: (state) => {
      state.dailyAnalysisAppliedFilters = defaultDailyAnalysisFilter;
    },
  },
});

export const {
  setDailyAnalysisFilters,
  resetDailyAnalysisFilters,
  setDailyAnalysisAppliedFilters,
  resetDailyAnalysisAppliedFilters,
} = dailyAnalysisFilterSlice.actions;

export default dailyAnalysisFilterSlice.reducer;
