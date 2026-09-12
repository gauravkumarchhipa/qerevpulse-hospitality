import { NextRequest, NextResponse } from "next/server";
import {
  applyFilters,
  getHotelMap,
  loadRevenue,
  RevenueFilters,
} from "@/app/lib/daily";

export const runtime = "nodejs";
export const revalidate = 300;

export async function POST(req: NextRequest) {
  const {
    filters,
    page = 1,
    pageSize = 200,
  } = (await req.json()) as {
    filters: RevenueFilters;
    page?: number;
    pageSize?: number;
  };
  const hotelMap = getHotelMap();
  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters || {}, hotelMap);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);


  return NextResponse.json({ total, page, pageSize, rows: data });
}
