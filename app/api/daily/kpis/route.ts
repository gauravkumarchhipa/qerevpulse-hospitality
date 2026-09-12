// app/api/revenue/kpis/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  applyFilters,
  loadRevenue,
  loadHotels,
  getHotelMap,
  loadOccupancy,
  filterOccupancy,
  kpiFromRowsWithHotelsAndOccupancy,
  RevenueFilters,
  getHotelRevenues,
  getYearOverYearRevenueData,
  getCategoryBreakDown,
  getCategoryProfitRawData,
  getRevenueByCategory,
  getRevenueEventRows,
  getYearlyDiscountByHotel,
  getRevenueHierarchy,
} from "@/app/lib/daily";

export const runtime = "nodejs";
export const revalidate = 300;

export async function POST(req: NextRequest) {
  const filters = (await req?.json()) as RevenueFilters;

  await Promise.all([loadRevenue(), loadHotels(), loadOccupancy()]);
  const hotelMap = getHotelMap();
  const [revenueRows, occAll] = await Promise.all([
    loadRevenue(),
    loadOccupancy(),
  ]);

  // ✅ Pass hotelMap into filters
  const revenueFiltered = applyFilters(revenueRows, filters || {}, hotelMap);
  const occFiltered = filterOccupancy(occAll, filters || {}, hotelMap);

  const kpis = kpiFromRowsWithHotelsAndOccupancy(
    revenueFiltered,
    hotelMap,
    filters || {},
    occFiltered
  );

  // ✅ Pass filters into getHotelRevenues so hotel list respects selections
  const hotelSummaries = await getHotelRevenues(filters || {});
  const YearOverYearRevenueData = await getYearOverYearRevenueData(
    filters || {}
  );

  const categoryBreakDown = await getCategoryBreakDown(filters || {});

  const categoryProfitRawData = await getCategoryProfitRawData(filters || {});

  const revenueByCategory = await getRevenueByCategory(filters || {});

  const RevenueEventRows = await getRevenueEventRows(filters || {});

  const yearlyDiscountByHotel = await getYearlyDiscountByHotel();

  const revenueHierarchy = await getRevenueHierarchy(filters || {});

  return NextResponse.json({
    count: revenueFiltered.length,
    kpis,
    hotels: hotelSummaries,
    YearOverYearRevenueData: YearOverYearRevenueData,
    categoryBreakDown: categoryBreakDown,
    categoryProfitRawData: categoryProfitRawData,
    revenueByCategory: revenueByCategory,
    revenueEventRows: RevenueEventRows,
    yearlyDiscountByHotel: yearlyDiscountByHotel,
    revenueHierarchy: revenueHierarchy,
  });
}
