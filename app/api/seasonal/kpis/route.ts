// app/api/revenue/kpis/route.ts
import {
  applyFilters,
  bookingAndCancelAverage,
  categoryOccupancyElasticity,
  filterOccupancy,
  getHotelMap,
  inventoryTrendOverTime,
  kpiFromRowsWithHotelsAndOccupancy,
  loadHotels,
  loadOccupancy,
  loadRevenue,
  quarterlyRevenueTimeline,
  quarterlyRevenueTotals,
  RevenueFilters,
  yearlyRevenueByCategory,
  yearlyRevenueVsLastYear,
} from "@/app/lib/seasonal";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300;

export async function POST(req: NextRequest) {
  const filters = (await req?.json()) as RevenueFilters;

  // Warm all caches (important in dev)
  const [revenueRows] = await Promise.all([
    loadRevenue(),
    loadHotels(),
    loadOccupancy(),
  ]);

  const hotelMap = getHotelMap();
  const occAll = await loadOccupancy();

  // Apply your revenue filters first (IDs/date/stream)
  const revenueFiltered = applyFilters(revenueRows, filters || {});

  // Apply the same filters to occupancy (includes ratings)
  const occFiltered = filterOccupancy(occAll, filters || {});

  const kpis = kpiFromRowsWithHotelsAndOccupancy(
    revenueFiltered,
    hotelMap,
    filters || {},
    occFiltered
  );
  const quarterlyRevenue = quarterlyRevenueTotals(revenueRows, filters || {});
  const yearlyRevenue = yearlyRevenueByCategory(revenueRows, filters || {});
  const yearlyRevenueVsLY = yearlyRevenueVsLastYear(revenueRows, filters || {});
  const inventoryTrend = inventoryTrendOverTime(
    occAll,
    hotelMap,
    filters || {}
  );

  const bookingCancelAverage = bookingAndCancelAverage(occAll, filters || {});

  const quarterlyTimeline = quarterlyRevenueTimeline(
    revenueRows,
    filters || {}
  );

  const categoryElasticity = categoryOccupancyElasticity(
    revenueRows,
    occAll,
    hotelMap,
    filters || {}
  );

  return NextResponse.json({
    count: revenueFiltered.length,
    kpis,
    yearlyRevenue,
    quarterlyRevenue,
    yearlyRevenueVsLastYear: yearlyRevenueVsLY,
    inventoryTrend,
    bookingCancelAverage,
    quarterlyTimeline,
    categoryElasticity,
  });
}
