import { RootState } from "@/store/store";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type Kpis = {
  Revenue: number;
  ADR: number;
  AvgReviewScore: number;
  TotalCapacity: number;
  CancellationRatePct: number;
  OccupancyRatePct: number;
  Expense: number;
  Profit: number;
  RevenueByDay: any;
  revenueVsBudgetByHotel: any;
  roomRevenueMonthly: any;
  locationYearSankey: any;
  byLocationYear: any;
  inventoryMix: any;
  occAdrByHotel: any;
  avgRoomType: any;
  occupancyProfitMonthly: any;
  occupiedRoomData: any;
};

type State = {
  kpis: Kpis | null;
  loading: boolean;
  error: string | null;
};

const initialState: State = { kpis: null, loading: false, error: null };

const formatDate = (date: any) => {
  if (!date) return null; // keep null if not set
  return new Date(date).toISOString().split("T")[0]; // "YYYY-MM-DD"
};

export const fetchKpis = createAsyncThunk<Kpis, void, { state: RootState }>(
  "revenueKpi/fetch",
  async (_void, { getState, signal, rejectWithValue }) => {
    const { revenueAppliedFilters } = getState().revenueFilter;

    try {
      const res = await fetch("/api/revenue/kpis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: revenueAppliedFilters.location ?? null,
          startDate: formatDate(revenueAppliedFilters.startDate),
          endDate: formatDate(revenueAppliedFilters.endDate),
          hotel: revenueAppliedFilters.hotel ?? null,
          revenueStream: revenueAppliedFilters.revenueStream ?? null,
          ratings: revenueAppliedFilters.ratings ?? null,
        }),
        signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // return data.kpis as Kpis;
      return data;
    } catch (err: any) {
      if (err?.name === "AbortError") throw err; // let RTK handle aborts cleanly
      return rejectWithValue(err?.message ?? "Failed to fetch KPIs");
    }
  }
);

const revenueKpiSlice = createSlice({
  name: "revenueKpi",
  initialState,
  reducers: {
    resetKpis: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKpis.fulfilled, (state, action: PayloadAction<Kpis>) => {
        state.loading = false;
        state.kpis = action.payload;
      })
      .addCase(fetchKpis.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error";
      });
  },
});

export const { resetKpis } = revenueKpiSlice.actions;
export default revenueKpiSlice.reducer;

// selectors
export const selectKpis = (s: RootState) => s.revenueKpi.kpis;
export const selectKpiLoading = (s: RootState) => s.revenueKpi.loading;
export const selectKpiError = (s: RootState) => s.revenueKpi.error;
