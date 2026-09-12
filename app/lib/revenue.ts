// app/lib/revenue.ts
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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const mmFromISO = (iso?: string | null) =>
  !iso ? null : Math.max(1, Math.min(12, Number(iso.slice(5, 7))));

const LOCATION_COLORS: string[] = [
  "#555B5F",
  // "#FFD700",
  "#FF7333",
  "#C70039",
  "#900C3F",
  "#581845",
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
];

const LOCATION_COLORS2: string[] = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
];

const colorFor = (i: number) => LOCATION_COLORS[i % LOCATION_COLORS.length];
const colorFor2 = (i: number) => LOCATION_COLORS2[i % LOCATION_COLORS2?.length];

// YYYY from DateISO
const yearFromISO = (iso?: string | null) => (!iso ? null : iso.slice(0, 4));

// Compact number for labels
const compact = (n: number) => {
  const a = Math.abs(n);
  if (a >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (a >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (a >= 1_000) return (n / 1_000).toFixed(2) + "K";
  return n.toFixed(0);
};

export async function loadRevenue(): Promise<Row[]> {
  if (REVENUE_CACHE) return REVENUE_CACHE;
  const filePath = path.join(process.cwd(), "public/data/revenue.json"); // Use path.join
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

// convert strings like "693.05 ", "(44.64)" to numbers
export function toNum(s: any): number {
  if (s == null) return 0;
  if (typeof s === "number") return s;
  const t = String(s).trim().replace(/,/g, "");
  if (!t) return 0;
  if (/^\(.*\)$/.test(t)) return -Number(t.slice(1, -1));
  const n = Number(t);
  return Number.isFinite(n) ? n : 0;
}

// normalize often-used fields
function normalizeRow(r: Row): Row {
  return {
    ...r,
    RevAmountNum: toNum(r["Rev. Amount"]),
    RevBudgetNum: toNum(r["Rev. Budget"]),
    ExpenseNum: toNum(r["Expense"]),
    ProfitNum: toNum(r["Profit"]),
    DateISO: toISO(r["Date"]),
  };
}

// normalize occupancy row
function normalizeOcc(
  r: OccRow
): OccRow & { DateISO: string | null; RatingsNum: number } {
  return {
    ...r,
    DateISO: toISO(r.Date),
    RatingsNum: toNum(r.Ratings),
    CancelledNum: toNum((r as any)["Cancelled Rooms"]),
    OccupiedNum: toNum((r as any)["Occupied Room"]),

    SingleNum: toNum((r as any)["Single Room"]),
    DoubleNum: toNum((r as any)["Double Room"]),
    SuiteNum: toNum((r as any)["Suite"]),
    DeluxeNum: toNum((r as any)["Deluxe Room"]),
  };
}

function toISO(d: any): string | null {
  if (!d) return null;
  const s = String(d).trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // M/D/YYYY or MM/DD/YYYY (or with '-')
  const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (m) {
    let [, mm, dd, yyyy] = m;
    let y = Number(yyyy);
    if (yyyy.length === 2) y = y >= 70 ? 1900 + y : 2000 + y; // handle YY
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${String(y).padStart(4, "0")}-${pad(Number(mm))}-${pad(
      Number(dd)
    )}`;
  }

  // Fallback: Date parsing without converting to UTC date string
  const dt = new Date(s);
  if (Number.isNaN(dt.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

export type RevenueFilters = {
  location?: string[] | null; // IDs like ["I001"]
  startDate?: string | null; // YYYY-MM-DD (applies to revenue only)
  endDate?: string | null; // YYYY-MM-DD (applies to revenue only)
  hotel?: string[] | null; // IDs like ["I001"]
  revenueStream?: string[] | null; // maps to "Revenue Category" (revenue only)
  ratings?: string[] | null; // if present in revenue rows
};

// export function applyFilters(rows: Row[], f: RevenueFilters): Row[] {
//   const { location, startDate, endDate, hotel, revenueStream, ratings } =
//     f || {};

//   return rows.filter((r) => {
//     if (location?.length && !location.includes(r["Hotel ID"])) return false;
//     if (hotel?.length && !hotel.includes(r["Hotel ID"])) return false;
//     if (revenueStream?.length && !revenueStream.includes(r["Revenue Category"]))
//       return false;
//     if (ratings?.length && !ratings.includes(String(r.Ratings))) return false;

//     if (startDate && r.DateISO && r.DateISO < startDate) return false;
//     if (endDate && r.DateISO && r.DateISO > endDate) return false;

//     return true;
//   });
// }

// Allow restricting revenue to hotels in occFiltered:
export function applyFilters(
  rows: Row[],
  f: RevenueFilters,
  allowedHotelIds?: Set<string> // <- optional
): Row[] {
  const { location, startDate, endDate, hotel, revenueStream } = f || {};

  return rows.filter((r) => {
    const hid = r["Hotel ID"];

    // normal filters
    if (location?.length && !location.includes(hid)) return false;
    if (hotel?.length && !hotel.includes(hid)) return false;
    if (revenueStream?.length && !revenueStream.includes(r["Revenue Category"]))
      return false;

    // sync revenue scope with the occupancy scope when ratings are used
    if (allowedHotelIds && !allowedHotelIds.has(hid)) return false;

    if (startDate && r.DateISO && r.DateISO < startDate) return false;
    if (endDate && r.DateISO && r.DateISO > endDate) return false;

    return true;
  });
}

// ---- Occupancy filters (to compute ratings & optionally constrain hotels by ratings) ----
export function filterOccupancy(
  occ: Awaited<ReturnType<typeof loadOccupancy>>,
  f: RevenueFilters
) {
  const { location, hotel, startDate, endDate, ratings } = f || {};
  return occ.filter((o) => {
    if (location?.length && !location.includes(o["Hotel ID"])) return false;
    if (hotel?.length && !hotel.includes(o["Hotel ID"])) return false;

    if (startDate && o.DateISO && o.DateISO < startDate) return false;
    if (endDate && o.DateISO && o.DateISO > endDate) return false;

    if (ratings?.length && !ratings.includes(String(o.RatingsNum)))
      return false;
    // or, if your UI passes numbers:
    // if (ratings?.length && !ratings.includes(o.RatingsNum)) return false;

    return true;
  });
}

// ---- Day grouping for chart ----
function groupByDay(rows: Row[]) {
  const dayTotals: Record<string, number> = {};
  for (const r of rows) {
    const day = r.Days;
    if (!dayTotals[day]) dayTotals[day] = 0;
    dayTotals[day] += r.RevAmountNum || 0;
  }
  return Object.entries(dayTotals).map(([day, value]) => ({
    name: day,
    value,
  }));
}

function capacityFromHotelsUsingFilters(
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters,
  filteredRevenueRows: Row[]
): number {
  // Sets from explicit filters (IDs like "I001")
  const hotelSet: any = new Set(
    (filters.hotel ?? []).filter(Boolean) as string[]
  );
  const locationSet: any = new Set(
    (filters.location ?? []).filter(Boolean) as string[]
  );

  let idsToUse: string[] = [];

  if (hotelSet.size && locationSet.size) {
    // AND semantics: intersection
    idsToUse = [...hotelSet].filter((id) => locationSet.has(id));
  } else if (hotelSet.size) {
    // only hotel filter provided
    idsToUse = [...hotelSet];
  } else if (locationSet.size) {
    // only location filter provided
    idsToUse = [...locationSet];
  } else {
    // no explicit hotel/location filters:
    // fall back to hotels implied by the filtered revenue rows
    const derived: any = new Set<string>();
    for (const r of filteredRevenueRows) {
      const id = r["Hotel ID"];
      if (id) derived.add(id);
    }
    idsToUse = derived.size ? [...derived] : Object.keys(hotelMap);
  }

  // If the AND intersection is empty, capacity should be 0
  if (!idsToUse.length) return 0;

  // Sum “No. of Rooms” for the chosen hotel IDs
  let total = 0;
  for (const id of idsToUse) {
    const h = hotelMap[id];
    if (h) total += toNum(h["No. of Rooms"]);
  }
  return total;
}

function capacityFromHotelsForOccupancyScope(
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters,
  occFiltered: ReturnType<typeof filterOccupancy>
): number {
  const hotelSet: any = new Set(
    (filters.hotel ?? []).filter(Boolean) as string[]
  );
  const locationSet: any = new Set(
    (filters.location ?? []).filter(Boolean) as string[]
  );

  let idsToUse: string[] = [];
  if (hotelSet.size && locationSet.size) {
    idsToUse = [...hotelSet].filter((id) => locationSet.has(id)); // AND
  } else if (hotelSet.size) {
    idsToUse = [...hotelSet];
  } else if (locationSet.size) {
    idsToUse = [...locationSet];
  } else {
    // if no explicit hotel/location filter, you can choose one of the two semantics:
    // A) derive from occupancy rows (context of the numerator)
    const derived: any = new Set<string>();
    for (const o of occFiltered) {
      const id = o["Hotel ID"];
      if (id) derived.add(id);
    }
    idsToUse = derived.size ? [...derived] : Object.keys(hotelMap);
    // B) OR: sum ALL hotels -> idsToUse = Object.keys(hotelMap);
  }

  if (!idsToUse.length) return 0;

  let total = 0;
  for (const id of idsToUse) {
    const h = hotelMap[id];
    if (h) total += toNum(h["No. of Rooms"]);
  }
  return total;
}

// export function kpiFromRowsWithHotelsAndOccupancy(
//   rows: Row[],
//   hotelMap: Record<string, Hotel>,
//   filters: RevenueFilters,
//   occFiltered: ReturnType<typeof filterOccupancy>
// ) {
//   const revenue = sum(rows, (r) => r.RevAmountNum);
//   const expense = sum(rows, (r) => r.ExpenseNum);
//   const profit = sum(rows, (r) => r.ProfitNum);

//   const capacity = capacityFromHotelsUsingFilters(hotelMap, filters, rows);

//   // const avgReview = average(rows, (r) => toNum(r["Avg Review Score"]));
//   const avgReview = average(occFiltered, (o) => toNum(o.Ratings));
//   // const adr = average(rows, (r) => toNum(r["ADR"]));
//   const revenueSum = sum(rows, (r) => r.RevAmountNum); // NUMERATOR
//   const occupiedSum = sum(occFiltered, (o) => (o as any).OccupiedNum || 0); // DENOMINATOR

//   // ✅ ADR per formula
//   const adr = occupiedSum > 0 ? revenueSum / occupiedSum : 0;

//   // const cancelRate = average(rows, (r) => toNum(r["Cancellation Rate (%)"]));
//   const totalCancelled = sum(occFiltered, (o) => (o as any).CancelledNum || 0);
//   const capacityForCancel = capacityFromHotelsForOccupancyScope(
//     hotelMap,
//     filters,
//     occFiltered
//   );
//   const cancelRate =
//     capacityForCancel > 0 ? totalCancelled / capacityForCancel : 0;

//   const totalOccupied = sum(occFiltered, (o) => (o as any).OccupiedNum || 0);
//   const roomsForOcc = capacityFromHotelsForOccupancyScope(
//     hotelMap,
//     filters,
//     occFiltered
//   );
//   // console.log(capacity, occFiltered.length,totalOccupied)
//   const rowsCount = occFiltered.length;
//   const occupancyRate =
//     roomsForOcc > 0 && rowsCount > 0
//       ? (totalOccupied / (capacity * occFiltered.length)) * 100
//       : 0;

//   return {
//     Revenue: revenue,
//     ADR: adr,
//     AvgReviewScore: avgReview,
//     TotalCapacity: capacity, // ← from hotel.json (filtered)
//     CancellationRatePct: cancelRate,
//     OccupancyRatePct: occupancyRate,
//     Expense: expense,
//     Profit: profit,
//     RevenueByDay: groupByDay(rows),
//   };
// }


// ********************************************************************************************
// export function kpiFromRowsWithHotelsAndOccupancy(
//   rows: Row[], // all revenue rows (unfiltered or date-filtered)
//   hotelMap: Record<string, Hotel>,
//   filters: RevenueFilters,
//   occFiltered: ReturnType<typeof filterOccupancy> // already filtered by ratings, date, etc.
// ) {
//   // ⬇️ Align revenue scope with occ scope
//   const allowedIds = new Set(occFiltered.map((o) => o["Hotel ID"]));
//   const revenueInScope = applyFilters(
//     rows,
//     { ...filters, ratings: null },
//     allowedIds
//   );

//   const revenue = sum(revenueInScope, (r) => r.RevAmountNum);
//   const expense = sum(revenueInScope, (r) => r.ExpenseNum);
//   const profit = sum(revenueInScope, (r) => r.ProfitNum);

//   // use normalized ratings number for averages
//   const avgReview = average(occFiltered, (o) => (o as any).RatingsNum);

//   // ADR = revenue / occupied rooms (both in same scope!)
//   const revenueSum = revenue;
//   const occupiedSum = sum(occFiltered, (o) => (o as any).OccupiedNum || 0);
//   const adr = occupiedSum > 0 ? revenueSum / occupiedSum : 0;

//   const capacity = capacityFromHotelsUsingFilters(
//     hotelMap,
//     filters,
//     revenueInScope
//   );

//   const totalCancelled = sum(occFiltered, (o) => (o as any).CancelledNum || 0);
//   const capacityForCancel = capacityFromHotelsForOccupancyScope(
//     hotelMap,
//     filters,
//     occFiltered
//   );
//   const cancelRate =
//     capacityForCancel > 0 ? totalCancelled / capacityForCancel : 0;

//   const totalOccupied = occupiedSum;
//   const roomsForOcc = capacityFromHotelsForOccupancyScope(
//     hotelMap,
//     filters,
//     occFiltered
//   );
//   const rowsCount = occFiltered.length;
//   const occupancyRate =
//     roomsForOcc > 0 && rowsCount > 0
//       ? (totalOccupied / (capacity * rowsCount)) * 100
//       : 0;

//   return {
//     Revenue: revenue,
//     ADR: adr,
//     AvgReviewScore: avgReview,
//     TotalCapacity: capacity,
//     CancellationRatePct: cancelRate,
//     OccupancyRatePct: occupancyRate,
//     Expense: expense,
//     Profit: profit,
//     RevenueByDay: groupByDay(revenueInScope),
//   };
// }


// ***********************************************************************************************

export function kpiFromRowsWithHotelsAndOccupancy(
  rows: Row[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters,
  occFiltered: ReturnType<typeof filterOccupancy>
) {
  // Restrict revenue by occupancy-scope ONLY if it makes sense:
  // - ratings filter is used (so occupancy actually defines the scope), AND
  // - we have some occupancy rows after filtering.
  const shouldRestrictByOcc =
    Boolean(filters.ratings?.length) && occFiltered.length > 0;

  const allowedIds = shouldRestrictByOcc
    ? new Set(occFiltered.map((o) => o["Hotel ID"]))
    : undefined;

  const revenueInScope = applyFilters(
    rows,
    { ...filters, ratings: null }, // prevent double-filtering by ratings in revenue
    allowedIds
  );

  const revenue = sum(revenueInScope, (r) => r.RevAmountNum);
  const expense = sum(revenueInScope, (r) => r.ExpenseNum);
  const profit  = sum(revenueInScope, (r) => r.ProfitNum);

  const avgReview = average(occFiltered, (o) => (o as any).RatingsNum);

  const occupiedSum = sum(occFiltered, (o) => (o as any).OccupiedNum || 0);
  const adr = occupiedSum > 0 ? revenue / occupiedSum : 0;

  const capacity = capacityFromHotelsUsingFilters(hotelMap, filters, revenueInScope);

  const totalCancelled   = sum(occFiltered, (o) => (o as any).CancelledNum || 0);
  const capacityForCancel = capacityFromHotelsForOccupancyScope(hotelMap, filters, occFiltered);
  const cancelRate = capacityForCancel > 0 ? totalCancelled / capacityForCancel : 0;

  const roomsForOcc   = capacityFromHotelsForOccupancyScope(hotelMap, filters, occFiltered);
  const rowsCount     = occFiltered.length;
  const occupancyRate =
    roomsForOcc > 0 && rowsCount > 0
      ? (occupiedSum / (capacity * rowsCount)) * 100
      : 0;

  return {
    Revenue: revenue,
    ADR: adr,
    AvgReviewScore: avgReview,
    TotalCapacity: capacity,
    CancellationRatePct: cancelRate,
    OccupancyRatePct: occupancyRate,
    Expense: expense,
    Profit: profit,
    RevenueByDay: groupByDay(revenueInScope),
  };
}


export function roomRevenueByHotel(
  rows: Row[],
  occ: OccRow[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters
) {
  const results: { name: string; rooms: number; adr: number }[] = [];

  // Figure out which hotels are in scope after filtering
  const hotelIds: any = new Set<string>();
  for (const r of rows) {
    if (r["Hotel ID"]) hotelIds.add(r["Hotel ID"]);
  }
  for (const o of occ) {
    if (o["Hotel ID"]) hotelIds.add(o["Hotel ID"]);
  }

  for (const id of hotelIds) {
    const hotel = hotelMap[id];
    if (!hotel) continue;

    // rows for this hotel
    const revenueRows = rows.filter((r) => r["Hotel ID"] === id);
    const occRows = occ.filter((o) => o["Hotel ID"] === id);

    const revenueSum = sum(revenueRows, (r) => r.RevAmountNum);
    const occupiedSum = sum(occRows, (o) => (o as any).OccupiedNum || 0);

    const adr = occupiedSum > 0 ? Math.round(revenueSum / occupiedSum) : 0;

    results.push({
      name: hotel.Name,
      rooms: toNum(hotel["No. of Rooms"]),
      adr,
    });
  }

  return results;
}

export function revenueByYear(rows: Row[]) {
  const byYear: Record<string, number> = {};
  for (const r of rows) {
    const iso = r.DateISO;
    if (!iso || iso.length < 4) continue;
    const y = iso.slice(0, 4);
    byYear[y] = (byYear[y] ?? 0) + (r.RevAmountNum || 0);
  }
  return Object.entries(byYear)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, total]) => ({ name: year, value: total }));
}

export function roomRevenueByMonth(
  rows: Row[],
  occ: OccRow[]
): { name: string; value: number; adr: number }[] {
  // only Room category rows
  const roomRows = rows.filter((r) => r["Revenue Category"] === "Room");

  // buckets
  const revByMonth: number[] = Array(13).fill(0); // 1..12
  const occByMonth: number[] = Array(13).fill(0); // occupied rooms

  // revenue buckets
  for (const r of roomRows) {
    const m = mmFromISO(r.DateISO);
    if (!m) continue;
    revByMonth[m] += r.RevAmountNum || 0;
  }

  // occupancy buckets for ADR denominator
  for (const o of occ) {
    const m = mmFromISO((o as any).DateISO);
    if (!m) continue;
    occByMonth[m] += (o as any).OccupiedNum || 0;
  }

  // shape for chart: value & adr (both in millions, to match your “0.72M” UI)

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const revenue = revByMonth[month];
    const occupied = occByMonth[month];
    const adr = occupied > 0 ? revenue / occupied : 0;

    return {
      name: MONTHS[i],
      value: revenue,
      adr: adr, // keep same unit as chart labels (M) for simplicity
    };
  });
}

// ---- Revenue vs Budget per hotel (name-wise) ----
export function revenueVsBudgetByHotel(
  rows: Row[],
  hotelMap: Record<string, Hotel>
) {
  const byHotel: Record<
    string,
    { name: string; budget: number; revenue: number }
  > = {};
  for (const r of rows) {
    const id = r["Hotel ID"];
    if (!id) continue;
    if (!byHotel[id]) {
      byHotel[id] = {
        name: hotelMap[id]?.Name ?? id,
        budget: 0,
        revenue: 0,
      };
    }
    byHotel[id].budget += r.RevBudgetNum || 0;
    byHotel[id].revenue += r.RevAmountNum || 0;
  }

  // sort by name ASC (change if you prefer by revenue/budget)
  return Object.values(byHotel).sort((a, b) => a.name.localeCompare(b.name));
}

// Totals of Rev. Amount per year per location (after filters)
export function revenueByLocationYearTotals(
  rows: Row[],
  hotelMap: Record<string, Hotel>
) {
  const yearsSet = new Set<string>();
  const locationsSet = new Set<string>();

  // year -> location -> total
  const byYear: Record<string, Record<string, number>> = {};

  for (const r of rows) {
    const y = yearFromISO(r.DateISO);
    if (!y) continue;
    const loc = hotelMap[r["Hotel ID"]]?.Location;
    if (!loc) continue;

    yearsSet.add(y);
    locationsSet.add(loc);

    byYear[y] ??= {};
    byYear[y][loc] = (byYear[y][loc] ?? 0) + (r.RevAmountNum || 0);
  }

  const years = Array.from(yearsSet).sort(); // ["2022","2023",...]
  const locations = Array.from(locationsSet); // keep natural order

  return { years, locations, byYear };
}

// Build Plotly Sankey data from revenue.json + hotel.json (after filters)
export function revenueByLocationYearSankey(
  rows: Row[],
  hotelMap: Record<string, Hotel>
) {
  const { years, locations, byYear } = revenueByLocationYearTotals(
    rows,
    hotelMap
  );
  if (!years.length || !locations.length) {
    return {
      years,
      locations,
      node: { label: [], color: [], x: [], y: [], rank: [], total: [] },
      link: {
        source: [],
        target: [],
        value: [],
        label: [],
        color: [],
        year: [],
        location: [],
        rank: [],
      },
    };
  }

  // ---- Rank locations per year (high -> low) ----
  const rankByYear: Record<string, Record<string, number>> = {};
  for (const y of years) {
    const pairs = locations.map((loc) => ({
      loc,
      val: byYear[y]?.[loc] ?? 0,
    }));
    pairs.sort((a, b) => b.val - a.val); // highest first
    rankByYear[y] = {};
    pairs.forEach((p, i) => {
      rankByYear[y][p.loc] = i + 1; // rank 1 is highest
    });
  }

  // ---- Node arrays ----
  const labels: string[] = [];
  const nodeColors: string[] = [];
  const xs: number[] = [];
  const ys: number[] = [];
  const nodeRank: number[] = [];
  const nodeTotal: number[] = [];

  const nodeIndex = (yearIdx: number, locIdx: number) =>
    yearIdx * locations.length + locIdx;

  years.forEach((y, yi) => {
    const x = years.length === 1 ? 0.5 : yi / (years.length - 1);
    const n = locations.length;
    const step = 1 / (n + 1);

    // We want y by rank (top = 1 => y near 1)
    locations.forEach((loc, li) => {
      const rank = rankByYear[y][loc] ?? n;
      const yPos = 1 - rank * step; // rank 1 -> top

      labels.push(`${loc} ${y}`);
      nodeColors.push(colorFor(li));
      xs.push(x);
      ys.push(yPos);
      nodeRank.push(rank);
      nodeTotal.push(byYear[y]?.[loc] ?? 0);
    });
  });

  // ---- Links connecting same location across consecutive years ----
  const source: number[] = [];
  const target: number[] = [];
  const value: number[] = [];
  const linkLabel: string[] = [];
  const linkColor: string[] = [];
  const linkYear: string[] = []; // target year for the ribbon
  const linkLoc: string[] = [];
  const linkRank: number[] = []; // target year rank

  for (let yi = 0; yi < years.length - 1; yi++) {
    const yA = years[yi];
    const yB = years[yi + 1];
    locations.forEach((loc, li) => {
      const s = nodeIndex(yi, li);
      const t = nodeIndex(yi + 1, li);
      const totalInTargetYear = byYear[yB]?.[loc] ?? 0;

      source.push(s);
      target.push(t);
      value.push(totalInTargetYear);
      linkLabel.push(compact(totalInTargetYear));
      linkColor.push(colorFor(li));
      linkYear.push(yB);
      linkLoc.push(loc);
      linkRank.push(rankByYear[yB][loc] ?? locations.length);
    });
  }

  return {
    years,
    locations,
    node: {
      label: labels,
      color: nodeColors,
      x: xs,
      y: ys,
      rank: nodeRank,
      total: nodeTotal, // extra metadata
    },
    link: {
      source,
      target,
      value,
      label: linkLabel,
      color: linkColor,
      year: linkYear,
      location: linkLoc,
      rank: linkRank, // extra metadata
    },
  };
}

// ---------------- Inventory Mix (scatter-style) ----------------
export function inventoryMixByHotel(
  revenueRows: Row[],
  occRows: OccRow[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters
) {
  const occFiltered = filterOccupancy(occRows, filters);
  const revFiltered = applyFilters(revenueRows, filters);

  type Agg = {
    occ: number;
    capacity: number;
    revenueSum: number;
    profitSum: number;
  };

  const byHotel: Record<string, Agg> = {};

  // occupancy + capacity
  for (const o of occFiltered) {
    const id = o["Hotel ID"];
    if (!id) continue;
    const h = hotelMap[id];
    if (!h) continue;

    const occNum = toNum((o as any)["Occupied Room"]);
    (byHotel[id] ??= {
      occ: 0,
      capacity: 0,
      revenueSum: 0,
      profitSum: 0,
    }).occ += occNum;
    byHotel[id].capacity += toNum(h["No. of Rooms"]);
  }

  // revenue + profit (use absolute amounts, not margin %)
  for (const r of revFiltered) {
    const id = r["Hotel ID"];
    if (!id) continue;
    const rev = toNum(r["Rev. Amount"]);
    const prof = toNum(r["Profit"]); // e.g. "(44.64)" -> -44.64

    (byHotel[id] ??= {
      occ: 0,
      capacity: 0,
      revenueSum: 0,
      profitSum: 0,
    }).revenueSum += rev;
    byHotel[id].profitSum += prof;
  }

  // build result
  const results: {
    name: string;
    occupancyRate: number; // 0..1
    profitMargin: number; // %
    revenue: number; // total revenue
    fill: string;
  }[] = [];

  let colorIdx = 0;
  for (const [id, agg] of Object.entries(byHotel)) {
    const hotel = hotelMap[id];
    if (!hotel) continue;

    const occupancyRate = agg.capacity > 0 ? agg.occ / agg.capacity : 0;
    const profitMargin =
      agg.revenueSum > 0 ? (agg.profitSum / agg.revenueSum) * 100 : 0;

    results.push({
      name: hotel.Name,
      occupancyRate,
      profitMargin, // now correct (weighted) %
      revenue: agg.revenueSum,
      fill: colorFor2(colorIdx++),
    });
  }

  return results;
}

// ---------------- Occupancy & ADR by Hotel (for bubble chart) ----------------
export function occupancyAdrByHotel(
  revenueRows: Row[],
  occRows: OccRow[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters
) {
  // apply same filters the rest of the API uses
  const occFiltered = filterOccupancy(occRows, filters);
  const revFiltered = applyFilters(revenueRows, filters);

  type Agg = {
    occ: number; // total occupied rooms (denominator for ADR)
    capacity: number; // total room capacity used to compute occupancyRate
    revenueSum: number; // sum of Rev. Amount
  };

  const byHotel: Record<string, Agg> = {};

  // accumulate occupancy + capacity
  for (const o of occFiltered) {
    const id = o["Hotel ID"];
    if (!id) continue;
    const h = hotelMap[id];
    if (!h) continue;

    const occNum = toNum((o as any)["Occupied Room"]);
    (byHotel[id] ??= { occ: 0, capacity: 0, revenueSum: 0 }).occ += occNum;
    byHotel[id].capacity += toNum(h["No. of Rooms"]);
  }

  // accumulate revenue
  for (const r of revFiltered) {
    const id = r["Hotel ID"];
    if (!id) continue;
    const rev = toNum(r["Rev. Amount"]);
    (byHotel[id] ??= { occ: 0, capacity: 0, revenueSum: 0 }).revenueSum += rev;
  }

  // shape result: { name, occupancyRate, revenue, adr, fill }
  const results: {
    name: string;
    occupancyRate: number; // 0..1
    revenue: number; // absolute revenue
    adr: number; // revenue / occupied rooms
    fill: string;
  }[] = [];

  let colorIdx = 0;
  for (const [id, agg] of Object.entries(byHotel)) {
    const hotel = hotelMap[id];
    if (!hotel) continue;

    const occupancyRate = agg.capacity > 0 ? agg.occ / agg.capacity : 0;
    const adr = agg.occ > 0 ? agg.revenueSum / agg.occ : 0;

    results.push({
      name: hotel.Name,
      occupancyRate,
      revenue: agg.revenueSum,
      adr,
      fill: colorFor2(colorIdx++),
    });
  }

  return results;
}

// app/lib/revenue.ts
export function averageRoomCountByTypeMonthly(
  occFiltered: (OccRow & {
    DateISO?: string | null;
    SingleNum?: number;
    DoubleNum?: number;
    SuiteNum?: number;
    DeluxeNum?: number;
  })[]
) {
  const monthCounts = Array(13).fill(0); // 1..12
  const sumDeluxe = Array(13).fill(0);
  const sumDouble = Array(13).fill(0);
  const sumSingle = Array(13).fill(0);
  const sumSuite = Array(13).fill(0);

  for (const o of occFiltered) {
    const m = mmFromISO(o.DateISO || null);
    if (!m) continue;
    monthCounts[m] += 1;
    sumDeluxe[m] += o.DeluxeNum || 0;
    sumDouble[m] += o.DoubleNum || 0;
    sumSingle[m] += o.SingleNum || 0;
    sumSuite[m] += o.SuiteNum || 0;
  }

  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const denom = monthCounts[m] || 0;
    const avg = (sum: number) => (denom ? sum / denom : 0);

    return {
      name: MONTHS[i],
      deluxe: Number(avg(sumDeluxe[m]).toFixed(2)),
      double: Number(avg(sumDouble[m]).toFixed(2)),
      single: Number(avg(sumSingle[m]).toFixed(2)),
      suite: Number(avg(sumSuite[m]).toFixed(2)),
    };
  });
}

export function occupancyProfitByMonth(
  revenueRows: Row[],
  occRows: OccRow[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters
) {
  const occFiltered = filterOccupancy(occRows, filters);
  const revFiltered = applyFilters(revenueRows, filters);

  const monthCounts = Array(13).fill(0); // # of days per month
  const sumOccupied = Array(13).fill(0); // occupied rooms
  const sumProfit = Array(13).fill(0); // profit
  const sumCapacity = Array(13).fill(0); // total capacity

  // accumulate occupancy + capacity
  for (const o of occFiltered) {
    const m = mmFromISO(o.DateISO || null);
    if (!m) continue;
    monthCounts[m] += 1;
    sumOccupied[m] += o.OccupiedNum || 0;

    const h = hotelMap[o["Hotel ID"]];
    if (h) sumCapacity[m] += toNum(h["No. of Rooms"]);
  }

  // accumulate profit from revenue rows
  for (const r of revFiltered) {
    const m = mmFromISO(r.DateISO);
    if (!m) continue;
    sumProfit[m] += r.ProfitNum || 0;
  }

  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;

    const denomDays = monthCounts[m] || 0;
    const capacity = sumCapacity[m] || 0;
    const occ = sumOccupied[m] || 0;

    // occupancy rate % = occupied / (capacity * days)
    const occupancyRate =
      denomDays > 0 && capacity > 0 ? (occ / (capacity * denomDays)) * 100 : 0;

    // profit margin % = profit / revenue (we don’t have monthly revenue yet? use Profit vs RevAmountNum)
    // safer: profit / revenueSum
    const revenueMonth = revFiltered
      .filter((r) => mmFromISO(r.DateISO) === m)
      .reduce((s, r) => s + (r.RevAmountNum || 0), 0);

    const profitMargin =
      revenueMonth > 0 ? (sumProfit[m] / revenueMonth) * 100 : 0;

    return {
      name: MONTHS[i],
      occupancy: Number(occupancyRate.toFixed(2)),
      profit: Number(profitMargin.toFixed(2)),
    };
  });
}

// Count of rows per month per hotel → [{ name:"January", <hotelKey>: count, ... }, ...]
export function occupiedRoomCountByHotelMonthly(
  occRows: OccRow[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters | any,
  hotelKeyById?: Record<string, string> // optional mapping: { "I001": "delta", ... }
) {
  const occFiltered = filterOccupancy(occRows, filters);

  // Determine which hotel IDs are in-scope (respect filters)
  let inScopeIds: string[];
  if (filters?.hotel?.length) {
    inScopeIds = Array.from(new Set(filters.hotel));
  } else {
    const set: any = new Set<string>();
    for (const o of occFiltered) if (o["Hotel ID"]) set.add(o["Hotel ID"]);
    inScopeIds = [...set];
  }

  // Create stable keys for object fields (delta, jumeirah, etc.)
  const makeKey = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, "_");

  const idToKey: Record<string, string> = {};
  for (const id of inScopeIds) {
    const custom = hotelKeyById?.[id];
    if (custom) {
      idToKey[id] = custom;
    } else {
      const display = hotelMap[id]?.Name || id;
      idToKey[id] = makeKey(display);
    }
  }

  // month -> hotelId -> count
  const counts: Record<number, Record<string, number>> = {};
  for (let m = 1; m <= 12; m++) counts[m] = {};
  for (const id of inScopeIds) {
    for (let m = 1; m <= 12; m++) counts[m][id] = 0;
  }

  // Tally: each row = 1 count for that hotel in that month
  for (const o of occFiltered) {
    const m = mmFromISO((o as any).DateISO || null);
    if (!m) continue;
    const id = o["Hotel ID"];
    if (!id || !(id in counts[m])) continue;
    counts[m][id] += 1;
  }

  // Shape final array
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const obj: Record<string, any> = { name: MONTHS[i] };
    for (const id of inScopeIds) {
      const key = idToKey[id];
      obj[key] = counts[m][id] || 0;
    }
    return obj;
  });
}

function sum<T>(arr: T[], pick: (x: T) => number) {
  let s = 0;
  for (const a of arr) s += pick(a) || 0;
  return s;
}

function average<T>(arr: T[], pick: (x: T) => number) {
  if (!arr.length) return 0;
  let s = 0,
    c = 0;
  for (const a of arr) {
    const v = pick(a);
    if (Number.isFinite(v)) {
      s += v;
      c++;
    }
  }
  return c ? s / c : 0;
}
