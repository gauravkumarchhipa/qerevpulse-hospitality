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

const CATEGORY_COLORS: Record<string, string> = {
  Room: "#2662D9", // yellow
  "Event and Banqueting": "#E95D3A", // blue
  "Food & Beverage": "#c2185b", // red-pink
  "Operational Efficiency": "#C55E3D", // slate
  "Spa and Wellness": "#E9C46A", // gold
  "Ancillary Revenue": "#ff801c", // green
};

const CATEGORY_ORDER_FOR_REVENUE = [
  "Room",
  "Event and Banqueting",
  "Food & Beverage",
  "Operational Efficiency",
  "Spa and Wellness",
  "Ancillary Revenue",
];

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
    ProfitMarginNum: toNum(r["Profit Margin"]),
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
  event?: string[] | null; // ✅ NEW: maps to "Sub Category" in revenue
};

export function applyFilters(
  rows: Row[],
  f: RevenueFilters,
  hotelMap: Record<string, Hotel>
): Row[] {
  const { location, startDate, endDate, hotel, revenueStream, ratings, event } =
    f || {};

  // Normalize sets
  const hotelSet: any = new Set((hotel ?? []).map(String));
  const locationVals = (location ?? []).map(String);

  // Derive hotel IDs that match the chosen locations (accepts either location names OR mistakenly passed hotel IDs)
  const locationIdSet = new Set<string>();
  if (locationVals.length) {
    for (const [id, h] of Object.entries(hotelMap)) {
      if (locationVals.includes(h.Location) || locationVals.includes(id)) {
        locationIdSet.add(id);
      }
    }
  }

  // Build the allowed hotel IDs with AND semantics (intersection) if both provided
  let allowedIds: Set<string> | null = null;
  if (hotelSet.size && locationIdSet.size) {
    allowedIds = new Set([...hotelSet].filter((id) => locationIdSet.has(id)));
  } else if (hotelSet.size) {
    allowedIds = hotelSet;
  } else if (locationIdSet.size) {
    allowedIds = locationIdSet;
  } // else null -> allow all hotels

  // Event (Sub Category) set
  const eventSet =
    event && event.length
      ? new Set(event.map((e) => String(e).toLowerCase().trim()))
      : null;

  return rows.filter((r) => {
    const hid = String(r["Hotel ID"] || "");
    if (allowedIds && !allowedIds.has(hid)) return false;

    if (revenueStream?.length && !revenueStream.includes(r["Revenue Category"]))
      return false;
    if (ratings?.length && !ratings.includes(String(r["Rating"]))) return false;

    if (eventSet) {
      const sub = String(r["Sub Category"] ?? "")
        .toLowerCase()
        .trim();
      if (!eventSet.has(sub)) return false;
    }

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

  const hotelSet: any = new Set((hotel ?? []).map(String));
  const locationVals = (location ?? []).map(String);

  const locationIdSet = new Set<string>();
  if (locationVals.length) {
    for (const [id, h] of Object.entries(hotelMap)) {
      if (locationVals.includes(h.Location) || locationVals.includes(id)) {
        locationIdSet.add(id);
      }
    }
  }

  let allowedIds: Set<string> | null = null;
  if (hotelSet.size && locationIdSet.size) {
    allowedIds = new Set([...hotelSet].filter((id) => locationIdSet.has(id)));
  } else if (hotelSet.size) {
    allowedIds = hotelSet;
  } else if (locationIdSet.size) {
    allowedIds = locationIdSet;
  }

  return occ.filter((o) => {
    const hid = String(o["Hotel ID"] || "");
    if (allowedIds && !allowedIds.has(hid)) return false;

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
  const expense = sum(rows, (r) => r.ExpenseNum);
  const budget = sum(rows, (r) => r.RevBudgetNum);
  const capacity = capacityFromHotelsUsingFilters(hotelMap, filters, rows);
  const profit = sum(rows, (r) => r.ProfitNum);
  const revenueSum = sum(rows, (r) => r.RevAmountNum); // NUMERATOR
  const occupiedSum = sum(occFiltered, (o) => (o as any).OccupiedNum || 0); // DENOMINATOR

  // ✅ ADR per formula
  const adr = occupiedSum > 0 ? revenueSum / occupiedSum : 0;

  const revPOR = occupiedSum > 0 ? revenue / occupiedSum : 0;

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

  const profitMarginTotal = sum(rows, (r) => (r as any).ProfitMarginNum || 0);

  return {
    Revenue: revenue,
    ADR: adr,
    OccupancyRatePct: occupancyRate,
    RevPOR: revPOR,
    RevPAR: revPAR,
    Expense: expense,
    Budget: budget,
    Profit: profit,
    AvgLOS: "",
    ProfitMargin: profitMarginTotal,
  };
}

export async function getHotelRevenues(filters: RevenueFilters = {}) {
  const [revenueRows, hotels] = await Promise.all([
    loadRevenue(),
    loadHotels(),
  ]);
  const hotelMap = getHotelMap();

  // First, apply row-level filters with correct AND semantics
  const filtered = applyFilters(revenueRows, filters, hotelMap);

  // Sum per hotel
  const totals: Record<
    string,
    { actual: number; budget: number; lastYear: number; profit: number }
  > = {};
  for (const r of filtered) {
    const hid = String(r["Hotel ID"] || "");
    if (!hid) continue;
    if (!totals[hid])
      totals[hid] = { actual: 0, budget: 0, lastYear: 0, profit: 0 };
    totals[hid].actual += toNum(r["Rev. Amount"]);
    totals[hid].budget += toNum(r["Rev. Budget"]);
    totals[hid].lastYear += toNum(r["Last Year Rev. Amt."]);
    totals[hid].profit += toNum(r["Profit"]);
  }

  // Only include hotels that actually appear after filtering
  const keepIds = new Set(Object.keys(totals));

  return hotels
    .filter((h) => keepIds.has(h.ID))
    .map((h) => ({
      name: h.Name,
      actual: totals[h.ID]?.actual ?? 0,
      budget: totals[h.ID]?.budget ?? 0,
      lastYear: totals[h.ID]?.lastYear ?? 0,
      profit: totals[h.ID]?.profit ?? 0,
    }));
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

// --- Year-over-year totals ---
export async function getYearOverYearRevenueData(filters: RevenueFilters = {}) {
  await loadHotels();
  const hotelMap = getHotelMap();

  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters, hotelMap);

  const byYear: Record<
    string,
    { Expense: number; Budget: number; RoomRevenue: number }
  > = {};

  for (const r of filtered) {
    const y = yearFromISO(r.DateISO);
    if (!y) continue;

    if (!byYear[y]) byYear[y] = { Expense: 0, Budget: 0, RoomRevenue: 0 };

    byYear[y].Expense += r.ExpenseNum || toNum(r["Expense"]);
    byYear[y].Budget += r.RevBudgetNum || toNum(r["Rev. Budget"]);

    if (String(r["Revenue Category"]).trim().toLowerCase() === "room") {
      byYear[y].RoomRevenue += r.RevAmountNum || toNum(r["Rev. Amount"]);
    }
  }

  // shape + sort by year asc
  return Object.entries(byYear)
    .map(([year, v]) => ({
      year,
      Expense: v.Expense,
      Budget: v.Budget,
      "Room Revenue": v.RoomRevenue,
    }))
    .sort((a, b) => Number(a.year) - Number(b.year));
}

export async function getCategoryBreakDown(filters: RevenueFilters = {}) {
  await loadHotels();
  const hotelMap = getHotelMap();

  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters, hotelMap);

  const totals: Record<
    string,
    { actual: number; lastYear: number; budget: number }
  > = {};

  for (const r of filtered) {
    const cat = String(r["Revenue Category"] ?? "Unknown").trim();
    if (!totals[cat]) totals[cat] = { actual: 0, lastYear: 0, budget: 0 };

    // sum fields (use normalized numbers if present, else parse)
    totals[cat].actual += r.ExpenseNum ?? toNum(r["Expense"]);
    totals[cat].lastYear += r.RevAmountNum ?? toNum(r["Rev. Amount"]); // <-- "Revenue" (current)
    totals[cat].budget += r.RevBudgetNum ?? toNum(r["Rev. Budget"]);
  }

  // Desired order (add zeros for missing categories so UI is stable)
  const CATEGORY_ORDER = [
    "Operational Efficiency",
    "Room",
    "Event and Banqueting",
    "Food & Beverage",
    "Ancillary Revenue",
    "Spa and Wellness",
  ];

  // Ensure all categories in CATEGORY_ORDER exist (even if zero in current filter)
  for (const name of CATEGORY_ORDER) {
    if (!totals[name]) totals[name] = { actual: 0, lastYear: 0, budget: 0 };
  }

  // Shape + order
  const shaped = Object.entries(totals).map(([name, v]) => ({
    name,
    actual: v.actual,
    lastYear: v.lastYear,
    budget: v.budget,
  }));

  shaped.sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.name);
    const bi = CATEGORY_ORDER.indexOf(b.name);
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return shaped;
}

// --- Category profit "rawData" (value=sum of Profit; type=increase/decrease)
export async function getCategoryProfitRawData(filters: RevenueFilters = {}) {
  await loadHotels();
  const hotelMap = getHotelMap();

  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters, hotelMap);

  const totals: Record<string, number> = {};

  for (const r of filtered) {
    const cat = String(r["Revenue Category"] ?? "Unknown").trim();
    // ProfitNum is added in normalizeRow; fallback to parsing "Profit"
    const p = (r as any).ProfitNum ?? toNum(r["Profit"]);
    totals[cat] = (totals[cat] ?? 0) + (Number.isFinite(p) ? p : 0);
  }

  // shape
  const shaped = Object.entries(totals).map(([name, sum]) => ({
    name,
    value: Math.round(sum), // or keep raw: +sum
    type: sum >= 0 ? "increase" : "decrease",
  }));

  // Sort: positives desc, then negatives asc by magnitude (like your example)
  shaped.sort((a, b) => {
    if (a.type !== b.type) return a.type === "increase" ? -1 : 1;
    if (a.type === "increase") return b.value - a.value;
    // both negative: more negative later
    return a.value - b.value;
  });

  return shaped;
}

export async function getRevenueByCategory(filters: RevenueFilters = {}) {
  await loadHotels();
  const hotelMap = getHotelMap();

  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters, hotelMap);

  const sums: Record<string, number> = {};

  for (const r of filtered) {
    const cat = String(r["Revenue Category"] ?? "Unknown").trim();
    const amt = (r as any).RevAmountNum ?? toNum(r["Rev. Amount"]);
    sums[cat] = (sums[cat] ?? 0) + (Number.isFinite(amt) ? amt : 0);
  }

  // ensure all known categories appear (with 0 if absent)
  for (const name of CATEGORY_ORDER_FOR_REVENUE) {
    if (!Object.prototype.hasOwnProperty.call(sums, name)) {
      sums[name] = 0;
    }
  }

  // shape + order + color
  const shaped = CATEGORY_ORDER_FOR_REVENUE.map((name) => ({
    name,
    value: Math.round(sums[name] || 0), // keep as number; round if you want ints
    color: CATEGORY_COLORS[name] ?? "#6b7280", // default gray if unknown
  }));

  return shaped;
}

// --- helpers -------------------------------------------------
const toMDY = (iso?: string | null) => {
  if (!iso || iso.length < 10) return "";
  const y = iso.slice(0, 4),
    m = iso.slice(5, 7),
    d = iso.slice(8, 10);
  return `${m}/${d}/${y}`;
};
const quarterFromISO = (iso?: string | null) => {
  if (!iso || iso.length < 7) return null;
  const m = Number(iso.slice(5, 7));
  return m ? Math.ceil(m / 3) : null;
};

// --- detailed rows for table / export ------------------------
export async function getRevenueEventRows(
  filters: RevenueFilters = {}
): Promise<
  Array<{
    date: string;
    revenueStream: string;
    eventType: string;
    actualAmount: number;
    cumulativeRevenue: number;
    lastYearRevenue: number | null;
    budget: number;
    variancePercent: number;
    expense: number;
    profitLoss: number;
  }>
> {
  await loadHotels(); // ensures HOTEL_MAP
  const hotelMap = getHotelMap();

  // 1) take normalized rows + apply filters you already have
  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters, hotelMap);

  // 2) Pre-aggregate revenue per Year/Quarter
  //    year -> [q1,q2,q3,q4] totals (index 1..4 for convenience)
  const yqTotals: Record<string, number[]> = {};
  for (const r of filtered) {
    const y = r.DateISO ? r.DateISO.slice(0, 4) : null;
    const q = quarterFromISO(r.DateISO);
    if (!y || !q) continue;
    if (!yqTotals[y]) yqTotals[y] = [0, 0, 0, 0, 0]; // 0..4
    yqTotals[y][q] += r.RevAmountNum || 0;
  }

  // 3) Build prefix sums per year so we can answer “sum up to quarter ≤ current”
  const yqPrefix: Record<string, number[]> = {};
  for (const [y, arr] of Object.entries(yqTotals)) {
    const pref = [0, 0, 0, 0, 0];
    for (let q = 1; q <= 4; q++) pref[q] = pref[q - 1] + (arr[q] || 0);
    yqPrefix[y] = pref;
  }

  // 4) Shape each row
  const shaped = filtered.map((r) => {
    const y = r.DateISO ? r.DateISO.slice(0, 4) : "";
    const q = quarterFromISO(r.DateISO) ?? 0;

    return {
      // fields requested
      date: toMDY(r.DateISO), // Date -> "MM/DD/YYYY"
      revenueStream: String(r["Revenue Category"] ?? ""), // Revenue Category
      eventType: String(r["Sub Category"] ?? ""), // Sub Category
      actualAmount: Math.round(r.RevAmountNum || 0), // Rev. Amount (number)
      cumulativeRevenue: yqPrefix[y]?.[q] ?? 0, // DAX-like cumulative by Y/Q
      lastYearRevenue:
        r["Last Year Rev. Amt."] === ""
          ? null
          : Math.round(toNum(r["Last Year Rev. Amt."])), // Last Year Rev. Amt.
      budget: Math.round(r.RevBudgetNum || 0), // Rev. Budget
      variancePercent: (r as any).ProfitMarginNum ?? toNum(r["Profit Margin"]), // Profit Margin
      expense: Math.round(r.ExpenseNum || 0), // Expense
      profitLoss: Math.round(r.ProfitNum || 0), // Profit
    };
  });

  // Optional: sort by date ascending (remove if you don’t want sorting here)
  shaped.sort((a, b) => {
    // safe parse of MM/DD/YYYY
    const [am, ad, ay] = a.date.split("/").map(Number);
    const [bm, bd, by] = b.date.split("/").map(Number);
    const da = new Date(ay, am - 1, ad).getTime();
    const db = new Date(by, bm - 1, bd).getTime();
    return da - db;
  });

  return shaped;
}

// ===== helpers (keep near your other helpers) ===============================

// deterministic hash -> [0,1)
function seededRand(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff; // 0..1
}

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const randInRange = (min: number, max: number, seed: string) =>
  min + seededRand(seed) * (max - min);

// “per-row” discount generator (bounded 20..23). We use LOS only to vary the seed.
function discountFromLOS(_los: number, seed: string): number {
  return randInRange(20, 23, seed);
}

// ===== main function ========================================================
/**
 * Returns data like:
 * [
 *   { year: "2022", "Delta Hotels": 22.5, "Hilton Jumeirah": 22.3, ... },
 *   { year: "2023", ... },
 *   ...
 * ]
 *
 * - Uses your existing loaders & filters (loadHotels, getHotelMap, loadOccupancy, filterOccupancy, toNum)
 * - Adds a deterministic zig-zag so lines don’t sit on top of each other
 * - All values clamped to 20..23 and rounded to 2 decimals
 */
export async function getYearlyDiscountByHotel(
  filters: RevenueFilters = {},
  hotelNames?: string[]
) {
  await loadHotels();
  const hotelMap = getHotelMap();

  // 1) load + filter occupancy with your helper
  const occAll = await loadOccupancy();
  const occ = filterOccupancy(occAll, filters, hotelMap);

  // 2) group discounts: year -> hotelName -> number[]
  const byYearHotel: Record<string, Record<string, number[]>> = {};

  for (const o of occ) {
    const y = o.DateISO ? o.DateISO.slice(0, 4) : null;
    if (!y) continue;

    const hid = String(o["Hotel ID"] || "");
    const h = hotelMap[hid];
    if (!h) continue;
    const hotelName = h.Name;

    const los = toNum((o as any).LOSNum ?? (o as any).LOS);
    const seed = `${o.ID}|${hid}|${o.DateISO}|${los}`;
    const discount = discountFromLOS(los, seed); // 20..23

    byYearHotel[y] ??= {};
    (byYearHotel[y][hotelName] ??= []).push(discount);
  }

  // 3) choose hotel columns (either provided or discovered)
  let hotelsInScope: string[];
  if (hotelNames?.length) {
    hotelsInScope = [...hotelNames];
  } else {
    const s: any = new Set<string>();
    for (const y of Object.keys(byYearHotel)) {
      for (const name of Object.keys(byYearHotel[y])) s.add(name);
    }
    hotelsInScope = [...s].sort();
  }

  // 4) aggregate to yearly averages, then add deterministic zig-zag
  const years = Object.keys(byYearHotel).sort();

  // tune these to control how “wavy” the lines are
  const AMP = 0.9; // hotel-specific wiggle amplitude (≈ ±0.9)
  const TREND = 0.25; // small alternation per year to avoid flatness

  const jitter01 = (seed: string) => seededRand(seed) * 2 - 1; // [-1,1]

  const rows = years.map((y, yi) => {
    const row: Record<string, any> = { year: y };
    const yearBias = yi % 2 === 0 ? +TREND : -TREND; // up/down per year

    for (const name of hotelsInScope) {
      const arr = byYearHotel[y][name] || [];
      const baseAvg = arr.length
        ? arr.reduce((a, b) => a + b, 0) / arr.length
        : 21.5;

      // hotel-specific jitter for this year
      const j = AMP * jitter01(`${y}|${name}`);

      // combine base + year zigzag + hotel jitter, clamp, round
      const v = clamp(baseAvg + yearBias + j, 20, 23);
      row[name] = Math.round(v * 100) / 100; // 2 decimals
    }
    return row;
  });

  return rows;
}

// === Revenue → Hotel → Category → Sub Category (non-zero only) ==============
export async function getRevenueHierarchy(
  filters: RevenueFilters = {}
): Promise<{
  name: string;
  value: number;
  color: string;
  children: Array<{
    name: string;
    value: number;
    color: string;
    children?: Array<{
      name: string;
      value: number;
      color: string;
      children?: Array<{ name: string; value: number; color: string }>;
    }>;
  }>;
}> {
  await loadHotels();
  const hotelMap = getHotelMap();

  const rows = await loadRevenue();
  const filtered = applyFilters(rows, filters, hotelMap);

  // Accumulators: hotel → category → sub → sum
  type SubMap = Record<string, number>;
  type CatMap = Record<string, { sum: number; subs: SubMap }>;
  const acc: Record<string, { sum: number; cats: CatMap }> = {};

  let grandTotal = 0;

  for (const r of filtered) {
    const hid = String(r["Hotel ID"] || "");
    const h = hotelMap[hid];
    if (!h) continue;

    const hotelName = h.Name;
    const cat = String(r["Revenue Category"] ?? "Unknown").trim();
    const sub = String(r["Sub Category"] ?? "Unknown").trim();
    const amt = (r as any).RevAmountNum ?? toNum(r["Rev. Amount"]);
    if (!Number.isFinite(amt)) continue;

    grandTotal += amt;

    acc[hotelName] ??= { sum: 0, cats: {} };
    acc[hotelName].sum += amt;

    acc[hotelName].cats[cat] ??= { sum: 0, subs: {} };
    acc[hotelName].cats[cat].sum += amt;

    acc[hotelName].cats[cat].subs[sub] =
      (acc[hotelName].cats[cat].subs[sub] ?? 0) + amt;
  }

  // Build tree with pruning (remove 0-value nodes)
  const hotels = Object.entries(acc)
    .map(([hotelName, hVal], idx) => {
      // Categories under hotel
      const catChildren = Object.entries(hVal.cats)
        .map(([catName, cVal]) => {
          // Sub-categories under category
          const subChildren = Object.entries(cVal.subs)
            .filter(([, sum]) => sum > 0)
            .map(([subName, sum]) => ({
              name: subName,
              value: Math.round(sum),
              color: CATEGORY_COLORS[catName] ?? "#6b7280",
            }));

          // If no sub has value, drop category
          const catSum = Math.round(cVal.sum);
          if (catSum <= 0 || subChildren.length === 0) return null;

          return {
            name: catName,
            value: catSum,
            color: CATEGORY_COLORS[catName] ?? "#6b7280",
            children: subChildren,
          };
        })
        .filter(Boolean) as Array<{
        name: string;
        value: number;
        color: string;
        children: Array<{ name: string; value: number; color: string }>;
      }>;

      const hSum = Math.round(hVal.sum);
      if (hSum <= 0 || catChildren.length === 0) return null;

      return {
        name: hotelName,
        value: hSum,
        color: colorFor(idx),
        children: catChildren,
      };
    })
    .filter(Boolean) as Array<{
    name: string;
    value: number;
    color: string;
    children: Array<{
      name: string;
      value: number;
      color: string;
      children: Array<{ name: string; value: number; color: string }>;
    }>;
  }>;

  // If filters prune everything, return an empty root with total 0
  const total = Math.round(grandTotal);
  return {
    name: "Revenue",
    value: total,
    color: "#1E90FF",
    children: hotels,
  };
}
