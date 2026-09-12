import { NextRequest, NextResponse } from "next/server";
import { applyFilters, loadRevenue, RevenueFilters } from "@/app/lib/revenue";

export const runtime = "nodejs";
export const revalidate = 300;

export async function POST(req: NextRequest) {
  const { filters, page = 1, pageSize = 200 } = await req.json() as {
    filters: RevenueFilters, page?: number, pageSize?: number
  };

  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters || {});

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return NextResponse.json({ total, page, pageSize, rows: data });
}
