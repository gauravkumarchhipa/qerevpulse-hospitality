type FilterState = {
  location: string[];
  startDate: Date | null;
  endDate: Date | null;
  hotel: string[];
  revenueStream: string[];
};

type FilterSliceState = {
  predictedFilters: FilterState;
  predictedAppliedFilters: FilterState;
};

const today = new Date();
export const defaultPredictedAnalysisFilter: FilterState = {
  location: [],
  startDate: new Date(), // today
  // startDate: new Date(2025, today.getMonth(), today.getDate()),
  endDate: new Date("2026-12-31T00:00:00"), // 31 Dec 2025
  //  startDate:null, // today
  // endDate: null, // 31 Dec 2025
  hotel: [],
  revenueStream: [],
};

const initialState: FilterSliceState = {
  predictedFilters: defaultPredictedAnalysisFilter,
  predictedAppliedFilters: defaultPredictedAnalysisFilter,
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const predictedAnalysisFilterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // for updating the live filter UI
    setPredictedAnalysisFilters: (
      state,
      action: PayloadAction<FilterState>,
    ) => {
      state.predictedFilters = action.payload;
    },
    resetPredictedAnalysisFilters: (state) => {
      state.predictedFilters = defaultPredictedAnalysisFilter;
    },

    // for applying filters (e.g., clicking "Apply")
    setPredictedAnalysisAppliedFilters: (
      state,
      action: PayloadAction<FilterState>,
    ) => {
      state.predictedAppliedFilters = action.payload;
    },
    resetPredictedAnalysisAppliedFilters: (state) => {
      state.predictedAppliedFilters = defaultPredictedAnalysisFilter;
    },
  },
});

export const {
  setPredictedAnalysisFilters,
  resetPredictedAnalysisFilters,
  setPredictedAnalysisAppliedFilters,
  resetPredictedAnalysisAppliedFilters,
} = predictedAnalysisFilterSlice.actions;

export default predictedAnalysisFilterSlice.reducer;
