import { configureStore } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import {
  dailyAnalysisFilterReducer,
  dailyReducer,
  filterReducer,
  predictedAnalysisFilterReducer,
  predictiveReducer,
  revenueFilterReducer,
  revenueReducer,
  seasonalAnalysisReducer,
  seasonalReducer,
} from "./feature";

// 1️⃣ Combine reducers
const rootReducer = combineReducers({
  filters: filterReducer,
  revenueFilter: revenueFilterReducer,
  predictedFilter: predictedAnalysisFilterReducer,
  dailyAnalysisFilter: dailyAnalysisFilterReducer,
  seasonalAnalysisFilter: seasonalAnalysisReducer,
  revenueKpi: revenueReducer,
  seasonalKpi: seasonalReducer,
  dailyKpi: dailyReducer,
  predictiveKpi: predictiveReducer,
});

// 2️⃣ Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: [],
};

// 3️⃣ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// 5️⃣ Create persistor
export const persistor = persistStore(store);

// 6️⃣ Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
