// app/lib/daily.ts
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

export function applyFilters(
  rows: Row[],
  f: RevenueFilters,
  hotelMap: any
): Row[] {
  const { location, startDate, endDate, hotel, revenueStream, ratings } =
    f || {};

  return rows.filter((r) => {
    if (location?.length && !location.includes(r["Hotel ID"])) return false;
    if (hotel?.length && !hotel.includes(r["Hotel ID"])) return false;
    if (revenueStream?.length && !revenueStream.includes(r["Revenue Category"]))
      return false;
    if (ratings?.length && !ratings.includes(String(r["Rating"]))) return false;

    if (startDate && r.DateISO && r.DateISO < startDate) return false;
    if (endDate && r.DateISO && r.DateISO > endDate) return false;

    return true;
  });
}

// ---- Occupancy filters (to compute ratings & optionally constrain hotels by ratings) ----
export function filterOccupancy(
  occ: Awaited<ReturnType<typeof loadOccupancy>>,
  f: RevenueFilters,
  hotelMap: Record<string, Hotel>
) {
  const { location, hotel, startDate, endDate, ratings } = f || {};
  return occ.filter((o) => {
    if (location?.length && !location.includes(o["Hotel ID"])) return false;
    if (hotel?.length && !hotel.includes(o["Hotel ID"])) return false;

    if (startDate && o.DateISO && o.DateISO < startDate) return false;
    if (endDate && o.DateISO && o.DateISO > endDate) return false;

    if (ratings?.length && !ratings.includes(String(o.Ratings))) return false;

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

export function kpiFromRowsWithHotelsAndOccupancy(
  rows: Row[],
  hotelMap: Record<string, Hotel>,
  filters: RevenueFilters,
  occFiltered: ReturnType<typeof filterOccupancy>
) {
  const revenue = sum(rows, (r) => r.RevAmountNum);

  const capacity = capacityFromHotelsUsingFilters(hotelMap, filters, rows);

  // const adr = average(rows, (r) => toNum(r["ADR"]));
  const revenueSum = sum(rows, (r) => r.RevAmountNum); // NUMERATOR
  const occupiedSum = sum(occFiltered, (o) => (o as any).OccupiedNum || 0); // DENOMINATOR

  // ✅ ADR per formula
  const adr = occupiedSum > 0 ? revenueSum / occupiedSum : 0;

  // const cancelRate = average(rows, (r) => toNum(r["Cancellation Rate (%)"]));
  const totalCancelled = sum(occFiltered, (o) => (o as any).CancelledNum || 0);
  const capacityForCancel = capacityFromHotelsForOccupancyScope(
    hotelMap,
    filters,
    occFiltered
  );
  const cancelRate =
    capacityForCancel > 0 ? totalCancelled / capacityForCancel : 0;

  const totalOccupied = sum(occFiltered, (o) => (o as any).OccupiedNum || 0);
  const roomsForOcc = capacityFromHotelsForOccupancyScope(
    hotelMap,
    filters,
    occFiltered
  );
  // console.log(capacity, occFiltered.length,totalOccupied)
  const rowsCount = occFiltered.length;
  const occupancyRate =
    roomsForOcc > 0 && rowsCount > 0
      ? (totalOccupied / (capacity * occFiltered.length)) * 100
      : 0;

  return {
    Revenue: revenue,
    CancellationRatePct: cancelRate,
    OccupancyRatePct: occupancyRate,
  };
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

// --- Monthly revenue series (predictiveRevenue-like) -----------------
export async function getMonthlyRevenueSeries(
  filters: RevenueFilters = {}
): Promise<Array<{ name: string; value: number }>> {
  // make sure caches/maps are ready
  await loadHotels();
  const hotelMap = getHotelMap();

  // load + apply your existing AND-semantics filters
  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters, hotelMap);

  // accumulate totals per month (index 0..11)
  const monthly = new Array<number>(12).fill(0);

  for (const r of filtered) {
    const m = mmFromISO(r.DateISO); // 1..12 or null
    if (m) monthly[m - 1] += r.RevAmountNum || 0;
  }

  // shape => [{name, value}], drop zero months
  return monthly
    .map((sum, i) => ({
      name: MONTHS[i], // "January" .. "December"
      value: Math.round(sum), // round as in your examples
    }))
    .filter((x) => x.value > 0);
}

// export async function getAdrAndOccupancyByHotel(
//   filters: RevenueFilters = {},
//   { asPercent = true }: { asPercent?: boolean } = {}
// ): Promise<Array<{ name: string; occupancy_rate: number; adr: number }>> {
//   // ensure caches
//   await Promise.all([loadHotels(), loadRevenue(), loadOccupancy()]);
//   const hotelMap = getHotelMap();

//   // apply your existing filters
//   const revenueRows = applyFilters(await loadRevenue(), filters, hotelMap);
//   const occRows = filterOccupancy(await loadOccupancy(), filters, hotelMap);

//   // per-hotel accumulators
//   const revSum: Record<string, number> = {};
//   const occSum: Record<string, number> = {};
//   const dayCount: Record<string, number> = {};

//   // revenue by hotel
//   for (const r of revenueRows) {
//     const hid = String(r["Hotel ID"] || "");
//     if (!hid) continue;
//     revSum[hid] = (revSum[hid] ?? 0) + (r.RevAmountNum || 0);
//   }

//   // occupancy by hotel
//   for (const o of occRows) {
//     const hid = String(o["Hotel ID"] || "");
//     if (!hid) continue;
//     occSum[hid] = (occSum[hid] ?? 0) + (toNum((o as any).OccupiedNum) || 0);
//     dayCount[hid] = (dayCount[hid] ?? 0) + 1;
//   }

//   // shape
//   const result: Array<{ name: string; occupancy_rate: number; adr: number }> = [];

//   // use union of hotels seen in revenue or occupancy (and exist in hotelMap)
//   const ids:any = new Set<string>([
//     ...Object.keys(revSum),
//     ...Object.keys(occSum),
//   ]);

//   for (const hid of ids) {
//     const h = hotelMap[hid];
//     if (!h) continue;

//     const name = h.Name;
//     const rooms = toNum(h["No. of Rooms"]) || 0;
//     const occ = occSum[hid] || 0;
//     const rev = revSum[hid] || 0;
//     const days = dayCount[hid] || 0;

//     // ADR
//     const adr = occ > 0 ? rev / occ : 0;

//     // Occupancy rate
//     const denom = rooms > 0 && days > 0 ? rooms * days : 0;
//     let occRate = denom > 0 ? occ / denom : 0; // 0..1
//     if (asPercent) occRate *= 100;

//     result.push({
//       name,
//       occupancy_rate: Number((asPercent ? occRate : occRate).toFixed(2)),
//       adr: Number(adr.toFixed(2)),
//     });
//   }

//   // stable order by hotel name
//   result.sort((a, b) => a.name.localeCompare(b.name));
//   return result;
// }

// --- helper: shift YYYY-MM-DD by delta years (keeps MM-DD) ---
function shiftISOYear(iso: string | null | undefined, deltaYears: number) {
  if (!iso || iso.length < 10) return iso ?? null;
  const y = Number(iso.slice(0, 4));
  const rest = iso.slice(4); // "-MM-DD" (and you’re storing plain YYYY-MM-DD)
  if (!Number.isFinite(y)) return iso;
  const shifted = String(y + deltaYears).padStart(4, "0") + rest;
  return shifted;
}

export async function getAdrAndOccupancyByHotel(
  filters: RevenueFilters = {},
  { asPercent = true }: { asPercent?: boolean } = {}
): Promise<Array<{ name: string; occupancy_rate: number; adr: number }>> {
  // ensure caches
  await Promise.all([loadHotels(), loadRevenue(), loadOccupancy()]);
  const hotelMap = getHotelMap();

  // 1) Revenue uses the given filters as-is
  const revenueRows = applyFilters(await loadRevenue(), filters, hotelMap);

  // 2) Occupancy uses the SAME filters but with startDate/endDate shifted to previous year
  const occFilters: RevenueFilters = {
    ...filters,
    startDate: shiftISOYear(filters.startDate, -1) ?? null,
    endDate: shiftISOYear(filters.endDate, -1) ?? null,
  };
  const occRows = filterOccupancy(await loadOccupancy(), occFilters, hotelMap);

  // per-hotel accumulators
  const revSum: Record<string, number> = {};
  const occSum: Record<string, number> = {};
  const daySet: Record<string, Set<string>> = {}; // distinct days per hotel (COUNTROWS)

  // revenue by hotel
  for (const r of revenueRows) {
    const hid = String(r["Hotel ID"] || "");
    if (!hid) continue;
    revSum[hid] = (revSum[hid] ?? 0) + (r.RevAmountNum || 0);
  }

  // occupancy by hotel (sum occupied + count DISTINCT dates)
  for (const o of occRows) {
    const hid = String(o["Hotel ID"] || "");
    if (!hid) continue;

    occSum[hid] = (occSum[hid] ?? 0) + (toNum((o as any).OccupiedNum) || 0);

    const d = (o as any).DateISO || toISO((o as any).Date) || "";
    if (!daySet[hid]) daySet[hid] = new Set<string>();
    if (d) daySet[hid].add(d.slice(0, 10)); // YYYY-MM-DD
  }

  // shape
  const result: Array<{ name: string; occupancy_rate: number; adr: number }> =
    [];
  const ids: any = new Set<string>([
    ...Object.keys(revSum),
    ...Object.keys(occSum),
  ]);

  for (const hid of ids) {
    const h = hotelMap[hid];
    if (!h) continue;

    const name = h.Name;
    const rooms = toNum(h["No. of Rooms"]) || 0;
    const occ = occSum[hid] || 0;
    const rev = revSum[hid] || 0;
    const days = daySet[hid]?.size ?? 0;

    // ADR = SUM(Rev) / SUM(Occupied)
    const adr = occ > 0 ? rev / occ : 0;

    // Occupancy Rate = SUM(Occupied) / (Rooms * COUNTROWS(Occ))
    const denom = rooms > 0 && days > 0 ? rooms * days : 0;
    let occRate = denom > 0 ? occ / denom : 0; // 0..1
    if (asPercent) occRate *= 100;

    result.push({
      name,
      occupancy_rate: Number((occRate / 10).toFixed(2)),
      adr: Number((adr / 10).toFixed(2)),
    });
  }

  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}


export async function getMonthlyRevenueByHotel(
  filters: RevenueFilters = {}
): Promise<Array<Record<string, number | string>>> {
  await Promise.all([loadHotels(), loadRevenue()]);
  const hotelMap = getHotelMap();

  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters, hotelMap);

  // fixed hotel-name -> key mapping (the keys you want in the result)
  const nameToKey: Record<string, string> = {
    "Delta Hotels": "delta",
    "Hilton Jumeirah": "hiltonJumeirah",
    "Hilton The Walk": "hiltonWalk",
    "Merriott Hotel & Spa": "marriott",
    "Taj Exotica Resort & Spa": "taj",
  };

  // Start with 12 buckets that track raw numbers
  const monthly = MONTHS.map(() => ({
    delta: 0,
    hiltonJumeirah: 0,
    hiltonWalk: 0,
    marriott: 0,
    taj: 0,
  }));

  // Accumulate revenue by (month, hotel)
  for (const r of filtered) {
    const m = mmFromISO(r.DateISO); // 1..12 or null
    if (!m) continue;

    const hid = String(r["Hotel ID"] || "");
    const h = hotelMap[hid];
    if (!h) continue;

    const key = nameToKey[h.Name];
    if (!key) continue; // ignore hotels not in your 5 columns

    monthly[m - 1][key as keyof (typeof monthly)[number]] +=
      r.RevAmountNum || 0;
  }

  // Shape result:
  //  - round numbers
  //  - remove fields whose rounded value is 0
  //  - drop months where all five hotels are 0
  const shaped: Array<Record<string, number | string>> = [];

  monthly.forEach((row, i) => {
    // round first
    const rounded = {
      delta: Math.round(row.delta),
      hiltonJumeirah: Math.round(row.hiltonJumeirah),
      hiltonWalk: Math.round(row.hiltonWalk),
      marriott: Math.round(row.marriott),
      taj: Math.round(row.taj),
    };

    // build a sparse object: keep only >0 fields
    const out: Record<string, number | string> = { month: MONTHS[i] };
    let nonZero = 0;

    (Object.keys(rounded) as Array<keyof typeof rounded>).forEach((k) => {
      const v = rounded[k];
      if (v > 0) {
        out[k] = v;
        nonZero++;
      }
    });

    // skip the month entirely if all were zero
    if (nonZero > 0) shaped.push(out);
  });

  return shaped;
}
