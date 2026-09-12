// app/api/predictive/kpis/route.ts
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
  getMonthlyRevenueSeries,
  getAdrAndOccupancyByHotel,
  getMonthlyRevenueByHotel,
} from "@/app/lib/predictive";

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

  const monthlyRevenueSeries = await getMonthlyRevenueSeries(filters || {});

  const adrAndOccupancyByHotel = await getAdrAndOccupancyByHotel(filters || {});

  const monthlyRevenueByHotel = await getMonthlyRevenueByHotel(filters || {});
  return NextResponse.json({
    count: revenueFiltered.length,
    kpis,
    monthlyRevenueSeries: monthlyRevenueSeries,
    adrAndOccupancyByHotel: adrAndOccupancyByHotel,
    monthlyRevenueByHotel: monthlyRevenueByHotel,
  });
}
