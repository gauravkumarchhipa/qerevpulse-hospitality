// app/lib/seasonal.ts
import fs from "node:fs/promises";
import path from "path";

type Row = Record<string, any>;
type Hotel = {
  ID: string;
  Name: string;
  Location: string;
  "No. of Rooms": string | number;
  [k: string]: any;
};

type OccRow = {
  ID: string;
  "Hotel ID": string;
  Date: string;
  Day: string;
  Ratings: string | number;
  [k: string]: any;
};

let REVENUE_CACHE: Row[] | null = null;
let HOTELS_CACHE: Hotel[] | null = null;
let HOTEL_MAP: Record<string, Hotel> | null = null;
let OCCUPANCY_CACHE: OccRow[] | null = null;

// -------- Helpers ----------
export function toNum(s: any): number {
  if (s == null) return 0;
  if (typeof s === "number") return s;
  const t = String(s).trim().replace(/,/g, "");
  if (!t) return 0;
  if (/^\(.*\)$/.test(t)) return -Number(t.slice(1, -1));
  const n = Number(t);
  return Number.isFinite(n) ? n : 0;
}

// support "2025-01-01 0:00:00" or "10/24/2024"
function toISO(d: any): string | null {
  if (!d) return null;
  const s = String(d).trim();

  // YYYY-MM-DD...
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);

  // M/D/YYYY
  const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (m) {
    let [, mm, dd, yyyy] = m;
    let y = Number(yyyy);
    if (yyyy.length === 2) y = y >= 70 ? 1900 + y : 2000 + y;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${String(y).padStart(4, "0")}-${pad(Number(mm))}-${pad(
      Number(dd)
    )}`;
  }

  const dt = new Date(s);
  if (Number.isNaN(dt.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

const qtrFromISO = (
  iso?: string | null
): "qtr1" | "qtr2" | "qtr3" | "qtr4" | null => {
  if (!iso || iso.length < 7) return null;
  const mm = Number(iso.slice(5, 7));
  if (mm >= 1 && mm <= 3) return "qtr1";
  if (mm >= 4 && mm <= 6) return "qtr2";
  if (mm >= 7 && mm <= 9) return "qtr3";
  if (mm >= 10 && mm <= 12) return "qtr4";
  return null;
};

// -------- Normalize ----------
function normalizeRow(r: Row): Row {
  const dateISO = toISO(r["Date"]);
  return {
    ...r,
    ["Hotel ID"]:
      typeof r["Hotel ID"] === "string"
        ? r["Hotel ID"].trim().toUpperCase()
        : r["Hotel ID"],
    RevAmountNum: toNum(r["Rev. Amount"]),
    RevBudgetNum: toNum(r["Rev. Budget"]),
    LastYearRevNum: toNum(r["Last Year Rev. Amt."]), // ✅ add this
    ExpenseNum: toNum(r["Expense"]),
    ProfitNum: toNum(r["Profit"]),
    ProfitMarginNum: toNum(r["Profit Margin"]), // ← add this
    DateISO: dateISO,
    Year: dateISO ? dateISO.slice(0, 4) : null, // ✅ add this
    Quarter: dateISO ? qtrFromISO(dateISO) : null,
  };
}

function normalizeOcc(
  r: OccRow
): OccRow & { DateISO: string | null; RatingsNum: number } {
  return {
    ...r,
    ["Hotel ID"]:
      typeof r["Hotel ID"] === "string"
        ? r["Hotel ID"].trim().toUpperCase()
        : r["Hotel ID"],
    DateISO: toISO(r.Date),
    RatingsNum: toNum(r.Ratings),
    CancelledNum: toNum((r as any)["Cancelled Rooms"]),
    OccupiedNum: toNum((r as any)["Occupied Room"]),
  };
}

// -------- Loaders ----------
export async function loadRevenue(): Promise<Row[]> {
  if (REVENUE_CACHE) return REVENUE_CACHE;
  const filePath = path.join(process.cwd(), "public/data/revenue.json");
  const txt = await fs.readFile(filePath, "utf-8");
  const raw: Row[] = JSON.parse(txt);
  REVENUE_CACHE = raw.map(normalizeRow);
  return REVENUE_CACHE;
}

export async function loadHotels(): Promise<Hotel[]> {
  if (HOTELS_CACHE) return HOTELS_CACHE;
  const filePath = path.join(process.cwd(), "public/data/hotel.json");
  const txt = await fs.readFile(filePath, "utf-8");
  HOTELS_CACHE = JSON.parse(txt) as Hotel[];
  HOTEL_MAP = Object.fromEntries(HOTELS_CACHE.map((h) => [h.ID, h]));
  return HOTELS_CACHE;
}

export function getHotelMap(): Record<string, Hotel> {
  if (!HOTEL_MAP)
    throw new Error("Hotel map not initialised. Call loadHotels() first.");
  return HOTEL_MAP!;
}

export async function loadOccupancy(): Promise<OccRow[]> {
  if (OCCUPANCY_CACHE) return OCCUPANCY_CACHE;
  const filePath = path.join(process.cwd(), "public/data/occupancy.json");
  const txt = await fs.readFile(filePath, "utf-8");
  const raw: OccRow[] = JSON.parse(txt);
  OCCUPANCY_CACHE = raw.map(normalizeOcc);
  return OCCUPANCY_CACHE;
}

// -------- Filters ----------
export type RevenueFilters = {
  hotel?: string[] | null; // ["I001","I005"]
  quarter?: ("qtr1" | "qtr2" | "qtr3" | "qtr4")[] | null;
};

export function applyFilters(rows: Row[], f: RevenueFilters): Row[] {
  const hotelSet = new Set(
    (f?.hotel ?? []).map((id) => String(id).trim().toUpperCase())
  );
  const qtrSet = new Set(
    (f?.quarter ?? []).map((q) => String(q).toLowerCase())
  );

  return rows.filter((r) => {
    if (hotelSet.size && !hotelSet.has(r["Hotel ID"])) return false;
    if (qtrSet.size && (!r.Quarter || !qtrSet.has(r.Quarter))) return false;
    return true;
  });
}

export function filterOccupancy(
  occ: Awaited<ReturnType<typeof loadOccupancy>>,
  f: RevenueFilters
) {
  const hotelSet = new Set(
    (f?.hotel ?? []).map((id) => String(id).trim().toUpperCase())
  );
  const qtrSet = new Set(
    (f?.quarter ?? []).map((q) => String(q).toLowerCase())
  );

  return occ.filter((o) => {
    if (hotelSet.size && !hotelSet.has(o["Hotel ID"])) return false;

    // Quarter filter (use DateISO → qtr1..qtr4)
    if (qtrSet.size) {
      const q = o.DateISO ? qtrFromISO(o.DateISO) : null;
      if (!q || !qtrSet.has(q)) return false;
    }

    return true;
  });
}

export function capacityFromHotels(
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters,
  rows: Row[]
): number {
  const hotelSet: any = new Set(
    (filters.hotel ?? []).map((id) => String(id).trim().toUpperCase())
  );

  let idsToUse: string[];
  if (hotelSet.size) {
    idsToUse = [...hotelSet];
  } else {
    // fallback: use hotels from revenue rows
    const derived: any = new Set<string>();
    for (const r of rows) {
      if (r["Hotel ID"]) derived.add(r["Hotel ID"]);
    }
    idsToUse = [...derived];
  }

  let total = 0;
  for (const id of idsToUse) {
    const h = hotelMap[id];
    if (h) total += toNum(h["No. of Rooms"]);
  }
  return total;
}

// -------- KPI ----------
export function kpiFromRowsWithHotelsAndOccupancy(
  rows: Row[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters,
  occFiltered: ReturnType<typeof filterOccupancy>
) {
  const revenue = rows.reduce((acc, r) => acc + (r.RevAmountNum || 0), 0);
  const occupiedSum = occFiltered.reduce(
    (acc, o) => acc + (o as any).OccupiedNum || 0,
    0
  );

  const adr = occupiedSum > 0 ? revenue / occupiedSum : 0;

  const revPOR = occupiedSum > 0 ? revenue / occupiedSum : 0;

  const roomsPerDay = capacityFromHotels(hotelMap, filters, rows);
  const totalAvailable = roomsPerDay * occFiltered.length;
  const occupancyRate =
    totalAvailable > 0 ? (occupiedSum / totalAvailable) * 100 : 0;

  let maxRooms = 0;
  const hotelSet: any = new Set(
    (filters.hotel ?? []).map((id) => String(id).trim().toUpperCase())
  );
  const hotelIdsToCheck =
    hotelSet.size > 0 ? [...hotelSet] : Object.keys(hotelMap); // fallback: all hotels

  for (const id of hotelIdsToCheck) {
    const h = hotelMap[id];
    if (h) {
      const rooms = Number(h["No. of Rooms"]) || 0;
      if (rooms > maxRooms) maxRooms = rooms;
    }
  }

  const revPAR = maxRooms > 0 ? revenue / maxRooms : 0;
  return {
    Revenue: revenue,
    ADR: adr,
    OccupancyRatePct: occupancyRate,
    RevPOR: revPOR,
    RevPAR: revPAR,
  };
}

export function yearlyRevenueByCategory(rows: Row[], filters: RevenueFilters) {
  // Filter by hotel only
  const hotelSet = new Set(
    (filters?.hotel ?? []).map((id) => String(id).trim().toUpperCase())
  );

  const filtered = rows.filter((r) => {
    if (hotelSet.size && !hotelSet.has(r["Hotel ID"])) return false;
    return true;
  });

  // Group by Revenue Category
  const byCategory: Record<string, number> = {};
  for (const r of filtered) {
    const cat = r["Revenue Category"] || "Unknown";
    byCategory[cat] = (byCategory[cat] ?? 0) + (r.RevAmountNum || 0);
  }

  const data = Object.entries(byCategory).map(([name, value]) => ({
    name,
    value,
    type: value >= 0 ? "increase" : "decrease",
  }));

  // Add total row
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  data.push({
    name: "Total",
    value: totalValue,
    type: "total",
  });

  return data;
}

// app/lib/seasonal.ts

// ---- Quarterly Revenue Totals ----
export function quarterlyRevenueTotals(
  rows: Row[],
  filters: RevenueFilters
): { name: string; value: number; color: string }[] {
  // only filter by hotel
  const hotelSet = new Set(
    (filters?.hotel ?? []).map((id) => String(id).trim().toUpperCase())
  );

  const filtered = rows.filter((r) => {
    if (hotelSet.size && !hotelSet.has(r["Hotel ID"])) return false;
    return true;
  });

  // accumulate by quarter
  const sums: Record<string, number> = { qtr1: 0, qtr2: 0, qtr3: 0, qtr4: 0 };
  for (const r of filtered) {
    if (!r.Quarter) continue;
    sums[r.Quarter] += r.RevAmountNum || 0;
  }

  // map to output format
  return [
    { name: "Qtr 1", value: sums.qtr1, color: "hsl(var(--chart-1))" }, // dark teal
    { name: "Qtr 2", value: sums.qtr2, color: "hsl(var(--chart-2))" }, // mustard yellow
    { name: "Qtr 3", value: sums.qtr3, color: "hsl(var(--chart-3))" }, // brown
    { name: "Qtr 4", value: sums.qtr4, color: "hsl(var(--chart-4))" }, // red-orange
  ];
}

export function yearlyRevenueVsLastYear(
  rows: Row[],
  filters: RevenueFilters
): { name: string; revenue: number; lastYearRevenue?: number }[] {
  // Only respect hotel filter
  const hotelSet = new Set(
    (filters?.hotel ?? []).map((id) => String(id).trim().toUpperCase())
  );

  const filtered = rows.filter((r) => {
    if (hotelSet.size && !hotelSet.has(r["Hotel ID"])) return false;
    return true;
  });

  // year -> { revenue, lastYearRevenue }
  const byYear: Record<string, { revenue: number; lastYearRevenue: number }> =
    {};

  for (const r of filtered) {
    const y = (r as any).Year;
    if (!y) continue;
    if (!byYear[y]) byYear[y] = { revenue: 0, lastYearRevenue: 0 };
    byYear[y].revenue += (r as any).RevAmountNum || 0;
    byYear[y].lastYearRevenue += (r as any).LastYearRevNum || 0;
  }

  // shape, sort, and drop lastYearRevenue when it’s zero (usually the first year)
  return Object.entries(byYear)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([name, agg]) => {
      const row: { name: string; revenue: number; lastYearRevenue?: number } = {
        name,
        revenue: agg.revenue,
      };
      if (agg.lastYearRevenue !== 0) row.lastYearRevenue = agg.lastYearRevenue;
      return row;
    });
}

// ---- Inventory Trend over Time (by hotel -> [{name:"qtr1", value: 0.xx}, ...]) ----
export function inventoryTrendOverTime(
  occRows: OccRow[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters
): Record<
  string,
  { name: "qtr1" | "qtr2" | "qtr3" | "qtr4"; value: number }[]
> {
  // 1) Apply hotel+quarter filters to occupancy rows
  const occFiltered = filterOccupancy(occRows, filters);

  // 2) Work out which hotels are in scope
  const hotelIds: string[] = filters?.hotel?.length
    ? Array.from(
        new Set(filters.hotel.map((id) => String(id).trim().toUpperCase()))
      )
    : Array.from(
        new Set(occFiltered.map((o) => o["Hotel ID"]).filter(Boolean))
      );

  // 3) Prepare accumulators: hotelId -> quarter -> { occSum, days, capacityPerDay }
  type Bucket = { occSum: number; days: number; capacityPerDay: number };
  const byHotel: Record<
    string,
    Record<"qtr1" | "qtr2" | "qtr3" | "qtr4", Bucket>
  > = {};

  for (const id of hotelIds) {
    const capacityPerDay = toNum(hotelMap[id]?.["No. of Rooms"]);
    byHotel[id] = {
      qtr1: { occSum: 0, days: 0, capacityPerDay },
      qtr2: { occSum: 0, days: 0, capacityPerDay },
      qtr3: { occSum: 0, days: 0, capacityPerDay },
      qtr4: { occSum: 0, days: 0, capacityPerDay },
    };
  }

  // 4) Tally occupancy per hotel per quarter
  for (const o of occFiltered) {
    const id = o["Hotel ID"];
    if (!id || !byHotel[id]) continue;
    const q = o.DateISO ? qtrFromISO(o.DateISO) : null;
    if (!q) continue;

    byHotel[id][q].occSum += o.OccupiedNum || 0;
    byHotel[id][q].days += 1; // each row counts as one day’s availability
  }

  // 5) Build the final structure keyed by hotel name
  const allowQuarters = (
    filters?.quarter?.length
      ? new Set(filters.quarter.map((q) => q.toLowerCase()))
      : new Set(["qtr1", "qtr2", "qtr3", "qtr4"])
  ) as Set<"qtr1" | "qtr2" | "qtr3" | "qtr4">;

  const result: Record<
    string,
    { name: "qtr1" | "qtr2" | "qtr3" | "qtr4"; value: number }[]
  > = {};

  for (const id of hotelIds) {
    const h = hotelMap[id];
    if (!h) continue;
    const buckets = byHotel[id];

    const quarters: ("qtr1" | "qtr2" | "qtr3" | "qtr4")[] = [
      "qtr1",
      "qtr2",
      "qtr3",
      "qtr4",
    ];
    const arr = quarters
      .filter((q) => allowQuarters.has(q))
      .map((q) => {
        const { occSum, days, capacityPerDay } = buckets[q];
        const totalAvailable = capacityPerDay * days; // capacity per day * number of days in that quarter (across all years)
        const value = totalAvailable > 0 ? occSum / totalAvailable : 0; // occupancy rate 0..1
        return { name: q, value: Number(value.toFixed(2)) };
      });

    // Use the display name from hotel.json
    result[h.Name] = arr;
  }

  return result;
}

// --- Flexible: Yearly by default; Quarterly when quarter filter is present ---
export function bookingAndCancelAverage(
  occRows: OccRow[],
  filters: RevenueFilters
): { name: string; bookings: number; cancellations: number }[] {
  // 1) Apply BOTH filters (hotel + quarter) via filterOccupancy
  const occFiltered = filterOccupancy(occRows, filters);

  // 2) Group by year
  const agg: Record<string, { b: number; c: number; n: number }> = {};

  for (const o of occFiltered) {
    const iso = (o as any).DateISO || toISO((o as any).Date);
    if (!iso) continue;
    const y = iso.slice(0, 4);

    const bookings = toNum((o as any).Bookings);
    const cancelled = toNum(
      (o as any).CancelledNum ?? (o as any)["Cancelled Rooms"]
    );

    if (!agg[y]) agg[y] = { b: 0, c: 0, n: 0 };
    agg[y].b += bookings;
    agg[y].c += cancelled;
    agg[y].n += 1;
  }

  // 3) Shape & sort (one row per year)
  return Object.entries(agg)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([name, { b, c, n }]) => ({
      name, // year
      bookings: n > 0 ? Number((b / n).toFixed(0)) : 0,
      cancellations: n > 0 ? Number((c / n).toFixed(0)) : 0,
    }));
}

// ---- Quarterly revenue timeline (year/quarter with YTD) ----
export function quarterlyRevenueTimeline(
  rows: Row[],
  filters: RevenueFilters
): Array<{
  year: number;
  quarter: "Qtr 1" | "Qtr 2" | "Qtr 3" | "Qtr 4";
  revenue: number;
  cumulativeRevenue: number;
  lastYearRevenue: number | null;
  variancePercent: number | null; // (rev - budget) / budget * 100
}> {
  type QKey = "qtr1" | "qtr2" | "qtr3" | "qtr4";
  const qOrder: QKey[] = ["qtr1", "qtr2", "qtr3", "qtr4"];
  const qLabel: Record<QKey, "Qtr 1" | "Qtr 2" | "Qtr 3" | "Qtr 4"> = {
    qtr1: "Qtr 1",
    qtr2: "Qtr 2",
    qtr3: "Qtr 3",
    qtr4: "Qtr 4",
  };

  // intersection (hotel + quarter) for period values
  const periodRows = applyFilters(rows, filters || {});

  // hotel-only (ignore quarter) for cumulative (DAX-style ALL on quarter)
  const hotelOnlyFilters: RevenueFilters = {
    hotel: filters?.hotel ?? null,
    quarter: null,
  };
  const cumRows = applyFilters(rows, hotelOnlyFilters);

  // years present after hotel filter
  const yearsSet = new Set<number>();
  for (const r of cumRows) {
    const y = (r as any).Year ? Number((r as any).Year) : NaN;
    if (!Number.isNaN(y)) yearsSet.add(y);
  }
  const years = Array.from(yearsSet).sort((a, b) => a - b);

  // (year, quarter) -> sums
  const perPeriod: Record<string, { rev: number; ly: number; bud: number }> =
    {};
  for (const r of periodRows) {
    const y = (r as any).Year;
    const q = (r as any).Quarter as QKey | null;
    if (!y || !q) continue;
    const key = `${y}_${q}`;
    if (!perPeriod[key]) perPeriod[key] = { rev: 0, ly: 0, bud: 0 };
    perPeriod[key].rev += (r as any).RevAmountNum || 0;
    perPeriod[key].ly += (r as any).LastYearRevNum || 0;
    perPeriod[key].bud += (r as any).RevBudgetNum || 0; // <- add budget
  }

  // cumulative (hotel filter only)
  const cumBucket: Record<number, Record<QKey, number>> = {};
  const partial: Record<number, Record<QKey, number>> = {};
  for (const y of years) {
    cumBucket[y] = { qtr1: 0, qtr2: 0, qtr3: 0, qtr4: 0 };
    partial[y] = { qtr1: 0, qtr2: 0, qtr3: 0, qtr4: 0 };
  }
  for (const r of cumRows) {
    const y = (r as any).Year ? Number((r as any).Year) : NaN;
    const q = (r as any).Quarter as QKey | null;
    if (Number.isNaN(y) || !q) continue;
    partial[y][q] += (r as any).RevAmountNum || 0;
  }
  for (const y of years) {
    let running = 0;
    for (const q of qOrder) {
      running += partial[y][q];
      cumBucket[y][q] = running;
    }
  }

  const allowedQuarters: Set<QKey> = (
    filters?.quarter?.length
      ? new Set(filters.quarter.map((q) => q.toLowerCase() as QKey))
      : new Set(qOrder)
  ) as Set<QKey>;

  const out: Array<{
    year: number;
    quarter: "Qtr 1" | "Qtr 2" | "Qtr 3" | "Qtr 4";
    revenue: number;
    cumulativeRevenue: number;
    lastYearRevenue: number | null;
    variancePercent: number | null;
  }> = [];

  for (const y of years) {
    for (const q of qOrder) {
      if (!allowedQuarters.has(q)) continue;

      const key = `${y}_${q}`;
      const rev = perPeriod[key]?.rev ?? 0;
      const ly = perPeriod[key]?.ly ?? 0;
      const bud = perPeriod[key]?.bud ?? 0;
      const cum = cumBucket[y][q] ?? 0;

      // variance vs budget (as %)
      const variancePercent =
        bud > 0 ? Number((((rev - bud) / bud) * 100).toFixed(2)) : null;

      out.push({
        year: y,
        quarter: qLabel[q],
        revenue: rev,
        cumulativeRevenue: cum,
        lastYearRevenue: ly > 0 ? ly : null,
        variancePercent,
      });
    }
  }
  return out;
}

export function categoryOccupancyElasticity(
  revenueRows: Row[],
  occRows: OccRow[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters
): Array<{ name: string; occupancyRate: number; elasticity: number }> {
  // ---- 1) Apply filters ----
  // Revenue: intersect hotel + quarter
  const revFiltered = applyFilters(revenueRows, filters || {});

  // Occupancy: intersect hotel + quarter
  const occFiltered = filterOccupancy(occRows, filters || {});

  // ---- 2) Elasticity by Revenue Category (sum Profit Margin) ----
  const byCat: Record<string, number> = {};
  for (const r of revFiltered) {
    const cat = (r["Revenue Category"] as string) || "Unknown";
    const pm = (r as any).ProfitMarginNum ?? toNum(r["Profit Margin"]);
    byCat[cat] = (byCat[cat] ?? 0) + (pm || 0);
  }

  // ---- 3) Overall occupancy rate for current scope ----
  //   occRate = sum(Occupied Room) / (roomsPerDay * daysCount)
  let occupiedSum = 0;
  for (const o of occFiltered) {
    occupiedSum += (o as any).OccupiedNum ?? toNum((o as any)["Occupied Room"]);
  }

  // Capacity per day from selected hotels (or derived)
  // Use your existing helper so it respects hotel filter.
  const roomsPerDay = capacityFromHotels(hotelMap, filters || {}, revFiltered);
  const daysCount = occFiltered.length;
  const occRate =
    roomsPerDay > 0 && daysCount > 0
      ? occupiedSum / (roomsPerDay * daysCount)
      : 0;

  // ---- 4) Shape output (same occupancyRate on every row) ----
  return Object.entries(byCat)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, elasticity]) => ({
      name,
      occupancyRate: Number(occRate.toFixed(2)), // e.g., 0.56
      elasticity: Number((elasticity / 10).toFixed(2)),
    }));
}
