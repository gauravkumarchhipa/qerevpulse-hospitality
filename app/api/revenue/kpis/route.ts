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
  roomRevenueByHotel,
  revenueByYear,
  revenueVsBudgetByHotel,
  roomRevenueByMonth,
  revenueByLocationYearTotals,
  revenueByLocationYearSankey,
  inventoryMixByHotel,
  occupancyAdrByHotel,
  averageRoomCountByTypeMonthly,
  occupancyProfitByMonth,
  occupiedRoomCountByHotelMonthly,
} from "@/app/lib/revenue";

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

  const roomRevenue = roomRevenueByHotel(
    revenueFiltered,
    occFiltered,
    hotelMap,
    filters || {}
  );

  const roomRevenueMonthly = roomRevenueByMonth(revenueFiltered, occFiltered);

  const yearlyRevenue = revenueByYear(revenueFiltered);
  const revVsBudget = revenueVsBudgetByHotel(revenueFiltered, hotelMap);
  const byLocYearTotals = revenueByLocationYearTotals(
    revenueFiltered,
    hotelMap
  );
  const sankey = revenueByLocationYearSankey(revenueFiltered, hotelMap);

  const inventoryMix = inventoryMixByHotel(
    revenueFiltered,
    occFiltered,
    hotelMap,
    filters || {}
  );

  const occAdrByHotel = occupancyAdrByHotel(
    revenueFiltered,
    occFiltered,
    hotelMap,
    filters || {}
  );

  const avgRoomType = averageRoomCountByTypeMonthly(occFiltered);

  const occupancyProfitMonthly = occupancyProfitByMonth(
    revenueFiltered,
    occFiltered,
    hotelMap,
    filters || {}
  );

  const hotelKeyById = {
    I001: "delta",
    I002: "jumeirah",
    I003: "walk",
    I004: "marriott",
    I005: "taj",
  };

  const occupiedRoomData = occupiedRoomCountByHotelMonthly(
    occAll,
    hotelMap,
    filters || {},
    hotelKeyById
  );

  return NextResponse.json({
    count: revenueFiltered.length,
    kpis,
    roomRevenue,
    yearlyRevenue,
    revenueVsBudgetByHotel: revVsBudget,
    roomRevenueMonthly,
    byLocationYear: byLocYearTotals,
    locationYearSankey: sankey,
    inventoryMix,
    occAdrByHotel,
    avgRoomType,
    occupancyProfitMonthly,
    occupiedRoomData,
  });
}
