type FilterState = {
  quarter: string[];
  hotel: string[];
};

type FilterSliceState = {
  seasonalAnalysisFilters: FilterState;
  seasonalAnalysisAppliedFilters: FilterState;
};

export const defaultSeasonalAnalysisFilter: FilterState = {
  quarter: [],
  hotel: [],
};

const initialState: FilterSliceState = {
  seasonalAnalysisFilters: defaultSeasonalAnalysisFilter,
  seasonalAnalysisAppliedFilters: defaultSeasonalAnalysisFilter,
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const seasonalAnalysisSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // for updating the live filter UI
    setSeasonalAnalysisFilters: (state, action: PayloadAction<FilterState>) => {
      state.seasonalAnalysisFilters = action.payload;
    },
    resetSeasonalAnalysisFilters: (state) => {
      state.seasonalAnalysisFilters = defaultSeasonalAnalysisFilter;
    },

    // for applying filters (e.g., clicking "Apply")
    setSeasonalAnalysisAppliedFilters: (
      state,
      action: PayloadAction<FilterState>
    ) => {
      state.seasonalAnalysisAppliedFilters = action.payload;
    },
    resetSeasonalAnalysisAppliedFilters: (state) => {
      state.seasonalAnalysisAppliedFilters = defaultSeasonalAnalysisFilter;
    },
  },
});

export const {
  setSeasonalAnalysisFilters,
  resetSeasonalAnalysisFilters,
  setSeasonalAnalysisAppliedFilters,
  resetSeasonalAnalysisAppliedFilters,
} = seasonalAnalysisSlice.actions;

export default seasonalAnalysisSlice.reducer;
